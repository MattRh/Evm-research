"use strict";

const fs = require("fs");
const merge = require("merge");

let utils = require("../utils");

// evm.py
let manSource = fs.readFileSync("./data/manticore_source.txt").toString();

utils.parseByLine(manSource).forEach((row) => {
    let rawData = row.split(": (");

    let rawDataList = rawData[1].split(",").map(str => str.trim());

    let data = [
        rawData[0], // opcode
        rawDataList[0].replace(/'/g, ""), // name
        Number(rawDataList[1]), // immediate_operand_size
        Number(rawDataList[2]), // pops
        Number(rawDataList[3]), // pushes
        Number(rawDataList[4]), // gas
        rawDataList[5].replace(/\)$/g, "").replace(/^'|"(.*)'|"$/, "$1").replace(/.$/, ""), // description
    ];

    let jsonData = {
        hex: data[0],
        mnemonic: data[1],
        additional_items: data[2],
        pops: data[3],
        pushes: data[4],
        gas: data[5],
        description: data[6],
    };

    let opcode = utils.findOpcodeByHex(jsonData.hex);
    if(opcode.description && opcode.description.length > 0) {
        delete jsonData.description;
    }

    merge(opcode, jsonData);
});

utils.saveCommon();
