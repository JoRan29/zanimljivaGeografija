// DOM
let formKorisnik = document.querySelector("#formKorisnik");
let inputKorisnik = document.querySelector("#korisnik");
let formPredlog = document.querySelector("#formPredlog");
let inputPredlog = document.querySelector("#predlog");

console.log(formKorisnik, formPredlog);
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
  // metodi
  ispis() {
    console.log(this.zgeografija);
  }
  // metod za dodavanje novog pojma
  async dodajPojam(poj) {
    let date = new Date();

    let predlog = {
      korisnik: this.korisnik,
      kategorija: this.kategorija,
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
  // metod za pocetno veliko slovo
  prvoSlovo(poj) {
    let pocetnoSlo = poj.slice(0, 1);
    pocetnoSlo.toUpperCase();
    return pocetnoSlo;
  }
}

// korisnk lokalna memorija
// get username from local memory
let korisnik = () => {
  if (localStorage.korisnik) {
    return localStorage.korisnik;
  } else {
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
  console.log("true or false:" + zgeo.proveriPojam(predlog));
  if (zgeo.proveriPojam(predlog)) {
    console.log("Rec vec postoji!");
    return "Postoji";
  } else {
    console.log("Novi pojam dodat u bazu!");
    zgeo.dodajPojam(predlog);
  }
});

// bez korisnickog imena
if (!localStorage.korisnik) {
  console.log(`Izaberi korisnicko ime: `);
  // document.body.style.innerHTML = "";
  document.body.style.pointerEvents = "none";
}
