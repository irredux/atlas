import { Oculus } from "/file/js/oculus.js";
import { ContextMenu } from "/file/js/contextmenu.js";
import { html } from "/file/js/elements.js";
export { Library, OperaMaiora, OperaMinora };

class Library extends Oculus{
    constructor(res, resId=null, access=[], main=false){
        super(res, resId, access, main);
    }
    async load(query="*"){
        let results = await arachne.edition.search(query, "*", null, false);
        this.ctn.innerHTML = "";
        let mainBody = document.createDocumentFragment();

        // set search bar
        let searchBar = document.createElement("DIV");
        let sbInputBox = document.createElement("DIV");
        sbInputBox.id = "inputBox";
        searchBar.id = "searchBar"; searchBar.classList.add("card");
        let sbInput = document.createElement("INPUT");
        sbInput.type = "text";
        (query === "*") ? sbInput.value = "" : sbInput.value = query;
        sbInput.id = "searchBarQuery";
        sbInput.spellcheck = "false"; sbInput.autocomplete = "off";
        sbInput.autocorrect = "off"; sbInput.autocapitalize = "off";
        sbInput.onkeyup = () => {
            if(event.keyCode == 13){
                let query = sbInput.value;
                (query === "") ? query = "*" : query = query;
                this.load(query);
            }
        }

        sbInputBox.appendChild(sbInput);
        searchBar.appendChild(sbInputBox);
        let sbButton = el.button("suchen");
        sbButton.style.position = "absolute";
        sbButton.onclick = () => {
            let query = sbInput.value;
            (query === "") ? query = "*" : query = query;
            this.load(query);
        }
        searchBar.appendChild(sbButton);
        let sbHelp = document.createElement("DIV");
        sbHelp.classList.add("popOver");
        sbHelp.innerHTML = "<a>Hilfe</a>";
        let sbHelpContent = document.createElement("DIV");
        sbHelpContent.classList.add("popOverContent");
        sbHelpContent.style.textAlign = "left";
        sbHelpContent.textContent = "bla!";
        sbHelp.appendChild(sbHelpContent);
        searchBar.appendChild(sbHelp);
        mainBody.appendChild(searchBar);

        // result box
        let resultBox = document.createElement("DIV");
        if(results.length===0){
            resultBox.classList.add("msgLabel");
            resultBox.textContent = "Keine Ergebnisse gefunden.";
        } else {
            let resultTxt = document.createElement("DIV");
            resultTxt.classList.add("minorTxt");
            resultTxt.textContent = (results.length === 1)
                ? "1 Resultat."
                : `${results.length} Resultate.`;
            resultTxt.style.paddingLeft = "20px";
            resultBox.appendChild(resultTxt);

            let resultTable = document.createElement("DIV");
            resultTable.classList.add("card");
            let editionTbl = document.createElement("TABLE");
            editionTbl.innerHTML = `
                <th width="10%">Typ</th>
                <th width="20%">Edition</th>
                <th width="15%">Kurzform</th>
                <th width="10%">Kommentar</th>
                <th width="15%">ursp. Dateiname</th>
                <th width="20%">verkn. Werk</th>
                <th width="10%">Link</th>
            `;
            resultTable.appendChild(editionTbl);
            resultBox.appendChild(resultTable);
            this.setLoadMore(editionTbl, results)

            this.setSelection("main", "div.zettel", true);

            // contextmenu
            if(argos.access.includes("e_edit")){
                let cContext = new ContextMenu();
                cContext.addEntry('tr.edition', 'a', 'Edition bearbeiten', function(){argos.loadEye("library_edit", me.selMarker["main"]["lastRow"])});
                cContext.addEntry('tr.edition', 'a', 'Edition erstellen', function(){argos.loadEye("library_add")});
                cContext.addEntry('tr.edition', 'hr', '', null);
                cContext.addEntry('tr.edition', 'a', 'Opera-Listen aktualisieren', function(){argos.loadEye("library_update")});
                this.setContext = cContext.menu;
            }
        }
        mainBody.appendChild(resultBox);
        this.ctn.appendChild(mainBody);
    }
    contentLoadMore(values){
        let tr = document.createElement("TR");
        tr.id = values.id; tr.classList.add("loadMore", "edition");
        const tdContents = [(values.url)?"Link":"Scan", values.edition_name, 
            values.editor + " " +values.year, values.comment, values.dir_name, 
            values.opus, "Link"];
        for(const tdContent of tdContents){
            let td = document.createElement("TD");
            td.innerHTML = html(tdContent);
            tr.appendChild(td);
        }
        return tr;
    }
        /*
    <tr id='{{edition["id"]}}' class='edition loadMore'>
        <td width="10%" class="minorTxt">
            % if edition.get("url", "") == "": Scan:
            % else: Link:
            % end
            % if edition.get("ressource") == 0: Edition
            % elif edition.get("ressource") == 1: Edition (veraltet)
            % elif edition.get("ressource") == 2: Handschrift
            % elif edition.get("ressource") == 3: Alter Druck
            % elif edition.get("ressource") == 3: Sonstiges
            % end
        </td>
        <td width="10%">{{!edition.get("comment", "")}}</td>
        <td width="15%" style='color: gray;'>{{!edition.get("dir_name", "")}}</td>
        <td width="20%">{{!edition.get("opus", "")}}</td>
        <td width="10%">
            % if edition.get("url", "") != "":
            <a href='{{edition["url"]}}' target='_blank'>externer Link</a>
            % elif edition.get("scan_count", 0) > 0:
            <a href='/library_viewer?edition={{edition["id"]}}' target='_blank'>Digitalisat</a>
            % end
        </td>
    </tr>
 */
} 
/* 
        }, "library_edit": function(me){
            // set autocomplete
            me.bindAutoComplete(me.ctn.querySelector("#workInsert"), "work_data");

            // open IMG selector
            me.ctn.querySelector("a#openIMGSelector").addEventListener("click", function(e){argos.load("library_selector", null, {"path": me.ctn.querySelector("input[name=path]").value})});

            // set fields vor link and scan
            if(me.ctn.querySelector("select#selectType").value == "Scan"){
                me.ctn.querySelectorAll("div#trLink").forEach(function(e){e.style.display = "none"});
                me.ctn.querySelectorAll("div#trScan").forEach(function(e){e.style.display = "block"});
            } else {
                me.ctn.querySelectorAll("div#trLink").forEach(function(e){e.style.display = "block"});
                me.ctn.querySelectorAll("div#trScan").forEach(function(e){e.style.display = "none"});
            }
            me.ctn.querySelector("select#selectType").addEventListener("change", function(){
                if(me.ctn.querySelector("select#selectType").value == "Scan"){
                    me.ctn.querySelectorAll("div#trLink").forEach(function(e){e.style.display = "none"});
                    me.ctn.querySelectorAll("div#trScan").forEach(function(e){e.style.display = "block"});
                } else {
                    me.ctn.querySelectorAll("div#trLink").forEach(function(e){e.style.display = "block"});
                    me.ctn.querySelectorAll("div#trScan").forEach(function(e){e.style.display = "none"});
                }
            });

            // save values
            me.ctn.querySelector('input#submitLibrary').addEventListener('click', function(){me.updateData()});
        }, "library_add": function(me){
            // set autocomplete
            me.bindAutoComplete(me.ctn.querySelector("#workInsert"), "work_data");

            // set fields vor link and scan
            if(me.ctn.querySelector("select#selectType").value == "Scan"){
                me.ctn.querySelectorAll("div#trLink").forEach(function(e){e.style.display = "none"});
                me.ctn.querySelectorAll("div#trScan").forEach(function(e){e.style.display = "block"});
            } else {
                me.ctn.querySelectorAll("div#trLink").forEach(function(e){e.style.display = "block"});
                me.ctn.querySelectorAll("div#trScan").forEach(function(e){e.style.display = "none"});
            }
            me.ctn.querySelector("select#selectType").addEventListener("change", function(){
                if(me.ctn.querySelector("select#selectType").value == "Scan"){
                    me.ctn.querySelectorAll("div#trLink").forEach(function(e){e.style.display = "none"});
                    me.ctn.querySelectorAll("div#trScan").forEach(function(e){e.style.display = "block"});
                } else {
                    me.ctn.querySelectorAll("div#trLink").forEach(function(e){e.style.display = "block"});
                    me.ctn.querySelectorAll("div#trScan").forEach(function(e){e.style.display = "none"});
                }
            });

            // save values
            me.ctn.querySelector('input#submitLibrary').addEventListener('click', function(){me.createData()});
        % end
        }, "library_selector": function(me){
            if(me.ctn.querySelector("input#editionIdList").value != "[]"){ 
                var cEditionId = argos.o["library"].o["library_edit"].resId;
                //me.ctn.querySelector("input[name=resId]").value=cEditionId;
                me.setSelection("main", "div.imgSelectPage", true);
                me.ctn.querySelectorAll("div.imgSelectPage").forEach(function(e){
                    var cItemList = JSON.parse(e.dataset.idlist);
                    for(var item of cItemList){
                        if(cEditionId == item.edition_id){
                            me.selMarker["main"]["lastRow"] = e.id;
                            me.selMarker["main"]["ids"].push(e.id);
                            e.classList.add("selMarked");
                            e.dataset.scan_lnk_id = item.scan_lnk_id;
                        }
                    }
                });
                // set resultBrowser
                me.resultIds = JSON.parse(me.ctn.querySelector("input#editionIdList").value);
                me.setResultBrowser(me.resultIds[0], function(){
                    me.setResultBrowser(event.target.id);
                    me.ctn.querySelector("img.previewImg").src = "/library_edition/"+event.target.id;
                });
                me.ctn.querySelector("img.previewImg").src = "/library_edition/"+me.resultIds[0];
                me.ctn.querySelectorAll("div.imgSelectPage").forEach(function(e){
                    e.addEventListener("click", function(){
                    me.refreshResultBrowser(e.id);
                    me.ctn.querySelector("img.previewImg").src = "/library_edition/"+e.id;
                    });
                });
                // send values to server
                me.ctn.querySelector("input#submitSelection").addEventListener("click", function(){
                    var deleteList = [];
                    var addList = [];
                    me.ctn.querySelectorAll("div.imgSelectPage").forEach(function(e){
                        if(e.classList.contains("selMarked") && e.dataset.scan_lnk_id == null){
                            addList.push({"data":{"edition_id": cEditionId, "scan_id": e.id}});
                        } else if(!e.classList.contains("selMarked") && e.dataset.scan_lnk_id != null){
                            deleteList.push({"res_id": e.dataset.scan_lnk_id});
                        }
                    });
                    if(addList.length > 0){me._post("/batch", {"res": "scan_lnk", "mode": "create", "items": addList}, function(){me.close()})}
                    if(deleteList.length > 0){me._post("/batch", {"res": "scan_lnk", "mode": "delete", "items": deleteList}, function(){me.close()})}
                });
            } else {
                me.ctn.textContent="";
                let closeElement = document.createElement("DIV");
                closeElement.classList.add("closeLabel");
                closeElement.textContent = "X";
                me.ctn.appendChild(closeElement);
                let textElement = document.createElement("P");
                textElement.textContent = "Keine Scans verfügbar in diesem Verzeichnis.";
                me.ctn.appendChild(textElement);
            }
        }, "library_update": function(me){
            me.ctn.querySelector("input#updateLibrary").addEventListener("click", function(){me.updateData();});
 */

class OperaMaiora extends Oculus{
    constructor(res, resId=null, access=[], main=false){
        super(res, resId, access, main);
    }
    async load(){
        let mainBody = document.createDocumentFragment();
        let operaBox = document.createElement("DIV");
        operaBox.classList.add("operaBox");
        mainBody.appendChild(operaBox);

        let ctl = document.createElement("DIV");
        ctl.classList.add("controller");
        let iPage = el.text("");
        iPage.style.width = "100px"; iPage.style.border = "none"; iPage.style.textAlign = "right";
        let iMax = document.createElement("SPAN");
        ctl.appendChild(iPage);
        ctl.appendChild(iMax);
        mainBody.appendChild(ctl);
        this.ctn.appendChild(mainBody);
        await fetch("/site/opera/mai", {
            headers: {"Authorization": `Bearer ${this.token}`}
        })
            .then(response => response.text())
            .then(table => {
                operaBox.innerHTML = table;
                iPage.value = "1";
                let maxSheets = document.querySelectorAll("div.operaBox div");
                iMax.innerHTML = `/${maxSheets.length}`;
                this.ctn.querySelector("div.operaBox").onscroll = () => {
                    let nearestElement = null;
                    let toFar = false; 
                    this.ctn.querySelectorAll("div.operaBox > div").forEach(function(e){
                        if (toFar == false && e.getBoundingClientRect().top <= 260){
                            nearestElement = e;
                        } else {toFar = true};
                    });
                    iPage.value = nearestElement.id.substring(6);
                }
                iPage.onchange = () => {
                    if(!isNaN(iPage.value)){
                        this.ctn.querySelector("div#opera_"+iPage.value).scrollIntoView();
                    }
                }
            })
            .catch(e => {throw e});
    }
}
/*
        }, "opera_mai": function(me){
            me.setSelection("main", "tr.opera", false);

            // contextmenu
            var cContext = new ContextMenu();
            % if "o_edit" in user["access"]:
                cContext.addEntry('tr.opera.author', 'a', 'Autor bearbeiten', function(){
                argos.load("opera_author_edit", me.ctn.querySelector("tr#"+me.selMarker["main"]["lastRow"]).dataset.author_id);
            });
                cContext.addEntry('tr.opera.work', 'a', 'Werk bearbeiten', function(){
                argos.load("opera_work_edit", me.ctn.querySelector("tr#"+me.selMarker["main"]["lastRow"]).dataset.work_id);
                });
                cContext.addEntry('tr.opera', 'hr', '', null);
                cContext.addEntry('tr.opera', 'a', 'Neuer Autor erstellen', function(){argos.load("opera_author_add")});
                cContext.addEntry('tr.opera', 'a', 'Neues Werk erstellen', function(){argos.load("opera_work_add")});
                //cContext.addEntry('tr.opera', 'a', 'Verwaiste Einträge', function(){argos.load("opera_orphan")});
                cContext.addEntry('tr.opera', 'hr', '', null);
                cContext.addEntry('*', 'a', 'Opera-Listen aktualisieren', function(){argos.load("opera_update")});
            % end
            cContext.addEntry('*', 'hr', '', null);
            cContext.addEntry('*', 'a', 'Opera-Listen exportieren', function(){argos.load("opera_export")});
            me.setContext = cContext.menu;

            // scroll
        }, "opera_min": function(me){
            me.setSelection("main", "tr.opera", false);

            // contextmenu
            var cContext = new ContextMenu();
            % if "o_edit" in user["access"]:
                cContext.addEntry('tr.opera.author', 'a', 'Autor bearbeiten', function(){
                argos.load("opera_author_edit", me.ctn.querySelector("tr#"+me.selMarker["main"]["lastRow"]).dataset.author_id);
            });
                cContext.addEntry('tr.opera.work', 'a', 'Werk bearbeiten', function(){
                argos.load("opera_work_edit", me.ctn.querySelector("tr#"+me.selMarker["main"]["lastRow"]).dataset.work_id);
                });
                cContext.addEntry('tr.opera', 'hr', '', null);
                cContext.addEntry('tr.opera', 'a', 'Neuer Autor erstellen', function(){argos.load("opera_author_add")});
                cContext.addEntry('tr.opera', 'a', 'Neues Werk erstellen', function(){argos.load("opera_work_add")});
                //cContext.addEntry('tr.opera', 'a', 'Verwaiste Einträge', function(){argos.load("opera_orphan")});
                cContext.addEntry('tr.opera', 'hr', '', null);
                cContext.addEntry('*', 'a', 'Opera-Listen aktualisieren', function(){argos.load("opera_update")});
            % end
            cContext.addEntry('*', 'hr', '', null);
            cContext.addEntry('*', 'a', 'Opera-Listen exportieren', function(){argos.load("opera_export")});
            me.setContext = cContext.menu;

            // scroll
            me.ctn.querySelector("input#current_sheet").value = "1";
            me.ctn.querySelector("span#total_sheet").textContent = me.ctn.querySelectorAll("div.operaBox > div").length;
            me.ctn.querySelector("input#current_sheet").addEventListener("change", function(){});
            me.ctn.querySelector("div.operaBox").addEventListener("scroll", function(){
                var nearestElement = null;
                var toFar = false; 
                me.ctn.querySelectorAll("div.operaBox > div").forEach(function(e){
                    if (toFar == false && e.getBoundingClientRect().top <= 260){
                        nearestElement = e;
                    } else {toFar = true};
                });
                me.ctn.querySelector("input#current_sheet").value = nearestElement.id.substring(6);
            });
            me.ctn.querySelector("input#current_sheet").addEventListener("change", function(){
                if(!isNaN(event.target.value)){
                    me.ctn.querySelector("div#opera_"+event.target.value).scrollIntoView();
                }
            });
 */

class OperaMinora extends Oculus{
    constructor(res, resId=null, access=[], main=false){
        super(res, resId, access, main);
    }
    async load(query="*"){
    }
}
