const {
  hash,
  compare
} = require('bcrypt')
const getBaseModel = require('../helpers/get-base-model')

const name = 'User'
const tableName = 'users'
const selectableProps = [
  'id',
  'username',
  'email',
  'created_at',
  'updated_at'
]

// error constants
const NOT_FOUND = 'user/not-found'
const INVALID_CREDENTIALS = 'user/invalid-credentials'

module.exports = knex => {
  const baseModel = getBaseModel({
    knex,
    name,
    tableName,
    selectableProps
  })

  const create = async ({
    email,
    username,
    password,
    fullName
  }) => {
    const user = await baseModel.create({
      email,
      username,
      passwordHash: await hash(password, 10),
      fullName
    })
    return user
  }

  const verify = async ({
    username,
    password
  }) => {
    const user = await knex(tableName)
      .select()
      .first()
      .where({ username })
      .timeout(baseModel.timeout)

    if (!user) {
      return NOT_FOUND
    }

    if (!await compare(password, user.passwordHash)) {
      return INVALID_CREDENTIALS
    }

    return user
  }

  return {
    ...baseModel,

    // error constants
    NOT_FOUND,
    INVALID_CREDENTIALS,

    // methods
    create,
    verify
  }
}
