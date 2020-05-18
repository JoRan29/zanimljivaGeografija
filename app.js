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
    this.slovo = slo;
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
    return this._slovo;
  }
  set slovo(s) {
    this._slovo = s;
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
      slovo: this.prvoSlovo(poj),
      vreme: firebase.firestore.Timestamp.fromDate(date),
    };

    let response = await this.zgeografija.add(predlog);
    return response;
  }
  // metod za proveru pojma
  proveriPojam(poj) {
    let postoji = false;
    this.zgeografija
      .where("kategorija", "==", this.kategorija)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          console.log("ovde", doc.data().pojam);
          if (doc.data().pojam === poj) {
            console.log(`Pojam ${poj} vec postoji!`);
            postoji = true;
            return postoji;
          }
        });
      })
      .catch((err) => {
        console.error(`Greska prilikom provere pojma: ${err}`);
      });
    console.log(`Pojam ${poj} ne postoji u bazi jos uvek!`);
    return postoji;
  }
  // metod za promenu korisnika
  promeniKorisnika(korisnik) {
    this.korisnik = korisnik;
    localStorage.setItem("korisnik", korisnik);
  }
  // metod za pocetno veliko slovo
  prvoSlovo(poj) {
    let pocetnoSlovo = poj.slice(0, 1);
    pocetnoSlovo.toUpperCase();
    return pocetnoSlovo;
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
  if (
    inputPredlog.value.length &&
    zgeo.proveriPojam(inputPredlog.value) == false
  ) {
    zgeo.dodajPojam(inputPredlog.value);
  }
});
