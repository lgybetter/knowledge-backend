/**
 * Created by jiege on 17-4-24.
 */
'use strict';
const socketIO = require('socket.io');

const co = require('co');

function startSocketIO(server, apiTable){
  let table = apiTable;
  let urls = Object.keys(table);
  console.log(`socket.io will mount on ${urls}`);
  let io = socketIO(server);
  io.on('connect', (socket) => {
    for(let url in table){
      (function(eventName, funcs){

        socket.on(eventName,(data, cb) => {
          cb=typeof cb === "function"?cb:function () {};

          let method = data.method.toLowerCase();
          let arg = data.arg;
          //console.log('data', data, eventName);
          co(function*(){
            let func = null;
            for(let i = 0;i<funcs.length;i++){
              let funci = funcs[i];
              if(funci.supportMethods.indexOf(method) !== -1){
                func = funci.func;
                break;
              }
            }
            if(typeof func === 'function'){
              console.log(method, eventName, JSON.stringify(arg));
              let out = yield func(arg);
              cb(null, out);
            }else{
              throw ("can not method " + eventName);
            }
          }).catch((err) => {

            console.log(err);

            cb(err);
          });
        });
      })(url, table[url]);
    }
  });
  return io;
}
module.exports = {startSocketIO};