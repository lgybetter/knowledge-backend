/**
 * Created by Administrator on 2017/4/5.
 */
'use strict';
let CNF_PATH = require('yargs').argv.CNF_PATH;
let NODE_ENV = process.env.NODE_ENV || 'development';
if(typeof CNF_PATH === 'string'){
    module.exports = require(process.cwd()+'/'+CNF_PATH);
}else{
    module.exports = require(`./config.${NODE_ENV}.js`);
}