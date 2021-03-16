<div class='card'>
    <h2 id='database'>Datenbank einrichten</h2>
    <form method='post' enctype='multipart/form-data'>
    Tabelle: <select name='type'>
                <option value='maiora'><i>opera maiora</i>-Liste</option>
                <option value='minora'><i>opera minora</i>-Liste</option>
                <option value='lemma'>Lemma-Liste</option>
                <option value='user'>Benutzer</option>
                <option value='zettel'>Zettel</option>
                <option value='edition'>Edition</option>
                <option value='scans'>Scans</option>
                <option value='dMGH'>dMGH</option>
             </select>
    Datei: <input type='file' name='i_file' /><br />
    <p style='font-size: var(--minorTxtSize);'>Bitte beachten:
    Die Datei muss eine .csv-Datei sein mit UTF-8 Kodierung. Der
    Dateiname spielt keine Rolle.</p>
    Buchstabe (bei Lemma-Liste): <input type='text' name='lemma' /><br />
    <input type='checkbox' name='reset_tbl' value='reset' /> Tabelle zurücksetzen
    <input type='submit' name='setup_db' value='hochladen und installieren' />
    </form>
</div>
