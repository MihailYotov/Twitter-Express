'use strict'

let mongoose = require('mongoose')
let encryption = require('../utilities/encryption')
let requiredValidationMessage = '{PATH} is required'

let userSchema = mongoose.Schema({
  username: { type: String, required: requiredValidationMessage, unique: true },
  firstName: { type: String, required: requiredValidationMessage },
  lastName: { type: String, required: requiredValidationMessage },
  salt: String,
  hashedPass: String,
  roles: [String],
  tweets: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tweet' }]
})

userSchema.method({
  authenticate: function (password) {
    let inputHashedPassword = encryption.generateHashedPassword(this.salt, password)
    if (inputHashedPassword === this.hashedPass) {
      return true
    } else {
      return false
    }
  }
})

let User = mongoose.model('User', userSchema)

module.exports.seedAdminUser = () => {
  User.find({}).then(users => {
    if (users.length === 0) {
      let salt = encryption.generateSalt()
      let hashedPass = encryption.generateHashedPassword(salt, 'admin123')

      User.create({
        username: 'admin',
        firstName: 'Master',
        lastName: 'Admin',
        salt: salt,
        hashedPass: hashedPass,
        roles: ['Normal', 'Admin']
      })
    }
  })
}
