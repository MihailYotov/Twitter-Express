let homeController = require('./home-controller')
let userController = require('./users-controller')
let tweetController = require('./tweets-controller')
let tagController = require('./tags-controller')

module.exports = {
  home: homeController,
  users: userController,
  tweets: tweetController,
  tags: tagController
}
