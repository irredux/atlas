<script>
    function submitProject(){
        if (selRow['ids'].length == 0){
            alert('Keine Zettel ausgewählt!');
            return;
        };

        $.ajax({
            url: '/get_row',
            type: 'POST',
            data: {
                'table_name': 'article',
                'project_id': $('option:selected', 'select[name=project]').data('value'),
                'position': '000',
            }}).done(function(r_ids){
                if (r_ids != ''){
                    var article_id = JSON.parse(r_ids)[0];
                    let idLst = selRow['ids'];
                    for (var i=0; i<idLst.length; i++){
                        $.ajax({
                            url: '/change_row',
                            type: 'POST',
                            data: {
                                'table_name': 'zettel_lnk',
                                'zettel_id': idLst[i],
                                'article_id': article_id
                            }}).done(function(){
                            parent.parent.showStatus('Speichern erfolgreich.');
                        });
                    };
                } else {
                    alert('Es gibt ein Problem mit dem Projekt!');
                };
        });
    };
</script>
<div class='closeLabel'>X</div>
<div style='padding: 20px 0 0px 0;'>
    <div class='tab_header' name='zettel_batch' style='padding: 0px 20px;'>
        % if "z_edit" in user["access"]:
        <div class='tab' name='zb_lemma'>Lemma</div>
        <div class='tab' name='zb_opera'>Autor/Werk</div>
        <div class='tab' name='zb_zTyp'>Zettel-Typ</div>
        % end
        % if "editor" in user["access"]:
        <div class='tab' name='zb_project'>Projekt</div>
        % end
    </div>
    <div class='tab_content' name='zettel_batch' style='margin: 0px 20px 20px 20px; background: var(--mainBG);'>
        % if "z_edit" in user["access"]:
        <div class='tab_container' name='zb_lemma'>
            <form>
            <table>
                <tr>
                    <td width='100px'>Lemma:</td>
                    <td>
                        <input type='text'class="noUpload"  id="lemmaInsert" autocomplete='off' />
                        <input type='hidden' name="lemma_id" id="lemmaInsert_hidden" class="isNumber" value='' />
                    </td>
                </tr>
                <tr>
                    <td></td>
                    <td style='text-align: right;'>
                        <input type='button' id="lemmaBatchSubmit" class="noUpload" value="übernehmen" />
                        <input type='hidden' name="res" value="zettel" />
                        <input type='hidden' name="user_id" value="{{user["id"]}}" />
                        <input type='hidden' name="c_date" value="{{c_date}}" />
                    </td>
                </tr>
            </table>
            </form>
        </div>
        <div class='tab_container' name='zb_opera'>
            <form>
            <table>
                <tr class='work'>
                    <td width='100px'>Werk:</td>
                    <td>
                        <input type='text' class="noUpload" id="workBatch" autocomplete="off" />
                        <input type='hidden' name='work_id' id="workBatch_hidden" class="isNumber" value="" />
                    </td>
                </tr>
                <tr>
                    <td></td>
                    <td style='text-align: right;'>
                        <input type='button' id="workBatchSubmit" class="noUpload" value='übernehmen' />
                        <input type='hidden' name="res" value="zettel" />
                        <input type='hidden' name="user_id" value="{{user["id"]}}" />
                        <input type='hidden' name="c_date" value="{{c_date}}" />
                    </td>
                </tr>
            </table>
            </form>
        </div>
        <div class='tab_container' name='zb_zTyp'>
            <form>
            <table>
                <tr class='type'>
                    <td width='200px'>Zettel-Typ:</td>
                    <td>
                        <select name='type'>
                            <option value=1 selected>verzettelt</option>
                            <option value=2>Exzerpt</option>
                            <option value=3>Index</option>
                            <option value=4>Literatur</option>
                        </select>
                    </td>
                </tr>
                <tr>
                    <td></td>
                    <td style='text-align: right;'>
                        <input type='button' id="typeBatchSubmit" class="noUpload" value='übernehmen' />
                        <input type='hidden' name="res" value="zettel" />
                        <input type='hidden' name="user_id" value="{{user["id"]}}" />
                        <input type='hidden' name="c_date" value="{{c_date}}" />
                    </td>
                </tr>
            </table>
            </form>
        </div>
        % end
        % if "editor" in user["access"]:
        <div class='tab_container' name='zb_project'>
            <table>
                <tr>
                    <td width='200px'>Zu Projekt hinzufügen:</td>
                    <td>
                        <select name='article_id'>
                        </select>
                    </td>
                </tr>
                <tr>
                    <td></td>
                    <td style='float: right;'>
                        <input type='button' id="projectBatchSubmit" value='hinzufügen' />
                    </td>
                </tr>
            </table>
        </div>
        % end
    </div>
</div>
