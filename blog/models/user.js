var settings = require('../settings');
var MongoClient = require('mongodb').MongoClient;
var url = settings.url;
function User(user){
    this.name = user.name;
    this.password = user.password;
    this.email = user.email;
}
module.exports = User;
//存储用户信息
User.prototype.save = function(callback){
    var user = {
        name:this.name,
        password:this.password,
        email:this.email
    };
    MongoClient.connect(url,function(err,db){
        if(err){
            db.close();
            return callback(err);
        }
        var dbase = db.db("blog");
        dbase.collection("users").insertOne(user,function(err, result) {
            if (err) callback(err);
            console.log("文档插入成功",result.result);
            if(result){
                callback(null,user);
            }
            db.close();
        });
    })
}
//读取用户信息
User.get = function(name,callback){
    //打开数据库
    MongoClient.connect(url, function(err, db) {
        if(err){
            return callback(err);
        }
        var dbo = db.db("blog");
        dbo.collection("users").find({name:name}).toArray(function(err,result){
            if(result){
                console.log('我是res，哈哈',result);
                return callback(null,result[0]);
            }
            callback(err);//失败返回err信息
            db.close();
        })
    });
}