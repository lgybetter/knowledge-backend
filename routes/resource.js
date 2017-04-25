'use strict';
const express = require('express');
const router = express.Router();
const resource = require('../services/resource');


const framework = require('../framework');
const mount = framework.mountControllerToRouter;


//query
mount(router, 'get', '/', resource.get, {
    req: {

    },
    map: function(req){return req.query;},
    arg: {
        schema: {
            properties: {
                model: {type: "string"},
                filter: {type: 'object'},
                skip: {type: "number"},
                limit: {type: "number"}
            }
        }
    },
});

//update
mount(router,'put','/',resource.update,{
    map:function(req){return req.body},
    arg: {
        schema: {
            properties: {
                model: {type: "string"},
                filter: {type: 'object'},
                data: {type: "object"},
                opts: {type: "object"}
            }
        }
    }
});

//create
mount(router,'post','/',resource.post, {
    map:function(req){return req.body},
    arg: {
        schema: {
            properties: {
                model: {type: "string"},
                data: {type: "object"}
            }
        }
    }
});

//remove
mount(router,'delete','/',resource.remove, {
    map:function(req){return req.body},
    arg: {
        schema: {
            properties: {
                model: {type: "string"},
                filter: {type: 'object'}
            }
        }
    }
});
module.exports = router;
