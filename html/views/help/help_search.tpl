<h3>Hilfe zur Suche</h3>
<p>Benötigen Sie eine ausführliche Hilfe zur Suche? Dann klicken Sie
<a href='/?main=help'>hier</a>.</p>
<h4>verfügbare Felder</h4>
<table style='font-size: var(--minorTxtSize);'>
    <tr>
        <td>
            <b>Feldname</b>
        </td>
        <td>
            <b>Beschreibung</b>
        </td>
    </tr>
% for help_name, help_value in help_lst.items():
    <tr>
        <td>
            {{help_name}}
        </td>
        <td>
            {{help_value["txt"]}}
        </td>
    </tr>
% end
</table>
<i style='font-size: var(--minorTxtSize);'>Achtung: Bei den Feldnamen
auf Groß- und Kleinschreibung achten!</i>
<p class='minorTxt'>Eine Suche nach '<i>Feldname</i>:NULL' zeigt gewöhnlich alle leeren Felder.</p>
