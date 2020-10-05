var mongoose = require('mongoose')
var normalizeUrl = require('normalize-url')

var regUrl = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/

function validateUrl (val, options) {
  var required = (typeof options.required === 'function') ? options.required() : options.required
  if ((!val || val === '') && !required) {
    return true
  }
  return regUrl.test(val)
}

function Url (path, options) {
  this.options = options
  this.path = path
  mongoose.SchemaTypes.String.call(this, path, options)
  this.validate(function (val) { return validateUrl(val, options) }, options.message || Url.defaults.message || 'url is invalid')
}

Url.defaults = {}

Object.setPrototypeOf(Url.prototype, mongoose.SchemaTypes.String.prototype)

Url.prototype.cast = function (val) {
  return val !== '' ? normalizeUrl(val) : ''
}

Url.prototype.get = function (val) {
  return val !== '' ? normalizeUrl(val) : ''
}

Url.prototype.checkRequired = function (val) {
  return typeof val === 'string' && validateUrl(val, this.options)
}

mongoose.SchemaTypes.Url = module.exports = Url
mongoose.Types.Url = String
