% import json
% e_user = items[0]
<div class='closeLabel'>X</div>
<h2>{{e_user["first_name"]}} {{e_user["last_name"]}}</h2>
<p><i>Am {{e_user.get("session_last_active", "<strong>nie</strong>")}} zuletzt online.</i></p>
<h3>User-Agent <i class="minorTxt">(letzten Login)</i>:</h3>
<p><i class="minorTxt">Achtung: Diese Informationen können vom Browser unterdrückt oder bewusst geändert werden</i></p>
<div id="userAgentTxt">{{!e_user.get("agent", "<i>Keine Angaben<i>")}}</div>
<h3>Zugriffsrechte</h3>
<div class="argSys" id="cAccess">{{e_user.get("access", "[]")}}</div>
<div id="userAccessBox">
</div>
<input style='float: right;' type='button' id='submitUserEdit' value='Änderungen speichern' />
