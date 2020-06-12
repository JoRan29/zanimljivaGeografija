let ime = document.querySelector("#pozdrav");
ime.innerHTML = `${localStorage.korisnik}`;

export let igrajBtn = document.querySelector("#igrajBtn");
let formKorisnik = document.querySelector("#igraKorisnik");
let igraInput = document.querySelectorAll(".igraInput");
let obavestenje = document.querySelector("#obavestenje");
// let reka = document.querySelector("#Reka");
let slovo = document.querySelector("#slovo");
console.log(igraInput);

// const addBtnListeners = () => {
//   [drzava, grad, reka].forEach((id) => {
//     const input = igraInput;
//   });
// };

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
// slovo
sock.on("randomSlovo", (data) => {
  console.log(data);
  slovo.innerHTML = data;
});
// countdown
sock.on("countdown", (data) => {
  console.log(data);
  igrajBtn.innerHTML = data;
});
// disconnect
sock.on("disconnect", () => {
  console.log("Disconnected from server!");
});

// obavestenje
const writeEvent = (text) => {
  obavestenje.innerHTML = text;
};

const onFormSub = (e) => {
  e.preventDefault();
  igraInput.forEach((element) => {
    sock.emit("input", {
      input: element.value,
      id: element.id,
      player: localStorage.korisnik,
    });
  });
  formKorisnik.reset();
};

sock.on("message", writeEvent);
sock.on("input", (data) => {
  console.log(data);
});

// form

igrajBtn.style.pointerEvents = "auto";
igrajBtn.style.userSelect = "auto";

igrajBtn.addEventListener("click", () => {
  formKorisnik.style.pointerEvents = "auto";
});

formKorisnik.addEventListener("submit", onFormSub);
