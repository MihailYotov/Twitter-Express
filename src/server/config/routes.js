'use strict'

let controllers = require('../controllers')
let auth = require('./auth')

module.exports = (app) => {
  // Home
  app.get('/', controllers.tweets.index)

  // Users
  app.get('/users/register', controllers.users.register)
  app.post('/users/create', controllers.users.create)
  app.get('/users/login', controllers.users.login)
  app.post('/users/authenticate', controllers.users.authenticate)
  app.post('/users/logout', controllers.users.logout)
  app.get('/users/all', auth.isInRole('Admin'), controllers.users.getAll)
  app.get('/profile/:id', auth.isAuthenticated, controllers.users.details)
  app.get('/admins/all', auth.isInRole('Admin'), controllers.users.getAllAdmins)
  app.get('/admins/add/:id', auth.isInRole('Admin'), controllers.users.addAdmin)

  // Tweets
  app.get('/tweet', auth.isAuthenticated, controllers.tweets.create)
  app.post('/tweet', auth.isAuthenticated, controllers.tweets.save)
  app.get('/tweet/:id', controllers.tweets.details)

  // Tags
  app.get('/tag/all', controllers.tags.getAll)
  app.get('/tag/:id', controllers.tags.tweets)

}
