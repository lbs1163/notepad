var express = require('express');
var bodyParser = require('body-parser');
var path = require("path");
var fs = require("fs");
var app = express();
var session = require("express-session");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}))

var users = [{
    username: "aaa",
    password: "bbb",
    auth_token: "sfmsdlkfmklsmfklsmdlfkmsdlkf"
}, {
    username: "bbb",
    password: "ccc",
    auth_token: "sadfoijdwgodijfsdofkpzxfvsvn"
}, {
    username: "ccc",
    password: "aaa",
    auth_token: "sdiovjwoimreofjdpogmeqojfnsod"
}]

app.use('/static', express.static('public'));

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/login.html'));
});

app.get('/notepad', function (req, res) {

    for(var i=0; i<3; i++) {
        if(users[i].auth_token == req.session.auth_token) {
            res.sendFile(path.join(__dirname + '/index.html'));
            break;
        }
    }
    if(i == 3) {
        res.redirect('/');
    }
});

app.post("/users", function(req, res) {
    var username = req.body.username,
        password = req.body.password;

    for(var i=0; i<3; i++) {
        if(username == users[i].username && password == users[i].password) {
            req.session.auth_token = users[i].auth_token;
            res.redirect('/notepad');
            break;
        }
    }
    if(i == 3) {
        res.redirect('/');
    }
});

app.post("/note", function(req, res) {
    var content = req.body.content;
    var filename = req.body.filename;
    var dirname;

    for(var i=0; i<3; i++) {
        if(req.session.auth_token == users[i].auth_token) {
            dirname = "user" + i + "/";
            break;
        }
    }

    if(i==3)
        console.log("no session for writing file");

    else if(req.body.action == "delete") {
        fs.unlink("notes/" + dirname + filename, function(err) {
            if(err) {
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify({
                    status: "failure"
                }));
            }
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify({
                status: "success"
            }));
        });
    }

    else if(req.body.action == "save") {
        fs.writeFile("notes/" + dirname + filename, content, function(err) {
            if(err) {
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify({
                    status: "failure"
                }));
            }
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify({
                status: "success"
            }));
        });
    }

    else if(req.body.action == "new") {
        fs.writeFile("notes/" + dirname + filename, "", function(err) {
            if(err) {
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify({
                    status: "failure"
                }));
            }
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify({
                status: "success"
            }));
        });
    }

    else if(req.body.action == "rename") {
        fs.rename("notes/" + dirname + filename, "notes/" + dirname + req.body.newname + ".txt", function(err) {
            if(err) {
                console.log(err);
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify({
                    status: "failure"
                }));
            }
            else {
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify({
                    status: "success"
                }));
            }
        });
    }
});

app.get("/note", function(req, res) {
    var dirname;
    var contents = new Array();

    for(var i=0; i<3; i++) {
        if(req.session.auth_token == users[i].auth_token) {
            dirname = "user" + i;
            break;
        }
    }
    if(i==3)
        console.log("no session for writing file");

    var filearr = fs.readdirSync("notes/" + dirname);
    console.log(filearr);

    for(var i=0; i<filearr.length; i++) {
        contents.push(fs.readFileSync("notes/" + dirname + '/' + filearr[i], "utf-8"));
    }

    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({
        filearr: filearr,
        contents: contents
    }));
});


app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});
