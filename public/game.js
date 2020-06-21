let ime = document.querySelector("#pozdrav");
ime.innerHTML = `${localStorage.korisnik}`;

export let igrajBtn = document.querySelector("#igrajBtn");
let formKorisnik = document.querySelector("#igraKorisnik");
let igraInput = document.querySelectorAll(".igraInput");
let igrajPonovo = document.querySelector("#igrajPonovo");
let obavestenje = document.querySelector("#obavestenje");
let listaRez = document.querySelector("#listaRez");
let slovo = document.querySelector("#slovo");

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

// ime korisnika
sock.emit("event", {
  korisnik: localStorage.korisnik,
});

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
        igrajPonovo.style.pointerEvents = "none";
        return broj;
      }
      if (broj === 0) {
        console.log("Vreme je isteklo!");
        igrajPonovo.style.pointerEvents = "auto";
        clearInterval(clock);
        window.scrollTo(0, 800);
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
                i.value += " +10";
              }
            });
          }
        });
        console.log(odgovoriKor);
        odgovoriKor.push(localStorage.korisnik);
        setTimeout(() => {
          sock.emit("odgovori", odgovoriKor);
          sock.emit("poeni", odgovoriKor.length - 1);
          sock.emit("name", localStorage.korisnik);
          if (odgovoriKor.length - 1 > 0) {
            sock.emit("turn", (odgovoriKor.length - 1) * 10);
          } else if (odgovoriKor.length == 1) {
            sock.emit("turn", 0);
          }
        }, 1000);
      }
    }, 1000);
  };
  startTimeout(20);
});

let displayResult = (result) => {
  let li = document.createElement("li");
  li.innerHTML = result;
  return li;
};

// disconnect
sock.on("disconnect", () => {
  console.log("Disconnected from server!");
});

// obavestenje
const writeEvent = (text) => {
  obavestenje.innerHTML = text;
};

sock.on("message", writeEvent);
sock.on("input", (data) => {
  console.log(data);
});

// rezultat
const writeResult = (text) => {
  let rez = displayResult(text);
  listaRez.style.fontSize = "30px";
  listaRez.style.backgroundColor = "red";
  listaRez.appendChild(rez);
};

sock.on("result", writeResult);

// form
igrajBtn.style.pointerEvents = "auto";
igrajBtn.style.userSelect = "auto";

igrajBtn.addEventListener("click", () => {
  formKorisnik.style.pointerEvents = "auto";
});

igrajPonovo.addEventListener("click", () => {
  location.reload();
});
