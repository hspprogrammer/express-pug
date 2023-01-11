const BASECONTROLLER = require("../core/baseController")
const HOLLEWORD = require("../server/holleWord");

class Pages extends BASECONTROLLER{
    constructor(req,res,next){
        super(req,res,next)
    }


    async homePage(){
        const { req, res } = this;
        const HolleWorldServer = new HOLLEWORD(req);
        const data = await HolleWorldServer.index();
        res.render('index', {
            title:"blue双月鸟的博客",
            data,
            pageContent:'欢迎使用'
        });
    }

}


module.exports = Pages;