/**
 * Created by Administrator on 2017/4/9.
 */
'use strict';

const resource = require('../services/resource');

module.exports = (data, cb) => {
    resource[data.method](data.args).then((res)=>{cb(null, res);}).catch((err)=>{cb(err);});
}