const BASECONTROLLER = require("../core/baseController")
const HOLLEWORD = require("../server/holleWord");

class Apis extends BASECONTROLLER{
    constructor(req,res,next){
        super(req,res,next)
    }


    async holleworld(){
        const { req, res } = this;
        const HolleWorldServer = new HOLLEWORD(req)
        const data = await HolleWorldServer.index();
        
        res.json({code:data.errorMsg?-1:0 ,data});
    }
   
}


module.exports = Apis;