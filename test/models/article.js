'use strict';
const models = require('../../models');
const article = models.article;
const uuid = require('uuid');
const Promise = require('bluebird');
const co = require('co');
const assert = require("assert");

let title = uuid.v4();
let content = uuid.v4();
let newDoc = null;
let doc = null;
let newContent = uuid.v4();

describe('article', function(){
    it('should create a new article', function(done){
        new article({
            title: title,
            content: content,
        }).save().then((_doc) => {
            newDoc = _doc;
            assert(newDoc.title == title);
            assert(newDoc.content == content);
        }).then(done, done);
    });
    it('should query same article', function(done){
        article.findOne({title: title}).then((_doc) => {
            doc = _doc;
            assert(newDoc.content == doc.content);
            assert(newDoc.title == doc.title);
        }).then(done, done);
    });
    it('should have alter article content', function(done){
        doc.content = newContent;
        doc.save().then((_doc) => {
            assert(doc.content != content);
            assert(doc.content == newContent);
            assert(doc.content == _doc.content);
            assert(doc.title == _doc.title);
        }).then(done, done);
    });

    it('should remove article', function(done){
        article.remove({title: title, content: newContent}).then(()=>{
            return article.findOne({title:title});
        }).then((_doc) => {
            assert(_doc == null);
        }).then(done, done);
    });

    it('should cannot find old article content', function(done){
        article.findOne({content: content}).then((_doc) => {
            assert(_doc == null);
        }).then(done, done);
    });
});



