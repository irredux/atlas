<div class="closeLabel">X</div>
<h4>{{!items[0].get("lemma_display")}}</h4>
% for cmnt in items:
    % if cmnt.get("comment_id", 0) > 0:
        <p><form>
            <b>{{cmnt["user"]}}</b>, am {{str(cmnt["date"]).split()[0]}}:
            <br />{{!cmnt["comment"]}}
            % if user["id"] == cmnt["user_id"]:
                <i class="deleteEntry" style='cursor:pointer;'>(löschen)</i>
                <input type="hidden" name="res" value="comment" />
                <input type="hidden" name="resId" value="{{cmnt["comment_id"]}}" />
            % end
        </form></p>
    % end
% end
    <p>
        <form autocomplete="off">
            <p>Neue Notiz:</p>
            <textarea name="comment"></textarea>
            <input type="hidden" name="res" value ="comment" />
            <input type="hidden" name="lemma_id" value="{{items[0]["id"]}}" />
            <input type="hidden" name="user_id" value="{{user["id"]}}" />
            <input type="hidden" name="date" value="{{c_date}}" />
            <input type="button" class="noUpload" id="newComment" value="speichern" />
        </form>
    </p>
</div>
