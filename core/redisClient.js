const redis = require('redis');
const config = require("../config/index");
const {redisurl} = config[process.env.NODE_ENV || 'dev'];
// const { promisify } = require('util');

let isStart = false;

const client = redis.createClient({
    url: redisurl,
});

client.on('error', (err) => {
    isStart = false;
    console.log('Redis Client Error', err)
});
client.once('ready', () => {
    isStart = true;
    console.log('Redis 连接成功')
});
client.on('end', () => {
    isStart = false;
    console.log('Redis 断开连接')
});
client.on('reconnecting', () =>{
    console.log('Redis 重新连接中')
});



function redisClient(){
    if(!redisurl) return;
    if(!isStart) return  client.connect();
    return client;
}

module.exports = redisClient;