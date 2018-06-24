"use strict";

const THIS_COMMIT = "606405b5ab7aa28d8191958504e8aad4649666c9";
const LAST_COMMIT = "33907618abf4bc2512b509a88c037ae36d20394c";

const fs = require("fs");

let utils = require("../utils");

// Ethereum VM (EVM) Opcodes and Instruction Reference
let refSource = fs.readFileSync("./data/opcode_instruction_reference.txt").toString();

// we are not interesten in first two rows
utils.parseByLine(refSource).slice(2).forEach((line) => {
    let parsed = line.trim().replace(/^\|/, "").replace(/\|$/, "").split("|").map((el) => el.trim());

    let data = {
        hex: parsed[0].replace(/`/g, "").trim(),
        mnemonic: parsed[1],
        description: parsed[2],
        extra: parsed[3],
        gas: parsed[4],
    };
    if(data.extra === "-" || typeof data.extra === "undefined") {
        return;
    }

    let jsonData = {
        hex: data.hex,
        link: data.extra.replace("/master", "/" + THIS_COMMIT).replace(THIS_COMMIT, LAST_COMMIT),
    };

    let opcode = utils.findOpcodeByHex(jsonData.hex);
    if(utils.isEmpty(opcode)) {
        return;
    }

    utils.extend(opcode, jsonData);
});

utils.saveCommon();
