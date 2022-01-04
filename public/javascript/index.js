const socket = io();
const username = prompt("Enter Your Name");
document.getElementById("selfUsername").innerHTML = username;
let pieces;

socket.on("move", (fen,pgn) => {
    board.setPosition(fen);
    // set game pgn
    game.load_pgn(pgn);
})

socket.emit("new-user", username);

socket.on("user-connected", (color,name,list) => {
    console.log(list)
    // get opponenets username from list
    let opponent = Object.keys(list).filter(key => key !== socket.id)[0];
    if(opponent !== undefined) {
        document.getElementById("oppUsername").innerHTML = list[opponent].username;
    }
    if(pieces === undefined) {
        pieces = color;
        if(color === "b") {
            console.log("black")
            board.flip();
        }
    }
});