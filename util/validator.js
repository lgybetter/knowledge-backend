/**
 * Created by Administrator on 2017/4/21.
 */
'use strict';
const ajv = require('ajv');
function restfulValidator(schema){
    //let validator = ajv.compile(schema);
    return function(req, res, next){
        console.trace(req.originUrl);
        //let validResult = validator(req);
        //if(validResult){
        //    console.warn(req.originUrl, validResult);
        //}
        next();
    }
}
module.exports = {
    restfulValidator
};