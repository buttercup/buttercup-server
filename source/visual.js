const chalk = require("chalk");

const b = chalk.hex("#00b7ac");
const B = b.bold;
const w = chalk.white;

const TITLE = `${w("┌───┐")}
${w("│")} ${B("b")} ${w("│")}  ${chalk.dim("■")}  ${w("__TITLE__")}
${w("└───┘")}`;

function generateTitle(title) {
    return TITLE.replace("__TITLE__", title);
}

module.exports = {
    generateTitle
};
