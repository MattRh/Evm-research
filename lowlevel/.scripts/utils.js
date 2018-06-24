"use strict";

const paramsRightOrder = [
    "hex",
    "mnemonic",
    "assembly",
    "pops",
    "pushes",
    "tier",
    "description",
    "gas",
    "gas_function",
    "additional_items",
    "side_effects",
    "tentative",
    "internal",
    "assembly_description",
    "assembly_since",
    "link"
];

const fs = require("fs");
const merge = require("merge");

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
    extend,
    ucFirst,
    isEmpty,
};

function findOpcodeByName(opcodeName) {
    let opcode = commonData.opcodes.find((el) => {
        let elMnemonic = el.mnemonic;
        if(!elMnemonic) {
            return false;
        }

        if(typeof elMnemonic === "string") {
            elMnemonic = Array(elMnemonic);
        }

        return elMnemonic.includes(opcodeName);
    });
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

    // remove empty data
    commonData.opcodes = commonData.opcodes.filter((opcode) => !isEmpty(opcode));
    // sort opcodes by hex
    commonData.opcodes = commonData.opcodes.sort((a, b) => {
        return hexToInt(a.hex) - hexToInt(b.hex);
    });
    // sort opcode properties
    commonData.opcodes = commonData.opcodes.map((op) => {
        let sortedOp = {};

        paramsRightOrder.forEach((param) => {
            if(op.hasOwnProperty(param)) {
                sortedOp[param] = op[param];
            }
        });

        merge(sortedOp, op);

        return sortedOp;
    });

    // check for duplicates
    let checkForDups = false;
    if(checkForDups) {
        let foundDups = new Set();
        commonData.opcodes.forEach((opcode) => {
            let dupOp;
            if(!foundDups.has(opcode.hex) && (dupOp = commonData.opcodes.find((el) => el.hex === opcode.hex)) && dupOp.mnemonic !== opcode.mnemonic) {
                foundDups.add(opcode.hex);

                console.log("-------------");
                console.log("Found duplicate", dupOp, opcode);
                console.log("-------------");
            }
        });
    }

    fs.writeFileSync("../opcodes.json", stringify(commonData, {
        indent: 4,
        maxLength: 90,
    }));
}

function parseByLine(rawSource, removeSpare = true) {
    let lines = rawSource.replace(/\t/g, "").split("\r\n").map(str => str.trim().replace(/,$/, "").trim());
    if(removeSpare) {
        lines = lines.filter((line) => !!line && line.length > 0).filter((line) => !/^\/\//.test(line)); // remove empty strings and comment lines
    } else {
        lines = lines.map((line) => !!line && line.length > 0 ? line : null); // convert empty strings to null
    }

    return lines;
}

function intToHex(num) {
    let hex = num.toString(16);
    if(hex.length === 1) {
        hex = "0" + hex;
    }

    return "0x" + hex;
}

function hexToInt(hex) {
    return parseInt(hex, 16);
}

function isEmpty(obj) {
    return Object.keys(obj).length === 0;
}

function extend(original, extension) {
    if(original.mnemonic && extension.mnemonic && original.mnemonic !== extension.mnemonic) {
        if(!Array.isArray(original.mnemonic)) {
            original.mnemonic = Array(original.mnemonic);
        }

        if(!original.mnemonic.includes(extension.mnemonic)) {
            original.mnemonic.push(extension.mnemonic);
        }
    }

    return merge(original, merge(extension, original));
}

function ucFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
