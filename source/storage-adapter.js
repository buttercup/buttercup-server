const path = require("path");
const fs = require("fs");

const fileExists = require("file-exists");
const mkdirp = require("mkdirp");

const securityTools = require("./tools/security.js");

function __accountExists(email, config) {
    config = config || global.config;
    switch (config.get("archives.storage")) {
        case "files": {
            let storagePath = config.get("archives.path"),
                accountHash = securityTools.generateAccountHash(email),
                //archiveFilename = `${accountHash}.archive`,
                infoFilename = `${accountHash}.info`;
            return fileExists(path.resolve(storagePath, infoFilename));
        }

        default:
            throw new Error("Invalid or unspecified archive storage mechanism");
    }
}

function __init(config) {
    config = config || global.config;
    switch (config.get("archives.storage")) {
        case "files": {
            let storagePath = config.get("archives.path");
            mkdirp.sync(storagePath);
            break;
        }

        default:
            throw new Error("Invalid or unspecified archive storage mechanism");
    }
}

function __writeInfo(email, text, config) {
    config = config || global.config;
    switch (config.get("archives.storage")) {
        case "files": {
            let storagePath = config.get("archives.path"),
                accountHash = securityTools.generateAccountHash(email),
                infoFilename = `${accountHash}.info`,
                infoPath = path.resolve(storagePath, infoFilename);
            fs.writeFileSync(infoPath, text, "utf8");
            break;
        }

        default:
            throw new Error("Invalid or unspecified archive storage mechanism");
    }
}

module.exports = {

    accountExists: function(email, config) {
        return __accountExists(email, config);
    },

    initialise: function(config) {
        return __init(config);
    },

    writeInfo: function(email, text, config) {
        __writeInfo(email, text, config);
    }

};
