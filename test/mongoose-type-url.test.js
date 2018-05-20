/* global describe, it, expect */
require('mockingoose')
const mongoose = require('mongoose')
require('../')

const UserSimple = mongoose.model('UserSimple', new mongoose.Schema({
  url: mongoose.SchemaTypes.Url
}))

const UserRequired = mongoose.model('UserRequired', new mongoose.Schema({
  url: {type: mongoose.SchemaTypes.Url, required: true}
}))

const UserNested = mongoose.model('UserNested', new mongoose.Schema({
  url: {
    work: {type: mongoose.SchemaTypes.Url, required: true},
    profile: {type: mongoose.SchemaTypes.Url, required: true}
  }
}))

describe('mongoose-type-url', function () {
  it('should enable basic url field-type in schema', function (done) {
    var user = new UserSimple()
    user.save(done)
  })

  it('should require url', function (done) {
    var user = new UserRequired()
    user.validate(function (err) {
      expect(err.errors.url.message).toEqual('Path `url` is required.')
      done()
    })
  })

  it('should enable nested required url', function (done) {
    var user = new UserNested()
    user.validate(function (err) {
      expect(err.errors['url.work'].message).toEqual('Path `url.work` is required.')
      expect(err.errors['url.profile'].message).toEqual('Path `url.profile` is required.')
      done()
    })
  })
})
