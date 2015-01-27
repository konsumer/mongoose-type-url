var expect = require('chai').expect;
var mongoose = require('mongoose');
require('../');

require('mockgoose')(mongoose);

var UserSimple = mongoose.model('UserSimple', new mongoose.Schema({
	url: mongoose.SchemaTypes.Url
}));

var UserRequired = mongoose.model('UserRequired', new mongoose.Schema({
	url: {type: mongoose.SchemaTypes.Url, required: true}
}));

var UserNested = mongoose.model('UserNested', new mongoose.Schema({
	url: {
		work: {type: mongoose.SchemaTypes.Url, required: true},
		profile: {type: mongoose.SchemaTypes.Url, required: true}
	}
}));

describe('mongoose-type-url', function(){
	before(function(done){
		mongoose.connect('mongodb://localhost/test');
		mongoose.connection.on('error', function(){});
		mongoose.connection.once('open', done);
	});

	after(function(){
		mongoose.connection.close();
	});

	it('should enable basic url field-type in schema', function(done){
		var user =  new UserSimple();
		user.save(done);
	});

	it('should require url', function(done){
		var user =  new UserRequired();
		user.validate(function(err){
			expect(err.errors.url.message).to.equal('Path `url` is required.');
			done();
		});
	});

	it('should enable nested required url', function(done){
		var user =  new UserNested();
		user.validate(function(err){
			expect(err.errors['url.work'].message).to.equal('Path `url.work` is required.');
			expect(err.errors['url.profile'].message).to.equal('Path `url.profile` is required.');
			done();
		});
	});
});