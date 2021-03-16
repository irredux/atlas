<script>
    $(document).ready(function(){
        loadTabs();
    });
</script>

<div class='card'>
    <div class='tab_header' name='help_tbs'>
        <div class='tab' name='topics' data-status='active'>
            Hilfsthemen
        </div>
        <div class='tab' name='video'>
            Lernvideos
        </div>
    </div>
    <div class='tab_content' name='help_tbs'>
        <div class='tab_container' name='topics'>
            <h2 id='shortcuts'>Tastenkürzel</h2>
            <p>Im Lemmastrecken-Editor sind verschiedene Tastenkürzel verfügbar. Um sie
            auszuführen, muss man unter Windows Alt+Buchstaben drücken (Edge: Alt+Shift+Buchstabe),
            unter Mac Ctrl+Option+Buchstabe.</p>
            <div style='padding: 10px 50px; max-width: 600px;'>
            <table style='font-size: 90%'>
                <tr><td colspan='2'><b>Allgemein</b></td></tr>
                <tr><td>a</td><td>Artikelstruktur bearbeiten</td></tr>
                <tr><td>d</td><td>Detailansicht öffnen</td></tr>
                <tr><td>p</td><td>Projekt exportieren</td></tr>
                <tr><td>n</td><td>Neuen Zettel erstellen</td></tr>
                <tr><td>i</td><td>Auswahl in Export aufnehmen</td></tr>
            </table>
            </div>
            <div style='padding: 0 50px; max-width: 600px;'>
            <table style='font-size: 90%;'>
                <tr><td colspan='2'><b>Zettel-Vorschau</b></td></tr>
                <tr><td>e</td><td>Editionen anzeigen</td></tr>
                <tr><td>k</td><td>Kommentar anzeigen</td></tr>
                <tr><td>o</td><td>opera-Eintrag anzeigen</td></tr>
                <tr><td>z</td><td>Zettel anzeigen</td></tr>
            </table>
            </div>
            <h2 id='search'>Hilfe zur Suche</h2>
            <p>Im Suchfeld kann nach verschiedenen Wörtern gesucht 
            werden. Dabei kann man mit speziellen Zeichen die Suche 
            steuern, damit nur bestimmte Resultate angezeigt werden.
            Die Gross- und Kleinschreibung kann vernachlässigt 
            werden.</p>
            <h3>Allgemeine Suche</h3>
            <p>Man kann nach einzelnen Wörtern, oder nach mehreren 
            Wörtern, die durch ein Leerschlag getrennt werden, suchen. 
            Diese Wörter werden in allen möglichen Feldern der 
            aktuellen Tabelle gesucht.</p>
                <div style='padding: 0px 50px;'>
                <table style='width: auto;'>
                    <tr>
                        <td><b>Text im Suchfeld</b></td>
                        <td>Ekk mon.</td>
                    </tr>
                    <tr>
                        <td><b>sucht nach...</b></td>
                        <td>'ekk' + 'mon.'</td>
                    </tr>
                    <tr>
                        <td><b>...findet</b></td>
                        <td>'Ekkebertus, mon. hersfeldensis'<br />
                        'Ekkehardus I., mon. sangallensis et decanus' 
                        usw.</td>
                    </tr>
                </table>
                </div>
                <p>Wenn man aber nach dem Ausdruck einschließlich des
                Leerschlags suchen möchte, muss man die Wörter in
                doppelte Anführungszeichen setzen.</p>
                <div style='padding: 0px 50px;'>
                <table style='width: auto;'>
                    <tr>
                        <td><b>Text im Suchfeld</b></td>
                        <td>"anonymi tractatus de musica"</td>
                    <tr>
                    </tr>
                        <td><b>sucht nach...</b></td>
                        <td>'anonymi tractatus de musica'</td>
                    <tr>
                    </tr>
                        <td><b>...findet</b></td>
                        <td>'anonymi tractatus de musica, ...'<br />
                        <b>aber nicht:</b> 'anonymi primi et secundi 
                        tractatus de musica ...'</td>
                    </tr>
                </table>
                </div>
                <p>Wenn man neben dem Suchbegriff eine Anzahl 
                unbestimmter Zeichen haben möchte, kann man den 
                Platzhalter '*' verwenden.</p>
                <div style='padding: 0px 50px;'>
                <table style='width: auto;'>
                    <tr>
                        <td><b>Text im Suchfeld</b></td>
                        <td>Ab*</td>
                    </tr>
                    <tr>
                        <td><b>sucht nach...</b></td>
                        <td>'Ab...'<br />(... steht für eine unbestimmte 
                        Anzahl Zeichen)</td>
                    </tr>
                    <tr>
                        <td><b>...findet</b></td>
                        <td>'Abbo Flor.'<br />
                        'Absal.' usw.</td>
                    </tr>
                </table>
                </div>
                <p>Wenn man nach dem einen oder anderen Begriff suchen 
                möchte, kann man ein 'oder' dazwischen setzen:</p>
                <div style='padding: 0px 50px;'>
                <table style='width: auto;'>
                    <tr>
                        <td><b>Text im Suchfeld</b></td>
                        <td>Abbo oder Floriacensis</td>
                    </tr>
                    <tr>
                        <td><b>sucht nach...</b></td>
                        <td>'Abbo' ODER 'Floriacensis'</td>
                    </tr>
                    <tr>
                        <td><b>...findet.</b></td>
                        <td>'Abbo, mon. floriacensis'<br />
                        'Abbo, mon. s. germani in pratis'<br />
                        'Hugo, mon. floriacensis' usw.</td>
                    </tr> 
                </table>
                </div>
                <p>Um nach dem Wort 'oder' zu suchen, muss es in
                doppelte Anführungszeichen gestellt werden.</p>

                <h3>Suche in einem bestimmten Feld</h3>
                <p>Wenn man einen Suchbegriff nur in einem bestimmten
                Feld suchen möchte, kann man es mit eine Doppelpunkt 
                vom Suchbegriff trennen.</p>
                <div style='padding: 0px 50px;'>
                <table style='width: auto;'>
                    <tr>
                        <td><b>Text im Suchfeld</b></td>
                        <td>Autor:carm.</td>
                    </tr>
                    <tr>
                        <td><b>sucht nach...</b></td>
                        <td>'carm.' im Feld 'Autor'.</td>
                    </tr>
                    <tr>
                        <td><b>...findet</b></td>
                        <td>'Carmen, Carmina'<br />
                        <b>aber nicht:</b> 'Alcuin. carm.'</td>
                    </tr>
                </table>
                </div>
                <p><b>Achtung:</b> Wird auf eine solche Art in einem 
                Feld gesucht, wird der Begriff als ganzer Feldinhalt
                genommen. (d.h. 'autor:carm' gibt keine Resultate).
                Ansonsten gelten alle Regeln von oben: Doppelte 
                Anführungszeichen müssen benutzt werden, wenn man nach
                Wörtern suchen möchte, die durch Leerschläge getrennt 
                für einen oder mehrere Zeichen gesetzt werden.</p>
                <p>Eine Liste mit den jeweils verfügbaren Feldern findet 
                man, wenn man oberhalb des Suchfeldes auf 'Hilfe' 
                klickt.</p>
            % if "z_edit" in user["access"] and 1 == 0:
                <hr class='hr_tab' />
                <h2 id='zettel_edit'>Hilfe zur Aufnahme der Zettel</h2>
                <table class='alt' style='font-size:var(--minorTxtSize);'>
                    <tr>
                        <td>Buchstabe</td>
                        <td>Buchstabe, unter den das Lemma fällt</td>
                    </tr>
                    <tr>
                        <td>MLW relevant</td>
                        <td>Ob der Zettel im MLW verwendet wird. Mit [ vor Lemma markiert. 
                        Funktioniert auch mit dem Knopf 'Zettel ausschließen und weiter'.</td>
                    </tr>
                    <tr>
                        <td>zetteltyp</td>
                        <td>verzettelt: Text ausgeschrieben. Meistens braun.<br />
                            Exzerpt: Text mit Punkten abgekürzt.<br />
                            Index: Nur mit Stellenangabe, oft mit 'Index' markiert.<br />
                            Literatur: Ohne Text, dafür mit Stellenangabe aus 
                            Sekundärliteratur.</td>
                    </tr>
                    <tr>
                        <td>Lemma</td>
                        <td>'Wort' zu dem der Zettel gehört. Steht oben links. Unbedingt 
                        Kontextmenü verwenden. Wenn die Eingabe korrekt ist, wird das Wort 
                        'Lemma' grün.</td>
                    </tr>
                    <tr>
                        <td>Zitiertitel</td>
                        <td>Autor und Werk, zu dem der Zettel gehört. Unbedingt 
                        Kontextmenü verwenden. Wenn die Eingabe korrekt ist, wird das 
                        Wort 'Zitiertitel' grün.</td>
                    </tr>
                    <tr>
                        <td>Stellenangabe</td>
                        <td>Zeichen, die hinter dem Autor/Werk steht. Wie angegeben 
                        übernehmen.</td>
                    </tr>
                    <tr>
                        <td>Seitenzahl der Edition</td>
                        <td>Falls irgendwo eine Seitenzahl angegeben ist 
                        (z.B. mit 'p. ...'), diese in das Feld übernehmen. Nur die Zahl 
                        eingeben.</td>
                    </tr>
                    <tr>
                        <td>Datum (vom Werk)</td>
                        <td>Zeigt das Datum an, welches aus der Werk-Liste übernommen 
                        wurde. Funktioniert erst nach dem Speichern.</td>
                    </tr>
                    <tr>
                        <td>Eigenes Datum</td>
                        <td>Falls eine eigene Datierung nötig ist (z.B. bei CHART.), 
                        Datierung von Zettel in dieses Feld übernehmen. Möglichst nur 
                        Zahlen eingeben.</td>
                    </tr>
                    <tr>
                        <td>Text</td>
                        <td>Textfeld für die Anzeige von ausgeschriebenen Indexzetteln.</td>
                    </tr>
                </table>
            % end
        </div>
        <div class='tab_container' name='video'>
            <h1>Lernvideos</h1>
            <p>
                <h2>Einführung</h2>
                <div class='video_container'>
                <video controls><source src='/content/videos/0_intro.mp4' type='video/mp4'></video>
                </div>
            </p>
            <p>
                <h2><i>opera</i>-Listen</h2>
                <div class='video_container'>
                <video controls><source src='/content/videos/1_opera.mp4' type='video/mp4'></video>
                </div>
            </p>
            <p>
                <h2>Zettel-Datenbank</h2>
                <div class='video_container'>
                <video controls><source src='content/videos/2_zettel.mp4' type='video/mp4'></video>
                </div>
            </p>
            <p>
                <h2>Suchfunktion</h2>
                <div class='video_container'>
                <video controls><source src='content/videos/3_search.mp4' type='video/mp4'></video>
                </div>
            </p>
            % if "z_edit" in user["access"]:
                <p>
                    <h2>Bearbeiten von Zetteln</h2>
                    <div class='video_container'>
                    <video controls><source src='content/videos/4_zettel_edit.mp4' type='video/mp4'></video>
                    </div>
                </p>
            % end
            % if "editor" in user["access"]:
                <p>
                    <h2>Lemmastrecken-Editor</h2>
                    <div class='video_container'>
                    <video controls><source src='content/videos/5_editor.mp4' type='video/mp4'></video>
                    </div>
                </p>
            % end
        </div>
    </div>
</div>
