const http = require("http");
const express = require("express");
const socketio = require("socket.io");

const Game = require("./game");

const app = express();

const projectPath = `${__dirname}/../public`;
console.log(`Serving static from ${projectPath}`);

app.use(express.static(projectPath));

const server = http.createServer(app);

const io = socketio(server);

const nsp = io.of("/game");

// player
let waitingPlayer = null;

// emit - everyone receives a message (including the client sending it)
nsp.on("connection", (sock) => {
  // on connect
  console.log("Someone connected: " + sock.id);
  if (waitingPlayer) {
    // start a game
    new Game(waitingPlayer, sock);
    // startCountdown();
    waitingPlayer = null;
  } else {
    waitingPlayer = sock;
    waitingPlayer.emit("message", "Čekamo protivnika...");
  }
  // custom event
  sock.on("clientEvent", (data) => {
    console.log(data);
  });
  //event
  sock.on("event", (data) => {
    console.log(data);
  });
  sock.on("input", (data) => {
    console.log(data);
    let { input, id, player } = data;
    console.log(input, id, player);
  });

  // on disconnect
  sock.on("disconnect", () => {
    console.log("User has disconnected!");
  });
});

// server
server.on("error", (err) => {
  console.error("Server error", err);
});

server.listen(8080, () => {
  console.log("It's alive - on 8080!");
});
