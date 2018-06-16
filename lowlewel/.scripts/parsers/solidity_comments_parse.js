"use strict";

const fs = require("fs");
const merge = require("merge");

let utils = require("../utils");

// Instruction.h
let comSource = fs.readFileSync("./data/solidity_comments_source.txt").toString();

let curIntHex = 0;
utils.parseByLine(comSource).forEach((row) => {
    let list1 = row.split("///<").map(str => str.trim());
    let list2 = list1[0].replace(/.$/, "").split("=").map(str => str.trim());

    if(list2[1]) {
        curIntHex = utils.hexToInt(list2[1]);
    } else {
        list2[1] = "0x" + utils.intToHex(curIntHex);
    }

    let jsonData = {
        hex: list2[1],
        mnemonic: list2[0],
        description: ucFirst(list1[1]),
    };

    let opcode = utils.findOpcodeByHex(jsonData.hex);
    merge(opcode, jsonData);

    curIntHex++;
});

function ucFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
