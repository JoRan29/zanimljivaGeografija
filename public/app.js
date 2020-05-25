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
let igraKomp = document.querySelector("#igraKomp");
let kompInput = document.querySelectorAll(".kompInput");
let vs = document.querySelector(".vs");
let slovo = document.querySelector("#slovo");
let pravila = document.querySelector("#pravila");
let close = document.querySelector("#close");
let zavrsiIgru = document.querySelector("#zavrsiIgru");
let skor = document.querySelector("#skor");
// console.log(igrajBtn);

// korisnk lokalna memorija
let korisnik = () => {
  if (localStorage.korisnik) {
    pozdrav.innerHTML = `Hello, ${localStorage.korisnik}!`;
    return localStorage.korisnik;
  } else {
    pozdrav.innerHTML = `Morate se prijaviti da nastavite igru!
    `;
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

// vs
vs.innerHTML = `${localStorage.korisnik}`;

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
  igraKorisni.style.pointerEvents = "none";
  igraKorisnik.style.opacity = "0.5";
  alert(`Ne mozete pristupiti stranici bez korisnickog imena!`);
}

// provera broja unosa - top lista
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
let pocetnoSlovo;

igrajBtn.addEventListener("click", (e) => {
  e.preventDefault();
  // Odgovori
  let odgovoriKomp = [];
  let odgovoriKor = [];
  // Podesi Skor
  let kompSkor = 0;
  let skorKorisnik = 0;
  // Izaberi Slovo
  let abeceda = "ABCČĆDĐEFGHIJKLMNOPRSTUVZŽ".split("");
  pocetnoSlovo = zgeo.random(abeceda);
  slovo.innerHTML = pocetnoSlovo;
  // Podesi odbrojavanje
  let countdown = 60;
  igrajBtn.style.pointerEvents = "none";
  igraKorisnik.style.pointerEvents = "auto";
  igraKorisnik.reset();
  let snd = new Audio("beep.mp3");
  // Odbrojavanje
  let stopwatch = setInterval(() => {
    countdown--;
    igrajBtn.value = countdown;
    if (countdown < 5) {
      igrajBtn.style.color = "red";
      igrajBtn.style.fontWeight = "900";
      snd.play();
    }
    if (countdown == 0) {
      clearInterval(stopwatch);
      igrajBtn.value = "Vreme isteklo!";
      // Komp Dobije Odgovore
      kompInput.forEach((i) => {
        zgeo.uzmiPojam(i.id, pocetnoSlovo, (d) => {
          // console.log(zgeo.random(d));
          // console.log(i);
          let pojam = zgeo.random(d);
          if (pojam != undefined) {
            i.value = `${pojam}`;
            // kompSkor = kompSkor + 15;
            odgovoriKomp.push(pojam);
            console.log(kompSkor);
          } else {
            i.value = `:(`;
          }
        });
      });
      // Igrac submit odgovore - Korisnik Forma
      igraInput.forEach((i) => {
        console.log(i.value);
        if (i.value != "" && i.value.startsWith(pocetnoSlovo)) {
          zgeo.proveriPojam(i.value, i.id, (data) => {
            if (data) {
              // console.log(data);
              console.log("Netacno!");
            } else {
              console.log("Pogodak!");
              // skorKorisnik = skorKorisnik + 15;
              odgovoriKor.push(i.value);
            }
            console.log(skorKorisnik);
          });
        }
      });
      // Racunanje rezultata
      skor.innerHTML = `Računamo konačan rezultat...`;
      setTimeout(() => {
        // Rezultat
        kompSkor = odgovoriKomp.length * 15;
        skorKorisnik = odgovoriKor.length * 15;
        odgovoriKomp.forEach((odg) => {
          console.log(odg);
          odgovoriKor.forEach((o) => {
            if (odg == o) {
              kompSkor = kompSkor - 5;
              skorKorisnik = skorKorisnik - 5;
              odgovoriKomp.pop(odg);
            }
          });
        });
        if (skorKorisnik > kompSkor) {
          skor.innerHTML =
            `${localStorage.korisnik} je osvojio/la ${skorKorisnik} poena!` +
            `<div> Kompjuter je osvojio ${kompSkor} poena!</div>` +
            `Pobednik je ${localStorage.korisnik}! Čestitamo!`;
        } else if (kompSkor > skorKorisnik) {
          skor.innerHTML =
            `${localStorage.korisnik} je osvojio/la ${skorKorisnik} poena!` +
            `<div> Kompjuter je osvojio ${kompSkor} poena!</div>` +
            `Pobednik je kompjuter - Više sreće drugi put!`;
        } else {
          skor.innerHTML =
            `${localStorage.korisnik} je osvojio/la ${skorKorisnik} poena!` +
            `<div> Kompjuter je osvojio ${kompSkor} poena!</div>` +
            `<div id="rez">Rezultat je nerešen - Pokušajte ponovo!</div>`;
        }
      }, 1000);
      // Stilizovanje
      igrajBtn.style.fontWeight = "500";
      igraKorisnik.style.pointerEvents = "none";
      // Igraj Ponovo
      setTimeout(() => {
        igrajBtn.style.pointerEvents = "auto";
        igrajBtn.value = "Igraj Ponovo!";
        igrajBtn.style.color = "black";
      }, 2000);
    }
  }, 1000);
});

// Korisnik Igra Forma
igraKorisnik.addEventListener("submit", (e) => {
  e.preventDefault();
});

// zavrsi igru
// zavrsiIgru.addEventListener("click", (e) => {
//   e.preventDefault();
//   igraKorisnik.submit();
// });

// popup - pravila
let toggle = () => {
  let popup = document.getElementById("popup");
  popup.classList.toggle("active");
};

pravila.addEventListener("click", () => {
  toggle();
});

close.addEventListener("click", () => {
  toggle();
});
