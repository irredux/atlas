<!DOCTYPE html>
<html>
    <head>
        <link rel="shortcut icon" href="#" />
        <title>{{captions["title"]}}</title>
        <style>
        % include("css/colors")
        </style>
        <link rel="stylesheet" type="text/css" href="/css/main.css">
        <link rel="stylesheet" type="text/css" href="/css/print.css">
        % if user != None:
            <script src="/js/purify.min.js"></script>
            <script>
                % include("js/loader")
            </script>
            % if "editor" in user["access"]:
            <script src="/js/project.js"></script>
            % end
            <script type="module">
                import { Argos } from "./js/argos.js";
                globalThis.argos = new Argos({{!user["access"]}});
                let header = document.getElementById("header");
                let login = document.getElementById("login");
                let footer = document.getElementById("footer");
                if (argos.getQuery("animate") == "true"){
                    header.style.display = "block";
                    login.style.display = "block";
                    footer.style.display = "block";

                    argos.setQuery("animate", "");
                    header.style.overflow = "hidden";
                    header.animate({height: "42px", top: "0"}, 900);
                    login.animate({opacity: "0%"}, 900);
                    footer.animate({opacity: "0%"}, 900);
                    setTimeout(function(){
                        header.remove();
                        login.remove();
                        footer.remove();
                        document.getElementById("headerMenu").style.display = "flex";
                    }, 900);
                } else {
                    header.remove();
                    login.remove();
                    footer.remove();
                    document.getElementById("headerMenu").style.display = "flex";
                }
            </script>
        % end
    </head>
    <body>
        % if user != None:
            <div id="headerMenu">
                % user["access"].append("*")
                % for name, content in main_menu.items():
                    % if content["access"] in user["access"]:
                    <div class="mainMenuEntry">
                        <div class="mainMenuButton">{{!name}}</div>
                        <div class="mainMenuContent">
                            % for item in content["items"]:
                                % if item.get("access", "*") in user["access"]:
                                    <div><a 
                                    onClick="{{item["onClick"]}}"
                                    % if item.get("id", False):
                                        id = "{{item["id"]}}"
                                    % end
                                    >{{!item["caption"]}}</a></div>
                                % end
                            % end
                        </div>
                    </div>
                    % end
                % end
            </div>
        % end



        <div id="header"
        % if user == None:
            style="display: block;"
        % end
        >
            <h1>{{captions["title"]}}</h1>
            <p>{{captions["description"]}}</p>
        </div>

        <div id="login"
        % if user == None:
            style="display: block;"
        % end
        >
            <form method="post" style="padding: 0 25%;">
                <fieldset>
                <h2>Login</h2>
                E-Mail: <input type="text" name="email" />
                Passwort:<input type="password" name="password" />
                <br /><br />
                <p class="minorTxt">
                    Noch kein Benutzerkonto? <a href="/account_create">hier klicken</a><!--<br />
                    Passwort vergessen? <a href="/account_forgotten">hier klicken</a>-->
                </p>
                <input type="submit" name="login" value="Login" style="float: right;" />
                </fieldset>
            </form>
        </div>
        <div id="footer"
        % if user == None:
            style="display: block;"
        % end
        >
            <p class="minorTxt" style="float: left;">
                <a href="mailto:alexander.haeberlin@mlw.badw.de"/>Kontakt</a>
            </p>
            <p class="minorTxt">letzte Änderungen: {{c_date}}</p>
        </div>
    </body>
</html>
% end
