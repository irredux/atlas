export { Oculus };

class Oculus{
    // loads any kind of additional data from server into HTML element
    constructor(res, resId=null, access=[], main=false){//p={}){
        // save values
        this.res = res;
        this.resId = parseInt(resId);
        this.access = access;
        this.type = "DIV";
        this.classList = "";
        //if(main){this.type = "MAIN"}
        //if (p["type"] != null){this.type = p["type"]}else{this.type = "div"}
        //if (p["classList"] != null){this.classList = p["classList"]}else{this.classList = []}

        this.o = {}; // contains popup windows
        this.loadMore = {};
        this.selMarker = {};
        this.resultIds = [];
        this.contextElementId = null; // stores the current id of event.target
        this.context = null; // stores current context-menu 

        // create dom element
        if (document.getElementById(this.res) != null){
            document.getElementById(this.res).remove();
        }
        this.refresh();
    }

    /* **************************************** */
    /*               load and close             */
    /* **************************************** */
    async refresh(){
        let newElement = document.createElement(this.type);
        newElement.id = this.res;
        newElement.classList = this.classList;
        if(this.ctn == null){document.body.appendChild(newElement)}
        else{document.body.replaceChild(newElement, this.ctn)}
        this.ctn = newElement;
        
        this.ctn.innerHTML = "<div id='loadLabel'>Inhalt wird geladen...</div>";
        await this.load();
        try{document.getElementById("loadLabel").remove()}
        catch{}
    }
    open(res, resId = null, query=null, type=null){
        this.o[res] = new Oculus(res, {resId: resId, query: query, type: type});
    }
    close(){
        // remove all the content
        for (var id in this.o){
            this.o[id].close();
        }
        this.ctn.remove();
    }

    /* **************************************** */
    /*                 selection                */
    /* **************************************** */
    setSelection(selId, selector, multiselect=true, onEdit=null, dataList=null){
        var me = this;
        this.selMarker[selId] = {'lastRow': 0, 'ids': []};
        if(multiselect){
            this.ctn.style.userSelect = 'none';
            this.ctn.style.msUserSelect = 'none';
            this.ctn.style.WebkitUserSelect = 'none';
        }
        if(onEdit!=null){this.ctn.querySelectorAll(selector).forEach(function(e){
                e.classList.add("selEditable");
        })}
        this.ctn.addEventListener('mouseup', function(){
            if(event.target.closest(selector) != null){
                let cTarget = event.target.closest(selector);
                let cElements = me.ctn.querySelectorAll(selector);
                //event.stopImmediatePropagation();
                // make selection
                if (multiselect == true && event.shiftKey && me.selMarker[selId]['lastRow'] > 0){
                    me.selMarker[selId]['ids'] = [];
                    let startSelect = false;
                    cElements.forEach(function(e){
                        if(startSelect && (e.id == me.selMarker[selId]['lastRow'] ||
                            e.id == cTarget.id)){
                            me.selMarker[selId]['ids'].push(e.id);
                            startSelect = false;
                        } else if (startSelect == true){
                            me.selMarker[selId]['ids'].push(e.id);
                        } else if(startSelect == false && (e.id == me.selMarker[selId]['lastRow'] ||
                            e.id == cTarget.id)){
                            startSelect = true;
                            me.selMarker[selId]['ids'].push(e.id);
                        }
                    });
                } else if (multiselect &&
                    ((argos.SelectKey == 'Ctrl' && event.ctrlKey) ||
                    (argos.SelectKey == 'Cmd' && event.metaKey))){
                    me.selMarker[selId]['lastRow'] = cTarget.id;
                    var cIndex = me.selMarker[selId]['ids'].indexOf(cTarget.id);
                    if (cIndex > -1){
                        me.selMarker[selId]['ids'].splice(cIndex, 1);
                    } else {
                        me.selMarker[selId]['ids'].push(cTarget.id);
                    };
                } else if(!(me.selMarker[selId]['ids'].includes(cTarget.id) &&
                    ((argos.SelectKey == 'Ctrl' && event.ctrlKey) ||
                        (argos.SelectKey == 'Cmd' && event.metaKey) || event.which == 3))){
                    // single element selected
                    // set edit-mode?
                    if(onEdit!= null && cTarget.id==me.selMarker[selId]["lastRow"] &&
                        (Date.now()-me.selMarker[selId]["lastClicked"])>500){
                        if(cTarget.tagName==="INPUT"){
                            cTarget.disabled=false;
                            cTarget.focus();
                        }else{cTarget.setAttribute("contenteditable", true)}
                        cTarget.classList.remove("selEditable");
                        cTarget.style.outline = "none";
                        cTarget.style.userSelect = "text";
                        cTarget.style.webkitUserSelect = "text";
                        /* *************** */
                        /*
                        if(dataList!=null){
                            me.bindAutoComplete(cTarget, "work", ["id", "ac_web"]);
                        }
                        */
                        /* *************** */
                        cTarget.addEventListener("blur", function(){
                            cTarget.setAttribute("contenteditable", false);
                            if(onEdit!=null && !cTarget.classList.contains("selEditable")){
                                me.selMarker[selId]["lastClicked"] = null;
                                cTarget.classList.add("selEditable");
                                onEdit();
                            }
                        });
                        if(cTarget.getAttribute("list")===null){
                            cTarget.addEventListener("keydown", function(){
                                if(event.which==13){
                                    event.preventDefault();
                                    cTarget.blur();
                                }
                            });
                        }
                    }else{
                        if(onEdit!=null){me.selMarker[selId]["lastClicked"] = Date.now()}
                        me.selMarker[selId]['lastRow'] = cTarget.id;
                        me.selMarker[selId]['ids'] = [cTarget.id];
                    }
                }

                // mark selected zettel
                me.ctn.querySelectorAll(selector).forEach(function(e){
                    if(me.selMarker[selId]['ids'].includes(e.id)){
                        e.classList.add('selMarked');
                    } else {
                        e.classList.remove('selMarked');
                    }
                });
            }
        });
    }

    /* **************************************** */
    /*                 load more                */
    /* **************************************** */
    setLoadMore(LMctn, resultList){
        console.log("im setting loadmore");
        this.loadMore = {ctn: LMctn, resultList: resultList, position: 0};
        this.ctn.onscroll = () =>{
            if(this.ctn.scrollHeight - 200 <= this.ctn.offsetHeight+this.ctn.scrollTop){
                this.startLoadMore();
            }
        }
        this.startLoadMore();
    }

    async startLoadMore(){
        if(this.loadMore.resultList.length > this.loadMore.position){
            let i = this.loadMore.position;
            let max = (i+100 < this.loadMore.resultList.length) ? i+100 : this.loadMore.resultList.length;
            for(; i<max; i++){
                const nElement = await this.contentLoadMore(this.loadMore.resultList[i]);
                this.loadMore.ctn.appendChild(nElement);
            }
            this.loadMore.position = i;
        }
    }

    /* **************************************** */
    /*                 forms                    */
    /* **************************************** */
    formToObject(cForm){
        // converts html form into js object
        // inputs with class 'noUpload' are not uploaded.
        let nData = {}
        let cElements = cForm.querySelectorAll("input:not(.noUpload), textarea:not(.noUpload), select:not(.noUpload)");
        cElements.forEach(function(e){
            if(!(e.getAttribute("type") == "checkbox" || e.getAttribute("type") == "radio") || 
                e.checked){
                if((e.classList.contains("isNumber") && e.value != "") ||
                    !e.classList.contains("isNumber")){
                        nData[e.getAttribute("name")] = e.value;
                }
            }
        });
        return nData;
    }

    OLDcreateData(doneFunction=null){
        // submits form; object calling this function needs to be in it!
        // inputs with class 'noUpload' are not uploaded.
        var cForm = event.target.closest("form"); var nRes = "";
        if(cForm.querySelector("input[type=file]") != null){
            var formData = new FormData(cForm); 
            nRes = cForm.querySelector("input[name=res]").value;
        } else {
            var nData = {}
            var cElements = cForm.querySelectorAll("input:not(.noUpload), textarea:not(.noUpload), select:not(.noUpload)");
            cElements.forEach(function(e){
                if(e.getAttribute("name") == "res"){
                    nRes = e.value;
                    /*
                } else if(e.getAttribute("type") == "file"){
                    // upload file(s)
                    filesFound = true;
                    let files = e.files;
                    for (var i = 0; i < files.length; i++){
                        let file = files[i];
                        formData.append("files[]", file, file.name);
                    }
                    */
                } else if(!(e.getAttribute("type") == "checkbox" || e.getAttribute("type") == "radio") || 
                    e.checked){
                    if((e.classList.contains("isNumber") && e.value != "") ||
                        !e.classList.contains("isNumber")){
                            nData[e.getAttribute("name")] = e.value;
                    }
                }
            });
            if (nRes == ""){throw "createData: No valid data for resource '"+nRes+"'."}
        }
        if(formData != null){this._post("/data/"+nRes, formData, doneFunction)
        } else {this._post("/data/"+nRes, nData, doneFunction)}
        
    }
    OLDupdateData(doneFunction=null){
        // submits form; object calling this function needs to be in it!
        // inputs with class 'noUpload' are not uploaded.
        var cForm = event.target.closest("form");
        var nData = {}; var nRes = ""; var nResId = "";
        var cElements = cForm.querySelectorAll("input:not(.noUpload), textarea:not(.noUpload), select:not(.noUpload)");
        cElements.forEach(function(e){
            if(e.getAttribute("name") == "res"){
                nRes = e.value;
            } else if (e.getAttribute("name") == "resId"){
                nResId = e.value;
            } else if(!(e.getAttribute("type") == "checkbox" || e.getAttribute("type") == "radio") || 
                e.checked){
                if((e.classList.contains("isNumber") && e.value != "") ||
                    !e.classList.contains("isNumber")){
                    nData[e.getAttribute("name")] = e.value;
                }
            }
        });
        if(nRes == ""){
            throw "updateData: No valid data for resource '"+nRes +"'.";
        } else {
            if(nResId != ""){
                this._put("/data/"+nRes+"/"+nResId, nData, doneFunction);
            } else {
                this._put("/data/"+nRes, nData, doneFunction);
            }
        }
    }
    OLDdeleteData(doneFunction=null){
        // inputs with class 'noUpload' are not uploaded.
        var cForm = event.target.closest("form");
        var nData = {};
        var nRes = cForm.querySelector("input[name=res]").value;
        var nResId = cForm.querySelector("input[name=resId]").value;
        if(nRes == "" || nResId == ""){
            throw "deleteData: No valid data for resource '"+nRes +"' or id '"+nResId+"'.";
        } else {
            this._delete("/data/"+nRes+"/"+nResId, doneFunction);
        }
    }

    OLDbatchUpdateData(idArray, doneFunction=null){
        // submits batch Updates; object calling this function needs to be in it!
        // inputs with class 'noUpload' are not uploaded.
        var cForm = event.target.closest("form");
        var nData = {}; var nRes = ""; var nResId = "";
        var cElements = cForm.querySelectorAll("input:not(.noUpload), textarea:not(.noUpload), select:not(.noUpload)");
        cElements.forEach(function(e){
            if(e.getAttribute("name") == "res"){
                nRes = e.value;
            } else if (e.getAttribute("name") == "resId"){
                nResId = e.value;
            } else if(!(e.getAttribute("type") == "checkbox" || e.getAttribute("type") == "radio") || 
                e.checked){
                if((e.classList.contains("isNumber") && e.value != "") ||
                    !e.classList.contains("isNumber")){
                    nData[e.getAttribute("name")] = e.value;
                }
            }
        });
        if(nRes == ""){
            throw "updateData: No valid data for resource '"+nRes+"'.";
        } else {
            var items = [];
            for(var id of idArray){items.push({"res_id": id, "data": nData})}
            this._post("/batch", {"res": nRes, "mode": "update", "items": items}, doneFunction);
        }
    }

    /* **************************************** */
    /*              contextmenu                 */
    /* **************************************** */
    set setContext(content){
        this.context = content;
        this.eventTarget = null;
        var me = this;
        document.addEventListener('click', function(){
            let oldContextMenu = document.getElementById('conTextMenu');
            if (oldContextMenu != null){oldContextMenu.remove()}
        });

        this.ctn.addEventListener('contextmenu', function _openContext(){
            event.preventDefault(); event.stopPropagation();
            me.eventTarget = event.target;
            var oldContextMenu = document.getElementById('conTextMenu');
            if (oldContextMenu != null){oldContextMenu.remove()}
            me.contextElementId = null;

            // create contextmenu content
            var cHook = null;
            var nContext = document.createElement('div');
            nContext.id = 'conTextMenu';
            for (var i = 0; i < me.context.length; i++){
                let create = false;
                if (me.context[i].selector == "*"){
                    create = true;
                } else if (cHook == me.context[i].selector){
                    create = true;
                } else if (event.target.closest(me.context[i].selector) != null){
                    cHook = me.context[i].selector;
                    me.contextElementId = event.target.closest(cHook).id;
                    create = true;
                };
                if(create){
                    let cLine = document.createElement(me.context[i].element);
                    cLine.textContent = me.context[i].description;
                    cLine.onclick = me.context[i].action;
                    let cLineDiv = document.createElement("div");
                    cLineDiv.appendChild(cLine);
                    nContext.appendChild(cLineDiv);
                }
            }
            
            // position and display context menu
            if(nContext.children.length > 0){
                nContext.style.left = (event.pageX-me.ctn.offsetLeft)+'px';
                nContext.style.top = (event.pageY+me.ctn.scrollTop-me.ctn.offsetTop)+'px';
                me.ctn.appendChild(nContext);
            }
        });
    }

    /* **************************************** */
    /*                  tabs                    */
    /* **************************************** */
    set setTabs(active = true){
        var cTabHeaders = this.ctn.querySelectorAll('.tab_header');
        if (cTabHeaders.length > 0) {
            var me = this;
            var myTabs = argos.getTabs();
            if (myTabs != null) {
                cTabHeaders.forEach(function(e){
                    if(Object.keys(myTabs).includes(e.getAttribute("name"))){
                        var cTab = e.querySelector(".tab[name="+myTabs[e.getAttribute("name")]+"]")
                        if(cTab!= null){
                            cTab.classList.add("tabActive");
                            me.ctn.querySelector(".tab_content > .tab_container[name="+cTab.getAttribute("name")+"]").classList.add("tabActive");
                        } else {
                            // tab not found
                            e.querySelector(".tab:first-child").classList.add("tabActive");
                            me.ctn.querySelector(".tab_content[name="+e.getAttribute("name")+"] > .tab_container:first-child").classList.add("tabActive");
                        }
                    } else {
                        // no entry for this tabHeader
                        e.querySelector(".tab:first-child").classList.add("tabActive");
                        me.ctn.querySelector(".tab_content[name="+e.getAttribute("name")+"] > .tab_container:first-child").classList.add("tabActive");
                    }
                });
            } else {
                // no stored values; set first tabs as active
                this.ctn.querySelectorAll(".tab_header > .tab:first-child, .tab_content > .tab_container:first-child").forEach(function(e){
                    e.classList.add("tabActive");
                    if(e.classList.contains('tab')){
                        argos.setTabs(e.closest(".tab_header").getAttribute("name"), e.getAttribute("name"));
                    }
                });
            }

            // set Event Listener
            this.ctn.addEventListener("click", function(){
                if(event.target.classList.contains("tab") &&
                    !event.target.classList.contains("tabActive")){
                    var activeContent = null;
                    var notActiveContent = null;
                    event.target.closest("div.tab_header").querySelectorAll(".tab").forEach(function(e){
                        if(e.isSameNode(event.target)){
                            e.classList.add("tabActive");
                            argos.setTabs(e.closest(".tab_header").getAttribute("name"), e.getAttribute("name"));
                            activeContent = me.ctn.querySelector("div.tab_container[name="+e.getAttribute("name")+"]");
                        } else if (e.classList.contains("tabActive")){
                            e.classList.remove("tabActive");
                            notActiveContent = me.ctn.querySelector("div.tab_container[name="+e.getAttribute("name")+"]");
                        }
                    });
                    activeContent.classList.add("tabActive");
                    notActiveContent.classList.remove("tabActive");
                }
            });
        }
    }

    /* **************************************** */
    /*               resultBrowser              */
    /* **************************************** */
    setResultBrowser(currentIndex, clickFunction){
        this.ctn.querySelector("#resultBrowserTotal").textContent = this.resultIds.length;
        this.ctn.querySelectorAll(".resultBrowser").forEach(function(e){
            e.addEventListener("click", clickFunction);
        });
        this.refreshResultBrowser(currentIndex);
    }
    refreshResultBrowser(cIndex){
        this.ctn.querySelector("#resultBrowserCurrent").textContent =  this.resultIds.indexOf(parseInt(cIndex))+1;
        var me = this;
        this.ctn.querySelectorAll(".resultBrowser").forEach(function(e){
            switch(e.dataset.target){
                case "first":
                    if(me.resultIds[0] == cIndex){
                        e.hidden = true;
                    } else {
                        e.hidden = false;
                        e.id = me.resultIds[0];
                    }
                    break;
                case "last":
                    if(me.resultIds[me.resultIds.length-1] == cIndex){
                        e.hidden = true;
                    } else {
                        e.hidden = false;
                        e.id = me.resultIds[me.resultIds.length-1];
                    }
                    break;
                default:
                    if(me.resultIds.indexOf(parseInt(cIndex)) + parseInt(e.dataset.target) < 0){
                        e.hidden = true;
                    } else if(me.resultIds.indexOf(parseInt(cIndex)) + parseInt(e.dataset.target) > me.resultIds.length-1){
                        e.hidden = true;
                    } else {
                        e.hidden = false;
                        e.id = me.resultIds[me.resultIds.indexOf(parseInt(cIndex)) + parseInt(e.dataset.target)];
                    }
            }
        });
    }

    /* **************************************** */
    /*              autocomplete               */
    /* **************************************** */
    async bindAutoComplete(cInput, dbTable, dbReturnCols, dbQuery = "*"){
        /*
         dbReturnCols:
            Array containing internal value (i.e. id) as first value
            and external value (i.e. string displayed in autocomplete menu) as second value
            ["id", "lemma_display"]
         */
        let search = await arachne[dbTable].search(dbQuery, dbReturnCols);
        let data = [];
        for(const item of search){
            if(item[dbReturnCols[1]]!=null){
                data.push([item[dbReturnCols[1]].replace(/&gt;/g, ">").replace(/&lt;/g, "<").replace(/<[^>]*>/g, ""),
                    item[dbReturnCols[0]]]);
            }
        }
        new AutoComplete(cInput, data);
    }
}

class AutoComplete{
	constructor(iEl, dList){
        /*
         * iEl is input element on which the select-menu will be added.
         * data-selected holds the result value of a match (i.e. a correct value is selected)
         * dList: array containting [key, value] pairs.
         */
		this.currentFocus;
		this.iEl=iEl;
		let that = this;
		// create div around input
		let divContainer = document.createElement("DIV");
		divContainer.style.position = "absolute";
        divContainer.style.zIndex = "999999999";
		iEl.addEventListener("input", function(e){
            delete iEl.dataset.selected;
            const pos = iEl.getBoundingClientRect();
            divContainer.style.width = pos.width<200?"200px":`${pos.width}px`;
            divContainer.style.left = `${pos.left}px`;
            divContainer.style.top = `${pos.top+pos.height}px`;
            document.body.appendChild(divContainer);

			let a, b, i;
			let val = ""
			if(this.tagName === "INPUT"){val=this.value}
			else{val=this.textContent}
            iEl.style.color="inherit"
			that.closeAllLists();
			if(!val){return false;}
			that.currentFocus = -1;
			a = document.createElement("DIV");
			a.id = "autocomplete-list";
			a.classList.add("autocomplete-items");
			divContainer.appendChild(a);
			for(let item of dList){
				if(item[0].substr(0, val.length).toUpperCase()==val.toUpperCase()){
					b = document.createElement("DIV");
					b.innerHTML = `<strong>${item[0].substr(0,val.length)}</strong>${item[0].substr(val.length)}`;
					b.dataset.value = item[0];
					b.dataset.id = item[1];
					b.addEventListener("click", function(e){
						if(iEl.tagName==="INPUT"){iEl.value=this.dataset.value}
						else{iEl.textContent=this.dataset.value}
                        iEl.dataset.selected = this.dataset.id;
                        iEl.style.color="var(--mainColor)"
						that.closeAllLists();
					});
					a.appendChild(b);
				}
			}
		});
		// use arrow keys or enter
		iEl.addEventListener("keydown", function(e){
			let x = divContainer.querySelector("#autocomplete-list");
			if(x) x=x.getElementsByTagName("DIV");
			if(e.keyCode==40){
				that.currentFocus++;
				that.addActive(x);
			} else if (e.keyCode == 38){
				that.currentFocus--;
				that.addActive(x);
			} else if(e.keyCode == 13){
				e.preventDefault();
				if(that.currentFocus>-1){
					if(x)x[that.currentFocus].click();
				}
			}
		});
		// when clicked somewhere else
		document.addEventListener("click", function(e){that.closeAllLists(e.target)});
	}
	closeAllLists(elmnt){
		let that = this;
		document.querySelectorAll(".autocomplete-items").forEach(function(e){
			if(elmnt!=e&&elmnt!=that.iEl){e.remove()}
		});
	}
	addActive(x){
		if(!x) return false;
		this.removeActive(x);
		if(this.currentFocus >=x.length) this.currentFocus=0;
		if(this.currentFocus <0) this.currentFocus=x.length-1;
		x[this.currentFocus].classList.add("autocomplete-active");
	}
	removeActive(x){
		for(let item of x){item.classList.remove("autocomplete-active")}
	}
}
