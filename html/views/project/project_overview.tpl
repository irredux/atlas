<div style='padding: 0 25% 0 25%;'>
    <h2 style='padding: 20px 20px;'>Lemmastrecken-Editor</h2>
    <div class='tab_header' name='project_overview' style='padding: 0px 20px;'>
        <div class='tab' name='p_active' data-status='active'>aktive Projekte</div>
        <div class='tab' name='p_archive'>Archiv</div>
        <div class='tab' name='p_trash'>Papierkorb</div>
    </div>
    <div class='tab_content' name='project_overview' style='margin: 0px 20px 20px 20px; background: var(--mainBG); min-height:200px;'>
        <div class='tab_container' name='p_active' style="position: absolute; top: 0; bottom: 0; left: 0; right: 0;">
            <div id='p_active'>
                % for edition in items:
                    % if edition["status"] == 1 and edition["user_id"] == user["id"]:
                    <div class="projectItems projectActive" id="{{edition["id"]}}">{{edition["name"]}}</div>
                    % end
                % end
            </div>
        </div>
        <div class='tab_container' name='p_archive' style="min-height:200px;">
            <div id='p_archive'>
                % for edition in items:
                    % if edition["status"] == 2 and edition["user_id"] == user["id"]:
                    <div class="projectItems projectArchive" id="{{edition["id"]}}">{{edition["name"]}}</div>
                    % end
                % end
            </div>
        </div>
        <div class='tab_container' name='p_trash' style="min-height:200px;">
            <div id='p_trash'>
                % for edition in items:
                    % if edition["status"] == 3 and edition["user_id"] == user["id"]:
                    <div class="projectItems projectTrash" id="{{edition["id"]}}">{{edition.get("name")}}</div>
                    % end
                % end
            </div>
        </div>
    </div>
</div>
