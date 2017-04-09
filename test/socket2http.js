/**
 * Created by Administrator on 2017/4/9.
 */
/**
 * Created by Administrator on 2017/4/6.
 */
'use strict';
const socketIOClient = require('socket.io-client');
const uuid = require('uuid');
const Promise = require('bluebird');
const co = require('co');
const assert = require("assert");

let title = uuid.v4();
let content = uuid.v4();
let newDoc = null;
let doc = null;
let newContent = uuid.v4();
let wsUrl = "ws://localhost:3000";
let resourceUri = "http://localhost:3000/resource";
let client = socketIOClient(wsUrl);
function rpc(opt){
    return new Promise((resolve, reject)=>{
        client.emit("rpc", opt, function(result){
            if(result.status==="success"){
                resolve(result.msg);
            }else{
                reject(result.msg);
            }
        });
    });
}
describe('socket2http routers resource', function(){
    it('should create a new article', function(done){
        rpc({
            method:"POST",
            uri: resourceUri,
            body: {
                model:'article',
                data: {
                    title: title,
                    content: content,
                }
            },
            json: true
        }).then((body) => {
            assert(typeof body !== 'undefined');
            assert(body.title === title);
            assert(body.content === content);
        }).then(done, done);
    });
    it('should query same article', function(done){
        rpc({
            method:'GET',
            uri:resourceUri,
            qs: {
                model:'article',
                filter: {title: title},
            },
            json: true
        }).then((body)=>{
            //console.log(body);
            assert(typeof body !== 'undefined');
            assert(body[0].title === title);
            assert(body[0].content === content);
        }).then(done, done);
    });
    it('should have alter article content', function(done){
        rpc({
            method:"PUT",
            uri:resourceUri,
            body: {
                model:'article',
                filter:{title: title},
                data:{$set:{content: newContent}}
            },
            json: true
        }).then((_doc) => {
            return Promise.all([
                rpc({method:"get",uri:resourceUri,qs:{model:'article', filter: {content: content}},json:true}),
                rpc({method:"get",uri:resourceUri,qs:{model:'article', filter: {content: newContent}},json:true})
            ]);
        }).then((_docsArr)=>{

            assert(_docsArr[0].length === 0);
            assert(_docsArr[1].length === 1);

        }).then(done, done);
    });

    it('should remove article', function(done){
        rpc({
            method:"DELETE",
            uri:resourceUri,
            body:{
                model:'article',
                filter:{title: title, content: newContent}
            },
            json:true,
        }).then(()=>{
            return rpc({method:'get',uri:resourceUri,qs:{model:'article', filter:{title:title}},json:true});
        }).then((_docs) => {
            //console.log(_docs);
            assert(_docs.length === 0);
        }).then(done, done);
    });
});