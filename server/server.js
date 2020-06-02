const http = require("http");
const express = require("express");
const socketio = require("socket.io");

const app = express();

const projectPath = `${__dirname}/../public`;
console.log(`Serving static from ${projectPath}`);

app.use(express.static(projectPath));

const server = http.createServer(app);

const io = socketio(server);

// emit - everyone receives a message (including the client sending it)
io.on("connection", (sock) => {
  // on connect
  console.log(sock.id);
  console.log("Someone connected!");
  // custom message
  sock.on("createMessage", (message) => {
    console.log("createMessage", message);
  });
  // custom event
  sock.on("clientEvent", (data) => {
    console.log(data);
  });
  //event
  sock.on("event", (data) => {
    console.log(data);
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

// custom events
