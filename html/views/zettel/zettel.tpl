% import json
<div class="argSys" id="resultIds">{{json.dumps([item["id"] for item in items])}}</div>
% include('searchbar', query=query, location='zettel')
<div class='result_box minorTxt' style='padding-left: 20px;'>
    % if len(items) == 10001:
        +10'000 Resultate.
    % elif len(items) == 1:
        1 Resultat.
    % else:
        {{len(items)}} Resultate.
    % end
</div> 
% if len(items) == 0:
<div class='msgLabel'><p>Keine Ergebnisse für '{{query}}' gefunden.</p></div>
<div id='zettel_loadmore' class="argSys"></div>
% else:
<div class='zettel_box' id='zettel_loadmore'></div>
