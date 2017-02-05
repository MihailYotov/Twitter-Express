'use strict'

let Tag = require('mongoose').model('Tag')

module.exports = {
  getAll: (req, res) => {
    Tag.find({}).then((tags) => {
      res.render('tags/index', { tags: tags })
    })
  },
  tweets: (req, res) => {
    Tag.findOne({ name: req.params.id }).populate({
      path: 'messages',
      select: ('message'),
      options: { limit: 100 }
    }).then((tag) => {
      res.render('tags/messages', { tag: tag })
    })
  }
}
