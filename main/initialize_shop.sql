/* 
Initialisiert die Datenbank, wird aus sqlite3 heraus geladen mit: 
> .read initialize_shop.sql
*/ 

/* Tabelle produkte erzeugen */
CREATE TABLE produkte (
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    name TEXT NOT NULL,
    preis NUMERIC,
    anzahl NUMERIC INTEGER,
    knackig NUMERIC INTEGER, /* Knackigkeit 1 - 100*/
    versteckt BOOLEAN,  /* Verstecktes Produkt? */
    farbe TEXT NOT NULL, /* Farbe Rot, Blau ...*/
    gewicht NUMERIC, /* Gewicht */
    saft TEXT NOT NULL, /* Saftigkeit 1- 100 */
    bild TEXT /* src="(den link zum Bild als STRING in database)"*/
);

CREATE TABLE benutzer (
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    benutzername TEXT NOT NULL,
    passwort TEXT NOT NULL,
    email TEXT NOT NULL
);

CREATE TABLE administrator (
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    benutzername TEXT NOT NULL,
    passwort TEXT NOT NULL,
    email TEXT NOT NULL
);

/* Produkte */
INSERT INTO produkte (name, preis, anzahl, knackig, versteckt, farbe, gewicht, saft) VALUES ("Red Apple", 9.99, 6, 50, 0, "Rot", 3.00, 23);
INSERT INTO produkte (name, preis, anzahl, knackig, versteckt, farbe, gewicht, saft) VALUES ("Blue Apple", 4.99, 3, 10, 0, "Blau", 2.23, 67);
INSERT INTO produkte (name, preis, anzahl, knackig, versteckt, farbe, gewicht, saft) VALUES ("Yellow Apple", 2.99, 23, 80, 0, "Gelb", 35.46, 10);

