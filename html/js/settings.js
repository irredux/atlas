import { Oculus } from "/file/js/oculus.js";
import { ContextMenu } from "/file/js/contextmenu.js";
export { Account, Help };

class Account extends Oculus{
    constructor(res, resId=null, access=[], main=false){
        super(res, resId, access, main);
    }
    async load(){
        let mainBody = document.createDocumentFragment();
        let user = await argos.user();

        let cardPersonal = el.card();
        cardPersonal.style.margin = "20px 10%";
        cardPersonal.appendChild(el.h("Einstellungen", 2));
        cardPersonal.appendChild(el.h("Persönliche Daten", 3));
        let firstName = el.text(user.first_name);
        let lastName = el.text(user.last_name);
        let eMail = el.text(user.email);
        const tblPersonal = [
            ["Vorname:", firstName],
            ["Nachname:", lastName],
            ["E-Mail-Adresse:", eMail]
        ];
        cardPersonal.appendChild(el.table(tblPersonal, ["30%", "70%"]));
        let savePersonal = el.button("Änderungen speichern");
        savePersonal.onclick = () => {
            arachne.user.save({id: user.id, first_name: firstName.value,
                last_name: lastName.value, email: eMail.value}).
                then(() => {el.status("saved")}).
                catch(e => {throw e});
        }
        cardPersonal.appendChild(savePersonal);
        mainBody.appendChild(cardPersonal);

        let cardPassword = el.card();
        cardPassword.style.margin = "20px 10%";
        cardPassword.appendChild(el.h("Passwort", 3));
        let newPassword= el.text(""); newPassword.type = "password";
        let oldPassword= el.text(""); oldPassword.type = "password";
        const tblPassword= [
            ["neues Passwort:", newPassword],
            ["altes Passwort:", oldPassword],
        ];
        cardPassword.appendChild(el.table(tblPassword, ["30%", "70%"]));
        let savePassword = el.button("Änderungen speichern");
        savePassword.onclick = () => {
            arachne.user.save({id: user.id, old_password: oldPassword.value,
                new_password: newPassword.value}).
                then(() => {el.status("saved")}).
                catch(e => {throw e});
        }
        cardPassword.appendChild(savePassword);
        mainBody.appendChild(cardPassword);

        let cardWebsite = el.card();
        cardWebsite.style.margin = "20px 10%";
        cardWebsite.appendChild(el.h("Darstellung der Webseite", 3));
        let iZettel = el.text(argos.userDisplay.z_width);
        let iSearch = el.select(argos.userDisplay.sOrder, {0: "normal", 1: "ID"});
        const tblWeb = [["Breite der Zettel:", iZettel],
            ["Suche ordnen nach...", iSearch]];
        cardWebsite.appendChild(el.table(tblWeb));
        let saveWeb = el.button("Änderungen speichern");
        saveWeb.onclick = () => {
            argos.userDisplay.z_width = iZettel.value;
            argos.userDisplay.sOrder = parseInt(iSearch.value);
            argos.setUserDisplay();
            el.status("saved");
        };
        cardWebsite.appendChild(saveWeb);
        cardWebsite.appendChild(el.p("Die Änderungen werden nur lokal im Browser gespeichert und werden nicht über den Server synchronisiert. - <b>Achtung:</b> Es kann sein, dass die Webseite neu geladen werden muss, damit die Änderungen sichtbar werden."));
        mainBody.appendChild(cardWebsite);

        let cardDB = el.card();
        cardDB.style.margin = "20px 10%";
        cardDB.appendChild(el.h("Lokale Datenbank", 3));
        cardDB.appendChild(el.p("Hier finden Sie die lokal gespeicherten Tabellen. Optimierte Tabellen werden im Arbeitsspeicher behalten und sind schneller verfügbar. Es kann aber sein, dass der Computer oder Browser dadurch verlangsamt wird."));
        let tblContent = [["<b>Tabellen-Name</b>", "<b>zuletzt aktualisiert</b>", "<b>optimiert</b>"]];
        for(const tbl of arachne.oStores){
            let iOptimize = document.createElement("A");
            iOptimize.textContent = arachne[tbl].optimize ? "ja" : "nein";
            iOptimize.onclick = () => {
                const cIndex = argos.userDisplay.optimize.indexOf(tbl);
                if(cIndex > -1){
                    argos.userDisplay.optimize.splice(cIndex, 1);
                } else {
                    argos.userDisplay.optimize.push(tbl);
                }
                argos.setUserDisplay();
                location.reload();
            }
            tblContent.push([tbl, await arachne[tbl].version(), iOptimize]);
        }
        cardDB.appendChild(el.table(tblContent));
        let setupB = el.button("Lokale Datenbank neu generieren");
        setupB.onclick = () => {
            document.body.innerHTML = "<div id='loadLabel'>Lokale Datenbank wird gelöscht...</div>";
            localStorage.removeItem("lastFullUpdate");
            arachne.deleteDB().then(() => {location.reload()});
        }
        cardDB.appendChild(setupB);
        mainBody.appendChild(cardDB);

        this.ctn.appendChild(mainBody);
    }
}

class Help extends Oculus{
    constructor(res, resId=null, access=[], main=false){
        super(res, resId, access, main);
    }
    load(){
        let mainBody = document.createDocumentFragment();
        let helpText = document.createElement("DIV");
        helpText.classList.add("card");
        helpText.innerHTML = `
        <h2>Hilfe</h2>
        <p>
        <a href="https://gitlab.lrz.de/haeberlin/dmlw/-/wikis/00-Start">Hilfe und Informationen</a> zu dMLW finden Sie auf unsererer
        <a href="https://gitlab.lrz.de/haeberlin/dmlw">GitLab-Seite</a>.</p>
        <p>Informationen zum Wörterbuch-Projekt auf <a href="www.mlw.badw.de">www.mlw.badw.de</a></p>
            `;
        mainBody.appendChild(helpText);
        this.ctn.appendChild(mainBody);
    }
}

class Version extends Oculus{
    constructor(res, resId=null, access=[], main=false){
        super(res, resId, access, main);
    }
    async load(){
        let url = `/page/${this.res}`;
        if (this.resId != null){url += "/"+this.resId}
        arachne.getPage(url, this.ctn)
            .then(text => {this.ctn.innerHTML=text})
            .then(rest => {this.loadScript()})
            .catch(e => {throw e});
    }

    loadScript(){
        this.setTabs = true;
    }
}
