const jwt = require('jsonwebtoken')
const usersServiceProvider = require('../services/users-service-provider')

exports.validateAccessToken = async (req, res, next) => {
  try {
    const accessToken = req.headers.authorization
    if (!accessToken) {
      return res.status(406).json({ 
        message: 'Invalid Access Token!',
        error_code: 'INVALID_ACCESS_TOKEN'
      })
    }
  
    jwt.verify(accessToken, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(406).json({ 
          message: 'Invalid Access Token!',
          error_code: 'INVALID_ACCESS_TOKEN'
        })
      }
      req.user = decoded
    })

    console.log(accessToken)

    const userId = req.user.id
    const user = await usersServiceProvider.getUserById(userId)
    if (accessToken !== user.access_token) {
      return res.status(406).json({ 
        message: 'Invalid Access Token!',
        error_code: 'INVALID_ACCESS_TOKEN'
      })
    }

    req.user = user

    next()
  } catch (error) {
    throw next(error)
  }
}
