const koaRouter = require("koa-router");
const koaBodyParser = require("koa-body");

const accountHelper = require("./account.js");

let router = koaRouter(),
    koaBody = koaBodyParser();

router
    .get("/humans.txt", function() {
        this.body = "Hello human!\n\nThis Buttercup server is intended for machine use only, sorry.";
    })
    .post("/account", koaBody, accountHelper.handleAccountRequest);

module.exports = router;
