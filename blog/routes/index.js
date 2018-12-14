var crypto = require('crypto');
var User = require('../models/user');
var Post = require('../models/post');
module.exports = function(app){
    //主页
    app.get('/',function(req,res){
        var name = null;
        if(req.session.user){
            name = req.session.user.name
        }
        Post.get(name,function(err,posts){
            if(err){
                ports = [];
            }
            res.render('index',{
                title:'主页',
                user:req.session.user,
                success:req.flash('success').toString(),
                posts:posts,
                error:req.flash('error').toString()
            })
        })
    })
    //注册
    //app.get('/reg',checkLogin);
    app.get('/reg',function(req,res){
        res.render('reg',{
            title:'注册',
            user:req.session.user,
            success:req.flash('success').toString(),
            error:req.flash('error').toString()
        })
    })
    //提交注册
    app.post('/reg', checkNotLogin);
    app.post('/reg',function(req,res){
        var name = req.body.name,
        password = req.body.password,
        password_re = req.body['password-repeat'];
        //检验用户两次输入的密码是否一致
        if(password_re != password){
            req.flash('error','两次输入的密码不一致');
            return res.redirect('/reg');
        }
        //生成密码的MD5值
        var md5 = crypto.createHash('md5'),
        password = md5.update(req.body.password).digest('hex');
        var newUser = new User({
            name:req.body.name,
            password:password,
            email:req.body.email
        })
        //检查用户名是否存在
        User.get(newUser.name,function(err,user){
            if(user){
                req.flash('error','用户已存在');
                return res.redirect('/reg');
            }
            //如果不存在则新增用户
            newUser.save(function(err,user){
                if(err){
                    req.flash('error',err);
                    return res.redirect('/reg');
                }
                req.session.user = user//用户信息存入session
                req.flash('success','注册成功!');
                res.redirect('/');//注册成功后返回主页
            })
        })
    })
    // 登录
    app.get('/login', checkNotLogin);
    app.get('/login',function(req,res){
        res.render('login',
            {
                title:'登录',
                user:req.session.user,
                success:req.flash('success').toString(),
                error:req.flash('error').toString()
            }
        )
    })
    //提交登录
    app.post('/login', checkNotLogin);
    app.post('/login',function(req,res){
        var md5 = crypto.createHash('md5'),
        password = md5.update(req.body.password).digest('hex');
        //检查用户是否存在
        User.get(req.body.name,function(err,user){
            if(!user){
                req.flash('error','用户不存在！');
                return res.redirect('/login');//用户不存在则跳转到登录页
            }
            //检查密码是否一致
            if(user.password != password){
                req.flash('error',"密码错误");
                return res.redirect('/login');//密码错误则跳转到登录页
            }
            //用户名密码都匹配后，将用户信息存入session
            req.session.user = user;
            req.flash('success','登陆成功！');
            res.redirect('/');
        })
    })
    //发表
    app.get('/post', checkLogin);
    app.get('/post', function (req, res){
        res.render('post', { 
            title: '发表',
            user: req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        });
    });
    //提交发表
    app.post('/post', checkLogin);
    app.post('/post', function (req, res){
        var currentUser = req.session.user,
        post = new Post(currentUser.name,req.body.title,req.body.post);
        post.save(function(err){
            if(err){
                req.flash('error',err);
                return res.redirect('/');
            }
            req.flash('success','发布成功');
            res.redirect('/');
        })
    });
    //退出
    app.get('/logout', checkLogin);
    app.get('/logout', function (req, res){
        req.session.user = null;
        req.flash('success','登出成功！');
        res.redirect('/');
    });
    function checkLogin(req,res,next){
        if(!req.session.user){
            req.flash('error','未登录！');
            res.redirect('/login');
        }
        next();
    }
    function checkNotLogin(req,res,next){
        if(req.session.user){
            req.flash('error','已登录！');
            res.redirect('back');
        }
        next();
    }
}