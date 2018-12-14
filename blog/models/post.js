var settings = require('../settings');
var MongoClient = require('mongodb').MongoClient;
var url = settings.url;

function Post(name,title,post){
    this.name = name;
    this.title = title;
    this.post = post;
}

module.exports = Post;
//存储一篇文章及其相关信息
Post.prototype.save = function(callback){
    var date = new Date();
    //存储各种时间格式，方便以后扩展
    var time = {
        date:date,
        year:date.getFullYear(),
        month:date.getFullYear() + '-' + (date.getMonth() + 1),
        day:date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate(),
        minute:date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + " " + date.getHours() + ":" + date.getMilliseconds()
    }
    // 要存入数据库的文档
    var post = {
        name:this.name,
        time:time,
        title:this.title,
        post:this.post
    }
    //连接数据库
    MongoClient.connect(url,function(err,db){
        if(err){
            db.close();
            return callback(err);
        }
        var dbase = db.db("blog");
        dbase.collection("posts").insertOne(post,function(err, result) {
            if (err) callback(err);
            if(result){
                callback(null,post);
            }
            db.close();
        });
    })
}
//读取文章及其相关信息
Post.get = function(name,callback){
    //连接数据库
    MongoClient.connect(url, function(err, db) {
        if(err){
            return callback(err);
        }
        var dbo = db.db("blog");
        var query = {};
        if(name){
            query.name = name;
        }
        //根据query对象查询文章
        dbo.collection("posts").find(query).sort({time:-1}).toArray(function(err,result){
            if(result){
                return callback(null,result);
            }
            callback(err);//失败返回err信息
            db.close();
        })
    });
}