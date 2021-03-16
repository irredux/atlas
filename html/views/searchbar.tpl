<div class='card search_bar' style='height: 100px; right: 20px;'>
    <div style='position: absolute; left: 40px; right: 240px; top: 70px;'>
        <input type='text' id='search_field' name='query' value='{{query}}' autocomplete='off' />
    </div>
    <div style='position: absolute; width: 180px; right: 40px; top: 60px;'>
        <input type='button' name='submitQuery' style='width: 100%;' value='suchen' />
    </div>
    <div class='popOver' style='top: 30px; right: 50px; font-size: 90%; text-align: right;'>
        <a>Hilfe</a>
        <div class='popOverContent' style='text-align: left;'>
            % include('help/help_search')
        </div>
    </div>
</div>
