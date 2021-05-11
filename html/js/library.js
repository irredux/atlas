import { Oculus } from "/file/js/oculus.js";
//import { ContextMenu } from "/file/js/contextmenu.js";
//import { html } from "/file/js/elements.js";
export { Viewer };

class Viewer extends Oculus{
    constructor(res, resId=null, access=[], main=false){
        super(res, resId, access, main);
    }
    async load(){
        let scanLinks = await arachne.scan_lnk.is(this.resId, "edition");
        console.log(scanLinks);

        let mainBody = document.createDocumentFragment();
        let imgDisplay = document.createElement("DIV");
        imgDisplay.classList.add("display_img");
        imgDisplay.id = "display_img";
        let img = document.createElement("IMG");
        imgDisplay.appendChild(img);
        fetch(`/file/scan/${scanLinks[0].scan_id}`, {headers: {"Authorization": `Bearer ${argos.token}`}})
            .then(re => re.blob())
            .then(newImg => {
                let nURL = URL.createObjectURL(newImg);
                img.src = nURL;
            })
            .catch(e => {throw e});
        mainBody.appendChild(imgDisplay);

        let menuTop = document.createElement("DIV");
        menuTop.classList.add("menu_top");
        mainBody.appendChild(menuTop);



        /*
        <div class='display_img' id="display_img">
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
                        % if "l_edit" in user["access"]:
                        <a onClick='setEditMode()' accesskey="e">&#x2619;</a>
                        % end
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
         */
        /*
% try:
% c_page = f"p. {int(scan['c_page'])}"
% except:
% c_page = scan["c_page"]
% end
        <link rel='stylesheet' type='text/css' href='/css/viewer.css'>
        <script>
            function onLoad(){
            userDisplay = JSON.parse(localStorage.getItem("userDisplay")); // global
            if(userDisplay == null){
                userDisplay = {ed_zoom: 1};
                localStorage.setItem("userDisplay", JSON.stringify(userDisplay));
            }
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
                if(sessionStorage.getItem("ViewerEditMode")=="on"){
                    setEditMode();
                }
            }
            function setZoom(){
                let img = document.querySelector("img");
                img.style.transformOrigin = "top center";
                img.style.transform = `scale(${userDisplay.ed_zoom})`;
            };
            function setEditMode(){
                sessionStorage.setItem("ViewerEditMode", "on");
                document.getElementById("display_img").style.width="50%";
                let fullText = document.createElement("DIV");
                fullText.classList.add("fullText");
                let textArea = document.createElement("TEXTAREA");
                textArea.id = "fullTextArea";
                textArea.spellcheck = false;
                textArea.textContent = `{{scan.get("full_text")}}`;
                fullText.appendChild(textArea);
                let okButton = document.createElement("INPUT");
                okButton.type = "button";
                okButton.value = "speichern";
                okButton.onclick = () => {
                    saveText();
                }
                fullText.appendChild(okButton);
                document.body.appendChild(fullText);
            }
            function saveText(){
                const newText = document.getElementById("fullTextArea").value;
                fetch("/data/scan/{{scan["c_page_id"]}}", {
                    method:"PUT",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify({"full_text": newText})
                })
                    .then(response => {
                        if(response.status = "200"){
                        let okLabel = document.createElement("DIV");
                        okLabel.id = "saveFullTxtLabel";
                        okLabel.textContent = "Text gespeichert.";
                        document.body.appendChild(okLabel);
                        setTimeout(() => {okLabel.remove()}, 2000);
                        }
                    });
            }
        </script>
    </head>
    <body onLoad="onLoad()">
    </body>
</html>
         */
        document.body.textContent = "";
        document.body.appendChild(mainBody);
    }
}

