% import json
% zettel = items[0]
<div class="projectMenuEntry" id='comment'>
    <div class="projectMenuButton">Kommentare</div>
    <div class="projectMenuContent">
        % if zettel.get("comments") != None:
            % cmnts = json.loads(zettel.get("comments").replace('\n', '<br />').replace('\r', '<br />'))
            % for cmnt in cmnts:
                <p><form>
                    <b>{{cmnt["user"]}}</b>, am {{str(cmnt["date"]).split()[0]}}:
                    <br />{{!cmnt["comment"]}}
                    % if user["id"] == cmnt["user_id"]:
                        <i class="deleteEntry" style='cursor:pointer;'>(löschen)</i>
                        <input type="hidden" name="res" value="comment" />
                        <input type="hidden" name="resId" value="{{cmnt["id"]}}" />
                    % end
                </form></p>
            % end
        % end
        <form autocomplete="off">
            <table>
                <tr>
                    <td>Neue Notiz:</td>
                    <td><textarea name="comment" autocomplete="off"></textarea></td>
                </tr>
                <tr>
                    <td></td>
                    <td>
                        <input type="button" class="noUpload" id="newComment" value="speichern" />
                    </td>
                </tr>
            </table>
            <input type="hidden" name="res" value ="comment" />
            <input type="hidden" name="zettel_id" value="{{zettel["id"]}}" />
            <input type="hidden" name="user_id" value="{{user["id"]}}" />
            <input type="hidden" name="date" value="{{c_date}}" />
        </form>
    </div>
</div>
% if zettel.get("work_id", 0) > 0:
<div class="projectMenuEntry" id='opera'>
    <div class="projectMenuButton">opera-Eintrag</div>
    <div class="projectMenuContent" style='left: 10px;'>
        <table>
            <tr style='vertical-align: top;'>
                <td class='c1'>{{!zettel.get('date_display', '')}}</td>
                <td class='c2'><aut>{{zettel.get('author_abbr', '')}}</aut></td>
                <td class='c3'>{{!zettel.get('author_full', '')}}</td>
                <td class='c4'></td>
                <td class='c5'></td>
            </tr>
            <tr style='vertical-align: top;'>
                <td class='c1'></td>
                <td class='c2'>&nbsp;&nbsp;&nbsp;{{zettel.get('work_abbr', '')}}</td>
                <td class='c3'>&nbsp;&nbsp;&nbsp;{{zettel.get('work_full', '')}}</td>
                <td class='c4'><i>{{zettel.get('bibliography', '')}}</i></td>
                <td class='c5'>{{!zettel.get('txt_info', '')}}</td>
            </tr>
        </table>
    </div>
</div>
% end
% if zettel.get('editions', None):
<div class="projectMenuEntry" id='edition'>
    <div class="projectMenuButton">Editionen</div>
    <div class="projectMenuContent">
        % editions = json.loads(zettel.get("editions"))
        % for edition in editions:
        <a href='{{edition.get('url', '')}}' target='_blank'>{{!edition.get('label', '')}}</a><br />
        % end
    </div>
</div>
% end

<div class="projectMenuEntry" id='zettel'>
    <div class="projectMenuButton">Zettel</div>
    <div class="projectMenuContent">
        <div style='width: var(--zettelWidth);
        % if zettel.get("img_path", False) == False:
        height: var(--zettelHeight);
        % end
        '>
            % if zettel.get("img_path"):
                <img style="width:100%" src='{{zettel["img_path"] + '.jpg'}}' />
            % else:
                % include("zettel/zettel_card_digital", zettel=zettel)
            % end
        </div>
    </div>
</div>
