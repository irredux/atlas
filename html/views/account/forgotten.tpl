<html>
    <head>
        <title>dMLW</title>
        <link rel='stylesheet' type='text/css' href='/css/main.css'>
    </head>

    <body>
        <div class='header'>
            <h1>Passwort zurücksetzen</h1>
            <p>Haben Sie Ihr Passwort vergessen?</p>
        </div>

        <div class='card'>
            <form method='post' style='padding: 0 25%;'>
                <fieldset>
                <h2>Angaben zum Benutzerkonto</h2>
                <p>Füllen Sie das folgende Formular aus und Sie erhalten einen Anleitung zum Zurücksetzen per Email.</p>
                Vorname: <input type='text' name='first_name' />
                Nachname: <input type='text' name='last_name' />
                E-Mail: <input type='text' name='email' />
                <br /><br />
                <a href="/">Zurück</a>
                <input type='submit' name='submit_forgotten' value='Senden' style='float: right;' />
                </fieldset>
            </form>
        </div>
        % if len(r_lst) > 0:
        <div class='card'>
            % for r in r_lst:
            <p>{{r}}</p>
            % end
        </div>
        % end

        <div class='footer'>
            <p class='minorTxt' style='float: left;'>
                <a href='mailto:alexander.haeberlin@mlw.badw.de'/>Kontakt</a>
            </p>
            <p class='minorTxt'>letzte Änderungen: 23. Oktober 2020</p>
        </div>
    </body>
</html>
