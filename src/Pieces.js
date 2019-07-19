"use strict";

const tp = require("./torrent-parser");

module.exports = class {
  constructor(torrent) {
    function buildPiecesArray() {
      const nPieces = torrent.info.pieces.length / 20;
      const arr = new Array(nPieces).fill(null);
      return arr.map(
        (_, i) => new Array(tp.blocksPerPiece(torrent, i).fill(false))
      );
    }
    this.requested = buildPiecesArray();
    this.received = buildPiecesArray();
  }

  addRequested(pieceBlock) {
    const blockIndex = pieceBlock.begin / tp.BLOCK_LEN;
    this.requested[pieceBlock][blockIndex] = true;
  }

  addReceived(pieceBlock) {
    const blockIndex = pieceBlock.begin / tp.BLOCK_LEN;
    this.received[pieceBlock][blockIndex] = true;
  }

  needed(pieceBlock) {
    if (this.requested.every(blocks => blocks.every(i => i))) {
      this.requested = this._received.map(blocks => blocks.slice);
    }
    const blockIndex = pieceBlock.begin / tp.BLOCK_LEN;
    return !this.requested[pieceBlock][blockIndex];
  }

  isDone() {
    return this.received.every(i => i);
  }
};
