const express = require("express");
const app = express();
const fs = require('fs');
var clientSessions = require("client-sessions");
var data = require("./final.js")
var path = require("path");

var HTTP_PORT = process.env.PORT || 8080


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

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, "/finalViews/home.html"))
});

app.get('/register', function (req, res) {
    res.sendFile(path.join(__dirname, "/finalViews/register.html"))
});

app.post('/register', function (req, res) {
    console.log(req.body);
    data.register(req.body).then(() => {
        let resText = "<body>" + req.body.useremail + " registered successfully</body>"
        resText += "<h2><a href='/'><u>Go Home</u></a></h2>";
        res.send(resText)
    })
    .catch((err) => {
        res.send(err);
    })
});


app.get('/signin', function (req, res) {
    res.sendFile(path.join(__dirname, "/finalViews/signin.html"))
});

app.post('/signin', function (req, res) {
    data.signIn(req.body).then((user) => {
        req.session.user = {
            useremail: user.useremail, // complete it with authenticated user's email
        }
        let resText = "<body>" + req.body.useremail + " signed in successfully</body>"
        resText += "<h2><a href='/'><u>Go Home</u></a></h2>";
        res.send(resText)
    })
    .catch((err) => {
        res.send(err);
    })
});

app.use(function (req, res) {
    res.status(404).send("Page not found");
})

data.startDB().then(function () {
        app.listen(HTTP_PORT, function () {
            console.log("app listening on: " + HTTP_PORT)
        });
    })
    .catch(function (err) {
        console.log("unable to start server: " + err);
    });
