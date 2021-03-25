let user = ["Alice", "Bob", "Carla", "David"];
let pw = ["§$y45/912v", "secret", "123", "daviD"];

//Funktionsaufruf nr.1
console.log(benuternameExestiert("Alice"))

//Funktionsaufruf nr.2
console.log(anmeldungErfolgreich("Alice", "§$y45/912v"));

//Funktionsaufruf nr.2 ist false, weil das ein anderes passwort ist.
console.log(anmeldungErfolgreich("Alice", "secret"));

//Funktionsaufruf nr.3
console.log(benutzerHinzufügen("peter", "54321"));
console.log(user, pw);

//Funktionsaufruf nr.3 passiert nichts, falls benutzername schon vergeben.
console.log(benutzerHinzufügen("Alice", "54321"));
console.log(user, pw);


//Funktion 1
function benuternameExestiert(benutzername){
    for (benutzer of user){
        if(benutzer == benutzername){
            return true;
        }
    }
}   return false;

//Funktion 2
function anmeldungErfolgreich(benutzername, passwort){
    for (benutzer of user){
        if(benutzer == benutzername){
            for(pass of pw){
                //guckt ob auch das richtige passwort für den richtigen benutzer geprüft wird.
                if(pass == passwort & user.indexOf(benutzer) == pw.indexOf(pass)){
                    return true;
                }
            }
        }
    }
    return false;
}

//Funktion 3
function benutzerHinzufügen(benutzername, passwort){
    for(benutzer of user){
        if(benutzer == benutzername){
            return;
        }       
    } 
    user.push(benutzername);
    pw.push(passwort);
}