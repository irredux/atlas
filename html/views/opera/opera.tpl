<div class='operaBox'>
        % if res == 'opera_mai':
            % include('opera/opera_mai_sheet')
        % else:
            % include('opera/opera_min_sheet')
        % end
        <br />
</div>

<div class='controller'>
    <input type='text' style='width: 100px; border: none; text-align: right;' id='current_sheet' value='-' />/<span id='total_sheet'>-</span>
</div>
<div class='editBox'></div>
