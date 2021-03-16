<div class='closeLabel'>X</div>
<h3>Zettel importieren</h3>
<form enctype='multipart/form-data'>
<table>
    <tr>
        <td>Buchstabe:</td>
        <td><input type='text' name='letter' value='S' /></td>
    </tr>
    <tr>
        <td>Zetteltyp:</td>
        <td>
            <select name='type'>
                <option value=0>...</option>
                <option value=1>verzettelt</option>
                <option value=2>Exzerpt</option>
                <option value=3>Index</option>
                <option value=4>Literatur</option>
            </select>
        </td>
    </tr>
    % if 'admin' in user['access']:
    <tr>
        <td>erstellt von:</td>
        <td>
            <datalist id='user_id_data'></datalist>
            <input type='text' name='user_id' class="isNumber" autocomplete='off' id="userInput" value="{{user["last_name"]}}" />
            <input type='hidden' name='user_id_id' id="userInput_hidden" value='{{user['id']}}' />
        </td>
    </tr>
    % end
    <tr>
        <td>Dateien:</td>
        <td>
            <input type='file' name='files' multiple />
            <p class='minorTxt'>max. 200 Bilder.</p>
        </td>
    </tr>
    <tr>
        <td></td>
        <td>
            <input type='checkbox' name='from_folder' id="from_folder" value='folder' />
            <label for='from_folder' class='minorTxt'>Aus 'import_zettel'-Ordner</label>
        </td>
    </tr>
    <tr>
        <td></td>
        <td><input type='button' id="importZettel" style='float: right;' value='hochladen' /></td>
    </tr>
</table>
<input type="hidden" name="res" value="zettel" />
</form>
