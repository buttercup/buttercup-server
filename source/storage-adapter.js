const path = require("path");

const fileExists = require("file-exists");

const securityTools = require("./tools/security.js");

function __accountExists(email, config) {
    config = config || global.config;
    switch (config.get("archives.storage")) {
        case "files": {
            let storagePath = config.get("archives.path"),
                accountHash = securityTools.generateAccountHash(email),
                archiveFilename = `${accountHash}.archive`,
                infoFilename = `${accountHash}.info`;
            return fileExists(path.resolve(storagePath, archiveFilename)) &&
                fileExists(path.resolve(storagePath, infoFilename));
        }

        default:
            throw new Error("Invalid or unspecified archive storage mechanism");
    }
}

module.exports = {

    accountExists: function(email, config) {
        return __accountExists(email, config);
    }

};
