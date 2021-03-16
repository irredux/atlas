% work = items[0]
<form autocomplete='off'>
    <input type='hidden' name='res' value='work' />
% if work.get("id", 0) > 0:
    <input type='hidden' name='resId' value={{work["id"]}} />
<h3>{{!work.get("full")}} <i class="minorTxt">(ID: {{work["id"]}})</i></h3>
% else:
<h3>Neues Werk erstellen</h3>
% end
<table>
    <tr>
        <td width='18%'>Name:</td>
        <td width='32%'><input type='text' name='full' value='{{work.get("full", "")}}' /></td>

        <td width='18%'>Anzeigedatum:</td>
        <td width='32%'><input type='text' name='date_display' value='{{work.get("date_display", "")}}' /></td>
    </tr>
    <tr>
        <td>Abkürzung:</td>
        <td><input type='text' name='abbr' value='{{work.get("abbr", "")}}' /></td>

        <td>Abkürzung (Sortierung):</td>
        <td><input type='text' name='abbr_sort' value='{{work.get("abbr_sort", "")}}' /></td>
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
        <td><input type='text' name='date_sort' value='{{work.get("date_sort", "")}}' class="isNumber" /></td>

        <td>
            <div class='popOver' style='display:inline-box;'>
                Sortierdatum-Typ <a>(?)</a>:
                <div class='popOverContent' style='text-align: left;'>
                    % include("help/help_opera_sort_type")
                </div>
            </div>
        </td>
        <td><input type='text' name='date_type' value='{{work.get("date_type", "")}}' class="isNumber" /></td>
    </tr>
    <tr>
        <td>Abweichender Autorenname<br />(z.B. bei VITA):</td>
        <td><input type='text' name='author_display' value='{{work.get("author_display", "")}}' /></td>

        <td></td><td></td>
    </tr>
</table>
<br />
<table>
    <tr>
        <td width='18%'>Stellenangabe (Bsp.):</td>
        <td width='32%'><input type='text' name='citation' value='{{work.get("citation", "")}}' /></td>

        <td width='18%'>Autor:</td>
        <td width='32%'>
        <select name='author_id' data-startvalue='{{work.get("author_id", "")}}'></select>
        <!--
        <input type='hidden' value='{{work.get("author_id", "")}}' />
        -->
        </td>

    </tr>
    <tr>
        <td>gehört zu den <i>opera maiora</i>:</td>
        <td>
            <select name="is_maior">
                % if work.get("is_maior", 0) > 0:
                <option value="1" selected>Ja</option>
                <option value="0">Nein</option>
                % else:
                <option value="1">Ja</option>
                <option value="0" selected>Nein</option>
                % end
            </select>
        </td>
        <td class="minorCit" 
        % if work.get("is_maior", 0) != 0:
            style="visibility: hidden;"
        % end
        >Stellangabe Bibliographie (<i>minora</i>):</td>
        <td class="minorCit" 
        % if work.get("is_maior", 0) != 0:
            style="visibility: hidden;"
        % end
        ><input type='text' name='bibliography_cit' value='{{work.get("bibliography_cit", "")}}' /></td>
    </tr>
    <tr>
        <td>Referenz:</td>
        <td><input type='text' name='reference' value='{{work.get("reference", "")}}' /></td>

        <td>in Benutzung:</td>
        <td>
        <select name="in_use">
            % if work.get("in_use", 0) > 0:
            <option value="1" selected>Ja</option>
            <option value="0">Nein</option>
            % else:
            <option value="1">Ja</option>
            <option value="0" selected>Nein</option>
            % end
        </select>
    </tr>
</table>
<table>
    <tr>
        <td>Kommentar:<br />
        <textarea name='txt_info'>{{work.get("txt_info", "")}}</textarea></td>
        <td>Bibliographie:<br />
        <textarea name='bibliography'>{{work.get("bibliography", "")}}</textarea></td>
    </tr>
</table>
<table>
    <tr>
        <td></td>
        <td style='text-align:right;'>
            % if work.get("id", 0) > 0:
            <input type='button' class="noUpload" id="submitWork" value='Änderungen speichern' />
            <input type='button' class="noUpload" id="deleteWork" value='Werk löschen' />
            % else:
            <input type='button' class="noUpload" id="submitWork" value='Neues Werk erstellen' />
            % end
        </td>
    </tr>
</table>
</form>
<div class='closeLabel'>X</div>
