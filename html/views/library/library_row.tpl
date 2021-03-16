<table>
% for edition in items:
    <tr id='{{edition["id"]}}' class='edition loadMore'>
        <td width="10%" class="minorTxt">
            % if edition.get("url", "") == "":
                Scan:
            % else:
                Link:
            % end
            % if edition.get("ressource") == 0:
            Edition
            % elif edition.get("ressource") == 1:
            Edition (veraltet)
            % elif edition.get("ressource") == 2:
            Handschrift
            % elif edition.get("ressource") == 3:
            Alter Druck
            % elif edition.get("ressource") == 3:
            Sonstiges
            % end
        </td>
        <td width="20%" style='font-size: 80%'>{{!edition.get("edition_name", "")}}</td>
        <td width="15%">
        {{!edition.get("editor", "")}} {{!edition.get("year", "")}}
        % if edition.get("volume", "") != "":
        ({{edition["volume"]}})
        % end
        </td>
        <td width="10%">{{!edition.get("comment", "")}}</td>
        <td width="15%" style='color: gray;'>{{!edition.get("dir_name", "")}}</td>
        <td width="20%">{{!edition.get("opus", "")}}</td>
        <td width="10%">
            % if edition.get("url", "") != "":
            <a href='{{edition["url"]}}' target='_blank'>externer Link</a>
            % elif edition.get("scan_count", 0) > 0:
            <a href='/library_viewer?edition={{edition["id"]}}' target='_blank'>Digitalisat</a>
            % end
        </td>
    </tr>
% end
</table>
