const mongoose = require('mongoose');
const { Schema } = mongoose;
const BASESERVER = require("../core/baseServer")
const jwt = require('jsonwebtoken');

class HolleWorldServer extends BASESERVER{
    constructor(req){
        super(req)
    }
    
    async index(props){
        // const {userName,passWord} = props;
        // const data = await this.userInfoModel.findOne({userName,passWord},'_id')
        // return data
       
        return {
            data:'holle world'
        }
        
    }
}

module.exports = HolleWorldServer;