const koa = require("koa");

const router = require("./router.js");
const Configuration = require("./configuration.js");
const storageAdapter = require("./storage-adapter.js");
const Logger = require("./logger.js");

let config = global.config = Configuration.loadLocalConfig(),
    listenPort = config.get("port", 8080);

Logger.setSharedInstance(
    Logger.create(
        "buttercup-server",
        config.get("logs", [{ output: "stdout" }])
    )
);
let log = Logger.getSharedInstance();

// Begin

storageAdapter.initialise();

let app = koa();

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(listenPort);
log.info({ port: listenPort }, "listening")
