"use strict";
const download = require("./src/download");
const torrentParser = require("./src/torrent-parser");

const torrent = torrentParser.open(process.argv[2]);

try {
  download(torrent, torrent.info.name);
} catch (ex) {
  console.log(`error: ${ex.info}`);
}
