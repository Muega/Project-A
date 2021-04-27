/* 
first steps as always: 
npm init
npm install express --save
-""- ejs
-""- body-parser
-""- sqlite3
-""- express-fileupload
*/ 

//Im Folgenden die Initialisierungen der Module express, body-parser, ejs: 
const express = require("express");
const app = express();

//Intitialisierung Body-Parser 
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

//Initialisierung EJS
app.engine(".ejs", require("ejs").__express); //das Modul mit der Variante für express wird geladen
app.set("view engine", "ejs");

app.use(express.static(__dirname + "/public"));


//Server starten:
app.listen(3000, function(){
    console.log("listening on 3000");
});


//Hier sind unsere Pages:
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
