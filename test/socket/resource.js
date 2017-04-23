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

let client = socketIOClient(wsUrl);
function rpc(method, url, arg){
    return new Promise((resolve, reject)=>{
        client.emit(url, {method, arg}, function(err, res){
            if(err){
                reject(err);
            }else{
                resolve(res);
            }
        });
    });
}
describe('resource rpc over socket', function(){
    it('should create a new article', function(done){
        rpc(
            "post",
            '/resource/',
            {
                model:'article',
                data: {
                    title: title,
                    content: content,
                }
            }
        ).then((body) => {
            assert(typeof body !== 'undefined');
            assert(body.title === title);
            assert(body.content === content);
        }).then(done, done);
    });
    it('should query same article', function(done){
        rpc(
            'get',
            '/resource/',
            {
                model:'article',
                filter: {title: title},
            }
        ).then((body)=>{
            //console.log(body);
            assert(typeof body !== 'undefined');
            assert(body[0].title === title);
            assert(body[0].content === content);
        }).then(done, done);
    });
    it('should have alter article content', function(done){
        rpc(
            'put',
            '/resource/',
            {
                model:'article',
                filter:{title: title},
                data:{$set:{content: newContent}}
            }
        ).then((_doc) => {
            return Promise.all([
                rpc("get", '/resource/',{model:'article', filter: {content: content}}),
                rpc("get", '/resource/',{model:'article', filter: {content: newContent}})
            ]);
        }).then((_docsArr)=>{

            assert(_docsArr[0].length === 0);
            assert(_docsArr[1].length === 1);

        }).then(done, done);
    });

    it('should remove article', function(done){
        rpc(
            "delete",
            '/resource/',
            {
                model:'article',
                filter:{title: title, content: newContent}
            }
        ).then(() => {
            return rpc('get', '/resource/',{model:'article', filter:{title:title}});
        }).then((_docs) => {
            //console.log(_docs);
            assert(_docs.length === 0);
        }).then(done, done);
    });
});