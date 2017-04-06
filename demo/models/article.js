//插入一个doc，过一会修改，再过一会删除
'use strict';
const models = require('../../models');
const article = models.article;
const uuid = require('uuid');
const Promise = require('bluebird');
const co = require('co');

co(function*(){
    let title = uuid.v4();
    let content = uuid.v4();

    let newDoc = yield new article({
        title: title,
        content: content,
    }).save();
    console.log('newDoc', newDoc);

    let doc = yield article.findOne({title: title});
    console.log('doc', doc);

    yield Promise.delay(1000);

    let newContent = uuid.v4();
    doc.content = newContent;

    let oldDoc = yield doc.save();
    console.log('oldDoc', oldDoc);

    yield Promise.delay(1000);

    let rmResult = yield article.remove({title: title, content: newContent});
    console.log('rmResult', rmResult);

    process.exit();
});
