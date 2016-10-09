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
        return storageAdapter
            .accountExists(email)
            .then(function(exists) {
                if (exists) {
                    // account exists
                    log.warn({ email }, "account already exists");
                    return false;
                }
                return accountTools
                    .writeAccountInfo(email, {
                        email,
                        password: securityTools.generatePasswordHash(password),
                        created: Date.now().toString()
                    })
                    .then(() => true);
            });
    },

    handleAccountRequest: function *() {
        let packet = this.request.body,
            status = "fail";
        const log = Logger.getSharedInstance().sub({
            request: "account",
            action: packet.request
        });
        if (packet.request === "create") {
            return accountTools
                .createAccount(packet)
                .then((created) => {
                    status = created ? "ok" : "fail"
                    if (!created) {
                        this.status = 403;
                        log.warn({ email: packet.email, reason: "create failed" }, "failure");
                        throw new Error("Account creation failed");
                    }
                    log.info({ email: packet.email }, "success");
                    this.response.set("Content-Type", "application/json");
                    this.body = JSON.stringify({
                        status
                    });
                })
                .catch((err) => {
                    this.status = 500;
                    log.error({ error: err.message }, "account error");
                });
        }
        // bad request
        this.status = 400;
        log.warn({ email: packet.email, reason: "no instruction" }, "failure");
    },

    writeAccountInfo(email, info) {
        return storageAdapter.writeInfo(email, JSON.stringify(info));
    }

};
