const mongoose = require('mongoose');
const { Schema } = mongoose;
//用户
const userInfoSchema = new Schema({
    userName:  String,
    passWord:  String,
    nickName: String,
    token: String
});
const userInfoModel = mongoose.model('userInfoModel', userInfoSchema,'userInfo',{overwriteModels:false});


module.exports = {
    userInfoModel,
}