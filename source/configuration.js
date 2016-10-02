const fs = require("fs");
const path = require("path");

const fileExists = require("file-exists");

function getValue(obj, pathArr, def) {
    let nextPath = pathArr.shift();
    if (nextPath) {
        return (pathArr.length > 0) ?
            (obj.hasOwnProperty(nextPath) ?
                getValue(obj[nextPath], pathArr, def) : def) :
            obj[nextPath] || def;
    }
    return obj || def;
}

function placeConfig(configPath) {
    if (fileExists(configPath) !== true) {
        const baseConfigPath = path.resolve(__dirname, "../resources/config.base.json");
        let baseConfig = fs.readFileSync(baseConfigPath, "utf8");
        fs.writeFileSync(configPath, baseConfig, "utf8");
    }
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
    let configPath = path.resolve(__dirname, "../config.json");
    placeConfig(configPath);
    return Configuration.loadFromFile(configPath, true);
};

module.exports = Configuration;
