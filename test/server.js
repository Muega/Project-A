//Initialisierung Express
const express = require("express");
const app = express();

//Initialisierung body-parser
const bodyParser = require("body-parser");
const { response } = require("express");
app.use(bodyParser.urlencoded({extended: true}));

//Initialisierung EJS
app.engine(".ejs", require("ejs").__express);
app.set("view engine", "ejs");

//Zugriff erlauben
app.use(express.static(__dirname + "/public/.."));

//Server starten
app.listen(3000, function(){
    console.log("listening on 3000");
});

app.get("/home", function(req, res){
    res.sendFile(__dirname + "/views/home.html");
});

app.get("/login", function(req, res){
    res.sendFile(__dirname + "/views/login.html");
});

app.get("/register", function(req, res){
    res.sendFile(__dirname + "/views/register.html");
});


let benutzer = [
    {nutzername: "Bob", passwort: "abcdefg123"},
    {nutzername: "amy44", passwort: "hal%/?S=)§(FSlo"} //Später entfernen wegen Datenbank!
];

app.post("/login_eingabe", function(req,res){
    const nutzername = req.body.nutzername; 
    const passwort = req.body.passwort;

    for (element in benutzer){
        if (benutzer[element].nutzername == nutzername && benutzer[element].passwort == passwort){
            res.render("success", {"nutzername": nutzername, "aktion": "angemeldet"});
        };
    };
    res.redirect("/login");
});

app.post("/register_eingabe", function(req,res){
    const nutzername = req.body.nutzername; 
    const passwort = req.body.passwort;
    const passwort_repeat = req.body.passwort_repeat;

    if (nutzername != "" && passwort != ""){
        if (passwort.length > 32 || passwort.length < 8){
            //Passwort zu lang/kurz
            console.log("Passwort zu lang/kurz");
            res.redirect("/register");
        };
        if (passwort != passwort_repeat){
            //Passwort stimmt nicht überein
            console.log("Passwort stimmt nicht überein");
            res.redirect("/register");
        };
        for (element in benutzer){
            if (benutzer[element].nutzername == nutzername){
                //Benutzer vergeben
                console.log("Benutzer vergeben");
                res.redirect("/register");
            };
        };
    }else{
        //Ein oder Zwei Felder nicht ausgefüllt
        console.log("Ein oder Zwei Felder nicht ausgefüllt");
        res.redirect("/register");
    }
    
    benutzer.push({nutzername: nutzername, passwort: passwort});
    console.log(benutzer);

    res.render("success", {"nutzername": nutzername, "aktion": "registriert"});
});
