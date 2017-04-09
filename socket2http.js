/**
 * Created by Administrator on 2017/4/9.
 */
'use strict';
const socketIO = require('socket.io');
const request = require('request');
const rq = require('request-promise');
const config = require('./config');

function start(server){
    let io = socketIO(server);
    io.on('connect', (socket) => {
        socket.on('rpc', (opt, cb) => {
            try{
                rq(opt).then((res) => {
                    let result = {status:'success', msg:res};
                    if(typeof cb==="function")cb(result);
                }).catch((err) => {
                    let result = {status:'error', location:"remote", msg:err};
                    if(typeof cb==="function")cb(result);
                });
            }catch(err){
                let result = {status:'error', location:"local", msg:err};
                if(typeof cb==="function")cb(result);
            }
        });
    });
    return io;
}
module.exports = {start};