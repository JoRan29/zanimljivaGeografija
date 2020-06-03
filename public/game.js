let ime = document.querySelector("#pozdrav");
ime.innerHTML = `${localStorage.korisnik}`;

// socket.io
// const sock = io();
const sock = io("/game");

// korisnik se povezao
sock.on("connect", () => {
  console.log("Connected to server!");
});
sock.emit(
  "clientEvent",
  `Sent an event from the client ${localStorage.korisnik}!`
);
// custom event
setTimeout(() => {
  sock.emit("event", {
    korisnik: localStorage.korisnik,
    poruka: `Korisnik ${localStorage.korisnik} je povezan!`,
  });
}, 100);
// disconnect
sock.on("disconnect", () => {
  console.log("Disconnected from server!");
});

// change input
const changeInput = (text) => {
  //   console.log(igraInput.values);
};

changeInput();
