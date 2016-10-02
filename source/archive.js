const storageAdapter = require("./storage-adapter.js");
const securityTools = require("./tools/security.js");

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
        if (packet.request === "get") {
            let archive = archiveTools.getArchive(email, password);
            if (typeof archive === "string") {
                console.log(`Archive request: ${email}`);
                output.status = "ok";
                output.archive = archive;
            } else {
                console.log(`Failed archive get request: ${email}`);
            }
        } else if (packet.request === "save") {
            let archive = archiveTools.getArchive(email, password);
            if (typeof archive === "string") {
                let archiveContents = packet.archive;
                if (archiveContents) {
                    console.log(`Archive saved: ${email}`);
                    storageAdapter.writeArchive(email, archiveContents);
                    output.status = "ok";
                } else {
                    console.log(`Failed archive save request: ${email} - No archive data provided`);
                }
            } else {
                console.log(`Failed archive save (pre-fetch) request: ${email}`);
            }
        } else {
            output.reason = "invalid request";
        }
        this.response.set("Content-Type", "application/json");
        this.body = JSON.stringify(output);
    }

};
