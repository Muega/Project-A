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

//Initialisierung express-fileupload
const fileUpload = require('express-fileupload');
app.use(fileUpload());

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
    if (!req.session.sessionValue || req.session.sessionValue.sessionNutzer == "Guest"){ //Wenn Gast auf die Seite will
        return res.render("home", {"nachricht": "Access Denied. Please Register!"});
    }else{
        return res.redirect("/shop");
    }
});

app.get("/login", function(req, res){
    res.render("login", {"nachricht": ""});
});

app.get("/register", function(req, res){
    res.render("register", {"nachricht": ""});
});

app.get("/create", function(req, res){
    if (!req.session.sessionValue || req.session.sessionValue.sessionNutzer == "Guest"){ //Wenn Gast auf die Seite will
        return res.render("home", {"nachricht": "Access Denied. Please Register!"});
    }
    if (req.session.sessionValue.rolle == 1){ //Abfrage ob eine Session besteht
        db.all(
            `SELECT * FROM produkte`,
            function(err,rows){
                return res.render("create", {"produkte": rows, "nutzername": req.session.sessionValue.sessionNutzer, "rolle": req.session.sessionValue.rolle, "aktion": "", "cartCookie": req.cookies.cart}); //Produktlisten Array an produktliste.ejs übergeben
            }
        );
    }
    if (req.session.sessionValue.rolle == 0){ //Wenn Kunde auf die Seite will
        return res.redirect("/shop");
    }
});

app.get("/logout", function(req, res){
    req.session.destroy();
    res.redirect("/home");
});

/*
//typische Seite Seitenlayout
app.get("/layout", function(req, res){
    res.sendFile(__dirname + "/views/layout.html");
});
*/ //alte Art und Weise, unten ersetzt
// um "layout" als EJS zu initialisieren, hab ich einfach den Code von "shop" kopiert:
app.get("/layout", function(req, res){
    if (!req.session.sessionValue){ //Abfrage ob eine Session besteht
        var fruits = ['Apple','Bannana'];
        res.cookie('cart', fruits, {"maxAge": 3600 * 1000});
        db.all(
            `SELECT * FROM produkte`,
            function(err,rows){
                res.render("layout", {"produkte": rows, "nutzername": "Guest", "aktion": "", "cartCookie": req.cookies.cart}); //Produktlisten Array an produktliste.ejs übergeben
            }
        );
    }else{
         // Frage mich ob diese else unnötig ist weil die wird garnicht benutzt, sondern die von Log in und Register-Eingabe!!
        db.all(
            `SELECT * FROM produkte`,
            function(err,rows){
                res.render("layout", {"produkte": rows, "cartCookie": req.cookies.cart, "nutzername": req.session.sessionValue.sessionNutzer, "aktion": ""}); //Produktlisten Array an produktliste.ejs übergeben
            }
        );
    } 
});

//weitere Seiten (About Us, Warenkorb/Cart, Purchase, Completion, shopGuest, Detail)
app.get("/about", function(req, res){
    if (!req.session.sessionValue || req.session.sessionValue.sessionNutzer == "Guest"){ //Abfrage ob eine Session besteht
        db.all(
            `SELECT * FROM produkte`,
            function(err,rows){
                res.render("aboutUs", {"produkte": rows, "nutzername": "Guest", "rolle": "Guest", "aktion": "", "cartCookie": req.cookies.cart}); //Produktlisten Array an produktliste.ejs übergeben
            }
        );
    }else{
         // Frage mich ob diese else unnötig ist weil die wird garnicht benutzt, sondern die von Log in und Register-Eingabe!!
        db.all(
            `SELECT * FROM produkte`,
            function(err,rows){
                res.render("aboutUs", {"produkte": rows, "cartCookie": req.cookies.cart, "nutzername": req.session.sessionValue.sessionNutzer, "rolle": req.session.sessionValue.rolle, "aktion": ""}); //Produktlisten Array an produktliste.ejs übergeben
            }
        );
    } 
});

app.get("/cart", function(req, res){ //hierzu muss man auf die Daten zugreifen etc.
    if (!req.session.sessionValue){ //Abfrage ob eine Session besteht
        return res.render("home", {"nachricht": "Access Denied. Please Register!"}); //Gast kann den Warenkorb nicht nutzen
    }else{
        db.all(
            `SELECT * FROM produkte`,
            function(err,rows){
                return res.render("cart", {"produkte": rows, "nutzername": req.session.sessionValue.sessionNutzer, "rolle": req.session.sessionValue.rolle, "aktion": "", "cartCookie": req.cookies.cart}); //Produktlisten Array an produktliste.ejs übergeben
            }
        );
    }
    
});

app.get("/purchase", function(req,res){ //kann nicht ohne Produkte aufgerufen werden!!
    if (!req.session.sessionValue){ //Abfrage ob eine Session besteht
        return res.render("home", {"nachricht": "Access Denied. Please Register!"}); //Gast kann nichts kaufen
    }else{
        db.all(
            `SELECT * FROM produkte`,
            function(err,rows){
                return res.render("purchase", {"produkte": rows, "nutzername": req.session.sessionValue.sessionNutzer, "rolle": req.session.sessionValue.rolle, "aktion": "", "cartCookie": req.cookies.cart}); //Produktlisten Array an produktliste.ejs übergeben
            }
        );
    } //Hier müssen die Produktdaten übergeben werden 
});

app.get("/completion", function(req, res){ //Warum HTML? .L
    res.sendFile(__dirname + "/views/completion.html");
});

app.get("/detail/:id", function(req, res){

    if(req.session.sessionValue){
        db.all(
        `SELECT * FROM produkte`, //er mag etwas an diesem param_id nicht
        function(err, rows){
            console.log(err);
            return res.render("detail", {"apfelid": req.params.id-1, "produkte" : rows, "nutzername": req.session.sessionValue.sessionNutzer,"rolle": req.session.sessionValue.rolle, "aktion": "", "cartCookie": req.cookies.cart}); 
        });
    }else{
        return res.render("home", {"nachricht": "Access Denied. Please Register!"});//Wenn Gast auf die Seite gelangen will
    }
    
});

/* shopGuest ist deleted
app.get("/guest", function(req, res){
    res.sendFile(__dirname + "/views/shopGuest.html");
});
*/

//Produktliste
app.get("/produktliste", function(req, res){
    if (!req.session.sessionValue || req.session.sessionValue.sessionNutzer == "Guest"){ //Wenn Gast auf die Seite will
        return res.render("home", {"nachricht": "Access Denied. Please Register!"});
    }
    if (req.session.sessionValue.rolle == 0){ //Wenn Kunde auf die Seite will
        return res.redirect("/shop");
    }
    if (req.session.sessionValue.rolle == 1){ //Abfrage ob es ein Admin ist
        db.all(
            `SELECT * FROM produkte`,
            function(err,rows){
                return res.render("produktliste", {"produkte": rows, "nutzername": req.session.sessionValue.sessionNutzer,"rolle": req.session.sessionValue.rolle, "aktion": "", "cartCookie": req.cookies.cart}); //Produktlisten Array an produktliste.ejs übergeben
            }
        );
    }
});

app.get("/shop", function(req, res){
    if (!req.session.sessionValue || req.session.sessionValue.sessionNutzer == "Guest"){ //Abfrage ob eine Session besteht
        db.all(
            `SELECT * FROM produkte`,
            function(err,rows){
                res.render("shop", {"produkte": rows, "nutzername": "Guest", "rolle": "Guest", "aktion": "", "cartCookie": req.cookies.cart}); //Produktlisten Array an produktliste.ejs übergeben
            }
        );
    }else{
         // Frage mich ob diese else unnötig ist weil die wird garnicht benutzt, sondern die von Log in und Register-Eingabe!!
        db.all(
            `SELECT * FROM produkte`,
            function(err,rows){
                res.render("shop", {"produkte": rows, "cartCookie": req.cookies.cart, "nutzername": req.session.sessionValue.sessionNutzer, "rolle": req.session.sessionValue.rolle, "aktion": ""}); //Produktlisten Array an produktliste.ejs übergeben
            }
        );
    } 
});

//Detail von einem Produkt
app.post("/detail/:id", function(req, res){

    if (!req.session.sessionValue){ //Abfrage ob eine Session besteht
        return res.render("home", {"nachricht": "Access Denied. Please Register!"}); //Gast kann den Warenkorb nicht nutzen
    }else{

        db.all(
            `SELECT * FROM produkte`, //er mag etwas an diesem param_id nicht
            function(err, rows){

                console.log(err);
                //console.log(rows);
                done(rows);
            } 
        );

        function done(rows){
            return res.render("detail", {"apfelid": req.params.id-1, "produkte" : rows, "nutzername": req.session.sessionValue.sessionNutzer,"rolle": req.session.sessionValue.rolle, "aktion": "", "cartCookie": req.cookies.cart}); 
        }
    }

});

//Login POST-Formular
app.post("/login_eingabe", function(req,res){
    const nutzername = req.body.nutzername; 
    const passwort = req.body.passwort;
    let loggedIn = false;                                               //Ohne die boolean mit if - Abfrage wird 2 Male gerendert und es gibt einen Fehler
    let fruits = [];
    res.cookie('cart', fruits, {"maxAge": 3600 * 1000});
    db.all(
        `SELECT benutzername,passwort,email,rolle FROM benutzer`,
        function(err, rows){
            for (const element in rows){
                if ((rows[element].benutzername == nutzername && bcrypt.compareSync(passwort, rows[element].passwort)) || (rows[element].email == nutzername && bcrypt.compareSync(passwort, rows[element].passwort))){
                    console.log(`${nutzername} wurde angemeldet`);
                    const sessionValue = rows[element].benutzername; 
                    req.session.sessionValue = {"sessionNutzer": sessionValue, "rolle": rows[element].rolle};
                    loggedIn = true;                                            
                    db.all(`SELECT * FROM produkte`, function(err, rows){
                        console.log(err);
                        return res.render("shop", {"produkte": rows, "nutzername": req.session.sessionValue.sessionNutzer, "rolle": req.session.sessionValue.rolle,"aktion": "Sie haben sich erfolgreich angemeldet", "cartCookie": req.cookies.cart});
                    });
                    break;
                };
            };
            if(!loggedIn){
            return res.render("login", {"nachricht": "Falsches Passwort oder Benutzername!"});
            }
        }
    );
});

//Register POST-Formular
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
            `SELECT benutzername, email, rolle FROM benutzer`,
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
                    `INSERT INTO benutzer (benutzername, passwort, email, rolle) VALUES("${nutzername}", "${hash}", "${email}", ${0})`, //Insert into benutzer
                    function(err){
                        console.log(`${nutzername} hat sich registriert`);
                        const sessionValue = req.body.nutzername; 
                        req.session.sessionValue = {"sessionNutzer": sessionValue, "rolle": 0};
                        db.all(
                            `SELECT * FROM produkte`, 
                            function(err, rows){
                                console.log(err);
                                return res.render("shop", {"produkte": rows, "nutzername": req.session.sessionValue.sessionNutzer, "rolle": req.session.sessionValue.rolle,"aktion": "Sie haben sich erfolgreich registriert", "cartCookie": req.cookies.cart});
                            }
                        );
                        //return res.render("shop", {"produkte": rows, "nutzername": req.session.sessionValue.sessionNutzer, "aktion": "Sie haben sich erfolgreich registriert"});
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
    const param_saft = req.body.saftig;
    let param_bild_path = req.files;
    const param_story = req.body.story;


    //Bild datei
        //If Abrage, ob Bild übergeben wurde
    if(req.files != null){
            const param_bild = param_bild_path;
            param_bild_path = "/public/" + Date.now() + param_bild.bild.name // Bildpath bekommt Zeitstempel
        
            param_bild.bild.mv(__dirname + param_bild_path); //Bild wird in /public/ path gelegt
    }else{
        param_bild_path = "/public/NoImageFound.jpg";
    }
    console.log(param_bild_path);


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
        `INSERT INTO produkte(name, preis, anzahl, knackig, versteckt, farbe, gewicht, saftig, bild, story) VALUES(
            "${param_name}", ${param_preis}, ${param_anzahl}, ${param_knackig}, ${param_versteckt}, "${param_farbe}", ${param_gewicht}, ${param_saft}, "${param_bild_path}", "${param_story}")`,
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
    //Nach Datensatz mit id suchen und Werte an Formular übergeben
    db.all(
        `SELECT * FROM produkte WHERE id = ${req.params.id}`,
        function(err, rows){
            res.render("update", rows[0]);
        }
    );
});

//Muss bearbeitet werden, alte Bilder werden nicht gelöscht
//POST Onupdate
app.post("/onupdate/:id", function(req, res){
    const product_id = parseInt(req.body.id);
    const param_update_name = req.body.produktname;
    const param_update_preis = req.body.produktpreis;
    const param_anzahl = req.body.anzahl;
    const param_knackig = req.body.knackig;
    let param_versteckt = req.body.versteckt;
    const param_farbe = req.body.farbe;
    const param_gewicht = req.body.gewicht;
    const param_saft = req.body.saftig;
    const param_story = req.body.story;
    let param_bild_path = req.files;


    if(param_versteckt == undefined){
        param_versteckt = "0"; //Sonst ist versteckt undifinied und die Tabelle kann nicht geupdated werden.
    }

    //Bild datei
    //If Abfrage, ob Parameter übergeben wurde   ////// Im else statement wird leider der param_bild_path zu {} statt aus den alten path aus der Datenbank zu nehmen...
    if(param_bild_path != null){
        console.log("Es wurde ein neues Bild hochgeladen");
        const param_bild = req.files.bild;
        param_bild_path = "/public/" + Date.now() + param_bild.name // Bildpath bekommt Zeitstempel
    
        param_bild.mv(__dirname + param_bild_path); //Bild wird in /public/ path gelegt

        db.run( //Hier werden die werte aus der Liste geupdatet
            `UPDATE produkte SET name = "${param_update_name}", preis = ${param_update_preis}, anzahl =  ${param_anzahl}, 
            knackig =  ${param_knackig}, versteckt =  ${param_versteckt}, farbe = "${param_farbe}", gewicht = ${param_gewicht}, saftig = ${param_saft}, bild = "${param_bild_path}", story = "${param_story}" WHERE id = ${req.params.id}`,
            function(err){
                console.log(err);
                console.log(param_update_name, param_update_preis, param_anzahl, param_knackig, param_versteckt, param_farbe, param_gewicht, param_saft, param_bild_path, param_story);
                res.redirect("/produktliste");
            }
        );

    }else{
        console.log("Es wurde kein neues Bild hochgeladen");
        db.all(`SELECT bild FROM produkte WHERE id = ${product_id}`,
            function(err, rows){
                param_bild_path = rows[0].bild;

                db.run( //Hier werden die werte aus der Liste geupdatet
                    `UPDATE produkte SET name = "${param_update_name}", preis = ${param_update_preis}, anzahl =  ${param_anzahl}, 
                    knackig =  ${param_knackig}, versteckt =  ${param_versteckt}, farbe = "${param_farbe}", gewicht = ${param_gewicht}, saftig = ${param_saft}, bild = "${param_bild_path}", story = "${param_story}" WHERE id = ${req.params.id}`,
                    function(err){
                        console.log(err);
                        console.log(param_update_name, param_update_preis, param_anzahl, param_knackig, param_versteckt, param_farbe, param_gewicht, param_saft, param_bild_path, param_story);
                        res.redirect("/produktliste");
                    }
                );
                
            }
        );
    };
});

//Ist die funktion für den put in cart button
app.post("/addcart/:id", function(req,res) {
    
    let anzahl = parseInt(req.body.anzahl);
    console.log(anzahl);
    if (isNaN(anzahl)){
        console.log("anzahl hat keine Zahl");
        anzahl = 1}
    console.log("Anzahl: " + anzahl +" Type:" + typeof(anzahl));

    //nimmt alten cookie wert und zwischenspeichert ihn
    let fruits = req.cookies.cart;

    db.all(  //holt die werte von dem apfel ()
        `SELECT * FROM produkte WHERE id = ${req.params.id}`,
        function(err, rows){
            console.log(err);
            done(rows);
        } 
    );

    //Benutze den Callback, weil der Code sonst asynchron abläuft, und diese funktion wartet auf die db.all Abfrage
    function done(rows){
        let isIncluded = false;
        
        //Füge das Datenbankobj in das Array hinzu - entweder wird die Anzahl erhöht oder ein neues Objekt hinzugefügt M.

        if(fruits != undefined){
            for (fruit of fruits){
                if (fruit[0][0].id == rows[0].id){
                        if (parseInt(fruits[fruits.indexOf(fruit)][1]) + parseInt(anzahl) > fruit[0][0].anzahl){
                            fruits[fruits.indexOf(fruit)][1] = parseInt(fruit[0][0].anzahl);
                        }else{     
                        fruits[fruits.indexOf(fruit)][1] = parseInt(fruits[fruits.indexOf(fruit)][1]) + parseInt(anzahl);
                        }
                        isIncluded = true;
                }
            }
        }
        if (!isIncluded){
            let product = [rows, parseInt(anzahl)];
                fruits.push(product); 
        }

        //überschreibt alten cookie mit dem wert vom alten + das hinzugefügte!
        res.cookie('cart', fruits, {"maxAge": 3600 * 1000});
        res.redirect("/shop");
    }
});

app.post("/onCountMutation", function(req, res){
    let anzahl = req.body.anzahl;
    let productId = req.body.productId;
    fruits = req.cookies.cart;
    console.log(anzahl);
    console.log(productId);
    for (fruit of fruits){
        if (fruit[0][0].id == productId){
                fruits[fruits.indexOf(fruit)][1] = anzahl;
        }
    }
    res.cookie('cart', fruits, {"maxAge": 3600 * 1000});
    res.redirect("/cart");
});

app.post("/onCountMutationButton", function(req, res){
    let productId = req.body.productId;
    let plus = req.body.plusOne;
    let minus = req.body.minusOne;
    let deleteFruit = req.body.delete;
    let anzahl = 0;
    let maxAnzahl = req.body.maxAnzahl;
    let deleteIt = false;

    if (deleteFruit == undefined ){
        if (plus == undefined){
            anzahl = minus;
        }else{
            if (plus<maxAnzahl){
                anzahl=plus;
            }else{
                anzahl=maxAnzahl;
            }
        }
    }else{
        anzahl = deleteFruit;
        deleteIt = true;
    }

    fruits = req.cookies.cart;

    /*
    console.log(req.body.productId);
    console.log(req.body.plusOne);
    console.log(req.body.minusOne);
    console.log(req.body.delete); 
    */
    for (fruit of fruits){
        if (fruit[0][0].id == productId){
            if(deleteIt || anzahl <= 0){
                fruits.splice(fruits.indexOf(fruit),1);
            }else{
                fruits[fruits.indexOf(fruit)][1] = anzahl;
            }
            break;
        }
    }
    res.cookie('cart', fruits, {"maxAge": 3600 * 1000});
    res.redirect("/cart");
}); 

app.post("/buy", function(req,res){
       
    fruits = req.cookies.cart;
    
    if(fruits.length == 0){
        res.redirect("/cart");
    }else{
        let e = 0;
        for(a = 0; a <= fruits.length-1; a++){
        db.run(
            `UPDATE produkte SET anzahl = anzahl-${fruits[a][1]} WHERE id = ${fruits[a][0][0].id}`,
            function(err){
                console.log(err);
                console.log(a, "a");
                if(a == fruits.length){
                done();
                }
            }
            )}
        



        function done(){
            fruits = [];
            console.log(fruits);
            res.cookie('cart', fruits, {"maxAge": 3600 * 1000});
            
            res.render("completion");
        }
    }
});

//Server starten
app.listen(3000, function(){
    console.log("listening on 3000");
});