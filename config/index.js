module.exports = {
    dev:{
        port:3600,
        dbUrl:"",
        redisurl:""
    },
    production:{
        port:3600,
        dbUrl:"",
        redisurl:"",
        qiniuOptions:{
            accessKey:"",
            secretKey:"",
            scope:"",
            zone:""
        },
        qiniuBaseUrl:'',//七牛云的域名地址
    }
}