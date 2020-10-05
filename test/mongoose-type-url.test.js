/* global describe, it, expect */
require('mockingoose')
const mongoose = require('mongoose')
require('../')

const UserSimple = mongoose.model('UserSimple', new mongoose.Schema({
  url: mongoose.SchemaTypes.Url
}))

const UserRequired = mongoose.model('UserRequired', new mongoose.Schema({
  url: { type: mongoose.SchemaTypes.Url, required: true }
}))

const UserNested = mongoose.model('UserNested', new mongoose.Schema({
  url: {
    work: { type: mongoose.SchemaTypes.Url, required: true },
    profile: { type: mongoose.SchemaTypes.Url, required: true }
  }
}))

const UserString = mongoose.model('UserString', new mongoose.Schema({
  url: { type: String, required: true }
}))

describe('mongoose-type-url', function () {
  // test so we can see if this field-type works like String
  it('String should fail with no value', function (done) {
    var user = new UserString()
    user.validate(function (err) {
      expect(err.errors.url.message).toEqual('Path `url` is required.')
      done()
    })
  })

  it('String should fail on blank', function (done) {
    var user = new UserString()
    user.url = ''
    user.validate(function (err) {
      expect(err.errors.url.message).toEqual('Path `url` is required.')
      done()
    })
  })

  it('should enable basic url field-type in schema (not required)', function (done) {
    var user = new UserSimple()
    user.save(done)
  })

  it('should enable basic url field-type in schema (not required, blank)', function (done) {
    var user = new UserSimple()
    user.url = ''
    user.save(done)
  })

  it('should require url', function (done) {
    var user = new UserRequired()
    user.validate(function (err) {
      expect(err.errors.url.message).toEqual('Path `url` is required.')
      done()
    })
  })

  it('invalid URL on non-required should fail', function (done) {
    var user = new UserSimple()
    user.url = 'not a url'
    user.validate(function (err) {
      expect(err.errors.url.message).toEqual('Cast to String failed for value "not a url" at path "url"')
      done()
    })
  })

  it('blank on required should fail', function (done) {
    var user = new UserRequired()
    user.validate(function (err) {
      expect(err.errors.url.message).toEqual('Path `url` is required.')
      user.url = ''
      user.validate(function (err) {
        expect(err.errors.url.message).toEqual('Path `url` is required.')
        done()
      })
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
