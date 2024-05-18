exports.parseFilterParams = async (req, res, next) => {
  let { page = 1, limit = 10, skip = 0, sort = null, get_all, order_type, order_by } = req.query

  if(get_all) {
    limit = null
  } else {
    skip = (page -1) * limit
  }

  if(order_by) {
    sort[`${order_by}`] = order_type === 'desc' ? -1 : 1
  }

  req.parsedFilterParams = {
    query: {},
    skip,
    limit,
    sort,
    projection: {},
  }
  next()
}

exports.adminValidation = async (req, res, next) => {
  const { user_type } = req.user

  if(user_type !== 'ADMIN') {
    return res.status(409).json({ 
      message: 'Invalid Access!',
      error_code: 'INVALID_ACCESS'
    })
  }

  next()
}

exports.schemaValidation = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body)
    if (error) {
      return res.status(400).json({ 
        message: error.details[0].message.replace(/[\\"]/g, '')
      })
    }
    next()
  }
}
