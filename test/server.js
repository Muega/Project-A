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

//Initialisierung sqlite3
const DATABASE = "shop.db";
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database(DATABASE); 

//Zugriff erlauben
app.use(express.static(__dirname + "/public/.."));

//Server starten
app.listen(3000, function(){
    console.log("listining on 3000");
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

app.get("/produktliste", function(req, res){
    db.all(
        `SELECT * FROM produkte`,
        function(err,rows){
            res.render("produktliste", {"produkte": rows});
        }
    );
});

//Formular zum Hinzufügen eines Produktes
app.get("/create", function(req, res){
    res.render("create");
});

//POST-Request oncreate fügt Produkt zur Liste
app.post("/oncreate", function(req, res){
    const param_name = req.body.produktname;
    const param_preis = req.body.produktpreis;

    db.run(
        `INSERT INTO produkte(name, preis) VALUES("${param_name}", ${param_preis})`,
        function(err){
            res.redirect("/produktliste");
        }
    );
});

app.post("/delete/:id", function(req, res){
    db.run(
        `DELETE FROM produkte WHERE id = ${req.params.id}`,
        function(err){
            res.redirect("/produktliste");
        }
    );
});

app.post("/update/:id", function(req, res){
    //Nach Datensazu mit id suchen und Werte an Formular übergeben
    db.all(
        `SELECT * FROM produkte WHERE id = ${req.params.id}`,
        function(err, rows){
            res.render("update", rows[0]);
        }
    );
});

app.post("/onupdate/:id", function(req, res){
    const param_update_name = req.body.produktname;
    const param_update_preis = req.body.produktpreis;

    db.run(
        `UPDATE produkte SET name = "${param_update_name}", preis = ${param_update_preis} WHERE id = ${req.params.id}`,
        function(err){
            console.log(err);
            res.redirect("/produktliste");
        }
    );
});