<div class='closeLabel'>X</div>
<h3>Neues Lemma erstellen?</h3>
<form>
    <table>
        <tr>
            <td width='18%'>Lemma:</td>
            <td width='32%'><input type='text' name='lemma' value='' /></td>
        </tr>
        <tr>
            <td>Lemma (Anzeige):</td>
            <td><input type='text' name='lemma_display' value='' /></td>
        </tr>
        <tr>
            <td width='18%'>Wörterbücher:</td>
            <td width='32%'><input type='text' name='dicts' value='' /></td>
        </tr>
        <tr>
            <td>Zahlzeichen (bei Homonymen):</td>
            <td><input type='text' name='lemma_nr' value=0 /></td>
        </tr>
        <tr>
            <td>MLW <i class='minorTxt'>(wird ins Wörterbuch aufgenommen)</i></td>
            <td>
                <select name='MLW'>
                % if items[0].get('MLW', 0) == 1:
                    <option value='1' selected>Ja</option>
                    <option value='0'>Nein</option>
                % else:
                    <option value='1'>Ja</option>
                    <option value='0' selected>Nein</option>
                % end
                </select>
            </td>
        </tr>
        <tr>
            <td>fraglich <i class='minorTxt'>(mit ? markiert)</i></td>
            <td>
                <select name='Fragezeichen'>
                % if items[0].get('Fragezeichen', 0) == 1:
                    <option value='1' selected>Ja</option>
                    <option value='0'>Nein</option>
                % else:
                    <option value='1'>Ja</option>
                    <option value='0' selected>Nein</option>
                % end
                </select>
            </td>
        </tr>
        <tr>
            <td>Stern <i class='minorTxt'>(mit * markiert)</i></td>
            <td>
                <select name='Stern'>
                % if items[0].get('Stern', 0) == 1:
                    <option value='1' selected>Ja</option>
                    <option value='0'>Nein</option>
                % else:
                    <option value='1'>Ja</option>
                    <option value='0' selected>Nein</option>
                % end
                </select>
            </td>
        </tr>
        <tr>
            <td>Klammmerverweis <i class='minorTxt'>(mit [...] markiert)</i></td>
            <td>
                <select name='Klammerverweis'>
                % if items[0].get('Klammerverweis', 0) == 1:
                    <option value='1' selected>Ja</option>
                    <option value='0'>Nein</option>
                % else:
                    <option value='1'>Ja</option>
                    <option value='0' selected>Nein</option>
                % end
                </select>
            </td>
        </tr>
        <tr>
            <td>Eintrag ist auszuschließen <i class='minorTxt'>(mit [[...]]  markiert)</i></td>
            <td>
                <select name='Ausschluss'>
                % if items[0].get('Ausschluss', 0) == 1:
                    <option value='1' selected>Ja</option>
                    <option value='0'>Nein</option>
                % else:
                    <option value='1'>Ja</option>
                    <option value='0' selected>Nein</option>
                % end
                </select>
            </td>
        </tr>
    </table>
    <table>
        <tr>
            <td width='18%'>Kommentar:</td>
            <td width='32%'><textarea name='comment' style='height: 100px'></textarea></td>
        </tr>
        <tr>
            <td>
            </td>
            <td>
                <input type='button' class="noUpload" id="newLemma" value='erstellen' />
            </td>
        </tr>
    </table>
    <input type='hidden' name='res' value='lemma' />
</form>
