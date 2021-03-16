<table>
% for lemma in items:
    <tr class='loadMore' id='{{lemma['id']}}'>
        <td style='width: 20%'>
            <a onClick='location.href="/?mainContent=%2Fzettel&query=Lemma:{{lemma["lemma"]}}"'>
                {{!lemma.get("lemma_display")}}
            </a>
        </td>
        <td style='width:20%'>{{!lemma.get("dicts", "")}}</td>
        <td style='width:40%'>{{!lemma.get("comment", "")}}</td>
        <td style='width:10%; font-size:120%;'>
            % if lemma.get("comments_count", 0) > 0:
                <a class='openComment' id='{{lemma["id"]}}'>☜</a>
            % end
        </td>
        <td style='width:10%; text-align:right;'>{{lemma.get("zettel_count")}}</td>
    </tr>
% end
</table>

