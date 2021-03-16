<div class="noPrint">
<div class='closeLabel'>X</div>
<h3>Zettel exportieren</h3>
<p>Es wurden {{len(items)}} Zettel vorbereiten.</p>
% if len(items) == 2000:
    <p><b>Beachten Sie:</b> es können nicht mehr als 2000 Zettel gleichzeitig exportiert werden.</p>
% end
<input style="float: right;" type='button' id="printZettel" value='Drucken' />
</div>
<div class="print">
%include("zettel/zettel_cards_export")
</div>
