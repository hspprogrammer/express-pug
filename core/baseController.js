const redisClient =  require("./redisClient");

class BaseController{
     constructor(req,res,next){
        this.req = req;
        this.res = res;
        this.redis = redisClient();
    }

}

module.exports = BaseController;