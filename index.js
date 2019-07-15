"use strict";
const fs = require("fs");
const bencode = require("bencode");
const tracker = require("./src/tracker");
const torrentParser = require(process.argv[2]);

const torrent = torrentParser.open("./puppy.torrent");

try {
  tracker.getPeers(torrent, peers => {
    console.log(`list of peers: ${peers}`);
  });
} catch (ex) {
  console.log(`error: ${ex.info}`);
}
