'use strict'

let mongoose = require('mongoose')
mongoose.Promise = global.Promise

module.exports = (config) => {
  mongoose.connect(config.db)

  let db = mongoose.connection

  db.once('open', err => {
      if (err) {
        console.log(err)

        console.log(`Mongoose is listening on port 27017.`)
      }
    }
  )

  db.on('error', err => {
    console.log('Database error:', err)
  })

  require('../models/User').seedAdminUser()
  require('../models/Tweet').seedTweets()
  require('../models/Tag')
}
