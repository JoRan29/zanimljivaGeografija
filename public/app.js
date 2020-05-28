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
let username = document.querySelector("#username");

// korisnk lokalna memorija
let korisnik = () => {
  if (localStorage.korisnik) {
    pozdrav.innerHTML =
      `Zdravo, ${localStorage.korisnik}!` +
      `<div id="poruka"> Nadamo se da ćete se lepo zabaviti! </div>`;
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
  // osvezi stranu
  location.reload();
});

// vs
if (localStorage.korisnik) {
  vs.innerHTML = `${localStorage.korisnik}`;
} else {
  vs.innerHTML = `Izazivač`;
}

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
        alert("Pojam vec postoji!");
      }
    });
  } else {
    console.log("Predlog ne sme sadrzati prazne karaktere!");
    alert("Nevažeći pojam!");
  }
  formPredlog.reset();
});

// bez korisnickog imena
if (
  !localStorage.korisnik ||
  localStorage.korisnik == undefined ||
  localStorage.korisnik == "anonimus"
) {
  console.log(`Izaberi korisnicko ime: `);
  formPredlog.style.pointerEvents = "none";
  formPredlog.style.opacity = "0.5";
  igraKorisnik.style.pointerEvents = "none";
  igraKorisnik.style.opacity = "0.5";
  username.innerHTML = "Izaberi korisničko ime:";
  igrajBtn.style.pointerEvents = "none";
  igrajBtn.style.backgroundColor = "gray";
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

  top5.forEach((t) => {
    let li = `<li>`;
    li += `${t}</li></br>`;
    ulPoznati.innerHTML += li;
  });
});

// Igraj Dugme
let pocetnoSlovo;

igrajBtn.addEventListener("click", (e) => {
  e.preventDefault();
  igraKomp.reset();
  // Odgovori
  let odgovoriKomp = [];
  let odgovoriKor = [];
  // Podesi Skor
  let kompSkor = 0;
  let skorKorisnik = 0;
  // Izaberi Slovo
  // let abeceda = "ABCČĆDĐEFGHIJKLMNOPRSTUVZŽ".split("");
  // abeceda.push("Dž", "Nj", "Lj");
  let abeceda = ["A"];
  pocetnoSlovo = zgeo.random(abeceda);
  slovo.innerHTML = pocetnoSlovo;
  // Podesi odbrojavanje
  let countdown = 60;
  igrajBtn.style.pointerEvents = "none";
  igraKorisnik.style.pointerEvents = "auto";
  igraKorisnik.reset();
  let snd = new Audio("beep.mp3");
  // Zavrsi igru
  zavrsiIgru.addEventListener("click", (e) => {
    e.preventDefault();
    countdown = 1;
  });
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
          // uzmi jedan pojam nasumice iz baze na osnocu slova i kategorije
          let pojam = zgeo.random(d);
          // nasumicno netacno
          let per = Math.random();
          if (per <= 0.2) {
            pojam = undefined;
          }
          if (pojam != undefined) {
            i.value = `${pojam}`;
            odgovoriKomp.push(pojam + " " + i.id);
          } else {
            i.value = `:(`;
          }
        });
      });
      // Igrac submit odgovore - Korisnik Forma
      igraInput.forEach((i) => {
        let veliko = zgeo.veliko(i.value);
        if (
          veliko == "" ||
          veliko == undefined ||
          veliko.startsWith(pocetnoSlovo) == false
        ) {
          i.value += " +0";
        }
        if (veliko != "" && veliko.startsWith(pocetnoSlovo)) {
          zgeo.proveriPojam(veliko, i.id, (data) => {
            if (data) {
              console.log("Netacno!");
            } else {
              console.log("Pogodak!");
              odgovoriKor.push(veliko + " " + i.id);
            }
          });
        }
      });
      console.log(odgovoriKomp);
      console.log(odgovoriKor);
      // Racunanje rezultata
      window.scrollTo(0, 750);
      skor.innerHTML = `Računamo konačan rezultat...`;
      // TODO Fix Score
      setTimeout(() => {
        // Rezultat + Prikazi Skor
        odgovoriKomp.forEach((odg) => {
          let odg1 = odg.split(/(?<=^\S+)\s/);
          console.log(odg1);
          odgovoriKor.forEach((o) => {
            let o1 = o.split(/(?<=^\S+)\s/);
            console.log(o1);
            if (odg1[1] == o1[1] && odg1[0] == o1[0]) {
              // +5 - isti odgovori
              igraInput.forEach((i) => {
                if (i.id == odg1[1]) {
                  i.value += " +5";
                  skorKorisnik += 5;
                }
              });
              kompInput.forEach((i) => {
                if (i.id == odg1[1]) {
                  i.value += " +5";
                  kompSkor += 5;
                }
              });
            } else if (odg1[1] == o1[1] && odg1[0] != o1[0]) {
              // +10
              kompInput.forEach((i) => {
                if (i.id == odg1[1]) {
                  i.value += " +10";
                  kompSkor += 10;
                }
              });
              igraInput.forEach((i) => {
                if (i.id == odg1[1]) {
                  i.value += " +10";
                  skorKorisnik += 10;
                }
              });
            }
            kompInput.forEach((i) => {
              if (i.value == ":(" || i.value == undefined) {
                i.value += " +0";
              }
            });
            igraInput.forEach((i) => {
              if (i.value == " " || i.value == undefined) {
                i.value += " +0";
              }
            });
          });
        });
        setTimeout(() => {
          // +15
          igraInput.forEach((i) => {
            console.log(i.value);
            if (i.value.includes("+") == false) {
              i.value += " +15";
              skorKorisnik += 15;
            }
          });
          kompInput.forEach((i) => {
            if (i.value.includes("+") == false) {
              i.value += " +15";
              kompSkor += 15;
            }
          });
        }, 200);
        // // Rezultat
        // kompSkor = odgovoriKomp.length * 10;
        // skorKorisnik = odgovoriKor.length * 10;
        // let razlika = odgovoriKomp.length - odgovoriKor.length;
        // if (razlika > 0) {
        //   kompSkor += razlika * 15;
        //   kompSkor += razlika * -10;
        // }
        // let razlika2 = odgovoriKor.length - odgovoriKomp.length;
        // if (razlika2 > 0) {
        //   skorKorisnik += razlika2 * 15;
        //   skorKorisnik += razlika2 * -10;
        // }
        // odgovoriKomp.forEach((odg) => {
        //   odgovoriKor.forEach((o) => {
        //     if (odg == o) {
        //       kompSkor = kompSkor - 5;
        //       skorKorisnik = skorKorisnik - 5;
        //       odgovoriKomp.pop(odg);
        //     }
        //   });
        // });
        // Skor
        let win = new Audio("win.mp3");
        let sad = new Audio("sad.mp3");
        setTimeout(() => {
          if (skorKorisnik > kompSkor) {
            skor.innerHTML =
              `${localStorage.korisnik} je osvojio/la ${skorKorisnik} poena!` +
              `<div> Kompjuter je osvojio ${kompSkor} poena!</div>` +
              `<div id="rez">Pobednik je ${localStorage.korisnik}! Čestitamo!</div>`;
            win.play();
          } else if (kompSkor > skorKorisnik) {
            skor.innerHTML =
              `${localStorage.korisnik} je osvojio/la ${skorKorisnik} poena!` +
              `<div> Kompjuter je osvojio ${kompSkor} poena!</div>` +
              `<div id="rez">Pobednik je kompjuter - Više sreće drugi put!</div>`;
            sad.play();
          } else {
            skor.innerHTML =
              `${localStorage.korisnik} je osvojio/la ${skorKorisnik} poena!` +
              `<div> Kompjuter je osvojio ${kompSkor} poena!</div>` +
              `<div id="rez">Rezultat je nerešen - Pokušajte ponovo!</div>`;
          }
        }, 400);
      }, 1000);
      // Stilizovanje
      igrajBtn.style.fontWeight = "500";
      igraKorisnik.style.pointerEvents = "none";
      // Igraj Ponovo
      setTimeout(() => {
        igrajBtn.style.pointerEvents = "auto";
        igrajBtn.value = "Igraj Ponovo!";
        igrajBtn.style.color = "black";
        igrajBtn.style.fontSize = "20px";
      }, 2000);
    }
  }, 1000);
});

// Korisnik Igra Forma
igraKorisnik.addEventListener("submit", (e) => {
  e.preventDefault();
});

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
