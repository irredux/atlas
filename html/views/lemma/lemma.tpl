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
<div id='lemma_loadmore' style='display:none;'></div>
% else:
<div class='card'> 
    <div id='lemma_loadmore'>
        <table>
            <tr>
                <th style='width: 20%'>Lemmaansatz</th>
                <th style='width: 20%'>Wörterbücher</th>
                <th style='width: 40%'>Kommentar</th>
                <th style='width: 10%'>Notizen</th>
                <th style='width: 10%'>Anz. Zettel</th>
            </tr>
        </table>
    </div>
</div>
% end
