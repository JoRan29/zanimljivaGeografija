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
console.log(igraInput);

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

// Korisnik Igra Forma
igraKorisnik.addEventListener("submit", (e) => {
  e.preventDefault();
  igraInput.forEach((i) => {
    console.log(i.value);
    console.log(i.id);
    zgeo.proveriPojam(i.value, i.id, (data) => {
      if (data) {
        console.log(data);
        console.log("Netacno!");
      } else {
        console.log("Pogodak!");
      }
    });
  });
});
