"use strict";

const fs = require("fs");

let utils = require("../utils");

// Instruction.h
let comSource = fs.readFileSync("./data/ethereum_comments_source.txt").toString();

let curIntHex = 0;
utils.parseByLine(comSource).forEach((row) => {
    let list1 = row.split("///<").map(str => str.trim());
    let list2 = list1[0].replace(/,$/, "").split("=").map(str => str.trim());

    if(list2[1]) {
        curIntHex = utils.hexToInt(list2[1]);
    }

    list2[1] = utils.intToHex(curIntHex);

    let jsonData = {
        hex: list2[1],
        mnemonic: list2[0],
        description: utils.ucFirst(list1[1]),
    };

    let opcode = utils.findOpcodeByName(jsonData.mnemonic);
    if(utils.isEmpty(opcode)) {
        opcode = utils.findOpcodeByHex(jsonData.hex);
    }

    if(utils.isEmpty(opcode)) {
        jsonData.tentative = true;
    }

    utils.extend(opcode, jsonData);

    curIntHex++;
});

utils.saveCommon();
