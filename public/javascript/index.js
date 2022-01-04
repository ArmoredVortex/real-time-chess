const socket = io();
const username = prompt("Enter Your Name");

socket.on("move", fen => {
    board.setPosition(fen);
})
socket.emit("new-user", username);