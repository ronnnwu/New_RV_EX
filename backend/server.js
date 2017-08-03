const express = require("express");
const bodyparse = require("body-parser");
const sessions = require("client-sessions");
const csurf = require("csurf");
const helmet = require("helmet");

let app = express();

let user = require("./dao/userlogin");

app.use(bodyparse.urlencoded( {extended: false} ));
app.use(sessions({
    cookieName:"session",
    secret: "ddklsklsdfklsf",
    duration: 24*60*60*1000,    //24hr
}));
app.use(csurf());
app.use(helmet());

app.use((req, res, next)=>{
    if (!(req.session && req.session.user)){
        return next();
    }

    next();
});

app.set("view engine", "pug");

app.get("/", (req, res) => {
    res.render("index");
});

app.get("/register", (req, res) => {
    res.render("register", {csrfToken: req.csrfToken()});
});

app.get("/login", (req, res) => {
    res.render("login",  {csrfToken: req.csrfToken()});
});

app.get("/logout", (req, res) => {
    req.session.reset();
    res.redirect("/");
});

function loginRequired(req, res, next){
    if(!req.session.user){
        return res.redirect("/login");
    }
    next();
}

app.get("/dashboard", loginRequired,  (req, res) => {
    res.render("dashboard", {username: req.session.user.USERNAME});
});

const bcrypt = require("bcryptjs");

app.post("/register", (req, res) => {

    let password_hash = bcrypt.hashSync(req.body.password.toString(), 14);
    let p = new user(0, req.body.firstname.toString(), password_hash);
    console.log(p);
    p.addUser( (err, result) => {
        //console.log(err, result);
        if(err) {
            res.render("login", {error: err , csrfToken: req.csrfToken()});
        }
        else{
            p.PASSWORD = undefined;
            req.session.user = p;
            res.redirect("/dashboard");
        }
    });

});

document.addEventListener("DOMContentLoad", function(){
    var interval = setInterval(function(){
        var time = document.getElementById("time");
        var xhr = new XMLHttpRequest() || new ActiveXObject("Microsoft.HTTPRequest");
        xhr.onreadystatechange = function(){
            if(xhr.readystate != 4){
                console.log("not ready");
                return;
            }
            if(xhr.status == 200) {
                var res = JSON.parse(xhr.responseText);
                time..innerHTML = res.hour + " : "+ res.minute + " : " + res.second;
                return;
            }/* else{
             clearInternval(interval);
             time.lastChild.innerHTML = "it didn't work";
             }  */
        };
        //http://localhost:8080/JavasciptDemo/time
        var url = "http://localhost:8080/JavasciptDemo/time" ;
        xhr.open("GET", url, true);
        xhr.send();

    } , 2000);
});

app.post("/login", (req, res) => {

    let password = req.body.password.toString();
    let p = new user(0, req.body.firstname.toString(), "");
    console.log(p);
    p.usernameLookUpPass( (err, result) => {
        console.log(p);

        if (!result || !bcrypt.compareSync(password, p.PASSWORD)) {
            res.render("login", {error: "incorrect username / password",  csrfToken: req.csrfToken()});
        }
        else{
            p.PASSWORD = undefined;
            req.session.user = p;
            res.redirect("/dashboard");
        }
    });
});

app.listen(process.env.PORT || 3000);