export { Arachne };

class Key{
    constructor(){
    }
    removeToken(){
        localStorage.removeItem("key");
        window.open("/", "_self");
    }
    get token(){
        return localStorage.getItem("key");
    }
    set token(nToken){
        throw "SET TOKEN????";
        /*
        this.myToken = nToken;
        this.timeOut = Date.now()+this.TimeLimit;
        localStorage.setItem("key", JSON.stringify({timeOut: this.timeOut, token: this.myToken}));
        */
    }
}

class ArachneWrapper{
    constructor(tblName, dbName, dbVersion, optimize, sOrderActive){
        this.worker = new Worker("/file/js/arachneWW.js");
        this.tblName = tblName;
        this.dbName = dbName;
        this.dbVersion = dbVersion;
        this.optimize = optimize;
        this.sOrderActive = sOrderActive;
        this.workId = 0;
    }
    stringToQuery(string){
        this.workId ++;
        const cWorkId = this.workId;
        return new Promise((resolve, reject) => {
            this.worker.onmessage = msg => {
                if(msg.data.workId === cWorkId){resolve(msg.data.query)}
            }
            this.worker.postMessage({
                workId: this.workId,
                request: "STRINGTOQUERY",
                string: string
            });
        });
    }
    load(){
        this.workId ++;
        const cWorkId = this.workId;
        return new Promise((resolve, reject) => {
            this.worker.onmessage = msg => {
                if(msg.data.workId === cWorkId){resolve()}
                else{reject()}
            }
            this.worker.postMessage({
                workId: this.workId,
                request: "LOAD",
                tblName: this.tblName,
                dbName: this.dbName,
                dbVersion: this.dbVersion,
                optimize: this.optimize, 
                sOrder: argos.userDisplay.sOrder,
                token: arachne.key.token
            });
        });
    }
    update(){
        this.workId ++;
        const cWorkId = this.workId;
        return new Promise((resolve, reject) => {
            this.worker.onmessage = msg => {
                if(msg.data.workId === cWorkId){resolve()}
                else{reject()}
            }
            this.worker.postMessage({
                workId: this.workId,
                request: "UPDATE",
                token: arachne.key.token
            });
        });
    }
    version(){
        this.workId ++;
        const cWorkId = this.workId;
        return new Promise((resolve, reject) => {
            this.worker.onmessage = msg => {
                if(msg.data.workId === cWorkId){
                    let data = msg.data;
                    switch(data.status){
                        case 200:
                            resolve(data.version);
                            break;
                        case 401:
                            argos.loadMain("login");
                            break;
                        default:
                            reject();
                    }
                }
            }
            this.worker.postMessage({
                workId: this.workId,
                request: "VERSION"
            });
        });
    }
    search(query, returnCols="*", orderIndex = null, limit=null){
        this.workId ++;
        const cWorkId = this.workId;
        return new Promise((resolve, reject) => {
            this.worker.onmessage = msg => {
                if(msg.data.workId === cWorkId){
                    let data = msg.data;
                    resolve(data.results);
                    /*
                    switch(data.status){
                        case 200:
                            resolve(data.results);
                            break;
                        case 401:
                            argos.loadMain("login");
                            break;
                        default:
                            reject();
                    }*/
                }
            }
            if(this.sOrderActive && argos.userDisplay.sOrder === 1){
                orderIndex = null;
            } else if (this.sOrderActive && argos.userDisplay.sOrder === 0){
                orderIndex = this.tblName;
            }
                sOrder: argos.userDisplay.sOrder,
            this.worker.postMessage({
                workId: this.workId,
                request: "SEARCH",
                query: query,
                returnCols: returnCols,
                orderIndex: orderIndex,
                limit: limit,
                token: arachne.key.token
            });
        });
    }
    is(searchValue, index=null, removeArray = true){
        this.workId ++;
        const cWorkId = this.workId;
        return new Promise((resolve, reject) => {
            this.worker.onmessage = msg => {
                if(msg.data.workId === cWorkId){
                    let data = msg.data;
                    switch(data.status){
                        case 200:
                            resolve(data.results);
                            break;
                        case 401:
                            argos.loadMain("login");
                            break;
                        default:
                            reject();
                    }
                }
            }
            this.worker.postMessage({
                workId: this.workId,
                request: "IS",
                searchValue: searchValue,
                index: index,
                removeArray: removeArray,
                token: arachne.key.token
            });
        });
    }
    bound(lowerSearch, upperSearch, index=null, removeArray = false){
        this.workId ++;
        const cWorkId = this.workId;
        return new Promise((resolve, reject) => {
            this.worker.onmessage = msg => {
                if(msg.data.workId === cWorkId){
                    let data = msg.data;
                    switch(data.status){
                        case 200:
                            resolve(data.results);
                            break;
                        case 401:
                            argos.loadMain("login");
                            break;
                        default:
                            reject();
                    }
                }
            }
            this.worker.postMessage({
                workId: this.workId,
                request: "BOUND",
                lowerSearch: lowerSearch,
                upperSearch: upperSearch,
                index: index,
                removeArray: removeArray,
                token: arachne.key.token
            });
        });
    }
    delete(rowId){
        this.workId ++;
        const cWorkId = this.workId;
        return new Promise((resolve, reject) => {
            this.worker.onmessage = msg => {
                if(msg.data.workId === cWorkId){
                    let data = msg.data;
                    switch(data.status){
                        case 200:
                            resolve(data.result);
                            break;
                        case 401:
                            argos.loadMain("login");
                            break;
                        default:
                            reject();
                    }
                }
            }
            this.worker.postMessage({
                workId: this.workId,
                request: "DELETE",
                rowId: rowId,
                token: arachne.key.token
            });
        });
    }
    save(newValues){
        this.workId ++;
        const cWorkId = this.workId;
        return new Promise((resolve, reject) => {
            this.worker.onmessage = msg => {
                if(msg.data.workId === cWorkId){
                    let data = msg.data;
                    switch(data.status){
                        case 200:
                            resolve(data.result);
                            break;
                        case 401:
                            argos.loadMain("login");
                            break;
                        default:
                            reject();
                    }
                }
            }
            this.worker.postMessage({
                workId: this.workId,
                request: "SAVE",
                newValues: newValues,
                token: arachne.key.token
            });
        });
    }
    getAll(index=null){
        this.workId ++;
        const cWorkId = this.workId;
        return new Promise((resolve, reject) => {
            this.worker.onmessage = msg => {
                if(msg.data.workId === cWorkId){
                    let data = msg.data;
                    switch(data.status){
                        case 200:
                            resolve(data.results);
                            break;
                        case 401:
                            argos.loadMain("login");
                            break;
                        default:
                            reject();
                    }
                }
            }
            this.worker.postMessage({
                workId: this.workId,
                request: "GETALL",
                index: index,
                token: arachne.key.token
            });
        });
    }
}


class Arachne{
    constructor(dbName){
        // set up DB
        this.key = new Key(4);
        //set "this.key.ontimeout" to set callback for when token expires
        this.dbName = dbName;
        this.dbVersion = 1;
    }

    async login(sync = true, sOrderLst = []){
        let loadLabel = document.createElement("DIV");
        let loadLabelCurrent = document.createElement("SPAN");
        let backToLogin = document.createElement("DIV");
        if(sync){
            let mainBody = document.querySelector("main");
            loadLabel.id = "loadLabel";
            loadLabel.textContent = "Datenbank wird aktualisiert... ";
            loadLabelCurrent.style.fontStyle = "italic";
            loadLabel.appendChild(loadLabelCurrent);
            mainBody.appendChild(loadLabel);
            backToLogin.textContent = "abbrechen";
            backToLogin.style.color = "var(--mainColor)";
            backToLogin.style.fontSize = "14px";
            backToLogin.style.position = "fixed";
            backToLogin.style.bottom = "10px";
            backToLogin.style.left = "10px";
            backToLogin.onclick = () => {
                localStorage.removeItem("key");
                location.reload();
            }
            mainBody.appendChild(backToLogin);
        }

        // CREATE DB
        this.oStoresSchema = await fetch("/config/oStores", {
            headers: {"Authorization": `Bearer ${this.key.token}`}
        })
            .then(r => {
                if(r.status === 401){
                    // connection failed. remove token.
                    this.key.removeToken();
                    this.key.token;
                }
                return r.json();
            })
            .catch(e => {throw e});
        this.oStores = [];
        for(const oStoreSchema of this.oStoresSchema){
            this.oStores.push(oStoreSchema.name);
        }

        //if(deleteFirst){await this.deleteDB()}
        await new Promise((resolve, reject) => {
            let request = indexedDB.open(this.dbName, this.dbVersion);
            request.onerror = e => {reject(e)}
            request.onupgradeneeded = () => {
                let db = request.result;
                for(const oSchema of this.oStoresSchema){
                    let oStore = db.createObjectStore(oSchema.name,{keyPath: oSchema.keyPath});
                    for(const index in oSchema.indices){
                        oStore.createIndex(index, oSchema.indices[index]);
                    }
                }
                localStorage.setItem("lastFullUpdate", Date.now());
                resolve();
            }
            request.onsuccess = () => {resolve()};
        });

        // SYNC DB
        this.optimize = argos.userDisplay.optimize;
        for(const tbl of this.oStores){
            this[tbl] = new ArachneWrapper(
                tbl,
                this.dbName,
                this.dbVersion,
                (this.optimize.includes(tbl) ? true : false),
                (sOrderLst.includes(tbl) ? true : false)
            );
            if(sync){
                loadLabelCurrent.textContent = tbl;
                await this[tbl].load()
            } else {this[tbl].load()}
        }
        if(sync){loadLabel.remove();backToLogin.remove();return true;}
        else{el.status("updated")}
    }

    deleteDB(){
        console.log("Deleting DB...");
        return new Promise((resolve, reject) => {
            let request = indexedDB.deleteDatabase(this.dbName);
            request.onsuccess = () => {resolve()};
            request.onblocked = e => {console.log("DB blocked:", e)}
            request.onerror = e => {reject(e)};
        });
    }
}
