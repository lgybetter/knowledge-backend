/**
 * Created by Administrator on 2017/4/22.
 */
/**
 * 框架的目的:
 * 1. 统一socket.io与http调用
 * 2. api文档化，包含调用路径，method，参数说明
 */
'use strict';
const co = require('co');
const Ajv = require('ajv');
const acorn = require('acorn');

////////////////////////////////////////////就剩这个没有实现////////////////////////////////////////////////////////////
/**
 * req转换为arguments
 * @param map
 * @returns {Function}
 */
function getMapper(map){
    return function(req){
        return req;
    }
}
/*将对象参数转换为数组参数*/
function objToArray(arg, controllerArgs){
    let copiedArg = Object.assign(arg);
    let array = [];
    controllerArgs.forEach((name) => {
        array.push(copiedArg[name]);
        delete copiedArg[name];
    });
    array.push(copiedArg);
    return array;
}

function getSupportMethods(method){
    let methods = ["get","put","patch","post","delete","head","options"];
    if(typeof method !== "string"){
        return method;
    }
    if(methods.indexOf(method) === -1){
        return methods;
    }
    return [ method ];
}
/*提取函数签名*/
function extractArgs(fn){
    let str = fn.toString().trim();
    if(str.indexOf('function') !==0 ){
        str = "function "+str;
    }

    //console.log(str);

    let array = [];
    try{
        let result = acorn.parse(str);
        let params = result.body[0].params;

        for(let i=0;i<params.length;i++){
            let parami = params[i];
            if(parami.type==='AssignmentPattern'){
                array.push(parami.left.name);
            }
            if(parami.type === 'Identifier'){
                array.push(parami.name);
            }
        }
    }catch(e){
        console.log(e);
    }
    return array;
}

function getValidator(optAndSchema){
    let ajvOpt = optAndSchema.ajvOpt || {allErrors: true};
    let ajv = new Ajv(ajvOpt);
    let schema = optAndSchema.schema || {};
    let validator = ajv.compile(schema);
    let action = optAndSchema.action || "pass";
    return function(obj){
        let result = validator(obj);
        if(!result){
            let errors = validator.errors;
            let errorsText = ajv.errorsText(errors);
            return {errors, errorsText, action};
        }
        return null;
    }
}
/**
 * 调用格式验证器
 * @param obj 被检验的参数
 * @param validator 校验器
 * @param loc 位置
 * @returns {*}
 */
function callValidator(obj, validator, loc){
    let result = validator(obj);
    if(!result){return null;}

    let msg = {obj, loc, result};

    console.error(JSON.stringify(msg));

    if(result.action !== "pass") {
        throw msg;
    }else{
        return msg;
    }
}

/**
 * 挂载一个控制器到路由上，校验输入输出
 * @param router 相对根路由
 * @param method 支持的http动词
 * @param url 挂载在相对根路由的url
 * @param controller 可能返回promise，也可能不是
 * @param opts {req验证，map参数转换，arg验证，out验证，err验证， sio socket.io}
 * @return router
 */
function mountControllerToRouter(router, method, url, controller, opts = {}){

    /*处理支持的http动词*/
    let supportMethods = getSupportMethods(method);

    /*提取控制器的参数名*/
    let controllerArgs = extractArgs(controller);

    /*处理默认参数*/
    let reqValidator = opts.req || function(req){return null;};
    let FromReqToArg = opts.map || function(req){return req;};
    let argValidator = opts.arg || function(arg){return null;};
    let outValidator = opts.out || function(out){return null;};
    let errValidator = opts.err || function(err){return null;};

    if(typeof reqValidator === 'object'){
        reqValidator = getValidator(reqValidator);
    }
    if(typeof FromReqToArg === 'object'){
        FromReqToArg = getMapper(FromReqToArg);
    }
    if(typeof argValidator === 'object'){
        argValidator = getValidator(argValidator);
    }
    if(typeof outValidator === 'object'){
        outValidator = getValidator(outValidator);
    }
    if(typeof errValidator === 'object'){
        errValidator = getValidator(errValidator);
    }
    //socket.io与express可以共用的处理流程
    function commonHelper(arg){
        return new Promise((resolve, reject) => {
            return co(function*(){
                let argValidateResult = callValidator(arg, argValidator, 'arg');
                let array = objToArray(arg, controllerArgs);

                //console.log('array', array, 'controllerArgs', controllerArgs);

                /*正常的输出*/
                let out = yield controller.apply(null, array);

                let outValidateResult = callValidator(out, outValidator, 'out');
                resolve(out);
            }).catch((err) => {
                callValidator(err, errValidator, 'err');
                reject(err);
            }).catch((err) => {
                console.log(err);
                reject({code:500, message:"Internal Error"});
            });
        });
    }

    function expressHelper(req, res, next){
        //console.log('req.method='+req.method);
        /*遇到不支持的http动词要跳开*/
        if(supportMethods.indexOf(req.method.toLowerCase()) === -1){
            return next();
        }
        co(function*() {
            let reqValidateResult = callValidator(req, reqValidator, 'req');

            //req->arg function or schema
            let arg = FromReqToArg(req);

            //console.log('arg', arg);

            return yield commonHelper(arg);

        }).then((out) => {
            res.json(out);
        }).catch((err) => {
            next(err);
        });

    }
    /*收集一些参数，作为文档化以及挂载socket.io事件的依据*/
    let meta = {
        supportMethods,
        url,
        controllerArgs,
        opts,
        commonHelper,
    };

    expressHelper.meta = meta;

    router.use(url, expressHelper);
    return router;
}
const recursive_collect_apis = require('./collectApi').recursive_collect_apis;

const getApiTable = require('./collectApi').getApiTable;

const startSocketIO = require('./callApiOverSocketIO').startSocketIO;

module.exports = {mountControllerToRouter, recursive_collect_apis, getApiTable, startSocketIO};