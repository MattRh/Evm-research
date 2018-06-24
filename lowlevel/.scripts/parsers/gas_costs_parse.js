"use strict";

const fs = require("fs");
const parse = require("csv-parse/lib/sync");

let utils = require("../utils");

// evm-opcode-gas-costs
let gasSource = fs.readFileSync("./data/opcode_gas_costs.csv").toString();

parse(gasSource, {columns: true}).forEach((op) => {
    // we are interested in all non-numeric Gas Used
    if(isNaN(op["Gas Used"])) {
        let jsonData = {
            hex: op.Value,
            gas_formula: op["Gas Used"],
        };
        if(jsonData.gas_formula === "NA") {
            jsonData.gas_formula = "N/A";
        }

        let opcode = utils.findOpcodeByHex(jsonData.hex);
        if(utils.isEmpty(opcode)) {
            return;
        }

        utils.extend(opcode, jsonData);
    }
});

utils.saveCommon();
