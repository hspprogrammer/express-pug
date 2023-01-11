const mongoose = require('mongoose');
const config = require("../config/index");
const {dbUrl} = config[process.env.NODE_ENV || 'dev'];

let isStart = false;

 function mongodb(){
    if(!dbUrl) return;
    if(!isStart) return  mongoose.connect(dbUrl,{},);
    return console.log("数据库已经连接");
}
mongoose.connection.on('error', function callback(err) { //监听是否有异常
    isStart = false;
    console.log("数据库连接失败",err);
});
mongoose.connection.on('connected', () => {
    isStart = true;
    console.log('数据库连接成功');
});
mongoose.connection.on('disconnected', () => {
    isStart = false;
    console.log('数据库连接断开');
});

module.exports = mongodb;