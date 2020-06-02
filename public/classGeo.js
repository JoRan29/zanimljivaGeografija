export class Geografija {
  constructor(k, kat, poj, slo) {
    this.korisnik = k;
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

    if (kat == "" || kat == "Izaberi kategoriju") {
      alert("Morate izabrati jednu od kategorija");
    } else if (poj == "") {
      alert("Nevažeći pojam!");
    } else {
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
  }
  // metod za proveru pojma
  proveriPojam(p, k, callback) {
    let flag = true;
    this.zgeografija
      .where("kategorija", "==", k)
      .where("pojam", "==", p)
      .get()
      .then((snap) => {
        snap.forEach((doc) => {
          let pojam = doc.data().pojam;
          if (pojam) {
            flag = false;
          }
        });
        callback(flag);
      })
      .catch((err) => {
        console.error(err);
      });
  }
  // metod za promenu korisnika
  promeniKorisnika(korisnik) {
    this.korisnik = korisnik;
    localStorage.setItem("korisnik", korisnik);
  }
  // metod za pocetno slovo
  prvoSlovo(poj) {
    if (
      poj.slice(0, 2) === "Nj" ||
      poj.slice(0, 2) === "Lj" ||
      poj.slice(0, 2) === "Dž"
    ) {
      let pocetnoSlo = poj.slice(0, 2);
      pocetnoSlo.toUpperCase();
      return pocetnoSlo;
    } else {
      let pocetnoSlo = poj.slice(0, 1);
      pocetnoSlo.toUpperCase();
      return pocetnoSlo;
    }
  }
  // metod za postavljanje velikog prvog slova od predlozene reci
  veliko(predlog) {
    return predlog.charAt(0).toUpperCase() + predlog.slice(1).toLowerCase();
  }
  najviseUnosa(callback) {
    let arr = [];
    this.zgeografija
      .orderBy("korisnik", "desc")
      .get()
      .then((snap) => {
        snap.forEach((doc) => {
          // console.log(doc.data().korisnik);
          arr.push(doc.data().korisnik);
        });
        callback(arr);
      })
      .catch((err) => {
        console.error(err);
      });
  }
  random(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }
  uzmiPojam(k, ps, callback) {
    let arr = [];
    this.zgeografija
      .where("kategorija", "==", k)
      .where("pocetnoSlovo", "==", ps)
      .get()
      .then((snap) => {
        snap.forEach((doc) => {
          let pojam = doc.data().pojam;
          arr.push(pojam);
        });
        callback(arr);
      })
      .catch((err) => {
        console.error(err);
      });
  }
}
