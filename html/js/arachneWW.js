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
        let greater = false;
        let smaller = false;
        let regex = false;
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
            if(value.startsWith(">")){
                greater = true;
                value = value.substring(1);
            }
            if(value.startsWith("<")){
                smaller = true;
                value = value.substring(1);
            }
            if(!isNaN(parseInt(value))){value = parseInt(value)}
            if(`${value}`.indexOf("*")>-1){regex = true; value = value.replace(/\*/g, ".*")};
            output.push({
                "col": col,
                "value": value,
                "regex": regex,
                "operator": operator,
                "negative": negative,
                "greater": greater,
                "smaller": smaller
            });
            operator = "&&";
        }
    }
    return output;
}

class ArachneDatabase{
    constructor(){
        this.token = null;
    }

    load(tblName, dbName, dbVersion, optimize, sOrder){
        this.tblName = tblName;
        this.dbName = dbName;
        this.dbVersion = dbVersion;
        this.data = null;
        this.optimize = optimize;
        this.sOrder = sOrder;
    }

    // ***************************************** //
    //           indexedDB Connection            //
    // ***************************************** //
    getStore(index=null){
        return new Promise((resolve, reject) => {
            let request = indexedDB.open(this.dbName, this.dbVersion)
            request.onsuccess = () => {
                let db = request.result;
                let tAction = db.transaction(this.tblName, "readonly");
                let oStore = tAction.objectStore(this.tblName);
                if(index&&oStore.indexNames.contains(index)){resolve(oStore.index(index))}
                else {resolve(oStore)}

            }
            request.onerror = (e) => {reject(e)}
        });
    }

    getAll(index=null){
        this.update();
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

    bound(lowerSearch, upperSearch, index=null, removeArray = false){
        this.update();
        return this.getStore(index).then((oStore) => {
            return new Promise((resolve, reject) => {
                let cursorRequest  = oStore.openCursor(IDBKeyRange.bound(lowerSearch, upperSearch));
                let cursorResults = [];
                cursorRequest.onsuccess = () => {
                    let cursor = cursorRequest.result;
                    if(cursor){
                        cursorResults.push(cursor.value);
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

    is(searchValue, index=null, removeArray = true){
        this.update();
        return this.getStore(index).then((oStore) => {
            return new Promise((resolve, reject) => {
                let cursorRequest  = oStore.openCursor(IDBKeyRange.only(searchValue));
                let cursorResults = [];
                cursorRequest.onsuccess = () => {
                    let cursor = cursorRequest.result;
                    if(cursor){
                        cursorResults.push(cursor.value);
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

    // ***************************************** //
    //               search methods              //
    // ***************************************** //
    async version(){
        const lastEntry = await this.getCursor(null, "update", 1, "prev")
        if(lastEntry.length > 0){return lastEntry[0].u_date}
        else {return "2020-01-01 01:00:00"}
    }
    async removeDeleted(){
        const delList = await this.is(1, "deleted", false);
        return new Promise((resolve, reject) => {
            let request = indexedDB.open(this.dbName, this.dbVersion);
            request.onerror = e => {reject(e)}
            request.onsuccess = () => {
                let db = request.result;
                let tAction = db.transaction(this.tblName, "readwrite");
                let oStore = tAction.objectStore(this.tblName);
                for(const delItem of delList){oStore.delete(delItem.id)}
                resolve();
            }
        });
    }

    async update(forceUpdate = false){
        if(forceUpdate === true || (Date.now()-this.lastUpdated)>60000){
            this.lastUpdated = Date.now()
            const url = `/data/${this.tblName}?u_date=${await this.version()}`;
            const newData = await fetch(url, {
                headers: {"Authorization": `Bearer ${this.token}`}
            })
                .then(response => {
                    if(response.status === 401){postMessage({status:401})}
                    else if(response.status === 200){return response.json()}
                })
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
                .catch(e => {throw e});

            // remove "deleted"
            if(newData){await this.removeDeleted()}
            
            // optimize?
            if(this.optimize && (newData || this.data == null)){
                this.data = null;
                let sIndex = null;
                if(this.sOrder!=1){sIndex=this.tblName}
                this.getAll(sIndex).then(all => {this.data = all}).catch(e => {throw e});
            }
        }
    }

    async delete(rowId){
        const response = await fetch(`/data/${this.tblName}/${rowId}`, {
            method: "delete",
            headers: {"Authorization": `Bearer ${this.token}`}
        });
        if(response.status===200){
            await this.update(true);
            return true;
        } else {
            throw `DB ERROR: entry not deleted. Status: ${response.status}`
        }
    }
    async save(newValues){
        // newValues is an object containing col/values as key/value pairs.
        // when no id is given, a new entry will be created.
        let url = `/data/${this.tblName}`;
        let method = "POST";
        const rId = newValues.id;
        if(newValues.id!=null){
            url += `/${newValues.id}`;
            method = "PATCH";
            delete newValues.id;
        }
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
            await this.update(true);
            return await this.is(newId)
        } else if(response.status===200 && method==="PATCH"){
            await this.update(true);
            return rId;
        } else {
            throw `DB ERROR: entry not saved. Status: ${response.status}`
        }
    }

    async search(query, returnCols="*", orderIndex = null, limit=null){
        this.update();
        // query: object containing cols/value pairs as key/value
        // if query === "*" all data will be returned
        let data = []
        if(this.optimize&&this.data != null){data = this.data}
        else{data = await this.getAll(orderIndex)}
        if(query === "*"){
            if(limit!=null){return data.slice(0, limit)}
            else{return data}
        } else {
            let oStore = await this.getStore(orderIndex);
            return new Promise((resolve, reject) => {
                query = stringToQuery(query);
                let request = oStore.openCursor();
                let results = [];
                let i = 0;
                request.onsuccess = () => {
                    let cursor = request.result;
                    if(cursor && (limit===null || i < limit)){
                        let found = false;
                        for (const q of query){
                            found = false;
                            if(q.col === "*"){
                                // any row
                                let re = null
                                if(q.regex == true){re = new RegExp(q.value, "g")}
                                for(const key in cursor.value){
                                    if(q.negative === false && `${cursor.value[key]}`.indexOf(q.value)>-1){found = true}
                                    else if(q.negative === true && `${cursor.value[key]}`.indexOf(q.value)===-1){found = true}
                                    else if(q.regex === true && `${cursor.value[key]}`.match(re)){found = true}
                                }
                            } else if (Object.keys(cursor.value).includes(q.col)){
                                // row given
                                if(q.regex === false && q.negative === false  &&
                                    q.greater === false && q.smaller === false &&
                                    cursor.value[q.col] == q.value){found = true}
                                if(q.regex === false && q.negative === false  &&
                                    q.greater === false && q.smaller === false &&
                                    q.value === "NULL" &&
                                    cursor.value[q.col] == null){found = true}
                                else if(q.regex === false && q.negative === true &&
                                    q.greater === false && q.smaller === false &&
                                    cursor.value[q.col] != q.value){found = true}
                                else if(q.regex === false && q.greater === true &&
                                    cursor.value[q.col] > q.value){found = true}
                                else if(q.regex === false && q.smaller === true &&
                                    cursor.value[q.col] < q.value){found = true}
                                else if(q.regex == true && cursor.value[q.col]!=null){
                                    // regex
                                    const re = new RegExp(q.value, "g");
                                    if(cursor.value[q.col].match(re)){found = true}
                                }
                            }
                            if(!found){break}
                        }
                        if(found){
                            i++;
                            if(returnCols==="*"){results.push(cursor.value)}
                            else{
                                let rItem = {};
                                for(const returnCol of returnCols){
                                    rItem[returnCol] = cursor.value[returnCol];
                                }
                                results.push(rItem);
                            }
                        }
                        cursor.continue();
                    } else {resolve(results)}
                }
                request.onerror = () => {reject()}
            });
        }
    }
}

let athene = new ArachneDatabase();

onmessage = async (input) => {
    const data = input.data;
    athene.token = data.token;
    switch(data.request){
        case "LOAD":
            athene.load(data.tblName, data.dbName, data.dbVersion, data.optimize, data.sOrder);
            await athene.update(true);
            postMessage({workId: data.workId});
            break;
        case "STRINGTOQUERY":
            postMessage({
                workId: data.workId,
                query: stringToQuery(data.string)
            });
            break;
        case "VERSION":
            postMessage({
                workId: data.workId,
                status: 200,
                version: await athene.version()
            });
            break;
        case "SEARCH":
            let sResults = await athene.search(data.query, data.returnCols, data.orderIndex, data.limit);
            postMessage({
                workId: data.workId,
                results: sResults
            });
            break;
        case "IS":
            postMessage({
                workId: data.workId,
                status: 200,
                results: await athene.is(data.searchValue, data.index, data.removeArray)
            });
            break;
        case "BOUND":
            postMessage({
                workId: data.workId,
                status: 200,
                results: await athene.bound(data.lowerSearch, data.upperSearch, data.index, data.removeArray)
            });
            break;
        case "DELETE":
            postMessage({
                workId: data.workId,
                status: 200,
                result: await athene.delete(data.rowId)
            });
            break;
        case "SAVE":
            postMessage({
                workId: data.workId,
                status: 200,
                result: await athene.save(data.newValues)
            });
            break;
        case "GETALL":
            postMessage({
                workId: data.workId,
                status: 200,
                results: await athene.getAll(data.index)
            });
            break;
        default:
            throw "Unknown ArachneWW request!";
    }
}
