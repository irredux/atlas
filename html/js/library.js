import { Oculus } from "/file/js/oculus.js";
//import { ContextMenu } from "/file/js/contextmenu.js";
//import { html } from "/file/js/elements.js";
export { Viewer };

class Viewer extends Oculus{
    constructor(res, resId=null, access=[], main=false){
        super(res, resId, access, main);
    }
    async load(){
        let scanLinks = await arachne.scan_lnk.is(this.resId, "edition", false);
        let edition = await arachne.edition.is(this.resId);
        let work = await arachne.work.is(edition.work_id);
        let scans = [];
        for(const scanLink of scanLinks){
            scans.push(await arachne.scan.is(scanLink.scan_id));
        }
        scanLinks = [];

        let mainBody = document.createDocumentFragment();
        let imgDisplay = document.createElement("DIV");
        imgDisplay.classList.add("display_img");
        imgDisplay.id = "display_img";
        let img = document.createElement("IMG");
        imgDisplay.appendChild(img);
        fetch(`/file/scan/${scans[0].id}`, {headers: {"Authorization": `Bearer ${arachne.key.token}`}})
            .then(re => re.blob())
            .then(newImg => {
                let nURL = URL.createObjectURL(newImg);
                img.src = nURL;
            })
            .catch(e => {throw e});
        mainBody.appendChild(imgDisplay);

        let menuTop = document.createElement("DIV");
        menuTop.classList.add("menu_top");
        let editionSpecs = `
            ${work.opus} <i class="minorTxt">(${edition.editor} ${edition.year} ${edition.volume})</i>
        `;

        let pages = {};
        let cIndex = scans[0].id;
        for(const scan of scans){
            let displayName = scan.filename;
            if(!isNaN(parseInt(scan.filename))){displayName = parseInt(scan.filename)}
            pages[scan.id] = displayName;
        }
        let pageSelect = el.select(cIndex, pages);
        pageSelect.style.width = "200px";
        pageSelect.onchange = () => {
            fetch(`/file/scan/${pageSelect.value}`, {headers: {"Authorization": `Bearer ${arachne.key.token}`}})
                .then(re => re.blob())
                .then(newImg => {
                    let nURL = URL.createObjectURL(newImg);
                    img.src = nURL;
                    if(this.editMode === true){
                        document.getElementById("fullTextArea").value = "";
                        for(const scan of scans){
                            if(pageSelect.value == scan.id){
                                document.getElementById("fullTextArea").value = scan.full_text;
                                break;
                            }
                        }
                    }
                })
                .catch(e => {throw e});
        }
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
        if(argos.access.includes("e_edit")){
            let editModeButton = el.button("Volltext bearbeiten");
            editModeButton.onclick = () => {
                this.editMode = true;
                imgDisplay.style.width="50%";
                let fullText = document.createElement("DIV");
                fullText.classList.add("fullText");
                let textArea = document.createElement("TEXTAREA");
                textArea.id = "fullTextArea";
                textArea.spellcheck = false;
                textArea.textContent = "";
                for(const scan of scans){
                    if(pageSelect.value == scan.id){
                        textArea.value = scan.full_text;
                        break;
                    }
                }
                fullText.appendChild(textArea);
                let okButton = document.createElement("INPUT");
                okButton.type = "button";
                okButton.value = "speichern";
                okButton.onclick = () => {
                    const newText = document.getElementById("fullTextArea").value;
                    arachne.scan.save({id: pageSelect.value, full_text: newText}).
                        then(response => {el.status("saved")}).
                        catch(e => {throw e});
                }
                fullText.appendChild(okButton);
                document.body.appendChild(fullText);
            }
            menuTblContent[0].push(editModeButton);
            menuTblWidths = ["25%", "25%", "25%", "25%"];
        }
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
                if(pageSelect.selectedIndex==1){menuLeft.style.display = "none"}
                pageSelect.selectedIndex = pageSelect.selectedIndex - 1;
                pageSelect.onchange();
                menuRight.style.display = "block";
            }
        }
        let menuRight = document.createElement("DIV");
        menuRight.classList.add("menu_right", "menu_side");
        menuRight.onclick = (e) => {
            e.preventDefault();
            if(pageSelect.selectedIndex < (scans.length-1)){
                if(pageSelect.selectedIndex == (scans.length-2)){menuRight.style.display = "none"}
                pageSelect.selectedIndex = pageSelect.selectedIndex + 1;
                pageSelect.onchange();
                menuLeft.style.display = "block";
            }
        }
        mainBody.appendChild(menuLeft);
        mainBody.appendChild(menuRight);
        document.body.onkeydown = (e) => {
            if (e.which == 37 && menuLeft.style.display != "none") {menuLeft.click()}
            else if (e.which == 39 && menuRight.style.display != "none") {menuRight.click()}
        }
        document.body.textContent = "";
        document.body.appendChild(mainBody);
        this.setZoom();
    }
    setZoom(){
        let img = document.querySelector("img");
        img.style.transformOrigin = "top center";
        img.style.transform = `scale(${argos.userDisplay.ed_zoom})`;
    }
}
