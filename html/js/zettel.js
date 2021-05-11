import { Oculus } from "/file/js/oculus.js";
import { ContextMenu } from "/file/js/contextmenu.js";
import { html } from "/file/js/elements.js";
export { Zettel, ZettelAdd, ZettelBatch, ZettelDetail };

class Zettel extends Oculus{
    constructor(res, resId=null, access=[], main=false){
        super(res, resId, access, main);
    }
    async load(query="*"){
        this.results = await arachne.zettel.search(query, "*", "zettel", false);
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
        if(this.results.length===0){
            resultBox.classList.add("msgLabel");
            resultBox.textContent = "Keine Ergebnisse gefunden.";
        } else {
            let resultTxt = document.createElement("DIV");
            resultTxt.classList.add("minorTxt");
            resultTxt.textContent = (this.results.length === 1)
                ? "1 Resultat."
                : `${this.results.length} Resultate.`;
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
                cContext.addEntry('*', 'a', 'Neuer Zettel erstellen',
                    function(){argos.loadEye("zettel_add")});
            }
            if(this.access.includes("z_add")){
                cContext.addEntry('*', 'a', 'Zettel importieren',
                    function(){argos.loadEye("zettel_import")});
            }
            cContext.addEntry('*', 'a', 'Zettel exportieren',
                function(){argos.loadEye("zettel_export", null, argos.o["zettel"].query)});
            this.setContext = cContext.menu;
            /*
        this.resultIds = JSON.parse(this.ctn.querySelector('div#resultIds').textContent);
        

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
    contentLoadMore(zettel){
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

}

class ZettelAdd extends Oculus{
    constructor(res, resId=null, access=[], main=false){
        super(res, resId, access, main);
    }
    async load(){
        let mainBody = document.createDocumentFragment();
        mainBody.appendChild(el.closeButton(this));
        mainBody.appendChild(el.h("Neuer Zettel erstellen",3));
        let iLemma = el.text(""); iLemma.autocomplete = "off";
        this.bindAutoComplete(iLemma, "lemma", ["id", "lemma_display"]);
        let iType = el.select(5, {5: "Ausgeschriebener Zettel", 4: "Literatur"});
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
        this.bindAutoComplete(iWork, "work", ["id", "example"]);
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
        let tblNoLit = el.table([["Zitiertitel:", iWork], ["Stellenangabe:", iStelle]]);
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
                .then((r) => {this.refresh()})
                .catch((e) => {throw e});
            } else {alert("Kein gültiges Lemma eingetragen!")}
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
        this.bindAutoComplete(iLemma, "lemma", ["id", "lemma_display"]);
        let lemmaSubmit = el.button("übernehmen");
        lemmaSubmit.onclick = async () => {
            if(iLemma.dataset.selected == null){alert("Kein gültiges Lemma ausgewählt!")
            } else if(argos.main.selMarker.main.ids.length == 0){alert("Keine Zettel ausgewählt!")
            } else {
                for(const id of argos.main.selMarker.main.ids){
                    await arachne.zettel.save({ id: id, lemma_id: iLemma.dataset.selected});
                }
                el.status("saved");
            }
        }
        zbLemma.appendChild(el.table([["Lemma:", iLemma], ["", lemmaSubmit]]));
        tBody.appendChild(zbLemma);
        let zbOpera = el.tabContainer("zb_opera");
        let iWork = el.text();
        this.bindAutoComplete(iWork, "work", ["id", "example"]);
        let workSubmit = el.button("übernehmen");
        workSubmit.onclick = async () => {
            if(iWork.dataset.selected == null){alert("Kein gültiges Werk ausgewählt!")
            } else if(argos.main.selMarker.main.ids.length == 0){alert("Keine Zettel ausgewählt!")
            } else {
                for(const id of argos.main.selMarker.main.ids){
                    await arachne.zettel.save({ id: id, work_id: iWork.dataset.selected});
                }
                el.status("saved");
            }
        }
        zbOpera.appendChild(el.table([["Werk:", iWork], ["", workSubmit]]));
        tBody.appendChild(zbOpera);
        let zbZType = el.tabContainer("zb_zTyp");
        let iType = el.select(1, {1: "verzettelt", 2: "Exzerpt", 3: "Index", 4: "Literatur"});
        let submitType = el.button("übernehmen");
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
                zbProject.appendChild(el.table([["Zu Projekt hinzufügen:", iProject], ["", submitProject]]));
            } else {
                zbProject.textContent = "Keine aktiven Projekte verfügbar. Erstellen Sie ein neues Projekt im Menü 'Editor'.";
            }

            tBody.appendChild(zbProject);
        }
        mainBody.appendChild(tHeader);
        mainBody.appendChild(tBody);
        this.ctn.appendChild(mainBody);

        this.setTabs = true;
        /*
        me.ctn.querySelector("input#typeBatchSubmit").addEventListener("click", function(){
            if(argos.o["zettel"].selMarker["main"]["ids"].length == 0){alert("Keine Zettel ausgewählt!")
            } else {me.batchUpdateData(argos.o["zettel"].selMarker["main"]["ids"])}
        });
        */
    }
}
/*
    }, "zettel_batch": function(me){

        // set select of project
        var cSelect = me.ctn.querySelector("select[name=article_id]");
        cSelect.textContent = "";
        for(var project of argos.dataList["projects"].filter({"status": 1})){
            let cOption = document.createElement("OPTION");
            cOption.id = project["article_id"];
            cOption.textContent = project["name"];
            cSelect.appendChild(cOption);
        }
        if(cSelect.textContent == ""){
            let cWarning = document.createElement("DIV");
            cWarning.textContent = "Erstellen Sie zuerst ein Projekt in der Projektübersicht.";
            cWarning.style.padding = "20px 10px";
            me.ctn.querySelector(".tab_container[name=zb_project]").textContent = "";
            me.ctn.querySelector(".tab_container[name=zb_project]").appendChild(cWarning);
        } else {
            me.ctn.querySelector("input#projectBatchSubmit").addEventListener("click", function(){
                if(argos.o["zettel"].selMarker["main"]["ids"].length == 0){alert("Keine Zettel ausgewählt!")
                } else {
                var addList = [];
                for (var item of argos.o["zettel"].selMarker["main"]["ids"]){
                    addList.push({"data": {"article_id": me.ctn.querySelector("select[name=article_id] option:checked").id, "zettel_id": item}});
                }
                me._post("/batch", {"res": "zettel_lnk", "mode": "create", "items": addList}, function(){me.refresh()});
                }
            });
        }



        }, "zettel_export": function(me){
            me.ctn.querySelector("input#printZettel").addEventListener("click", function(){window.print()});

        }, "zettel_import": function(me){
            if(me.ctn.querySelector("datalist") != null){
                me.bindAutoComplete(me.ctn.querySelector("#userInput"), "user_data");
            }
            me.ctn.querySelector("input#importZettel").addEventListener("click", function(){me.createData()});
            p
    */
class ZettelDetail extends Oculus{
    constructor(res, resId=null, access=[], main=false){
        super(res, resId, access, main);
    }
    async load(){
        const zettel = await arachne.zettel.is(this.resId);
        const siblings = await arachne.zettel.is(this.resId, "siblings", false);
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
        let editions = await arachne.edition.is(zettel.work_id, "work", false);
        let editionDIV = document.createElement("DIV");
        for(const edition of editions){
            let ed = el.p("");
            let url = edition.url;
            if(edition.url==null){url = `/site/viewer/${edition.id}`}
            ed.innerHTML = `<a target="_blank" href="${url}">${edition.editor} ${edition.year}</a>`;
            editionDIV.appendChild(ed);
            /*
                    % for edition in editions:
                        <a id='edition_{{edition["id"]}}'href="{{edition["url"]}}">
                            {{edition.get("label", "")}}
                        </a><br />
                    % end
             */
        }
        overview.appendChild(el.table([["Lemma:", html(zettel.lemma_display)],
            ["Stelle:", zettel.opus], ["Datum:", html(zettel.date_display)],
            ["Zetteltyp:", zTypes[zettel.type]], ["MLW relevant:", ""],
            ["Text:", zettel.txt], ["Edition:", editionDIV],
            ["Seitenzahl der Edition:", `${zettel.page_nr}`]
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
                if(argos.userId === comment.user_id){
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
            /*
                            <td style='width: 175px;'><label>MLW relevant:</label></td>
             */
            let iMLW = el.select(zettel.in_use);
            let iType = el.select(zettel.type, zTypes);
            let iLemma = el.text(zettel.lemma);
            this.bindAutoComplete(iLemma, "lemma", ["id", "lemma_display"]);
            let iWork = el.text(zettel.example);
            this.bindAutoComplete(iWork, "work", ["id", "example"]);
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
                let prevEditions = "";
                /*
                    % for edition in editions:
                        <a id='edition_{{edition["id"]}}'href="{{edition["url"]}}">
                            {{edition.get("label", "")}}
                        </a><br />
                    % end
                 */
                let tbl2 = [["Datum (opera-Liste):", dateDisplay],
                    ["Bsp. Stellenangabe", prevWork.citation], ["Edition:", prevEditions]];
                /*<td style='width: 175px;'>Datum (<i>opera</i>-Liste):</td>*/
                return el.table(tbl2);
            }
            edit.appendChild(await preview(zettel.work_id));

            let iDateOwn = el.text(zettel.date_own);
            let iDateOwnDisplay = el.text(zettel.date_own_display);
            let iTxt = el.area(zettel.txt); iTxt.autocomplete = "off";
            let iSaveNext = el.button("speichern und weiter");
            let iSave = el.button("speichern");
            let tblOwnDate = [["Eigenes Sortierdatum", iDateOwn],
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
                deleteButton.onclick = () => {
                    if(confirm("Zettel wirklich löschen? Der Schritt kann nicht rückgängig gemacht werden!")){
                        arachne.zettel.delete(zettel.id).then(() => {this.close()});
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
        /*
            <div style='position: absolute; top: 20px; right: 20px; bottom: 20px; left:20px;'>
                % include('zettel/zettel_card_digital')
            </div>
         */
        lTContent.appendChild(digital);

        if(zettel.sibling>0){
            lTHeader.appendChild(el.tab("Geschwister", "sibling"));
            let siblingTab = el.tabContainer("sibling");
            /*
                Es gibt {{len(siblings)}} Geschwister-Zettel:
                <table>
                    % for sibling in siblings:
                        <tr>
                            <td title='{{sibling["id"]}}'>
                                <a id="{{sibling["id"]}}" class="siblingLink">{{!sibling["opus"]}}</a>
                            </td>
                        </tr>
                    % end
                </table>
             */
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
        /*
        }, "zettel_detail": function(me){
            me.setResultBrowser(me.resId, function(){me.resId=event.target.id;me.refresh()});

            // event listeners
            me.ctn.querySelector('input#opusInput_hidden').onchange = function(){
                if(this.value != 0){
                    me._getJSON("data/zettel_opus_preview?qJSON="+encodeURIComponent(JSON.stringify({"id": this.value})), function(rData){
                        me.ctn.querySelector("td#date_display").textContent = rData[0]["date_display"];
                        if(rData[0]["date_type"] == 9){
                        let warning = document.createElement("SPAN");
                        warning.textContent = "Eigenes Datum nötig!";
                        warning.style.color = "var(--errorStat)";
                        me.ctn.querySelector("td#date_display").appendChild(warning);
                        }
                        me.ctn.querySelector("td#citation").textContent = rData[0]["citation"];
                        var editions = JSON.parse(rData[0]["editions"]);
                        var editionBox = me.ctn.querySelector("td#editionEdit");
                        editionBox.textContent = "";
                        var lineBreak = document.createElement("BR");
                        for(var edition of editions){
                            let nEdition = document.createElement("A");
                            nEdition.href = edition["url"];
                            nEdition.textContent = edition["label"];
                            nEdition.id = "edition_"+edition["id"];
                            editionBox.appendChild(nEdition);
                            editionBox.appendChild(lineBreak);
                        }
                    });
                } else {
                        me.ctn.querySelector("td#date_display").textContent = "";
                        me.ctn.querySelector("td#citation").textContent = "";
                        me.ctn.querySelector("td#editionEdit").textContent = "";
                }
            }
            // set autocomplete
            me.bindAutoComplete(me.ctn.querySelector("#lemmaInput"), "lemma_data");
            me.bindAutoComplete(me.ctn.querySelector("#opusInput"), "work_data");



        }, "zettel_lemma_add": function(me){
            me.ctn.querySelector("input[name=lemma]").value = document.getElementById("zettel_detail").querySelector("input#lemmaInput").value;
            me.ctn.querySelector("input[name=lemma_display]").value = document.getElementById("zettel_detail").querySelector("input#lemmaInput").value;

            // event listeners 
            me.ctn.querySelector("input#newLemma").addEventListener("click", function(){me.createData(function(){
                me._getJSON("data/zettel_lemma?qJSON="+encodeURIComponent(JSON.stringify({"lemma": me.ctn.querySelector("input[name=lemma]").value})), function(rData){
                    document.getElementById("zettel_detail").querySelector("#lemmaInput_hidden").value = parseInt(rData[0]["id"]);
                    argos.dataList["lemma_data"].add(rData[0]);
                    document.getElementById("zettel_detail").querySelector("#lemmaInput").style.color = "inherit";
                    me.close();
                    if(document.getElementById("zettel_detail").querySelector('input#saveZettelChangesNext').dataset.clicked == "1"){
                        document.getElementById("zettel_detail").querySelector("#saveZettelChangesNext").click();
                    } else {
                        document.getElementById("zettel_detail").querySelector("#saveZettelChanges").click();
                    }
                });

            })});
        }
*/
