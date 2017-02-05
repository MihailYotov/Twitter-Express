'use strict'

let path = require('path')
let rootPath = path.normalize(path.join(__dirname, '/../../'))

module.exports = {
  dev: {
    rootPath: rootPath,
    db: 'mongodb://localhost:27017/tweeter',
    port: 8080
  }
}
