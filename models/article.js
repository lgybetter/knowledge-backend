/**
 * Created by Administrator on 2017/4/5.
 */
'use strict';
const mongoose = require('mongoose');
const articleSchema = mongoose.Schema({
    title: String,
    content: String,
    createdAt: Date,
    updatedAt: Date
});
articleSchema.pre('save', function(next){
    let now = new Date();
    this.updatedAt = now;
    if ( !this.createdAt ) {
        this.createdAt = now;
    }
    next();
});
const articleModel = mongoose.model('article', articleSchema);
module.exports = articleModel;