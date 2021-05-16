import { Oculus } from "/file/js/oculus.js";
import { ContextMenu } from "/file/js/contextmenu.js";
import { html } from "/file/js/elements.js";
export {
    Library, LibraryEdit, LibrarySelector, LibraryUpdate,
    Opera, OperaExport, OperaUpdate,
    AuthorEdit, WorkEdit
};

class Library extends Oculus{
    constructor(res, resId=null, access=[], main=false){
        super(res, resId, access, main);
    }
    async load(query="*"){
        const searchFields = {
            work_id: {name: "Werk-ID", des: "Durchsucht die verknüpften Werke."},
            id: {name: "ID", des: "Durchsucht die IDs"}
        };
        const displayQuery = query;
        for(const field in searchFields){
            const reg = new RegExp(searchFields[field].name, "g");
            query = query.replace(reg, field);
        }
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
                (query === "") ? query = "*" : query = displayQuery;
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
        let helpContent = `
            <h3>Hilfe zur Suche</h3>
            <p>Benötigen Sie eine ausführliche Hilfe zur Suche? Dann klicken Sie
            <a href='https://gitlab.lrz.de/haeberlin/dmlw/-/wikis/00-Start'>hier</a>.</p>
            <h4>verfügbare Felder</h4>
            <table style='font-size: var(--minorTxtSize);'>
                <tr><td><b>Feldname</b></td><td><b>Beschreibung</b></td></tr>
            `;
        for(const field in searchFields){
        helpContent += `
        <tr><td>${searchFields[field].name}</td><td>${searchFields[field].des}</td></tr>
            `;
        }
       helpContent += `
            </table>
            <i style='font-size: var(--minorTxtSize);'>Achtung: Bei den Feldnamen
            auf Groß- und Kleinschreibung achten!</i>
            <p class='minorTxt'>Eine Suche nach '<i>Feldname</i>:NULL' zeigt gewöhnlich alle leeren Felder.</p>
        `;
        searchBar.appendChild(el.pop("Hilfe", helpContent));
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

            this.setSelection("main", "tr.loadMore", true);

            // contextmenu
            if(argos.access.includes("e_edit")){
                let cContext = new ContextMenu();
                cContext.addEntry('tr.edition', 'a', 'Edition bearbeiten', () => {
                    argos.loadEye("library_edit", this.selMarker.main.lastRow)
                });
                cContext.addEntry('tr.edition', 'a', 'Edition erstellen', () => {argos.loadEye("library_edit")});
                cContext.addEntry('tr.edition', 'hr', '', null);
                cContext.addEntry('tr.edition', 'a', 'Opera-Listen aktualisieren', () => {argos.loadEye("library_update")});
                this.setContext = cContext.menu;
            }
        }
        mainBody.appendChild(resultBox);
        this.ctn.appendChild(mainBody);
    }
    async contentLoadMore(values){
        let tr = document.createElement("TR");
        tr.id = values.id; tr.classList.add("loadMore", "edition");
        let tdContents = [(values.url)?"Link":"Scan", values.edition_name, 
            values.editor + " " +values.year, values.comment, values.dir_name];
        const work = await arachne.work.is(values.id);
        if(work.id != null){tdContents.push(work.opus)}
        else{tdContents.push("")}
        if(values.url!=null && values.url != ""){
            tdContents.push(`<a target='_blank' href='${values.url}'>Link</a>`); 
        } else {
            tdContents.push(`<a target='_blank' href='/site/viewer/${values.id}'>Digitalisat</a>`); 
        }
        console.log(values);
        for(const tdContent of tdContents){
            let td = document.createElement("TD");
            td.innerHTML = html(tdContent);
            tr.appendChild(td);
        }
        return tr;
    }
} 

class LibraryEdit extends Oculus{
    constructor(res, resId=null, access=[], main=false){
        super(res, resId, access, main);
    }
    async load(){
        let mainBody = document.createDocumentFragment();
        let edition = {};
        if(this.resId > 0){
            edition = await arachne.edition.is(this.resId);
            mainBody.appendChild(el.h(`${edition.opus} <i class="minorTxt">(ID: ${edition.id})</i>`, 3));
        } else {
            mainBody.appendChild(el.h("Neue Edition erstellen", 3));
        }
        let iWork = el.text(edition.example);
        iWork.dataset.selected = edition.work_id;
        this.bindAutoComplete(iWork, "work", ["id", "example"]);
        let iEditionName = el.area(edition.edition_name);
        let iEditor = el.text(edition.editor);
        let iYear = el.text(edition.year);
        let iVolume = el.text(edition.volume);
        let iComment = el.area(edition.comment);
        let resTypes = {
            0: "textkritische Edition",
            1: "textkritische Edition (veraltet)",
            2: "Handschrift",
            3: "Alter Druck",
            4: "Sonstiges"
        };
        let iRessource = el.select(edition.ressource, resTypes);
        const edTypes = {
            0: "Scan",
            1: "Link"
        };
        let edTypeSelect = 0;
        if(edition.url != null && edition.url != ""){
            edTypeSelect = 1;
        }
        let iType = el.select(edTypeSelect, edTypes);
        iType.onchange = () => {
            if(iType.value == 1){scanDIV.style.display = "none"; linkDIV.style.display = "block";}
            else{linkDIV.style.display = "none"; scanDIV.style.display = "block"}
        }
        // 20-80
        let tbl1 = [
            ["Verknüpftes Werk:", iWork],
            ["", `<span class="minorTxt">${edition.bibliography}</span>`],
            ["", `<a class="minorTxt" href="/site/viewer/${edition.id}" target="_blank">Digitalisat öffnen</a>`],
            ["Edition:", iEditionName],
            ["Editor:", iEditor],
            ["Jahr:", iYear],
            ["Band:", iVolume],
            ["Kommentar:", iComment],
            ["Ressource:", iRessource],
            ["Typ:", iType]
        ];
        mainBody.appendChild(el.table(tbl1));

        let linkDIV = document.createElement("DIV");
        let iLink = el.text(edition.url);
        let linkTbl = [["Link:", iLink]];
        linkDIV.appendChild(el.table(linkTbl));
        let scanDIV = document.createElement("DIV");
        let iPath = el.text(edition.path);
        let iSelector = el.button("Scans zuweisen...");
        iSelector.style.margin = "10px";
        iSelector.onclick = () => {
            this.imgPath = iPath.value;
            argos.loadEye("library_selector");
        }
        let iDefaultPage = el.text(edition.default_page);
        let iSave = el.button("speichern");
        iSave.style.margin = "10px";
        let scanTbl = [
            ["Dateipfad auf Server:", iPath],
            ["Ursprünglicher Dateiname:", edition.dir_name],
            ["Scan-Seiten bearbeiten:", iSelector],
            ["Letzte Seite:", iDefaultPage]
        ];
        scanDIV.appendChild(el.table(scanTbl));

        if(edTypeSelect === 1){scanDIV.style.display = "none"}
        else{linkDIV.style.display = "none"}
        mainBody.appendChild(scanDIV);
        mainBody.appendChild(linkDIV);
        mainBody.appendChild(el.table([["", iSave]]));

        iSave.onclick = () => {
            let data = {
                work_id: iWork.dataset.selected,
                edition_name: iEditionName.value,
                editor: iEditor.value,
                year: iYear.value,
                volume: iVolume.value,
                comment: iComment.value,
                ressource: iRessource.value
            };
            if(this.resId > 0){data.id = this.resId}
            if(iType == 0){
                // scan
                data.url = "";
                data.path = iPath.value;
                data.default_page = iDefaultPage.value;
            } else {
                // link
                data.url = iLink.value;
            }
            arachne.edition.save(data).
                then(() => {el.status("saved"); this.refresh()}).
                catch(e => {throw e});
        }

        mainBody.appendChild(el.closeButton(this));
        this.ctn.appendChild(mainBody);
    }
}

class LibrarySelector extends Oculus{
    constructor(res, resId=null, access=[], main=false){
        super(res, resId, access, main);
    }
    async load(){
        const editionId = argos.main.o.library_edit.resId;
        let mainBody = document.createDocumentFragment();
        let rPart = document.createElement("DIV");
        const scans = await arachne.scan.is(argos.main.o.library_edit.imgPath, "path", false);
        rPart.classList.add("rPart");
        rPart.appendChild(el.h("Scanseiten auswählen", 3));
        let imgOverview = document.createElement("DIV");
        imgOverview.classList.add("imgOverview");
        /* data-idlist ? array with scan-lnk ids? */
        this.setSelection("main", "div.imgSelectPage", true);
        for(const scan of scans){
            let imgSelectPage = document.createElement("DIV");
            imgSelectPage.classList.add("imgSelectPage");
            imgSelectPage.id = scan.id;
            imgSelectPage.textContent = scan.filename;
            imgSelectPage.onclick = () => {
                fetch(`/file/scan/${scan.id}`, {headers: {"Authorization": `Bearer ${argos.token}`}})
                    .then(re => re.blob())
                    .then(newImg => {
                        let nURL = URL.createObjectURL(newImg);
                        previewImg.src = nURL;
                    })
                    .catch(e => {throw e});
                    }
            const scan_lnks = await arachne.scan_lnk.is(scan.id, "scan", false);
            let scanLnkId = 0;
            for(const scan_lnk of scan_lnks){
                if(scan_lnk.edition_id === editionId){scanLnkId = scan_lnk.id; break}
            }
            if(scanLnkId > 0){
                imgSelectPage.classList.add("selMarked");
                imgSelectPage.dataset.scan_lnk_id = scanLnkId;
                this.selMarker.main.lastRow = scan.id;
                this.selMarker.main.ids.push(scan.id);
            }
            if(scan_lnks.length === 1){
                imgSelectPage.appendChild(el.i(" (in 1 Edition)", {class: "minorTxt"}));
            } else if(scan_lnks.length >0){
                imgSelectPage.appendChild(el.i(` (in ${scan_lnks.length} Editionen)`, {class: "minorTxt"}));
                imgSelectPage.classList.add("selMarked");
            }
            imgOverview.appendChild(imgSelectPage);
        }
        rPart.appendChild(imgOverview);
        let iSave = el.button("Auswahl speichern");
        iSave.onclick = async () => {
            let deleteList = [];
            let addList = [];
            this.ctn.querySelectorAll("div.imgSelectPage").forEach(function(e){
                if(e.classList.contains("selMarked") && e.dataset.scan_lnk_id == null){
                    addList.push(e.id);
                } else if(!e.classList.contains("selMarked") && e.dataset.scan_lnk_id != null){
                    deleteList.push(e.dataset.scan_lnk_id);
                }
            });
            for(const delItem of deleteList){
                console.log(delItem);
                await arachne.scan_lnk.delete(delItem);
            }
            for(const addItem of addList){
                console.log({edition_id: editionId, scan_id: addItem});
                await arachne.scan_lnk.save({edition_id: editionId, scan_id: addItem});
            }
            this.close();
        }
        rPart.appendChild(iSave);
        mainBody.appendChild(rPart);

        let lPart = el.div(null, {class: "lPart"});
        let previewImg = document.createElement("IMG");
        previewImg.classList.add("previewImg");
        lPart.appendChild(previewImg);
        mainBody.appendChild(lPart);
        let lPartBottom = el.div(null, {class: "lPartBottom"});
        /*
    <table class='minorTxt'>
        <tr style='text-align:center;'>
            <td width='33%'>
                <a class="resultBrowser" data-target='first' title='erster Treffer'>|&lt;</a>
                &nbsp;&nbsp;
                <a class="resultBrowser" data-target="-100" title='-100'>&lt;&lt;&lt;</a>
                &nbsp;&nbsp;
                <a class="resultBrowser" data-target="-10" title='-10'>&lt;&lt;</a>
                &nbsp;&nbsp;
                <a class="resultBrowser" data-target="-1" title='-1'>&lt;</a>
            </td>
            <td width='33%'>
                <span id='resultBrowserCurrent'></span> von <span id='resultBrowserTotal'></span>
            </td>
            <td width='34%'>
                <a class="resultBrowser" data-target="1" title='+1'>&gt;</a>
                &nbsp;&nbsp;
                <a class="resultBrowser" data-target="10" title='+10'>&gt;&gt;</a>
                &nbsp;&nbsp;
                <a class="resultBrowser" data-target="100" title='+100'>&gt;&gt;&gt;</a>
                &nbsp;&nbsp;
                <a class="resultBrowser" data-target='last' title='letzter Treffer'>&gt;|</a>
            </td>
        </tr>
    </table>
         */

        mainBody.appendChild(lPartBottom);
        /*
                let textElement = document.createElement("P");
                textElement.textContent = "Keine Scans verfügbar in diesem Verzeichnis.";
                me.ctn.appendChild(textElement);
         */
        mainBody.appendChild(el.closeButton(this));
        this.ctn.appendChild(mainBody);
        /*
        }, "library_selector": function(me){
            if(me.ctn.querySelector("input#editionIdList").value != "[]"){ 
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
         */
    }
}
class LibraryUpdate extends Oculus{
    constructor(res, resId=null, access=[], main=false){
        super(res, resId, access, main);
    }
    async load(){
        let mainBody = document.createDocumentFragment();
        mainBody.appendChild(el.h("Bibliothek aktualisieren", 3));
        mainBody.appendChild(el.p(`
            Sollen die Bibliothek aktualisiert werden, damit die Veränderungen
            in den Editionen übernommen werden? Dieser Vorgang kann einige
            Momente dauern.`));
        let updateButton = el.button("aktualisieren");
        updateButton.onclick = () => {
            this.ctn.innerHTML = "<div id='loadLabel'>Bibliothek wird aktualisiert...</div>";
            fetch("/exec/library_update", {headers: {"Authorization": `Bearer ${argos.token}`}}).
                then(re => {this.refresh();
                    if(re.status == 200){alert("Die Listen wurden auf dem Server aktualisiert.")}
                    else {alert("Ein Fehler is aufgetreten. Bitte versuchen Sie es erneut.")}
                }).
                catch(e => {throw e});
        }
        mainBody.appendChild(updateButton);
        mainBody.appendChild(el.closeButton(this));
        this.ctn.appendChild(mainBody);
    }
}

class Opera extends Oculus{
    constructor(res, resId=null, access=[], main=false){
        super(res, resId, access, main);
    }
    async load(){
        let list = "mai";
        if(this.res.endsWith("min")){list = "min"}

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

        this.setSelection("main", "tr.opera", false);
        
        // contextmenu
        let cContext = new ContextMenu();
        if(argos.access.includes("o_edit")){
            cContext.addEntry('tr.opera.author', 'a', 'Autor bearbeiten', ()=>{
            argos.loadEye("opera_author_edit", this.ctn.querySelector("tr#"+this.selMarker.main.lastRow).dataset.author_id);
        });
            cContext.addEntry('tr.opera.work', 'a', 'Werk bearbeiten', () =>{
            argos.loadEye("opera_work_edit", this.ctn.querySelector("tr#"+this.selMarker.main.lastRow).dataset.work_id);
            });
            cContext.addEntry('tr.opera', 'hr', '', null);
            cContext.addEntry('tr.opera', 'a', 'Neuer Autor erstellen', function(){argos.loadEye("opera_author_edit")});
            cContext.addEntry('tr.opera', 'a', 'Neues Werk erstellen', function(){argos.loadEye("opera_work_edit")});
            cContext.addEntry('tr.opera', 'hr', '', null);
            cContext.addEntry('*', 'a', 'Opera-Listen aktualisieren', function(){argos.loadEye("opera_update")});
        }
        cContext.addEntry('*', 'hr', '', null);
        cContext.addEntry('*', 'a', 'Opera-Listen exportieren', function(){argos.loadEye("opera_export")});
        this.setContext = cContext.menu;

        await fetch(`/site/opera/${list}`, {
            headers: {"Authorization": `Bearer ${argos.token}`}
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

class AuthorEdit extends Oculus{
    constructor(res, resId=null, access=[], main=false){
        super(res, resId, access, main);
    }
    async load(){
        let author = {};
        let mainBody = document.createDocumentFragment();
        if(this.resId>0){
            author = await arachne.author.is(this.resId);
            mainBody.appendChild(el.h(`${author.full} <i class='minorTxt'>(ID: ${author.id})</i>`, 3))
        }else{mainBody.appendChild(el.h("Neuer Autor erstellen", 3))}
        /*
            <div class='popOver' style='display:inline-box;'>
                <span style="z-index: 1">Sortierdatum <a>(?)</a>:</span>
                <div class='popOverContent' style='text-align: left;'>
                    % include("help/help_opera_sort")
                </div>
            </div>

            <div class='popOver' style='display:inline-box;'>
                Sortierdatum-Typ <a>(?)</a>:
                <div class='popOverContent' style='text-align: left;'>
                    % include("help/help_opera_sort_type")
                </div>
            </div>
         */
        let iFull = el.text(author.full);
        let iDateDisplay = el.text(author.date_display);
        let iAbbr = el.text(author.abbr);
        let iAbbrSort = el.text(author.abbr_sort);
        let iDateSort = el.text(author.date_sort);
        let iDateType = el.text(author.date_type);
        let iInUse = el.select(author.in_use);
        let iTxtInfo = el.area(author.txt_info);
        const tblContent = [
            ["Name:", iFull, "Anzeigedatum:", iDateDisplay],
            ["Abkürzung:", iAbbr, "Abkürzung (Sortierung):", iAbbrSort],
            ["Sortierdatum:", iDateSort, "Sortierdatum-Typ:", iDateType],
            ["in Benutzung:", iInUse, "", ""],
            ["Kommentar:", iTxtInfo, "", ""]
        ];
        /*18-32-17-32*/
        mainBody.appendChild(el.table(tblContent));
        if(this.resId>0){
            let iSave = el.button("Änderungen speichern");
            iSave.style.margin = "10px";
            iSave.onclick = () => {
                if(isNaN(iDateSort)){
                }
                let data = {
                    id: this.resId,
                    full: iFull.value,
                    date_display: iDateDisplay.value,
                    abbr: iAbbr.value,
                    abbr_sort: iAbbrSort.value,
                    in_use: iInUse.value,
                    txt_info: iTxtInfo.value
                };
                if(iDateSort.value != "" && !isNaN(parseInt(iDateSort.value))){
                    data.date_sort = iDateSort.value;
                } else if (iDateSort.value != ""){
                    alert("Sortierdatum muss eine Ganzzahl sein. Der Wert konnte nicht gespeichert werden.");
                }
                if(iDateType.value != "" && !isNaN(parseInt(iDateType.value))){
                    data.date_type = iDateType.value;

                } else if (iDateType.value != ""){
                    alert("Sortiertyp muss eine Ganzzahl sein. Der Wert konnte nicht gespeichert werden.");
                }
                arachne.author.save(data)
                    .then(() => {this.close()})
                    .catch(e => {throw e});
            }
            let iDelete = el.button("Autor löschen");
            iDelete.style.margin = "10px";
            iDelete.onclick = () => {
                if(confirm("Soll der Autor wirklich gelöscht werden? Dieser Schritt kann nicht rückgängig gemacht werden!")){
                    arachne.author.delete(this.resId);
                }
            }
            mainBody.appendChild(iSave);
            mainBody.appendChild(iDelete);
        } else {
            let iSave = el.button("Neuer Autor erstellen");
            iSave.onclick = () => {
                let data = {
                    full: iFull.value,
                    date_display: iDateDisplay.value,
                    abbr: iAbbr.value,
                    abbr_sort: iAbbrSort.value,
                    in_use: iInUse.value,
                    txt_info: iTxtInfo.value
                };
                if(iDateSort.value != "" && !isNaN(parseInt(iDateSort.value))){
                    data.date_sort = iDateSort.value;
                } else if (iDateSort.value != ""){
                    alert("Sortierdatum muss eine Ganzzahl sein. Der Wert konnte nicht gespeichert werden.");
                }
                if(iDateType.value != "" && !isNaN(parseInt(iDateType.value))){
                    data.date_type = iDateType.value;

                } else if (iDateType.value != ""){
                    alert("Sortiertyp muss eine Ganzzahl sein. Der Wert konnte nicht gespeichert werden.");
                }
                arachne.author.save(data)
                    .then(() => {this.close()})
                    .catch(e => {throw e});
            }
            mainBody.appendChild(iSave);
        }
        mainBody.appendChild(el.closeButton(this));
        this.ctn.appendChild(mainBody);
    }
}

class WorkEdit extends Oculus{
    constructor(res, resId=null, access=[], main=false){
        super(res, resId, access, main);
    }
    async load(){
        let work = {};
        let mainBody = document.createDocumentFragment();
        if(this.resId>0){
            work = await arachne.work.is(this.resId);
            mainBody.appendChild(el.h(`${work.full} <i class='minorTxt'>(ID: ${work.id})</i>`, 3))
        }
        else{mainBody.appendChild(el.h("Neues Werk erstellen", 3))}
        /*
            <div class='popOver' style='display:inline-box;'>
                <span style="z-index: 1">Sortierdatum <a>(?)</a>:</span>
                <div class='popOverContent' style='text-align: left;'>
                    % include("help/help_opera_sort")
                </div>
            </div>
            <div class='popOver' style='display:inline-box;'>
                Sortierdatum-Typ <a>(?)</a>:
                <div class='popOverContent' style='text-align: left;'>
                    % include("help/help_opera_sort_type")
                </div>
            </div>
            */
        const authorsRaw = await arachne.author.getAll();
        let authors = {};
        for(const authorRaw of authorsRaw){authors[authorRaw.id] = authorRaw.abbr}
        let iFull = el.text(work.full);
        let iDateDisplay = el.text(work.date_display);
        let iAbbr = el.text(work.abbr);
        let iAbbrSort = el.text(work.abbr_sort);
        let iDateSort = el.text(work.date_sort);
        let iDateType = el.text(work.date_type);
        let iAuthorDisplay = el.text(work.author_display);
        let iCitation = el.text(work.citation);
        let iAuthor = el.select(work.author_id, authors);
        let iMaior = el.select(work.is_maior);
        let iBibCit = el.text(work.bibliography_cit);
        let iReference = el.text(work.reference);
        let iInUse = el.select(work.in_use);
        let iTxtInfo = el.area(work.txt_info);
        let iBib = el.area(work.bibliography);
        const tblContent = [
            ["Name:", iFull, "Anzeigedatum:", iDateDisplay],
            ["Abkürzung:", iAbbr, "Abkürzung (Sortierung):", iAbbrSort],
            ["Sortierdatum:", iDateSort, "Sortierdatum-Typ", iDateType],
            ["Abweichender Autorenname<br />(z.B. bei VITA):", iAuthorDisplay, "", ""],
            ["", "", "", ""],
            ["Stellenangabe (Bsp.):", iCitation, "Autor:", iAuthor],
            ["gehört zu den <i>opera maiora</i>:", iMaior, "Stellenangabe Bibliographie:<br/><i class='minorTxt'>(nur minora)</i>", iBibCit],
            ["Referenz:", iReference, "in Benutzung:", iInUse],
            ["Kommentar:", iTxtInfo, "Bibliographie:", iBib]
        ];
        mainBody.appendChild(el.table(tblContent));
        /*18-32-17-32*/
        if(this.resId>0){
            let iSave = el.button("Änderungen speichern");
            iSave.style.margin = "10px";
            iSave.onclick = () => {
                let data = {
                    id: this.resId,
                    full: iFull.value,
                    date_display: iDateDisplay.value,
                    abbr: iAbbr.value,
                    abbr_sort: iAbbrSort.value,
                    author_display: iAuthorDisplay.value,
                    citation: iCitation.value,
                    author_id: iAuthor.value,
                    is_maior: iMaior.value,
                    bibliography_cit: iBibCit.value,
                    reference: iReference.value,
                    in_use: iInUse.value,
                    txt_info: iTxtInfo.value,
                    bibliography: iBib.value
                };
                if(iDateSort.value != "" && !isNaN(parseInt(iDateSort.value))){
                    data.date_sort = iDateSort.value;
                } else if (iDateSort.value != ""){
                    alert("Sortierdatum muss eine Ganzzahl sein. Der Wert konnte nicht gespeichert werden.");
                }
                if(iDateType.value != "" && !isNaN(parseInt(iDateType.value))){
                    data.date_type = iDateType.value;

                } else if (iDateType.value != ""){
                    alert("Sortiertyp muss eine Ganzzahl sein. Der Wert konnte nicht gespeichert werden.");
                }
                arachne.work.save(data)
                    .then(() => {this.close()})
                    .catch(e => {throw e});
            }
            let iDelete = el.button("Werk löschen");
            iDelete.style.margin = "10px";
            iDelete.onclick = () => {
                if(confirm("Soll das Werk wirklich gelöscht werden? Dieser Schritt kann nicht rückgängig gemacht werden!")){
                    arachne.work.delete(this.resId);
                }
            }
            mainBody.appendChild(iSave);
            mainBody.appendChild(iDelete);
        } else {
            let iSave = el.button("Neues Werk erstellen");
            iSave.onclick = () => {
                let data = {
                    full: iFull.value,
                    date_display: iDateDisplay.value,
                    abbr: iAbbr.value,
                    abbr_sort: iAbbrSort.value,
                    author_display: iAuthorDisplay.value,
                    citation: iCitation.value,
                    author_id: iAuthor.value,
                    is_maior: iMaior.value,
                    bibliography_cit: iBibCit.value,
                    reference: iReference.value,
                    in_use: iInUse.value,
                    txt_info: iTxtInfo.value,
                    bibliography: iBib.value
                };
                if(iDateSort.value != "" && !isNaN(parseInt(iDateSort.value))){
                    data.date_sort = iDateSort.value;
                } else if (iDateSort.value != ""){
                    alert("Sortierdatum muss eine Ganzzahl sein. Der Wert konnte nicht gespeichert werden.");
                }
                if(iDateType.value != "" && !isNaN(parseInt(iDateType.value))){
                    data.date_type = iDateType.value;

                } else if (iDateType.value != ""){
                    alert("Sortiertyp muss eine Ganzzahl sein. Der Wert konnte nicht gespeichert werden.");
                }
                arachne.work.save(data)
                    .then(() => {this.close()})
                    .catch(e => {throw e});
            }
            mainBody.appendChild(iSave);
        }
        mainBody.appendChild(el.closeButton(this));
        this.ctn.appendChild(mainBody);
    }
}

class OperaExport extends Oculus{
    constructor(res, resId=null, access=[], main=false){
        super(res, resId, access, main);
    }
    async load(){
        let mainBody = document.createDocumentFragment();
        let exportBox = el.div(null, {class: "exportBox"});
        exportBox.appendChild(el.closeButton(this));
        exportBox.appendChild(el.h("<i>opera</i>-Liste exportieren", 3));
        let p1 = el.p("");
        let checkScans = document.createElement("INPUT");
        checkScans.type = "checkbox"; checkScans.id = "checkScans"; checkScans.checked = "true";
        checkScans.value = "1";
        let checkScansLabel = document.createElement("LABEL");
        checkScansLabel.setAttribute("for", "checkScans");
        checkScansLabel.textContent = "Digitalisate/Links exportieren.";
        p1.appendChild(checkScans); p1.appendChild(checkScansLabel);
        exportBox.appendChild(p1);
        let checkComment = null;
        if(argos.access.includes("o_view")){
            let p2 = el.p("");
            checkComment = document.createElement("INPUT");
            checkComment.type = "checkbox"; checkComment.id = "checkComment"; checkComment.checked = "true";
            let checkCommentLabel = document.createElement("LABEL");
            checkCommentLabel.setAttribute("for", "checkComment");
            checkCommentLabel.textContent = "Kommentarspalte exportieren.";
            p2.appendChild(checkComment); p2.appendChild(checkCommentLabel);
            exportBox.appendChild(p2);
        }
        let printButton = el.button("drucken");
        printButton.onclick = () => {
            const cDigi = checkScans.checked;
            const cCmnt = checkComment.checked;

            let tBody = document.createElement("TBODY");
            this.ctn.innerHTML="<div id='loadLabel'>Liste wird vorbereitet...</div>";
            document.querySelector("div.operaBox").querySelectorAll("tr").forEach(function(e){
                let eCopy = e.cloneNode(true);
                if (cDigi != true){eCopy.querySelectorAll("a").forEach(function(f){f.remove()})}
            if (cCmnt != true){
                eCopy.querySelectorAll("td.c5").forEach(function(f){f.remove()})
                eCopy.querySelectorAll("td.c5_min").forEach(function(f){f.remove()})
            }
                tBody.appendChild(eCopy);
            });
            if (cCmnt != true){tBody.querySelector("th:last-child").remove()}
            let exTable = document.createElement("TABLE");
            exTable.classList.add("exportTable");
            exTable.appendChild(tBody);
            this.ctn.textContent = "";
            this.ctn.appendChild(exTable);
            window.print();
            this.close();
        }
        exportBox.appendChild(printButton);
        mainBody.appendChild(exportBox);
        this.ctn.appendChild(mainBody);
    }
}
class OperaUpdate extends Oculus{
    constructor(res, resId=null, access=[], main=false){
        super(res, resId, access, main);
    }
    async load(){
        let mainBody = document.createDocumentFragment();
        mainBody.appendChild(el.h("<i>opera</i>-Listen aktualisieren", 3));
        mainBody.appendChild(el.p(`
        Sollen die <i>opera</i>-Listen aktualisiert werden, damit die
        Veränderungen in den Listn übernommen werden? Dieser Vorgang kann
        einige Momente dauern.`));
        let updateButton = el.button("aktualisieren");
        updateButton.onclick = () => {
            fetch("/exec/opera_update", {headers: {"Authorization": `Bearer ${argos.token}`}}).
                then(() => {alert("Die Listen wurden auf dem Server aktualisiert.")}).
                catch(e => {throw e});
        }
        mainBody.appendChild(updateButton);
        mainBody.appendChild(el.closeButton(this));
        this.ctn.appendChild(mainBody);
    }
}
