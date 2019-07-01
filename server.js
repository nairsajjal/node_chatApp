const mongo = require('mongodb').MongoClient;
const client = require('socket.io').listen(4000).sockets;

//connect to mongoDB

mongo.connect('mongodb://127.0.0.1/mongochat', function(err, db){
    if(err){
        throw err;
    }


    console.log('Mongo connected..');

    //connect to socket.io
    client.on('connection', function(){
        let chat = db.collection('chats');

        //create function to send status
        sendStatus = function(){
            socket.emit('status',s);

        }
        //get chats from mongo collection
        chat.find().limit(100).sort({_id:1}).toArray(function(err, res){
            if(err){
                throw err;
            }
            // Emit the messages
            socket.emit('output', res);
        });
        //handle input events
        socket.on('input', function(data){
            let name = data.name;
            
            let message = data.message;

            //check for name and message
            if(name =='' || message==''){
                //send error status
                sendStatus('please enter a name and message');

            }
            else{
                //inser message
                chat.insert({name:name, message: message}, function(){
                    client.emit('output',[data]);
                    //send status obj
                    sendStatus({
                        message: 'Message Sent',
                        clear: true
                    })
                });
            }
        });
        //clear handle
        socket.on('clear', function(data){
            //remove all chats from collection
            chat.remove({}, function(){
                socket.emit('cleared');
            });
        })
    });
});