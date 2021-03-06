class Game {
  constructor(p1, p2) {
    this._players = [p1, p2];
    this._turns = [null, null];
    this._sendToPlayers("Igra Počinje!");

    this._players.forEach((player, i) => {
      player.on("turn", (turn) => {
        this._onTurn(i, turn);
      });
    });
  }

  _sendToPlayer(playerIndex, msg) {
    this._players[playerIndex].emit("message", msg);
  }

  _sendToPlayers(msg) {
    this._players.forEach((p) => {
      p.emit("message", msg);
    });
  }

  _sendResult(res) {
    this._players.forEach((p) => {
      p.emit("result", res);
    });
  }

  _onTurn(playerIndex, turn) {
    this._turns[playerIndex] = turn;
    this._sendToPlayer(playerIndex, `Osvojili ste ${turn} poena!`);

    this._checkGameOver();
  }

  _checkGameOver() {
    const turns = this._turns;

    if (turns[0] && turns[1]) {
      this._sendResult("Igra je završena!" + "</br>" + turns.join(":"));
      if (turns[0] > turns[1] || !turns[1]) {
        this._sendResult(`Pobednik je osvojio ${turns[0]} poena!`);
      } else if (turns[1] > turns[0] || !turns[0]) {
        this._sendResult(`Pobednik je osvojio ${turns[1]} poena!`);
      } else if (turns[0].length == 0 && turns[1].length == 0) {
        this._sendResult(`Nerešeno!`);
      } else {
        this._sendResult(`Nerešeno!`);
      }
      this._turns = [null, null];
    }
  }

  startTimeout(broj) {
    let clock = setInterval(() => {
      broj--;
      if (broj > 0) {
        console.log(broj);
        return broj;
      }
      if (broj === 0) {
        console.log("Vreme je isteklo!");
        clearInterval(clock);
        return "Kraj!";
      }
    }, 1000);
  }

  randomSlovo() {
    let abeceda = "ABCČĆDĐEFGHIJKLMNOPRSTUVZŽ".split("");
    abeceda.push("Dž", "Nj", "Lj");
    let pocetnoSlovo = abeceda[Math.floor(Math.random() * abeceda.length)];
    console.log(pocetnoSlovo);
    return pocetnoSlovo;
  }
}

module.exports = Game;
