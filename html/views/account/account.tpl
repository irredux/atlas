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
