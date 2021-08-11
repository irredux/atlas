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
        }).catch(e => {throw e});
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
        }).catch(e => {throw e});
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
            const dbName = this.dbName;
            const dbVersion = this.dbVersion;
            const tblName = this.tblName;
            this.lastUpdated = Date.now()
            let newDatasets = 0;
            do{
                const url = `/data/${this.tblName}?u_date=${await this.version()}`;
                newDatasets = 0;
                newDatasets = await new Promise((resolve, reject) => {
                    fetch(url, {
                        headers: {"Authorization": `Bearer ${this.token}`}
                    })
                        .then(response => {
                            let count = 0;
                            let restOfChunk = "";
                            let decoder = new TextDecoder();
                            const reader = response.body.getReader();
                            return new ReadableStream({
                                start(controller){
                                    let pump = () => {
                                        reader.read().then( ({done, value}) => {
                                            count ++;
                                            const txt = restOfChunk+decoder.decode(value);
                                            let parts = txt.split('}, {"');
                                            const lastPart = parts[parts.length-1];

                                            // check if first item is first chunk!
                                            if(parts[0].startsWith('[{"')){parts[0] = parts[0].substring(3)}
                                            // preserve last item
                                            if(done && parts.length === 1 && parts[0].endsWith("}]")){
                                                parts[0] = parts[0].substring(0, parts[0].length-2);
                                                restOfChunk = "[]";
                                            } else {restOfChunk = parts.pop()}

                                            //console.log("parts (after cut):", parts);
                                            let items = [];
                                            for(const part of parts){
                                                if (part === ""){console.log(parts);throw "ERROR: empty part!"}
                                                try{
                                                    items.push(JSON.parse('{"'+part+'}'));
                                                } catch {
                                                    console.log(parts);
                                                    throw part;
                                                }
                                            }
                                            if(items.length > 0){controller.enqueue(items)}
                                            if (done && restOfChunk === "[]") {
                                                controller.close();
                                                return;
                                            } else if(done && restOfChunk != "[]"){
                                               throw "ERROR: Buffer not empty!";
                                            }
                                            pump();
                                        });
                                    }
                                    pump();
                                }
                            });
                        }).
                        then(stream => {
                            let count = 0;
                            const reader = stream.getReader();
                            return new ReadableStream({
                                start(controller){
                                    let pump = () => {
                                        reader.read().then( ({done, value}) => {
                                            if (done) {
                                                controller.close();
                                                return;
                                            }
                                            count ++;
                                            newDatasets += value.length;
                                            console.log(tblName, "- saving to DB -", count, value.length);
                                            let request = indexedDB.open(dbName, dbVersion);
                                            request.onerror = e => {throw e}
                                            request.onsuccess = () => {
                                                let db = request.result;
                                                let tAction = db.transaction(tblName, "readwrite");
                                                let oStore = tAction.objectStore(tblName);
                                                let delList = [];
                                                for(const item of value){
                                                    if(item.deleted != null){delList.push(item.id)}
                                                    oStore.put(item);
                                                }
                                                tAction.oncomplete = () => {
                                                    if(delList.length > 0){
                                                        newDatasets -= delList.length;
                                                        controller.enqueue(delList)
                                                    }
                                                    pump();
                                                }
                                            }
                                        });
                                    }
                                    pump();
                                }
                            });
                        }).
                        then(stream => {
                            let count = 0;
                            const reader = stream.getReader();
                            return new ReadableStream({
                                start(controller){
                                    let pump = () => {
                                        reader.read().then( ({done, value}) => {
                                            if (done) {
                                                controller.close();
                                                resolve(newDatasets);
                                                return;
                                            }
                                            count ++;
                                            console.log(tblName, "- removing deleted items -", count);
                                            let request = indexedDB.open(dbName, dbVersion);
                                            request.onerror = e => {throw e}
                                            request.onsuccess = () => {
                                                let db = request.result;
                                                let tAction = db.transaction(tblName, "readwrite");
                                                let oStore = tAction.objectStore(tblName);
                                                for(const delId of value){oStore.delete(delId)}
                                                tAction.oncomplete = () => {pump()}
                                            }
                                        });
                                    }
                                    pump();
                                }
                            });
                        }).
                        catch(e => {throw e});
                    
                }); // end of promise
            } while(newDatasets > 9999);
            // optimize?
            if(this.optimize && (newDatasets > 0 || this.data == null)){
                this.data = null;
                let sIndex = null;
                if(this.sOrder!=1){sIndex=this.tblName}
                this.getAll(sIndex).then(all => {this.data = all}).catch(e => {throw e});
            }
        }
    }

    async delete(rowId){
        let url = `/data/${this.tblName}/${rowId}`;
        let data = null;
        if(Array.isArray(rowId)){
            url = `/data_batch/${this.tblName}`;
            data = JSON.stringify(rowId);
        }
        const response = await fetch(url, {
            method: "delete",
            headers: {
                "Authorization": `Bearer ${this.token}`,
                "Content-Type": "application/json",
            },
            body: data
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
        let method = "POST";
        let url = `/data/${this.tblName}`;
        let rId = 1;
        if(Array.isArray(newValues)){
            url = `/data_batch/${this.tblName}`
        } else {
            rId = newValues.id;
            if(newValues.id!=null){
                url += `/${newValues.id}`;
                method = "PATCH";
                delete newValues.id;
            }
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
            if(Array.isArray(newValues)){
                await this.update(true);
                return await rId;
            } else {
                const newId = parseInt(await response.text());
                await this.update(true);
                return await this.is(newId)
            }
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
            query = stringToQuery(query);
            let i = 0;
            let re = data.filter(dataItem => {
                if(limit===null || i < limit){
                    let found = false;
                    for (const q of query){
                        found = false;
                        if(q.col === "*"){
                            // any row
                            let re = new RegExp(q.value, "i");
                            for(const key in dataItem){
                                if(q.negative === false && `${dataItem[key]}`.match(re)){found = true}
                                else if(q.negative === true && !`${dataItem[key]}`.match(re)){found = true}
                            }
                        } else if (Object.keys(dataItem).includes(q.col)){
                            // row given
                            if(q.regex === false && q.negative === false  &&
                                q.greater === false && q.smaller === false &&
                                dataItem[q.col] == q.value){found = true}
                            if(q.regex === false && q.negative === false  &&
                                q.greater === false && q.smaller === false &&
                                q.value === "NULL" &&
                                dataItem[q.col] == null){found = true}
                            else if(q.regex === false && q.negative === true &&
                                q.greater === false && q.smaller === false &&
                                dataItem[q.col] != q.value){found = true}
                            else if(q.regex === false && q.greater === true &&
                                dataItem[q.col] > q.value){found = true}
                            else if(q.regex === false && q.smaller === true &&
                                dataItem[q.col] < q.value){found = true}
                            else if(q.regex == true && dataItem[q.col]!=null){
                                // regex
                                const re = new RegExp(q.value, "gi");
                                if(dataItem[q.col].match(re)){found = true}
                            }
                        }
                        if(!found){break}
                    }
                    if(found){
                        i++;
                        /*
                        if(returnCols==="*"){results.push(dataItem)}
                        else{
                            let rItem = {};
                            for(const returnCol of returnCols){
                                rItem[returnCol] = dataItem[returnCol];
                            }
                            results.push(rItem);
                        }
                        */
                        return true;
                    } else {return false;}
                } else {return false;}
            });
            return re;
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
        case "UPDATE":
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