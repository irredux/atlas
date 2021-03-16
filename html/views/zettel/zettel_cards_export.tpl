% for zettel in items:
<div class="zettel print">
    % if zettel.get("img_path", None) != None:
        <img draggable='false' src='{{zettel["img_path"] + '.jpg'}}' />
    % else:
        <div class='digitalZettelLemma'>{{!zettel.get('lemma_display', '')}}</div>
        <div class='digitalZettelDate'>{{!zettel.get('date_display', '')}}</div>
        <div class='digitalZettelWork'>{{!zettel.get('opus', '')}} {{zettel.get("stellenangabe", "")}}</div>
        <div class='digitalZettelText'>{{!zettel.get('txt', '')}}</div>
        <div class='digitalZettelAuthor'>{{zettel.get("editor", "    ")[:4]}}.</div>
</div>
    % end
</div>
% end
