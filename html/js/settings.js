import { Oculus } from "/file/js/oculus.js";
import { ContextMenu } from "/file/js/contextmenu.js";
export { Account, Help, Version };

class Account extends Oculus{
    constructor(res, resId=null, access=[], main=false){
        super(res, resId, access, main);
    }
    async load(){
        let mainBody = document.createDocumentFragment();
        let cardDB = el.card();
        cardDB.style.margin = "20px 10%";
        //cardDB.appendChild(el.h("Persönliche Einstellungen", 3));
        cardDB.appendChild(el.h("Lokale Datenbank", 3));
        let setupB = el.button("Lokale Datenbank neu generieren");
        setupB.onclick = () => {
            document.body.innerHTML = "<div id='loadLabel'>Lokale Datenbank wird gelöscht...</div>";
            arachne.deleteDB().then(() => {location.reload()});
        }
        cardDB.appendChild(setupB);
        mainBody.appendChild(cardDB);
        /*
<div class='card' style="margin:20px 10%;">
    <h2>Einstellungen</h2>
    <form>
    <h3>Persönliche Daten</h3>
        <table>
            <tr>
                <td width="30%">Vorname:</td>
                <td><input type='text' name='first_name' value='{{user.get('first_name', '')}}' /></td>
            </tr>
            <tr>
                <td>Nachname:</td>
                <td><input type='text' name='last_name' value='{{user.get('last_name', '')}}' /></td>
            </tr>
            <tr>
                <td>E-Mail-Adresse:</td>
                <td><input type='text' name='email' value='{{user.get('email', '')}}' /></td>
            </tr>
        </table>
        <h3>Einstellungen zur Suche</h3>
        <table>
            <tr>
                <td width="30%"></td>
                <td>
                    % if user.get("show_raw", 0) != 0:
                    <input type='checkbox' name='show_raw' value='1' checked id="showRaw" />
                    % else:
                    <input type='checkbox' name='show_raw' value='1' id="showRaw" />
                    % end
                    <label for="showRaw">unbearbeitete Zettel anzeigen.</label>
                </td>
            </tr>
            <tr>
                <td>Suche ordnen ...:</td>
                <td>
                    % if user.get("order_by_id", 0) != 0:
                    <input type='radio' name='order_by_id' value='0' id="searchOrderNormal" />
                    <label for="searchOrderNormal">... normal.</label><br />
                    <input type='radio' name='order_by_id' value='1' id="searchOrderId" checked />
                    <label for="searchOrderId">... ID.</label>
                    % else:
                    <input type='radio' name='order_by_id' value='0' id="searchOrderNormal" checked />
                    <label for="searchOrderNormal">... normal.</label><br />
                    <input type='radio' name='order_by_id' value='1' id="searchOrderId"/>
                    <label for="searchOrderId">... nach ID.</label>
                    % end
                </td>
            </tr>
            <tr><td></td><td></td></tr><tr><td></td><td></td></tr><tr><td></td><td></td></tr><tr><td></td><td></td></tr>
            <tr>
                <td>aktuelles Passwort:</td>
                <td>
                    <input type='password' name='c_password' />
                </td>
            </tr>
            <tr>
                <td></td>
                <td>
                    <input type='button' style='float: right;' id="saveUser" class="noUpload" value='ändern' />
                    <input type='hidden' name="res" value='user' />
                    <input type='hidden' name="resId" value='{{user["id"]}}' />
                </td>
            </tr>
        </table>
    </form>
</div>
<div class='card' style="margin:20px 10%;">
    <h2 id='password'>Passwort ändern</h2>
    <form>
        <table>
            <tr>
                <td width="30%">altes Passwort:</td>
                <td><input type='password' name='c_password' /></td>
            </tr>
            <tr>
                <td>neues Passwort:</td>
                <td><input type='password' name='password' /></td>
            </tr>
            <tr>
                <td></td>
                <td><input type='submit' style='float: right;' id='savePassword' class="noUpload" value='ändern' /></td>
            </tr>
        </table>
    </form>
</div>
<div class='card' style="margin:20px 10%;">
    <h2 id='look'>Darstellung der Webseite</h2>
    <form>
        <table>
            <tr>
                <td width="30%">Breite der Zettel:</td>
                <td><input type='text' name='z_width' value='' /></td>
            </tr>
            <tr>
                <td></td>
                <td>
                    <input type='button' value='ändern' id="saveDisplay" style='float: right;' />
                </td>
            </tr>
        </table>
    </form>
</div>
         */

        this.ctn.appendChild(mainBody);
    }

    loadScript(){
        let that = this;
        this.ctn.querySelector("input[name=z_width]").value = argos.userDisplay.z_width;
        this.ctn.querySelector("input#saveUser").addEventListener("click", function(){that.updateData(function(){that.refresh()})});
        this.ctn.querySelector("input#savePassword").addEventListener("click", function(){that.updateData(function(){that.refresh()})});
        this.ctn.querySelector("input#saveDisplay").addEventListener("click", function(){
            argos.userDisplay["z_width"] = that.ctn.querySelector("input[name=z_width]").value;
            argos.setUserDisplay();
            location.reload();
        });
    }
}

class Help extends Oculus{
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
