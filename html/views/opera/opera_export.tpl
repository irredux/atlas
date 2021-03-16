<script>
</script>
<div class="exportBox">
    <div class="closeLabel">X</div>
    <h3><i>opera</i>-Liste exportieren</h3>
    <p>
        <input id="checkDigital" type="checkbox" name="digital" value="1" checked />
        <label for="checkDigital">Digitalisate/Links exportieren.</label>
    </p>
    % if "o_view" in user["access"]:
    <p>
        <input id="checkComments" type="checkbox" name="comments" value="1" checked />
        <label for="checkComments">Kommentarespalte exportieren.</label>
    </p>
    % end
    <p><input type="button" id="preparePrint" value="Drucken" /></p>
</div>
