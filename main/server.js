const express = require("express");
const app = express();

app.use(express.static(__dirname + "/public/.."));

app.listen(3000, function(){
    console.log("listining on 3000");
});

app.get("/home", function(req, res){
    res.sendFile(__dirname + "/views/home.html");
});

app.get("", function(req, res){
    res.redirect("/home")
});

app.get("/login", function(req, res){
    res.sendFile(__dirname + "/views/login.html");
});

app.get("/shop", function(req, res){
    res.sendFile(__dirname + "/views/shop.html");
});
