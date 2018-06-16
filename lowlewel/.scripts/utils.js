"use strict";

const fs = require("fs");
const stringify = require("json-stringify-pretty-compact");

let dataTxt = fs.readFileSync("../opcodes.json").toString();
let commonData = JSON.parse(dataTxt);

module.exports = {
    commonData,
    findOpcodeByName,
    findOpcodeByHex,
    saveCommon,
    intToHex,
    hexToInt,
    parseByLine,
};

function findOpcodeByName(opcodeName) {
    let opcode = commonData.opcodes.find((el) => el.mnemonic === opcodeName);
    if(!opcode) {
        opcode = {};
        commonData.opcodes.push(opcode);
    }

    return opcode;
}

function findOpcodeByHex(hex) {
    let opcode = commonData.opcodes.find((el) => el.hex === hex);
    if(!opcode) {
        opcode = {};
        commonData.opcodes.push(opcode);
    }

    return opcode;
}

function saveCommon() {
    if(fs.existsSync("../opcodes.json")) {
        fs.renameSync("../opcodes.json", "../opcodes.old.json");
    }

    commonData.opcodes = commonData.opcodes.sort((a, b) => {
        return hexToInt(a.hex) - hexToInt(b.hex);
    });

    fs.writeFileSync("../opcodes.json", stringify(commonData, {
        indent: 4,
        maxLength: 90,
    }));
}

function parseByLine(rawSource) {
    return rawSource.replace(/\t/g, "").split("\r\n").map(str => str.trim().replace(/,$/, "").trim()).filter((line) => line.length > 0);
}

function intToHex(num) {
    return num.toString(16);
}

function hexToInt(hex) {
    return parseInt(hex, 16);
}
