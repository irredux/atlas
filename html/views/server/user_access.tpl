% from datetime import timedelta, datetime
% import json
<div class='card'>
    <h2 id='user'>Kontenverwaltung</h2>
    <table style="width:100%">
        <tr>
            <th width="15%">Vorname</th>
            <th width="15%">Nachname</th>
            <th width="35%">Benutzerrechte</th>
            <th width="25%">Browser-Agent</th>
            <th width="10%">Online</th>
        </tr>
    % session_max = timedelta(minutes=30)
    % for e_user in items:
        <tr class="userAccess" id="{{e_user["id"]}}">
            <td>{{e_user.get('first_name', '')}}</td>
            <td>{{e_user.get('last_name', '')}}</td>
            <td class="minorTxt">{{", ".join(json.loads(e_user.get('access', [])))}}</td>
            <td class="minorTxt">{{e_user.get("agent", "")}}</td>
            <td style="text-align:center; font-size: 30px;">
            % if e_user.get("session_last_active", "") != "":
                % if session_max >= (datetime.now() - e_user["session_last_active"]):
                <span style="color: var(--mainColor);">&#x2600;</span>
                    <!--&#x26AB;-->
                % else:
                    <span style="color: var(--minorColor)">&#x263D;</span>
                % end
            % end
            </td>
        </tr>
    % end
    </table>
</div>


