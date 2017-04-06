'use strict';
const express = require('express');
const router = express.Router();
const resource = require('../services/resource');

//query
router.get('/', function(req, res, next) {
  let args = req.query;
  console.log(args);
  resource.get(args).then((docs) => {
    res.json(docs);
  }).catch((err)=>{
    next(err);
  });
});

//update
router.put('/', function(req, res, next) {
    let args = req.body;
    resource.update(args).then((docs) => {
        res.json(docs);
    }).catch((err)=>{
        next(err);
    });
});

//create
router.post('/', function(req, res, next) {
    let args = req.body;
    resource.post(args).then((doc) => {
        res.json(doc);
    }).catch((err)=>{
        next(err);
    });
});

//remove
router.delete('/', function(req, res, next) {
    let args = req.body;
    resource.remove(args).then((docs) => {
        res.json(docs);
    }).catch((err)=>{
        next(err);
    });
});
module.exports = router;
