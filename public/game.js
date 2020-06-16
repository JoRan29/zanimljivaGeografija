let ime = document.querySelector("#pozdrav");
ime.innerHTML = `${localStorage.korisnik}`;

export let igrajBtn = document.querySelector("#igrajBtn");
let formKorisnik = document.querySelector("#igraKorisnik");
let igraInput = document.querySelectorAll(".igraInput");
let igrajPonovo = document.querySelector("#igrajPonovo");
let obavestenje = document.querySelector("#obavestenje");
let listaRez = document.querySelector("#listaRez");
let slovo = document.querySelector("#slovo");
// console.log(igraInput);

// korisnik
let korisnik = () => {
  if (localStorage.korisnik) {
    return localStorage.korisnik;
  } else {
    return "anonimus";
  }
};

import { Geografija } from "./classGeo.js";
let zgeo = new Geografija(korisnik(), "Drzava");

const sock = io("/game");
let odgovoriKor = [];
let pocetnoSlovo;

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
  });
}, 100);
// slovo
sock.on("randomSlovo", (data) => {
  console.log(data);
  pocetnoSlovo = data;
  slovo.innerHTML = data;
});
// countdown
sock.on("countdown", () => {
  let startTimeout = (broj) => {
    formKorisnik.style.pointerEvents = "auto";
    let clock = setInterval(() => {
      broj--;
      igrajBtn.value = broj;
      if (broj > 0) {
        console.log(broj);
        return broj;
      }
      if (broj === 0) {
        console.log("Vreme je isteklo!");
        clearInterval(clock);
        console.log(igraInput);
        igraInput.forEach((i) => {
          let veliko = zgeo.veliko(i.value);
          if (
            veliko == "" ||
            veliko == undefined ||
            veliko.startsWith(pocetnoSlovo) == false
          ) {
            i.value += "+0";
          }
          if (veliko != "" && veliko.startsWith(pocetnoSlovo)) {
            zgeo.proveriPojam(veliko, i.id, (data) => {
              if (data) {
                console.log("Netacno!");
                i.value += " +0";
              } else {
                console.log("Pogodak!");
                odgovoriKor.push(veliko + " " + i.id);
              }
            });
          }
        });
        console.log(odgovoriKor);
        odgovoriKor.push(localStorage.korisnik);
        setTimeout(() => {
          sock.emit("odgovori", odgovoriKor);
          sock.emit("poeni", odgovoriKor.length - 1);
        }, 1000);
      }
    }, 1000);
  };
  startTimeout(10);
});

let displayResult = (result) => {
  let li = document.createElement("li");
  li.innerHTML = result;
  return li;
};

sock.on("rez", (data) => {
  console.log(data);
  let rez = displayResult(data);
  listaRez.style.fontSize = "30px";
  listaRez.style.backgroundColor = "red";
  listaRez.appendChild(rez);
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

igrajPonovo.addEventListener("click", () => {
  location.reload();
});
