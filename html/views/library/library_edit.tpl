% edition = items[0]
<div class='closeLabel'>X</div>
% if edition.get('id', 0) > 0:
<h3>{{!edition.get('opus', '<i>Kein Werk verknüpft</i>')}} <i class='minorTxt'>(ID: {{items[0].get("id", 0)}})</i></h3>
% else:
<h3>Neue Edition erstellen</h3>
% end
<form autocomplete='off'> 
<div>
    <table>
        <tr>
            <td width='20%'>Verknüpftes Werk:</td>
            <td width='80%'>
                <input type='text' id="workInsert" value="{{edition.get('example', '')}}" class="noUpload" autocomplete='off' />
                <input type='hidden' name='work_id' id="workInsert_hidden" value='{{edition.get('work_id', '')}}' class="isNumber" />
            </td>
        </tr>
        <tr>
            <td></td>
            <td class="minorTxt">{{edition.get('bibliography', '')}}</td>
        </tr>
        <tr class='trScan'>
            <td></td>
            <td><a class="minorTxt" href='/library_viewer?edition={{edition.get('id', 0)}}' target='_blank'>Digitalisat öffnen</a></td>
        </tr>
        <tr>
            <td>Edition:</td>
            <td><textarea style='height: 50px;' name='edition_name' autocomplete='off'>{{edition.get('edition_name', '')}}</textarea>
        </tr>
        <tr>
            <td>Editor:</td>
            <td><input type='text' name='editor' value='{{edition.get("editor", "")}}' /></td>
        </tr>
        <tr>
            <td>Jahr:</td>
            <td><input type='text' name='year' value='{{edition.get("year", "")}}' class="isNumber" /></td>
        </tr>
        <tr>
            <td>Band:</td>
            <td>
                <input type='text' name='volume' value='{{edition.get("volume", "")}}' />
            </td>
        </tr>
        <tr>
            <td>Kommentar:</td>
            <td>
                <textarea name='comment' style="height: 50px">{{edition.get("comment", "")}}</textarea>
            </td>
        </tr>
        <tr>
            <td>Ressource:</td>
            <td>
                <select name="ressource" class="isNumber">
                        % if edition.get("ressource") == 0:
                        <option value="0" selected>textkritische Edition</option>
                        % else:
                        <option value="0">textkritische Edition</option>
                        % end
                        % if edition.get("ressource") == 1:
                        <option value="1" selected>textkritische Edition (veraltet)</option>
                        % else:
                        <option value="1">textkritische Edition (veraltet)</option>
                        % end
                        % if edition.get("ressource") == 2:
                        <option value="2" selected>Handschrift</option>
                        % else:
                        <option value="2">Handschrift</option>
                        % end
                        % if edition.get("ressource") == 3:
                        <option value="3" selected>Alter Druck</option>
                        % else:
                        <option value="3">Alter Druck</option>
                        % end
                        % if edition.get("ressource") == 4:
                        <option value="4" selected>Sonstiges</option>
                        % else:
                        <option value="4">Sonstiges</option>
                        % end
                </select>
            </td>
        </tr>
        </table>
        <br />
        <hr />
        <br />
        <table>
        <tr>
            <td width="20%">Typ:</td>
            <td width="80%">
                <select id="selectType" class="noUpload">
                    % if edition.get("path", "") == "":
                        <option selected>Link</option>
                        <option>Scan</option>
                    % else:
                        <option>Link</option>
                        <option selected>Scan</option>
                    % end
                </select>
            </td>
        </tr>
    </table>
</div>
<div id="trLink">
    <table>
        <tr>
            <td width="20%">Link:</td>
            <td width="80%"><input type='text' name='url' value='{{edition.get("url", "")}}' />
        </tr>
    </table>
</div>
<div id="trScan">
    <table>
        <tr>
            <td width="20%">Dateipfad auf Server:</td>
            <td width="80%">
                <input type="text" name="path" value= "{{edition.get("path", "")}}" />
            </td>
        </tr>
        % if edition.get('id', 0) > 0:
        <tr>
            <td>Ursprünglicher Dateiname:</td>
            <td>
                {{edition.get("dir_name", "")}}
            </td>
        </tr>
        <tr>
            <td>Scan-Seiten berabeiten:</td>
            <td>
                <a id="openIMGSelector">Scans zuweisen...</a>
            </td>
        </tr>
        % end
        <tr>
            <td width="20%">Letzte Seite:</td>
            <td width="80%"><input type='text' name='default_page' value='{{edition.get("default_page", "")}}' />
        </tr>
    </table>
</div>
<div>
    <table>
        <tr>
            <td width="20%"></td>
            <td width="80%"><input type='button' id="submitLibrary" value='speichern' class="noUpload" />
        </tr>
    </table>
</div>
<input type="hidden" name="res" value="edition" />
% if edition.get("id", 0) != 0:
<input type="hidden" name="resId" value="{{edition["id"]}}" />
% end
</form>
