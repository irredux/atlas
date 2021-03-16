<div class='closeLabel'>X</div>
% if len(items[0]) > 0:
<h3>{{items[0].get("lemma", "")}} <i class='minorTxt'>(ID: {{items[0].get("id", 0)}})</i></h3>
% else:
<h3>Neues Lemma erstellen</h3>
% end
<div class='popOver' style='top: 10px; right: 40px; text-align: right;'>
    <a>Hilfe</a>
    <div class='popOverContent' style='text-align: left;'>
        % include("help/help_html")
    </div>
</div>
<form autocomplete='off'>
    <input type='hidden' name='res' value='lemma' />
% if len(items[0]) > 0:
    <input type='hidden' name='resId' value={{items[0].get("id", 0)}} />
% end
<table>
    <tr>
        <td width='18%'>Lemma:</td>
        <td width='32%'><input type='text' name='lemma' value='{{items[0].get("lemma", "")}}' /></td>

        <td width='18%'>Wörterbücher:</td>
        <td width='32%'><input type='text' name='dicts' value='{{items[0].get("dicts", "")}}' /></td>
    </tr>
    <tr>
        <td>Lemma-Anzeige:</td>
        <td><input type='text' name='lemma_display' value='{{items[0].get("lemma_display", "")}}' /></td>
        <td>Zahlzeichen (bei Homonymen):</td>
        <td><input type='text' name='lemma_nr' value='{{items[0].get("lemma_nr", 0)}}' /></td>
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
        <td></td>
        <td></td>
    </tr>
</table>
<br />
<table>
    <tr>
        <td width='18%'>Kommentar:</td>
        <td><textarea name='comment' style='height: 80px'>{{items[0].get("comment", "")}}</textarea></td>
    </tr>
    <tr>
        <td></td>
        <td><input type='button' class='noUpload' id='saveChanges' value='speichern' /></td>
    </tr>
</table>
</form>
</div>
<div class='card single'>
<!--<span style='color: transparent; text-shadow: 0 0 0 red;'>&#x1F418;</span>-->
% if items[0].get("zettel_count", 0) > 0:
   Anzahl verknüpfter Zettel: {{items[0].get("zettel_count")}}.<br />
% elif items[0].get("id", 0) != 0:
   <form method='post'>
        <input type='hidden' name='res' value='lemma' />
        <input type='hidden' name='resId' value={{items[0].get("id")}} />
       Keine verknüpften Zettel. Soll das Lemma gelöscht werden?
       <input type='button' id='deleteEntry' value='löschen' />
   </form>
% end
