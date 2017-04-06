/**
 * Created by Administrator on 2017/4/5.
 */
'use strict';
const Promise = require('bluebird');
const mongoose = require('mongoose');
mongoose.Promise = Promise;
const config = require('../config');

mongoose.connect(config.mongodb);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {console.log(`${config.mongodb} opened`);});

module.exports = {
    article: require('./article')
}