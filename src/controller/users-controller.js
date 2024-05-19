const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const usersServiceProvider = require('../services/users-service-provider')
const CsvParser = require('json2csv').Parser

exports.signUp = async (req, res, next) => {
  try {
    let { email, password, confirm_password, name, user_type } = req.body

    const isUserAlreadyExist = await usersServiceProvider.getUserByEmail(email)
    if (isUserAlreadyExist) {
      return res.status(409).json({
        success: false,
        message: "Email already exists!" 
      })
    }

    if (password !== confirm_password) {
      return res.status(409).json({ 
        success: false,
        message: "Password must be same for verification" 
      })
    }
    const hash = await bcrypt.hashSync(password, 10)

    const newUser = {
      email,
      name,
      user_type,
      password: hash,
    }

    const userRegistered = await usersServiceProvider.signUp(newUser)
    delete userRegistered.password

    return res.status(200).json({
      message: 'User registered successfully.',
      data: userRegistered
    })

  } catch (error) {
    next(error)
  }
}

exports.logIn = async (req, res, next) => {
  try {
    const { email, password } = req.body

    let user = await usersServiceProvider.getUserByEmail(email)

    if (!user) {
      return res.status(401).json({
        message: "Invalid Credentials",
        error_code: "INVALID_CREDENTIALS"
      })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid Credentials",
        error_code: "INVALID_CREDENTIALS"
      })
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '10m' });
    user.access_token = token

    await usersServiceProvider.updateUser(user.id, {access_token: token})

    return res.status(200).json({
      success: true,
      message: 'User Logged in successfully.',
      data: user,
    })

  } catch (error) {
    next(error)
  }
}

exports.logOut = async (req, res, next) => {
  try {
    req.user.access_token = null
    await usersServiceProvider.updateUser(req.user.id, {access_token: null})

    return res.status(200).json({
      success: true,
      message: 'User logged out successfully.',
    });
  } catch (error) {
    next(error)
  }
}

exports.insertEmployees = async (req, res, next) => {
  try {
    const employees = req.body
    employees.forEach(elm => {
      return elm.user_type = 'EMPLOYEE'
    })
    await usersServiceProvider.insertUsers(employees)

    return res.status(200).json({
      success: true,
      message: 'Employee added successfully.',
    })

  } catch (error) {
    next(error)
  }
}

exports.updateEmployee = async (req, res, next) => {
  try {
    const employeeId = req.params.id
    const employeeDetail = req.body

    await usersServiceProvider.updateUser(employeeId, employeeDetail)

    return res.status(200).json({
      success: true,
      message: 'User Updated successfully.',
    })

  } catch (error) {
    next(error)
  }
}

exports.getEmployees = async (req, res, next) => {
  try {
    const { query, skip, limit, sort, projection } = req.parsedFilterParams

    query.user_type = 'EMPLOYEE'
    let users = await usersServiceProvider.getUsers({query, skip, limit, sort, projection})

    return res.status(200).json({
      success: true,
      message: 'Employees Fetched successfully.',
      data: users,
    })

  } catch (error) {
    next(error)
  }
}

exports.exportCsvEmployees = async (req, res, next) => {
  try {
    const { query, skip, limit, sort, projection } = req.parsedFilterParams

    const formattedUsers = []
    let users = await usersServiceProvider.getUsers({query, skip, limit, sort, projection})

    users.forEach(user => {
      formattedUsers.push({
        id: user.id,
        user_type: user.user_type,
        email: user.email,
        name: user.name,
        department: user.department,
        salary: user.salary
      })
    })

    const csvField = ['Id', 'User Type', 'Email', 'Name', 'Department', 'Salary (Rs)']
    const csvParser = new CsvParser({ csvField })
    const csvData = csvParser.parse(formattedUsers.length ? formattedUsers : [{}])

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment: filename=employees.csv');

    return res.status(200).end(csvData)

  } catch (error) {
    next(error)
  }
}
