const qiniu = require("qiniu");
const through = require('through-gulp');
const path = require('path');

const option = {
    accessKey:"",
    secretKey:"",
    scope:"空间名称",
    zone:"Zone_z2",//存储区域 华东(Zone_z0) 华北(Zone_z1) 华南(Zone_z2) 北美(Zone_na0)
}

class Qiniu{
    constructor(option){
        this.option = option;
        const {accessKey, secretKey,scope,zone} = this.option;
        //鉴权对象
        this.mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
        //上传的凭证
        const putPolicy = new qiniu.rs.PutPolicy({scope});
        this.uploadToken=putPolicy.uploadToken(this.mac);

        var config = new qiniu.conf.Config();
        config.zone = qiniu.zone[zone];
        this.formUploader = new qiniu.form_up.FormUploader(config);
        this.putExtra = new qiniu.form_up.PutExtra();
        //文件管理
        this.bucketManager = new qiniu.rs.BucketManager(this.mac, config);
    }

    upload(){
        let that = this;
        var stream = through(function(file, encoding, callback){
            //如果文件为空，不做任何操作，转入下一个操作，即下一个pipe
            if(file.isNull()){
                // console.log('file is null!');
                this.push(file);
                return callback();    
            }
            //插件不支持对stream直接操作，抛出异常
            if(file.isStream()){
                // console.log('file is stream!');
                this.emit('error');
                return callback();    
            }
            const filePath = file.path.replace(path.resolve(__dirname,'../bin')+'/','');
            const putPolicy = new qiniu.rs.PutPolicy({scope:that.option.scope+":"+filePath});
            const uploadToken=putPolicy.uploadToken(that.mac);
            //上传
            that.formUploader.putFile(
                uploadToken,
                filePath,
                file.path,
                that.putExtra,
                (respErr, respBody, respInfo)=>{
                    if (respErr) {
                        console.log(respErr)
                    }
                    if (respInfo.statusCode == 200) {
                       console.log(filePath+'上传成功')
                    } else {
                    }

                    this.push(file);
                    callback();
                }
            );
        }, function(callback){
            console.log('处理完毕!');
            callback();
        });
        return stream;
    }
}

module.exports = Qiniu;