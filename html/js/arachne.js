export { Arachne };
/*
const fetch = require("node-fetch");
module.exports = Arachne;
*/
class ArachneWrapper{
    constructor(tblName, dbName, dbVersion, optimize, token){
        this.worker = new Worker("/file/js/arachneWW.js");
        this.tblName = tblName;
        this.dbName = dbName;
        this.dbVersion = dbVersion;
        this.optimize = optimize;
        this.token = token;
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
                token: this.token
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
                tblName: this.tblName,
                dbName: this.dbName,
                dbVersion: this.dbVersion,
                optimize: this.optimize, 
                sOrder: argos.userDisplay.sOrder,
                token: this.token
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
            this.worker.postMessage({workId: this.workId, request: "VERSION"});
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
            this.worker.postMessage({
                workId: this.workId,
                request: "SEARCH",
                query: query,
                returnCols: returnCols,
                orderIndex: orderIndex,
                limit: limit
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
                removeArray: removeArray
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
                removeArray: removeArray
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
                rowId: rowId
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
                newValues: newValues
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
                index: index
            });
        });
    }
}


class Arachne{
    constructor(dbName){
        // set up DB
        this.dbName = dbName;
        this.dbVersion = 1;
    }

    async createDB(){
        this.oStoresSchema = await fetch("/config/oStores", {
            headers: {"Authorization": `Bearer ${this.token}`}
        })
            .then((r) => r.json())
            .catch((e) => {throw e});
        this.oStores = [];
        for(const oStoreSchema of this.oStoresSchema){
            this.oStores.push(oStoreSchema.name);
        }
        //if(deleteFirst){await this.deleteDB()}
        return new Promise((resolve, reject) => {
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
    }

    async loadDB(loadLabel=null, sync = true){
        this.optimize = argos.userDisplay.optimize;
        for(const tbl of this.oStores){
            if(loadLabel!=null){loadLabel.textContent = tbl}
            this[tbl] = new ArachneWrapper(tbl, this.dbName, this.dbVersion, (this.optimize.includes(tbl) ? true : false), this.token);
            if(sync){await this[tbl].load()}
            else{this[tbl].load()}
        }
        if(loadLabel!=null){loadLabel.parentNode.remove()}
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
