/**
 * Created by Administrator on 2017/4/6.
 */
'use strict';
const resource = require('../../services/resource');
const uuid = require('uuid');
const Promise = require('bluebird');
const co = require('co');
const assert = require("assert");

let title = uuid.v4();
let content = uuid.v4();
let newDoc = null;
let doc = null;
let newContent = uuid.v4();

describe('resource', function(){
    it('should create a new article', function(done){
        resource.post({
            model:'article',
            data: {
                title: title,
                content: content,
            }
        }).then((_doc) => {
            newDoc = _doc;
            assert(newDoc.title == title);
            assert(newDoc.content == content);
        }).then(done, done);
    });
    it('should query same article', function(done){
        resource.get({
            model:'article',
            filter:{title: title}
        }).then((_docs) => {
            doc = _docs[0];
            assert(newDoc.content == doc.content);
            assert(newDoc.title == doc.title);
        }).then(done, done);
    });
    it('should have alter article content', function(done){
        resource.update({
            model:'article',
            filter:{title: title},
            data:{$set:{content: newContent}}
        }).then((_doc) => {
            return Promise.all([resource.get({model:'article', filter: {content: content}}), resource.get({model:'article', filter: {content: newContent}})]);
        }).then((_docsArr)=>{

            assert(_docsArr[0].length == 0);
            assert(_docsArr[1].length == 1);

        }).then(done, done);
    });

    it('should remove article', function(done){
        resource.remove({
            model:'article',
            filter:{title: title, content: newContent}
        }).then(()=>{
            return resource.get({model:'article', filter:{title:title}});
        }).then((_docs) => {
            assert(_docs.length == 0);
        }).then(done, done);
    });
});