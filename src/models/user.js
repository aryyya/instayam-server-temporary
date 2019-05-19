const Sequelize = require('sequelize')
const { hashSync } = require('bcrypt')

module.exports = (sequelize, {
  STRING
}) => {
  const User = sequelize.define('User', {
    email: {
      type: STRING,
      allowNull: false
    },
    username: {
      type: STRING,
      allowNull: false
    },
    full_name: {
      type: STRING,
      allowNull: true
    },
    password_hash: {
      type: STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'user'
  })
  
  User.sync({ force: true })
    .then(() => {
      User.create({ email: 'admin@example.com', username: 'admin', full_name: 'The Admin', password_hash: hashSync('admin', 10) })
      User.create({ email: 'guest@example.com', username: 'guest', full_name: 'The Guest', password_hash: hashSync('guest', 10) })
    })  

  return User
}