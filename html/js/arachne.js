export { Arachne, stringToQuery };

/*
const fetch = require("node-fetch");
module.exports = Arachne;
*/
function stringToQuery(input){
    const quotes = input.split('"');
    let inQuotes = false;
    let queries = [];
    for(const quote of quotes){
        if(inQuotes===false){
            inQuotes = true;
            queries = queries.concat(quote.split(" "));
        } else {
            inQuotes = false;
            queries.push(quote);
        }
    }
    let i = 0;
    let queries2 = [];
    for(;i<queries.length;i++){
        if(queries[i][queries[i].length-1]===":"){
            queries2.push(queries[i]+queries[i+1]);
            i ++;
        } else if(queries[i]!=""){
            queries2.push(queries[i]);
        }
    }
    let output = [];
    let operator = "&&";
    for(const query of queries2){
        let negative = false;
        if(query==="oder"){
            operator = "||"
        } else {
            let col = "*";
            let value = query;
            let colSeparator = query.indexOf(":");
            if(colSeparator>-1){
                value = query.substring(colSeparator+1);
                col = query.substring(0,colSeparator);
            }
            if(value.startsWith("-")){
                negative = true;
                value = value.substring(1);
            }
            output.push({
                "col": col,
                "value": value,
                "regex": false,
                "operator": operator,
                "negative": negative 
            });
            operator = "&&";
        }
    }
    return output;
}

class ArachneDatabase{
    constructor(tblName, dbName, dbVersion, token){
        this.token = token;
        this.tblName = tblName;
        this.dbName = dbName;
        this.dbVersion = dbVersion;
        this.data = [];
        if(arachne.optimize.includes(tblName)){this.optimize = true}
        else{this.optimize=false}
    }

    /* ***************************************** */
    /*           indexedDB Connection            */
    /* ***************************************** */
    getStore(index=null){
        return new Promise((resolve, reject) => {
            let request = indexedDB.open(this.dbName, this.dbVersion)
            request.onsuccess = () => {
                let db = request.result;
                let tAction = db.transaction(this.tblName, "readonly");
                let oStore = tAction.objectStore(this.tblName);
                if(index){resolve(oStore.index(index))}
                else {resolve(oStore)}

            }
            request.onerror = (e) => {reject(e)}
        });
    }

    getAll(index=null){
        // ATTENTION: DOESNT FILTER OUT DELETED OBJECTS!
        return this.getStore(index).then((oStore) => {
            return new Promise((resolve, reject) => {
                let getAll = oStore.getAll();
                getAll.onsuccess = () => {resolve(getAll.result)}
                getAll.onerror = (e) => {reject(e)}
            });
        });
    }

    getCursor(keyRange=null, index=null, limit = null, direction="next"){
        return this.getStore(index).then((oStore) => {
            return new Promise((resolve, reject) => {
                let cursorRequest  = oStore.openCursor(keyRange, direction);
                let cursorResults = [];
                let cursorCount = 0;
                cursorRequest.onsuccess = () => {
                    let cursor = cursorRequest.result;
                    if(cursor && (limit == null || cursorCount <= limit)){
                        cursorCount ++;
                        cursorResults.push(cursor.value);
                        cursor.continue();
                    } else {
                        resolve(cursorResults);
                    }
                }
                cursorRequest.onerror = (e) => {reject(e)}
            });
        });
    }

    is(searchValue, index=null, removeArray = true){
        return this.getStore(index).then((oStore) => {
            return new Promise((resolve, reject) => {
                let cursorRequest  = oStore.openCursor(IDBKeyRange.only(searchValue));
                let cursorResults = [];
                cursorRequest.onsuccess = () => {
                    let cursor = cursorRequest.result;
                    if(cursor){
                        if(cursor.value.deleted!=1){cursorResults.push(cursor.value)}
                        cursor.continue();
                    } else {
                        if(cursorResults.length==1 && removeArray){
                            resolve(cursorResults[0]);
                        } else {
                            resolve(cursorResults);
                        }
                    }
                }
                cursorRequest.onerror = (e) => {reject(e)}
            })
                .catch(e => {throw e});
        })
            .catch(e => {throw e});
    }

    /* ***************************************** */
    /*               search methods              */
    /* ***************************************** */
    async version(){
        const lastEntry = await this.getCursor(null, "update", 1, "prev")
        if(lastEntry.length > 0){return lastEntry[0].u_date}
        else {return "2020-01-01 01:00:00"}
    }

    async update(){
        const startTime = Date.now();
        const url = `/data/${this.tblName}?u_date=${await this.version()}`;
        return fetch(url, {
            headers: {"Authorization": `Bearer ${this.token}`}
        })
            .then(response => response.json())
            .then(items => { return new Promise((resolve, reject) => {
                if(items.length>0){
                    let request = indexedDB.open(this.dbName, this.dbVersion);
                    request.onerror = e => {reject(e)}
                    request.onsuccess = () => {
                        let db = request.result;
                        let tAction = db.transaction(this.tblName, "readwrite");
                        let oStore = tAction.objectStore(this.tblName);
                        for(const item of items){oStore.put(item)}
                        tAction.oncomplete = () => {
                            resolve(true);
                        }
                    }
                }else{
                    resolve(false);
                }
            })})
            .then(newData => {if(this.optimize && newData){return this.getAll()}})
            .then(all => {this.data = all})
            .catch(e => {throw e});
    }

    async delete(rowId){
        const response = await fetch(`/data/${this.tblName}/${rowId}`, {
            method: "delete",
            headers: {"Authorization": `Bearer ${this.token}`}
        });
        if(response.status===200){
            await this.update();
            return true;
        } else {
            throw `DB ERROR: entry not deleted. Status: ${response.status}`
        }
    }
    async save(newValues){
        /*
        newValues is an object containing col/values as key/value pairs.
        when no id is given, a new entry will be created.
        */
        console.log(`Start saving in ${this.tblName}:`, newValues);
        let url = `/data/${this.tblName}`;
        let method = "POST";
        const rId = newValues.id;
        if(newValues.id!=null){
            url += `/${newValues.id}`;
            method = "PATCH";
            delete newValues.id;
        }
        console.log(newValues);
        const response = await fetch(url, {
            method: method,
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${this.token}`
            },
            body: JSON.stringify(newValues)
        });
        if(response.status===201 && method==="POST"){
            const newId = parseInt(await response.text());
            await this.update();
            return await this.is(newId)
        } else if(response.status===200 && method==="PATCH"){
            await this.update();
            return rId;
        } else {
            throw `DB ERROR: entry not saved. Status: ${response.status}`
        }
    }

    async search(query, returnCols="*", orderIndex = null){
        // query: object containing cols/value pairs as key/value
        // if query === "*" all data will be returned
        let data = []
        if(this.optimize){data = this.data}
        else{data = await this.getAll(orderIndex)}
        if(query === "*"){
            return data
        } else {
            query = stringToQuery(query);
            let results = [];
            for (const item of data){
                let found = false;
                for (const q of query){
                    found = false;
                    if(q.col === "*"){
                        // any row
                    } else if (Object.keys(item).includes(q.col)){
                        // row given
                        if(q.regex === false && q.negative === false && item[q.col] == q.value){found = true}
                        else if(q.regex === false && q.negative === true && item[q.col] != q.value){found = true}
                    }
                    if(!found){break}
                }
                /*
                let found = true;
                    if(q.col === "*" || Object.keys(item).includes(q.col)){
                        //if(q.regex===false && item[q.col] != q.value){found = false}
                        if(`${item[q.col]}`.match(new RegExp(`^${q.value}$`))===null){found=false}
                    } else {
                        found = false;
                    }
                }
                */
                if(found){
                    if(returnCols==="*"){results.push(item)}
                    else{
                        let rItem = {};
                        for(const returnCol of returnCols){
                            rItem[returnCol] = item[returnCol];
                        }
                        results.push(rItem);
                    }
                }
            }
            return results;
        }
    }
}
/*
    add(data){
        this.data.push(JSON.parse(JSON.stringify(data).replace(/<[^>]*>/g, "")));
    }
    remove(dataId){
        var removeIndex = -1;
        this.data.forEach(function(e, index){
            if(e["id"]==dataId){removeIndex = index}
        });
        if(removeIndex > -1){this.data.splice(removeIndex, 1)}else{throw "DataList: Item not found."}
    }
    filter(filter=null){
        if(filter==null){
            return this.data;
        } else {
            var rData = []; var rDict = {};
            loop1:
            for(var item of this.data){
                rDict = {};
                for(var dict in filter){if(item[dict] != filter[dict]){continue loop1}}
                rData.push(item);
            }
            return rData;
        }
    }
}
*/

class Arachne{
    constructor(dbName){
        // set up DB
        this.dbName = dbName;
        this.dbVersion = 1;
        this.optimize = ["lemma", "zettel"];
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
                resolve();
            }
            request.onsuccess = () => {resolve()};
        });
    }

    async loadDB(loadLabel=null){
        for(const tbl of this.oStores){
            if(loadLabel!=null){loadLabel.textContent = tbl}
            this[tbl] = new ArachneDatabase(tbl, this.dbName, this.dbVersion, this.token);
            await this[tbl].update();
            if(this[tbl].optimize){this[tbl].data = await this[tbl].getAll()}
        }
    }

    deleteDB(){
        console.log("Deleting DB...");
        return new Promise((resolve, reject) => {
            let request = indexedDB.deleteDatabase(this.dbName);
            request.onsuccess = () => {resolve()};
            request.onerror = e => {reject(e)};
        });
    }
}
