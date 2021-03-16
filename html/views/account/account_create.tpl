<html>
    <head>
        <link rel="shortcut icon" href="#" />
        <title>{{captions["title"]}}</title>
        <style>
        % include('css/colors')

        </style>
        <link rel='stylesheet' type='text/css' href='/css/main.css'>
    </head>

    <body>
        <div id='header' style='display: block;'>
            <h1>Registrieren</h1>
            <p>Erstellen Sie ein Konto.</p>
        </div>

        <div id='login' style='display: block;'>
            <form method='post' style='padding: 0 25%;'>
                <fieldset>
                <h2>Registrieren</h2>
                Vorname: <input type='text' name='first_name' />
                Nachname: <input type='text' name='last_name' />
                E-Mail: <input type='text' name='email' />
                Passwort: <input type='password' name='password' />
                <br /><br />
                <a href="/">Zurück</a>
                <input type='submit' name='create_user' value='Senden' style='float: right;' />
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

        <div id='footer' style='display: block;'>
            <p class='minorTxt' style='float: left;'>
                <a href='mailto:alexander.haeberlin@mlw.badw.de'/>Kontakt</a>
            </p>
            <p class='minorTxt'>letzte Änderungen: {{c_date}}</p>
        </div>
    </body>
</html>
