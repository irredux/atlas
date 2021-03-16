% try:
% c_page = f"p. {int(scan['c_page'])}"
% except:
% c_page = scan["c_page"]
% end
<html>
    <head>
        <link rel="shortcut icon" href="#" />
        <title>{{!edition.get('opus', '').replace('<aut>', '').replace('</aut>', '').replace('<cit>', '').replace('</cit>', '')}} {{c_page}}</title>

        <style>
        % include('css/colors')
        </style>
        <link rel='stylesheet' type='text/css' href='css/main.css'>
        <link rel='stylesheet' type='text/css' href='/css/viewer.css'>
        <script>
            function onLoad(){
            userDisplay = JSON.parse(localStorage.getItem("userDisplay"));
            // set dropdown menu change
                document.querySelector("select[name=page_select]").addEventListener("change", function() {
                    window.open("/library_viewer?edition={{edition['id']}}&page="+this.value, "_self");
                });
                document.addEventListener("keydown", function(e){
                    if (e.which == 37 && document.querySelector("div.menu_left")!=null) { // arrow left
                        document.querySelector("div.menu_left").click();
                    } else if (e.which == 39 && document.querySelector("div.menu_right")!=null) { //arrow right
                        document.querySelector("div.menu_right").click();
                    };
                });

                // set zoom
                document.querySelector(".zoom").value=userDisplay.ed_zoom*100;
                document.querySelector(".zoom").addEventListener("change", function(){
                    userDisplay.ed_zoom = this.value/100;
                    localStorage.setItem("userDisplay", JSON.stringify(userDisplay));
                    setZoom();
                });
                setZoom();
            }
            function setZoom(){
                let img = document.querySelector("img");
                img.style.transformOrigin = "top center";
                img.style.transform = `scale(${userDisplay.ed_zoom})`;
            };
        </script>
    </head>
    <body onLoad="onLoad()">
        <div class='display_img'>
            <img src='/library_edition/{{scan["c_page_id"]}}' />
            <div class='footer'>
            </div>
        </div>
        <div class='menu_top'>
            <table>
                <tr>
                    <td style='width: 33%; text-align: left;'>
                        {{!edition.get("opus")}} {{c_page}}
                    </td>
                    <td style='width: 33%; text-align: center;'>
                        <select name='page_select' style='width: 130px;'>
                            % for page in pages:
                                % if scan["c_page"] == page["filename"]:
                                    <option selected>{{page["filename"]}}</option>
                                % else:
                                    <option>{{page["filename"]}}</option>
                                % end
                            % end
                        </select>
                    </td>
                    <td style='width: 33%; text-align: right;'>
                        <input type='range' min='10' max='200' value='100' class='zoom' />
                    </td>
                </tr>
            </table>
        </div>
        % if scan.get("l_page", False):
            <div class='menu_left menu_side'
                onClick="window.location.href='/library_viewer?edition={{edition["id"]}}&page={{scan["l_page"]}}';">
            </div>
        % end
        % if scan.get("n_page", False):
            <div class='menu_right menu_side'
                onClick="window.location.href='/library_viewer?edition={{edition["id"]}}&page={{scan["n_page"]}}';">
            </div>
        % end
    </body>
</html>
