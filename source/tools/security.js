const createHash = require("sha.js");

module.exports = {
    
    generateAccountHash: function(email) {
        let sha256 = createHash("sha256"),
            secret = global.config.get("secret", ""),
            hash = sha256.update(secret + email, "utf8").digest("hex");
        return hash;
    }

};
