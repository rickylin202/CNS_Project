/**
 * http://usejsdoc.org/
 */
var mongoose = require('mongoose');
var dbConfig = {
        hostname: "localhost",
        port:"27017",
        database: "traffic",
        username:"ricky",
        password:"nkhym202",
};
mongoose.connect('mongodb://'+dbConfig.username+":"+dbConfig.password+'@'+dbConfig.hostname+':'+dbConfig.port+'/'+dbConfig.database);
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