const redisClient =  require("./redisClient");
const mongooseModel = require("./mongooseModel");

class baseServer {
    constructor(req){
        this.req = req;
        this.redis = redisClient();
        Object.assign(this,mongooseModel)
    }
    
    getRegfn(arr){
        const params = {}
        arr.forEach(key => {
            // 如果请求体为空值的时候则不加入判断 （这块具体逻辑看你需求写）
            if (!this.req.query[key] && typeof this.req.query[key] != 'boolean') return
            // 注意传入的值的type是否符合你自己定义的，如果需求不一可自己改
            params[key] = new RegExp(this.req.query[key], 'i')
        });
        return params
    }
    postRegFun(arr){
        const params = {}
        arr.forEach(key => {
            // 如果请求体为空值的时候则不加入判断 （这块具体逻辑看你需求写）
            if (!this.req.body[key] && typeof this.req.body[key] != 'boolean') return
            // 注意传入的值的type是否符合你自己定义的，如果需求不一可自己改
            params[key] = new RegExp(this.req.body[key], 'i')
        });
        return params
    }
}

module.exports = baseServer;