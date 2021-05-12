import { Oculus } from "/file/js/oculus.js";
import { ContextMenu } from "/file/js/contextmenu.js";
import { html } from "/file/js/elements.js";
export { Project, ProjectOverview };

class ProjectOverview extends Oculus{
    constructor(res, resId=null, access=[], main=false){
        super(res, resId, access, main);
    }
    async load(){
        let projects = await arachne.project.search("*");
        let mainBody = document.createDocumentFragment();
        let borderBox = document.createElement("DIV");
        borderBox.style.padding = "0 25% 0 25%";
        borderBox.appendChild(el.h("Lemmastrecken-Editor", 2));

        let tHeader = document.createElement("DIV");
        tHeader.classList.add("tab_header");
        tHeader.setAttribute("name", "project_overview");
        tHeader.style.padding = "0px 20px";
        tHeader.appendChild(el.tab("aktive Projekte", "p_active"));
        tHeader.appendChild(el.tab("Archiv", "p_archive"));
        tHeader.appendChild(el.tab("Papierkorb", "p_trash"));
        borderBox.appendChild(tHeader);

        let tBody = document.createElement("DIV");
        tBody.classList.add("tab_content");
        tBody.setAttribute("name","project_overview");
        tBody.style.backgroundColor = "var(--mainBG)";

        let pActive = el.tabContainer("p_active");
        let pArchive = el.tabContainer("p_archive");
        let pTrash = el.tabContainer("p_trash");
        for(const project of projects){
            let nProject = document.createElement("DIV");
            nProject.textContent = project.name;
            nProject.id = project.id;
            nProject.classList.add("projectItems");
            switch (project.status){
                case 1:
                    nProject.classList.add("projectActive");
                    nProject.ondblclick = () => {
                        argos.loadMain("project", project.id);
                    }
                    pActive.appendChild(nProject);
                    break;
                case 2:
                    nProject.classList.add("projectArchive");
                    pArchive.appendChild(nProject);
                    break;
                case 3:
                    nProject.classList.add("projectTrash");
                    pTrash.appendChild(nProject);
                    break;
            }
        }
        tBody.appendChild(pActive);
        tBody.appendChild(pArchive);
        tBody.appendChild(pTrash);
        borderBox.appendChild(tBody);
        mainBody.appendChild(borderBox);
        this.ctn.appendChild(mainBody);

        this.setTabs = true;

        // change name
        this.setSelection("main", "div.projectItems", false, function(){me._put("data/project/"+event.target.id, {"name": event.target.textContent})});
        //context menu
        let cContext = new ContextMenu();
        cContext.addEntry('div.projectItems', 'span', 'Projekt verschieben nach ...', null);
        cContext.addEntry('div.projectItems.projectArchive', 'a', '... aktive Projekte', function(){me._put("data/project/"+me.selMarker["main"]["lastRow"], {"status": 1}, function(){location.reload()});});
        cContext.addEntry('div.projectItems.projectTrash', 'a', '... aktive Projekte', function(){me._put("data/project/"+me.selMarker["main"]["lastRow"], {"status": 1}, function(){location.reload()});});
        cContext.addEntry('div.projectItems.projectActive', 'a', '... Archiv', function(){me._put("data/project/"+me.selMarker["main"]["lastRow"], {"status": 2}, function(){location.reload()});});
        cContext.addEntry('div.projectItems.projectTrash', 'a', '... Archiv', function(){me._put("data/project/"+me.selMarker["main"]["lastRow"], {"status": 2}, function(){location.reload()});});
        cContext.addEntry('div.projectItems.projectActive', 'a', '... Papierkorb', function(){me._put("data/project/"+me.selMarker["main"]["lastRow"], {"status": 3}, function(){location.reload()});});
        cContext.addEntry('div.projectItems.projectArchive', 'a', '... Papierkorb', function(){me._put("data/project/"+me.selMarker["main"]["lastRow"], {"status": 3}, function(){location.reload()});});
        cContext.addEntry('div.tab_container[name=p_active]', 'hr', '', null)
        cContext.addEntry('div.tab_container[name=p_active]', 'a', 'Neues Projekt erstellen', function(){
            var timeNow = getNow();
            me._post("/data/project", {"name": "Neues Projekt", "status": "1", "date_created": timeNow, "date_changed": timeNow}, function(){
                me._getJSON("/data/project", function(rData){
                    me._post("/data/article", {"name": "Unsortierte Zettel", "position": "000", "project_id": rData[0].id}, function(){
                        location.reload();
                    });
                }, {"date_created": timeNow});
            });
        });
        cContext.addEntry('div.projectItems.projectTrash', 'hr', '', null);
        cContext.addEntry('div.projectItems.projectTrash', 'a', 'Papierkorb leeren', function(){
            me.ctn.querySelectorAll(".projectTrash").forEach(function(e){
                me._getJSON("/data/article", function(rData){
                    let delList = [];
                    for(const item of rData){
                        delList.push({res_id: item.id});
                        me._getJSON("/data/zettel_lnk", function(rData){
                            let delListZettels = [];
                            for(const item of rData){
                                delListZettels.push({res_id: item.id});
                            }
                            if(delListZettels.length > 0){
                                console.log(delListZettels);
                                me._post("/batch", {"res": "zettel_lnk", "mode": "delete", "items": delListZettels}, function(){});
                            }
                        }, {"article_id": item.id});
                    }
                    if(delList.length > 0){
                        console.log(delList);
                        me._post("/batch", {"res": "article", "mode": "delete", "items": delList}, function(){});
                    }
                }, {"project_id": e.id});
                me._delete("/data/project/"+e.id, function(){location.reload()});
            });
        });
        this.setContext = cContext.menu;
    }
}

class Project extends Oculus{
    constructor(res, resId=null, access=[], main=false){
        super(res, resId, access, main);
    }
    async load(){
        let mainBody = document.createDocumentFragment();
        /*
<div id="projectId" class="argSys">{{items[0]["id"]}}</div>
<style>
    input#changeOpus{
        border: none;
        font-size: 90%;
    }
    input#changeOpus:focus{
        border: none;
    }
</style>

         */
        let mainFrame = document.createElement("DIV");
        mainFrame.classList.add("project_mainFrame");
        /*
        mainFrame.ondragstart = startDrag();
        mainFrame.ondrop = onDragDrop("drop");
        mainFrame.ondragover = onDragDrop();
        mainFrame.ondragend = stopDrag();
        */

        let detailView = document.createElement("DIV"); //me.ctn.querySelector("div.project_detail");
        detailView.classList.add("project_detail");

        let menuBox = document.createElement("DIV");
        menuBox.classList.add("project_menu_container");
        let menuProjectBox = document.createElement("DIV");
        menuProjectBox.classList.add("project_menu");
        let menuView = document.createElement("DIV");//me.ctn.querySelector("div.article_container");
        menuView.classList.add("article_container");

        // onProjectLoad
        //argos.o.project.defaultGroupId = null;
        let keyWords = new KeyWordSetter();
        let articles = await arachne.article.is(this.resId, "default", false);
        
        if(articles.length > 0){detailView.textContent = ""}
        // set max depth of article groups
        var maxDepth = {};
        for(const article of articles){
            let cDepth = (article.position.match(/\./g)||[]).length;
            let cGroup = article.position.substring(0,3);
            if(maxDepth[cGroup] != null){
                if(maxDepth[cGroup]<cDepth){maxDepth[cGroup] = cDepth}
            }else{maxDepth[cGroup] = cDepth}
        }

        //display articles
        for(const article of articles){
            let cError = [];
            let cPath = article.position.substring(0,article.position.length-4);
            let cDepth = (article.position.match(/\./g)||[]).length;
            let cMaxDepth = maxDepth[article.position.substring(0,3)];
            let cName = article.position.substring(article.position.length-3);
            var cType = keyWords.word(article.type, cDepth)+" ";
            if(article.position=="000"){
                cType = "";
                argos.o.project.defaultGroupId = article.id;
            }
            var cNumber = -1;
            if(cDepth>0){
                cNumber = document.querySelectorAll("div.artBox[data-position='"+cPath+"'] > div.artBox[data-arttype='0']").length;
            }else{
                cNumber = document.querySelectorAll("div.article_container > div.artBox[data-arttype='0']").length;
            }

            let daKeyWord = document.createElement("SPAN");
            daKeyWord.textContent = cType;
            daKeyWord.classList.add("daKeyWord");
            let daKeySign = document.createElement("SPAN");
            daKeySign.innerHTML = keyWords.sign(article.type, cNumber, cDepth, cMaxDepth)+" ";
            daKeySign.classList.add("artLvlMark");
            let cDisplayTextDetail = document.createElement("SPAN");
            cDisplayTextDetail.textContent = article.name;
            if(article.position!="000"){cDisplayTextDetail.classList.add("da_article")}
            cDisplayTextDetail.id = article.id;
            let cDisplayText = document.createElement("SPAN");
            cDisplayText.textContent = article.name;
            if(article.name.length > 20){cDisplayText.textContent=article.name.substring(0,20)+"..."}
            let cZettelCount= document.createElement("SPAN");
            cZettelCount.classList.add("artBoxZettelCount");
            if(article.zettel_count>0){cZettelCount.textContent = article.zettel_count}

            let cAppendDetail = document.createElement("DIV");
            if(article.type == 5){cAppendDetail.classList.add("isComment")}
            cAppendDetail.dataset.position = article.position;
            cAppendDetail.dataset.arttype = article.type;
            let cAppend = cAppendDetail.cloneNode(true);

            // entry for main view
            cAppendDetail.classList.add("detail_article");
            cAppendDetail.id = "da_"+article.id;
            cAppendDetail.appendChild(daKeyWord);
            cAppendDetail.appendChild(cDisplayTextDetail);
            let cParent = me.ctn.querySelector("div.detail_article[data-position='"+cPath+"']");
            if(cParent != null){cParent.appendChild(cAppendDetail)}
            else{detailView.appendChild(cAppendDetail)}

            // entry for sidebar
            let cDeleteButton = document.createElement("SPAN");
            cDeleteButton.classList.add("artBoxDelete");
            cDeleteButton.classList.add("editMode");
            cDeleteButton.classList.add("editModeOff");
            cDeleteButton.onclick=function(){
                // deleteArticle(article_id)
                if(confirm("Soll die Gruppe wirklich gelöscht werden? Alle Untergruppen und die darin befindlichen Zettel werden ebenfalls aus dem Projekt entfernt.")){
                    var cArticleList = [];
                    var cZettelList = [];
                    cArticleList.push({"res_id": event.target.parentNode.id});
                    event.target.parentNode.querySelectorAll("div.artBox").forEach(function(e){
                        cArticleList.push({"res_id": e.id});
                    });
                    document.querySelectorAll("div.detail_article#da_"+event.target.parentNode.id+" div.detail_zettel").forEach(function(e){
                        cZettelList.push({"res_id": e.dataset.lnk_id});
                    });
                    me._post("/batch", {"res": "article", "mode": "delete", "items": cArticleList}, function(){
                        me._post("/batch", {"res": "zettel_lnk", "mode": "delete", "items": cZettelList}, function(){
                            me.refresh();
                        });
                    });
                }
            }; 
            cDeleteButton.innerHTML = "&#x2715;";

            cAppend.classList.add("artBox");
            cAppend.id = article.id;
            cAppend.addEventListener("click", function(){
                let cElement = event.target;
                if(!event.target.classList.contains("artBox")){
                    cElement = event.target.closest(".artBox");
                }
                if(!cElement.classList.contains("editModeArticle")){
                scrollToArticle(cElement.id);
                }
            });
            cAppend.appendChild(daKeySign); 
            cAppend.appendChild(cDisplayText);
            cAppend.appendChild(cZettelCount);
            if(article.position!=="000"){cAppend.appendChild(cDeleteButton)}

            // check for errors or warnings
            //if(article.date_sort == null){cError.push("Keine Datierung für Stelle gefunden.")}
            if(cError.length>0){
                let cErrorSpan = document.createElement("SPAN");
                cErrorSpan.classList.add("bla");
                cErrorSpan.innerHTML = cError.join("<br />");
                cAppend.appendChild(cErrorSpan);
            }

            // create insert boxes
            let insertAfter = document.createElement("DIV");
            insertAfter.classList.add("artInsert");
            insertAfter.classList.add("editMode");
            insertAfter.classList.add("editModeOff");
            insertAfter.textContent = "hinzufügen";
            if(cPath!==""){insertAfter.dataset.position = `${cPath}.${((parseInt(cName)+1)+"").padStart(3, "0")}`}
            else{insertAfter.dataset.position = `${((parseInt(cName)+1)+"").padStart(3, "0")}`}
            if(article.position!=="000"){
                let insertChild = insertAfter.cloneNode(true);
                if(cPath!==""){insertChild.dataset.position = `${cPath}.${cName}.001`}
                else{insertChild.dataset.position = `${cName}.001`}
                insertChild.onclick=function(){
                    me._put("/data/article_position", {project_id: me.resId,
                        old_position: "", new_position: event.target.dataset.position,
                        type: 0}, function(){me.refresh()});
                }
                cAppend.appendChild(insertChild);
            }
            insertAfter.onclick=function(){
                let aType = 0;
                if(cDepth===0){aType = 1}
                me._put("/data/article_position", {project_id: me.resId,
                    old_position: "", new_position: event.target.dataset.position,
                    type: aType}, function(){me.refresh()});
            }

            // add to DOM
            cParent = me.ctn.querySelector("div.artBox[data-position='"+cPath+"']");
            if(cParent != null){cParent.appendChild(cAppend);cParent.appendChild(insertAfter)}
            else{menuView.appendChild(cAppend);menuView.appendChild(insertAfter)}
        }
        
        // load and display zettel
        let zettels = await arachne.zettel_lnk.is(0, null, false);
        //argos.o.project.resultIds = [];
        for(const zettel of zettels){
            argos.o.project.resultIds.push(zettel.id);
            let nZettel = document.createElement("DIV");
            nZettel.classList.add("detail_zettel");
            if(zettel.include_export==1){nZettel.classList.add("zettelExported")}
            nZettel.id = zettel.id;
            nZettel.dataset.lnk_id = zettel.lnk_id;
            nZettel.draggable = true;
            if(zettel.type != 4){
                let nOpus = document.createElement("INPUT");
                nOpus.classList.add("opus", "inlineText");
                nOpus.type="TEXT";
                //nOpus.setAttribute("disabled", true);
                nOpus.id = "opus";
                nOpus.dataset.zettelId = zettel.id;
                if(zettel.example_plain!=null){nOpus.value=zettel.example_plain}
                else{
                    if(zettel.include_export==1){
                        nOpus.classList.add("errMarked");
                        nOpus.title = "* Zettel wird exportiert: Eintrag ergänzen.";
                    }
                    nOpus.value = "Werk";
                    nOpus.style.fontStyle="italic";
                };
                nOpus.size = nOpus.value.length;
                let nStelle = document.createElement("SPAN");
                nStelle.classList.add("stelle");
                nStelle.id = zettel.id;
                if(zettel.stellenangabe==null||zettel.stellenangabe===""){
                    if(zettel.include_export==1){
                        nStelle.classList.add("errMarked");
                        nStelle.title = "* Zettel wird exportiert: Eintrag ergänzen.";
                    }
                    nStelle.textContent = "Stelle";
                    nStelle.style.fontStyle="italic";
                }else{nStelle.textContent=zettel.stellenangabe}
                let nExportText = document.createElement("SPAN");
                    nExportText.classList.add("exportText");
                    nExportText.id = zettel.id;
                    nExportText.dataset.lnk_id = zettel.lnk_id;
                if(zettel.display_text==null||zettel.display_text===""){
                    if(zettel.include_export==1){
                        nExportText.classList.add("errMarked");
                        nExportText.title = "* Zettel wird exportiert: Eintrag ergänzen.";
                    }
                    nExportText.textContent = "...";
                    nExportText.style.fontStyle="italic";
                }else{nExportText.textContent=zettel.display_text}
                nZettel.appendChild(newEl("&lowast; "));
                nZettel.appendChild(nOpus);
                nZettel.appendChild(newEl("; "));
                nZettel.appendChild(nStelle);
                nZettel.appendChild(newEl(" &ldquo;"));
                nZettel.appendChild(nExportText);
                nZettel.appendChild(newEl(" &rdquo;"));
                me.bindAutoComplete(nOpus, "work_data");
            } else {
                nZettel.innerHTML = `&lowast; <i>Literaturzettel</i>`;
            }
            nZettel.addEventListener("click", function(){
                let cEvent = event.target.closest("div.detail_zettel");
                if(argos.o.project.o["project_zettel_preview"]!=null){
                    argos.o.project.o["project_zettel_preview"].close();
                }
                argos.load("project_zettel_preview", cEvent.id)
            });
            let cParent = me.ctn.querySelector("div.detail_article[data-position='"+zettel.position+"']");
            if(cParent != null){cParent.appendChild(nZettel)}
            else{detailView.appendChild(nZettel)}

        }

        // CHECK FOR ERRORS HERE: NO DATE_SORT; TOO MANY ACTIVE ELEMENTS ETC.
        // check if there are zettels in the project, if not display warning.
        // set selection etc.
        /*
        this.setSelection("main", "div.detail_zettel", true);
        this.setSelection("opus", "input.opus", false, function(){
            const hiddenId = me.ctn.querySelector("#opus_hidden").value;
            const zettelId = event.target.dataset.zettelId;
            if(hiddenId > 0){
                me._put("data/zettel/"+zettelId, {"work_id": hiddenId}, function(){me.refresh()});
            }else{me.refresh() }
        });
        this.setSelection("article", "span.da_article", false, function(){
            saveArticleName(event.target.textContent, event.target.id);
        });
        this.setSelection("stelle", "span.stelle", false, function(){
            me._put("data/zettel/"+event.target.id, {"stellenangabe": event.target.textContent}, function(){me.refresh()});
        });
        this.setSelection("exportText", "span.exportText", false, function(){
            me._put("data/zettel_lnk/"+event.target.dataset.lnk_id, {"display_text": event.target.textContent}, function(){me.refresh()});
        });
        */
        
        /*
        if(document.querySelector("div.detail_article[data-position='000'] > div.detail_zettel") == null){
            document.querySelector("div.detail_article[data-position='000']").remove();
            document.querySelector("div.artBox[data-position='000']").remove();
            if(rData.length == 0){
                let cWarning = document.createElement("DIV");
                cWarning.classList.add("msgLabel");
                cWarning.style.padding = "80px";
                cWarning.textContent = "Um mit der Arbeit zu beginnen, fügen Sie dem Projekt Zettel hinzu! Z.B. aus der Zettel-Datenbank.";
                document.querySelector("div.project_detail").appendChild(cWarning);
            }
        }
        */

        document.body.addEventListener("dragstart", startDrag);
        document.body.addEventListener("dragend", stopDrag);
        document.body.addEventListener("dragend", stopDrag);
        document.body.addEventListener("dragover", function(){onDragDrop("over")});
        document.body.addEventListener("drop", function(){onDragDrop("drop")});
        const rule = new Rules();
        //rule.check(this.ctn);
        // end of  onProjectLoad()

        mainFrame.appendChild(detailView);
        menuProjectBox.appendChild(menuView);
        menuBox.appendChild(menuProjectBox);
        mainFrame.appendChild(menuBox);
        mainBody.appendChild(mainFrame);
        this.ctn.appendChild(mainBody);
        //
        /*
            // start external onload function
            // context menu
            var cContext = new ContextMenu();
            cContext.addEntry('div.detail_zettel', 'a', 'Detailansicht', function(){argos.load("zettel_detail", me.selMarker["main"]["lastRow"])});
            cContext.addEntry('div.detail_zettel', 'hr', '', null);
            cContext.addEntry('div.detail_zettel:not(.zettelExported)', 'a', 'In Export aufnehmen', function(){includeInExport(me)});
            cContext.addEntry('div.detail_zettel.zettelExported', 'a', 'Aus Export entfernen', function(){includeInExport(me)});
            cContext.addEntry('div.detail_zettel', 'a', 'Zettel aus dem Projekt entfernen', function(){
                if(confirm("Soll der Zettel wirklich aus dem Projekt entfernt werden? Der Zettel bleibt allerdings in der Zettel-Datenbank erhalten.")){
                    let cLnkId = me.ctn.querySelector("div.detail_zettel[id='"+me.selMarker["main"]["lastRow"]+"']").dataset.lnk_id;
                    me._delete("/data/zettel_lnk/"+cLnkId, function(){me.refresh()});
                }
            });
            cContext.addEntry('div.detail_zettel', 'a', 'Neuer Zettel erstellen', function(){argos.load("zettel_add")});
            cContext.addEntry('div.detail_zettel', 'hr', '', null);
            cContext.addEntry('*', 'a', 'Artikelstruktur bearbeiten', function(){editArticleStructure(me)});
            cContext.addEntry('*', 'hr', '', null);
            cContext.addEntry('*', 'a', 'Projekt exportieren', function(){argos.load("project_export", me.resId)});

            me.setContext = cContext.menu;
         */
    }

}

class Rules{
    // defines the way articles and zettel can be grouped
    constructor(){
        this.book = [
            {
                subject: ".detail_zettel",
                object: "[data-arttype=\"1\"]",
                domain: "parent",
                minCount: 0, maxCount: 0,
                errorMsg: "Zettel dürfen nicht abhängig sein von Lemmata!"
            },
            {
                subject: ".detail_zettel",
                object: "[data-arttype=\"0\"]",
                domain: "sibling",
                minCount: 0, maxCount: 0,
                errorMsg: "Zettel dürfen nicht neben Bedeutungsgruppen stehen."
            },
            {
                subject: ".zettelExported",
                object: ".zettelExported",
                domain: "sibling",
                minCount: 0, maxCount: 3,
                errorMsg: "Eine Bedeutungsgruppe soll nicht mehr als drei aktive Stellen haben."
            },
            {
                subject: "[data-arttype=\"1\"]",
                object: ".artBox",
                domain: "parent",
                minCount: 0, maxCount: 0,
                errorMsg: "Ein Lemma muss sich immer auf der Grundebene befinden."
            },
            {
                subject: "[data-arttype=\"0\"]",
                object: ".article_container",
                domain: "parent",
                minCount: 0, maxCount: 0,
                errorMsg: "Eine Bedeutungsgruppe darf sich nicht auf der Grundebene befinden."
            },
            {
                subject: "[data-arttype=\"2\"]",
                object: ":not([data-arttype=\"0\"])",
                domain: "parent",
                minCount: 0, maxCount: 0,
                errorMsg: "Ein Anhänger muss von einer Bedeutungsgruppe abhängen."
            },
            {
                subject: "[data-arttype=\"2\"]",
                object: "[data-arttype=\"0\"]",
                domain: "sibling",
                minCount: 0, maxCount: 0,
                errorMsg: "Ein Anhänger darf nicht neben Bedeutungsgruppen stehen."
            }
        ];
    }
    check(ctn){
        // checks the rules given; marks object with error class
        for(let page of this.book){
            let subjects = ctn.querySelectorAll(page.subject);
            for(let subject of subjects){
                if(subject!=null){
                    let object=null;
                    let length = 0;
                    switch(page.domain){
                        case "sibling":
                            object = subject.parentNode.querySelectorAll(page.object);
                            if(object!=null){length=object.length}
                            break;
                        case "parent":
                            object = subject.parentNode;
                            if(object.matches(page.object)){length=1}
                            else{object=null}
                            break;
                        case "children":
                            object = subject.querySelectorAll(page.object);
                            if(object!=null){length=object.length}
                            break;
                    }
                    if(length<page.minCount || length > page.maxCount){
                        subject.classList.add("errMarked");
                        if(`${subject.title}` == ""){subject.title = `* ${page.errorMsg}`}
                        else{subject.title += `\n* ${page.errorMsg}`}
                    }
                }
            }
        }
    }
}

class KeyWordSetter{
    constructor(){
        this.keyWords = [
            ["BEDEUTUNG", 0, ""],
            ["LEMMA", 1, "&#10148;"],
            ["ANHÄNGER", 2, "&#10149;"],
            ["SUB_LEMMA", 3, ""],
            ["VERWEISE", 4, ""],
            ["//", 5, "//"]
        ];
        this.numbers = [];
        this.numbers.push(['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X',
            'XI', 'XII', 'XIII', 'XIV', 'XV', 'XVI', 'XVII', 'XVIII', 'XIX', 'XX',
            'XXI', 'XXII', 'XXIII', 'XXIV', 'XXV', 'XXVI']);
        this.numbers.push(['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L',
            'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']);
        this.numbers.push(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11',
            '12','13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23',
            '24', '25', '26']);
        this.numbers.push(['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l',
            'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']);
        this.numbers.push(['α', 'β', 'γ', 'δ', 'ε', 'ζ', 'η', 'θ', 'ι', 'κ', 'λ', 'μ',
            'ν', 'ξ', 'ο', 'π', 'ρ', 'σ', 'τ', 'υ', 'φ', 'χ', 'ψ', 'ω']);
    }
    sign(aType, number=0, depth=0, maxDepth=0){
        if(aType!=0){
            for(var word of this.keyWords){if(word[1]==aType){return word[2]}}
            return "";
        }else{
            // numbers
            if(depth < 0){
                return "";
            } else if(depth > this.numbers.length){
                const errMsg = `* Eine Bedeutungsgruppe darf max. auf der ${this.numbers.length}. Unterebene sein`;
                return "<span title='"+errMsg+"' class='errMarked'>...</span>"
            } else {
                if(maxDepth<4){return this.numbers[depth+1][number]}
                else {return this.numbers[depth-1][number]}
            }
        }
    }
    word(aType,depth=0){    
        var rWord = "UNBEKANNT";
        for(var word of this.keyWords){
            if(word[1]==aType){rWord=word[0];break}
        }
        if(aType==0){
            if(depth==1){rWord="BEDEUTUNG"}
            else if(depth==2){rWord="UNTER_BEDEUTUNG"}
            else if(depth>2){rWord="U".repeat(depth-1)+"_BEDEUTUNG"}
        }
        return rWord;
    }
}

// ****************************************************
// -II- asorted functions
// ****************************************************
function includeInExport(me){
    let cObj = me.ctn.querySelector("div.detail_zettel[id='"+me.selMarker["main"]["lastRow"]+"']");
    let cLnkId = cObj.dataset.lnk_id;
    let includeExport = 1;
    if(cObj.classList.contains("zettelExported")){includeExport=0}
    me._put("data/zettel_lnk/"+cLnkId, {"include_export": includeExport}, function(){me.refresh()});
}
function editArticleStructure(me){
    let editMode = false;
    if(me.ctn.querySelector(".editModeArticle") === null){editMode = true};
    me.ctn.querySelectorAll(".editMode").forEach(function(e){e.classList.toggle("editModeOff")});
    me.ctn.querySelectorAll(".artBox").forEach(function(e){
        e.classList.toggle("editModeArticle");
        e.setAttribute("draggable", editMode);
    });
    me.ctn.querySelectorAll(".detail_zettel").forEach(function(e){
        e.setAttribute("draggable", !editMode);
    });
}
function newEl(elText, elType = "SPAN"){
    let newElement = document.createElement(elType);
    newElement.innerHTML = elText;
    return newElement;
}

function scrollToArticle(articleId){
    var cElement = document.querySelector("div.detail_article#da_"+articleId);
    cElement.scrollIntoView();
    cElement.classList.add("selected");
    setTimeout(function(){cElement.classList.remove("selected")}, 500);
}

function saveArticleName(artName, artId){
    let cData = {};
    artName = artName.trim();
    cData.name = artName;
    if (artName.startsWith('LEMMA ')){
        cData.name = artName.substring(6);
        cData.type = 1;
    } else if (artName.startsWith('BEDEUTUNG ')){
        cData.name = artName.substring(10);
        cData.type = 0;
    } else if (artName.startsWith('ANHÄNGER ')){
        cData.name = artName.substring(9);
        cData.type = 2;
    } else if (artName.startsWith('SUB_LEMMA ')){
        cData.name = artName.substring(10);
        cData.type = 3;
    } else if (artName.startsWith('VERWEISE ')){
        cData.name = artName.substring(9);
        cData.type = 4;
    } else if (artName.startsWith('// ')){
        cData.name = artName.substring(3);
        cData.type = 5;
    }
    argos.o["project"]._put("data/article/"+artId, cData, function(){argos.o["project"].refresh()});
}

// ####################################################
// -III- drag and drop
// ####################################################
function startDrag(){
    argos.localDataTransfer = {}; // for local storage of drag values.
    if (event.target.classList.contains("artBox")){
        // start dragging articles
        event.dataTransfer.setData("article", event.target.id);
        argos.localDataTransfer["id"] = event.target.id;
        argos.localDataTransfer["type"] = "article";
        argos.localDataTransfer["position"] = event.target.dataset.position;
        document.querySelectorAll(".artInsert").forEach(function(e){
            e.textContent = "verschieben";
        });
        event.target.classList.add("artBoxDragged");
        event.target.childNodes.forEach(function(e, j){
            if(j!==1||e.tagName==="DIV"){e.style.visibility = "hidden"}
        });
    } else if (event.target.classList.contains("detail_zettel")){
        // start dragging zettel
        argos.localDataTransfer["type"] = "zettel";
        event.dataTransfer.setData("lnkId", event.target.dataset.lnk_id);
    }
}

function stopDrag(){
    if (argos.localDataTransfer.type === "zettel"){
        document.querySelectorAll(".dragOverArticle").forEach(function(e){
            e.classList.remove("dragOverArticle");
        });
    }else if(argos.localDataTransfer.type === "article"){
        document.querySelectorAll(".artInsert").forEach(function(e){
            e.textContent = "hinzufügen";
            e.style.visibility = "visible";
        });
        let cDragged = document.querySelector(".artBoxDragged");
        cDragged.classList.remove("artBoxDragged");
        cDragged.childNodes.forEach(function(e){
            e.style.visibility = "visible";
        });
    }
    argos.localDataTransfer = {}; // for local storage of drag values.
}

function onDragDrop(mode = "over"){
    event.preventDefault();
    // reset display 
    document.querySelectorAll(".dragOverArticle").forEach(function(e){
        e.classList.remove("dragOverArticle");
    });

    if(argos.localDataTransfer.type === "zettel"){
        let cTarget = null;
        if(event.target.classList.contains("artBox")){
            cTarget = event.target;
        }else if(event.target.parentNode.classList.contains("artBox")){
            cTarget = event.target.parentNode;
        }
        if(cTarget !== null){
            if(mode === "over"){
                cTarget.classList.add("dragOverArticle");
            }else{
                // drop
                argos.localDataTransfer = {};
                let updateList = [];
                const articleId = cTarget.id;
                for(let cZettelId of argos.o.project.selMarker.main.ids){
                    updateList.push({res_id: document.querySelector(`.detail_zettel[id="${cZettelId}"`).dataset.lnk_id,
                        data: {article_id: articleId}
                    });
                }
                argos.o.project._post("/batch",{res: "zettel_lnk", mode: "update",
                    items: updateList}, function(){argos.o.project.refresh()});
            }
        }
    }else if(argos.localDataTransfer.type === "article"){
        let cTarget = null;
        if(event.target.classList.contains("artInsert")){
            cTarget = event.target;
        }else if(event.target.parentNode.classList.contains("artInsert")){
            cTarget = event.target.parentNode;
        }
        if(cTarget !== null && cTarget.id!==argos.localDataTransfer.id){
            if(mode === "over"){
                cTarget.classList.add("dragOverArticle");
            }else{
                let oldPosition = argos.localDataTransfer.position;
                argos.localDataTransfer = {};
                let me = argos.o.project;
                me._put("/data/article_position", {project_id: me.resId,
                    old_position: oldPosition,
                    new_position: event.target.dataset.position}, function(){
                        me.refresh();
                    });
            }
        }
    }
}


/*
        }, "project_export": function(me){
        }, "project_zettel_preview": function(me){
            me.ctn.querySelectorAll("div.projectMenuButton").forEach(function(e){
                if(argos.o["project"].zettelPreviewId==e.parentNode.id){
                    e.parentNode.querySelector("div.projectMenuContent").style.display = "block";
                }
                e.addEventListener("click", function(){
                    let currentActive = null;
                    me.ctn.querySelectorAll("div.projectMenuContent").forEach(function(f){
                        if(f.style.display != "block" && f.parentNode.id == event.target.parentNode.id){
                            f.style.display = "block";
                            argos.o["project"].zettelPreviewId = event.target.parentNode.id;
                        } else if(f.style.display == "block"){
                            f.style.display = "none";
                            argos.o["project"].zettelPreviewId = null;
                        }
                    });
                });
            });
            // set event listener to create and delete comments
            me.ctn.querySelector('input#newComment').addEventListener('click', function(){me.createData()});
            me.ctn.querySelectorAll('i.deleteEntry').forEach(function(e){
                e.addEventListener("click", function(){me.deleteData(function(){me.refresh();})});
            });
*/
/*
function openProjectMenuEntry(){
    $('div.projectMenuContent').hide();
    let cProjectMenuEntry = $(event.target).parent('div.projectMenuEntry');
    if (typeof cEntryId !== 'undefined' && cEntryId == cProjectMenuEntry.attr('id')){
        cEntryId = null;
    } else {
        cEntryId = cProjectMenuEntry.attr('id');
        cProjectMenuEntry.find('div.projectMenuContent').show();
    };
};
$(document).ready(function(){
     if zettel.get('img_path'):
        $('img#projectMenuImg').css('width', userDisplay['z_width']);
     else:
        $('.projectMenuDigitalImg').load('/zettel_loadmore_digital/{zettel['id']}');
        $('div.projectMenuEntry#zettel').find('.projectMenuContent')
            .css('width', userDisplay.z_width)
            .css('height', userDisplay.z_width*0.71);
    end

    if (typeof cEntryId !== 'undefined'){
        $('div.projectMenuEntry#'+cEntryId).find('div.projectMenuContent').show();
    };
});
*/
