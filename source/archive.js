const storageAdapter = require("./storage-adapter.js");
const securityTools = require("./tools/security.js");
const Logger = require("./logger.js");

let archiveTools = module.exports = {

    getArchive: function(email, password, config) {
        return storageAdapter
            .getInfo(email)
            .then(function(info) {
                if (info === null) {
                    return Promise.resolve(null);
                }
                let passwordHash = securityTools.generatePasswordHash(password);
                return (info && info.password === passwordHash) ? 
                    storageAdapter.getArchiveFileContents(email, config) :
                    Promise.resolve(null);
            });
    },

    handleArchiveRequest: function *() {
        let packet = this.request.body,
            output = { status: "fail" },
            {
                email,
                passw: password
            } = packet;
        const log = Logger.getSharedInstance().sub({
            request: "archive",
            action: packet.request
        });
        if (packet.request === "get") {
            return archiveTools
                .getArchive(email, password)
                .then((archive) => {
                    if (typeof archive === "string") {
                        log.info({ email }, "success");
                        output.status = "ok";
                        output.archive = archive;
                        this.response.set("Content-Type", "application/json");
                        this.body = JSON.stringify(output);
                    } else {
                        log.warn({ email, reason: "invalid archive" }, "failure");
                        // bad request
                        this.status = 400;
                    }
                });
        } else if (packet.request === "save") {
            return archiveTools
                .getArchive(email, password)
                .then((archive) => {
                    if (typeof archive === "string") {
                        let archiveContents = packet.archive;
                        if (archiveContents) {
                            log.info({ email }, "success");
                            return storageAdapter
                                .writeArchive(email, archiveContents)
                                .then(() => {
                                    output.status = "ok";
                                });
                        } else {
                            log.warn({ email, reason: "no archive data" }, "failure");
                        }
                    } else {
                        log.warn({ email, reason: "prefetch response" }, "failure");
                    }
                })
                .then(() => {
                    this.response.set("Content-Type", "application/json");
                    this.body = JSON.stringify(output);
                })
                .catch((err) => {
                    this.status = 500;
                    log.error({ error: err.message }, "archive error");
                });
        }
        this.status = 400;
        log.warn({ email: packet.email, reason: "no instruction" }, "failure");
    }

};
