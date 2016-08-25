
var winston = require('winston');

var date, day, month, year, hour, min, sec,fulltime;
date = new Date();

hour = date.getHours();
hour = (hour < 10 ? "0" : "") + hour;

min = date.getMinutes();
min = (min < 10 ? "0" : "") + min;

sec = date.getSeconds();
sec = (sec < 10 ? "0" : "") + sec;

year = date.getFullYear();

month = date.getMonth() + 1;
month = (month < 10 ? "0" : "") + month;

day = date.getDate();
day = (day < 10 ? "0" : "") + day;

fulltime= year + "-" + month + "-" + day + " " + hour + ":" + min + ":" + sec;



// EN: all log level will be shown in Console, because 'info' is on the top of list with 0 value.
var transportConsole = new winston.transports.Console({
    json: false, timestamp:  function() {
        return fulltime;
    }, prettyPrint: true, colorize: true, level: 'info' }),

    // EN: 'i' and 'db' log levels will be shown in File, because db is after i and for File transport level is 'i'
    transportFileDebug = new winston.transports.File({
        filename: 'public/logs/' + day + '-' + month + '-' + year + '_' + 'ErrorLog.log', handleExceptions: true, timestamp: function () {
            return fulltime;
        }, json: true, level: 'info'}),
    transportFileException = new winston.transports.File({
        filename: 'public/logs/' + day + '-' + month + '-' + year + '_' + 'UncaughtError.log', json: true, timestamp: function () {
            return fulltime;
        } })



var logger = new (winston.Logger)({
    levels: {
        info: 0,
        warn: 1,
        error: 2,
        verbose: 3,
        i: 4,
        db: 5
    },
    transports: [
        transportConsole,
        transportFileDebug
    ],
    exceptionHandlers: [
        transportConsole,
        transportFileException
    ],
    exitOnError: false
});

winston.addColors({
    info: 'green',
    warn: 'cyan',
    error: 'red',
    verbose: 'blue',
    i: 'gray',
    db: 'magenta'
});

logger.i('i message');
logger.db('db  message');
logger.info('info message');
logger.warn('warn message');
logger.error('error  message');


module.exports = logger;