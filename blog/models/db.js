var settings = require('../settings');
var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/runoob';
module.exports = new MongoClient(settings.host, "27017");