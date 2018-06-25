"use strict";

const VERSIONS = {
    F: "Frontier",
    H: "Homestead",
    B: "Byzantium",
    C: "Constantinople",
    S: "Serenity",
};

const fs = require("fs");
const merge = require("merge");

let utils = require("../utils");

// assembly.rst
let assSource = fs.readFileSync("./data/assembly_list_source.txt").toString();

// we are not interested in first row
parseRst(assSource).slice(2).forEach((line) => {
    let data = {
        assembly: line[0],
        doesPush: line[1],
        version: line[2],
        description: line[3],
    };

    if(/\.\.\./.test(data.assembly)) {
        let parts = data.assembly.split("...").map((el) => el.trim());
        let name = parts[0].replace(/\d/g, "").trim();

        let is = [];
        parts.forEach((el) => {
            is.push(Number(el.match(/\d/g).join("")));
        });

        let maxI = Math.max(...is);
        let minI = Math.min(...is);

        for(let i = minI; i <= maxI; i++) {
            let dataClone = merge.clone(data);
            dataClone.assembly = name + i;

            insertData(dataClone);
        }
    } else {
        insertData(data);
    }
});

utils.saveCommon();


function insertData(data) {
    let jsonData = {
        mnemonic: getMnemonic(data.assembly),
        assembly: data.assembly,
        assembly_since: VERSIONS[data.version],
        assembly_description: utils.ucFirst(data.description.replace(/``/g, "`")),
    };

    let opcode = utils.findOpcodeByName(jsonData.mnemonic);
    if(utils.isEmpty(opcode)) {
        console.log("skipped", jsonData);
        return;
    }

    if(opcode.description && simplifyStr(opcode.description) === simplifyStr(jsonData.assembly_description)) {
        console.log("desc del");
        delete jsonData.assembly_description;
    }

    utils.extend(opcode, jsonData);
}

function parseRst(source) {
    let rows = [];
    let curRow = 0;

    utils.parseByLine(source).forEach((line) => {
        if(/^[+\-=]*$/g.test(line)) {
            curRow++;
            return;
        }

        // we suppose that all rows are of same count of cells
        let splitted = line.trim().replace(/^\|/, "").replace(/\|$/, "").split("|").map((el) => el.replace(/\s+$/, ""));

        if(!rows[curRow]) {
            rows[curRow] = splitted;
        } else {
            rows[curRow] = rows[curRow].map((el, i) => {
                return el + splitted[i];
            });
        }
    });

    rows = rows.map((row) => row.map((el) => el.trim()));

    return rows;
}

function getMnemonic(assembly) {
    return assembly.split("(")[0].toUpperCase();
}

function simplifyStr(str) {
    return str.replace(/[ .,]*/g, "").trim().toLowerCase();
}
