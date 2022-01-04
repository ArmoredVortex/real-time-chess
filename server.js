const express = require('express');
const app = express();
app.use(express.static('public'));
const server = require('http').Server(app);

const io = require('socket.io')(server);

const users = {};

io.on('connection', socket => {
    socket.on("new-user", username => {
        users[socket.id] = {};
        users[socket.id].username = username;
        if(Object.keys(users).length === 1) {
            // set first user color to random b or w
            users[socket.id].color = Math.random() > 0.5 ? 'b' : 'w';
        } else if(Object.keys(users).length === 2) {
            // set second user color to opposite of first user
            users[socket.id].color = users[Object.keys(users)[0]].color === 'b' ? 'w' : 'b';
        }
        // sleep for 1 second to allow time user to connect
        setTimeout(() => {
            io.emit("user-connected", users[socket.id].color, users);
        }, 1000);
        console.log(users)
    });

    socket.on("disconnect", () => {
        delete users[socket.id];
        console.log(users);
    });

    socket.on("move", fen => {
        socket.broadcast.emit("move", fen)
    })   
});

// Start server
server.listen(3000, () => {
    console.log('Server started on port 3000');
});