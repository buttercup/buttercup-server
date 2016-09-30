const storageAdapter = require("./storage-adapter.js");
const securityTools = require("./tools/security.js");

let accountTools = module.exports = {

    createAccount(packet) {
        let {
            email,
            passw: password
        } = packet;
        if (storageAdapter.accountExists(email)) {
            // account exists
            console.log(`Account already exists: ${email}`);
            return false;
        }
        accountTools.writeAccountInfo(email, {
            email,
            password: securityTools.generatePasswordHash(password),
            created: Date.now().toString()
        });
        return true;
    },

    handleAccountRequest: function *() {
        let packet = this.request.body,
            status = "fail";
        if (packet.request === "create") {
            let created = accountTools.createAccount(packet);
            status = created ? "ok" : "fail"
            if (!created) {
                this.status = 403;
            }
        } else {
            // bad request
            this.status = 400;
        }
        this.response.set("Content-Type", "application/json");
        this.body = JSON.stringify({
            status
        });
    },

    writeAccountInfo(email, info) {
        storageAdapter.writeInfo(email, JSON.stringify(info));
    }

};
