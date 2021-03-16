% include('searchbar', query=query, location='lemma')
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
<div id='library_loadmore' style='display:none;'></div>
% else:
<div class='card'>
    <div id='library_loadmore'>
        <table>
            <tr>
                <th width="10%">Typ</th>
                <th width="20%">Edition</th>
                <th width="15%">Kurzform</th>
                <th width="10%">Kommentar</th>
                <th width="15%">ursp. Dateiname</th>
                <th width="20%">verkn. Werk</th>
                <th width="10%">Link</th>
            </tr>
        </table>
    </div>
</div>
