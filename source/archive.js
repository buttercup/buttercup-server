const storageAdapter = require("./storage-adapter.js");
const securityTools = require("./tools/security.js");
const Logger = require("./logger.js");

let archiveTools = module.exports = {

    getArchive: function(email, password, config) {
        let info = storageAdapter.getInfo(email),
            passwordHash = securityTools.generatePasswordHash(password);
        return (info && info.password === passwordHash) ? 
            storageAdapter.getArchiveFileContents(email, config) :
            null;
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
            let archive = archiveTools.getArchive(email, password);
            if (typeof archive === "string") {
                log.info({ email }, "success");
                output.status = "ok";
                output.archive = archive;
            } else {
                log.warn({ email }, "failure");
            }
        } else if (packet.request === "save") {
            let archive = archiveTools.getArchive(email, password);
            if (typeof archive === "string") {
                let archiveContents = packet.archive;
                if (archiveContents) {
                    log.info({ email }, "success");
                    storageAdapter.writeArchive(email, archiveContents);
                    output.status = "ok";
                } else {
                    log.warn({ email, reason: "no archive data" }, "failure");
                }
            } else {
                log.warn({ email, reason: "prefetch response" }, "failure");
            }
        } else {
            output.reason = "invalid request";
        }
        this.response.set("Content-Type", "application/json");
        this.body = JSON.stringify(output);
    }

};
