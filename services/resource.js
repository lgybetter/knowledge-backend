/**
 * Created by Administrator on 2017/4/6.
 */
'use strict';
const models = require('../models');
class Resource{
    constructor(){

    }
    post(args){
        let model = models[args.model];
        let data = args.data || {};
        return new model(data).save();
    }
    get(args){
        let model = models[args.model];
        let skip = args.skip || 0;
        let limit = args.limit || 20;
        let filter = args.filter || {};

        return model.find(filter).skip(skip).limit(limit);
    }
    update(args){
        let model = models[args.model];
        let filter = args.filter || {};
        let data = args.data || {};
        let opts = args.opts || {};
        return model.update(filter, data, opts);
    }
    remove(args){
        let model = models[args.model];
        let filter = args.filter || {};

        return model.remove(filter)
    }
}
module.exports = new Resource();