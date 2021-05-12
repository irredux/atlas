import { Docker } from "/file/js/docker.js";
import { ShortCuts } from "/file/js/shortcuts.js";

export class Argos{
    // windows handler; holds an controls DOM elements 'Oculus'
    constructor(){
        // set default Select-Key depending on operating system
        this.SelectKey = 'Ctrl';
        if (navigator.appVersion.indexOf('Mac') > -1){this.SelectKey = 'Cmd';}

        // set displayValues
        this.getUserDisplay();
        
        // holds element id which fired current contextmenu
        this.contextElementId = 0;

        // set shortcuts
        this.shortCuts = new ShortCuts(this);

        // set main eye
        this.docker = new Docker();

        // get token
        let cToken = sessionStorage.getItem("token");
        try{
            const mlwChannel = new BroadcastChannel("mlwChannel");
            mlwChannel.onmessage = e => {
                if(e.data === "token?" && cToken != null){mlwChannel.postMessage(cToken)}
                else if(this.token==null){this.login(e.data)}
            }
            if(cToken == null){mlwChannel.postMessage("token?")}
        } catch {
            console.log("no BroadCastChannel");
        }

        if(cToken != null){
            this.login(cToken);
        } else {
            let res = "login";
            let resId = null;
            this.loadMain(res, resId)
            /*
            this.mainId = this.getQuery('main')
            if (this.mainId != null){
                this.o[this.mainId] = new Oculus(this.mainId, {classList: ['main'],
                query: this.getQuery('query')});
                this.shortCuts.load(this.mainId);
            }
            // datalists
            this.dataList = {};
            if(this.access.includes("z_edit")){this.dataList["lemma_data"] = new DataList("lemma_data")}
            if(this.access.includes("z_edit")){this.dataList["work_data"] = new DataList("work_data")}
            if(this.access.includes("o_edit")){this.dataList["author_data"] = new DataList("author_data")}
            if(this.access.includes("editor")){this.dataList["projects"] = new DataList("project_data")}
            for(var dl in this.dataList){
                this.dataList[dl].load();
            }
            */
        }
    }

    login(token){
        sessionStorage.setItem("token", token);
        document.body.textContent = "";
        let loadLabel = document.createElement("DIV"); loadLabel.id = "loadLabel";
        loadLabel.textContent = "Datenbank wird aktualisiert... ";
        let loadLabelCurrent = document.createElement("SPAN");
        loadLabelCurrent.style.fontStyle = "italic";
        loadLabel.appendChild(loadLabelCurrent);
        document.body.appendChild(loadLabel);

        // set user values
        /*
        this.access = access;
        this.userId = userId;
        */

        arachne.token = token;
        this.token = token;
        arachne.createDB()
            .then(() => arachne.loadDB(loadLabelCurrent))
            .then(() => fetch("/config/access", {headers: {"Authorization": `Bearer ${this.token}`}}))
            .then(re => re.json())
            .then((access) => {
                this.access = access;
                return fetch("/config/menu", {headers: {"Authorization": `Bearer ${this.token}`}});
            })
            .then(re => re.json())
            .then((items) => {
                loadLabel.remove();
                let headerMenu = document.createElement("DIV");
                headerMenu.id = "headerMenu";
                 // GET mainMenu -> display here!
                for(const item of items){
                    let mainMenuEntry = document.createElement("DIV");
                    mainMenuEntry.classList.add("mainMenuEntry");
                    let mainMenuButton = document.createElement("DIV");
                    mainMenuButton.classList.add("mainMenuButton");
                    mainMenuButton.textContent = item[0];
                    mainMenuEntry.appendChild(mainMenuButton);

                    let mainMenuContent = document.createElement("DIV");
                    mainMenuContent.classList.add("mainMenuContent");
                    for(const subItem of item[1]){
                        let subMenu = document.createElement("DIV");
                        let subMenuA = document.createElement("A");
                        subMenuA.innerHTML = subItem.caption;
                        subMenuA.onclick = () => {argos.loadMain(subItem.onClick)};
                        subMenu.appendChild(subMenuA);
                        mainMenuContent.appendChild(subMenu);
                    }
                    mainMenuEntry.appendChild(mainMenuContent);

                    headerMenu.appendChild(mainMenuEntry);
                }
                document.body.appendChild(headerMenu);
                let res = null;
                let resId = null;
                let path = location.pathname;
                if(path.startsWith("/site")){
                    path = path.slice(6);
                    path = path.split("/");
                    if(path[0]===""){
                    } else if(path.length===1){
                        res = path[0];
                    } else if(path.length===2){
                        res = path[0];
                        resId = path[1];
                    }
                }
                if(res!==null){this.loadMain(res, resId)}
            })
            .catch(e => {throw e});
    }

    /* **************************************** */
    /*          gets/sets userDisplay           */
    /* **************************************** */
    getUserDisplay(){
        this.userDisplay = JSON.parse(localStorage.getItem('userDisplay'));
        if (this.userDisplay == null){this.userDisplay = {};};
        if (!('e_view' in this.userDisplay)) {this.userDisplay.e_view = 'ex'};
        if (!('z_width' in this.userDisplay)) {this.userDisplay.z_width = 500}; // width of zettel in zettel-db/project
        if (!('ed_zoom' in this.userDisplay)) {this.userDisplay.ed_zoom= 1};
        if (!('zet_zoom' in this.userDisplay)) {this.userDisplay.zet_zoom= 1}; // zoom of zettel in zettel_detail

        // sets width of zettel
        document.documentElement.style.setProperty("--zettelWidth", this.userDisplay.z_width+"px");
        document.documentElement.style.setProperty("--zettelHeight", (this.userDisplay.z_width*0.71)+"px");
    }
    setUserDisplay(){
        localStorage.setItem('userDisplay', JSON.stringify(this.userDisplay));
    }

    /* **************************************** */
    /*          load and close elements         */
    /* **************************************** */
    loadMain(res, resId=null){
        let url = `/site/${res}`;
        if(resId){url+=`/${resId}`}
        if(event!=null && ((this.SelectKey == 'Ctrl' && event.ctrlKey) ||
            (this.SelectKey == 'Cmd' && event.metaKey))){
            Object.assign(document.createElement("A"), {target: "_blank", href: url}).click();
        } else {
            // sets new site
            if(this.main!=null){this.main.close()}
            this.main = this.docker.load(res, resId, this.access, true);
            if(res!="login"){history.pushState('', '', url)}

            // set shortcuts
            this.shortCuts.load(res);

            /*
            this.setQuery("main", res);
            if (this.mainId != res){
                if (this.o[this.mainId] != null){this.o[this.mainId].close()}
                // load fresh content
                if(resId==null){
                    this.mainId = res;
                    this.o[this.mainId] = new Oculus(this.mainId, {classList: ['main']});
                }else{
                    this.mainId = res;
                    this.o[this.mainId] = new Oculus(this.mainId, {classList: ['main'], resId: resId});
                }
            }
            */
        }
    }
    loadEye(res, resId=null, query=null){
        this.main.o[res]=this.docker.load(res, resId, this.access, false);
        //this.o[res] = new Oculus(res, {resId: resId, query: query});
    }
    popEye(){
        // removes the last eye from main; used the close popover windows with "w"
        let oKeys = Object.keys(argos.main.o);
        if(oKeys.length > 0){
            argos.main.o[oKeys[oKeys.length-1]].close();
            delete argos.main.o[oKeys[oKeys.length-1]];
        }
    }
    /* **************************************** */
    /*        get/set status of tabs            */
    /* **************************************** */
    setTabs(tabGroup, tabName) {
        let myTabs = this.getTabs();
        if(myTabs == null){myTabs = {}}
        myTabs[tabGroup] = tabName;
        sessionStorage.setItem('tab_status', JSON.stringify(myTabs));
    }
    getTabs() {
        let myTabs = JSON.parse(sessionStorage.getItem('tab_status'));
        return myTabs;
    }

    /* **************************************** */
    /*        get/set query from uri            */
    /* **************************************** */
    /*
    getQuery(sPara) {
        // function to get url parameter
        var sPageURL = window.location.search.substring(1);
        var sURLVariables = sPageURL.split('&');
        for (var i = 0; i < sURLVariables.length; i++) {
            var sParameterName = sURLVariables[i].split('=');
            if (sParameterName[0] == sPara) {
                return decodeURIComponent(sParameterName[1]);
            }
        }
    }

    setQuery(nPara, nValue) {
        nPara = encodeURIComponent(nPara);
        nValue = encodeURIComponent(nValue);
        var cParas = document.location.search.substr(1).replace(/=/g, '":"').replace(/&/g, '","');
        if (cParas != ''){
            cParas = JSON.parse('{"' + cParas + '"}');
        } else {
            cParas = {};
        }
        if (nValue != ''){
            cParas[nPara] = nValue;
        } else if (nValue == '' && cParas[nPara] != null){
            delete cParas[nPara];
        }
        var nParas = JSON.stringify(cParas);
        if (nParas != '{}'){
            nParas = '?' + nParas.substring(2, nParas.length-2).replace(/":"/g, '=').replace(/","/g, '&');
        } else {
            nParas = '';
        }
        history.pushState('', '', '/'+nParas);
    }
    */

}