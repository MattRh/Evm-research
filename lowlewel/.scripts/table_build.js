"use strict";

const fs = require("fs");
const toMarkdown = require("json-to-markdown-table");

let utils = require("./utils");

function compileTable(arr, columns = []) {
    if(!columns.length) {
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
                newObj[ucFirst(col)] = " ";
            }
        });

        for(let key in obj) {
            if(obj.hasOwnProperty(key)) {
                let val = obj[key];
                if(typeof val === "undefined") {
                    val = " ";
                }

                newObj[ucFirst(key)] = val;
            }
        }

        return newObj;
    });

    columns = columns.map((el) => ucFirst(el));

    return toMarkdown(arr, columns);
}

let source = JSON.parse(fs.readFileSync("../opcodes.json").toString());

let groups = compileTable(source.groups);
let tiers = compileTable(source.tiers);
let opcodes = compileTable(source.opcodes);

//console.log("### Groups \n\n", groups, "\n");
//console.log("### Tiers \n\n", tiers, "\n");
console.log("### Opcodes \n\n", opcodes, "\n");

function ucFirst(str) {
    if(typeof str === "string") {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    return str;
}
