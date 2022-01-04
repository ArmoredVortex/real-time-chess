const express = require('express');
const app = express();
app.use(express.static('public'));
const server = require('http').Server(app);

const io = require('socket.io')(server);

const users = {};

io.on('connection', socket => {
    socket.on("new-user", name => {
        users[socket.id] = name;
        // socket.broadcast.emit("user-connected", name);
        console.log(users)
    });
    socket.on("move", fen => {
        socket.broadcast.emit("move", fen)
    })   
});

// Start server
server.listen(3000, () => {
    console.log('Server started on port 3000');
});