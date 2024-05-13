const { DataTypes } = require('sequelize')
const { sequelize } = require('../database/connection')

const UsersModel = sequelize.define('Users', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
    },
    user_type: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    department: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    salary: {
        type: DataTypes.INTEGER,
        allowNull: true,
    }
}, {
    tableName: 'users',
    timestamps: true
})

module.exports = UsersModel
