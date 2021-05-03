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

//Initialisierung express-session
const session = require('express-session');
app.use(session({
    secret: 'example',
    saveUninitialized: false,
    resave: false 
}));

//Initialisierung bcrypt
const bcrypt = require('bcrypt');

//Initialisierung Cookies
const cookieParser = require("cookie-parser");
app.use(cookieParser());

//Zugriff erlauben
app.use(express.static(__dirname + "/public/.."));

//App.get der verschiedenen Seiten
app.get("/home", function(req, res){
    res.render("home", {"nachricht": ""});
});

app.get("", function(req, res){
    res.redirect("/home");
});

app.get("/login", function(req, res){
    res.render("login", {"nachricht": ""});
});

app.get("/register", function(req, res){
    res.render("register", {"nachricht": ""});
});

app.get("/create", function(req, res){
    if (!req.session.sessionValue){ //Abfrage ob eine Session besteht
        return res.render("create", {"nutzername": "Guest", "aktion": ""}); 
    }else{
        return res.render("create", {"nutzername": req.session.sessionValue, "aktion": ""});
    }
});

app.get("/logout", function(req, res){
    req.session.destroy();
    res.redirect("/home");
});




//typische Seite Seitenlayout
app.get("/layout", function(req, res){
    res.sendFile(__dirname + "/views/typischeSeite.html");
});

//weitere Seiten (About Us, Warenkorb/Cart, Purchase, Completion, shopGuest, Detail)
app.get("/about", function(req, res){
    if (!req.session.sessionValue){ //Abfrage ob eine Session besteht
        return res.render("aboutUs", {"nutzername": "Guest", "aktion": ""}); 
    }else{
        return res.render("aboutUs", {"nutzername": req.session.sessionValue, "aktion": ""});
    }
});

app.get("/warenkorb", function(req, res){ //hierzu muss man auf die Daten zugreifen etc.
    if (!req.session.sessionValue){ //Abfrage ob eine Session besteht
        return res.render("cart", {"nutzername": "Guest", "aktion": ""}); 
    }else{
        return res.render("cart", {"nutzername": req.session.sessionValue, "aktion": ""});
    }
    
});

app.get("/purchase", function(req,res){ //kann nicht ohne Produkte aufgerufen werden!!
    if (!req.session.sessionValue){ //Abfrage ob eine Session besteht
        return res.render("purchase", {"nutzername": "Guest", "aktion": ""}); 
    }else{
        return res.render("purchase", {"nutzername": req.session.sessionValue, "aktion": ""});
    } //Hier müssen die Produktdaten übergeben werden 
})
app.get("/completion", function(req, res){
    res.sendFile(__dirname + "/views/completion.html");
});

/* shopGuest ist deleted
app.get("/guest", function(req, res){
    res.sendFile(__dirname + "/views/shopGuest.html");
});
*/

//Produktliste
app.get("/produktliste", function(req, res){
    if (!req.session.sessionValue){ //Abfrage ob eine Session besteht
        db.all(
            `SELECT * FROM produkte`,
            function(err,rows){
                res.render("produktliste", {"produkte": rows, "nutzername": "Guest", "aktion": ""}); //Produktlisten Array an produktliste.ejs übergeben
            }
        );
    }else{
        db.all(
            `SELECT * FROM produkte`,
            function(err,rows){
                res.render("produktliste", {"produkte": rows, "nutzername": req.session.sessionValue, "aktion": ""}); //Produktlisten Array an produktliste.ejs übergeben
            }
            );
    } 
});

app.get("/shop", function(req, res){
    if (!req.session.sessionValue){ //Abfrage ob eine Session besteht
        return res.render("shop", {"nutzername": "Guest", "aktion": ""}); 
    }else{
        return res.render("shop", {"nutzername": req.session.sessionValue, "aktion": ""});
    }
});

//Detail von einem Produkt
app.post("/detail/:id", function(req, res){
    db.all(
        `SELECT * FROM produkte WHERE id = ${req.params.id}`,
        function(err, rows){
            res.render("detail", rows[0]);
        }
    );
});



//Login POST-Formular
app.post("/login_eingabe", function(req,res){
    const nutzername = req.body.nutzername; 
    const passwort = req.body.passwort;

    db.all(
        `SELECT * FROM (
            SELECT benutzername,passwort,email FROM benutzer
            UNION ALL
            SELECT benutzername,passwort,email FROM administrator)`,
        function(err, rows){
            for (const element in rows){
                if ((rows[element].benutzername == nutzername && bcrypt.compareSync(passwort, rows[element].passwort)) || (rows[element].email == nutzername && bcrypt.compareSync(passwort, rows[element].passwort))){
                    console.log(`${nutzername} wurde angemeldet`);
                    const sessionValue = rows[element].benutzername; 
                    req.session.sessionValue = sessionValue;
                    console.log(rows);
                    return res.render("shop", {"nutzername": req.session.sessionValue, "aktion": "Sie haben sich erfolgreich angemeldet"});
                };
            };
            return res.render("login", {"nachricht": "Falsches Passwort oder Benutzername!"});
        }
    );
});

//Registier POST-Formular
app.post("/register_eingabe", function(req,res){
    const nutzername = req.body.nutzername; 
    const passwort = req.body.passwort;
    const passwort_repeat = req.body.passwort_repeat;
    const email = req.body.email;

    if (nutzername != "" && passwort != ""){
        if (passwort.length > 32 || passwort.length < 8){
            //Passwort zu lang/kurz
            return res.render("register", {"nachricht": "Passwortlänge beträgt 8 bis 32 Zeichen."});
        };
        if (passwort != passwort_repeat){
            //Passwort stimmt nicht überein
            return res.render("register", {"nachricht": "Passwörter stimmen nicht überein."});
        };
        db.all(
            `SELECT * FROM (
                SELECT benutzername, email FROM benutzer
                UNION ALL
                SELECT benutzername, email FROM administrator)`,
            function(err, rows){
                for (const element in rows){
                    if (rows[element].benutzername == nutzername){
                        //Nutzer existiert bereits
                        return res.render("register", {"nachricht": "Nutzname bereits vergeben."});
                    };
                    if (rows[element].email == email){
                        //Email existiert bereits
                        return res.render("register", {"nachricht": "Email bereits registriert."});
                    };
                };
                //Erfolgreich
                const hash = bcrypt.hashSync(passwort, 10);
                db.run(
                    `INSERT INTO benutzer (benutzername, passwort, email) VALUES("${nutzername}", "${hash}", "${email}")`, //Insert into benutzer
                    function(err){
                        console.log(`${nutzername} hat sich registriert`);
                        const sessionValue = req.body.nutzername; 
                        req.session.sessionValue = sessionValue;
                        return res.render("shop", {"nutzername": req.session.sessionValue, "aktion": "Sie haben sich erfolgreich registriert"});
                    }
                );
            }
        );

    }else{
        //Ein oder Zwei Felder nicht ausgefüllt
        return res.render("register", {"nachricht": "Es müssen alle Felder ausgefüllt sein."});
    };
});


//POST-Request oncreate fügt Produkt zur Liste
app.post("/oncreate", function(req, res){
    const param_name = req.body.produktname;
    const param_preis = req.body.produktpreis;
    const param_anzahl = req.body.anzahl;
    const param_knackig = req.body.knackig;
    let param_versteckt = req.body.versteckt;
    const param_farbe = req.body.farbe;
    const param_gewicht = req.body.gewicht;
    const param_saft = req.body.saft;
    const param_bild = req.body.bild;

    //code für die Drag&Drop funktion.(funktioniert noch nicht)
    //document.querySelectorAll(".drop-zone--input").forEach(InputElement => {
    //    const dropZoneElement = InputElement.className(".drop-zone");

    //    dropZoneElement.addEventListener("dragover" , e => {
    //        dropZoneElement.classList.add("drop-zone--over");
    //    });
    //});

    if(param_versteckt == undefined){
        param_versteckt = 0;//Sonst ist versteckt undifinied und die Tabelle kann nicht geupdated werden.
    }

    db.run(
        `INSERT INTO produkte(name, preis, anzahl, knackig, versteckt, farbe, gewicht, saft, bild) VALUES(
            "${param_name}", ${param_preis}, ${param_anzahl}, ${param_knackig}, ${param_versteckt}, "${param_farbe}", ${param_gewicht}, ${param_saft}, "${param_bild}")`,
        function(err){
            res.redirect("/produktliste");
        }
    );
});

//DELETE Produkt
app.post("/delete/:id", function(req, res){
    db.run(
        `DELETE FROM produkte WHERE id = ${req.params.id}`,
        function(err){
            res.redirect("/produktliste");
        }
    );
});

//UPDATE Produkt
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
    const param_anzahl = req.body.anzahl;
    const param_knackig = req.body.knackig;
    let param_versteckt = req.body.versteckt;
    const param_farbe = req.body.farbe;
    const param_gewicht = req.body.gewicht;
    const param_saft = req.body.saft;
    const param_bild = req.body.bild;

    if(param_versteckt == undefined){
        param_versteckt = "0"; //Sonst ist versteckt undifinied und die Tabelle kann nicht geupdated werden.
    }

    db.run( //Hier werden die werte aus der Liste geupdatet
        `UPDATE produkte SET name = "${param_update_name}", preis = ${param_update_preis}, anzahl =  ${param_anzahl}, 
        knackig =  ${param_knackig}, versteckt =  ${param_versteckt}, farbe = "${param_farbe}", gewicht = ${param_gewicht}, saft = ${param_saft}, bild = "${param_bild}" WHERE id = ${req.params.id}`,
        function(err){
            console.log(param_update_name, param_update_preis, param_anzahl, param_knackig, param_versteckt, param_farbe, param_gewicht, param_saft, param_bild);
            res.redirect("/produktliste");
        }
    );
});

//Server starten
app.listen(3000, function(){
    console.log("listening on 3000");
});