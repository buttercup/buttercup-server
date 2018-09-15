#!/usr/bin/env node

const path = require("path");
const fs = require("fs");
const commandLineArgs = require("command-line-args");
const chalk = require("chalk");
const pify = require("pify");
const passwordPrompt = require("password-prompt");
const ConfirmPrompt = require("prompt-confirm");
const { generateTitle } = require("../visual.js");

const writeFile = pify(fs.writeFile);

const DEFAULT_FILENAME = path.resolve(process.cwd(), "./.bcupserver.conf.json");
const ARGS = [
    { name: "port", alias: "p", type: Number, defaultValue: 9100 },
    { name: "output", alias: "o", type: String, multiple: false, defaultOption: true, defaultValue: DEFAULT_FILENAME }
];
const CONFIG_BASE = {
    archives: [],
    port: null
};

console.log(generateTitle("Buttercup / Config generation"));

const options = commandLineArgs(ARGS);

let password;
console.log("");
passwordPrompt("Admin password: ", { method: "hide" })
    .then(pass => {
        password = pass;
        return passwordPrompt("Confirm password: ", { method: "hide" });
    })
    .then(passwordConfirm => {
        if (password !== passwordConfirm) {
            console.error("Passwords didn't match");
            process.exit(2);
        } else if (password.length <= 0) {
            console.error("Password is required");
            process.exit(3);
        }
        console.log("");
        console.log("Confirm that the following settings are correct:");
        console.log(` ${chalk.dim.bold("·")} Port:   ${chalk.white.underline(options.port)}`);
        console.log(` ${chalk.dim.bold("·")} Output: ${chalk.white.underline(options.output)}`);
        console.log("");
        const confirmation = new ConfirmPrompt("Write configration file?");
        return confirmation.run()
    })
    .then(write => {
        if (!write) {
            console.log("Configuration file not written");
            process.exit(0);
        }
        return writeFile(options.output, JSON.stringify(Object.assign(
            {},
            CONFIG_BASE,
            {
                port: options.port
            }
        ), undefined, 2));
    })
    .then(() => {
        console.log(`Wrote configuration file: ${chalk.underline(options.output)}`);
    })
    .catch(err => {
        console.error(`Fatal error: ${err.message}`);
        process.exit(1);
    });
