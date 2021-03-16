% import json
<div class='rPart'>
    <h3>Scanseiten auswählen</h3>
    <div class='imgOverview'>
    % editionIdList = []
    % for item in items:
        % editionIdList.append(item["id"])
        % itemIdList = []
        % if item.get("editions", None) != None:
            % editions = json.loads(item["editions"])
            % for edition in editions:
                % itemIdList.append({"edition_id": edition["id"], "scan_lnk_id": edition["scan_lnk_id"]})
            % end
        % end
        <div class="imgSelectPage" id="{{item["id"]}}" data-idlist="{{json.dumps(itemIdList)}}">
            {{item["filename"]}}
            % if len(itemIdList) == 1:
            <i class="minorTxt">in 1 Edition.</i>
            % elif len(itemIdList) > 1:
            <i class="minorTxt">in {{len(itemIdList)}} Editionen.</i>
            % end
        </div>
    % end
    </div>
    <input type="hidden" id="editionIdList" value="{{json.dumps(editionIdList)}}" />
    <input type='button' id="submitSelection" class="noUpload" value='Auswahl speichern' />
</div>
<div class='lPart'>
    <img class='previewImg' />
</div>
<div class='lPartBottom'>
    <table class='minorTxt'>
        <tr style='text-align:center;'>
            <td width='33%'>
                <a class="resultBrowser" data-target='first' title='erster Treffer'>|&lt;</a>
                &nbsp;&nbsp;
                <a class="resultBrowser" data-target="-100" title='-100'>&lt;&lt;&lt;</a>
                &nbsp;&nbsp;
                <a class="resultBrowser" data-target="-10" title='-10'>&lt;&lt;</a>
                &nbsp;&nbsp;
                <a class="resultBrowser" data-target="-1" title='-1'>&lt;</a>
            </td>
            <td width='33%'>
                <span id='resultBrowserCurrent'></span> von <span id='resultBrowserTotal'></span>
            </td>
            <td width='34%'>
                <a class="resultBrowser" data-target="1" title='+1'>&gt;</a>
                &nbsp;&nbsp;
                <a class="resultBrowser" data-target="10" title='+10'>&gt;&gt;</a>
                &nbsp;&nbsp;
                <a class="resultBrowser" data-target="100" title='+100'>&gt;&gt;&gt;</a>
                &nbsp;&nbsp;
                <a class="resultBrowser" data-target='last' title='letzter Treffer'>&gt;|</a>
            </td>
        </tr>
    </table>
</div>
<div class='closeLabel'>X</div>
