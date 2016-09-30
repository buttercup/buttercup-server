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
            archive = archiveTools.getArchive(email, password);
            if (archive && archive.length > 0) {
                console.log(`Archive request: ${email}`);
                output.status = "ok";
                output.archive = archive;
            } else {
                console.log(`Failed archive request: ${email}`);
            }
        } else if (packet.request === "save") {

        } else {
            output.reason = "invalid request";
        }
        this.response.set("Content-Type", "application/json");
        this.body = JSON.stringify(output);
    }

};
