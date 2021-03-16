% author = items[0]
<form autocomplete='off'>
    <input type='hidden' name='res' value='author' />
% if author.get("id", 0) > 0:
    <input type='hidden' name='resId' value={{author.get("id")}} />
<h3>{{!author.get("full")}} <i class="minorTxt">(ID: {{author["id"]}})</i></h3>
% else:
<h3>Neuer Autor erstellen</h3>
% end
<table>
    <tr>
        <td width='18%'>Name:</td>
        <td width='32%'><input type='text' name='full' value='{{author.get("full", "")}}' /></td>

        <td width='18%'>Anzeigedatum:</td>
        <td width='32%'><input type='text' name='date_display' value='{{author.get("date_display", "")}}' /></td>
    </tr>
    <tr>
        <td>Abkürzung:</td>
        <td><input type='text' name='abbr' value='{{author.get("abbr", "")}}' /></td>

        <td>Abkürzung (Sortierung):</td>
        <td><input type='text' name='abbr_sort' value='{{author.get("abbr_sort", "")}}' /></td>
    </tr>
    <tr>
        <td>
            <div class='popOver' style='display:inline-box;'>
                <span style="z-index: 1">Sortierdatum <a>(?)</a>:</span>
                <div class='popOverContent' style='text-align: left;'>
                    % include("help/help_opera_sort")
                </div>
            </div>
        </td>
        <td><input type='text' name='date_sort' value='{{author.get("date_sort", "")}}' class="isNumber" /></td>

        <td>
            <div class='popOver' style='display:inline-box;'>
                Sortierdatum-Typ <a>(?)</a>:
                <div class='popOverContent' style='text-align: left;'>
                    % include("help/help_opera_sort_type")
                </div>
            </div>
        </td>
        <td><input type='text' name='date_type' value='{{author.get("date_type", "")}}' class="isNumber" /></td>
    </tr>
    <tr>
        <td>in Benutzung:</td>
        <td>
            <select name='in_use'>
                % if author.get("in_use", 0) > 0:
                <option value=1 selected>Ja</option>
                <option value=0>Nein</option>
                % else:
                <option value=1>Ja</option>
                <option value=0 selected>Nein</option>
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
        <td><textarea name='txt_info'>{{author.get("txt_info", "")}}</textarea></td>
    </tr>
    <tr>
        <td></td>
        <td style='text-align:right;'>
            % if author.get("id", 0) > 0:
            <input type='button' id="submitAuthor" value='Änderungen speichern' class="noUpload" />
            <input type='button' id="deleteAuthor" value='Autor löschen' class="noUpload" />
            % else:
            <input type='button' id="submitAuthor" value='Neuer Autor erstellen' class="noUpload" />
            % end
        </td>
    </tr>
</table>
</form>
<div class='popOver' style='top: 10px; right: 40px; text-align: right;'>
    <a>Hilfe</a>
    <div class='popOverContent' style='text-align: left;'>
        % include("help/help_html")
    </div>
</div>
<div class='closeLabel'>X</div>
