const fs = require("fs");
const path = require("path");

function getValue(obj, pathArr, def) {
    let nextPath = pathArr.shift();
    if (nextPath) {
        return (pathArr.length > 0) ?
            (obj.hasOwnProperty(nextPath) ? getValue(obj[nextPath], pathArr, def) : def) :
            obj[nextPath] || def;
    }
    return obj || def;
}

class Configuration {

    constructor(data = {}) {
        this.config = data;
    }

    get(path, def) {
        return getValue(this.config, path.split("."), def);
    }

}

Configuration.loadFromFile = function(filename, allowEmpty = false) {
    let fileContents;
    try {
        fileContents = JSON.parse(fs.readFileSync(filename));
    } catch (err) {
        if (allowEmpty) {
            console.log("No configuration found locally, loading defaults...");
            // @todo load defaults
            return new Configuration();
        } else {
            throw err;
        }
    }
    return new Configuration(fileContents);
};

Configuration.loadLocalConfig = function() {
    return Configuration.loadFromFile(path.resolve(__dirname, "../config.json"), true);
};

module.exports = Configuration;
