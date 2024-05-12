const { signUp, logIn, getEmployees, insertEmployees, updateEmployee, logOut } = require('../controller/users-controller')
const { validateAccessToken } = require('../middleware/auth-middleware')
const { parseFilterParams, adminValidation, schemaValidation } = require('../middleware/custom-validation')
const { signupSchema, loginSchema, insertEmployeeSchema, listEmployeeSchema, updateEmployeeSchema } = require('../middleware/joi-validation')

const router = require('express').Router()

router.post('/signup',
  [
    schemaValidation(signupSchema)
  ],
  signUp
)

router.post('/login',
  [
    schemaValidation(loginSchema)
  ],
  logIn
)

router.post('/logout',
  [
    validateAccessToken,
  ],
  logOut
)

router.post('/employees',
  [
    validateAccessToken,
    adminValidation,
    schemaValidation(insertEmployeeSchema)
  ],
  insertEmployees
)

router.get('/employees',
  [
    validateAccessToken,
    adminValidation,
    schemaValidation(listEmployeeSchema),
    parseFilterParams,
  ],
  getEmployees
)

router.patch('/employees/:id',
  [
    validateAccessToken,
    adminValidation,
    schemaValidation(updateEmployeeSchema),
  ],
  updateEmployee
)

module.exports = router