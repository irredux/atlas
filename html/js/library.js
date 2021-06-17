import { Oculus } from "/file/js/oculus.js";
import { ContextMenu } from "/file/js/contextmenu.js";
import { html } from "/file/js/elements.js";
export { Viewer };

class Viewer extends Oculus{
    constructor(res, resId=null, access=[], main=false){
        super(res, resId, access, main);
    }
    async load(){
        this.ctn.style.top = "0";
        let scanLinks = await arachne.scan_lnk.is(this.resId, "edition", false);
        let edition = await arachne.edition.is(this.resId);
        let work = await arachne.work.is(edition.work_id);
        let scans = [];
        for(const scanLink of scanLinks){
            scans.push(await arachne.scan.is(scanLink.scan_id));
        }
        scans.sort((a, b) => b.filename > a.filename);
        scanLinks = [];

        let mainBody = document.createDocumentFragment();
        // scan img
        let displayBox = document.createElement("DIV");
        displayBox.id = "display_box";
        mainBody.appendChild(displayBox);
        let imgDisplay = document.createElement("DIV");
        imgDisplay.classList.add("display_img");
        imgDisplay.id = "display_img";
        let img = document.createElement("IMG");
        imgDisplay.appendChild(img);
        displayBox.appendChild(imgDisplay);

        // full text display
        let ftDisplay = document.createElement("DIV");
        ftDisplay.classList.add("display_ft");
        ftDisplay.id = "display_ft";
        ftDisplay.style.display = "none";
        this.cTxtSelection = "";
        ftDisplay.onmouseup = () => {
            this.cTxtSelection = window.getSelection().toString();
        }
        displayBox.appendChild(ftDisplay);

        // full text edit
        let fullTextEdit = document.createElement("DIV");
        fullTextEdit.classList.add("fullTextEdit");
        fullTextEdit.style.display = "none";
        let textArea = document.createElement("TEXTAREA");
        textArea.id = "fullTextEditArea";
        textArea.spellcheck = false;
        textArea.textContent = "";
        let okButton = document.createElement("INPUT");
        okButton.type = "button";
        okButton.value = "speichern";
        okButton.onclick = () => {
            const newText = document.getElementById("fullTextEditArea").value;
            arachne.scan.save({id: pageSelect.value, full_text: newText}).
                then(response => {
                    full_txt[pageSelect.value] = newText;
                    el.status("saved");
                }).
                catch(e => {throw e});
        }
        fullTextEdit.appendChild(textArea);
        fullTextEdit.appendChild(okButton);
        displayBox.appendChild(fullTextEdit);

        let menuTop = document.createElement("DIV");
        menuTop.classList.add("menu_top");
        let editionSpecs = `
            ${work.opus} <i class="minorTxt">(${edition.ressource==1?"[":""}${edition.editor} ${edition.year} ${edition.volume!=null?edition.volume:""}${edition.ressource==1?"]":""}
        ${(edition.vol_cont > "")?` (${edition.vol_cont})`:""}
            )</i>
        `;
        document.title =  `${work.ac_web} - ${edition.editor} ${edition.year}  ${edition.volume!=null?edition.volume:""}`;

        let pages = {};
        let full_txt = {};
        let cIndex = scans[0].id;
        if(argos.URLSearch.scan != null){cIndex = argos.URLSearch.scan}
        for(const scan of scans){
            let displayName = scan.filename;
            if(!isNaN(parseInt(scan.filename))){displayName = parseInt(scan.filename)}
            pages[scan.id] = displayName;
            full_txt[scan.id] = scan.full_text;
        }
        let pageSelect = el.select(cIndex, pages);
        pageSelect.style.width = "200px";
        pageSelect.onchange = () => {
            fetch(`/file/scan/${pageSelect.value}`, {headers: {"Authorization": `Bearer ${arachne.key.token}`}})
                .then(re => re.blob())
                .then(newImg => {
                    let nURL = URL.createObjectURL(newImg);
                    img.src = nURL;
                    const ftHeader = `
                    <div class="minorTxt" style="text-align:center; margin-bottom: 20px;">
                    <span>${work.opus}<i>(ed. ${edition.editor} ${edition.year})</i></span>
                    <span style="float: right;">${pageSelect[pageSelect.selectedIndex].text}</span>
                    </div>
                        `;
                    if(full_txt[pageSelect.value]!=null){
                        ftDisplay.innerHTML = html(ftHeader+full_txt[pageSelect.value]);
                        textArea.value = full_txt[pageSelect.value];
                    } else {
                        ftDisplay.innerHTML = html(ftHeader+"<i>Kein Volltext verfügbar.</i>");
                        textArea.value = "";
                    }

                    if(pageSelect.selectedIndex==0){menuLeft.style.display = "none"}
                    else{menuLeft.style.display = "block"}
                    if(pageSelect.selectedIndex == (scans.length-1)){menuRight.style.display = "none"}
                    else{menuRight.style.display = "block"}
                    /*
                    if(this.editMode === true){
                        document.getElementById("fullTextArea").value = "";
                        for(const scan of scans){
                            if(pageSelect.value == scan.id){
                                document.getElementById("fullTextArea").value = scan.full_text;
                                break;
                            }
                        }
                    }
                    */
                })
                .catch(e => {throw e});
        }
        /*
        let loadId = scans[0].id;
        fetch(`/file/scan/${loadId}`, {headers: {"Authorization": `Bearer ${arachne.key.token}`}})
            .then(re => re.blob())
            .then(newImg => {
                let nURL = URL.createObjectURL(newImg);
                img.src = nURL;
            })
            .catch(e => {throw e});
        */
        let scrollBar = document.createElement("INPUT");
        scrollBar.type = "range"; scrollBar.min = "10"; scrollBar.max = "200";
        scrollBar.value = argos.userDisplay.ed_zoom*100;
        scrollBar.onchange = () => {
            argos.userDisplay.ed_zoom = scrollBar.value/100;
            argos.setUserDisplay();
            this.setZoom();
        }
        let menuTblContent = [[
            editionSpecs,
            pageSelect,
            scrollBar
        ]];
        let menuTblWidths = ["33%","33%","33%"];
        
        let menuTbl = el.table(menuTblContent, menuTblWidths);
        menuTbl.style.textAlign = "center";
        menuTop.appendChild(menuTbl);
        mainBody.appendChild(menuTop);
        
        let menuLeft = document.createElement("DIV");
        menuLeft.classList.add("menu_left", "menu_side");
        menuLeft.style.display = "none";
        menuLeft.onclick = (e) => {
            e.preventDefault();
            if(pageSelect.selectedIndex > 0){
                pageSelect.selectedIndex = pageSelect.selectedIndex - 1;
                pageSelect.onchange();
            }
        }
        let menuRight = document.createElement("DIV");
        menuRight.classList.add("menu_right", "menu_side");
        menuRight.onclick = (e) => {
            e.preventDefault();
            if(pageSelect.selectedIndex < (scans.length-1)){
                pageSelect.selectedIndex = pageSelect.selectedIndex + 1;
                pageSelect.onchange();
            }
        }
        mainBody.appendChild(menuLeft);
        mainBody.appendChild(menuRight);

        // set first page
        pageSelect.onchange();


        document.body.onkeydown = (e) => {
            if(!["TEXTAREA", "INPUT"].includes(event.target.tagName)){
                if (e.which == 37 && menuLeft.style.display != "none") {menuLeft.click()}
                else if (e.which == 39 && menuRight.style.display != "none") {menuRight.click()}
            }
        }
        //document.body.textContent = "";
        this.ctn.appendChild(mainBody);
        this.setZoom();
        // contextmenu
        let cContext = new ContextMenu();
        cContext.addEntry('*', 'span', 'Anzeige als ...', null);
        cContext.addEntry('*', 'a', '... Scans', () => {
            imgDisplay.style.display = "block";
            ftDisplay.style.display = "none";
        });
        cContext.addEntry('*', 'a', '... Volltext', () => {
            imgDisplay.style.display = "none";
            ftDisplay.style.display = "block";
            fullTextEdit.style.display = "none";
        });
        cContext.addEntry('*', 'a', '... Scans&Volltext', () => {
            imgDisplay.style.display = "block";
            ftDisplay.style.display = "block";
            fullTextEdit.style.display = "none";
        });


        cContext.addEntry('.display_ft', 'hr', '', null);
        cContext.addEntry('.display_ft', 'a', 'neuen Zettel aus Auswahl erstellen', () => {
            if(this.cTxtSelection!= ""){
                this.cEditionId = this.resId;
                this.workId = work.id;
                this.workOpus = work.ac_web;
                this.cScanId = pageSelect.value;
                argos.loadEye("zettel_add");
                //this.cTxtSelection = window.getSelection().toString();
            } else {
                alert("Bitte wählen Sie zuerst die Textstelle aus!");
            }
        });

        if(this.access.includes("l_edit")){
            cContext.addEntry('*', 'hr', '', null);
            cContext.addEntry('*', 'a', 'Edition bearbeiten', () => {
                argos.loadEye("library_edit", this.resId);
            });
            cContext.addEntry('*', 'a', 'Volltext bearbeiten', () => {
                imgDisplay.style.display = "block";
                ftDisplay.style.display = "none";
                fullTextEdit.style.display = "block";
            });
        }
        this.setContext = cContext.menu;
    }
    setZoom(){
        let img = document.querySelector("img");
        img.style.transformOrigin = "top center";
        img.style.transform = `scale(${argos.userDisplay.ed_zoom})`;
    }
}
