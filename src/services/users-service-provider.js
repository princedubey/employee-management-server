const UsersModel = require('../model/users-model')

class UsersServiceProvider {
  async getUsers({ query = {}, sort = null, limit = null, skip, projection = {} }) {
    return UsersModel.findAll({
      where: query,
      attributes: {exclude: ['password', ...Object.keys(projection)]},
      order: sort ? [sort.split(' ')] : null,
      offset: skip,
      limit: limit,
      raw: true, //It will send us only real data without extra processing
    })
  }

  async getUserById(userId) {
    return UsersModel.findByPk(userId, {
      attributes: { exclude: ['password'] },
      raw: true
    })
  }  

  async getUserByEmail(email) {
    return UsersModel.findOne({ 
      where: { email },
      raw: true
    })
  }

  async signUp(userDetails) {
    return UsersModel.create(userDetails)
  }

  async insertUsers(users) {
    return UsersModel.bulkCreate(users)
  }

  async updateUser(userId, updatedData) {
    return UsersModel.update(updatedData, { where: { id: userId } })
  }
}

module.exports = new UsersServiceProvider()
