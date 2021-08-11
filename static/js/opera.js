import { Oculus } from "/file/js/oculus.js";
import { ContextMenu } from "/file/js/contextmenu.js";
import { html } from "/file/js/elements.js";
export {
    Library, LibraryEdit, LibrarySelector, LibraryScanImport,
    Opera, OperaExport, OperaUpdate,
    AuthorEdit, WorkEdit,
    SekLit, SekLitEdit,
    FullTextSearch
};

class Library extends Oculus{
    constructor(res, resId=null, access=[], main=false){
        super(res, resId, access, main);
    }
    async load(){
        if(this.query==null){this.query = "*"}
        const searchFields = {
            work_id: {name: "Werk-ID", des: "Durchsucht die verknüpften Werke."},
            ac_web: {name: "Werk", des: "Sucht nach dem verknüpften Werk."},
            id: {name: "ID", des: "Durchsucht die IDs"}
        };
        const displayQuery = this.query;
        for(const field in searchFields){
            const reg = new RegExp(searchFields[field].name, "g");
            this.query = this.query.replace(reg, field);
        }
        let results = await arachne.edition.search(this.query, "*", null);
        this.ctn.innerHTML = "";
        let mainBody = document.createDocumentFragment();

        // set search bar
        let searchBar = document.createElement("DIV");
        let sbInputBox = document.createElement("DIV");
        sbInputBox.id = "inputBox";
        searchBar.id = "searchBar"; searchBar.classList.add("card");
        let sbInput = document.createElement("INPUT");
        sbInput.type = "text";
        (this.query === "*") ? sbInput.value = "" : sbInput.value = displayQuery;
        sbInput.id = "searchBarQuery";
        sbInput.spellcheck = "false"; sbInput.autocomplete = "off";
        sbInput.autocorrect = "off"; sbInput.autocapitalize = "off";
        sbInput.onkeyup = () => {
            if(event.keyCode == 13){
                this.query = sbInput.value;
                this.refresh();
            }
        }

        sbInputBox.appendChild(sbInput);
        searchBar.appendChild(sbInputBox);
        let sbButton = el.button("suchen");
        sbButton.style.position = "absolute";
        sbButton.onclick = () => {
            this.query = sbInput.value;
            this.refresh();
        }
        searchBar.appendChild(sbButton);
        let helpContent = `
            <h3>Hilfe zur Suche</h3>
            <p>Benötigen Sie eine ausführliche Hilfe zur Suche? Dann klicken Sie
            <a href='https://gitlab.lrz.de/haeberlin/dmlw/-/wikis/00-Start'>hier</a>.</p>
            <h4>verfügbare Felder</h4>
            <table class='minorTxt'>
                <tr><td><b>Feldname</b></td><td><b>Beschreibung</b></td></tr>
            `;
        for(const field in searchFields){
        helpContent += `
        <tr><td>${searchFields[field].name}</td><td>${searchFields[field].des}</td></tr>
            `;
        }
       helpContent += `
            </table>
            <i class='minorTxt'>Achtung: Bei den Feldnamen
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
                cContext.addEntry('tr.edition', 'a', 'Ressource bearbeiten', () => {
                    argos.loadEye("library_edit", this.selMarker.main.lastRow)
                });
                cContext.addEntry('tr.edition', 'a', 'Neue Ressource erstellen', () => {argos.loadEye("library_edit")});
                cContext.addEntry('tr.edition', 'a', 'Ressource löschen', async () => {
                    if(window.confirm("Soll die Edition wirklich gelöscht werden? Die verknüpften Scans werden nicht gelöscht! Dieser Schritt kann nicht rückgängig gemacht werden!")){
                        const editionId = parseInt(this.selMarker.main.lastRow);
                        const scan_lnks = await arachne.scan_lnk.is(editionId, "edition", false);
                        for(const scan_lnk of scan_lnks){await arachne.scan_lnk.delete(scan_lnk.id)}
                        await arachne.edition.delete(editionId);
                        this.refresh();
                    }
                });
                cContext.addEntry('tr.edition', 'hr', '', null);
                cContext.addEntry('tr.edition', 'a', 'Scans importieren', () => {argos.loadEye("library_scan_import")});
                cContext.addEntry('tr.edition', 'hr', '', null);
                //cContext.addEntry('tr.edition', 'a', 'Opera-Listen aktualisieren', () => {argos.loadEye("opera_update")});
                this.setContext = cContext.menu;
            }
        }
        mainBody.appendChild(resultBox);
        this.ctn.appendChild(mainBody);
    }
    async contentLoadMore(values){
        const scans = await arachne.scan_lnk.is(values.id, "edition", false);
        let tr = document.createElement("TR");
        if(scans.length == 0 && (values.url == "" || values.url == null)){
            tr.style.color = "var(--errorStat)";
        }
        tr.id = values.id; tr.classList.add("loadMore", "edition");
        let tdContents = [(values.url)?"Link":"Scan", values.edition_name, 
            values.editor + " " +values.year, values.comment, values.dir_name];
        if(values.work_id != null){
            const work = await arachne.work.is(values.work_id);
            tdContents.push(work.opus)
        }
        else{tdContents.push("")}
        if(values.url!=null && values.url != ""){
            tdContents.push(`<a target='_blank' href='${values.url}'>Link</a>`); 
        } else if(scans.length > 0){
            tdContents.push(`<a target='_blank' href='/site/viewer/${values.id}'>Digitalisat</a> (${scans.length})`); 
        }else{tdContents.push("")}

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
        let work = {};
        if(this.resId > 0){
            edition = await arachne.edition.is(this.resId);
            if(edition.work_id > 0){work = await arachne.work.is(edition.work_id)}
            mainBody.appendChild(el.h(`${work.opus} <i class="minorTxt">(ID: ${edition.id})</i>`, 3));
        } else {
            mainBody.appendChild(el.h("Neue Ressource erstellen", 3));
        }
        let iWork = el.text(work.ac_web);
        iWork.dataset.selected = edition.work_id;
        await this.bindAutoComplete(iWork, "work", ["id", "ac_web"]);
        const serieTypes = {
            0: "",
            1: "Migne PL",
            2: "ASBen.",
            3: "ASBoll.",
            4: "AnalBoll.",
            5: "Mon. Boica",
            6: "Ma. Schatzverzeichnisse",
            7: "Ma. Bibliothekskataloge"
        };
        let iEditor = el.text(edition.editor);
        let iYear = el.text(edition.year);
        let iVolume = el.text(edition.volume);
        let iVolumeContent = el.text(edition.vol_cont);
        let iSerie = el.select(edition.serie, serieTypes);
        let iComment = el.area(edition.comment);
        let iLocation = el.text(edition.location);
        let iLibrary = el.text(edition.library);
        let iSignature = el.text(edition.signature);

        /*let editorCityDes = el.span("Editor:");
        if([2,3].includes(edition.ressource)){
            editorCityDes.textContent = "Stadt/Drucker:";
        }*/
        let resTypes = {
            0: "Edition (relevant)",
            1: "Edition (veraltet)",
            2: "Handschrift",
            3: "Alter Druck (relevant)",
            4: "Alter Druck (veraltet)",
            5: "Sonstiges"
        };
        let iRessource = el.select(edition.ressource, resTypes);
        iRessource.onchange = () => {
            if(iRessource.value == 2){
                // MS
                divEditor.style.display = "none";
                divYear.style.display = "none";
                divVolume.style.display = "none";
                divLocation.style.display = "block";
                divLocation.children[0].children[0].children[0].textContent = "Stadt:";
                divLibSig.style.display = "block";
            } else if (iRessource.value == 3){
                // PRINT
                divEditor.style.display = "block";
                divEditor.children[0].children[0].children[0].textContent = "Drucker:";
                divYear.style.display = "block";
                divVolume.style.display = "none";
                divLocation.style.display = "block";
                divLocation.children[0].children[0].children[0].textContent = "Ort:";
                divLibSig.style.display = "none";
            } else {
                // REST
                divEditor.style.display = "block";
                divEditor.children[0].children[0].children[0].textContent = "Editor:";
                divYear.style.display = "block";
                divVolume.style.display = "block";
                divLocation.style.display = "none";
                divLibSig.style.display = "none";
            }
        }
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
        let openScans = `<a class="minorTxt" href="/site/viewer/${edition.id}" target="_blank">Digitalisat öffnen</a>`;
        if(this.res = "viewer"){openScans = ""}
        let tbl1 = [
            ["Verknüpftes Werk:", iWork],
            ["", `<span class="minorTxt">${work.bibliography}</span>`],
            ["", openScans],
            ["Ressource:", iRessource]

        ];
        mainBody.appendChild(el.table(tbl1, ["20%", "80%"]));

        let divEditor = document.createElement("DIV");
        divEditor.append(el.table([["Editor:", iEditor]], ["20%", "80%"]));
        let divLocation = document.createElement("DIV");
        divLocation.append(el.table([["Ort:", iLocation]], ["20%", "80%"]));
        let divYear =  document.createElement("DIV");
        divYear.append(el.table([["Jahr:", iYear]], ["20%", "80%"]));
        let divVolume =  document.createElement("DIV");
        divVolume.append(el.table([["Band:", iVolume], ["Bandinhalt:", iVolumeContent], ["Reihe:", iSerie]], ["20%", "80%"]));
        let divLibSig =  document.createElement("DIV");
        divLibSig.append(el.table([["Bibliothek:", iLibrary], ["Signatur:", iSignature]], ["20%", "80%"]));
        if(edition.ressource == 2){
            // MS
            divEditor.style.display = "none";
            divYear.style.display = "none";
            divVolume.style.display = "none";
        } else if (edition.ressource == 3){
            // PRINT
            divEditor.children[0].children[0].children[0].textContent = "Drucker:";
            divLocation.children[0].children[0].children[0].textContent = "Stadt:";
            divVolume.style.display = "none";
            divLibSig.style.display = "none";
        } else {
            // REST
            divLocation.style.display = "none";
            divLibSig.style.display = "none";
        }
        mainBody.append(divEditor);
        mainBody.append(divLocation);
        mainBody.append(divYear);
        mainBody.append(divVolume);
        mainBody.append(divLibSig);
        mainBody.append(el.table([
            ["Kommentar:", iComment],
            ["Typ:", iType]
        ], ["20%", "80%"]));

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
            ["Scan-Seiten bearbeiten:", iSelector]
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
                editor: iEditor.value,
                volume: iVolume.value,
                vol_cont: iVolumeContent.value,
                comment: iComment.value,
                year: iYear.value,
                ressource: iRessource.value,
                location: iLocation.value,
                library: iLibrary.value,
                signature: iSignature.value
            };
            if(iSerie.value!=0){data.serie = iSerie.value}
            if(this.resId > 0){data.id = this.resId}
            if(iPath.value != ""){data.path = iPath.value}
            if(iType == 0){
                // scan
                data.url = "";
                data.path = iPath.value;
                //data.default_page = iDefaultPage.value;
            } else {
                // link
                data.url = iLink.value;
            }
            arachne.edition.save(data).
                then(() => {el.status("saved"); this.close()}).
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
                fetch(`/file/scan/${scan.id}`, {headers: {"Authorization": `Bearer ${arachne.key.token}`}})
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
                argos.main.o.library_selector.selMarker.main.lastRow = `${scan.id}`;
                argos.main.o.library_selector.selMarker.main.ids.push(`${scan.id}`);
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

        mainBody.appendChild(lPartBottom);
        /*
                let textElement = document.createElement("P");
                textElement.textContent = "Keine Scans verfügbar in diesem Verzeichnis.";
                me.ctn.appendChild(textElement);
         */
        mainBody.appendChild(el.closeButton(this));
        this.ctn.appendChild(mainBody);
    }
}

class LibraryScanImport extends Oculus{
    constructor(res, resId=null, access=[], main=false){
        super(res, resId, access, main);
    }
    async load(){
        this.ctn.style.height = "530px";
        let mainBody = document.createDocumentFragment();
        mainBody.appendChild(el.h("Neue Scans importieren", 3));
        mainBody.appendChild(el.p(`
            Hier können Sie neue Scans in die Datenbank hinzufügen. Eine Anleitung
            finden Sie auf {Wikiseite}.
        `));
        let pathInput = el.text("");
        mainBody.appendChild(pathInput);
        let updateButton = el.button("laden");
        updateButton.style.margin = "10px 15px";
        this.fileLst = [];
        updateButton.onclick = () => {
            console.log("lets start", pathInput.value);
            //this.ctn.innerHTML = "<div id='loadLabel'>Bibliothek wird aktualisiert...</div>";
            fetch("/exec/scan_add/"+encodeURIComponent(pathInput.value), {headers: {"Authorization": `Bearer ${arachne.key.token}`}}).
                then(re => re.json()).
                then(files => {
                    fBox.innerHTML = "";
                    files.sort();
                    this.fileLst = [];
                    for(const file of files){
                        this.fileLst.push({filename: file.substring(0, file.length-4), path: pathInput.value});
                        let fCap = document.createElement("DIV");
                        fCap.style.padding = "5px"; fCap.style.textAlign = "center";
                        fCap.textContent = file;
                        fBox.appendChild(fCap);
                    }
                    submitNewScans.style.display = "block";
                    //addWork.style.display = "block";
                }).catch(e => {throw e});
        }
        mainBody.appendChild(updateButton);
        let fBox = document.createElement("DIV");
        fBox.style.height = "200px";
        fBox.style.width = "100%";
        fBox.style.border = "1px solid var(--mainTxtColor)";
        fBox.style.borderRadius = "7px";
        fBox.style.overflow = "scroll";
        mainBody.appendChild(fBox);
        /*
        let addWork = el.text("");
        addWork.style.margin = "10px 0";
        addWork.style.display = "none";
        await this.bindAutoComplete(addWork, "work", ["id", "ac_web"]);
        mainBody.appendChild(addWork);
        */
        let submitNewScans = el.button("importieren");
        submitNewScans.style.margin = "10px 15px";
        submitNewScans.style.display = "none";
        submitNewScans.onclick = () => {
            arachne.scan.save(this.fileLst).
                then(re => {
                    console.log(re);
                    alert("Neue Scans importiert!");
                }).
                catch(e => {throw e});
        }
        mainBody.appendChild(submitNewScans);
        mainBody.appendChild(el.closeButton(this));
        this.ctn.appendChild(mainBody);
    }
}

class Opera extends Oculus{
    constructor(res, resId=null, access=[], main=false){
        super(res, resId, access, main);
    }
    async load(){
        let mainBody = document.createDocumentFragment();
        let operaBox = document.createElement("DIV");
        operaBox.classList.add("operaBox");
        let list = "mai";
        if(this.res.endsWith("min")){list = "min"}
        const opTbl = await this.createOperaTbl(list);
        let rowCount = 0;
        let totalRowCount = -1;
        let sheetCount = 1;
        const MAX_ROW = 17;
        let cTbl = document.createElement("TABLE");
        let TRHeader = document.createElement("TR");
        if(list=="mai"){
            // maiora list
            TRHeader.innerHTML = "<th>Datum</th><th>Abkürzung</th><th>Bezeichung</th><th>Editionen</th><th>Kommentar</th>";
            cTbl.append(TRHeader);
            for(const entry of opTbl){
                rowCount ++;
                totalRowCount ++;
                let tr = document.createElement("TR");
                tr.classList.add("opera");//, "author", "work");
                if(entry.work_id != 0){tr.classList.add("work")}
                if(entry.author_id != 0){tr.classList.add("author")}
                tr.id = "o"+totalRowCount;
                tr.dataset.author_id = entry.author_id;
                tr.dataset.work_id = entry.work_id;
                let td1 = document.createElement("TD");
                td1.classList.add("c1");
                td1.innerHTML = entry.date_display
                tr.append(td1);
                let td2 = document.createElement("TD");
                td2.classList.add("c2");
                td2.innerHTML = entry.abbr;
                tr.append(td2);
                let td3 = document.createElement("TD");
                td3.classList.add("c3");
                td3.innerHTML = entry.full;
                tr.append(td3);
                let td4 = document.createElement("TD");
                td4.classList.add("c4");
                td4.innerHTML = entry.editions;
                tr.append(td4);
                let td5 = document.createElement("TD");
                td5.classList.add("c5");
                td5.innerHTML = entry.comment;
                tr.append(td5);
                cTbl.append(tr);
                if((MAX_ROW+1) < rowCount){
                    let cTblDiv = document.createElement("DIV");
                    cTblDiv.id = "opera_"+sheetCount;
                    //cTbl.style.textAlign = "left";
                    cTblDiv.append(cTbl);
                    operaBox.append(cTblDiv);

                    rowCount = 0;
                    sheetCount ++;
                    cTbl = document.createElement("TABLE");
                }
            }
            let cTblDiv = document.createElement("DIV");
            cTblDiv.id = "opera_"+sheetCount;
            //cTblDiv.style.scrollSnapAlign = "unset";
            cTblDiv.append(cTbl);
            operaBox.append(cTblDiv);
        }else{
            // minora list
            TRHeader.innerHTML = "<th>Datum</th><th>Zitierweise</th><th>Kommentar</th>";
            cTbl.append(TRHeader);
            for(const entry of opTbl){
                rowCount ++;
                totalRowCount ++;
                let tr = document.createElement("TR");
                tr.classList.add("opera", "author", "work");
                tr.id = "o"+totalRowCount;
                tr.dataset.author_id = entry.author_id;
                tr.dataset.work_id = entry.work_id;
                let td1 = document.createElement("TD");
                td1.classList.add("c1_min");
                td1.innerHTML = entry.date_display
                tr.append(td1);
                let td2 = document.createElement("TD");
                td2.classList.add("c2_min");
                td2.innerHTML = entry.opus;
                tr.append(td2);
                let td3 = document.createElement("TD");
                td3.classList.add("c5_min");
                td3.innerHTML = `${entry.comment}${entry.editions}`;
                tr.append(td3);
                cTbl.append(tr);
                if((MAX_ROW+1) < rowCount){
                    let cTblDiv = document.createElement("DIV");
                    cTblDiv.id = "opera_"+sheetCount;
                    //cTbl.style.textAlign = "left";
                    cTblDiv.append(cTbl);
                    operaBox.append(cTblDiv);

                    rowCount = 0;
                    sheetCount ++;
                    cTbl = document.createElement("TABLE");
                }
            }
            let cTblDiv = document.createElement("DIV");
            cTblDiv.id = "opera_"+sheetCount;
            cTblDiv.append(cTbl);
            operaBox.append(cTblDiv);
            operaBox.append(el.p(""));
        }
        let lastDiv = document.createElement("DIV");
        lastDiv.style.scrollSnapAlign = "start";
        lastDiv.style.height = "50px";
        operaBox.append(lastDiv);

        operaBox.onscroll = () => {
            let nearestElement = null;
            let toFar = false; 
            this.ctn.querySelectorAll("div.operaBox > div").forEach(function(e){
                if (toFar == false && e.getBoundingClientRect().top <= 260){
                    nearestElement = e;
                } else {toFar = true};
            });
            iPage.value = nearestElement.id.substring(6);
        }
        mainBody.appendChild(operaBox);

        let ctl = document.createElement("DIV");
        ctl.classList.add("controller");
        let iPage = el.text("");
        iPage.style.width = "100px"; iPage.style.border = "none"; iPage.style.textAlign = "right";
        iPage.value = 1;
        iPage.onchange = () => {
            if(!isNaN(iPage.value)){
                this.ctn.querySelector("div#opera_"+iPage.value).scrollIntoView();
            }
        }
        let iMax = document.createElement("SPAN");
        iMax.textContent = "/"+sheetCount;
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
        }
        if(argos.access.includes("e_edit")){
            //cContext.addEntry('*', 'a', 'Opera-Listen aktualisieren', function(){argos.loadEye("opera_update")});
            cContext.addEntry('a.editionLnk', 'a', 'Ressource bearbeiten', () =>{
                argos.loadEye("library_edit", this.eventTarget.id)
            });
        }
        cContext.addEntry('*', 'hr', '', null);
        cContext.addEntry('*', 'a', 'Opera-Listen exportieren', function(){argos.loadEye("opera_export")});
        this.setContext = cContext.menu;
    }

    async createOperaTbl(lstName){
        const vWork = await arachne.work.version();
        const vAuthor = await arachne.author.version();
        const vEdition = await arachne.edition.version();
        let vLatest = vWork<vAuthor?vAuthor:vWork;
        vLatest = vLatest<vEdition?vEdition:vLatest;
        const vLocal = localStorage.getItem("opera_version");
        if(vLocal == null || vLatest > vLocal){
            console.log("calculate opera lists...");
            let authors = await arachne.author.getAll();
            authors.sort((a, b) => {if(a.abbr_sort.toLowerCase() > b.abbr_sort.toLowerCase()){return 1;}else{return -1;}});
            let tblMai = [];
            let tblMin = [];
            let authorAdded = false;
            for(const author of authors){
                authorAdded = false;
                let works = await arachne.work.is(author.id, "author", false);
                works.sort((a, b) => {if(a.abbr_sort!=null&&b.abbr_sort!=null&&a.abbr_sort.toLowerCase() > b.abbr_sort.toLowerCase()){return 1;}else{return -1;}});
                for(const work of works){
                    const editions = await arachne.edition.is(work.id, "work", false);
                    let editionsTxt = "<ul style='list-style-type: none; margin: 0; padding: 0;'>";
                    for(const edition of editions){
                        let editionURL = "/site/viewer/"+edition.id; 
                        if(edition.url!=null&&edition.url!=""){editionURL = html(edition.url)}
                        editionsTxt += `
                            <li>
                                <a href="${editionURL}" class="editionLnk" id="${edition.id}" target="_blank">${html(edition.label)}</a>
                            </li>`;
                    }
                    editionsTxt += "</ul>";
                    if(work.is_maior == 1){
                        // opus maius
                        if(authorAdded == false && work.abbr != null){
                            // author on separat line
                            tblMai.push({
                                author_id: author.id,
                                work_id: 0,
                                date_display: html(author.date_display),
                                abbr: html(`<aut>${(author.in_use == 1)?author.abbr:"["+author.abbr+"]"}</aut>`),
                                full: html(author.full),
                                editions: "",
                                comment: html(author.txt_info)
                            });
                        }
                        if(authorAdded == false && work.abbr == null){
                            // author + work on same line
                            let nData = {
                                author_id: author.id,
                                work_id: work.id,
                                date_display: html(work.date_display),
                                abbr: html(`<aut>${(author.in_use == 1)?author.abbr:"["+author.abbr+"]"}</aut>`),
                                full: "",
                                editions: `${html(work.bibliography)}${editionsTxt}`,
                                comment: html(work.citation)+" "+html(work.txt_info)
                            }
                            if(author.full!=null){
                                nData.full += html(author.full);
                            }
                            if(work.reference!=null && work.reference!=""){
                                nData.full += ` v. ${html(work.reference)}`;
                            }
                            tblMai.push(nData);
                        } else {
                            // work
                            let nWorkData = {
                                author_id: 0,
                                work_id: work.id,
                                date_display: html(work.date_display),
                                abbr: html(`&nbsp;&nbsp;&nbsp;${(work.in_use == 1)?work.abbr:"["+work.abbr+"]"}`),
                                full: "&nbsp;&nbsp;&nbsp;",
                                editions: `${html(work.bibliography)}${editionsTxt}`,
                                comment: html(work.citation)+" "+html(work.txt_info)
                            };
                            if(work.author_display!=null && work.author_display!= ""){
                                nWorkData.abbr = `<aut>${html(work.author_display)}</aut> ${html(work.abbr)}`;
                                if(work.in_use != 1){
                                    nWorkData.abbr = "["+nWorkData.abbr+"]";
                                }
                            }
                            if(work.full!=null){nWorkData.full += html(work.full)
                            }
                            if(work.reference!=null && work.reference!=""){
                                nWorkData.full += ` v. ${html(work.reference)}`;
                            }
                            tblMai.push(nWorkData);
                        }
                        authorAdded = true;
                    } else {
                        // opus minus
                        tblMin.push({
                            author_id: author.id,
                            work_id: work.id,
                            date_display: html(work.date_display),
                            opus: html(work.opus.replace(" <cit></cit> ( <cit_bib></cit_bib>)", "")),
                            editions: editionsTxt,
                            comment: html(work.txt_info)
                        });
                    }
                }
            }
            localStorage.setItem("opera_maiora", JSON.stringify(tblMai));
            localStorage.setItem("opera_minora", JSON.stringify(tblMin));
            localStorage.setItem("opera_version", vLatest);
            if(lstName == "mai"){return tblMai;}
            else{return tblMin;}
        } else {
            if(lstName == "mai"){return JSON.parse(localStorage.getItem("opera_maiora"));}
            else{return JSON.parse(localStorage.getItem("opera_minora"));}
        }
    }
}

class AuthorEdit extends Oculus{
    constructor(res, resId=null, access=[], main=false){
        super(res, resId, access, main);
    }
    async load(){
        let author = {};
        let mainBody = document.createDocumentFragment();
        let sbHelp = el.popHTMLHelp();
        sbHelp.style.top = "10px"; sbHelp.style.right = "40px"; sbHelp.style.textAlign = "right";
        mainBody.appendChild(sbHelp);
        if(this.resId>0){
            author = await arachne.author.is(this.resId);
            mainBody.appendChild(el.h(`${author.full} <i class='minorTxt'>(ID: ${author.id})</i>`, 3))
        }else{mainBody.appendChild(el.h("Neuer Autor erstellen", 3))}
        let iFull = el.text(html(author.full));
        let iDateDisplay = el.text(author.date_display);
        let iAbbr = el.text(author.abbr);
        let iAbbrSort = el.text(author.abbr_sort);
        let iDateSort = el.text(author.date_sort);
        let iDateType = el.text(author.date_type);
        let iInUse = el.select(author.in_use);
        let iTxtInfo = el.area(author.txt_info);
        let dateOwnDes = el.span("Sortierdatum: ");
        const helpContentSort = `
<h3>Hilfe bei der Datierung</h3>
<p class="minorTxt">Damit die Autoren und Werke richtig sortiert werden, muss das Datum in arabischen Zahlen umgestzt werden. Grundsätzlich ist immer das spätere Datum zu wählen. In der folgenden Liste finden Sie einige Beispiele.</p>
<table class="minorTxt">
<tr><td width="20%"><b>Anzeigedatum</b></td><td><b>Sortierdatum</b></td></tr>
<tr><td>1230</td><td>1230</td></tr>
<tr><td>1098/99</td><td>1099</td></tr>
<tr><td>1254-60</td><td>1260</td></tr>
<tr><td>† 1268</td><td>	1268</td></tr>
<tr><td></td><td></td></tr>
<tr><td>c. 980</td><td>980</td></tr>
<tr><td>c. 1000-18</td><td>1018</td></tr>
<tr><td>c. 650-747/51</td><td>751</td></tr>
<tr><td></td><td></td></tr>
<tr><td>695 ?</td><td>695</td></tr>
<tr><td></td><td></td></tr>
<tr><td>ante 897</td><td>897</td></tr>
<tr><td>post 922</td><td>942 (+ 20 Jahre)</td></tr>
<tr><td>paulo post 727</td><td>727</td></tr>
<tr><td></td><td></td></tr>
<tr><td>s. XII.</td><td>1200</td></tr>
<tr><td>c. s. XII.</td><td>1200</td></tr>
<tr><td>s. XI.-XII.</td><td>1200</td></tr>
<tr><td>s. XII.<sup>in.</sup></td><td>1120</td></tr>
<tr><td>s. XII.<sup>med.</sup></td><td>1160</td></tr>
<tr><td>s. XII.<sup>ex.</sup></td><td>1200</td></tr>
<tr><td>s. XII.<sup></sup>1</td><td>1150</td></tr>
<tr><td>s. XII.<sup>2</sup></td><td>1200</td></tr>
<tr><td>s. XII.med. ?</td><td>1150</td></tr>
</table>
        `;
        dateOwnDes.appendChild(el.pop("(?)", helpContentSort, "left", "relative"));
        let dateOwnDesType = el.span("Sortierdatum-Typ: ");
        const helpContentSortType = `
<h3>Hilfe bei der Datierung</h3>
<p class="minorTxt">Um die verschieden grossen Zeiträume zu unterscheiden, wird ein Sortierdatum-Typ gesetzt.</p>
<table class="minorTxt">
<tr><td><b>Nummer</b></td><td><b>Gruppe</b></td><td><b>Beispiel</b></td></tr>
<tr><td>1</td><td><i>genaues Jahr</i></td><td>1230</td></tr>
<tr><td>2</td><td>c. <i>Jahr</i>, paulo post</td><td>c. 980<br />paulo post 727</td></tr>
<tr><td>3</td><td><i>Zeitspanne</i>, ante</td><td>1254-60<br />1098/99<br />ante 897</td></tr>
<tr><td>4</td><td>s.<sup>in.</sup>, s.<sup>med.</sup>, s.<sup>ex.</sup>; post</td><td>s. XII.<sup>in.</sup><br />s. XII.<sup>med.</sup><br />s. XII.<sup>ex.</sup><br />post 922</td></tr>
<tr><td>5</td><td>s.<sup>1</sup> s.<sup>2</sup></td><td>s. XII.<sup>1</sup><br />s. XII.<sup>2</sup></td></tr>
<tr><td>6</td><td>s.</td><td>s. XII.</td></tr>
<tr><td>7</td><td>c. s.</td><td>c. s. XII.</td></tr>
<tr><td>8</td><td>s.–s.</td><td>s. XI.-s.XII.</td></tr>
<tr><td>9</td><td><i>eigene Datierung nötig</i></td><td></td></tr>
</table>
        `;
        dateOwnDesType.appendChild(el.pop("(?)", helpContentSortType, "left", "relative"));
        const tblContent = [
            ["Name:", iFull, "Anzeigedatum:", iDateDisplay],
            ["Abkürzung:", iAbbr, "Abkürzung (Sortierung):", iAbbrSort],
            [dateOwnDes, iDateSort, dateOwnDesType, iDateType],
            ["in Benutzung:", iInUse, "", ""],
            ["Kommentar:", iTxtInfo, "", ""]
        ];
        mainBody.appendChild(el.table(tblContent), ["18%", "32%", "18%", "32%"]);
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
            iDelete.onclick = async () => {
                if(confirm("Soll der Autor wirklich gelöscht werden? Alle verknüpften Werke werden ebenfalls gelöscht. Dieser Schritt kann nicht rückgängig gemacht werden!")){
                    const works = await arachne.work.is(this.resId, "author", false);
                    for(const work of works){
                        console.log(work.id);
                        await arachne.work.delete(work.id);
                    }
                    await arachne.author.delete(this.resId);
                    this.ctn.innerHTML="<div id='loadLabel'>Liste wird vorbereitet...</div>";
                    fetch("/exec/opera_update", {headers: {"Authorization": `Bearer ${arachne.key.token}`}}).
                        then(() => {this.close();argos.main.refresh()}).
                        catch(e => {throw e});
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
        let sbHelp = el.popHTMLHelp();
        sbHelp.style.top = "10px"; sbHelp.style.right = "40px"; sbHelp.style.textAlign = "right";
        mainBody.appendChild(sbHelp);
        if(this.resId>0){
            work = await arachne.work.is(this.resId);
            mainBody.appendChild(el.h(`${work.full} <i class='minorTxt'>(ID: ${work.id})</i>`, 3))
            let tblNames = el.table([
                [
                `<span class="minorTxt"><b>Vorschlagsliste VSC <i>(ac_vsc)</i></b></span>`,
                `<span class="minorTxt"><b>Vorschlagsliste Webseite <i>(ac_web)</i></b></span>`,
                `<span class="minorTxt"><b>'opus'-Darstellung <i>(opus)</i></b></span>`
                ],
                [
                `<span class="minorTxt">${work.ac_vsc}</span>`,
                `<span class="minorTxt">${work.ac_web}</span>`,
                `<span class="minorTxt">${work.opus}</span>`
            ]]);
            tblNames.style.boxShadow = "0 0 3px var(--shadowBG)";
            tblNames.style.marginBottom = "15px";
            mainBody.appendChild(tblNames);
        }
        else{mainBody.appendChild(el.h("Neues Werk erstellen", 3))}
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
        let dateOwnDes = el.span("Sortierdatum: ");
        const helpContentSort = `
<h3>Hilfe bei der Datierung</h3>
<p class="minorTxt">Damit die Autoren und Werke richtig sortiert werden, muss das Datum in arabischen Zahlen umgestzt werden. Grundsätzlich ist immer das spätere Datum zu wählen. In der folgenden Liste finden Sie einige Beispiele.</p>
<table class="minorTxt">
<tr><td width="20%"><b>Anzeigedatum</b></td><td><b>Sortierdatum</b></td></tr>
<tr><td>1230</td><td>1230</td></tr>
<tr><td>1098/99</td><td>1099</td></tr>
<tr><td>1254-60</td><td>1260</td></tr>
<tr><td>† 1268</td><td>	1268</td></tr>
<tr><td></td><td></td></tr>
<tr><td>c. 980</td><td>980</td></tr>
<tr><td>c. 1000-18</td><td>1018</td></tr>
<tr><td>c. 650-747/51</td><td>751</td></tr>
<tr><td></td><td></td></tr>
<tr><td>695 ?</td><td>695</td></tr>
<tr><td></td><td></td></tr>
<tr><td>ante 897</td><td>897</td></tr>
<tr><td>post 922</td><td>942 (+ 20 Jahre)</td></tr>
<tr><td>paulo post 727</td><td>727</td></tr>
<tr><td></td><td></td></tr>
<tr><td>s. XII.</td><td>1200</td></tr>
<tr><td>c. s. XII.</td><td>1200</td></tr>
<tr><td>s. XI.-XII.</td><td>1200</td></tr>
<tr><td>s. XII.<sup>in.</sup></td><td>1120</td></tr>
<tr><td>s. XII.<sup>med.</sup></td><td>1160</td></tr>
<tr><td>s. XII.<sup>ex.</sup></td><td>1200</td></tr>
<tr><td>s. XII.<sup></sup>1</td><td>1150</td></tr>
<tr><td>s. XII.<sup>2</sup></td><td>1200</td></tr>
<tr><td>s. XII.med. ?</td><td>1150</td></tr>
</table>
        `;
        dateOwnDes.appendChild(el.pop("(?)", helpContentSort, "left", "relative"));
        let dateOwnDesType = el.span("Sortierdatum-Typ: ");
        const helpContentSortType = `
<h3>Hilfe bei der Datierung</h3>
<p class="minorTxt">Um die verschieden grossen Zeiträume zu unterscheiden, wird ein Sortierdatum-Typ gesetzt.</p>
<table class="minorTxt">
<tr><td><b>Nummer</b></td><td><b>Gruppe</b></td><td><b>Beispiel</b></td></tr>
<tr><td>1</td><td><i>genaues Jahr</i></td><td>1230</td></tr>
<tr><td>2</td><td>c. <i>Jahr</i>, paulo post</td><td>c. 980<br />paulo post 727</td></tr>
<tr><td>3</td><td><i>Zeitspanne</i>, ante</td><td>1254-60<br />1098/99<br />ante 897</td></tr>
<tr><td>4</td><td>s.<sup>in.</sup>, s.<sup>med.</sup>, s.<sup>ex.</sup>; post</td><td>s. XII.<sup>in.</sup><br />s. XII.<sup>med.</sup><br />s. XII.<sup>ex.</sup><br />post 922</td></tr>
<tr><td>5</td><td>s.<sup>1</sup> s.<sup>2</sup></td><td>s. XII.<sup>1</sup><br />s. XII.<sup>2</sup></td></tr>
<tr><td>6</td><td>s.</td><td>s. XII.</td></tr>
<tr><td>7</td><td>c. s.</td><td>c. s. XII.</td></tr>
<tr><td>8</td><td>s.–s.</td><td>s. XI.-s.XII.</td></tr>
<tr><td>9</td><td><i>eigene Datierung nötig</i></td><td></td></tr>
</table>
        `;
        dateOwnDesType.appendChild(el.pop("(?)", helpContentSortType, "left", "relative"));
        const tblContent = [
            ["Werktitel:", iFull, "Anzeigedatum:", iDateDisplay],
            ["Abkürzung:", iAbbr, "Abkürzung (Sortierung):", iAbbrSort],
            [dateOwnDes, iDateSort, dateOwnDesType, iDateType],
            ["Abweichender Autorenname<br />(z.B. bei VITA):", iAuthorDisplay, "", ""],
            ["", "", "", ""],
            ["Stellenangabe (Bsp.):", iCitation, "Autor:", iAuthor],
            ["gehört zu den <i>opera maiora</i>:", iMaior, "Stellenangabe Bibliographie:<br/><i class='minorTxt'>(nur minora)</i>", iBibCit],
            ["Referenz:", iReference, "in Benutzung:", iInUse],
            ["Kommentar:", iTxtInfo, "Bibliographie:", iBib]
        ];
        mainBody.appendChild(el.table(tblContent), ["18%", "32%", "18%", "32%"]);
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
            iDelete.onclick = async () => {
                const cWorks = await arachne.work.is(work.author_id, "author", false);
                if(cWorks.length > 1){
                    if(confirm("Soll das Werk wirklich gelöscht werden? Dieser Schritt kann nicht rückgängig gemacht werden!")){
                        await arachne.work.delete(this.resId);
                        this.ctn.innerHTML="<div id='loadLabel'>Liste wird vorbereitet...</div>";
                        fetch("/exec/opera_update", {headers: {"Authorization": `Bearer ${arachne.key.token}`}}).
                            then(() => {this.close();argos.main.refresh()}).
                            catch(e => {throw e});
                    }
                } else {
                    alert("Achtung: Dieses Werk kann nicht gelöscht werden, da es das letzte Werk des Autors ist. Entweder löschen Sie den Autor, oder Sie erstellen ein neues Werk für diesen Autor.");
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
            this.ctn.innerHTML = "";
            this.ctn.appendChild(el.loadLabel("Listen werden auf dem Server aktualisiert..."));
            fetch("/exec/opera_update", {headers: {"Authorization": `Bearer ${arachne.key.token}`}}).
                then(() => {alert("Aktualisierung erfolgreich."); this.close();}).
                catch(e => {throw e});
        }
        mainBody.appendChild(updateButton);
        mainBody.appendChild(el.closeButton(this));
        this.ctn.appendChild(mainBody);
    }
}

class FullTextSearch extends Oculus{
    constructor(res, resId=null, access=[], main=false){
        super(res, resId, access, main);
    }
    async load(){
        if(this.query==null){this.query = "*"}
        const searchFields = {
            /*
            lemma: {name: "Lemma", des: "Durchsucht alle Lemmata nach einer bestimmten Zeichenfolge."},
            type: {name: "Typ", des: "Sucht nach Zetteltypen (1: verzettelt, 2: Exzerpt, 3: Index, 4: Literatur)"},
            work: {name: "Werk", des: "Durchsucht die verknüpften Werke."},
            work_id: {name: "Werk-ID", des: "Durchsucht die verknüpften Werk-IDs."},
            author: {name: "Autor", des: "Durchsucht die verknüpften Autoren."},
            author_id: {name: "Autor-ID", des: "Durchsucht die verknüpften Autor-IDs."},
            id: {name: "ID", des: "Durchsucht die IDs"}
            */
        };
        const displayQuery = this.query;
        for(const field in searchFields){
            const reg = new RegExp(searchFields[field].name, "g");
            this.query = this.query.replace(reg, field);
        }
        this.results = [];
        if(this.query != "*" && this.query != ""){
            this.results = await arachne.scan.search(`full_text:*${this.query}*`, "*", "scan", 10001);
        }
        this.resultLst = [];
        for(const result of this.results){this.resultLst.push(result.id)};
        this.ctn.innerHTML = "";
        let mainBody = document.createDocumentFragment();

        // set search bar
        let searchBar = document.createElement("DIV");
        let sbInputBox = document.createElement("DIV");
        sbInputBox.id = "inputBox";
        searchBar.id = "searchBar"; searchBar.classList.add("card");
        let sbInput = document.createElement("INPUT");
        sbInput.type = "text";
        (this.query === "*") ? sbInput.value = "" : sbInput.value = displayQuery;
        sbInput.id = "searchBarQuery";
        sbInput.spellcheck = "false"; sbInput.autocomplete = "off";
        sbInput.autocorrect = "off"; sbInput.autocapitalize = "off";
        sbInput.onkeyup = () => {
            if(event.keyCode == 13){
                let query = sbInput.value;
                (query === "") ? query = "*" : query = query;
                this.query = query;
                this.refresh();
                //this.load(query);
            }
        }
/*
        this.ctn.querySelector('input#search_field').addEventListener('keyup', function(){
            if(event.keyCode == 13){
                argos.mainQuery=document.getElementById("search_field").value;
            }
        });
 */
        sbInputBox.appendChild(sbInput);
        searchBar.appendChild(sbInputBox);
        let sbButton = el.button("suchen");
        sbButton.style.position = "absolute";
        sbButton.onclick = () => {
            let query = sbInput.value;
            (query === "") ? query = "*" : query = query;
            this.query = query;
            this.refresh();
            //this.load(query);
        }
        searchBar.appendChild(sbButton);
        let helpContent = `
            <h3>Hilfe zur Suche</h3>
            <p>Benötigen Sie eine ausführliche Hilfe zur Suche? Dann klicken Sie
            <a href='https://gitlab.lrz.de/haeberlin/dmlw/-/wikis/00-Start'>hier</a>.</p>
            <h4>verfügbare Felder</h4>
            <table class='minorTxt'>
                <tr><td><b>Feldname</b></td><td><b>Beschreibung</b></td></tr>
            `;
        for(const field in searchFields){
        helpContent += `
        <tr><td>${searchFields[field].name}</td><td>${searchFields[field].des}</td></tr>
            `;

        }
       helpContent += `
            </table>
            <i class='minorTxt'>Achtung: Bei den Feldnamen
            auf Groß- und Kleinschreibung achten!</i>
            <p class='minorTxt'>Eine Suche nach '<i>Feldname</i>:NULL' zeigt gewöhnlich alle leeren Felder.</p>
        `;
        searchBar.appendChild(el.pop("Hilfe", helpContent));
        mainBody.appendChild(searchBar);

        // result box
        let resultBox = document.createElement("DIV");
        if(this.results.length===0){
            resultBox.classList.add("msgLabel");
            resultBox.textContent = "Keine Ergebnisse gefunden.";
        } else {
            let resultTxt = document.createElement("DIV");
            resultTxt.classList.add("minorTxt");
            if(this.results.length === 1){
                resultTxt.textContent = "1 Resultat.";
            } else if(this.results.length < 10001){
                resultTxt.textContent = `${this.results.length} Resultate.`;
            } else {
                resultTxt.textContent =  "+10000 Resultate.";
                this.results.pop();
            }
            resultTxt.style.paddingLeft = "20px";
            resultBox.appendChild(resultTxt);
            let zettelBox = document.createElement("DIV");
            zettelBox.classList.add("zettel_box");

            this.cTxtSelection = "";
            zettelBox.onmouseup = () => {
                this.cTxtSelection = window.getSelection().toString();
            }
            this.setLoadMore(zettelBox, this.results)
            resultBox.appendChild(zettelBox);

            this.setSelection("main", ".exzerptBox", false);

            // contextmenu
            let cContext = new ContextMenu();
            cContext.addEntry('.exzerptBox', 'a', 'Edition öffnen', () => {
                const box = document.getElementById(argos.main.selMarker.main.lastRow);
                window.open(`/site/viewer/${box.dataset.edition_id}?scan=${box.dataset.scan_id}`);
            });
            cContext.addEntry('.exzerptBox', 'a', 'neuen Zettel aus Auswahl erstellen', () => {
                const box = document.getElementById(argos.main.selMarker.main.lastRow);
                if(this.cTxtSelection!= ""){
                    this.cEditionId = parseInt(box.dataset.edition_id);
                    this.workId = parseInt(box.dataset.work_id);
                    this.workOpus = box.dataset.work_ac_web;
                    this.cScanId = parseInt(box.dataset.scan_id);
                    argos.loadEye("zettel_add");
                } else {
                    alert("Bitte wählen Sie zuerst eine Textstelle aus!");
                }
            });
            /*
            cContext.addEntry('div.zettel', 'hr', '', null);
            if(this.access.includes("z_edit")||this.access.includes("editor")){
                cContext.addEntry('div.zettel', 'a', 'Stapelverarbeitung',
                    function(){argos.loadEye("zettel_batch")});
            }
            if(this.access.includes("z_edit")){
                cContext.addEntry('*', 'a', 'Neuen Zettel erstellen',
                    function(){argos.loadEye("zettel_add")});
            }
            if(this.access.includes("z_add")){
                cContext.addEntry('*', 'a', 'Zettel importieren', () => {argos.loadEye("zettel_import")});
            }
            cContext.addEntry('*', 'a', 'Zettel exportieren', () => {argos.loadEye("zettel_export")});
            */
            this.setContext = cContext.menu;
        }
        mainBody.appendChild(resultBox);
        this.ctn.appendChild(mainBody);
    }
    async contentLoadMore(scan){
        let exzerpt = document.createElement("DIV");
        exzerpt.classList.add("exzerptBox");
        exzerpt.id = "eb_"+scan.id;
        exzerpt.dataset.scan_id = scan.id;
        exzerpt.style.width = "700px";
        exzerpt.style.margin = "10px";
        exzerpt.style.padding = "10px";
        exzerpt.style.boxShadow = "0 0 1px var(--shadowBG)";
        exzerpt.style.borderRadius = "7px";
        exzerpt.style.backgroundColor = "var(--mainBG)";
        const scan_lnk = await arachne.scan_lnk.is(scan.id, "scan");
        const edition = await arachne.edition.is(scan_lnk.edition_id);
        exzerpt.dataset.edition_id = edition.id;
        const work = await arachne.work.is(edition.work_id);
        exzerpt.dataset.work_id = work.id;
        exzerpt.dataset.work_ac_web = work.ac_web;
        exzerpt.innerHTML = html(`
            <p style="color: var(--mainColor);" class="exzerptBox">
            <b>${work.opus}</b> - p. ${scan.filename} <i>(ed. ${edition.editor} ${edition.year})</i>
            </p>
        `);
        let i = scan.full_text.indexOf(this.query);
        while(i>-1){
            const lPoint = scan.full_text.lastIndexOf(".", i)+1;
            const nPoint = scan.full_text.indexOf(".", i)+1;
            let txtBox = el.p(`
                ${scan.full_text.substring(lPoint, nPoint)
                        .replace(/\n/g, "<br />")
                        .replace(this.query, `<mark>${this.query}</mark>`)}
                `);
            txtBox.style.border = "1px solid black";
            txtBox.style.borderRadius = "7px";
            txtBox.style.padding = "5px 10px";
            exzerpt.appendChild(txtBox);
            i = scan.full_text.indexOf(this.query, i+1);
        }
        return exzerpt;
    }
}

class SekLit extends Oculus{
    constructor(res, resId=null, access=[], main=false){
        super(res, resId, access, main);
    }
    async load(query="*"){
        const searchFields = {
            id: {name: "ID", des: "Durchsucht IDs der Sekundärliteratur."}
            /*
            lemma: {name: "Lemma", des: "Durchsucht alle Lemmata nach einer bestimmten Zeichenfolge."},
            comment: {name: "Kommentar", des: "Durchsucht den Kommentar zu den Lemmata."},
            */
        };
        const displayQuery = query;
        for(const field in searchFields){
            const reg = new RegExp(searchFields[field].name, "g");
            query = query.replace(reg, field);
        }
        const results = await arachne.seklit.search(query, "*");
        this.ctn.innerHTML = "";
        let mainBody = document.createDocumentFragment();

        // set search bar
        let searchBar = document.createElement("DIV");
        let sbInputBox = document.createElement("DIV");
        sbInputBox.id = "inputBox";
        searchBar.id = "searchBar"; searchBar.classList.add("card");
        let sbInput = document.createElement("INPUT");
        sbInput.type = "text";
        (query === "*") ? sbInput.value = "" : sbInput.value = displayQuery;
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
        let helpContent = `
            <h3>Hilfe zur Suche</h3>
            <p>Benötigen Sie eine ausführliche Hilfe zur Suche? Dann klicken Sie
            <a href='https://gitlab.lrz.de/haeberlin/dmlw/-/wikis/00-Start'>hier</a>.</p>
            <h4>verfügbare Felder</h4>
            <table class='minorTxt'>
                <tr><td><b>Feldname</b></td><td><b>Beschreibung</b></td></tr>
            `;
        for(const field in searchFields){
        helpContent += `
        <tr><td>${searchFields[field].name}</td><td>${searchFields[field].des}</td></tr>
            `;

        }
       helpContent += `
            </table>
            <i class='minorTxt'>Achtung: Bei den Feldnamen
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
            let lemmaTbl = document.createElement("TABLE");
            lemmaTbl.innerHTML = `
            <th style='width: 15%'>Kennziffer</th>
            <th style='width: 15%'>Signatur</th>
            <th style='width: 50%'>Werkbezeichnung</th>
            <th style='width: 20%'>weitere Angaben</th>
            `;
            resultTable.appendChild(lemmaTbl);
            resultBox.appendChild(resultTable);
            this.setLoadMore(lemmaTbl, results)

            this.setSelection("main", "tr.loadMore", false);

            // contextmenu
            let that = this;
            let cContext = new ContextMenu();
            if(this.access.includes("o_edit")){
                cContext.addEntry('tr.loadMore', 'a', 'Eintrag bearbeiten', () => {
                    argos.loadEye("sek_lit_edit", that.selMarker.main.lastRow)
                });
                cContext.addEntry('tr.loadMore', 'a', 'Neuen Eintrag erstellen', () => {
                    argos.loadEye("sek_lit_edit")
                });
                cContext.addEntry('tr.loadMore', 'a', 'Eintrag löschen', async () => {
                    if(window.confirm("Soll der Eintrag wirklich gelöscht werden? Dieser Schritt kann nicht rückgängig gemacht werden!")){
                        await arachne.seklit.delete(parseInt(this.selMarker.main.lastRow));
                        this.refresh();
                    }
                });
            }
            if (Object.keys(cContext.menu).length > 0){this.setContext = cContext.menu;}
        }
        mainBody.appendChild(resultBox);
        this.ctn.appendChild(mainBody);
    }

    async contentLoadMore(values){
        let tr = document.createElement("TR");
        tr.id = values.id; tr.classList.add("loadMore");
        let sig = values.signatur;
        if(values.alte_signatur != "" && values.alte_signatur != null){sig += ` (${values.alte_signatur})`}
        let title = `${values.name}, ${values.vorname}, <b>${values.titel}</b>`;
        if(values.reihe != "" && values.reihe != null){title += ", " + values.reihe}
        title += ", " + values.ort + " " + values.jahr;

        let comment = `${values.weitere_angaben} ${values.zusatz}`;
        const tdContents = [values.kennziffer, sig, title, comment];
        for(const tdContent of tdContents){
            let td = document.createElement("TD");
            if(typeof tdContent == "string"){td.innerHTML = html(tdContent)}
            else if(tdContent != null){td.appendChild(tdContent)}
            tr.appendChild(td);
        }
        return tr;
    }
}

/*
class LemmaComment extends Oculus{
    constructor(res, resId=null, access=[], main=false){
        super(res, resId, access, main);
    }
    async load(){
        let lemma = await arachne.lemma.is(this.resId);
        let comments = await arachne.comment.is(this.resId, "lemma", false);
        let user = await argos.user();

        let mainBody = document.createDocumentFragment();
        mainBody.appendChild(el.closeButton(this));

        mainBody.appendChild(el.h(lemma.lemma_display,4));
        for(const comment of comments){
            let cmntBox = document.createElement("P");
            cmntBox.innerHTML = `<b>${comment.user}</b>, am ${comment.u_date.split(" ")[0]}:`;
            cmntBox.insertAdjacentHTML("beforeend", `<br />${comment.comment}`);
            if(user.id === comment.user_id || argos.access.includes("comment_moderator")){
                let delLabel = document.createElement("I");
                delLabel.classList.add("minorTxt");
                delLabel.textContent = " (löschen)";
                delLabel.style.cursor = "pointer";
                delLabel.onclick = () => {
                    if(window.confirm("Soll der Kommentar wirklich gelöscht werden? Dieser Schritt kann nicht rückgängig gemacht werden!")){
                    arachne.comment.delete(comment.id).then(() => {this.refresh()});
                    }
                }
                cmntBox.appendChild(delLabel);
            }
            mainBody.appendChild(cmntBox);
        }
        let newComment = document.createElement("P");
        newComment.textContent = "Neue Notiz:";
        let newTextArea = document.createElement("TEXTAREA");
        let submitButton = document.createElement("INPUT");
        submitButton.type = "BUTTON"; submitButton.value = "speichern";
        submitButton.onclick = () => {
            if(newTextArea.value != ""){
                arachne.comment.save({comment: newTextArea.value, lemma_id: this.resId, user_id: argos.userId})
                    .then((rTxt) => {this.refresh()});
            }
        }
        newComment.appendChild(newTextArea);
        newComment.appendChild(submitButton);
        mainBody.appendChild(newComment);
        this.ctn.appendChild(mainBody);
    }
}
*/

class SekLitEdit extends Oculus{
    constructor(res, resId=null, access=[], main=false){
        super(res, resId, access, main);
    }
    async load(){
        let seklit = {id: null, kennziffer: null, signatur: null, alte_signatur: null,
        name: null, vorname: null, titel: null, reihe: null, weitere_angaben: null,
        ort: null, jahr: null, zusatz: null};
        if(!isNaN(this.resId)){
            seklit = await arachne.seklit.is(this.resId);
        }
        let mainBody = document.createDocumentFragment();
        mainBody.appendChild(el.closeButton(this));
        let mainHeader = document.createElement("H3");
        if(this.resId == null){mainHeader.textContent = "Neue Sekundärliteratur erstellen"}
        else {mainHeader.innerHTML = html(`${seklit.name} ${seklit.jahr} <i class='minorTxt'>(ID: ${seklit.id})</i>`)}
        mainBody.appendChild(mainHeader);
        
        let sbHelp = el.popHTMLHelp();
        sbHelp.style.top = "10px"; sbHelp.style.right = "40px"; sbHelp.style.textAlign = "right";
        mainBody.appendChild(sbHelp);
        let iKennziffer = el.text(seklit.kennziffer);
        let iSignatur = el.text(seklit.signatur);
        let iAlteSignatur = el.text(seklit.alte_signatur);
        let iName = el.text(seklit.name);
        let iVorname = el.text(seklit.vorname);
        let iTitel = el.text(seklit.titel);
        let iReihe = el.text(seklit.reihe);
        let iWeitereAngaben = el.text(seklit.weitere_angaben);
        let iOrt = el.text(seklit.ort);
        let iJahr = el.text(seklit.jahr);
        let iZusatz = el.text(seklit.zusatz);

        let iSave = el.button("speichern");
        iSave.onclick = () => {
            const nValues = {
                id: seklit.id,
                kennziffer: iKennziffer.value,
                signatur: iSignatur.value,
                alte_signatur: iAlteSignatur.value,
                name: iName.value,
                vorname: iVorname.value,
                titel: iTitel.value,
                reihe: iReihe.value,
                weitere_angaben: iWeitereAngaben.value,
                ort: iOrt.value,
                jahr: iJahr.value,
                zusatz: iZusatz.value
            };
            arachne.seklit.save(nValues).then(rTxt => {
                el.status("saved");
            });
        }
        const tblContent = [
            ["Kennziffer:", iKennziffer, "", ""],
            ["Signatur:", iSignatur, "alte Signatur:", iAlteSignatur],
            ["Name:", iName, "Vorname:", iVorname],
            ["Titel:", iTitel, "Reihe:", iReihe],
            ["Ort:", iOrt, "Jahr:", iJahr],
            ["weitere Angaben:", iWeitereAngaben, "Zusatz:", iZusatz],
            ["", "", iSave, ""]
        ];
        let tbl = null;
        mainBody.appendChild(el.table(tblContent));
        /* <td width='18%'></td> <td width='32%'></td>
        <td width='18%'></td><td width='32%'></td> */
        this.ctn.appendChild(mainBody);
    }
}
