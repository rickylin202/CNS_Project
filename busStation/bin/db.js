/**
 * http://usejsdoc.org/
 */
var mongoose = require('mongoose');
var dbConfig = {
        hostname: "localhost",
        port:"27017",
        database: "busStation",
        username:"ricky",
        password:"nkhym202",
};
var options = { server: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } }, 
        replset: { socketOptions: { keepAlive: 300000, connectTimeoutMS : 30000 } } };
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://'+dbConfig.username+":"+dbConfig.password+'@'+dbConfig.hostname+':'+dbConfig.port+'/'+dbConfig.database, options);
//mongoose.connect('mongodb://localhost:27017/traffic');

var db = mongoose.connection;
db.on('error', function(err) {
    console.info('Connect to Database failed');
    console.error(err);
});

db.on('open', function() {
    console.info('Connected to mongo database on '+new Date());
});

module.exports = mongoose;