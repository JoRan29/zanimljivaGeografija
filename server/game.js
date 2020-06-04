class Game {
  constructor(p1, p2) {
    this._players = [p1, p2];
    this._turns = [null, null];

    this._sendToPlayers("Igra Počinje!");

    // this._startCountdown();

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

  _onTurn(playerIndex, turn) {
    this._turns[playerIndex] = turn;
    this._sendToPlayer(playerIndex, `You selected ${turn}`);
  }

  _checkGameOver() {
    const turns = this._turns;

    if (turns[0] && turns[1]) {
      this._sendToPlayers("Igraj je zavrsena!" + turns.join(":"));
      this._turns = [null, null];
      this._sendToPlayers("Sledeci potez!");
    }
  }
}

module.exports = Game;
