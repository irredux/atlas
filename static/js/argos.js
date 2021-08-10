import { ShortCuts } from "/file/js/shortcuts.js";

export class Argos{
    // windows handler; holds an controls DOM elements 'Oculus'
    constructor(dock){
        this.dock = dock;
        this.SelectKey = 'Ctrl';
        if (navigator.appVersion.indexOf('Mac') > -1){this.SelectKey = 'Cmd';}

        this.getUserDisplay();
        
        this.contextElementId = 0; // holds element id which fired current contextmenu
        this.shortCuts = new ShortCuts(this);

        // login
        const login = async () => {
            this.access = await fetch("/config/access", {headers: {"Authorization": `Bearer ${arachne.key.token}`}})
                .then(re => {
                    if(re.status === 200){return re.json()}
                    else{window.open("/", "_self")}
                });
            if(!location.pathname.startsWith("/site/viewer/")){
                await arachne.login();
                await this.loadMainNav();
            } else {
                // start up viewer
                await arachne.login(false);
                this.loadMain("viewer", location.pathname.substring(13));
            }
        }
        this.URLSearch = this.getSearch();
        login();

    }

    async user(){ // ==> ARACHNE
        try {
            const re = await fetch("/session", { headers: { "Authorization": `Bearer ${arachne.key.token}` } });
            return await re.json();
        } catch (e) {
            throw e;
        }
    }

    async loginOLD(){
        console.log(this.URLSearch);
        //const lastFullUpdate = localStorage.getItem("lastFullUpdate");
        if(!location.pathname.startsWith("/site/viewer/")){ 
            this.access = await fetch("/config/access", {headers: {"Authorization": `Bearer ${arachne.key.token}`}})
                .then(re => {if(re.status === 200){return re.json()}});

            document.body.innerHTML = "<main></main><aside></aside><footer></footer>";
            await this.loadMainNav();

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
        } else {
            // start up viewer
            await arachne.loadDB(false)
            fetch("/config/access", {headers: {"Authorization": `Bearer ${arachne.key.token}`}})
                .then(re => {if(re.status === 200){return re.json()}})
                .then((access) => {
                    this.access = access;
                    console.log(location.pathname.substring(13));
                    this.loadMain("viewer", location.pathname.substring(13));
                })
                .catch(e => {throw e});
        }
    }
    async loadMainNav(){
        const items = await fetch("/config/menu", {headers: {"Authorization": `Bearer ${arachne.key.token}`}})
            .then(re => {
                if(re.status === 200){return re.json()}
                else{window.open("/", "_self")}
            });
        let headerMenu = document.createElement("NAV");
        headerMenu.id = "headerMenu";
        let displayHeaderMenu = document.createElement("DIV");
        displayHeaderMenu.classList.add("fas", "fa-ellipsis-v");
        displayHeaderMenu.id = "displayHeaderMenu";
        const toggleShow = () => {
            displayHeaderMenu.classList.toggle("show");
            displayHeaderMenu.classList.toggle("fa-ellipsis-v");
            displayHeaderMenu.classList.toggle("fa-ellipsis-h");
            headerMenu.classList.toggle("show");
        }
        displayHeaderMenu.onclick = toggleShow;
        document.body.append(displayHeaderMenu);
        let headerMenuUL = document.createElement("UL");
        headerMenu.append(headerMenuUL);
        for(const item of items){
            let mainMenuEntry = document.createElement("LI");
            mainMenuEntry.innerHTML = "<span>"+item[0]+"</span>";
            for(const subItem of item[1]){
                let subMenuEntry = document.createElement("LI");
                let subMenuA = document.createElement("A");
                subMenuA.innerHTML = subItem.caption;
                subMenuA.onclick = () => {toggleShow(); argos.loadMain(subItem.onClick)};
                subMenuEntry.append(subMenuA);
                mainMenuEntry.append(subMenuEntry);
            }
            headerMenuUL.append(mainMenuEntry);
        }
        document.body.append(headerMenu);
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
        if (!('sOrder' in this.userDisplay)) {this.userDisplay.sOrder = 0}; // search order - 0: normal (ie lemma/date...); 1: id
        if (!('optimize' in this.userDisplay)) {this.userDisplay.optimize = ["lemma", "zettel"]};

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

        switch(res){
            case "zettel-neu":
                if(this.main!=null){this.main.close()}
                mainZettel();
                break;
            default:
                let mainBody = document.querySelector("main");
                let mainHeader = document.querySelector("header");
                let mainFooter = document.querySelector("footer");
                let mainAside = document.querySelector("aside");
                mainBody.style.display = "none";
                mainHeader.style.display = "none";
                mainFooter.style.display = "none";
                mainAside.style.display = "none";

                let url = `/site/${res}`;
                if(resId){url+=`/${resId}`}
                if(event!=null && ((this.SelectKey == 'Ctrl' && event.ctrlKey) ||
                    (this.SelectKey == 'Cmd' && event.metaKey))){
                    Object.assign(document.createElement("A"), {target: "_blank", href: url}).click();
                } else {
                    // sets new site
                    if(this.main!=null){this.main.close()}
                    this.main = this.load(res, resId, this.access, true);
                    if(res!="login"){history.pushState('', '', url)}

                    // set shortcuts
                    this.shortCuts.load(res);
                }
        }
    }
    loadEye(res, resId=null, query=null){
        this.main.o[res]=this.load(res, resId, this.access, false);
    }
    load(res, resId = null, access= [], main = false){
        if(this.dock[res] != null){
            return new this.dock[res](res, resId, access, main);
        }else{throw `Argos: No dock found for res "${res}".`}
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
    getSearch() {
        const qString = window.location.search;
        if(qString != ""){
            const paras = new URLSearchParams(qString);
            let re = {};
            for(const e of paras.entries()){
                re[e[0]] = e[1];
            }
            return re;
        } else {return {};}
    }
}

async function mainZettel(){
    let mainBody = document.querySelector("main");
    let mainHeader = document.querySelector("header");
    let mainFooter = document.querySelector("footer");
    let mainAside = document.querySelector("aside");
    mainHeader.style.display = "block";
    mainBody.style.display = "block";
    mainHeader.innerHTML = `
        <input type="text" placeholder="Suchbegriff eingeben..." style="width: 80%;" />
        <input type="button" value="suchen" />
    `;
    const mainTxt = await fetch("/site/zettel", {headers: {"Authorization": `Bearer ${arachne.key.token}`}})
    .then(re => {
        if(re.status === 200){return re.text()}
        else{window.open("/", "_self")}
    });
    mainBody.innerHTML = mainTxt;
}