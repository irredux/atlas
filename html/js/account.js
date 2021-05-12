import { Oculus } from "/file/js/oculus.js";
import { Arachne } from "/file/js/arachne.js";
export { Login, Logout };

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
                    Noch kein Benutzerkonto? <a href="/account_create">hier klicken</a><!--<br />
                    Passwort vergessen? <a href="/account_forgotten">hier klicken</a>-->
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
