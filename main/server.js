/* 
first steps as always: 
npm init
npm install express --save
-""- ejs
-""- body-parser
-""- sqlite3
-""- express-fileupload
*/ 

//Im Folgenden die Initialisierungen der Module: 
const express = require("express");
const app = express();

app.use(express.static(__dirname + "/public"));

//Server starten:
app.listen(3000, function(){
    console.log("listening on 3000");
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
