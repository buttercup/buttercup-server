const storageAdapter = require("./storage-adapter.js");

let accountTools = module.exports = {

    createAccount(packet) {
        let {
            email,
            passw: password
        } = packet;
        if (storageAdapter.accountExists(email)) {
            // account exists
            this.status = 403;
        } else {

        }
    },

    handleAccountRequest: function *() {
        let packet = this.request.body;
        if (packet.request === "create") {
            accountTools.createAccount.call(this, packet);
            this.response.set("Content-Type", "application/json");
            this.body = JSON.stringify({
                status: "ok"
            });
        } else {
            // bad request
            this.status = 400;
        }
    }

};
