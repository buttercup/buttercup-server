const koa = require("koa");

const router = require("./router.js");
const Configuration = require("./configuration.js");

let config = global.config = Configuration.loadLocalConfig(),
    listenPort = config.get("port", 8080);

let app = koa();

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(listenPort);
console.log(`Listening on port ${listenPort}`);
