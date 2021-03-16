% zettel = items[0]
<div class='addZettelText'>
    <h3>Zettel erstellen</h3>
    <form>
    <div class="tbl">
        <div class="tr">
        </div>
    </div>
    <table>
        <tr>
            <td width="25%">Lemma:</td>
            <td width="75%">
                <input type='text' id="lemmaInsert" class="noUpload" name='lemma' autocomplete='off' />
                <input type='hidden' class="isNumber" id="lemmaInsert_hidden" name='lemma_id' value='' />
            </td>
        </tr>
            <td>Zetteltyp:</td>
            <td>
                <select name='type' id="zettelType">
                    <option value=5>Ausgeschriebener Zettel</option>
                    <option value=4>Literatur</option>
                </select>
            </td>
        </tr>
    </table>
    <div id="litEntry" style="display: none;">
    <table>
        <tr>
            <td width="25%">Literaturangabe:</td>
            <td width="75%">
                <input type='text'class="noUpload" id="litInput" name='lit' autocomplete='off' />
                <input type='hidden' class="isNumber" name='lit_id' id="litInput_hidden" value='' />
            </td>
        </tr>
    </table>
    </div>
    <div id="noLitEntry">
    <table style="width: 100%">
        <tr>
            <td width="25%">Zitiertitel:</td>
            <td width="75%">
                <input type='text'class="noUpload" id="workInput" name='work' autocomplete='off' />
                <input type='hidden' class="isNumber" name='work_id' id="workInput_hidden" value='' />
            </td>
        </tr>
        <tr>
            <td><i>opera</i>-Liste:</td>
            <td>
                <select class="noUpload" id='operaList'>
                    <option value=0>maiora</option>
                    <option value=1>minora</option>
                </select>
            </td>
        </tr>
        <tr>
            <td>Stellenangabe:</td>
            <td><input type='text' name='stellenangabe' autocomplete='off' /></td>
        </tr>
    </table>
    <div id="minoraEntry" style="display: none;">
    <table>
        <tr>
            <td width="25%">Bibliographie:</td>
            <td width="75%">
                <input type='text' name='stellenangabe_bib' autocomplete='off' />
            </td>
        </tr>
    </table>
    </div> <!-- minoraEntry-->
    </div> <!-- noLitEntry-->
    <table>
        <tr>
            <td width="25%">Text:</td>
            <td width="75%"><textarea name='txt'></textarea></td>
        </tr>
        <tr>
            <td></td>
            <td><input type='button' class="noUpload" id="createZettel" value='erstellen' /></td>
        </tr>
    </table>
        <input type="hidden" name="res" value="zettel" />
        <input type="hidden" name="user_id" class="isNumber" value="{{user['id']}}" />
        <input type="hidden" name="c_date" value="{{c_date}}" />
        <input type="hidden" name="created_date" value="{{c_date}}" />
        <input type="hidden" name="created_by" value="{{user['id']}}" />
    </form>
</div>
<div class='closeLabel'>X</div>
