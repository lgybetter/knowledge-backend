'use strict';
const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');

const resource = require('./routes/resource');
const proxy = require('./routes/proxy');
const app = express();

const models = require('./models');


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(cors());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/resource', resource);
app.use('/proxy', proxy);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

require('./framework/pr').recursive_print_routers(app._router, []);

const getTable = require('./framework/pr').getSocketIORpc;

const debug = require('debug')('knowledge:server');
const http = require('http');
const co = require('co');

const config = require('./config');

const socketIO = require('socket.io');


/**
 * Get port from environment and store in Express.
 */

const port = normalizePort(config.listenPort);
app.set('port', port);

/**
 * Create HTTP server.
 */

const server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

function startSocketIO(server){
    let table = getTable();

    let io = socketIO(server);
    io.on('connect', (socket) => {
        for(let url in table){
            (function(eventName, funcs){
                console.log('mount socket.io event:'+eventName);
                socket.on(eventName,(data, cb) => {
                    cb=typeof cb === "function"?cb:function () {};

                    let method = data.method.toLowerCase();
                    let arg = data.arg;
                    //console.log('data', data, eventName);
                    co(function*(){
                        let func = null;
                        for(let i = 0;i<funcs.length;i++){
                            let funci = funcs[i];
                            if(funci.supportMethods.indexOf(method) !== -1){
                                func = funci.func;
                                break;
                            }
                        }
                        if(typeof func === 'function'){
                            let out = yield func(arg);
                            cb(null, out);
                        }else{
                            throw ("can not method " + eventName);
                        }
                    }).catch((err) => {

                        console.log(err);

                        cb(err);
                    });
                });
            })(url, table[url]);
        }
    });
    return io;
}

let io = startSocketIO(server);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
    let port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    let bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    debug('Listening on ' + bind);
}
