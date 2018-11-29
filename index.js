var mongoose = require('mongoose')
var normalizeUrl = require('normalize-url')

var regUrl = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/

function validateUrl (val) {
  return regUrl.test(val)
}

function Url (path, options) {
  mongoose.SchemaTypes.String.call(this, path, options)
  this.validate(validateUrl, 'url is invalid')
}

Object.setPrototypeOf(Url.prototype, mongoose.SchemaTypes.String.prototype)

Url.prototype.cast = function (val) {
  return normalizeUrl(val)
}

mongoose.SchemaTypes.Url = module.exports = Url
mongoose.Types.Url = String
