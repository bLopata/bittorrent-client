"use strict";

const net = require("net");
const Buffer = require("buffer").Buffer;
const { getPeers } = require("./tracker");

module.exports = torrent => {
  getPeers(torrent, peers => {
    peers.forEach(download);
  });
};

function download(peer) {
  const socket = net.Socket();
  socket.on("error", console.log());
  socket.connect(peer.port, peer.ip, () => {
    // socket.write(...) write message here
  });
  socket.on("data", data => {
    // handle response here
  });
}
