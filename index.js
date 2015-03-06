var mongoose = require('mongoose');
var normalizeUrl = require('normalizeurl');

function Url(path, options) {
	mongoose.SchemaTypes.String.call(this, path, options);

	function validateUrl(val) {
		var urlRegexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
		return urlRegexp.test(val);
	}
	this.validate(validateUrl, 'url is invalid');
}

Url.prototype.__proto__ = mongoose.SchemaTypes.String.prototype;

Url.prototype.cast = function (val) {
	return normalizeUrl(val);
};

mongoose.SchemaTypes.Url = module.exports = Url;
mongoose.Types.Url = String;
