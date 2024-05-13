const Joi = require('joi')

const signupSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.number().required(),
  password: Joi.string().required().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
    .message('Password must be at least 8 characters contain one uppercase letter,one number and one special character.'),
  confirm_password: Joi.string().required().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
    .message('Password must be at least 8 characters contain one uppercase letter,one number and one special character.'),
  user_type: Joi.string().valid('ADMIN', 'EMPLOYEE').required()
})

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
})

const updateProfileSchema = Joi.object({
  name: Joi.string(),
  email: Joi.string().email(),
  phone: Joi.number(),
})

const insertEmployeeSchema = Joi.array().items({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  department: Joi.string().required(),
  salary: Joi.number().required(),
}).single()

const updateEmployeeSchema = Joi.object({
  name: Joi.string(),
  email: Joi.string().email(),
  department: Joi.string(),
  salary: Joi.number(),
})

const listEmployeeSchema = Joi.object({
  limit: Joi.number().integer().min(1).max(100),
  page: Joi.number().integer().min(1)
})

module.exports = {
  signupSchema,
  loginSchema,
  updateProfileSchema,
  insertEmployeeSchema,
  updateEmployeeSchema,
  listEmployeeSchema,
}
