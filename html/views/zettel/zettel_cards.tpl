% for zettel in items:
<div class='zettel loadMore' id='{{zettel["id"]}}' style='width: var(--zettelWidth);
% if zettel.get("img_path", False) == False:
height: var(--zettelHeight);
% end
'>
    % if zettel.get("img_path"):
        % if zettel["in_use"] == 0:
            % usage = "no_use"
        % else:
            % usage = "in_use"
        % end
        <img draggable='false' class='zettel_img {{usage}}' id='{{zettel["id"]}}_r' src='{{zettel["img_path"] + '.jpg'}}' />
        <div class='zettel_msg'>
        % if zettel.get("sibling") != None:
        <span style='color: var(--contraColor);' title='Geschwisterzettel'>&#x273F;</span>
        % end
        % if zettel.get("date_sort", 9) == 9 and zettel.get("date_own") == None:
        <span style='color: var(--errorStat);' title='Datierung erforderlich'>&#x0021;</span>
        % end
        </div>
        <div class='zettel_menu'>
            <span style='float: left;'>
                {{!zettel.get("lemma_display", "")}}
            </span>
            <span style='float: right;'>
                {{!zettel.get("opus", "")}}
            </span>
        </div>
    % else:
        % include("zettel/zettel_card_digital", zettel=zettel)
    % end
</div>
% end
