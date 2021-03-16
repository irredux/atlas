<div class='card'>
    <div class='tab_header' name='version_tbs'>
        % if len(sub_version) > 0:
        <div class='tab' name='subVersion'>
            {{captions["version"]['subVersion']}}
        </div>
        % end
        <div class='tab' name='version'>
            {{captions["version"]['version']}}
        </div>
        % if "module" in user["access"]:
        <div class='tab' name='dMLW'>
            dMLW
        </div>
        % end
    </div>
    <div class='tab_content' name='version_tbs'>
        % if len(sub_version) > 0:
            <div class='tab_container' name='subVersion'>
                % for version in sub_version:
                <p>
                    <h3>{{version['version']}}</h3>
                    <i>{{version['date']}}</i>
                    <p>
                        {{!version['description']}}
                    </p>
                </p>
                <hr class='hr_tab' />
                % end
            </div>
        % end
        <div class='tab_container' name='version'>
            % for version in main_version:
            <p>
                <h3>{{version['version']}}</h3>
                <i>{{version['date']}}</i>
                <p>
                    {{!version['description']}}
                </p>
            </p>
            <hr class='hr_tab' />
            % end
        </div>
        % if "module" in user["access"]:
        <div class='tab_container' name='dMLW'>
            <p>
                Mit dem python Modul 'dMLW.py' kann auf die Datenbank des MLW zugegriffen werden.
                Dabei stehen alle Inhalte zur Verfügung, welche dem entsprechenden Profil zugänglich sind.
            </p>
            <p>
                Das Modul können Sie <a href='/module/dmlw.py'>hier</a> herunterladen.
            </p>
        </div>
        % end
    </div>
</div>
