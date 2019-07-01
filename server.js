const mongo = require('mongodb').MongoClient;
const client = require('socket.io').listen(4000).sockets;

//connect to mongoDB

mongo.connect();