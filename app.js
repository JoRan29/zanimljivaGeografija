// moduli
import { Geografija } from "./classGeo.js";

// DOM
let formKorisnik = document.querySelector("#formKorisnik");
let inputKorisnik = document.querySelector("#korisnik");
let formPredlog = document.querySelector("#formPredlog");
let inputPredlog = document.querySelector("#predlog");
let inputSelect = document.querySelector("#select");
let pozdrav = document.querySelector("#pozdrav");
// console.log(pozdrav);
// console.log(formKorisnik, formPredlog);

// korisnk lokalna memorija
let korisnik = () => {
  if (localStorage.korisnik) {
    pozdrav.innerHTML = `Hello, ${localStorage.korisnik}!`;
    return localStorage.korisnik;
  } else {
    pozdrav.innerHTML = `Morate se ulogovati da nastavite igru!`;
    return "anonimus";
  }
};

// objekat klase Geografija
let zgeo = new Geografija(korisnik(), "Drzava");

// korisnicko ime
formKorisnik.addEventListener("submit", (e) => {
  e.preventDefault();
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
    let predlogCap = zgeo.veliko(predlog);
    console.log("Predlog odgovara!" + predlogCap);
    // proveri da nije takav pojam vec u bazi
    zgeo.proveriPojam(predlogCap);
    // dodavanje u bazu
    // zgeo.dodajPojam(predlog, kategorija);
    // console.log("Novi pojam dodat u bazu!");
  } else {
    console.log("Predlog ne sme sadrzati prazne karaktere!");
  }
  formPredlog.reset();
});

// bez korisnickog imena
if (!localStorage.korisnik) {
  console.log(`Izaberi korisnicko ime: `);
  // document.body.style.innerHTML = "";
  document.body.style.pointerEvents = "none";
  alert(`Ne mozete pristupiti stranici bez korisnickog imena!`);
}
