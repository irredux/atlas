% for row in items:
    <option data-value='{{row['id']}}'>{{!row.get("example")}}{{!row.get("lemma_display")}}</option>
% end
