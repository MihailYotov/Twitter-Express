'use strict'

let encryption = require('../utilities/encryption')
let User = require('mongoose').model('User')

module.exports = {
  register: (req, res) => {
    res.render('users/register')
  },
  create: (req, res) => {
    let user = req.body

    if (user.password !== user.confirmPassword) {
      user.globalError = 'Passwords do not match!'
      res.render('users/register', user)
    } else {
      user.salt = encryption.generateSalt()
      user.hashedPass = encryption.generateHashedPassword(user.salt, user.password)
      user.roles = user.roles || []
      user.roles.push('normal')

      User
        .create(user)
        .then(user => {
          req.logIn(user, (err, user) => {
            if (err) {
              res.render('users/register', { globalError: 'Ooops 500' })
              return
            }

            res.redirect('/')
          })
        })
    }
  },
  login: (req, res) => {
    res.render('users/login')
  },
  authenticate: (req, res) => {
    let inputUser = req.body

    User
      .findOne({ username: inputUser.username })
      .then(user => {
        if (!user.authenticate(inputUser.password)) {
          res.render('users/login', { globalError: 'Invalid username or password' })
        } else {
          req.logIn(user, (err, user) => {
            if (err) {
              res.render('users/login', { globalError: 'Something went wrong!' })
              return
            }
            res.redirect('/')
          })
        }
      })
  },
  logout: (req, res) => {
    req.logout()
    console.log('Logged out.')
    res.redirect('/')
  },
  getAll: (req, res) => {
    User.find({}).then((users) => {
      res.render('users/all', { users: users })
    })
  },
  details: (req, res) => {
    User.findOne({ username: req.params.id }).populate({
      path: 'tweets',
      select: ('message'),
      options: { limit: 100 }
    }).then((user) => {
      res.render('users/details', { user: user })
    })
  },
  getAllAdmins: (req, res) => {
    User.find({ roles: 'Admin' }).then((users) => {
      res.render('users/all', { users: users })
    })
  },
  addAdmin: (req, res) => {
    User.findOne({ username: req.params.id }).then((users) => {
      let index = users.roles.indexOf('Admin')
      if (index < 0) {
        users.roles.push('Admin')
        users.save()
        res.redirect('/users/all')
      } else {
        users.roles.splice(index, 1)
        users.save()
        res.redirect('/users/all')
      }
    })
  }
}
