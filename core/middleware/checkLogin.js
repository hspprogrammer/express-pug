const jwt = require('jsonwebtoken');
function checkLogin(req,res,next){
    const token = req.cookies['hspBlogToken'];
    if(req.path.indexOf('/api') == 0){
        if(!token){
            res.status(401);
            res.json({code:-1 ,data:{errorMsg:"请登陆后再操作"}});
            return;
        }
    }else{
        if(!token){
            res.status(401);
            res.redirect('/hanshanpeng/login')
            return;
        }
        if(req.path == '/hanshanpeng/login'){
            es.status(401);
            res.redirect('/hanshanpeng')
            return;
        }
    }
    next()
}

module.exports = checkLogin;