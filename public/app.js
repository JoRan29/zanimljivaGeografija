// moduli
import { Geografija } from "./classGeo.js";

// DOM
let formKorisnik = document.querySelector("#formKorisnik");
let inputKorisnik = document.querySelector("#korisnik");
let formPredlog = document.querySelector("#formPredlog");
let inputPredlog = document.querySelector("#predlog");
let inputSelect = document.querySelector("#select");
let pozdrav = document.querySelector("#pozdrav");
let ulPoznati = document.querySelector("#poznati");
let igraKorisnik = document.querySelector("#igraKorisnik");
let igraInput = document.querySelectorAll(".igraInput");
let igrajBtn = document.querySelector("#igrajBtn");
console.log(igrajBtn);

// korisnk lokalna memorija
let korisnik = () => {
  if (localStorage.korisnik) {
    pozdrav.innerHTML = `Hello, ${localStorage.korisnik}!`;
    return localStorage.korisnik;
  } else {
    pozdrav.innerHTML = `Morate se prijaviti da nastavite igru!`;
    return "anonimus";
  }
};

// objekat klase Geografija
let zgeo = new Geografija(korisnik(), "Drzava");

// korisnicko ime
formKorisnik.addEventListener("submit", (e) => {
  // e.preventDefault();
  zgeo.promeniKorisnika(inputKorisnik.value);
  localStorage.korisnik = inputKorisnik.value;
  formKorisnik.reset();
});

// dodaj pojam
formPredlog.addEventListener("submit", (e) => {
  e.preventDefault();
  let predlog = inputPredlog.value;
  let kategorija = inputSelect.value;
  // setuj kategoriju
  zgeo.kategorija = kategorija;
  let patternReg = /^\S*$/;
  if (patternReg.test(predlog) && predlog.length) {
    // uvek postavi pocetno veliko slovo
    let predlogCap = zgeo.veliko(predlog);
    // proveri da pojam vec ne postojo
    zgeo.proveriPojam(predlogCap, kategorija, (data) => {
      if (data) {
        zgeo.dodajPojam(predlogCap, kategorija);
        console.log("Novi pojam dodat u bazu! " + predlogCap);
      } else {
        console.log("Pojam vec postoji!");
      }
    });
  } else {
    console.log("Predlog ne sme sadrzati prazne karaktere!");
  }
  formPredlog.reset();
});

// bez korisnickog imena
if (!localStorage.korisnik) {
  console.log(`Izaberi korisnicko ime: `);
  // document.body.style.innerHTML = "";
  formPredlog.style.pointerEvents = "none";
  formPredlog.style.opacity = "0.5";
  alert(`Ne mozete pristupiti stranici bez korisnickog imena!`);
}

// provera broja unosa
zgeo.najviseUnosa((data) => {
  let lista = {};
  data.forEach(function (x) {
    lista[x] = (lista[x] || 0) + 1;
  });
  // console.log(lista);
  // console.log(Object.keys(lista));
  // console.log(Object.keys(lista).sort());
  let keysSorted = Object.keys(lista).sort(function (a, b) {
    return lista[a] - lista[b];
  });
  // console.log(keysSorted);
  let top5 = keysSorted.reverse().slice(0, 5);
  // console.log(top5);

  top5.forEach((t) => {
    // console.log(t);
    let li = `<li>`;
    li += `${t}</li></br>`;
    ulPoznati.innerHTML += li;
  });
});

// Igraj Dugme
igrajBtn.addEventListener("click", (e) => {
  e.preventDefault();
  igrajBtn.style.pointerEvents = "none";
  let countdown = 10;
  let snd = new Audio("beep.mp3");
  let stopwatch = setInterval(() => {
    console.log(countdown--);
    igrajBtn.value = countdown;
    if (countdown < 5) {
      igrajBtn.style.color = "red";
      snd.play();
    }
    if (countdown == 0) {
      clearInterval(stopwatch);
      igrajBtn.value = "Vreme isteklo!";
    }
  }, 1000);
});

// Korisnik Igra Forma
igraKorisnik.addEventListener("submit", (e) => {
  e.preventDefault();
  let skorKorisnik = 0;
  let odgovorKomp;
  igraInput.forEach((i) => {
    zgeo.proveriPojam(i.value, i.id, (data) => {
      if (data) {
        console.log(data);
        console.log("Netacno!");
      } else {
        console.log("Pogodak!");
        skorKorisnik = skorKorisnik + 15;
      }
      console.log(skorKorisnik);
    });
  });
});
