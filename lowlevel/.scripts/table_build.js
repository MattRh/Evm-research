"use strict";

const fs = require("fs");
const toMarkdown = require("json-to-markdown-table");

function compileTable(arr, columns = [], extend_columns = false) {
    if(!columns.length || extend_columns) {
        arr.forEach((obj) => {
            Object.keys(obj).forEach((val) => {
                if(!columns.includes(val)) {
                    columns.push(val);
                }
            });
        });
    }

    arr = arr.map((obj) => {
        let newObj = {};

        columns.forEach((col) => {
            if(!obj.hasOwnProperty(col)) {
                newObj[formatHead(col)] = " ";
            }
        });

        for(let key in obj) {
            if(obj.hasOwnProperty(key)) {
                let val = obj[key];
                if(typeof val === "undefined") {
                    val = " ";
                }
                if(key === 'mnemonic' && Array.isArray(val)) {
                    val = val.join(' &#124; '); // inserts vertical line
                }

                newObj[formatHead(key)] = val;
            }
        }

        return newObj;
    });

    columns = columns.map((el) => formatHead(el));

    return toMarkdown(arr, columns);
}

let source = JSON.parse(fs.readFileSync("../opcodes.json").toString());

//let groups = compileTable(source.groups);
//let tiers = compileTable(source.tiers);
let opcodes = compileTable(source.opcodes);

//console.log("### Groups \n\n", groups, "\n");
//console.log("### Tiers \n\n", tiers, "\n");
//console.log("### Opcodes \n\n", opcodes, "\n");

fs.writeFileSync("../opcodes.table.md", "### Opcodes \n\n" + opcodes);

function formatHead(str) {
    if(typeof str === "string") {
        let ucStr = str.charAt(0).toUpperCase() + str.slice(1);
        ucStr = ucStr.replace(/_/g, " ");

        return ucStr;
    }

    return str;
}
