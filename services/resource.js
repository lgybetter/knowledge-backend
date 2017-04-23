/**
 * Created by Administrator on 2017/4/6.
 */
'use strict';
const models = require('../models');
class Resource{
    constructor(){
    }
    post(model, data = {}){
        let Model = models[model];
        return new Model(data).save();
    }
    get(model, filter = {}, limit = 20, skip = 0){
        let Model = models[model];

        return Model.find(filter).skip(skip).limit(limit);
    }
    update(model, filter = {}, data = {}, opts = {}){
        let Model = models[model];
        return Model.update(filter, data, opts);
    }
    remove(model, filter = {}){
        let Model = models[model];

        return Model.remove(filter)
    }
}
module.exports = new Resource();