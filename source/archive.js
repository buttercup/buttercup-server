const storageAdapter = require("./storage-adapter.js");

let archiveTools = module.exports = {

    getArchive: function(email, config) {
        return storageAdapter.getArchiveFileContents(email, config);
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
            }
        } else if (packet.request === "save") {

        } else {
            output.reason = "invalid request";
        }
        this.response.set("Content-Type", "application/json");
        this.body = JSON.stringify(output);
    }

};
