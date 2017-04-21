'use strict';

const request = require('request');
const rq = require('request-promise');


module.exports = (opt, cb) => {
    rq(opt).then((res) => {
        cb(null, res);
    }).catch((err) => {
        let result = {status:'error', location:"remote", msg:err};
        cb(result);
    });
}