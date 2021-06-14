import { Oculus } from "/file/js/oculus.js";
import { ContextMenu } from "/file/js/contextmenu.js";
import { html } from "/file/js/elements.js";
export {
    Zettel, ZettelAdd, ZettelBatch, ZettelDetail, ZettelExport, ZettelImport,
    Kasten
};

class Kasten extends Oculus{
    constructor(res, resId=null, access=[], main=false){
        super(res, resId, access, main);
    }
    async load(){
        let mainBody = document.createDocumentFragment();
        let menuLemma = document.createElement("DIV");
        menuLemma.style.position = "fixed";
        menuLemma.style.top = "42px";
        menuLemma.style.width = "350px";
        menuLemma.style.bottom = "0";
        menuLemma.style.left = "0";
        menuLemma.style.backgroundColor = "var(--mainBG)";
        menuLemma.style.boxShadow = "0 0 3px black";
        menuLemma.style.padding = "10px";
        let iLemma = el.text("");
        iLemma.oninput = () => {
            this.selMarker.main.lastRow = null;
            this.selMarker.main.ids = [];
            setLemmaResults(iLemma.value);
        }
        menuLemma.appendChild(iLemma);
        let lemmaResults = document.createElement("DIV");
        lemmaResults.style.padding = "10px";
        lemmaResults.style.position = "absolute";
        lemmaResults.style.top = "40px";
        lemmaResults.style.bottom = "0px";
        lemmaResults.style.left = "0px";
        lemmaResults.style.right = "0px";
        lemmaResults.style.overflow = "scroll";
        menuLemma.appendChild(lemmaResults);
        const setLemmaResults = async (query) => {
            lemmaResults.innerHTML = "";
            let lemmaLoadLabel = el.loadLabel();
            lemmaResults.appendChild(lemmaLoadLabel);
            let lemmata = [];
            if(query === "*"){
                lemmata = await arachne.lemma.search(query, ["id", "lemma_display"], "lemma");
            } else {
                lemmata = await arachne.lemma.search(`lemma_search:${query.toLowerCase()}.*`, ["id", "lemma_display"], "lemma");
            }
            for(const lemma of lemmata){
                let lemmaBox = document.createElement("DIV");
                lemmaBox.classList.add("lemmaBox"); lemmaBox.id = lemma.id;
                lemmaBox.style.padding = "5px";
                if(query === "*"){
                    lemmaBox.innerHTML = html(lemma.lemma_display);
                } else {
                    lemmaBox.innerHTML = html(lemma.lemma_display.replace(query, `<mark>${query}</mark>`));
                }
                lemmaBox.onclick = () => {
                    loadMainBox();
                }
                lemmaResults.appendChild(lemmaBox);
            }
            lemmaLoadLabel.remove();
        }
        setLemmaResults("*");

        mainBody.appendChild(menuLemma);

        let mainBox = document.createElement("DIV");
        mainBox.style.position = "absolute";
        mainBox.style.top = "0px";
        mainBox.style.left = "350px";
        mainBox.style.right = "0px";
        mainBox.style.minHeight = "100px";
        mainBox.style.padding = "10px";
        const loadMainBox = async () => {
            mainBox.innerHTML = "";
            let mainLoadLabel = el.loadLabel();
            mainBox.appendChild(mainLoadLabel);
            for(const id of this.selMarker.main.ids){
                let lemmaMain = document.createElement("DIV");
                const cLemma = await arachne.lemma.is(parseInt(id));
                lemmaMain.style.boxShadow = "0 0 3px black";
                lemmaMain.style.borderRadius = "7px";
                lemmaMain.style.padding = "5px";
                lemmaMain.style.margin = "5px 5px 20px 5px";
                lemmaMain.style.backgroundColor = "var(--mainBG)";
                let newHTML = cLemma.lemma_display;
                if(cLemma.dicts!=null && cLemma.dicts != ""){
                    newHTML += `<br /><i class="minorTxt">Wörterbücher: ${cLemma.dicts}</i>`;
                }
                if(cLemma.comment!=null && cLemma.comment!=""){
                    newHTML += `<div style="float: right; max-width:300px;">${cLemma.comment}</div>`;
                }
                newHTML += "<hr style='clear: both;' />";
                lemmaMain.innerHTML = html(newHTML);
                let mainZettelBox = document.createElement("DIV");
                mainZettelBox.style.display = "flex";
                mainZettelBox.style.flexDirection = "column";
                mainZettelBox.style.justifyContent = "center";
                mainZettelBox.style.alignItems = "center";
                //mainZettelBox.style.alignContent = "center";
                const zettels = await arachne.zettel.bound([cLemma.id, 0, 0], [cLemma.id, 99999, 99999], "kasten");
                for(const zettel of zettels){
                    mainZettelBox.appendChild(createZettel(zettel));
                }
                if(zettels.length === 0){
                    mainZettelBox.innerHTML = "<span class='minorTxt' style='color:var(--mainColor)'>Keine Zettel für dieses Lemma.</span>";
                }
                lemmaMain.appendChild(mainZettelBox);
                mainBox.appendChild(lemmaMain);
            }
            mainLoadLabel.remove();
        }

        mainBody.appendChild(mainBox);
        this.ctn.appendChild(mainBody);
        this.setSelection("main", "div.lemmaBox", true);

    }
}
class Zettel extends Oculus{
    constructor(res, resId=null, access=[], main=false){
        super(res, resId, access, main);
    }
    async load(){
        if(this.query==null){this.query = "*"}
        const searchFields = {
            lemma: {name: "Lemma", des: "Durchsucht alle Lemmata nach einer bestimmten Zeichenfolge."},
            type: {name: "Typ", des: "Sucht nach Zetteltypen (1: verzettelt, 2: Exzerpt, 3: Index, 4: Literatur)"},
            work: {name: "Werk", des: "Durchsucht die verknüpften Werke."},
            work_id: {name: "Werk-ID", des: "Durchsucht die verknüpften Werk-IDs."},
            author: {name: "Autor", des: "Durchsucht die verknüpften Autoren."},
            author_id: {name: "Autor-ID", des: "Durchsucht die verknüpften Autor-IDs."},
            id: {name: "ID", des: "Durchsucht die IDs"}
        };
        const displayQuery = this.query;
        for(const field in searchFields){
            const reg = new RegExp(searchFields[field].name, "g");
            this.query = this.query.replace(reg, field);
        }

        this.results = await arachne.zettel.search(this.query, "*", "zettel", 10001);
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
            this.setLoadMore(zettelBox, this.results)
            resultBox.appendChild(zettelBox);

            this.setSelection("main", "div.zettel", true);

            // contextmenu
            let cContext = new ContextMenu();
            cContext.addEntry('div.zettel', 'a', 'Detailansicht', function(){
                argos.loadEye("zettel_detail", argos.main.selMarker.main.lastRow)});
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
            this.setContext = cContext.menu;
            /*
            // open zettel detail, if in query
            this.ctn.querySelector("div.zettel_box").addEventListener("dblclick", function(){
                argos.loadEye("zettel_detail", this.selMarker.main.lastRow)
            });
            if(argos.getQuery("detail") != null){
                argos.loadEye("zettel_detail", argos.getQuery("detail"))
            }
            */
        }
        mainBody.appendChild(resultBox);
        this.ctn.appendChild(mainBody);
    }
    contentLoadMore(zettel){return createZettel(zettel)}

}

function createZettel(zettel){
    let box = document.createElement("DIV");
    box.classList.add("zettel", "loadMore");
    box.id = zettel.id;
    box.display = "flex";
    box.style.flexShrink = 0;
    box.style.width = "var(--zettelWidth)";//"500px";
    if(zettel.img_path!=null){
        let img = document.createElement("IMG");
        img.src = zettel.img_path+".jpg";
        let usage = "in_use";
        if(zettel.in_use==0){usage="no_use"} // does this do anything?!
        img.classList.add("zettel_img", usage);
        box.appendChild(img);
        let imgMSG = document.createElement("DIV");
        imgMSG.classList.add("zettel_msg");
        if(zettel.sibling>0){
            imgMSG.innerHTML = "<span style='color: var(--contraColor);' title='Geschwisterzettel'>&#x273F;</span>"
        }
        if(zettel.date_sort===9 && zettel.date_own === null){
            imgMSG.innerHTML +="<span style='color: var(--errorStat);' title='Datierung erforderlich'>&#x0021;</span>";
        }
        box.appendChild(imgMSG);
        let zettelMenu = document.createElement("DIV");
        zettelMenu.classList.add("zettel_menu");
        zettelMenu.innerHTML = `<span style='float: left;'>${html(zettel.lemma_display)}</span>
        <span style='float: right;'>${html(zettel.opus)}</span>`;
        box.appendChild(zettelMenu);

    } else {
        box.style.height = "var(--zettelHeight)";//"500px";
        box.innerHTML = `<div class='digitalZettel'>
            <div class='digitalZettelLemma'>${html(zettel.lemma_display)}</div>
            <div class='digitalZettelDate'>${html(zettel.date_display)}</div>
            <div class='digitalZettelWork'>${html(zettel.opus)}</div>
            <div class='digitalZettelText'>${html(zettel.txt)}</div></div>
        `;
    }
    return box;
}

class ZettelExport extends Oculus{
    constructor(res, resId=null, access=[], main=false){
        super(res, resId, access, main);
    }
    async load(){
        const zettels = await arachne.zettel.search(argos.main.query, "*", "zettel", 2001);
        let mainBody = document.createDocumentFragment();
        let noPrint = el.div(null, {class: "noPrint"});
        noPrint.appendChild(el.h("Zettel exportieren", 3));
        if(zettels.length > 2000){
            noPrint.appendChild(el.p(`
            Es wurden 2000 Zettel vorbereitet.<br />
            <b>Beachten Sie:</b> es können nicht mehr als 2000 Zettel
            gleichzeitig exportiert werden.
        `));
        } else {
            noPrint.appendChild(el.p(`
            Es wurden ${zettels.length} Zettel vorbereitet.`));
        }
        let printZettel = el.button("drucken");
        printZettel.style.float = "right";
        printZettel.onclick = () => {
            window.print();
        }
        noPrint.appendChild(printZettel);
        noPrint.appendChild(el.closeButton(this));
        mainBody.appendChild(noPrint);

        let yesPrint = el.div(null, {class: "print"});
        
        let zCount = 0
        for(const zettel of zettels){
            zCount ++;
            if(zCount == 2001){break}
            let zettelPrint = el.div(null, {class: "zettel_print"});
            if(zettel.img_path != null){
                zettelPrint.innerHTML = html(`<img src="${zettel.img_path + '.jpg'}" />`);
            } else {
                zettelPrint.innerHTML = html(`
                    <div class='digitalZettelLemma'>${!zettel.lemma_display}</div>
                    <div class='digitalZettelDate'>${!zettel.date_display}</div>
                    <div class='digitalZettelWork'>${!zettel.opus} ${zettel.stellenangabe}</div>
                    <div class='digitalZettelText'>${!zettel.txt}</div>
                    <div class='digitalZettelAuthor'>${zettel.editor}.</div>
                `);
            }
            yesPrint.appendChild(zettelPrint);
        }
        mainBody.appendChild(yesPrint);
        this.ctn.appendChild(mainBody);
    }
}

class ZettelImport extends Oculus{
    constructor(res, resId=null, access=[], main=false){
        super(res, resId, access, main);
    }
    async load(){
        let mainBody = document.createDocumentFragment();
        mainBody.appendChild(el.h("Zettel importieren", 3));
        mainBody.appendChild(el.closeButton(this));
        let iLetter = el.text("S");
        let iType = el.select(0, { 0: "...", 1: "verzettelt", 2: "Exzerpt",
            3: "Index", 4: "Literatur"});
        let tblContent = [
            ["Buchstabe:", iLetter],
            ["Zetteltyp:", iType]
        ];
        let iEditor = null;
        if(argos.access.includes("admin")){
            const users = await arachne.user.getAll();
            let userList = {};
            for(const user of users){
                userList[user.id] = user.last_name;
            }
            iEditor = el.select(0, userList);
            tblContent.push(["erstellt von:", iEditor]);
        }
        let iFiles = document.createElement("INPUT");
        iFiles.type = "file"; iFiles.setAttribute("multiple", true);
        tblContent.push(["Dateien:", iFiles]);
        let iUpload = el.button("hochladen");
        iUpload.onclick = async () => {
            this.ctn.innerHTML = "";
            let imgLoadLabel = el.loadLabel("Bilder werden hochgeladen.")
            this.ctn.appendChild(imgLoadLabel);
            const maxItem= 100;
            let cItemCount = maxItem;
            let cUploadIndex = -1;
            let uploadGroup = [];
            const fLength = iFiles.files.length;
            for(let i=0; i<fLength; i++){
                if(cItemCount >= maxItem){
                    cItemCount = 0;
                    cUploadIndex ++;
                    uploadGroup.push(new FormData());
                    uploadGroup[cUploadIndex].append("letter", iLetter.value);
                    uploadGroup[cUploadIndex].append("type", iType.value);
                    uploadGroup[cUploadIndex].append("user_id_id", iEditor.value);
                }
                cItemCount ++;
                uploadGroup[cUploadIndex].append("files", iFiles.files[i]);
            }
            for(const uItem of uploadGroup){
                console.log("Uploading next group...");
                await fetch("/file/zettel", {method: "POST", body: uItem,
                headers: {"Authorization": `Bearer ${arachne.key.token}`}}).
                    then(re => {console.log(re.status)}).
                    catch(e => {throw e});
            }
            console.log("Upload complete!");
            alert("Bilder erfolgreich hochgeladen. Bitte laden Sie die Seite neu.");
            this.close();
        }
        tblContent.push(["", iUpload]);
        mainBody.appendChild(el.table(tblContent));
        this.ctn.appendChild(mainBody);
    }
}

class ZettelAdd extends Oculus{
    constructor(res, resId=null, access=[], main=false){
        super(res, resId, access, main);
    }
    async load(){
        let mainBody = document.createDocumentFragment();
        mainBody.appendChild(el.closeButton(this));
        mainBody.appendChild(el.h("Neuen Zettel erstellen",3));
        let iLemma = el.text(""); iLemma.autocomplete = "off";
        await this.bindAutoComplete(iLemma, "lemma", ["id", "lemma_display"]);
        let iType = el.select(5, {5: "Ausgeschriebener Zettel", 4: "Literatur"});
        let iDateOwn = el.text("");
        let iDateOwnDisplay = el.text("");
        iType.onchange = () => {
            if(iType.value === "4"){
                divLit.style.display = "block";
                divNoLit.style.display = "none";
            } else {
                divLit.style.display = "none";
                divNoLit.style.display = "block";
            }
        }
        let tbl1 = el.table([["Lemma:", iLemma],["Zetteltyp:", iType]]);
        mainBody.appendChild(tbl1);

        let iLiteratur = el.text(""); iLiteratur.autocomplete = "off";
        let tblLit = el.table([["Literaturangabe:", iLiteratur]]);
        let divLit = document.createElement("DIV");
        divLit.style.display = "none";
        divLit.appendChild(tblLit);
        mainBody.appendChild(divLit);

        let iWork = el.text(""); iWork.autocomplete = "off";
        await this.bindAutoComplete(iWork, "work", ["id", "ac_web"]);
        if(argos.main.cTxtSelection != null){
            iWork.value = argos.main.workOpus;
            iWork.dataset.selected = argos.main.workId;
        }
        iWork.onchange = (e) => {
            setTimeout(() => {
                if(iWork.dataset.selected>0){
                    arachne.work.is(parseInt(iWork.dataset.selected))
                    .then((work) => {
                        if(work.is_maior===1){
                            divMinora.style.display = "none";
                        } else {
                            divMinora.style.display = "block";
                        }
                    })
                    .catch((e) => {throw e});
                }
            }, 500);
        }
        let iStelle = el.text(""); iStelle.autocomplete = "off";
        let tblNoLit = el.table([
            ["Zitiertitel:", iWork], ["Stellenangabe:", iStelle],
            ["Eigene Datierung <i class='minorTxt'>(Sotierung)</i>:", iDateOwn],
            ["Eigene Datierung <i class='minorTxt'>(Darstellung)</i>:", iDateOwnDisplay]
        ]);
        let divNoLit = document.createElement("DIV");
        divNoLit.appendChild(tblNoLit);

        let iStelleBib = el.text(""); iStelleBib.autocomplete = "off";
        let tblMinora = el.table([["Bibliographie (<i>minora</i>):", iStelleBib]]);
        let divMinora = document.createElement("DIV");
        divMinora.style.display = "none";
        divMinora.appendChild(tblMinora);
        divNoLit.appendChild(divMinora);
        mainBody.appendChild(divNoLit);

        let iTxt = el.area(""); iTxt.autocomplete = "off";
        if(argos.main.cTxtSelection != null){iTxt.value = argos.main.cTxtSelection}
        let tbl2 = el.table([["Text:", iTxt]]);
        mainBody.appendChild(tbl2);

        let iSubmit = el.button("erstellen");
        iSubmit.onclick = () => {
            if(iLemma.dataset.selected != undefined){
                let data = {
                    lemma_id: iLemma.dataset.selected,
                    txt: iTxt.value,
                    type: iType.value,
                    in_use: 1
                };
                if(["viewer", "full_text"].includes(argos.main.res)){
                    data.d_e = argos.main.cEditionId;
                    data.d_s = argos.main.cScanId;
                }
                if(iDateOwn.value != "" && !isNaN(parseInt(iDateOwn.value))){
                    data.date_own = iDateOwn.value;
                    data.date_own_display = iDateOwnDisplay.value;
                } else if (iDateOwn.value != ""){
                    alert("Der Eintrag für 'Eigene Datierung (Sortierung)' muss eine Ganzzahl sein. Der Eingetragene Wert konnte nicht gespeichert werden.");
                }
                if(iType.value === "4"){
                    data.literature = iLiteratur.value;
                } else {
                    data.work_id = iWork.dataset.selected;
                    data.stellenangabe = iStelle.value;
                    if(divMinora.style.display != "none"){
                        data.stellenangabe_bib = iStelleBib.value;
                    }
                }
                arachne.zettel.save(data)
                .then((z) => {
                    if(argos.main.res === "project"){
                        const articleId = parseInt(argos.main.currentArticle.dataset.article_id);
                        arachne.zettel_lnk.save({
                            zettel_id: z.id,
                            article_id: articleId
                        }).
                            then(() => arachne.zettel_lnk.bound(
                                    [articleId, "", 0, 0, 0],
                                    [(articleId+1), "?", 9999, 9999, 9999],
                                    "zettel", false
                                )).
                            then(nZettels => {
                                const setZettel = new CustomEvent("setZettel", {detail: nZettels});
                                argos.main.currentArticle.dispatchEvent(setZettel);
                            });
                    }
                    if(["viewer", "full_text"].includes(argos.main.res)){this.close()}
                    else {this.refresh()}
                })
                .catch((e) => {throw e});
            } else {alert("Kein gültiges Lemma eingetragen!")}
        }
        if(["viewer", "full_text"].includes(argos.main.res)){
            mainBody.appendChild(el.p(`
            Dieser Zettel wird einen Direktlink auf die Seite der Edition haben.
                `));
        }
        mainBody.appendChild(iSubmit);

        this.ctn.appendChild(mainBody);
    }
}

class ZettelBatch extends Oculus{
    constructor(res, resId=null, access=[], main=false){
        super(res, resId, access, main);
    }
    async load(){
        let mainBody = document.createDocumentFragment();
        mainBody.appendChild(el.closeButton(this));
        let tHeader = document.createElement("DIV");
        tHeader.classList.add("tab_header");
        tHeader.setAttribute("name", "zettel_batch");
        tHeader.appendChild(el.tab("Lemma", "zb_lemma"));
        tHeader.appendChild(el.tab("Autor/Werk", "zb_opera"));
        tHeader.appendChild(el.tab("Zettel-Typ", "zb_zTyp"));
        let tBody = document.createElement("DIV");
        tBody.classList.add("tab_content");
        tBody.setAttribute("name","zettel_batch");

        let zbLemma = el.tabContainer("zb_lemma");
        let iLemma = el.text();
        await this.bindAutoComplete(iLemma, "lemma", ["id", "lemma_display"]);
        let lemmaSubmit = el.button("übernehmen");
        lemmaSubmit.onclick = async () => {
            if(iLemma.dataset.selected == null){alert("Kein gültiges Lemma ausgewählt!")
            } else if(argos.main.selMarker.main.ids.length == 0){alert("Keine Zettel ausgewählt!")
            } else {
                document.body.style.cursor = "wait";
                for(const id of argos.main.selMarker.main.ids){
                    await arachne.zettel.save({ id: id, lemma_id: iLemma.dataset.selected});
                }
                document.body.style.cursor = "initial";
                el.status("saved");
            }
        }
        zbLemma.appendChild(el.table([["Lemma:", iLemma], ["", lemmaSubmit]]));
        tBody.appendChild(zbLemma);
        let zbOpera = el.tabContainer("zb_opera");
        let iWork = el.text();
        await this.bindAutoComplete(iWork, "work", ["id", "ac_web"]);
        let workSubmit = el.button("übernehmen");
        workSubmit.onclick = async () => {
            if(iWork.dataset.selected == null){alert("Kein gültiges Werk ausgewählt!")
            } else if(argos.main.selMarker.main.ids.length == 0){alert("Keine Zettel ausgewählt!")
            } else {
                document.body.style.cursor = "wait";
                for(const id of argos.main.selMarker.main.ids){
                    await arachne.zettel.save({ id: id, work_id: iWork.dataset.selected});
                }
                document.body.style.cursor = "initial";
                el.status("saved");
            }
        }
        zbOpera.appendChild(el.table([["Werk:", iWork], ["", workSubmit]]));
        tBody.appendChild(zbOpera);
        let zbZType = el.tabContainer("zb_zTyp");
        let iType = el.select(1, {1: "verzettelt", 2: "Exzerpt", 3: "Index", 4: "Literatur"});
        let submitType = el.button("übernehmen");
        submitType.onclick = async () => {
            if(argos.main.selMarker.main.ids.length == 0){alert("Keine Zettel ausgewählt!")}
            else {
                document.body.style.cursor = "wait";
                for(const id of argos.main.selMarker.main.ids){
                    await arachne.zettel.save({ id: id, type: iType.value});
                }
                document.body.style.cursor = "initial";
                el.status("saved");
            }
        }
        zbZType.appendChild(el.table([["Zettel-Typ:", iType], ["", submitType]]));
        tBody.appendChild(zbZType);

        if(this.access.includes("editor")){
            tHeader.appendChild(el.tab("Projekt", "zb_project"));
            let zbProject = el.tabContainer("zb_project");
            const projects = await arachne.project.is(1, "status", false);
            if(projects.length>0){
                let selData = {};
                for(const project of projects){
                    selData[project.id] = project.name;
                }
                let iProject = el.select(projects[0].id, selData);
                let submitProject = el.button("übernehmen");
                submitProject.onclick = async () => {
                    if(argos.main.selMarker.main.ids.length == 0){alert("Keine Zettel ausgewählt!")}
                    else {
                        document.body.style.cursor = "wait";
                        const defaultArticle = await arachne.article.is([parseInt(iProject.value), 0, 0], "article");
                        let zLst = [];
                        for(const id of argos.main.selMarker.main.ids){
                            zLst.push({
                                zettel_id: id,
                                article_id: defaultArticle.id
                            });
                        }
                        await arachne.zettel_lnk.save(zLst);
                        el.status("saved");
                        document.body.style.cursor = "initial";
                    }
                }
                zbProject.appendChild(el.table([["Zu Projekt hinzufügen:", iProject], ["", submitProject]]));
            } else {
                zbProject.textContent = "Keine aktiven Projekte verfügbar. Erstellen Sie ein neues Projekt im Menü 'Editor'.";
            }

            tBody.appendChild(zbProject);
        }
        mainBody.appendChild(tHeader);
        mainBody.appendChild(tBody);
        this.ctn.appendChild(mainBody);
        this.ctn.style.padding = "15px 10px 0 10px";

        this.setTabs = true;
    }
}

class ZettelDetail extends Oculus{
    constructor(res, resId=null, access=[], main=false){
        super(res, resId, access, main);
    }
    async load(){
        const user = await argos.user();
        const zettel = await arachne.zettel.is(this.resId);
        let siblings = [];
        if(zettel.sibling == 0){
            siblings = await arachne.zettel.is(this.resId, "siblings", false);
        } else if (zettel.sibling > 0){
            siblings = await arachne.zettel.is(zettel.sibling, "siblings", false);
        }
        let mainBody = document.createDocumentFragment();

        let zTypes = {0: "...", 1: "verzettelt", 2: "Exzerpt", 3: "Index", 4: "Literatur"};

        let prevRightHeader = document.createElement("DIV");
        prevRightHeader.classList.add("prev_right_header");
        let rTHeader = document.createElement("DIV");
        rTHeader.classList.add("tab_header");
        rTHeader.setAttribute("name", "prev");

        let rTContent = document.createElement("DIV");
        rTContent.classList.add("tab_content", "tab_scroll");
        rTContent.setAttribute("name", "prev");

        rTHeader.appendChild(el.tab("Übersicht", "overview"));
        let overview = el.tabContainer("overview");
        let editions = [];
        if(zettel.work_id > 0){
            editions = await arachne.edition.is(zettel.work_id, "work", false);
        }
        let editionDIV = document.createElement("DIV");
        for(const edition of editions){
            let ed = el.p("");
            let url = edition.url;
            if(edition.url==null){url = `/site/viewer/${edition.id}`}
            ed.innerHTML = `<a target="_blank" href="${url}">${edition.editor} ${edition.year}</a>`;
            editionDIV.appendChild(ed);
        }
        let dLnkDes = "";
        let dLnk = "";
        if(zettel.d_e!=null){
            dLnkDes = "Direktlink zur Edition:";
            dLnk = document.createElement("A");
            dLnk.href = `/site/viewer/${zettel.d_e}?scan=${zettel.d_s}`;
            dLnk.setAttribute("target", "_blank");
            dLnk.textContent = "Edition öffnen"
        }
        overview.appendChild(el.table([["Lemma:", html(zettel.lemma_display)],
            ["Stelle:", zettel.opus], ["Datum:", html(zettel.date_display)],
            ["Zetteltyp:", zTypes[zettel.type]], ["MLW relevant:", ""],
            ["Text:", zettel.txt], ["Edition:", editionDIV],
            //["Seitenzahl der Edition:", `${zettel.page_nr}`],
            [dLnkDes, dLnk]
        ]));
        rTContent.appendChild(overview);
        if(this.access.includes("comment")){
            rTHeader.appendChild(el.tab("Notizen", "comment"));
            let commentContainer = el.tabContainer("comment");
            const comments = await arachne.comment.is(this.resId, "zettel", false);
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
                commentContainer.appendChild(cmntBox);

            }
            let newComment = document.createElement("P");
            newComment.textContent = "Neue Notiz:";
            let newTextArea = document.createElement("TEXTAREA");
            let submitButton = el.button("speichern");
            submitButton.onclick = () => {
                if(newTextArea.value != ""){
                    arachne.comment.save({comment: newTextArea.value, zettel_id: this.resId, user_id: argos.userId})
                        .then((rTxt) => {this.refresh()});
                }
            }
            newComment.appendChild(newTextArea);
            newComment.appendChild(submitButton);
            commentContainer.appendChild(newComment);
            rTContent.appendChild(commentContainer);
        }
        if(this.access.includes("z_edit")){
            rTHeader.appendChild(el.tab("Bearbeiten", "edit"));
            let edit = el.tabContainer("edit");
            /* <td style='width: 175px;'><label>MLW relevant:</label></td> */
            let iMLW = el.select(zettel.in_use);
            let iType = el.select(zettel.type, zTypes);
            let iLemma = el.text(zettel.lemma);
            iLemma.dataset.selected = zettel.lemma_id;
            await this.bindAutoComplete(iLemma, "lemma", ["id", "lemma_display"]);
            let iWork = el.text(zettel.ac_web);
            iWork.dataset.selected = zettel.work_id;
            await this.bindAutoComplete(iWork, "work", ["id", "ac_web"]);
            let iStelle = el.text(zettel.stellenangabe);
            let iBib = el.text(zettel.stellenangabe_bib);
            let iPageNr = el.text(zettel.page_nr);
            let tbl1 = [["MLW relevant:", iMLW], ["Zetteltyp:", iType],
                ["Lemma:", iLemma], ["Zitiertitel:", iWork], ["Stellenangabe", iStelle],
                ["Angabe zur Bibliographie (minora):", iBib], ["Seitenzahl der Edition:", iPageNr]
            ];
            edit.appendChild(el.table(tbl1));
            
            edit.appendChild(el.p("opera-Liste:"));
            let preview = async (workId) => {
                if(workId == null){return el.table([["", ""]])}
                let prevWork = await arachne.work.is(workId);
                let dateDisplay = prevWork.date_display;
                if(prevWork.date_type === 9){dateDisplay += " <span style='color: var(--errorStat);'>Eigenes Datum nötig!</span>"}
                let prevEditions = document.createElement("DIV");;
                const cEditions = await arachne.edition.is(workId, "work", false);
                for(const cEdition of cEditions){
                    let ed = el.p("");
                    let url = cEdition.url;
                    if(cEdition.url==null){url = `/site/viewer/${cEdition.id}`}
                    ed.innerHTML = `<a target="_blank" href="${url}">${cEdition.editor} ${cEdition.year}</a>`;
                    prevEditions.appendChild(ed);
                }
                let tbl2 = [["Datum (opera-Liste):", dateDisplay],
                    ["Bsp. Stellenangabe", html(prevWork.citation)], ["Edition:", prevEditions]];
                /*<td style='width: 175px;'>Datum (<i>opera</i>-Liste):</td>*/
                return el.table(tbl2);
            }
            let previewBox = document.createElement("DIV");
            previewBox.appendChild(await preview(zettel.work_id));
            edit.appendChild(previewBox);
            iWork.addEventListener("change", () => {
                const eTarget = event.target;
                setTimeout(async () => {
                    previewBox.innerHTML = "";
                    previewBox.appendChild(await preview(parseInt(eTarget.dataset.selected)));
                }, 300);
            });

            let iDateOwn = el.text(zettel.date_own);
            let iDateOwnDisplay = el.text(zettel.date_own_display);
            let iTxt = el.area(zettel.txt);iTxt.autocomplete = "off";
            let iSaveNext = el.button("speichern und weiter");
            iSaveNext.onclick = () => {
                if(iLemma.value != "" && iLemma.dataset.selected == null){
                    this.newLemma = iLemma.value;
                    this.iLemmaInput = iLemma;
                    this.saveButton = iSave;
                    argos.loadEye("zettel_lemma_add");
                } else {
                    let data = {
                        id: this.resId,
                        in_use: iMLW.value,
                        type: iType.value,
                        stellenangabe: iStelle.value,
                        stellenangabe_bib: iBib.value,
                        txt: iTxt.value
                    };
                    if(iWork.dataset.selected!="null"){data.work_id = iWork.dataset.selected}
                    if(iLemma.dataset.selected!="null"){data.lemma_id = iLemma.dataset.selected}
                    if(iPageNr.value != "" && !isNaN(parseInt(iPageNr.value))){data.page_nr = iPageNr.value}
                    if(iDateOwn.value != "" && !isNaN(parseInt(iDateOwn.value))){
                        data.date_own = iDateOwn.value;
                        data.date_own_display = iDateOwnDisplay.value;
                    }
                    arachne.zettel.save(data).
                        then(() => {el.status("saved");rB5.click();}).
                        catch(e => {throw e});
                }
            }

            let iSave = el.button("speichern");
            iSave.onclick = () => {
                console.log(iLemma.value, iLemma.dataset.selected);
                if(iLemma.value != "" && iLemma.dataset.selected == null){
                    this.newLemma = iLemma.value;
                    this.iLemmaInput = iLemma;
                    this.saveButton = iSave;
                    argos.loadEye("zettel_lemma_add");
                } else {
                    let data = {
                        id: this.resId,
                        in_use: iMLW.value,
                        type: iType.value,
                        stellenangabe: iStelle.value,
                        stellenangabe_bib: iBib.value,
                        txt: iTxt.value
                    };
                    if(iWork.dataset.selected!="null"){data.work_id = iWork.dataset.selected}
                    if(iLemma.dataset.selected!="null"){data.lemma_id = iLemma.dataset.selected}
                    if(iPageNr.value != "" && !isNaN(parseInt(iPageNr.value))){data.page_nr = iPageNr.value}
                    if(iDateOwn.value != "" && !isNaN(parseInt(iDateOwn.value))){
                        data.date_own = iDateOwn.value;
                        data.date_own_display = iDateOwnDisplay.value;
                    }
                    arachne.zettel.save(data).
                        then(() => {
                            el.status("saved");
                            this.refresh();
                            /*
                            if(argos.main.res === "project"){
                                let zBox = document.querySelector(`.detail_zettel[id="${this.resId}"]`).parentNode;
                                console.log(zBox);
                                arachne.zettel_lnk.bound([parseInt(zBox.dataset.article_id), "", 0, 0, 0], [(parseInt(zBox.dataset.article_id)+1), "?", 9999, 9999, 9999], "zettel", false).
                                    then(nZettels => {
                                        console.log(nZettels);
                                        const setZettel = new CustomEvent("setZettel", {detail: nZettels});
                                        console.log(zBox);
                                        zBox.dispatchEvent(setZettel);
                                    });
                            }
                            */
                        }).
                        catch(e => {throw e});
                }
            }
            let dateOwnDes = el.span("Eigenes Sortier-datum: ");
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
            let tblOwnDate = [[dateOwnDes, iDateOwn],
                ["Eigenes Anzeigedatum", iDateOwnDisplay],
                ["Text:", iTxt], ["", iSaveNext], ["", iSave]
            ];
            edit.appendChild(el.table(tblOwnDate));
            
            if(zettel.img_path != null){
                // silbing
                edit.appendChild(document.createElement("HR"));
                edit.appendChild(el.h("Geschwister", 3));
                edit.appendChild(el.p("Soll ein neuer Geschwister-Zettel zu diesem Zettel erzeugt werden?"));
                let siblingButton = el.button("erstellen");
                siblingButton.onclick = async () => {
                    let data = {};
                    Object.assign(data, zettel);
                    delete data.id;
                    if(zettel.sibling < 1){
                        data.sibling = zettel.id;
                        await arachne.zettel.save({id: zettel.id, sibling: zettel.id});
                    }
                    arachne.zettel.save(data).then(() => {this.refresh()});
                }
                edit.appendChild(siblingButton);
            }
            
            if(argos.access.includes("admin")){
                edit.appendChild(document.createElement("HR"));
                edit.appendChild(el.h("Zettel löschen", 3));
                edit.appendChild(el.p(`Hier können Sie den Zettel aus der
                Datenbank löschen. Wenn der Zettel bereits in ein Projekt
                importiert wurde, kann es zu Fehler kommen.`));
                let deleteButton = el.button("löschen");
                deleteButton.onclick = async () => {
                    if(confirm("Zettel wirklich löschen? Der Schritt kann nicht rückgängig gemacht werden!")){
                        if(siblings.length == 0){
                            await arachne.zettel.delete(zettel.id);
                            this.close();
                        } else if(zettel.sibling != zettel.id){
                            await arachne.zettel.delete(zettel.id);
                            this.close();
                        } else {
                            alert("Der Zettel kann nicht gelöscht werden, da Geschwisterzettel mit ihm verbunden sind.");
                        }
                    }
                }
                edit.appendChild(deleteButton);
            }
            rTContent.appendChild(edit);
        }

        prevRightHeader.appendChild(rTHeader);
        mainBody.appendChild(prevRightHeader);

        let prevRight = document.createElement("DIV");
        prevRight.classList.add("prev_right");
        prevRight.appendChild(rTContent);
        mainBody.appendChild(prevRight);

        let prevFooterRight = document.createElement("DIV");
        prevFooterRight.classList.add("prev_footer_right", "minorTxt");
        let cPos = argos.main.resultLst.indexOf(this.resId)+1;
        let cToEnd = argos.main.resultLst.length-cPos;
        let rB1 = document.createElement("A"); rB1.innerHTML = "|<&nbsp;&nbsp;&nbsp;";
        rB1.onclick = () => {argos.loadEye("zettel_detail", argos.main.resultLst[0])}
        if(cPos===1){rB1.style.visibility = "hidden"}
        let rB2 = document.createElement("A"); rB2.innerHTML = "<<<&nbsp;&nbsp;&nbsp;";
        rB2.onclick = () => {argos.loadEye("zettel_detail", argos.main.resultLst[cPos-101])}
        if(cPos<101){rB2.style.visibility = "hidden"}
        let rB3 = document.createElement("A"); rB3.innerHTML = "<<&nbsp;&nbsp;&nbsp;";
        rB3.onclick = () => {argos.loadEye("zettel_detail", argos.main.resultLst[cPos-11])}
        if(cPos<11){rB3.style.visibility = "hidden"}
        let rB4 = document.createElement("A"); rB4.innerHTML = "<&nbsp;&nbsp;&nbsp;";
        rB4.onclick = () => {argos.loadEye("zettel_detail", argos.main.resultLst[cPos-2])}
        if(cPos<2){rB4.style.visibility = "hidden"}
        let rB5 = document.createElement("A"); rB5.innerHTML = "&nbsp;&nbsp;&nbsp;>";
        rB5.onclick = () => {argos.loadEye("zettel_detail", argos.main.resultLst[cPos])}
        if(cToEnd<1){rB5.style.visibility = "hidden"}
        let rB6 = document.createElement("A"); rB6.innerHTML = "&nbsp;&nbsp;&nbsp;>>";
        rB6.onclick = () => {argos.loadEye("zettel_detail", argos.main.resultLst[cPos+9])}
        if(cToEnd<10){rB6.style.visibility = "hidden"}
        let rB7 = document.createElement("A"); rB7.innerHTML = "&nbsp;&nbsp;&nbsp;>>>";
        rB7.onclick = () => {argos.loadEye("zettel_detail", argos.main.resultLst[cPos+99])}
        if(cToEnd<100){rB7.style.visibility = "hidden"}
        let rB8 = document.createElement("A"); rB8.innerHTML = "&nbsp;&nbsp;&nbsp;>|";
        rB8.onclick = () => {argos.loadEye("zettel_detail", argos.main.resultLst[argos.main.resultLst.length-1])}
        if(cToEnd<1){rB8.style.visibility = "hidden"}
        let current = `${cPos}/${argos.main.resultLst.length}`;
        prevFooterRight.appendChild(el.table([[rB1, rB2, rB3, rB4, current, rB5, rB6, rB7, rB8]]));
        mainBody.appendChild(prevFooterRight);

        // left side
        let prevLeftHeader = document.createElement("DIV");
        prevLeftHeader.classList.add("prev_left_header");
        let lTHeader = document.createElement("DIV");
        lTHeader.classList.add("tab_header");
        lTHeader.setAttribute("name", "prev_img");

        let prevLeft = document.createElement("DIV");
        prevLeft.classList.add("prev_left");
        let lTContent = document.createElement("DIV");
        lTContent.classList.add("tab_content", "tab_scroll");
        lTContent.setAttribute("name", "prev_img");
        lTContent.style.padding = "0px";
        
        if(zettel.img_path){
            lTHeader.appendChild(el.tab("Vorderseite", "recto"));
            let recto = el.tabContainer("recto");
            let img = document.createElement("DIV");
            img.classList.add("imgBox");
            img.style.backgroundImage = `url('${zettel.img_path}.jpg')`;
            img.style.transform = "scale("+argos.userDisplay.zet_zoom+")";
            recto.appendChild(img);
            let range = document.createElement("INPUT");
            range.type = "range"; range.min = "100"; range.max = "200";
            range.value = argos.userDisplay.zet_zoom*100; range.style.zIndex = "999";
            range.style.position = "fixed"; range.style.bottom = "30px"; range.style.right = "530px";
            range.onchange = () => {
                argos.userDisplay.zet_zoom = range.value/100;
                argos.setUserDisplay();
                img.style.transform = "scale("+argos.userDisplay.zet_zoom+")";
            };
            recto.appendChild(range);
            lTContent.appendChild(recto);
        }
        argos.doubleSided = true;
        if(argos.doubleSided && zettel.img_path){
            lTHeader.appendChild(el.tab("Rückseite", "verso"));
            let verso = el.tabContainer("verso");
            let img = document.createElement("DIV");
            img.classList.add("imgBox");
            img.style.backgroundImage = `url('${zettel.img_path}v.jpg')`;
            verso.appendChild(img);
            lTContent.appendChild(verso);
        }
        lTHeader.appendChild(el.tab("digital", "digital"));
        let digital = el.tabContainer("digital");
        const dZettel = {
            lemma_display: zettel.lemma_display,
            date_display: zettel.date_display,
            opus: zettel.opus,
            txt: zettel.txt
        }
        digital.appendChild(createZettel(dZettel));
        lTContent.appendChild(digital);

        if(zettel.sibling>0){
            lTHeader.appendChild(el.tab("Geschwister", "sibling"));
            let siblingTab = el.tabContainer("sibling");
            siblingTab.appendChild(el.p(`Es gibt ${siblings.length} Geschwister-Zettel:`));
            let sibTbl = [];
            for(const sib of siblings){
                let sibLnk = document.createElement("A");
                sibLnk.title = sib.id; sibLnk.id = sib.id;
                sibLnk.innerHTML = html(sib.opus);
                sibLnk.onclick = () => {
                    this.resId = sib.id;
                    this.refresh();
                }
                sibTbl.push([sibLnk]);
            }
            siblingTab.appendChild(el.table(sibTbl));
            lTContent.appendChild(siblingTab);
        }

        prevLeftHeader.appendChild(lTHeader);
        mainBody.appendChild(prevLeftHeader);
        prevLeft.appendChild(lTContent);
        mainBody.appendChild(prevLeft);
        let prevFooterLeft = document.createElement("DIV");
        prevFooterLeft.classList.add("prev_footer_left");
        prevFooterLeft.innerHTML = `<span class="minorTxt"> ID: ${zettel.id}. 
            Zuletzt geändert am ${zettel.c_date.split(" ")[0]} von ${zettel.editor}.</span>`;
        mainBody.appendChild(prevFooterLeft); 

        mainBody.appendChild(el.closeButton(this));
        this.ctn.appendChild(mainBody);
        this.setTabs = true;
    }
}
