"use strict";
const fs = require("fs");
const torrent = fs.readFileSync("./faces.torrent");
console.log(torrent.toString("utf8"));
