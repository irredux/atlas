import { Oculus } from "/file/js/oculus.js";
import { ContextMenu } from "/file/js/contextmenu.js";
import { html } from "/file/js/elements.js";
export { Lemma, LemmaComment, LemmaEdit, LemmaToProject };

class Lemma extends Oculus{
    constructor(res, resId=null, access=[], main=false){
        super(res, resId, access, main);
    }
    async load(query="*"){
        const searchFields = {
            lemma: {name: "Lemma", des: "Durchsucht alle Lemmata nach einer bestimmten Zeichenfolge."},
            comment: {name: "Kommentar", des: "Durchsucht den Kommentar zu den Lemmata."},
            id: {name: "ID", des: "Durchsucht IDs der Lemmata."}
        };
        const displayQuery = query;
        for(const field in searchFields){
            const reg = new RegExp(searchFields[field].name, "g");
            query = query.replace(reg, field);
        }
        const results = await arachne.lemma.search(query, "*", "lemma");
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
            <th style='width: 20%'>Lemmaansatz</th>
            <th style='width: 20%'>Wörterbücher</th>
            <th style='width: 40%'>Kommentar</th>
            <th style='width: 10%'>Notizen</th>
            <th style='width: 10%'>Anz. Zettel</th>
            `;
            resultTable.appendChild(lemmaTbl);
            resultBox.appendChild(resultTable);
            this.setLoadMore(lemmaTbl, results)

            this.setSelection("main", "tr.loadMore", false);

            // contextmenu
            let that = this;
            let cContext = new ContextMenu();
            if(this.access.includes("l_edit")){
                cContext.addEntry('tr.loadMore', 'a', 'Lemma bearbeiten',
                    function(){argos.loadEye("lemma_edit", that.selMarker.main.lastRow)});
                cContext.addEntry('tr.loadMore', 'a', 'Neues Lemma erstellen',
                    function(){argos.loadEye("lemma_add")});
            }
            if(this.access.includes("comment")){
                if(cContext.menu.length > 0){
                cContext.addEntry('tr.loadMore', 'hr', '', null);
                }
                cContext.addEntry('tr.loadMore', 'a', 'Notizen',
                    function(){argos.loadEye("lemma_comment", that.selMarker.main.lastRow)});
            }
            if(this.access.includes("editor")){
                if(cContext.menu.length > 0){
                cContext.addEntry('tr.loadMore', 'hr', '', null);
                }
                cContext.addEntry('tr.loadMore', 'a', 'zu Projekt hinzufügen',
                    function(){argos.loadEye("lemma_addToProject", that.selMarker.main.lastRow)});
            }
            if (Object.keys(cContext.menu).length > 0){this.setContext = cContext.menu;}
        }
        mainBody.appendChild(resultBox);
        this.ctn.appendChild(mainBody);
    }

    async contentLoadMore(values){
        let tr = document.createElement("TR");
        tr.id = values.id; tr.classList.add("loadMore");
        let commentsDisplay = "";
        let comments = await arachne.comment.is(values.id, "lemma", false);
        if(comments.length > 0){
            commentsDisplay = document.createElement("A");
            commentsDisplay.innerHTML = "☜";
            commentsDisplay.onclick = () => {
                    argos.loadEye("lemma_comment", values.id);
            }
        }

        let zettelCount = await arachne.zettel.is(values.id, "lemma", false);
        zettelCount = `${zettelCount.length}`;
        const tdContents = [values.lemma_display, values.dicts, values.comment, commentsDisplay, zettelCount];
        for(const tdContent of tdContents){
            let td = document.createElement("TD");
            if(typeof tdContent == "string"){td.innerHTML = html(tdContent)}
            else if(tdContent != null){td.appendChild(tdContent)}
            tr.appendChild(td);
        }
        return tr;
    }
}

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

class LemmaEdit extends Oculus{
    constructor(res, resId=null, access=[], main=false){
        super(res, resId, access, main);
    }
    async load(){
        let lemma = {id: null, lemma: "", lemma_display: "", dicts: "", lemma_nr: 0, comment: ""}
        if(!isNaN(this.resId)){
            lemma = await arachne.lemma.is(this.resId);
            const zettels = await arachne.zettel.is(this.resId, "lemma", false);
            lemma.zettelCount = zettels.length;
        }
        let mainBody = document.createDocumentFragment();
        mainBody.appendChild(el.closeButton(this));
        let mainHeader = document.createElement("H3");
        if(lemma.lemma == ""){mainHeader.textContent = "Neues Lemma erstellen"}
        else {mainHeader.innerHTML = `${html(lemma.lemma_display)} <i class='minorTxt'>(ID: ${lemma.id})</i>`}
        mainBody.appendChild(mainHeader);
        if(lemma.lemma!=""){
            let zCount = document.createElement("P");
            zCount.textContent = `Anzahl verknüpfter Zettel: ${lemma.zettelCount}.`;
            mainBody.appendChild(zCount);
        }
        
        let sbHelp = el.popHTMLHelp();
        sbHelp.style.top = "10px"; sbHelp.style.right = "40px"; sbHelp.style.textAlign = "right";
        mainBody.appendChild(sbHelp);
        let iLemma = el.text(lemma.lemma);
        let iLemmaDicts = el.text(lemma.dicts);
        let iLemmaDisplay = el.text(html(lemma.lemma_display));
        if(argos.main.o.zettel_detail != null){
            iLemma.value = argos.main.o.zettel_detail.newLemma;
            iLemmaDisplay.value = argos.main.o.zettel_detail.newLemma;
        }
        let iLemmaNr = el.text(lemma.lemma_nr);
        let iMLW = el.select(lemma.MLW);
        let iFragezeichen = el.select(lemma.Fragezeichen);
        let iStern = el.select(lemma.Stern);
        let iKlammerverweis = el.select(lemma.Klammerverweis);
        let iAusschluss = el.select(lemma.Ausschluss);
        let iKommentar = el.area(lemma.comment);
        let iSave = el.button("speichern");
        iSave.onclick = () => {
            if(iLemma.value!="" && iLemma.value.indexOf(" ")===-1){
                const nValues = {
                    id: lemma.id,
                    lemma: iLemma.value,
                    lemma_display: iLemmaDisplay.value,
                    dicts: iLemmaDicts.value,
                    lemma_nr: iLemmaNr.value,
                    MLW: iMLW.value,
                    Fragezeichen: iFragezeichen.value,
                    Stern: iStern.value,
                    Klammerverweis: iKlammerverweis.value,
                    Ausschluss: iAusschluss.value,
                    comment: iKommentar.value
                };
                arachne.lemma.save(nValues).then(rTxt => {
                    el.status("saved");
                    if(argos.main.o.zettel_detail != null){
                        this.close();
                        argos.main.o.zettel_detail.iLemmaInput.dataset.selected = rTxt.id;
                        argos.main.o.zettel_detail.saveButton.click();
                    }
                });
            } else {el.status("error", "Bitte ein gültiges Lemma eintragen!")}
        }
        let iDelete = el.button("löschen");
        iDelete.onclick = () => {
                    if(window.confirm("Soll das Lemma wirklich gelöscht werden? Dieser Schritt kann nicht rückgängig gemacht werden!")){
                    arachne.lemma.delete(this.resId).then(() => {this.close();argos.main.refresh()});
                    }
        }
        const tblContent = [
            ["Lemma:", iLemma, "Wörterbücher:", iLemmaDicts],
            ["Lemma-Anzeige:", iLemmaDisplay, "Zahlzeichen (bei Homonymen):", iLemmaNr],
            ["MLW <i class='minorTxt'>(wird ins Wörterbuch aufgenommen)</i>", iMLW,
                "fraglich <i class='minorTxt'>(mit ? markiert)</i>", iFragezeichen],
            ["Stern <i class='minorTxt'>(mit * markiert)</i>", iStern,
                "Klammmerverweis <i class='minorTxt'>(mit [...] markiert)</i>", iKlammerverweis],
            ["Eintrag ist auszuschließen <i class='minorTxt'>(mit [[...]]  markiert)</i>", iAusschluss, "", ""],
            ["Kommentar:", iKommentar, iSave, (lemma.zettelCount == 0) ? iDelete: ""]
        ];
        let tbl = null;
        if(this.ctn.id === "zettel_lemma_add"){
            let tblSingle = [];
            for(const tblCtn of tblContent){
                tblSingle.push([tblCtn[0], tblCtn[1]]);
                tblSingle.push([tblCtn[2], tblCtn[3]]);
            }
            tbl = el.table(tblSingle);
        }
        else{tbl = el.table(tblContent)}
        mainBody.appendChild(tbl);
        /* <td width='18%'></td> <td width='32%'></td>
        <td width='18%'></td><td width='32%'></td> */
        this.ctn.appendChild(mainBody);
    }
}

class LemmaToProject extends Oculus{
    constructor(res, resId=null, access=[], main=false){
        super(res, resId, access, main);
    }
    async load(){
        const projects = await arachne.project.is(1, "status", false);
        const zettels = await arachne.zettel.is(this.resId, "lemma", false);
        if(zettels.length === 0){alert("Keine Zettel für das Lemma verfügbar.");this.close()}
        if(projects.length === 0){alert("Keine aktiven Projekte verfügbar. Erstellen Sie ein neues Projekt im Menü 'Editor'.");this.close()}
        let mainBody = document.createDocumentFragment();
        mainBody.appendChild(el.closeButton(this));
        mainBody.appendChild(el.h("Lemma zu Projekt hinzufügen", 4));
        mainBody.appendChild(el.p("Wählen Sie ein Projekt aus, dem die Zettel hinzugefügt werden sollen."));
        let selObj = {};
        for(const project of projects){selObj[project.id] = project.name}
        let proSelect = el.select("", selObj)
        mainBody.appendChild(proSelect);
        if(zettels.length==1){mainBody.appendChild(el.p("Es wird 1 Zettel hinzugefügt."))}
        else{mainBody.appendChild(el.p(`Es werden ${zettels.length} Zettel hinzugefügt.`))}
        let submitB = el.button("hinzufügen");
        submitB.onclick = async () => {
            const article = await arachne.article.is([parseInt(proSelect.value), 0, 0], "article");
            const articleId = article.id;
            if(articleId > 0){
                document.body.style.cursor = "wait";
                for(const zettel of zettels){
                    const data = {
                        zettel_id: zettel.id,
                        article_id: articleId
                    };
                    await arachne.zettel_lnk.save(data);
                }
                document.body.style.cursor = "initial";
                el.status("saved");
                this.close();
            } else {
                alert("Ein Fehler ist aufgetreten mit dem Projekt.");
            }
        }
        mainBody.appendChild(submitB);
        this.ctn.appendChild(mainBody);
    }
}
