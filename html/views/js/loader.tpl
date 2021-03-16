function getNow(){return new Date().toISOString().slice(0,19).replace("T", " ")}

class ContextMenu{
    constructor(){
        this.menu = [];
    }
    addEntry(selector, element, description, action){
        this.menu.push({
            'selector': selector,
            'element': element,
            'description': description,
            'action': action
        });
    }
}

class Loader{
    constructor(o){
    this.o = o;

    this.loadFunctions = {
        "account": function(me){
            me.ctn.querySelector("input[name=z_width]").value = argos.userDisplay.z_width;
            me.ctn.querySelector("input#saveUser").addEventListener("click", function(){me.updateData(function(){me.refresh()})});
            me.ctn.querySelector("input#savePassword").addEventListener("click", function(){me.updateData(function(){me.refresh()})});
            me.ctn.querySelector("input#saveDisplay").addEventListener("click", function(){
                argos.userDisplay["z_width"] = me.ctn.querySelector("input[name=z_width]").value;
                argos.setUserDisplay();
                location.reload();
            });
        }, "help": function(me){
            me.setTabs = true;
        }, "lemma": function(me){
            me.setLoadMore = 'lemma_loadmore';
            me.setSelection("main", "tr.loadMore", false);
            argos.setSearchbar();

            // event listeners
            % if 'comment' in user['access']:
                me.ctn.addEventListener('click', function(){
                    if(event.target.tagName == "A" && event.target.classList.contains("openComment")){
                        argos.load('lemma_comment', event.target.id);
                    }
                });
            % end

            // contextmenu
            var cContext = new ContextMenu();
            % if 'l_edit' in user['access']:
                cContext.addEntry('tr.loadMore', 'a', 'Lemma bearbeiten',
                    function(){argos.load("lemma_edit", me.selMarker["main"]["lastRow"])});
                cContext.addEntry('tr.loadMore', 'a', 'Neues Lemma erstellen',
                    function(){argos.load("lemma_add")});
            % end
            % if 'comment' in user['access']:
                if(cContext.menu.length > 0){
                cContext.addEntry('tr.loadMore', 'hr', '', null);
                }
                cContext.addEntry('tr.loadMore', 'a', 'Notizen',
                    function(){argos.load("lemma_comment", me.selMarker["main"]["lastRow"])});
            % end
            % if 'editor' in user['access']:
                if(cContext.menu.length > 0){
                cContext.addEntry('tr.loadMore', 'hr', '', null);
                }
                cContext.addEntry('tr.loadMore', 'a', 'zu Projekt hinzufügen',
                    function(){argos.load("lemma_addToProject", me.selMarker["main"]["lastRow"])});
            % end
            if (Object.keys(cContext.menu).length > 0){me.setContext = cContext.menu;}
        }, "lemma_comment": function(me){
            me.ctn.querySelector('input#newComment').addEventListener('click', function(){me.createData()});
            // set event listener to delete comments
            me.ctn.querySelectorAll('i.deleteEntry').forEach(function(e){
                e.addEventListener("click", function(){me.deleteData(function(){me.refresh();})});
            });
        }, "lemma_edit": function(me){
            me.ctn.querySelector('input#saveChanges').addEventListener('click', function(){me.updateData()});
            if(me.ctn.querySelector('input#deleteEntry') != null){
                me.ctn.querySelector('input#deleteEntry').addEventListener('click', function(){
                argos.dataList["lemma_data"].remove(me.ctn.querySelector("input[name=resId]").value);
                me.deleteData()
                });
            }
        }, "lemma_add": function(me){
            var cLemma = document.querySelector("input#lemmaInsert");
            if(cLemma != null){
                me.ctn.querySelector("input[name=lemma]").value = cLemma.value;
                me.ctn.querySelector("input[name=lemma_display]").value = cLemma.value;
            }
            me.ctn.querySelector("input#saveChanges").addEventListener("click", function(){me.createData(function(){
                me._getJSON("data/zettel_lemma?qJSON="+encodeURIComponent(JSON.stringify({"lemma": me.ctn.querySelector("input[name=lemma]").value})), function(rData){
                    argos.dataList["lemma_data"].add(rData[0]);
                    if(argos.mainId != "lemma"){
                        //document.getElementById("zettel_detail").querySelector("#lemmaInput_hidden").value = parseInt(rData[0]["id"]);
                        //document.getElementById("zettel_detail").querySelector("#lemmaInput").style.color = "inherit";
                        me.close();
                        let event = new Event("input");
                        cLemma.dispatchEvent(event);
                    } else {me.refresh()}
                });
            })});
        % if "library" in user["access"]:
        }, "lemma_addToProject": function(me){
            var cLemmaId = argos.o["lemma"].selMarker["main"]["lastRow"];
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
                cWarning.style.padding = "0px 10px 20px 10px";
                me.ctn.querySelector("#projectContent").textContent = "";
                me.ctn.querySelector("#projectContent").appendChild(cWarning);
            } else {
                me.ctn.querySelector("input#submitLemmaToProject").addEventListener("click", function(){
                    me._getJSON("/data/lemma_to_project", function(rData){
                        if(rData.length == 0){
                            alert("Keine Zettel für dieses Lemma verfügbar.");
                        } else {
                            var addList = [];
                            for (var item of rData){
                                addList.push({"data": {"article_id": me.ctn.querySelector("select[name=article_id] option:checked").id, "zettel_id": item.id}});
                            }
                            me._post("/batch", {"res": "zettel_lnk", "mode": "create", "items": addList}, function(){me.refresh()});
                        }
                    }, {"lemma_id": cLemmaId});
                    /*
                    */
                });
            }
        }, "library": function(me){
            me.setLoadMore = "library_loadmore";

            me.setSelection("main", "tr.edition", false);
            argos.setSearchbar();
            % if "e_edit" in user["access"]:
            // contextmenu
            var cContext = new ContextMenu();
            cContext.addEntry('tr.edition', 'a', 'Edition bearbeiten', function(){argos.load("library_edit", me.selMarker["main"]["lastRow"])});
            cContext.addEntry('tr.edition', 'a', 'Edition erstellen', function(){argos.load("library_add")});
            cContext.addEntry('tr.edition', 'hr', '', null);
            cContext.addEntry('tr.edition', 'a', 'Opera-Listen aktualisieren', function(){argos.load("library_update")});
            me.setContext = cContext.menu;
            % end
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
        }, "opera_author_add": function(me){
            me.ctn.querySelector("input#submitAuthor").addEventListener("click", function(){me.createData()});
        }, "opera_author_edit": function(me){
            me.ctn.querySelector("input#submitAuthor").addEventListener("click", function(){me.updateData()});
            me.ctn.querySelector("input#deleteAuthor").addEventListener("click", function(){if(confirm("Soll der Autor wirklich gelöscht werden? Dieser Schritt kann nicht rückgängig gemacht werden!")){me.deleteData()}});
        }, "opera_export": function(me){
            me.ctn.querySelector("input#preparePrint").addEventListener("click", function(){
                const cDigi = me.ctn.querySelector("input[name='digital']").checked;
                const cCmnt = me.ctn.querySelector("input[name='comments']").checked;
                let tBody = document.createElement("TBODY");
                me.ctn.innerHTML="<div id='loadLabel'>Liste wird vorbereitet...</div>";
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
                me.ctn.textContent = "";
                me.ctn.appendChild(exTable);
                window.print();
                me.close();
            });
        }, "opera_work_add": function(me){
            // set author-selection
            var cSelect = me.ctn.querySelector("select[name=author_id]");
            var cAuthorId = cSelect.dataset.startvalue;
            for(var author of argos.dataList.author_data.filter()){
                let nOption = document.createElement("OPTION");
                nOption.value = author.id;
                if(author.id==cAuthorId){nOption.selected=true}
                nOption.textContent = author.abbr;
                cSelect.appendChild(nOption);
            }
            // set buttons
            me.ctn.querySelector("input#submitWork").addEventListener("click", function(){me.createData()});
        }, "opera_work_edit": function(me){
            // set author-selection
            var cSelect = me.ctn.querySelector("select[name=author_id]");
            var cAuthorId = cSelect.dataset.startvalue;
            for(var author of argos.dataList.author_data.filter()){
                let nOption = document.createElement("OPTION");
                nOption.value = author.id;
                if(author.id==cAuthorId){nOption.selected=true}
                nOption.textContent = author.abbr;
                cSelect.appendChild(nOption);
            }
            // set buttons
            me.ctn.querySelector("select[name='is_maior']").addEventListener("change", function(){
                if(this.value==="1"){
                    me.ctn.querySelectorAll(".minorCit").forEach(function(e){e.style.visibility = "hidden"});
                } else {
                    me.ctn.querySelectorAll(".minorCit").forEach(function(e){e.style.visibility = "visible"});
                }
            });
            me.ctn.querySelector("input#submitWork").addEventListener("click", function(){me.updateData()});
            me.ctn.querySelector("input#deleteWork").addEventListener("click", function(){if(confirm("Soll das Werk wirklich gelöscht werden? Dieser Schritt kann nicht rückgängig gemacht werden!")){me.deleteData()}});
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



        }, "opera_update": function(me){
            me.ctn.querySelector("input#updateOpera").addEventListener("click", function(){me.updateData()});
        % if "editor" in user["access"]:
        }, "project_overview": function(me){
            me.setTabs = true;
            me.ctn.querySelectorAll("div.projectActive").forEach(function(e){e.addEventListener("dblclick", function(){
            //argos.main="project/"+me.selMarker["main"]["lastRow"];
            argos.loadMain("project",me.selMarker["main"]["lastRow"]);
            })});
            me.setSelection("main", "div.projectItems", false, function(){me._put("data/project/"+event.target.id, {"name": event.target.textContent})});
            
            //context menu
            var cContext = new ContextMenu();
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
            me.setContext = cContext.menu;
        }, "project": function(me){
            // start external onload function
            onProjectLoad(me);
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
        % end
        }, "server_stats": function(me){
            me._getJSON("/data/zettel_stats", function(rData){
                let zettelStat = me.ctn.querySelector("div#zettelStat");
                let zTotal = rData.length;
                let zWork = 0;
                let zLemma = 0;
                let zWorkLemma = 0;
                let zProgress = {};
                let zTypes = {0: 0, 1: 0, 2: 0, 3: 0, 4:0, 5: 0, undefined: 0};
                const zTypesProps = Object.keys(zTypes);
                for(const zettel of rData){
                    if(zettel.work_id!=null && zettel.lemma_id!=null){zWorkLemma++}
                    else if(zettel.work_id!=null){zWork++}
                    else if(zettel.lemma_id!=null){zLemma++}
                    if(zettel.c_date != null){
                        if(zProgress[zettel.c_date.slice(0,7)]!=null){zProgress[zettel.c_date.slice(0,7)] ++}
                        else{zProgress[zettel.c_date.slice(0,7)]=1}
                    }
                    else{console.log(zettel)}
                    zTypes[zettel.type] ++;
                    /*
                    if(zTypesProps.includes(zettel.type)){
                        zTypes[zettel.type] ++;
                    } else {
                        zTypes.unknown ++;
                    }
                    */
                }
                console.log(zTypes);
                console.log(Object.keys(zProgress).sort());
                const zLemmaPro =Math.round(100/zTotal*zLemma);
                const zWorkPro =Math.round(100/zTotal*zWork);
                const zFinishedPro =Math.round(100/zTotal*zWorkLemma);
                const fiColor = "#6D9C4B";
                const seColor = "#A4BA57";
                const thColor = "#D9D962";
                const foColor = "#F4F4E4";
                zettelStat.innerHTML = `<table style="position:relative; left: 400px; top: 100px; width: 500px;">
                <tr style="color:${fiColor};"><td>abgeschlossen:</td><td style="text-align:right;">${zWorkLemma}</td><td style="text-align:right;">${zFinishedPro}%</td></tr>
                <tr style="color:${seColor};"><td>nur mit Lemma verknüpft:</td><td style="text-align:right;">${zLemma}</td><td style="text-align:right;">${zLemmaPro}%</td></tr>
                <tr style="color:${thColor};"><td>nur mit Werk verknüpft:</td><td style="text-align:right;">${zWork}</td><td style="text-align:right;">${zWorkPro}%</td></tr>
                <tr style="border-top: 1px solid var(--mainTxtColor);"><td>Zettel gesamt:</td><td style="text-align:right;">${zTotal}</td><td style="text-align:right;">100%</td></tr>
                </table>`;
                const sPoint= Math.PI*1.5;

                let zCircle = document.createElement("CANVAS");
                zCircle.style.position = "relative";
                zCircle.style.top = "-140px";
                zCircle.style.left = "50px";
                zCircle.width = 250;
                zCircle.height = 250;
                const zCircleFirst = Math.PI*2/100*zFinishedPro;
                const zCircleSecond = Math.PI*2/100*(zLemmaPro+zFinishedPro);
                const zCircleThird = Math.PI*2/100*(zWorkPro+zLemmaPro+zFinishedPro);
                const zCircleFourth = Math.PI*2/100*((100-zWorkPro-zLemmaPro-zFinishedPro)+zWorkPro+zLemmaPro+zFinishedPro);
                let zCircleCtx = zCircle.getContext("2d");
                zCircleCtx.beginPath();
                zCircleCtx.fillStyle = fiColor;
                zCircleCtx.moveTo(125,125);
                zCircleCtx.arc(125, 125, 120, sPoint, sPoint+zCircleFirst, false);
                zCircleCtx.fill();
                zCircleCtx.beginPath();
                zCircleCtx.fillStyle = seColor;
                zCircleCtx.moveTo(125,125);
                zCircleCtx.arc(125, 125, 120, sPoint+zCircleFirst, sPoint+zCircleSecond, false);
                zCircleCtx.fill();
                zCircleCtx.beginPath();
                zCircleCtx.fillStyle = thColor;
                zCircleCtx.moveTo(125,125);
                zCircleCtx.arc(125, 125, 120, sPoint+zCircleSecond, sPoint+zCircleThird, false);
                zCircleCtx.fill();
                zCircleCtx.beginPath();
                zCircleCtx.fillStyle = foColor;
                zCircleCtx.moveTo(125,125);
                zCircleCtx.arc(125, 125, 120, sPoint+zCircleThird, sPoint+zCircleFourth, false);
                zCircleCtx.fill();
                zettelStat.appendChild(zCircle);

                /*
                zettelStat.innerHTML += `<table style="position:relative; left: 400px; top: 100px; width: 500px;">
                <tr style="color:${fiColor};"><td>Verzetteltes Material:</td><td style="text-align:right;">${zTypes[1]}</td><td style="text-align:right;">${zFinishedPro}%</td></tr>
                <tr style="color:${seColor};"><td>Exzerpt-Zettel:</td><td style="text-align:right;">${zTypes[2]}</td><td style="text-align:right;">${zLemmaPro}%</td></tr>
                <tr style="color:${thColor};"><td>Index-Zettel:</td><td style="text-align:right;">${zTypes[3]}</td><td style="text-align:right;">${zWorkPro}%</td></tr>
                <tr style="border-top: 1px solid var(--mainTxtColor);"><td>Literaturzettel:</td><td style="text-align:right;">${zTypes[4]}</td><td style="text-align:right;">100%</td></tr>
                <tr style="border-top: 1px solid var(--mainTxtColor);"><td>Unbekannter Zetteltyp:</td><td style="text-align:right;">${zTypes[0]+zTypes[undefined]}</td><td style="text-align:right;">100%</td></tr>
                </table>`;
                */
                /*
                let zCircle2 = document.createElement("CANVAS");
                const zSeg1= Math.PI*2/100*;
                const zSeg2= Math.PI*2/100*(zLemmaPro+zFinishedPro);
                const zSeg3= Math.PI*2/100*(zWorkPro+zLemmaPro+zFinishedPro);
                //const zSeg4= Math.PI*2/100*((100-zWorkPro-zLemmaPro-zFinishedPro)+zWorkPro+zLemmaPro+zFinishedPro);
                zCircle2.width = 250;
                zCircle2.height = 250;
                let zCircleCtx2 = zCircle2.getContext("2d");
                zCircleCtx2.beginPath();
                zCircleCtx2.fillStyle = fiColor;
                zCircleCtx2.moveTo(125,125);
                zCircleCtx2.arc(125, 125, 120, sPoint, sPoint+zCircleFirst, false);
                zCircleCtx2.fill();

                zettelStat.appendChild(zCircle2);
                */


            }, {});
        }, "user_access": function(me){
            me.setSelection("main", "tr.userAccess", false);

            // contextmenu
            var cContext = new ContextMenu();
            cContext.addEntry('tr.userAccess', 'a', 'Zugriffsrechte verwalten', function(){argos.load("user_access_detail", me.selMarker["main"]["lastRow"])});
            me.setContext = cContext.menu;
        }, "user_access_detail": function(me){
            me.setSelection("main", "div.userAccessItem", true);
            const cAccess = JSON.parse(me.ctn.querySelector("div#cAccess").textContent);
            const rights = {"auth": "Profil aktiviert", "admin": "Adminrechte", "o_view": "Kommentarspalte (opera-Listen)",
            "o_edit": "opera-Listen bearbeiten", "z_add": "Zettel importieren", "z_edit": "Zettel bearbeiten",
            "l_edit": "Lemma-Liste bearbeiten", "library": "Zugriff auf Bibliothek", "e_edit": "Bibliothek bearbeiten",
            "setup": "Zugriff auf Datenbanksetup", "module": "Zugriff über Python-Modul",
            "editor": "Zugriff auf Lemmastrecken-Editor", "comment": "Zugriff auf Kommentarfunktion",
            "comment_moderator": "Kommentare moderieren"};
            let userAccessBox = me.ctn.querySelector("div#userAccessBox");
            for(const [right, description] of Object.entries(rights)){
                let nRight = document.createElement("DIV");
                nRight.classList.add("userAccessItem");
                if(cAccess.includes(right)){
                    nRight.classList.add("selMarked");
                    me.selMarker.main.ids.push(right);
                    me.selMarker.main.lastRow = right;
                }
                nRight.id = right;
                nRight.textContent = description;
                userAccessBox.appendChild(nRight);
            }

            // submit changes
            me.ctn.querySelector("input#submitUserEdit").addEventListener("click", function(){
            me._put("data/user_access/"+me.resId, {"access": JSON.stringify(me.selMarker.main.ids)}, function(){location.reload()});
            });
        }, "version": function(me){
            me.setTabs = true;
        }, "zettel": function(me){
            me.setLoadMore = 'zettel_loadmore';
            me.setSelection("main", "div.zettel", true);
            me.resultIds = JSON.parse(me.ctn.querySelector('div#resultIds').textContent);
            argos.setSearchbar();
            
            % if "admin" in user["access"]:
            if(argos.dataList["user_data"] == null){argos.dataList["user_data"] = new DataList("user_data")}
            % end
            // contextmenu
            var cContext = new ContextMenu();
            cContext.addEntry('div.zettel', 'a', 'Detailansicht', function(){argos.load("zettel_detail", me.selMarker["main"]["lastRow"])});
            cContext.addEntry('div.zettel', 'hr', '', null);
            % if ("z_edit" in user["access"] or "editor" in user["access"]):
                cContext.addEntry('div.zettel', 'a', 'Stapelverarbeitung', function(){argos.load("zettel_batch")});
            % end

            % if "z_edit" in user["access"]:
                cContext.addEntry('*', 'a', 'Neuer Zettel erstellen', function(){argos.load("zettel_add")});
            % end
            % if "z_add" in user["access"]:
                cContext.addEntry('*', 'a', 'Zettel importieren', function(){argos.load("zettel_import")});
            % end
            cContext.addEntry('*', 'a', 'Zettel exportieren', function(){argos.load("zettel_export", null, argos.o["zettel"].query)});
            me.setContext = cContext.menu;

            // open zettel detail, if in query
            me.ctn.querySelector("div.zettel_box").addEventListener("dblclick", function(){argos.load("zettel_detail", me.selMarker["main"]["lastRow"])});
            if(argos.getQuery("detail") != null){
                argos.load("zettel_detail", argos.getQuery("detail"))
            }
        }, "zettel_add": function(me){
            // set autocomplete
            me.bindAutoComplete(me.ctn.querySelector("#lemmaInsert"), "lemma_data");
            me.bindAutoComplete(me.ctn.querySelector("#workInput"), "work_data");

            // event listeners
            me.ctn.querySelector("select#operaList").addEventListener("change", function(){
                if(this.value == 1){
                    me.ctn.querySelector("div#minoraEntry").style.display = "block";
                } else {
                    me.ctn.querySelector("div#minoraEntry").style.display = "none";
                }
            });
            me.ctn.querySelector("select#zettelType").addEventListener("change", function(){
                if(this.value == 4){
                    me.ctn.querySelector("div#litEntry").style.display = "block";
                    me.ctn.querySelector("div#noLitEntry").style.display = "none";
                } else {
                    me.ctn.querySelector("div#litEntry").style.display = "none";
                    me.ctn.querySelector("div#noLitEntry").style.display = "block";
                }
            });
            me.ctn.querySelector("input#createZettel").addEventListener("click", function(){
                if(me.ctn.querySelector("#lemmaInsert_hidden").value != 0){
                me.createData(function(){
                    if(argos.o["project"]!=null){
                        me._getJSON("/data/project_new_zettel", function(rData){
                            me._post("/data/zettel_lnk", {"article_id": argos.o["project"].defaultGroupId,
                                "zettel_id": rData[0].id,
                                "display_text": me.ctn.querySelector("textarea[name=txt]").value}, function(){argos.o["project"].refresh()});
                        }, {"created_date": me.ctn.querySelector("input[name=created_date]").value});
                    } else {me.refresh()};
                });
                } else {if(me.ctn.querySelector("#lemmaInsert").value != ""){argos.load("lemma_add")}else{
                alert("Kein Lemma eingetragen!")}}
            });
        }, "zettel_batch": function(me){
            me.setTabs = true;
            me.bindAutoComplete(me.ctn.querySelector("#lemmaInsert"), "lemma_data");
            me.bindAutoComplete(me.ctn.querySelector("#workBatch"), "work_data");
            me.ctn.querySelector("input#lemmaBatchSubmit").addEventListener("click", function(){
                if(me.ctn.querySelector("input[name=lemma_id]").value == 0){argos.load("lemma_add")
                } else if(argos.o["zettel"].selMarker["main"]["ids"].length == 0){alert("Keine Zettel ausgewählt!")
                } else {me.batchUpdateData(argos.o["zettel"].selMarker["main"]["ids"])}
            });
            me.ctn.querySelector("input#workBatchSubmit").addEventListener("click", function(){
                if(me.ctn.querySelector("input[name=work_id]").value == 0){alert("Kein gültiges Werk ausgewählt!")
                } else if(argos.o["zettel"].selMarker["main"]["ids"].length == 0){alert("Keine Zettel ausgewählt!")
                } else {me.batchUpdateData(argos.o["zettel"].selMarker["main"]["ids"])}
            });
            me.ctn.querySelector("input#typeBatchSubmit").addEventListener("click", function(){
                if(argos.o["zettel"].selMarker["main"]["ids"].length == 0){alert("Keine Zettel ausgewählt!")
                } else {me.batchUpdateData(argos.o["zettel"].selMarker["main"]["ids"])}
            });

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
        }, "zettel_detail": function(me){
            me.setTabs = true;

            // set zoom
            if(me.ctn.querySelector(".zoom")!=null){
                me.ctn.querySelector(".zoom").value = argos.userDisplay.zet_zoom*100;
                me.ctn.querySelector(".zoom").addEventListener('change', function(){
                    argos.userDisplay.zet_zoom = event.target.value/100;
                    argos.setUserDisplay();
                    me.ctn.querySelector("div.imgBox").style.transform = "scale("+argos.userDisplay.zet_zoom+")";
                });
                me.ctn.querySelector("div.imgBox").style.transform = "scale("+argos.userDisplay.zet_zoom+")";
            }

            // set resultBrowser
            if(argos.o["zettel"]!=null){me.resultIds = argos.o["zettel"].resultIds}
            if(argos.o["project"]!=null){me.resultIds = argos.o["project"].resultIds}
            me.setResultBrowser(me.resId, function(){me.resId=event.target.id;me.refresh()});
            // replace html tags from lemmaInput
            me.ctn.querySelector('input#lemmaInput').value = me.ctn.querySelector('input#lemmaInput').value.replace(/<[^>]*>/g, '');

            // event listeners
            me.ctn.querySelector('input#newComment').addEventListener('click', function(){me.createData()});
            var cSiblings = []
            me.ctn.querySelectorAll('a.siblingLink').forEach(function(e){
                cSiblings.push(e.id);
                e.onclick = function(){
                    me.resId = this.id;
                    me.refresh();
                };
            });
            if(me.ctn.querySelector('input#createSibling')!=null){
                me.ctn.querySelector('input#createSibling').addEventListener('click', function(){me.createData(function(){
                    if(argos.o["project"]!=null){
                        me._getJSON("/data/zettel", function(rData){
                            me._post("/data/zettel_lnk", {"article_id": argos.o["project"].defaultGroupId,
                                "zettel_id": rData[0].id,
                                "display_text": me.ctn.querySelector("textarea[name=txt]").value}, function(){argos.o["project"].refresh()});
                        }, {"c_date": me.ctn.querySelector("input#cDateSibling").value});
                    }else{me.refresh()}
                })});
            }
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
            me.ctn.querySelector('input#saveZettelChangesNext').addEventListener('click', function(){
                if(me.ctn.querySelector("input#lemmaInput_hidden").value == 0 && me.ctn.querySelector("input#lemmaInput").value != ""){
                event.target.dataset.clicked = "1";
                me.open("zettel_lemma_add");
                } else if(!Number.isInteger(+me.ctn.querySelector("input[name='date_own']").value)){
                    alert("Fehler: Das Sortierdatum muss eine Ganzzahl sein!");
                } else if(me.ctn.querySelector("input[name='date_own']").value==="" && me.ctn.querySelector("input[name='date_own_display']").value!==""){
                    alert("Fehler: Es kann kein Anzeigedatum gesetzt werden ohne ein Sortierdatum!");
                } else {
                    me.updateData(function(){me.ctn.querySelector(".resultBrowser[data-target='1']").click()});
                }
            });
            me.ctn.querySelector('input#saveZettelChanges').addEventListener('click', function(){
                if(me.ctn.querySelector("input#lemmaInput_hidden").value == 0 && me.ctn.querySelector("input#lemmaInput").value != ""){
                me.open("zettel_lemma_add");
                } else if(!Number.isInteger(+me.ctn.querySelector("input[name='date_own']").value)){
                    alert("Fehler: Das Sortierdatum muss eine Ganzzahl sein!");
                } else if(me.ctn.querySelector("input[name='date_own']").value==="" && me.ctn.querySelector("input[name='date_own_display']").value!==""){
                    alert("Fehler: Es kann kein Anzeigedatum gesetzt werden ohne ein Sortierdatum!");
                } else {
                    me.updateData();
                }
            });
            % if "admin" in user["access"]:
                if(me.ctn.querySelector('input#deleteZettel') != null){
                    me.ctn.querySelector('input#deleteZettel').addEventListener('click', function(){
                    if(confirm("Zettel wirklich löschen?")){me.deleteData()}
                    });
                }
            % end

            // set autocomplete
            me.bindAutoComplete(me.ctn.querySelector("#lemmaInput"), "lemma_data");
            me.bindAutoComplete(me.ctn.querySelector("#opusInput"), "work_data");

            // set event listener to delete comments
            me.ctn.querySelectorAll('i.deleteEntry').forEach(function(e){
                e.addEventListener("click", function(){me.deleteData(function(){me.refresh();})});
            });
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
    }
    }
    onLoad(){
        var me = this.o;

        var noLoader = ["lemma_data", "work_data"];
        if(this.loadFunctions[this.o.res] != null){
            this.loadFunctions[this.o.res](me);
        } else if(!noLoader.includes(this.o.res)){
            throw "Loader: No onLoad found for id '" + this.o.res + "'.";
        }
        // set closeLabel
        if(this.o.ctn.querySelector('div.closeLabel') != null){
            this.o.ctn.querySelector('div.closeLabel').addEventListener('click', function(){me.close()});
            //this.o.ctn.querySelector('div.closeLabel').setAttribute('accesskey', 'w');
        }
    }
}
