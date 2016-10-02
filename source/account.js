const storageAdapter = require("./storage-adapter.js");
const securityTools = require("./tools/security.js");

let accountTools = module.exports = {

    createAccount(packet) {
        const log = Logger.getSharedInstance().sub({
            topic: "create-account",
        });
        let {
            email,
            passw: password
        } = packet;
        if (storageAdapter.accountExists(email)) {
            // account exists
            log.warn({ email }, "account already exists");
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
        const log = Logger.getSharedInstance().sub({
            request: "account",
            action: packet.request
        });
        if (packet.request === "create") {
            let created = accountTools.createAccount(packet);
            status = created ? "ok" : "fail"
            if (!created) {
                this.status = 403;
                log.warn({ email: packet.email, reason: "create failed" }, "failure");
            } else {
                log.info({ email: packet.email }, "success")
            }
        } else {
            // bad request
            this.status = 400;
            log.warn({ email: packet.email, reason: "no instruction" }, "failure");
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
