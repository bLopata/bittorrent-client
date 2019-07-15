"use strict";

const dgram = require("dgram");
const Buffer = require("buffer").Buffer;
const urlParse = require("url").parse;
const crypto = require("crypto");

module.exports.getPeers = (torrent, callback) => {
  const socket = dgram.createSocket("udp4");
  const url = torrent.announce.toString("utf8");

  udpSend(socket, buildConnReq(), url);

  socket.on("message", res => {
    if (respType(res) === "connect") {
      const connResp = parseConnResp(res);

      const announceReq = buildAnnounceReq(connResp.connectionId);
      udpSend(socket, announceReq, url);
    } else if (respType(res) === "announce") {
      const announceResp = parseAnnounceResp(res);

      callback(announceResp.peers);
    }
  });
};

function udpSend(socket, message, rawUrl, callback = () => {}) {
  const url = urlParse(rawUrl);
  socket.send(message, 0, message.length, url.port, url.host, callback);
}

function respType(res) {}

function buildConnReq() {
  const buf = Buffer.alloc(16);

  buf.writeUInt32BE(0x417, 0);
  buf.writeUInt32BE(0x27101980, 4);

  buf.writeUInt32BE(0, 8);

  crypto.randomBytes(4).copy(buf, 12);

  return buf;
}

function parseConnResp(res) {
  return {
    action: res.readUInt32BE(0),
    transactionId: res.readUInt32BE(4),
    connectionId: res.slice(8)
  };
}

function buildAnnounceReq(connId, torrent, port = 6881) {
  const buf = Buffer.allocUnsafe(98);

  connId.copy(buf, 0);

  buf.writeUInt32BE(1, 8);

  crypto.randomBytes(4).copy(buf, 12);

  torrentParser.infoHash(torrent).copy(buf, 16);

  util.genId().copy(buf, 36);

  Buffer.alloc(8).copy(buf, 56);

  torrentParser.size(torrent).copy(buf, 64);

  Buffer.alloc(8).copy(buf, 72);

  buf.writeUInt32BE(0, 80);

  buf.writeUInt32BE(0, 80);

  crypto.randomBytes(4).copy(buf, 88);

  buf.writeInt32BE(-1, 92);

  buf.writeUInt16BE(port, 96);

  return buf;
}

function parseAnnounceResp(res) {
  function group(iterable, groupSize) {
    let groups = [];
    for (let i = 0; i < iterable.length; i += groupSize) {
      groups.push(iterable.slice(i, i + groupSize));
    }
    return groups;
  }

  return {
    action: res.readUInt32BE(0),
    transactionId: res.readUInt32BE(4),
    leechers: res.readUInt32BE(8),
    seeders: res.readUInt32BE(12),
    peers: group(res.slice(20), 6).map(address => {
      return {
        ip: address.slice(0, 4).join("."),
        port: address.readUInt32BE(4)
      };
    })
  };
}
