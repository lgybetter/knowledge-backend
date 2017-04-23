/**
 * Created by Administrator on 2017/4/24.
 */
'use strict';
const express = require('express');
const router = express.Router();
const proxy = require('../services/proxy');
const mount = require('../framework').mountControllerToRouter;
mount(router, 'all', '/', proxy.action, {
   map:function(req){let body = req.body || {};let query = req.query || {};return Object.assign({}, body, query); }
});
module.exports = router;