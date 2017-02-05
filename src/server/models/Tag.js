'use strict'

let mongoose = require('mongoose')
let requiredValidationMessage = '{PATH} is required'

let tagSchema = mongoose.Schema({
  name: { type: String, required: requiredValidationMessage, unique: true },
  messages: [ { type: mongoose.Schema.Types.ObjectId, ref: 'Tweet' } ]
})

let Tag = mongoose.model('Tag', tagSchema)

module.exports.seedTags = () => {
  Tag.find({}).then(tags => {
    // console.log(tags.length)
  })
}
