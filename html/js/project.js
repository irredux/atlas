import { Oculus } from "/file/js/oculus.js";
import { ContextMenu } from "/file/js/contextmenu.js";
import { html } from "/file/js/elements.js";
export { Project, ProjectOverview, ProjectZettelPreview };

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
        this.setSelection("main", "div.projectItems", false, () => {
            arachne.project.save({id: event.target.id, name: html(event.target.textContent)});
        });
        //context menu
        let cContext = new ContextMenu();
        cContext.addEntry('div.projectItems', 'span', 'Projekt verschieben nach ...', null);
        cContext.addEntry('div.projectItems.projectArchive', 'a', '... aktive Projekte', () => {
            arachne.project.save({id: this.selMarker.main.lastRow, status: 1}).
                then(() => {this.refresh()})});
        cContext.addEntry('div.projectItems.projectTrash', 'a', '... aktive Projekte', () => {
            arachne.project.save({id: this.selMarker.main.lastRow, status: 1}).
                then(() => {this.refresh()})});
        cContext.addEntry('div.projectItems.projectActive', 'a', '... Archiv', () => {
            arachne.project.save({id: this.selMarker.main.lastRow, status: 2}).
                then(() => {this.refresh()})});
        cContext.addEntry('div.projectItems.projectTrash', 'a', '... Archiv', () => {
            arachne.project.save({id: this.selMarker.main.lastRow, status: 2}).
                then(() => {this.refresh()})});
        cContext.addEntry('div.projectItems.projectActive', 'a', '... Papierkorb', () => {
            arachne.project.save({id: this.selMarker.main.lastRow, status: 3}).
                then(() => {this.refresh()})});
        cContext.addEntry('div.projectItems.projectArchive', 'a', '... Papierkorb', () => {
            arachne.project.save({id: this.selMarker.main.lastRow, status: 3}).
                then(() => {this.refresh()})});
        cContext.addEntry('div.tab_container[name=p_active]', 'hr', '', null)
        cContext.addEntry('div.tab_container[name=p_active]', 'a', 'Neues Projekt erstellen', () => {
            arachne.project.save({"name": "Neues Projekt", "status": 1}).
                then(project => arachne.article.save({
                    project_id: project.id,
                    position: "000",
                    name: "Unsortierte Zettel"
                })).
                then(() => {this.refresh()}).
                catch(e => {throw e});
        });
        cContext.addEntry('div.projectItems.projectTrash', 'hr', '', null);
        cContext.addEntry('div.projectItems.projectTrash', 'a', 'Papierkorb leeren', async () => {
            const projects = await arachne.project.is(3, "status", false);
            if(projects.length > 0 && confirm("Papierkorb wirklich leeren? Dieser Schritt kann nicht rückgängig gemacht werden.")){
                for(const project of projects){
                    const articles = await arachne.article.is(project.id, "project", false);
                    for(const article of articles){
                        const zettelLnks = await arachne.zettel_lnk.is(article.id, "article", false);
                        for(const zettelLnk of zettelLnks){await arachne.zettel_lnk.delete(zettelLnk.id)}
                        await arachne.article.delete(article.id);
                    }
                    await arachne.project.delete(project.id);
                }
                this.refresh();
            }
        });
        this.setContext = cContext.menu;
    }
}

class Project extends Oculus{
    constructor(res, resId=null, access=[], main=false){
        super(res, resId, access, main);
        this.editMode = false;
    }
    async load(){
        this.currentDrag = null;
        /*
        window.onerror = (e) => {
            alert("Ein Fehler ist aufgetreten! Änderungen werden vielleicht nicht gespeichert. Laden Sie die Seite neu.\n\n"+e);
        }
        */
        let mainBody = document.createDocumentFragment();
        const cache = localStorage.getItem(`p_${this.resId}`);
        if(cache != null && 1 == 0){
        //if(cache != null && confirm("Soll die Seite aus dem Cache geladen werden?")){
            this.ctn.innerHTML = cache;
            console.log("aus dem Cache!");
        } else {
            let detailBox = document.createElement("DIV");
            let menuBox = document.createElement("DIV");
            menuBox.classList.add("project_menu_container");
            detailBox.classList.add("project_detail");
            const articles = await arachne.article.bound([this.resId, 0, 0], [this.resId, 99999999, 9999999], "article", false);
            const keyWords = new KeyWordSetter();
            
            let getSubs = (parentId, parentDepth) => {
                const subs = articles.filter(i => i.parent_id === parentId)

                let re = [];
                let cDepth = subs.length > 0?parentDepth+1:parentDepth;
                let cMaxDepth = cDepth;
                for(const sub of subs){
                    sub.depth = cDepth;
                    const [sSubs, maxDepth] = getSubs(sub.id, sub.depth);
                    if(maxDepth > cMaxDepth) cMaxDepth=maxDepth;
                    re.push(sub);
                    re = re.concat(sSubs);
                }
                return [re, cMaxDepth];
            }
            let projects = [];
            const tops = articles.filter(i => i.parent_id === 0);
            for(let top of tops){
                top.depth = 1;
                const [subs, maxDepth] = getSubs(top.id, top.depth);
                top.maxDepth = maxDepth;
                projects.push(top);
                projects = projects.concat(subs);
            }

            /* ********************************** */
            let designArticle = async (article) => {
                let mArt = document.createDocumentFragment();
                const zettels = await arachne.zettel_lnk.bound([article.id, "", 0, 0, 0], [(article.id+1), "?", 9999, 9999, 9999], "zettel", false);
                if(zettels.length === 0 && article.parent_id === 0 && article.sort_nr === 0){
                    // empty "unsortierte Zettel"
                    return [null, null];
                }
                // article in menu view
                let mBox = document.createElement("DIV");
                mBox.id = "m_"+article.id;
                mBox.classList.add("mBox");
                mBox.setAttribute("draggable", this.editMode);
                if(this.editMode){mBox.classList.add("editModeArticle")}
                mBox.dataset.sort_nr = article.sort_nr;
                mBox.dataset.parent_id = article.parent_id;
                mBox.style.padding = "0 0 5px 10px";
                mBox.ondragstart = (e) => {
                    e.stopPropagation();
                    mBox.querySelectorAll(".artInsert").forEach((e) => {
                        e.style.visibility = "hidden";
                    });
                    this.currentDragMBox = mBox;
                    this.currentDragMBoxAfter = mBoxAfter;
                    this.currentDragDBox = dBox;
                    this.currentDragZettel = null;
                }
                mBox.ondragend = (e) => {
                    e.stopPropagation();
                    mBox.querySelectorAll(".artInsert").forEach((e) => {
                        e.style.visibility = "visible";
                    });
                    this.currentDragMBox = null;
                    this.currentDragMBoxAfter = null;
                    this.currentDragDBox = null;
                    this.currentDragZettel = null;
                }
                let mBoxText = document.createElement("DIV");
                mBoxText.onclick = (e) => {
                    e.stopPropagation();
                    dBox.scrollIntoView();
                    dBox.classList.add("selected");
                    setTimeout(() => {dBox.classList.remove("selected")}, 500);
                }
                mBoxText.ondragenter = (e) => {return false;}
                mBoxText.ondragover = (e) => {
                    event.target.style.textShadow = "0 0 3px var(--mainColor)";
                    //event.target.style.color = "red";
                    return false;
                }
                mBoxText.ondragleave = (e) => {
                    e.stopPropagation();
                    try{
                    event.target.style.textShadow = "none";
                    //event.target.style.color = "initial";
                    }
                    catch{}
                }
                mBoxText.ondrop = async (e) => {
                    e.stopPropagation();
                    mBoxText.style.textShadow = "none";
                    let sourceElements = {};
                    if(this.currentDragZettel!=null){
                        for(const cId of this.selMarker.main.ids){
                            let cZettelElement = document.querySelector(`.detail_zettel[id='${cId}']`);
                            await arachne.zettel_lnk.save({
                                id: cZettelElement.dataset.lnk_id,
                                article_id: mBoxText.parentNode.id.substring(2)
                            });
                            const nArtId = cZettelElement.parentNode.dataset.article_id;
                            if(!(nArtId in sourceElements)){
                                sourceElements[nArtId] = cZettelElement.parentNode;
                            }
                        }
                        // recalculate sourceZettelBoxes
                            for(const el in sourceElements){
                                const nZettels = await arachne.zettel_lnk.bound([parseInt(el), "", 0, 0, 0], [(parseInt(el)+1), "?", 9999, 9999, 9999], "zettel", false);
                                const setZettel = new CustomEvent("setZettel", {detail: nZettels});
                                sourceElements[el].dispatchEvent(setZettel);
                                let nMBoxText = document.getElementById("m_"+el).children[0];
                                if(nZettels.length > 0){nMBoxText.children[2].textContent = nZettels.length}
                                else {nMBoxText.children[2].textContent = ""}
                            }
                        // recalculate targetZettelBox 
                        let nArtId = parseInt(dBoxZettel.dataset.article_id);
                        console.log("dBoxID", nArtId);
                        const nZettels = await arachne.zettel_lnk.bound([nArtId, "", 0, 0, 0], [(nArtId+1), "?", 9999, 9999, 9999], "zettel", false);
                        const setZettel = new CustomEvent("setZettel", {detail: nZettels});
                        dBoxZettel.dispatchEvent(setZettel);
                        if(nZettels.length > 0){mBoxText.children[2].textContent = nZettels.length}
                        else {mBoxText.children[2].textContent = ""}
                        this.selMarker.main.ids = [];
                        this.selMarker.main.lastRow = null;
                    }
                }
                mBoxText.innerHTML = html(`
                        <span class="artLvlMark"></span>
                        <span>${article.name.substring(0, 20)}${article.name.length>20?"...":""}</span>
                        <span class="artBoxZettelCount">${zettels.length>0?zettels.length:""}</i>
                    `);
                let mBoxDelete = document.createElement("SPAN");
                mBoxDelete.classList.add("artBoxDelete", "editMode");
                if(!this.editMode){mBoxDelete.classList.add("editModeOff")}
                mBoxDelete.style.marginRight = "20px";
                mBoxDelete.innerHTML = "&#x2715;";
                mBoxDelete.onclick= async () => {
                    if(confirm("Soll die Gruppe wirklich gelöscht werden? Alle Untergruppen und die darin befindlichen Zettel werden ebenfalls aus dem Projekt entfernt.")){
                        let aLst = [article.id];
                        let zLst = [];
                        mBox.querySelectorAll(".mBox").forEach((e) => {
                            aLst.push(parseInt(e.id.substring(2)));
                        });
                        dBox.querySelectorAll(".detail_zettel").forEach((e) => {
                            zLst.push(parseInt(e.dataset.lnk_id));
                        });
                        for(const a of aLst){await arachne.article.delete(a)}
                        for(const z of zLst){await arachne.zettel_lnk.delete(z)}
                        mBox.remove();
                        mBoxAfter.remove();
                        dBox.remove();
                    }
                } 
                mBoxText.appendChild(mBoxDelete);
                mBox.appendChild(mBoxText);
                let mBoxInsert = document.createElement("DIV");
                mBoxInsert.classList.add("artInsert", "editMode");
                if(!this.editMode){mBoxInsert.classList.add("editModeOff")}
                mBoxInsert.textContent = "hinzufügen";
                mBoxInsert.onclick = async () => {
                    let nArticle = await arachne.article.save({
                        project_id: article.project_id,
                        name: "Neue Gruppe",
                        type: 0,
                        sort_nr: 1,
                        parent_id: article.id
                    });
                    const [mArt, dArt] = await designArticle(nArticle);
                    mBoxChildren.prepend(mArt);
                    dBoxChildren.prepend(dArt);
                    this.resetSortNr();
                }
                mBoxInsert.ondragenter = (e) => {return false;}
                mBoxInsert.ondragover = (e) => {
                    event.target.classList.add("dragOverArticle");
                    event.target.textContent = "verschieben";
                    return false;
                }
                mBoxInsert.ondragleave = (e) => {
                    try{
                        event.target.classList.remove("dragOverArticle");
                        event.target.textContent = "hinzufügen";
                    }
                    catch{}
                }
                mBoxInsert.ondrop = async (e) => {
                    if(this.currentDragMBox != null){
                        this.currentDragMBox.dataset.sort_nr = 1;
                        mBoxChildren.prepend(this.currentDragMBoxAfter);
                        mBoxChildren.prepend(this.currentDragMBox);
                        dBoxChildren.prepend(this.currentDragDBox);
                        await arachne.article.save({
                            id: this.currentDragMBox.id.substring(2),
                            sort_nr: 1,
                            parent_id: mBox.id.substring(2)
                        });
                    }
                    this.resetSortNr();
                }
                mBox.appendChild(mBoxInsert);
                let mBoxChildren = document.createElement("DIV");
                mBox.appendChild(mBoxChildren);

                let mBoxAfter = document.createElement("DIV");
                mBoxAfter.classList.add("artInsert", "editMode");
                if(!this.editMode){mBoxAfter.classList.add("editModeOff")}
                mBoxAfter.textContent = "hinzufügen";
                mBoxAfter.onclick = async () => {
                    let nArticle = await arachne.article.save({
                        project_id: article.project_id,
                        name: "Neue Gruppe",
                        type: 0,
                        sort_nr: (parseInt(mBox.dataset.sort_nr)+1),
                        parent_id: mBox.dataset.parent_id
                    });
                    const [mArt, dArt] = await designArticle(nArticle);
                    mBoxAfter.after(mArt);
                    dBox.after(dArt);
                    this.resetSortNr();
                }
                mBoxAfter.ondragenter = (e) => {return false;}
                mBoxAfter.ondragover = (e) => {
                    event.target.classList.add("dragOverArticle");
                    event.target.textContent = "verschieben";
                    return false;
                }
                mBoxAfter.ondragleave = (e) => {
                    try{
                        event.target.classList.remove("dragOverArticle");
                        event.target.textContent = "hinzufügen";
                    }
                    catch{}
                }
                mBoxAfter.ondrop = async (e) => {
                    if(this.currentDragMBox != null){
                        this.currentDragMBox.dataset.sort_nr = (parseInt(mBox.dataset.sort_nr)+1);
                        mBoxAfter.after(this.currentDragMBoxAfter);
                        mBoxAfter.after(this.currentDragMBox);
                        dBox.after(this.currentDragDBox);
                        await arachne.article.save({
                            id: this.currentDragMBox.id.substring(2),
                            sort_nr:  (parseInt(mBox.dataset.sort_nr)+1),
                            parent_id: mBox.dataset.parent_id
                        });
                    }
                    this.resetSortNr();
                }

                mArt.appendChild(mBox);
                mArt.appendChild(mBoxAfter);

                let dArt = document.createDocumentFragment();
                let dBox = document.createElement("DIV");
                dBox.mBox = mBox;
                dBox.id = "d_"+article.id;
                dBox.style.padding = "0 0 0 10px";
                let dBoxText = document.createElement("DIV");
                dBoxText.innerHTML = html(`
                    <span></span>
                    <span class="da_article" id="${article.id}">${article.name}</span>  
                    `);
                dBox.appendChild(dBoxText);
                let dBoxZettel = document.createElement("DIV");
                dBoxZettel.dataset.article_id = article.id;
                dBoxZettel.addEventListener("setZettel", (e) => {
                    dBoxZettel.innerHTML = "";
                    for(const zettel of e.detail){
                        let zBox = document.createElement("DIV");
                        zBox.id = zettel.zettel_id; 
                        zBox.dataset.lnk_id = zettel.id;
                        zBox.classList.add("detail_zettel");
                        zBox.setAttribute("draggable", !this.editMode);
                        if(zettel.type == 4){
                            zBox.innerHTML = "* <i>Literaturzettel</i>";
                        } else {
                            zBox.innerHTML = html(`
                        ∗ <span class="opus">${zettel.opus?zettel.opus:"<i>Werk</i>"}</span>;
                        <span class="stelle">${zettel.stellenangabe?zettel.stellenangabe:"<i>Stelle</i>"}</span>
                        &ldquo;<span class="exportText">${zettel.display_text?zettel.display_text:"..."}</span>&rdquo;`);
                            if(zettel.include_export == 1){zBox.classList.add("zettelExported")}
                        }
                        dBoxZettel.appendChild(zBox);
                        zBox.ondragstart = () => {
                            if(this.selMarker.main.ids.length === 0){
                                let evt = new MouseEvent("mouseup", {
                                    bubbles: true,
                                    cancelable: true,
                                    view: window
                                });
                                zBox.dispatchEvent(evt);
                            }
                            this.currentDragMBox = null;
                            this.currentDragMBoxAfter = null;
                            this.currentDragDBox = null;
                            this.currentDragZettel = zBox;
                        }
                        zBox.ondragend = (e) => {
                            e.stopPropagation();
                            this.currentDragMBox = null;
                            this.currentDragMBoxAfter = null;
                            this.currentDragDBox = null;
                            this.currentDragZettel = null;
                        }
                        /*
                            z.onclick = () => {
                                let cEvent = event.target.closest("div.detail_zettel");
                                if(argos.main.o["project_zettel_preview"]!=null){
                                    argos.main.o["project_zettel_preview"].close();
                                }
                                argos.loadEye("project_zettel_preview", cEvent.id)
                            }
                            d.appendChild(z);
                         */
                    }
                });
                const setZettel = new CustomEvent("setZettel", {detail: zettels});
                dBoxZettel.dispatchEvent(setZettel);
                dBox.appendChild(dBoxZettel);
                let dBoxChildren = document.createElement("DIV");
                dBox.appendChild(dBoxChildren);

                dArt.appendChild(dBox);

                // article in detail view
                /*
                if(!(article.sort_nr == 0 && article.parent_id == 0 && zettels.length == 0)){
                    let word = keyWords.word(article.type, article.depth-1);
                    if(article.parent_id == 0 && article.sort_nr == 0){sign = "";word = ""}
                    let m = el.div(`
                        <span class="artLvlMark">${sign}</span>
                        <span>${article.name.substring(0, 20)}${article.name.length>20?"...":""}</span>
                        <span class="artBoxZettelCount">${zettels.length>0?zettels.length:""}</i>
                        (${article.parent_id} | ${article.sort_nr})
                        `); 
                    m.style.padding = "0 0 5px 10px";
                    if(this.editMode){
                        m.classList.add("editModeArticle");
                        m.setAttribute("draggable", true);
                    }
                    m.dataset.parent_id = article.parent_id;
                    m.dataset.atype = article.type;
                    m.dataset.depth = article.depth-1;
                    m.dataset.maxDepth = article.maxDepth;
                    m.id = "m_"+article.id; m.classList.add("aMenu");
                    m.dataset.sort_nr = article.sort_nr;
                    m.ondragstart = (e) => {
                        e.stopPropagation();
                        m.querySelectorAll(".artInsert").forEach((e) => {
                            e.style.visibility = "hidden";
                        });
                        this.currentDrag = m;
                        this.currentDragiA = iA;
                    }
                    m.ondragend = (e) => {
                        e.stopPropagation();
                        m.querySelectorAll(".artInsert").forEach((e) => {
                            e.style.visibility = "visible";
                        });
                        this.currentDrag = null;
                        this.currentDragiA = null;
                    }
                    m.onclick = (e) => {
                        e.stopPropagation();
                        d.scrollIntoView();
                        d.classList.add("selected");
                        setTimeout(() => {d.classList.remove("selected")}, 500);
                        
                    }
                    if(!(article.parent_id == 0 && article.sort_nr == 0)){
                        let cDeleteButton = document.createElement("SPAN");
                        cDeleteButton.style.marginRight = "20px";
                        cDeleteButton.classList.add("artBoxDelete", "editMode");
                        if(!this.editMode){cDeleteButton.classList.add("editModeOff")}
                        cDeleteButton.innerHTML = "&#x2715;";
                        cDeleteButton.onclick= async () => {
                            if(confirm("Soll die Gruppe wirklich gelöscht werden? Alle Untergruppen und die darin befindlichen Zettel werden ebenfalls aus dem Projekt entfernt.")){
                                let aLst = [article.id];
                                let zLst = [];
                                m.querySelectorAll(".aMenu").forEach((e) => {
                                    aLst.push(parseInt(e.id.substring(2)));
                                });
                                d.querySelectorAll(".detail_zettel").forEach((e) => {
                                    zLst.push(parseInt(e.dataset.lnk_id));
                                });
                                for(const a of aLst){await arachne.article.delete(a)}
                                for(const z of zLst){await arachne.zettel_lnk.delete(z)}
                                m.nextSibling.remove();
                                m.remove();
                                d.remove();
                            }
                        }; 
                        m.appendChild(cDeleteButton);
                    }
                    // create insert boxes
                    let iA = document.createElement("DIV");
                    let iAD = document.createElement("DIV");
                    iA.classList.add("artInsert", "editMode");
                    if(!this.editMode){iA.classList.add("editModeOff")}
                    iA.dataset.parent_id = article.parent_id;
                    iA.textContent = "hinzufügen";
                    iA.ondraenter = (e) => {return false;}
                    iA.ondragover = (e) => {
                        event.target.classList.add("dragOverArticle");
                        event.target.textContent = "verschieben";
                        return false;}
                    iA.ondragleave = (e) => {
                        try{
                            event.target.classList.remove("dragOverArticle");
                            event.target.textContent = "hinzufügen";
                        }
                        catch{}
                    }
                    let onDrop = async (iBox, iDBox, e) => {
                        if(this.currentDrag != null){
                            console.log("position saved...");
                            let parentNode = iBox.parentNode;
                            this.currentDragiA.dataset.parent_id = iBox.dataset.parend_id;
                            iBox.after(this.currentDragiA);
                            iBox.after(this.currentDrag);
                            iDBox.after(document.getElementById(`d_${this.currentDrag.id.substring(2)}`));
                            /*
                            let prevM = iBox.previousSibling;
                            let prevD = document.getElementById(`d_${prevM.id.substring(2)}`);
                            if(prevD!=null){
                                prevD.after();
                            } else {
                                let parentD = document.getElementById(`d_${parentNode.id.substring(2)}`);
                                parentD.appendChild(document.getElementById(`d_${this.currentDrag.id.substring(2)}`));
                            }
                            *//*
                            await arachne.article.save({
                                id: this.currentDrag.id.substring(2),
                                parent_id: iBox.dataset.parent_id
                            });
                            await this.resetSortNr(parentNode);
                            console.log("drop finished!");
                        }
                    }
                    iA.ondrop = async (e) => {await onDrop(iA, iAD, e)}
                    let iCD=null;
                    if(!(article.parent_id == 0 && article.sort_nr == 0)){
                        let iC = iA.cloneNode(true);
                        iCD = document.createElement("DIV");
                        iC.dataset.parent_id = article.id;
                        iC.ondraenter = (e) => {return false;}
                        iC.ondragover = (e) => {
                            event.target.classList.add("dragOverArticle");
                            event.target.textContent = "verschieben";
                            return false;
                        }
                        iC.ondragleave = (e) => {
                            try{
                                event.target.classList.remove("dragOverArticle");
                                event.target.textContent = "hinzufügen";
                            }
                            catch{}
                        }
                        iC.ondrop = async (e) => {await onDrop(iC, iCD, e)}
                        iC.onclick = async () => {
                            let nArticle = await arachne.article.save({
                                project_id: article.project_id,
                                name: "Neue Gruppe",
                                type: 0,
                                sort_nr: 1,
                                parent_id: m.id.substring(2)
                            });
                            nArticle.depth = article.depth+1;
                            nArticle.maxDepth = article.maxDepth;
                            const [cM, cD, cIA] = await designArticle(nArticle);
                            iC.after(cM);
                            dInsertMarker.after(cD);
                            cM.after(cIA);
                            await this.resetSortNr(m);
                        }
                        m.append(iC);
                    }
                    iA.onclick = async () => {
                        let type = 0;
                        let name = "Neue Gruppe";
                        if(article.parent_id == 0){type = 1; name = "Neues Lemma"}
                        let nArticle = await arachne.article.save({
                            project_id: article.project_id,
                            name: name,
                            type: type,
                            sort_nr: (article.sort_nr+1),
                            parent_id: article.parent_id
                        });
                        nArticle.depth = article.depth;
                        nArticle.maxDepth = article.maxDepth;
                        const [cM, cD, cIA] = await designArticle(nArticle);
                        document.getElementById(`d_${iA.previousSibling.id.substring(2)}`).after(cD);
                        iA.after(cM);
                        cM.after(cIA);
                        await this.resetSortNr(m.parentNode);
                    }

                    // entry for detail box
                    let d = el.div(`
                        <span class="daKeyWord">${word}</span>
                        <span class="da_article" id="${article.id}">${article.name}</span>  
                        `);
                    let dInsertMarker = document.createElement("SPAN");
                    d.appendChild(dInsertMarker);
                    d.style.padding = "0 0 0 10px";
                    d.id = "d_"+article.id;
                    if(iCD!=null){d.appendChild(iCD)}
                    d.m = m;
                    d.draw = () => {
                        for(const zettel of zettels){
                            let z = el.div(""); z.classList.add("detail_zettel");
                            z.id = zettel.zettel_id; z.dataset.lnk_id = zettel.id;
                            z.setAttribute("draggable", "true");
                            z.ondragstart = () => {
                                let evt = new MouseEvent("mouseup", {
                                    bubbles: true,
                                    cancelable: true,
                                    view: window
                                });
                                z.dispatchEvent(evt);
                            }
                            z.onclick = () => {
                                let cEvent = event.target.closest("div.detail_zettel");
                                if(argos.main.o["project_zettel_preview"]!=null){
                                    argos.main.o["project_zettel_preview"].close();
                                }
                                argos.loadEye("project_zettel_preview", cEvent.id)
                            }
                            if(zettel.type == 4){
                                z.textContent = "* Literaturzettel";
                            } else {
                                z.innerHTML = html(`
                            ∗ <span class="opus">${zettel.opus?zettel.opus:"<i>Werk</i>"}</span>;
                            <span class="stelle">${zettel.stellenangabe?zettel.stellenangabe:"<i>Stelle</i>"}</span>
                            &ldquo;<span class="exportText">${zettel.display_text?zettel.display_text:"..."}</span>&rdquo;`);
                                if(zettel.include_export == 1){z.classList.add("zettelExported")}
                            }
                            d.appendChild(z);
                        }
                    }
                    return [m, d, iA, iAD];
                }
                return [null, null, null, null];
                */
                return [mArt, dArt];
            }

            let cMaxDepth = 1;
            for(const project of projects){
                if(project.maxDepth != null){cMaxDepth = project.maxDepth}
                else{project.maxDepth = cMaxDepth}
                //const [m, d, iA, iAD] = await designArticle(project);
                const [mArt, dArt] = await designArticle(project);
                if(mArt!=null){
                    //d.draw();
                    if(project.parent_id === 0){
                        menuBox.append(mArt);
                        detailBox.append(dArt);
                    } else {
                        menuBox.querySelector(`#m_${project.parent_id}`).children[2].appendChild(mArt);
                        detailBox.querySelector(`#d_${project.parent_id}`).children[2].appendChild(dArt);
                    }
                }
            }

            mainBody.appendChild(detailBox);
            mainBody.appendChild(menuBox);
            this.ctn.appendChild(mainBody);
            /* 
            console.log("wird im Cache gespeichert.");
            localStorage.setItem(`p_${this.resId}`, this.ctn.innerHTML);
            */
        }

        // set selection etc.
        this.setSelection("main", "div.detail_zettel", true);
        this.setSelection("opus", "span.opus", false, () => {
            let obj = event.target;
            setTimeout(() => {
                obj.style.textShadow = "none";
                //obj.style.color="initial";
                if(obj.dataset.selected == "" || obj.dataset.selected == null){
                    obj.innerHTML = "<i>Werk</i>";
                }else{
                    arachne.zettel.save({id: obj.parentNode.id, work_id: obj.dataset.selected}).
                        then(re => {if(re>0){el.status("saved")}}).
                        catch(e => {alert("Ein Fehler ist aufgetreten! "+e);argos.loadMain("project_overview");});
                }
            }, 200);
        }, true);
        this.setSelection("stelle", "span.stelle", false, () => {
            if(event.target.textContent === ""){event.target.innerHTML = "<i>Stelle</i>"}
            arachne.zettel.save({id: event.target.parentNode.id, stellenangabe: event.target.textContent}).
                then(re => {if(re>0){el.status("saved")}}).
                catch(e => {alert("Ein Fehler ist aufgetreten! "+e);argos.loadMain("project_overview");});
        });
        this.setSelection("exportText", "span.exportText", false, () => {
            if(event.target.textContent === ""){event.target.innerHTML = "..."}
            arachne.zettel_lnk.save({id: event.target.parentNode.dataset.lnk_id, display_text: event.target.textContent}).
                then(re => {if(re>0){el.status("saved")}}).
                catch(e => {alert("Ein Fehler ist aufgetreten! "+e);argos.loadMain("project_overview");});
        });
        this.setSelection("article", "span.da_article", false, () => {
            let obj = event.target;
            if(obj.textContent === ""){obj.innerHTML = "..."}
            arachne.article.save({id: obj.id, name: obj.textContent}).
                then(re => {if(re>0){
                    el.status("saved");
                    obj.parentNode.parentNode.mBox.children[0].children[1].innerHTML = `${obj.textContent.substring(0, 20)}${obj.textContent.length>20?"...":""}`;
                }}).
                catch(e => {alert("Ein Fehler ist aufgetreten! "+e);argos.loadMain("project_overview");});
        });
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
        /* const rule = new Rules();
        rule.check(this.ctn);
        */
        // context menu
        let cContext = new ContextMenu();
        cContext.addEntry('div.detail_zettel', 'a', 'Detailansicht', function(){argos.load("zettel_detail", me.selMarker["main"]["lastRow"])});
        cContext.addEntry('div.detail_zettel', 'hr', '', null);
        cContext.addEntry('div.detail_zettel:not(.zettelExported)', 'a', 'In Export aufnehmen', function(){includeInExport(me)});
        cContext.addEntry('div.detail_zettel.zettelExported', 'a', 'Aus Export entfernen', function(){includeInExport(me)});
        cContext.addEntry('div.detail_zettel', 'a', 'Zettel aus dem Projekt entfernen', async () => {
            if(confirm("Soll der Zettel wirklich aus dem Projekt entfernt werden? Der Zettel bleibt allerdings in der Zettel-Datenbank erhalten.")){
                let cZettel = this.ctn.querySelector("div.detail_zettel[id='"+this.selMarker.main.lastRow+"']");
                await arachne.zettel_lnk.delete(cZettel.dataset.lnk_id);
                let cParent = cZettel.parentNode;
                cParent.querySelectorAll(".detail_zettel").forEach((e) => {
                    e.remove();
                });
                cParent.draw();
            }
        });
        cContext.addEntry('div.detail_zettel', 'a', 'Neuen Zettel erstellen', function(){argos.load("zettel_add")});
        cContext.addEntry('div.detail_zettel', 'hr', '', null);
        cContext.addEntry('*', 'a', 'Artikelstruktur bearbeiten', () => {this.editArticleStructure()});
        cContext.addEntry('*', 'hr', '', null);
        cContext.addEntry('*', 'a', 'Projekt exportieren', () => {argos.loadEye("project_export", this.resId)});
        this.setContext = cContext.menu;
    }

    editArticleStructure(){
        this.editMode = (this.editMode) ? false : true;
        this.ctn.querySelectorAll(".editMode").forEach((e) => {e.classList.toggle("editModeOff")});
        this.ctn.querySelectorAll(".mBox").forEach((e) => {
            e.classList.toggle("editModeArticle");
            e.setAttribute("draggable", this.editMode);
        });
        this.ctn.querySelectorAll(".detail_zettel").forEach((e) => {
            e.setAttribute("draggable", !this.editMode);
        });
    }
    async resetSortNr(){
        /*
        let children = box.children;
        let j = 0;
        for(let i = 0;i<children.length;i++){
            if(children[i].classList.contains("aMenu")){
                j++;
                let cEl = children[i];
                if(parseInt(cEl.dataset.sort_nr) != j){
                    cEl.dataset.sort_nr = j;
                    console.log("id", cEl.id.substring(2), "sort_nr", j);
                    await arachne.article.save({
                        id: cEl.id.substring(2),
                        sort_nr: j
                    }).
                        catch(e => {throw e});
                    const keyWords = new KeyWordSetter();
                    console.log(cEl.dataset.atype, cEl.dataset.sort_nr,
                        cEl.dataset.depth, cEl.dataset.maxDepth);
                    const sign = keyWords.sign(parseInt(cEl.dataset.atype), parseInt(cEl.dataset.sort_nr)-1,
                        parseInt(cEl.dataset.depth), parseInt(cEl.dataset.maxDepth));
                    cEl.children[0].innerHTML = html(sign);
                }
            }
        }
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
                else {return this.numbers[(depth-1<0)?0:depth-1][number]}
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
// -II- asorted functions OLD?!?
// ****************************************************
function includeInExport(me){
    let cObj = me.ctn.querySelector("div.detail_zettel[id='"+me.selMarker["main"]["lastRow"]+"']");
    let cLnkId = cObj.dataset.lnk_id;
    let includeExport = 1;
    if(cObj.classList.contains("zettelExported")){includeExport=0}
    me._put("data/zettel_lnk/"+cLnkId, {"include_export": includeExport}, function(){me.refresh()});
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

class ProjectZettelPreview extends Oculus{
    constructor(res, resId=null, access=[], main=false){
        super(res, resId, access, main);
    }
    async load(){
        let mainBody = document.createDocumentFragment();
        if(this.access.includes("comment")){
            let pmContent = document.createElement("DIV");
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
            pmContent.appendChild(commentContainer);
            mainBody.appendChild(this.createBox("comment", "Kommentare", pmContent));
        }
        /*
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
        this.ctn.appendChild(mainBody);
    }
    createBox(id, button, content){
        let box = document.createElement("DIV");
        box.classList.add("projectMenuEntry"); box.id = id;
        let pmButton = document.createElement("DIV");
        pmButton.textContent = button; pmButton.classList.add("projectMenuButton");
        box.appendChild(pmButton);
        let pmContent = document.createElement("DIV");
        pmContent.classList.add("projectMenuContent");
        pmContent.appendChild(content);
        box.appendChild(pmContent);
        return box;
    }
}
/*
    <div class="projectMenuContent">
        % if zettel.get("comments") != None:
            % cmnts = json.loads(zettel.get("comments").replace('\n', '<br />').replace('\r', '<br />'))
            % for cmnt in cmnts:
                <p><form>
                    <b>{{cmnt["user"]}}</b>, am {{str(cmnt["date"]).split()[0]}}:
                    <br />{{!cmnt["comment"]}}
                    % if user["id"] == cmnt["user_id"]:
                        <i class="deleteEntry" style='cursor:pointer;'>(löschen)</i>
                        <input type="hidden" name="res" value="comment" />
                        <input type="hidden" name="resId" value="{{cmnt["id"]}}" />
                    % end
                </form></p>
            % end
        % end
        <form autocomplete="off">
            <table>
                <tr>
                    <td>Neue Notiz:</td>
                    <td><textarea name="comment" autocomplete="off"></textarea></td>
                </tr>
                <tr>
                    <td></td>
                    <td>
                        <input type="button" class="noUpload" id="newComment" value="speichern" />
                    </td>
                </tr>
            </table>
            <input type="hidden" name="res" value ="comment" />
            <input type="hidden" name="zettel_id" value="{{zettel["id"]}}" />
            <input type="hidden" name="user_id" value="{{user["id"]}}" />
            <input type="hidden" name="date" value="{{c_date}}" />
        </form>
    </div>


% if zettel.get("work_id", 0) > 0:
<div class="projectMenuEntry" id='opera'>
    <div class="projectMenuButton">opera-Eintrag</div>
    <div class="projectMenuContent" style='left: 10px;'>
        <table>
            <tr style='vertical-align: top;'>
                <td class='c1'>{{!zettel.get('date_display', '')}}</td>
                <td class='c2'><aut>{{zettel.get('author_abbr', '')}}</aut></td>
                <td class='c3'>{{!zettel.get('author_full', '')}}</td>
                <td class='c4'></td>
                <td class='c5'></td>
            </tr>
            <tr style='vertical-align: top;'>
                <td class='c1'></td>
                <td class='c2'>&nbsp;&nbsp;&nbsp;{{zettel.get('work_abbr', '')}}</td>
                <td class='c3'>&nbsp;&nbsp;&nbsp;{{zettel.get('work_full', '')}}</td>
                <td class='c4'><i>{{zettel.get('bibliography', '')}}</i></td>
                <td class='c5'>{{!zettel.get('txt_info', '')}}</td>
            </tr>
        </table>
    </div>
</div>
% end
% if zettel.get('editions', None):
<div class="projectMenuEntry" id='edition'>
    <div class="projectMenuButton">Editionen</div>
    <div class="projectMenuContent">
        % editions = json.loads(zettel.get("editions"))
        % for edition in editions:
        <a href='{{edition.get('url', '')}}' target='_blank'>{{!edition.get('label', '')}}</a><br />
        % end
    </div>
</div>
% end

<div class="projectMenuEntry" id='zettel'>
    <div class="projectMenuButton">Zettel</div>
    <div class="projectMenuContent">
        <div style='width: var(--zettelWidth);
        % if zettel.get("img_path", False) == False:
        height: var(--zettelHeight);
        % end
        '>
            % if zettel.get("img_path"):
                <img style="width:100%" src='{{zettel["img_path"] + '.jpg'}}' />
            % else:
                % include("zettel/zettel_card_digital", zettel=zettel)
            % end
        </div>
    </div>
</div>
 */
/*
    # ################################################################
    # OLD???
    # ################################################################
    def project_export(self, dock):
        user = self.auth()
        id=dock["res_id"]
        if "editor" in user["access"]:
            c_project = self.db.search("project", {"id": id}, ["user_id", "name"])[0]
            if c_project["user_id"] == user["id"]:
                articles = self.db.search("article", {"project_id": id},
                        ["position", "name", "id", "type"], ["position"])
                article_txt = ""
                article_lst = []
                c_article = ""
                c_lvl = 0
                for article in articles:
                    if article["position"] != "000":
                        # new article
                        if article["position"].find(".") == -1 and article_txt != "":
                            article_txt += f'AUTOR {user["last_name"]}'
                            article_lst.append(article_txt)
                            article_txt = ""

                        # new group inside of an article
                        if article["position"] != c_article:
                            c_article = article["position"]
                            c_lvl = c_article.count(".")
                            if article_txt != "":
                                if article['type'] == 0:
                                    if c_lvl == 1:
                                        article_txt += "BEDEUTUNG"
                                    elif c_lvl == 2:
                                        article_txt += "\tUNTER_BEDEUTUNG"
                                    elif c_lvl == 3:
                                        article_txt += "\t\tUNTER_UNTER_BEDEUTUNG"
                                    elif c_lvl >= 4:
                                        article_txt += ("\t"*c_lvl) + ("U"*c_lvl) + "_BEDEUTUNG"
                                elif article["type"] == 1:
                                        article_txt += ("\t"*(c_lvl-1)) + "LEMMA"
                                elif article["type"] == 2:
                                        article_txt += ("\t"*(c_lvl-1)) + "ANHÄNGER"
                                elif article["type"] == 3:
                                        article_txt += ("\t"*(c_lvl-1)) + "???"
                                elif article["type"] == 4:
                                        article_txt += ("\t"*(c_lvl-1)) + "???"
                                elif article["type"] == 5:
                                        article_txt += ("\t"*(c_lvl-1)) + "//"
                            else:
                                article_txt = "LEMMA"
                            article_txt += " " + article["name"] + "\n"

                        zettels = self.db.search("zettel_lnk_view",
                                {"article_id": article["id"]}, ["example_plain",
                                    "display_text", "include_export", "comments",
                                    "stellenangabe"],
                                ["date_sort"])
                        # collect zettels
                        for zettel in zettels:
                            if zettel.get("include_export", 0) == 1:
                                article_txt += ("\t"*(c_lvl+1)) + "* "
                                article_txt += f"{zettel.get('example_plain', '')}; {zettel.get('stellenangabe', '')} "
                                article_txt += f"\"{zettel.get('display_text', '')}\"\n"
                                if zettel.get("comments", None):
                                    cmnts = json.loads(zettel["comments"])
                                    for cmnt in cmnts:
                                        article_txt += ("\t"*(c_lvl+1)) + f"/* {cmnt.get('user', '')}, am {cmnt.get('date', '')[:10]}: {cmnt.get('comment', '')} * /\n"
                article_txt += f'AUTOR {user["last_name"]}'
                article_lst.append(article_txt)

                c_path = self.p + "/export_project/"
                if path.exists(c_path) == False: mkdir(c_path)
                export_path = c_path+c_project["name"].replace(" ", "_")+".zip"
                export_url = "/export_project/"+c_project["name"].replace(" ", "_")+".zip"
                if path.exists(export_path): remove(export_path)
                ex_zip = zipfile.ZipFile(export_path, "w")
                export_txt = ''
                for article in article_lst:
                    c_name = article.split("\n")[0][6:]
                    c_file = open(c_path+c_name+".mlw", "w")
                    c_file.write(article)
                    export_txt += '<p>' + article.replace('\n', '<br />').replace('\t', '&nbsp;&nbsp;&nbsp;&nbsp;') + '</p>'
                    c_file.close()
                    ex_zip.write(c_path+c_name+".mlw", c_project["name"]+"/"+c_name+".mlw")
                    #kompiliere_mlw(c_path+c_name+".mlw")
                    remove(c_path+c_name+".mlw")
                ex_zip.close()

                return template("project/project_export", article_lst=article_lst,
                        export_url=export_url, preview=export_txt)
 */
