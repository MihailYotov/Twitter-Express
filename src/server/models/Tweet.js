'use strict'

let mongoose = require('mongoose')
let requiredValidationMessage = '{PATH} is required'

let tweetSchema = mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  message: { type: String, required: requiredValidationMessage },
  tags: [String],
  creationDate: { type: Date, default: Date.now }
})

let Tweet = mongoose.model('Tweet', tweetSchema)

module.exports.seedTweets = () => {
  Tweet.find({}).then(tweets => {
    // console.log(tweets.length)
  })
}
