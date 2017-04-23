/**
 * Created by Administrator on 2017/4/24.
 */
'use strict';
const request = require('request');
const rp = require('request-promise');

class Proxy{
    constructor(){}
    action(opt){
        return rp(opt);
    }
}
module.exports = new Proxy();