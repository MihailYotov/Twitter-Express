'use strict'

let express = require('express')
let stylus = require('stylus')
let cookieParser = require('cookie-parser')
let bodyParser = require('body-parser')
let session = require('express-session')
let passport = require('passport')

module.exports = (config, app) => {
  // Converts the HTML
  app.set('view engine', 'pug')
  app.set('views', config.rootPath + 'server/views')

  // Converts the CSS
  app.use(stylus.middleware({
    src: config.rootPath + 'server\\styles',
    dest: config.rootPath + 'public\\css'
  }))

  // Set the parsers
  app.use(cookieParser())
  app.use(bodyParser.urlencoded({ extended: true }))
  app.use(session({
    secret: '!MnooSecret@',
    resave: true,
    saveUninitialized: true
  }))
  app.use(passport.initialize())
  app.use(passport.session())
  app.use((req, res, next) => {
    if (req.user) {
      res.locals.currentUser = req.user
    }

    next()
  })

  // Sets the public folder
  app.use(express.static(config.rootPath + 'public'))
}
