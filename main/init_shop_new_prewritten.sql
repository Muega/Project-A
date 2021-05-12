/* 
ACHTUNG!!! Diese file wurde noch nicht initialisiert und ist noch im bearbeitungs-Modus. D.

theoretisch geht es hier darum, die Produkttabelle noch einmal neu zu initialisieren und dabei alle 
Parameter zu haben;
die Reihenfolge ist leicht verändert; 
story steht für den Beschreibungstext; 
im Moment fehlt noch im Instert Into das Bild (außer beim Blue Apple);
Die Namen sind noch nicht nach Farbe benannt;
*/
/* MEEGA geilo M. */

CREATE TABLE produkte (
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    name TEXT NOT NULL,
    knackig NUMERIC INTEGER, /* Knackigkeit 1 - 100*/
    saftig TEXT NOT NULL, /* Saftigkeit 1- 100 */
    farbe TEXT NOT NULL, /* Farbe Rot, Blau ...*/
    gewicht NUMERIC, /* Gewicht */
    preis NUMERIC,
    anzahl NUMERIC INTEGER,
    versteckt BOOLEAN,  /* Verstecktes Produkt? */
    bild TEXT, /* src="(den link zum Bild als STRING in database)"*/
    story TEXT
);

INSERT INTO produkte (name, knackig, saftig, farbe, gewicht, preis, anzahl, versteckt, bild, story) 
VALUES ("Horneburger Pfannkuchen", 85, 20, "green", 180, 0.99, 200, 0, "/public/horneburg_or_not.jpg", "This is a wonderful crunchy green apple.");
INSERT INTO produkte (name, knackig, saftig, farbe, gewicht, preis, anzahl, versteckt, bild, story) 
VALUES ("Horneburger Pfannkuchen", 85, 20, "red", 180, 0.99, 230, 0, "/public/horneburg_or_not.jpg", "This is a wonderful crunchy red apple." );

INSERT INTO produkte (name, knackig, saftig, farbe, gewicht, preis, anzahl, versteckt, bild, story) 
VALUES ("Kaiser Wilhelm", 35, 65, "green", 210, 1.20, 380, 0, "/public/Kaiser_Wilhelm.jpg", "The Kaiser Wilhelm is a powerful apple." );
INSERT INTO produkte (name, knackig, saftig, farbe, gewicht, preis, anzahl, versteckt, bild, story) 
VALUES ("Kaiser Wilhelm", 35, 65, "red", 210, 1.20, 290, 0, "/public/Kaiser_Wilhelm.jpg", "The Kaiser Wilhelm is a powerful apple." );

INSERT INTO produkte (name, knackig, saftig, farbe, gewicht, preis, anzahl, versteckt, bild, story) 
VALUES ("Martens Apfel", 40, 70, "red", 200, 1.40, 255, 0, "/public/martens_or_not.jpg", "The Martens Apfel is tasty as fuck." );

INSERT INTO produkte (name, knackig, saftig, farbe, gewicht, preis, anzahl, versteckt, bild, story) 
VALUES ("Nashi-Birne", 20, 80, "yellow", 230, 1.90, 205, 0, "/public/Nashi-Birne.jpg", "The Nashi-Birne is a juicy apple-pear from Japan." );

INSERT INTO produkte (name, knackig, saftig, farbe, gewicht, preis, anzahl, versteckt, bild, story) 
VALUES ("Herzapfel", 55, 70, "red", 190, 1.30, 310, 0, "/public/redApple.jpg","The Herzapfel will make you fall in love with summer again." );

INSERT INTO produkte (name, knackig, saftig, farbe, gewicht, preis, anzahl, versteckt, bild, story) 
VALUES ("Karakuchi Apple", 777, 112, "invisible", 10, 6.66, 360, 0, "/public/invisible-apple.jpg","This mysterious apple will change your perspective on life." );

INSERT INTO produkte (name, knackig, saftig, farbe, gewicht, preis, anzahl, versteckt, bild, story) 
VALUES ("Royal GALA Apple", 90, 90, "red", 210, 1.20, 160, 0, "/public/royalGala.png", "The Royal GALA Apple is especially delicious." );

INSERT INTO produkte (name, knackig, saftig, farbe, gewicht, preis, anzahl, versteckt, bild, story) 
VALUES ("Pink Lady Apple", 65, 85, "red", 180, 1.40, 170, 0, "/public/PinkLady1.jpg", "The Pink Lady Apple will charm you." );

INSERT INTO produkte (name, knackig, saftig, farbe, gewicht, preis, anzahl, versteckt, bild, story) 
VALUES ("Granny Smith Apple", 90, 80, "green", 208, 1.25, 55, 0, "/public/granny.jpg", "This lil granny is a sour one." );

INSERT INTO produkte (name, knackig, saftig, farbe, gewicht, preis, anzahl, versteckt, bild, story) 
VALUES ("Fuji-Apfel", 60, 40, "red", 159, 1.70, 190, 0, "/public/fujiApfel.jpg", "The Fuji-Apfel will make your day with its japanese taste." );

INSERT INTO produkte (name, knackig, saftig, farbe, gewicht, preis, anzahl, versteckt, bild, story) 
VALUES ("Braeburn Apple", 53, 82, "red", 160, 1.00, 210, 0, "/public/sexyRedApple.jpg", "The Braeburn Apple will is an apple. A very juicy one." );

INSERT INTO produkte (name, knackig, saftig, farbe, gewicht, preis, anzahl, versteckt, bild, story) 
VALUES ("Glockenapfel", 33, 64, "yellow", 220, 1.10, 155, 0, "/public/glockenapfel.jpg", "Glockenapfel means 'bell apple' in german, because of its bell-like shape. Neat, right?" );

INSERT INTO produkte (name, knackig, saftig, farbe, gewicht, preis, anzahl, versteckt, bild, story) 
VALUES ("Zitronenapfel", 66, 50, "green", 160, 1.80, 177, 0, "/public/zitronenapfel.jpg", "Zitronenapfel means 'lemon apple' in german. It should be yellow then, right?" );

INSERT INTO produkte (name, knackig, saftig, farbe, gewicht, preis, anzahl, versteckt, bild, story) 
VALUES ("Blue Apple", 15, 90, "blue", 170, 1.99, 42, 0, "/public/Blue_Apple.jpg", "The Blue Apple is our original creation. We promise it will change your life. Try it today!" );

/* 
Die Benutzer / Administrator müssen auch Initialisiert werden L.
*/

CREATE TABLE benutzer (
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    benutzername TEXT NOT NULL,
    passwort TEXT NOT NULL,
    email TEXT NOT NULL,
    rolle BOOLEAN
);
