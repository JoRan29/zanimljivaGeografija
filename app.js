// DOM
let formKorisnik = document.querySelector("#formKorisnik");
let inputKorisnik = document.querySelector("#korisnik");
let formPredlog = document.querySelector("#formPredlog");
let inputPredlog = document.querySelector("#predlog");
let inputSelect = document.querySelector("#select");
let pozdrav = document.querySelector("#pozdrav");
// console.log(pozdrav);
// console.log(formKorisnik, formPredlog);

// Klasa
class Geografija {
  constructor(kor, kat, poj, slo) {
    this.korisnik = kor;
    this.kategorija = kat;
    this.pojam = poj;
    this.pocetnoSlovo = slo;
    this.zgeografija = db.collection("pojmovi");
  }
  // geteri i seteri
  get korisnik() {
    return this._korisnik;
  }
  set korisnik(k) {
    this._korisnik = k;
  }
  get kategorija() {
    return this._kategorija;
  }
  set kategorija(kat) {
    this._kategorija = kat;
  }
  get pojam() {
    return this._pojam;
  }
  set pojam(p) {
    this._pojam = p;
  }
  get slovo() {
    return this._pocetnoSlovo;
  }
  set slovo(s) {
    this._pocetnoSlovo = s;
  }
  // metod za dodavanje novog pojma
  async dodajPojam(poj, kat) {
    let date = new Date();

    let predlog = {
      korisnik: this.korisnik,
      kategorija: kat,
      pojam: poj,
      pocetnoSlovo: this.prvoSlovo(poj),
      vreme: firebase.firestore.Timestamp.fromDate(date),
    };

    let response = await this.zgeografija.add(predlog);
    return response;
  }
  // metod za proveru pojma
  async proveriPojam(p) {
    let count = 0;
    this.zgeografija
      .get()
      .then((snap) => {
        snap.forEach((doc) => {
          console.log(doc.data().pojam);
          let pojam = doc.data().pojam;
          if (pojam == p) {
            console.log("Exist");
            count += 1;
          } else {
            console.log("Does not exist");
          }
        });
      })
      .catch((err) => {
        console.error(err);
      });
    // return false;
    console.log(count);
    return count;
  }
  // metod za promenu korisnika
  promeniKorisnika(korisnik) {
    this.korisnik = korisnik;
    localStorage.setItem("korisnik", korisnik);
  }
  // metod za pocetno slovo
  prvoSlovo(poj) {
    let pocetnoSlo = poj.slice(0, 1);
    pocetnoSlo.toUpperCase();
    return pocetnoSlo;
  }
  // metod za postavljanje velikog prvog slova od predlozene reci
  veliko(predlog) {
    return predlog.charAt(0).toUpperCase() + predlog.slice(1);
  }
}

// korisnk lokalna memorija
// get username from local memory
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
});

// dodaj pojam
formPredlog.addEventListener("submit", (e) => {
  e.preventDefault();
  let predlog = inputPredlog.value;
  let kategorija = inputSelect.value;
  let patternReg = /^\S*$/;
  if (patternReg.test(predlog) && predlog.length) {
    predlogCap = zgeo.veliko(predlog);
    console.log("Predlog odgovara!" + predlogCap);
    // dodavanje u bazu
    // zgeo.dodajPojam(predlog, kategorija);
    // console.log("Novi pojam dodat u bazu!");
  } else {
    console.log("Predlog ne sme sadrzati prazne karaktere!");
  }
});

// bez korisnickog imena
if (!localStorage.korisnik) {
  console.log(`Izaberi korisnicko ime: `);
  // document.body.style.innerHTML = "";
  document.body.style.pointerEvents = "none";
  alert(`Ne mozete pristupiti stranici bez korisnickog imena!`);
}
