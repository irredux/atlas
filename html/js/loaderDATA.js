    this.loadFunctions = {
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
    }
