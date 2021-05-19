import { Oculus } from "/file/js/oculus.js";
export { Login, AccountCreate, Logout };

class Login extends Oculus{
    constructor(res, resId=null, access=[], main=false){
        super(res, resId, access, main);
    }
    load(){
        document.body.textContent = "";
        let mainBody = document.createDocumentFragment();
        let header = document.createElement("DIV");
        header.id = "header";
        header.appendChild(el.h("dMLW", 1));
        header.appendChild(el.p("Ein digitales Angebot des MLW."));
        mainBody.appendChild(header);

        let loginDIV = document.createElement("DIV");
        loginDIV.id = "login";
        loginDIV.style.padding = "20px 25%";
        let login = document.createElement("FIELDSET");
        login.appendChild(el.h("Login", 2));
        let email = el.text("");
        let password = el.text("");
        password.type = "password";
        let submitLogin = el.button("Login");
        submitLogin.style.float = "right";
        submitLogin.onclick = () => {
            let data = {user: email.value, password: password.value};
            fetch("/session", {
                method: "post",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(data)
            }).then(response => response.text()).then(token => {
                if(token!=""){argos.login(token)}
                else {el.status("error", "Login fehlgeschlagen.")}
            });

        }
        login.appendChild(el.p("E-Mail:"));
        login.appendChild(email);
        login.appendChild(el.p("Passwort:"));
        login.appendChild(password);
        let createAccount = el.p("");
        createAccount.innerHTML = `<br />
                    Noch kein Benutzerkonto? <a onclick="argos.loadMain('account_create')">hier klicken</a><!--<br />
                    Passwort vergessen? <a onclick="argos.loadMain('account_forgotten')">hier klicken</a>-->
        `;
        createAccount.classList.add("minorTxt");
        login.appendChild(createAccount);
        login.appendChild(submitLogin);
        loginDIV.appendChild(login);
        mainBody.appendChild(loginDIV);

        let footer = document.createElement("DIV");
        footer.id = "footer";
        footer.innerHTML = `
            <p class="minorTxt" style="float: left;">
                <a href="mailto:alexander.haeberlin@mlw.badw.de"/>Kontakt</a>
            </p>
            <p class="minorTxt">letzte Änderungen: 5. Mai 2021</p>
        `;
        mainBody.appendChild(footer);

        document.body.appendChild(mainBody);
    }
}

class AccountCreate extends Oculus{
    constructor(res, resId=null, access=[], main=false){
        super(res, resId, access, main);
    }
    load(){
        document.body.textContent = "";
        let mainBody = document.createDocumentFragment();
        let header = document.createElement("DIV");
        header.id = "header";
        header.appendChild(el.h("Registrieren", 1));
        header.appendChild(el.p("Erstellen Sie ein neues Konto."));
        mainBody.appendChild(header);

        let loginDIV = document.createElement("DIV");
        loginDIV.id = "login";
        loginDIV.style.padding = "20px 25%";
        let login = document.createElement("FIELDSET");
        login.appendChild(el.h("Registrieren", 2));
        let firstName = el.text("")
        let lastName = el.text("")
        let email = el.text("")
        let password = el.text("");
        password.type = "password";
        let submitLogin = el.button("Senden");
        submitLogin.style.float = "right";
        submitLogin.style.margin = "10px";
        submitLogin.onclick = () => {
            const data = {
                first_name: firstName.value,
                last_name: lastName.value,
                email: email.value,
                password: password.value
            }
            fetch("/data/user", {method: "POST", 
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(data)}).
                then(re => {
                    if(re.status === 201){
                        alert("Der Account wurde erfolgreich erstellt. Allerdings muss er zuerst freigeschaltet werden.");
                        argos.loadMain("login");
                    } else if(re.status === 409){
                        el.status("error", "Die Email-Adresse ist bereits vorhanden.");
                    } else if(re.status === 406){
                        el.status("error", "Bitte füllen Sie alle Felder aus.");
                    } else {
                        el.status("error", "Die Registrierung is fehlgeschlagen. Versuchen Sie es erneut.");
                    }
                }).
                catch(e => {throw e});
        }
        login.appendChild(el.p("Vorname:"));
        login.appendChild(firstName);
        login.appendChild(el.p("Nachname:"));
        login.appendChild(lastName);
        login.appendChild(el.p("E-Mail:"));
        login.appendChild(email);
        login.appendChild(el.p("Passwort:"));
        login.appendChild(password);
        login.appendChild(submitLogin);
        let back = document.createElement("A");
        back.onclick = () => {argos.loadMain("login")}
        back.textContent = "zurück";
        let backBox = document.createElement("P");
        backBox.appendChild(back);
        login.appendChild(backBox);
        loginDIV.appendChild(login);
        mainBody.appendChild(loginDIV);

        let footer = document.createElement("DIV");
        footer.id = "footer";
        footer.innerHTML = `
            <p class="minorTxt" style="float: left;">
                <a href="mailto:alexander.haeberlin@mlw.badw.de"/>Kontakt</a>
            </p>
            <p class="minorTxt">letzte Änderungen: 5. Mai 2021</p>
        `;
        mainBody.appendChild(footer);

        document.body.appendChild(mainBody);
    }
}

class Logout extends Oculus{
    constructor(res, resId=null, access=[], main=false){
        super(res, resId, access, main);
    }
    async load(){
        sessionStorage.removeItem("token");
        // remove token from server
        location.href = "/";
    }
}
