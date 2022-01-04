const socket = io();
const username = prompt("Enter Your Name");
let pieces;

socket.on("move", fen => {
    board.setPosition(fen);
    // set game.move to oppnents move
    game.move(game.move());
})

socket.emit("new-user", username);

socket.on("user-connected", (color,list) => {
    if(pieces === undefined) {
        pieces = color;
        if(color === "b") {
            board.flip();
        }
    }
    
    console.log(color,list)
});