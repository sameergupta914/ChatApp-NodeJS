const express= require('express');
const http= require('http');
const socketio= require('socket.io');

const connect=require('./src/config/database-config');

const Chat=require('./src/models/chat');

const app=express();
const server= http.createServer(app);
const io= socketio(server);


io.on('connection', (socket) => {
    // console.log('a user connected', socket.id); 
    socket.on('join_room', (data)=>{
        socket.join(data.roomid);
    });

    socket.on('msg_send', async(data)=>{
        console.log(data);
        const chat= await Chat.create({
            roomId: data.roomid,
            user:data.username,
            content: data.msg
        }); 
        io.to(data.roomid).emit('msg_rcvd', data);
        // socket.emit('msg_rcvd', data);
        // socket.broadcast.emit('msg_rcvd', data);  ->emits to everyone but user
        //io.to().emit  ->emits to everyone
    });

    socket.on('typing', (data)=>{
        socket.broadcast.to(data.roomid).emit('someone_typing');
    })

});

app.set('view engine', 'ejs');
app.use('/', express.static(__dirname + '/public'));

app.get('/chat/:roomid',async(req,res)=>{
    const chats=await Chat.find({
        roomId: req.params.roomid
    });
    res.render('index', {
        name: 'Sameer',
        id: req.params.roomid,
        chats: chats
    });
})

server.listen(3000, async()=>{
    console.log('server started');
    await connect();
    console.log('mongodb connected');
}) 