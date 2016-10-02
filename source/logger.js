const Bunyan = require("bunyan");

let __sharedInstance;

class Logger {

    constructor(logUtil) {
        this.logUtil = logUtil;
    }

    info() {
        this.logUtil.info.apply(this.logUtil, arguments);
    }

    sub(config) {
        let childConfig = Object.assign({}, config);
        let childLogger = this.logUtil.child(childConfig);
        return new Logger(childLogger);
    }

    warn() {
        this.logUtil.warn.apply(this.logUtil, arguments);
    }

}

Logger.create = function(name, configurations=[{ output: "stdout" }]) {
    let streams = configurations.map(function(configuration) {
        let output = configuration.output;
        if (output === "stdout") {
            return {
                stream: process.stdout
            };
        } else if (output === "stderr") {
            return {
                stream: process.stderr
            };
        } else if (output === "file") {
            return {
                path: configuration.logpath,
                type: "rotating-file",
                period: "1d",               // rotate on daily basis
                count: 7                    // 1 week history
            };
        }
    });
    let util = Bunyan.createLogger({ name, streams });
    return new Logger(util);
};

Logger.getSharedInstance = function() {
    if (!__sharedInstance) {
        __sharedInstance = Logger.create("untitled");
    }
    return __sharedInstance;
};

Logger.setSharedInstance = function(logger) {
    __sharedInstance = logger;
};

module.exports = Logger;
