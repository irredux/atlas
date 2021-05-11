% zettels = []
% project_id = 0
% articles = []
<script>
    % zIds = '';
    % for zettel in zettels:
        % zIds += f',{zettel["id"]}'
    % end
    var z_lst = JSON.parse('[{{zIds[1:]}}]');

    var project_id = '{{project_id}}';
    var default_group_id = {articles[0]['id']};


    $('document').ready(function(){
        // load articles
        let fDiv = me.ctn.querySelector('div.article_container');
        var cDiv = me.ctn.querySelector('div.article_container');
        var cAppend = '';

        % c_depth = 0
        let addText = 'hinzufügen';
        % if len(articles) == 1 and articles[0].get('position', '000') == '000' and len(zettels) == 0:
        $('div.project_detail').append('');
        $('div.project_menu_container').css('opacity', '0.3');
        $('div.projectDetailMenu').css('opacity', '0.3');
        % end








        $('div.artInsert').hover(function(){
                $(this).css('color', 'var(--contraColor)');
                $(this).css('background-color', 'var(--minorBG)');
                $(this).css('border', '1px solid var(--contraColor)');
        }, function(){
                $(this).css('color', 'var(--minorBG)');
                $(this).css('background-color', 'var(--mainBG)');
                $(this).css('border', '1px solid var(--minorBG)');
        });

        // load zettel
        var nZettel = '';
        % for zettel in zettels:
            % if zettel.get('include_export', 0) == 1:
            % zettel_exported = ' zettelExported'
            % else:
            % zettel_exported = ''
            % end
            nZettel = "<div class='detail_zettel{{zettel_exported}}' id='{{zettel['lnk_id']}}' data-zettel_id='{{zettel['id']}}'";
            nZettel += "><span>&lowast; </span><span onDblClick='changeOpus();'>{{!zettel.get('opus', '<i>Werk</i>').replace('<cit>', '').replace('</cit>', '').strip()}}</span>&semi;";
            nZettel += " <span onSubmit='changeStellenangabe(\"{{zettel['id']}}\")' class='rl_changable'>{{!zettel.get('stellenangabe', '<i>Stelle</i>')}}</span>";
            nZettel += " &ldquo;<span onSubmit='changeZLnkName(\"{{zettel['lnk_id']}}\")'class='rl_changable'>";
            nZettel += "{{!zettel.get('display_text', '...')}}</span>&rdquo;</div>";
            $('div.detail_article#da_{{zettel['article_id']}}').append(nZettel);
        % end


        // set offset
        $('div.mainContent').scrollTop(sessionStorage.getItem('project_'+project_id));
    });
</script>
<script src='/js/project.js'></script>
