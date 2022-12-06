const express = require("express");
const app = express();
const fs = require('fs');
const { engine } = require("express-handlebars");
var clientSessions = require("client-sessions");
var data = require("./data-service.js")
var path = require("path");

var HTTP_PORT = process.env.PORT || 8080
app.engine(".hbs", engine({
    extname: ".hbs",
}));

app.set("view engine", ".hbs");

function expressoutput() {
    console.log(`Express http server listening on ${HTTP_PORT}`);
}
app.use(express.urlencoded({ extended: true }));

app.use(clientSessions({
    cookieName: "session", 
    secret: "finaltest", 
    duration: 2 * 60 * 1000, 
    activeDuration: 1000 * 60 
}));

app.use(function (req, res, next) {
    res.locals.session = req.session;
    next();
});

app.use(function (req, res) {
    res.status(404).send("Page not found");
})

dataService.initialize().then(dataService.initialize)
    .then(function () {
        app.listen(HTTP_PORT, function () {
            console.log("app listening on: " + HTTP_PORT)
        });
    })
    .catch(function (err) {
        console.log("unable to start server: " + err);
    });
