"use strict";

const fs = require("fs");
const merge = require("merge");

let utils = require("../utils");

// Instruction.cpp
let solSource = fs.readFileSync("./data/solidity_source.txt").toString();

utils.parseByLine(solSource).forEach((row) => {
    let rawData = row.split(",{")[1].replace(" } }", "").split(",").map(str => str.trim());
    let data = [
        JSON.parse(rawData[0]),
        Number(rawData[1]),
        Number(rawData[2]),
        Number(rawData[3]),
        rawData[4] === "true",
        rawData[5].replace("Tier::", ""),
    ];

    let jsonData = {
        mnemonic: data[0],
        additional_items: data[1],
        pops: data[2],
        pushes: data[3],
        side_effects: data[4],
        tier: data[5],
    };

    let opcode = utils.findOpcodeByName(jsonData.mnemonic);
    merge(opcode, jsonData);
});

utils.saveCommon();
