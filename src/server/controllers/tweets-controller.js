'use strict'

let Tweet = require('mongoose').model('Tweet')
let Tag = require('mongoose').model('Tag')
let User = require('mongoose').model('User')

module.exports = {
  index: (req, res) => {
    Tweet.find({}).sort({ creationDate: 'desc' }).limit(100).then((tweets) => {
      res.render('tweets/index', { tweets: tweets })
    })
  },
  details: (req, res) => {
    Tweet.findOne({ _id: req.params.id }).populate({
      path: 'user',
      select: ('username')
    }).then((tweet) => {
      res.render('tweets/details', { tweet: tweet })
    })
  },
  create: (req, res) => {
    res.render('tweets/create')
  },
  save: (req, res) => {
    if (req.body && req.body.message && req.body.message.length) {
      if (req.body.message.length > 140) {
        res.render('tweets/create', {
          globalError: 'Message can`t be bigger than 140 symbols.',
          message: req.body.message
        })
      } else {
        let tags = parseTags(req.body.message)
        req.body.user = req.user
        req.body.tags = tags
        let tweet = new Tweet(req.body)
        tweet.save(tweet).then(function (tweet) {
          tweet.tags.forEach(function (tag) {
            createOrUpdateTag(tag, tweet)
          })
          req.user.tweets = req.user.tweets || []
          req.user.tweets.push(tweet)
          req.user.save()

          let users = parseUsers(req.body.message)
          users.forEach(function (user) {
            updateUserTweets(user, tweet)
          })

          res.status(201)
          res.redirect('/')
        })
      }
    } else {
      res.render('tweets/create', { globalError: 'All fields are mandatory' })
    }
  }
}

function parseTags (message) {
  let hashTags = message.match(/#\w+/g)
  let tags = []
  if (hashTags && hashTags.length) {
    for (let i = 0; i < hashTags.length; i++) {
      let tag = hashTags[ i ].slice(1).toLocaleLowerCase()
      if (tags.indexOf(tag) < 0) {
        tags.push(tag)
      }
    }

    return tags
  }
}

function parseUsers (message) {
  let hashTags = message.match(/@\w+/g)
  let users = []
  if (hashTags && hashTags.length) {
    for (let i = 0; i < hashTags.length; i++) {
      let user = hashTags[ i ].slice(1).toLocaleLowerCase()
      if (users.indexOf(user) < 0) {
        users.push(user)
      }
    }

    return users
  }
}

function createOrUpdateTag (tagName, tweet) {
  Tag.findOne({ name: tagName }).then(tag => {
    if (!tag) {
      Tag.create({
        name: tagName
      }).then(function (tag) {
        tag.messages = tag.messages || []
        tag.messages.push(tweet)
        tag.save()
      })
    } else {
      tag.messages = tag.messages || []
      tag.messages.push(tweet)
      tag.save()
    }
  })
}

function updateUserTweets (user, tweet) {
  User.findOne({ username: user }).then(user => {
    user.tweets = user.tweets || []
    user.tweets.push(tweet)
    user.save()
  })
}
