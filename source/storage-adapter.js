const path = require("path");
const fs = require("fs");

const fileExists = require("file-exists");
const mkdirp = require("mkdirp");

const securityTools = require("./tools/security.js");
const Logger = require("./logger.js");

function __accountExists(email, config) {
    config = config || global.config;
    return new Promise(function(resolve, reject) {
        switch (config.get("archives.storage")) {
            case "files": {
                let storagePath = config.get("archives.path"),
                    accountHash = securityTools.generateAccountHash(email),
                    infoFilename = `${accountHash}.info`;
                resolve(fileExists(path.resolve(storagePath, infoFilename)));
            }

            default:
                throw new Error("Invalid or unspecified archive storage mechanism");
        }
    });
}

function __getArchiveContents(email, config) {
    config = config || global.config;
    const log = Logger.getSharedInstance();
    let storageType = config.get("archives.storage");
    return new Promise(function(resolve, reject) {
        switch (storageType) {
            case "files": {
                let storagePath = config.get("archives.path"),
                    accountHash = securityTools.generateAccountHash(email),
                    archiveFilename = `${accountHash}.archive`,
                    archivePath = path.resolve(storagePath, archiveFilename);
                if (fileExists(archivePath) !== true) {
                    // return empty (new archive)
                    return "";
                }
                fs.readFile(archivePath, "utf8", function(err, data) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(data);
                    }
                });
                break;
            }

            default:
                log.error({ storageType }, "unknown storage type");
                throw new Error("Invalid or unspecified archive storage mechanism");
        }
    });
}

function __getInfo(email, config) {
    config = config || global.config;
    const log = Logger.getSharedInstance();
    let storageType = config.get("archives.storage");
    return new Promise(function(resolve, reject) {
        switch (storageType) {
            case "files": {
                let storagePath = config.get("archives.path"),
                    accountHash = securityTools.generateAccountHash(email),
                    infoFilename = `${accountHash}.info`,
                    infoPath = path.resolve(storagePath, infoFilename);
                if (fileExists(infoPath) !== true) {
                    resolve(null);
                }
                fs.readFile(infoPath, "utf8", function(err, content) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(JSON.parse(content));
                    }
                });
                break;
            }

            default:
                log.error({ storageType }, "unknown storage type");
                throw new Error("Invalid or unspecified archive storage mechanism");
        }
    });
}

function __init(config) {
    config = config || global.config;
    const log = Logger.getSharedInstance();
    let storageType = config.get("archives.storage");
    switch (storageType) {
        case "files": {
            let storagePath = config.get("archives.path");
            mkdirp.sync(storagePath);
            break;
        }

        default:
            log.error({ storageType }, "unknown storage type");
            throw new Error("Invalid or unspecified archive storage mechanism");
    }
}

function __writeArchive(email, text, config) {
    config = config || global.config;
    const log = Logger.getSharedInstance();
    let storageType = config.get("archives.storage");
    return new Promise(function(resolve, reject) {
        switch (storageType) {
            case "files": {
                let storagePath = config.get("archives.path"),
                    accountHash = securityTools.generateAccountHash(email),
                    archiveFilename = `${accountHash}.archive`,
                    archivePath = path.resolve(storagePath, archiveFilename);
                fs.writeFileSync(archivePath, text, "utf8");
                resolve();
                break;
            }

            default:
                log.error({ storageType }, "unknown storage type");
                throw new Error("Invalid or unspecified archive storage mechanism");
        }
    });
}

function __writeInfo(email, text, config) {
    config = config || global.config;
    const log = Logger.getSharedInstance();
    let storageType = config.get("archives.storage");
    return new Promise(function(resolve, reject) {
        switch (storageType) {
            case "files": {
                let storagePath = config.get("archives.path"),
                    accountHash = securityTools.generateAccountHash(email),
                    infoFilename = `${accountHash}.info`,
                    infoPath = path.resolve(storagePath, infoFilename);
                fs.writeFileSync(infoPath, text, "utf8");
                resolve();
                break;
            }

            default:
                log.error({ storageType }, "unknown storage type");
                throw new Error("Invalid or unspecified archive storage mechanism");
        }
    });
}

module.exports = {

    accountExists: function(email, config) {
        return __accountExists(email, config);
    },

    getArchiveFileContents: function(email, config) {
        return __getArchiveContents(email, config);
    },

    getInfo: function(email, config) {
        return __getInfo(email, config);
    },

    initialise: function(config) {
        return __init(config);
    },

    writeArchive: function(email, archiveText, config) {
        return __writeArchive(email, archiveText, config);
    },

    writeInfo: function(email, text, config) {
        return __writeInfo(email, text, config);
    }

};
