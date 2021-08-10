import { Oculus } from "/file/js/oculus.js";
import { ContextMenu } from "/file/js/contextmenu.js";
import "/file/js/chart.js";

export { Administration, AdministrationDetail, LocalDatabase, Statistics, Tests };

class Administration extends Oculus{
    constructor(res, resId=null, access=[], main=false){
        super(res, resId, access, main);
    }
    async load(){
        let mainBody = document.createDocumentFragment();
        let admin = document.createElement("DIV");
        admin.classList.add("card");
        admin.appendChild(el.h("Kontenverwaltung", 2));
        let users = await arachne.user.getAll();
        const TimeOutMax = 1000*60*30;
        let userTbl = document.createElement("TABLE");
        userTbl.style.boxShadow = "0 0 3px var(--shadowBG)";
        userTbl.style.width = "100%";
        let tHeader = document.createElement("TR");
        tHeader.innerHTML = `
            <th width="15%">Vorname</th>
            <th width="15%">Nachname</th>
            <th width="35%">Benutzerrechte</th>
            <th width="25%">Browser-Agent</th>
            <th width="10%">Online</th>
        `;
        userTbl.appendChild(tHeader);
        for(const user of users){
            let tr = document.createElement("TR");
            let active = "<span style='color: var(--minorColor)'>&#x263D;</span>";
            if((Date.now() - Date.parse(user.session_last_active)) <= TimeOutMax){
                active = "<span style='color: var(--mainColor);'>&#x2600;</span>";
            }
            tr.classList.add("userAccess");
            tr.id = user.id;
            tr.innerHTML = `
                <td>${user.first_name}</td>
                <td>${user.last_name}</td>
                <td class="minorTxt">${JSON.parse(user.access).join(", ")}</td>
                <td class="minorTxt">${user.agent}</td>
                <td style="text-align:center; font-size: 30px;">${active}</td>
            `;
            userTbl.appendChild(tr);
        }
        admin.appendChild(userTbl);
        mainBody.appendChild(admin);
        this.ctn.appendChild(mainBody);

        this.setSelection("main", "tr.userAccess", false);

        // contextmenu
        let cContext = new ContextMenu();
        cContext.addEntry('tr.userAccess', 'a', 'Zugriffsrechte verwalten', () => {
            argos.loadEye("user_access_detail", this.selMarker.main.lastRow);
        });
        this.setContext = cContext.menu;
    }
}

class AdministrationDetail extends Oculus{
    constructor(res, resId=null, access=[], main=false){
        super(res, resId, access, main);
    }
    async load(){
        let user = await arachne.user.is(this.resId);
        let mainBody = document.createDocumentFragment();
        mainBody.appendChild(el.h(user.first_name+" "+user.last_name, 2));
        mainBody.appendChild(el.p(`Am ${user.session_last_active} zuletzt online.`));
        mainBody.appendChild(el.h("User-Agent", 3));
        mainBody.appendChild(el.p("Achtung: Diese Informationen können vom Browser unterdrückt oder bewusst geändert werden."));
        let userAgentTxt = document.createElement("DIV");
        userAgentTxt.id = "userAgentTxt";
        userAgentTxt.textContent = user.agent;
        mainBody.appendChild(userAgentTxt);
        mainBody.appendChild(el.h("Zugriffsrechte", 3));

        let userAccessBox = document.createElement("DIV");
        userAccessBox.id = "userAccessBox";
        const cAccess = JSON.parse(user.access);
        const rights = {
            "auth": "Profil aktiviert",
            "admin": "Adminrechte",
            "o_view": "Kommentarspalte (opera-Listen)",
            "o_edit": "opera-Listen bearbeiten",
            "z_add": "Zettel importieren",
            "z_edit": "Zettel bearbeiten",
            "l_edit": "Lemma-Liste bearbeiten",
            "library": "Zugriff auf Bibliothek",
            "e_edit": "Bibliothek bearbeiten",
            "setup": "Zugriff auf Datenbanksetup",
            "module": "Zugriff über Python-Modul",
            "editor": "Zugriff auf Lemmastrecken-Editor",
            "comment": "Zugriff auf Kommentarfunktion",
            "comment_moderator": "Kommentare moderieren"
        };
        this.setSelection("main", "div.userAccessItem", true);
        for(const [right, description] of Object.entries(rights)){
            let nRight = document.createElement("DIV");
            nRight.classList.add("userAccessItem");
            if(cAccess.includes(right)){
                nRight.classList.add("selMarked");
                this.selMarker.main.ids.push(right);
                this.selMarker.main.lastRow = right;
            }
            nRight.id = right;
            nRight.textContent = description;
            userAccessBox.appendChild(nRight);
        }

        mainBody.appendChild(userAccessBox);
        let submitChange = el.button("Änderungen speichern");
        submitChange.style.margin = "10px";
        submitChange.style.float = "right";
        submitChange.onclick = () => {
            arachne.user.save({id: user.id, access: JSON.stringify(this.selMarker.main.ids)})
                .then(() => {this.close(); argos.main.refresh();})
                .catch(e => {throw e});
        }
        mainBody.appendChild(submitChange);
        mainBody.appendChild(el.closeButton(this));

        this.ctn.appendChild(mainBody);
    }
}

class LocalDatabase extends Oculus{
    constructor(res, resId=null, access=[], main=false){
        super(res, resId, access, main);
    }
    async load(){
        let mainBody = document.createDocumentFragment();
        let cardDB = el.card();
        cardDB.style.margin = "20px 10%";
        cardDB.appendChild(el.h("Lokale Datenbank", 3));
        cardDB.appendChild(el.p("Hier finden Sie die lokal gespeicherten Tabellen. Optimierte Tabellen werden im Arbeitsspeicher behalten und sind schneller verfügbar. Es kann aber sein, dass der Computer oder Browser dadurch verlangsamt wird."));
        let tblContent = [["<b>Tabellen-Name</b>", "<b>aktuell</b>", "<b>komplett</b>"]];
        for(const tbl of arachne.oStores){
            const cVersion = await arachne[tbl].version();
            const cAll = await arachne[tbl].getAll();
            const serverInfo = await fetch("/info/"+tbl, {headers: {"Authorization": `Bearer ${arachne.key.token}`}})
                .then(re => re.json());
            let maxDate = "<span style='color: red'>NEIN</span>";
            let length = "<span style='color: red'>NEIN</span>";
            if(cVersion==serverInfo.max_date){maxDate = "<span style='color:green'>Ja</span>"}
            if(cAll.length==serverInfo.length){length = "<span style='color:green'>Ja</span>"}
            tblContent.push([tbl, maxDate, length]);
        }
        let overviewTbl = el.table(tblContent);
        for(const c of overviewTbl.children){
            c.style.borderBottom = "1px solid var(--minorColor)";
        }
        cardDB.appendChild(overviewTbl);
        mainBody.appendChild(cardDB);

        this.ctn.appendChild(mainBody);
    }
}
class Statistics extends Oculus{
    constructor(res, resId=null, access=[], main=false){
        super(res, resId, access, main);
    }
    async load(){
        let mainBody = document.createDocumentFragment();
        // zettel in progress
        const zettels = await arachne.zettel.getAll();

        let zettelOverview = el.card(); 
        zettelOverview.appendChild(el.h("Zettel", 2));
        zettelOverview.appendChild(el.h("Zettel nach Bearbeitungsstand", 3));
        let results = {open: 0, just_lemma: 0, just_work: 0, done: 0};
        let resultsType = {"ohne Typ": 0, "verzettelt": 0, "Index": 0, "Exzerpt": 0, "Literatur": 0, "ausgeschrieben": 0};
        for(const zettel of zettels){
            switch (zettel.type){
                case 1:
                    resultsType.verzettelt ++;
                    break;
                case 2:
                    resultsType.Index ++;
                    break;
                case 3:
                    resultsType.Exzerpt ++;
                    break;
                case 4:
                    resultsType.Literatur ++;
                    break;
                case 5:
                    resultsType.ausgeschrieben ++;
                    break;
                default:
                    resultsType["ohne Typ"] ++;
            }
            if((zettel.lemma_id!=null && zettel.work_id!=null) ||
                (zettel.type === 4 && zettel.lemma_id!=null)){
                results.done ++;
            } else if(zettel.lemma_id!=null){
                results.just_lemma ++;
            } else if (zettel.work_id!=null){
                results.just_work ++;
            } else {
                results.open ++;
            }
        }
        const zLength = results.done+results.just_lemma+results.just_work+results.open;
        let zettelChartBox = document.createElement("DIV");
        zettelChartBox.style.width = "700px";
        zettelChartBox.style.margin = "auto";
        let zettelChart = document.createElement("CANVAS");
        zettelChartBox.appendChild(zettelChart);
        new Chart(zettelChart, {
            type: "pie",
            data: {
                labels: [`abgeschlossen (${Math.round(100/zLength*results.done)}%)`, `nur mit Lemma verknüpft (${Math.round(100/zLength*results.just_lemma)}%)`, `nur mit Werk verknüpft (${Math.round(100/zLength*results.just_work)}%)`, `unbearbeitet (${Math.round(100/zLength*results.open)}%)`],
                datasets: [{
                    label: '',
                    data: [results.done, results.just_lemma, results.just_work, results.open],
                    backgroundColor: ["#537727", "#84B34B", "#BFCF5B", "#E1D658", "#F9F8ED"],
                    borderColor: ["#213409", "#7FBD32", "#CBE432", "#FDED2A", "#F7F4D4"],
                    borderWidth: 1.5
                }]
            },
            options: {plugins: {legend: {position: "bottom", labels: {font: {size: "15px"}}}}}
        });
        zettelOverview.appendChild(zettelChartBox);
        zettelOverview.appendChild(el.h("Zettel nach Zetteltyp", 3));

        // zettel type
        let zettelTypeBox = document.createElement("DIV");
        zettelTypeBox.style.width = "700px";
        zettelTypeBox.style.margin = "auto";
        let zettelType = document.createElement("CANVAS");
        zettelTypeBox.appendChild(zettelType);
        new Chart(zettelType, {
            type: "pie",
            data: {
                labels: [`verzettelt (${Math.round(100/zLength*resultsType.verzettelt)}%)`, `Index (${Math.round(100/zLength*resultsType.Index)}%)`, `Exzerpt (${Math.round(100/zLength*resultsType.Exzerpt)}%)`, `Literatur (${Math.round(100/zLength*resultsType.Literatur)}%)`, `ohne Typ (${Math.round(100/zLength*resultsType["ohne Typ"])}%)`],
                datasets: [{
                    label: '',
                    data: [resultsType.verzettelt, resultsType.Index, resultsType.Exzerpt, resultsType.Literatur, resultsType["ohne Typ"]],
                    backgroundColor: ["#537727", "#84B34B", "#BFCF5B", "#E1D658", "#F9F8ED"],
                    borderColor: ["#213409", "#7FBD32", "#CBE432", "#FDED2A", "#F7F4D4"],
                    borderWidth: 1.5
                }]
            },
            options: {plugins: {legend: {position: "bottom", labels: {font: {size: "15px"}}}}}
        });
        zettelOverview.appendChild(zettelTypeBox);
        
        // zettel add
        let allUsers = await arachne.user.getAll();
        let users = {};
        for(const user of allUsers){users[user.id] = user.last_name}
        users[0] = "alle";

        let zettelAddBox = document.createElement("DIV");
        zettelOverview.appendChild(el.h("Zettel nach Erstelldatum (pro Monat)", 3));
        let userAdd = el.select(0, users);
        userAdd.onchange = () => {
            zettelAddBox.innerHTML = "";
            this.drawZettelAdd(zettels, zettelAddBox, parseInt(userAdd.value));
        }
        zettelOverview.appendChild(userAdd);
        this.drawZettelAdd(zettels, zettelAddBox, 0);
        zettelOverview.appendChild(zettelAddBox);


        // zettel changed
        let zettelChangeBox = document.createElement("DIV");
        zettelOverview.appendChild(el.h("Zettel nach Änderungsdatum (pro Monat)", 3));
        let userChange = el.select(0, users);
        userChange.onchange = () => {
            zettelChangeBox.innerHTML = "";
            this.drawZettelChange(zettels, zettelChangeBox, parseInt(userChange.value));
        }
        this.drawZettelChange(zettels, zettelChangeBox, 0);
        zettelOverview.appendChild(userChange);
        zettelOverview.appendChild(zettelChangeBox);

        mainBody.appendChild(zettelOverview);

        // lemma letters
        let lemmaOverview = el.card(); 
        lemmaOverview.appendChild(el.h("Lemmata", 2));
        lemmaOverview.appendChild(el.h("Lemmata nach Buchstaben", 3));

        mainBody.appendChild(lemmaOverview);
        let lemmaLetterBox = document.createElement("DIV");
        let lemmaLetter = document.createElement("CANVAS");
        lemmaLetterBox.appendChild(lemmaLetter);
        let lemmaLetterData = {};
        const lemmata = await arachne.lemma.getAll();
        for(const lemma of lemmata){
            const zLetter = lemma.lemma_search.substring(0, 1);
            if(zLetter in lemmaLetterData){lemmaLetterData[zLetter] ++;}
            else{lemmaLetterData[zLetter] = 1}
        }
        let lemmaLetterDataArray = [];
        for(const addData in lemmaLetterData){
            lemmaLetterDataArray.push([addData, lemmaLetterData[addData]]);
        }
        lemmaLetterDataArray.sort((a, b) => a[0]>b[0]);
        lemmaLetterData = {};
        for(const addData of lemmaLetterDataArray){lemmaLetterData[addData[0]] = addData[1]}

        new Chart(lemmaLetter, {
            type: "bar",
            data: {
                labels: Object.keys(lemmaLetterData),
                datasets: [{
                    label: null,
                    backgroundColor: '#537727',
                    borderColor: '#213409',
                    data: Object.values(lemmaLetterData)
                }]
            },
            options: {plugins: {legend: {display: false}}}
        });
        lemmaOverview.appendChild(lemmaLetterBox);

        // scans
        let scanOverview = el.card(); 
        scanOverview.appendChild(el.h("Digitalisate", 2));
        scanOverview.appendChild(el.h("Digitalisate und Werke", 3));
        const works = await arachne.work.getAll();
        let wResults = [0, 0];
        for(const work of works){
            if(work.in_use == 1){
                const cEditions = await arachne.edition.is(work.id, "work", false);
                if(cEditions.length > 0){
                    wResults[0] ++;
                } else {
                    wResults[1] ++;
                }
            }
        }
        const wLength = 100/(wResults[0]+wResults[1]);
        let workChartBox = document.createElement("DIV");
        workChartBox.style.width = "700px";
        workChartBox.style.margin = "auto";
        let workChart = document.createElement("CANVAS");
        workChartBox.appendChild(workChart);
        scanOverview.appendChild(workChartBox);
        scanOverview.appendChild(el.h("Volltexte und Scans", 3));
        new Chart(workChart, {
            type: "pie",
            data: {
                labels: [`Werke mit Editionen (${Math.round(wLength*wResults[0])}%)`, `Werke ohne Editionen (${Math.round(wLength*wResults[1])}%)`],
                datasets: [{
                    label: '',
                    data: [wResults[0], wResults[1]],
                    backgroundColor: ["#537727", "#F9F8ED"],
                    borderColor: ["#213409", "#F7F4D4"],
                    borderWidth: 1.5
                }]
            },
            options: {plugins: {legend: {position: "bottom", labels: {font: {size: "15px"}}}}}
        });

        const scans = await arachne.scan.getAll();
        let zResults = [0, 0];
        for(const scan of scans){
            if(scan.full_text != null && scan.full_text != ""){
                zResults[0] ++;
            } else {
                // no full text
                zResults[1] ++;
            }
        }
        const sLength = 100/(zResults[0]+zResults[1]);
        let scanChartBox = document.createElement("DIV");
        scanChartBox.style.width = "700px";
        scanChartBox.style.margin = "auto";
        let scanChart = document.createElement("CANVAS");
        scanChartBox.appendChild(scanChart);
        scanOverview.appendChild(scanChartBox);
        new Chart(scanChart, {
            type: "pie",
            data: {
                labels: [`Scans mit Volltext (${Math.round(sLength*zResults[0])}%)`, `Scans ohne Volltext (${Math.round(sLength*zResults[1])}%)`],
                datasets: [{
                    label: '',
                    data: [zResults[0], zResults[1]],
                    backgroundColor: ["#537727", "#F9F8ED"],
                    borderColor: ["#213409", "#F7F4D4"],
                    borderWidth: 1.5
                }]
            },
            options: {plugins: {legend: {position: "bottom", labels: {font: {size: "15px"}}}}}
        });
//        zettelOverview.appendChild(zettelChartBox);
        mainBody.appendChild(scanOverview);

        this.ctn.appendChild(mainBody);


    }
    drawZettelAdd(zettels, zettelAddBox, userId){
        let zettelAdd = document.createElement("CANVAS");
        zettelAddBox.appendChild(zettelAdd);
        let zettelAddData = {};
        for(const zettel of zettels){
            if(zettel.c_date!=null && (userId === 0 || userId === zettel.user_id)){
                const zDate = zettel.c_date.substring(0, 7);
                if(zDate in zettelAddData){zettelAddData[zDate] ++;}
                else{zettelAddData[zDate] = 1}
            }
        }
        let zettelAddDataArray = [];
        for(const addData in zettelAddData){
            zettelAddDataArray.push([addData, zettelAddData[addData]]);
        }
        zettelAddDataArray.sort((a, b) => a[0]>b[0]);
        zettelAddData = {};
        for(const addData of zettelAddDataArray){zettelAddData[addData[0]] = addData[1]}

        new Chart(zettelAdd, {
            type: "bar",
            data: {
                labels: Object.keys(zettelAddData),
                datasets: [{
                    label: null,
                    backgroundColor: '#537727',
                    borderColor: '#213409',
                    data: Object.values(zettelAddData)
                }]
            },
            options: {plugins: {legend: {display: false}}}
        });
    }
    drawZettelChange(zettels, zettelChangeBox, userId){
        let zettelChange = document.createElement("CANVAS");
        zettelChangeBox.appendChild(zettelChange);
        let zettelChangeData = {};
        for(const zettel of zettels){
            if(zettel.u_date!=null && (userId === 0 || zettel.user_id === userId)){
                const zDate = zettel.u_date.substring(0, 7);
                if(zDate in zettelChangeData){zettelChangeData[zDate] ++;}
                else{zettelChangeData[zDate] = 1}
            }
        }
        let zettelChangeDataArray = [];
        for(const addData in zettelChangeData){
            zettelChangeDataArray.push([addData, zettelChangeData[addData]]);
        }
        zettelChangeDataArray.sort((a, b) => a[0]>b[0]);
        zettelChangeData = {};
        for(const addData of zettelChangeDataArray){zettelChangeData[addData[0]] = addData[1]}

        new Chart(zettelChange, {
            type: "line",
            data: {
                labels: Object.keys(zettelChangeData),
                datasets: [{
                    label: null,
                    data: Object.values(zettelChangeData),
                    fill: true,
                    borderColor: "#537727",
                    tension: 0.1
                }]
            },
            options: {plugins: {legend: {display: false}}}
        });
    }
}

class Tests extends Oculus{
    constructor(res, resId=null, access=[], main=false){
        super(res, resId, access, main);
    }
    async load(){
        /*
        const info = await fetch("/info/"+tbl, {
            headers: {"Authorization": `Bearer ${arachne.key.token}`}}).
            then(re => re.json()).
            catch(e => {throw e});
         */
        const serverStats = await fetch("/config/server_stats", {
            headers: {"Authorization": `Bearer ${arachne.key.token}`}}).
            then(re => re.json()).
            catch(e => {throw e});
        document.getElementById("headerMenu").style.opacity = "0";
        let speedTest = await arachne.zettel.getAll();
        let mochaDIV = document.createElement("DIV");
        mochaDIV.id = "mocha";
        this.ctn.appendChild(mochaDIV);
        let backButton = document.createElement("A");
        backButton.textContent = "zurück";
        backButton.href = "/";
        let backButtonDiv = document.createElement("DIV");
        backButtonDiv.style.position = "absolute";
        backButtonDiv.style.top = "0px";
        backButtonDiv.style.left = "10px";
        backButtonDiv.appendChild(backButton);
        this.ctn.appendChild(backButtonDiv);

        mocha.setup("bdd");
        mocha.slow(20);

        describe("Arachne", () => {
            describe("Umwandlungen (StQ):", () => {
                it("Prüfe: einfach", async () => {
                    chai.expect(await arachne.zettel.stringToQuery("test")).to.deep.equal([{
                        col: "*",
                        negative: false,
                        operator: "&&",
                        regex: false,
                        value: "test",
                        greater: false,
                        smaller: false
                    }]);
                    chai.expect(await arachne.zettel.stringToQuery("teste mich")).to.deep.equal([
                        {
                            col: "*",
                            negative: false,
                            operator: "&&",
                            regex: false,
                            value: "teste",
                            greater: false,
                            smaller: false
                        },
                        {
                            col: "*",
                            negative: false,
                            operator: "&&",
                            regex: false,
                            value: "mich",
                            greater: false,
                            smaller: false
                        }
                    ]);
                });
                it("Prüfe: einfach negativ", async () => {
                    chai.expect(await arachne.zettel.stringToQuery("-test")).to.deep.equal([{
                        col: "*",
                        negative: true,
                        operator: "&&",
                        regex: false,
                        value: "test",
                        greater: false,
                        smaller: false
                    }]);
                });
                it("Prüfe: einfach grösser als", async () => {
                    chai.expect(await arachne.zettel.stringToQuery(">test")).to.deep.equal([{
                        col: "*",
                        negative: false,
                        operator: "&&",
                        regex: false,
                        value: "test",
                        greater: true,
                        smaller: false
                    }]);
                });
                it("Prüfe: einfach kleiner als", async () => {
                    chai.expect(await arachne.zettel.stringToQuery("<test")).to.deep.equal([{
                        col: "*",
                        negative: false,
                        operator: "&&",
                        regex: false,
                        value: "test",
                        greater: false,
                        smaller: true 
                    }]);
                });
                it("Prüfe: Feldnamen", async () => {
                    chai.expect(await arachne.zettel.stringToQuery("id:test")).to.deep.equal([{
                        col: "id",
                        negative: false,
                        operator: "&&",
                        regex: false,
                        value: "test",
                        greater: false,
                        smaller: false
                    }]);
                    chai.expect(await arachne.zettel.stringToQuery("id:test lemma:rest")).to.deep.equal([
                        {
                            col: "id",
                            negative: false,
                            operator: "&&",
                            regex: false,
                            value: "test",
                            greater: false,
                            smaller: false
                        },
                        {
                            col: "lemma",
                            negative: false,
                            operator: "&&",
                            regex: false,
                            value: "rest",
                            greater: false,
                            smaller: false
                        }
                    ]);
                });
                it("Prüfe: Feldnamen grösser/kleiner", async () => {
                    chai.expect(await arachne.zettel.stringToQuery("id:>test")).to.deep.equal([{
                        col: "id",
                        negative: false,
                        operator: "&&",
                        regex: false,
                        value: "test",
                        greater: true,
                        smaller: false
                    }]);
                    chai.expect(await arachne.zettel.stringToQuery("id:<test")).to.deep.equal([{
                        col: "id",
                        negative: false,
                        operator: "&&",
                        regex: false,
                        value: "test",
                        greater: false,
                        smaller: true 
                    }]);
                });
                it("Prüfe: Feldnamen negativ", async () => {
                    chai.expect(await arachne.zettel.stringToQuery("id:-test")).to.deep.equal([{
                        col: "id",
                        negative: true,
                        operator: "&&",
                        regex: false,
                        value: "test",
                        greater: false,
                        smaller: false
                    }]);
                    chai.expect(await arachne.zettel.stringToQuery("id:test lemma:-rest")).to.deep.equal([
                        {
                            col: "id",
                            negative: false,
                            operator: "&&",
                            regex: false,
                            value: "test",
                            greater: false,
                            smaller: false
                        },
                        {
                            col: "lemma",
                            negative: true,
                            operator: "&&",
                            regex: false,
                            value: "rest",
                            greater: false,
                            smaller: false
                        }
                    ]);
                });
                it("Prüfe: einfach/Feldnamen gemischt", async () => {
                    chai.expect(await arachne.zettel.stringToQuery("test lemma:rest")).to.deep.equal([
                        {
                            col: "*",
                            negative: false,
                            operator: "&&",
                            regex: false,
                            value: "test",
                            greater: false,
                            smaller: false
                        },
                        {
                            col: "lemma",
                            negative: false,
                            operator: "&&",
                            regex: false,
                            value: "rest",
                            greater: false,
                            smaller: false
                        }
                    ]);
                });
                it("Prüfe: Sternchen", async () => {
                    chai.expect(await arachne.zettel.stringToQuery("lemma:stern*")).to.deep.equal([
                        {
                            col: "lemma",
                            negative: false,
                            operator: "&&",
                            regex: true,
                            value: "stern.*",
                            greater: false,
                            smaller: false
                        }
                    ]);
                });
            });
            describe("Suche:", () => {
                it("Prüfe: einfach", async () => {
                    let search = await arachne.lemma.search("kacabre");
                    chai.expect(search[0].id).to.equal(3);
                });
                it("Prüfe: einfach (negativ)", async () => {
                    let search = await arachne.lemma.search("quq");
                    chai.expect(search.length).to.equal(0);
                });
                it("Prüfe: Feldname", async () => {
                    let search = await arachne.lemma.search("lemma:k");
                    chai.expect(search[0].id).to.equal(1);
                });
                it("Prüfe: Feldname kleiner", async () => {
                    let search = await arachne.lemma.search("id:<2");
                    chai.expect(search.length).to.equal(1);
                });
                it("Prüfe: Feldname grösser", async () => {
                    let search = await arachne.author.search("id:>900");
                    chai.expect(search.length).to.equal(62);
                });
                it("Prüfe: Feldname (2 Resultate)", async () => {
                    let search = await arachne.lemma.search("lemma:syrupus");
                    chai.expect(search.length).to.equal(2);
                });
                it("Prüfe: 2 Feldnamen", async () => {
                    let search = await arachne.lemma.search("lemma:syrupus lemma_nr:2");
                    chai.expect(search.length).to.equal(1);
                    chai.expect(search[0].id).to.equal(8884);
                });
                it("Prüfe: 2 Feldnamen negativ", async () => {
                    let search = await arachne.lemma.search("lemma:syrupus lemma_nr:-2");
                    chai.expect(search.length).to.equal(1);
                    chai.expect(search[0].id).to.equal(8883);
                });
                it("Prüfe: Feldname NULL", async () => {
                    let search = await arachne.author.search("full:NULL");
                    chai.expect(search.length).to.equal(317);
                });
                it("Prüfe: normal + Sternchen", async () => {
                    let search = await arachne.lemma.search("syrup*");
                    chai.expect(search.length).to.equal(11);
                });
                it("Prüfe: Feldnamen + Sternchen", async () => {
                    let search = await arachne.lemma.search("lemma:syrup*");
                    chai.expect(search.length).to.equal(4);
                });
            });
            describe("Geschwindigkeit:", () => {
                it("Prüfe: is()", async () => {
                    let speed = await arachne.zettel.is(3);
                    chai.expect(speed.id).to.equal(3);
                });
                it("Prüfe: search()", async () => {
                    let speed = await arachne.zettel.search("id:3");
                    chai.expect(speed.length).to.equal(1);
                    chai.expect(speed[0].id).to.equal(3);
                }).timeout(10000);
                /*
                it("Prüfe: is() (index)", async () => {
                    let speed = await arachne.zettel.is(3, "zettel");
                    chai.expect(speed.id).to.equal(3);
                });*/
                it("Prüfe: search() (index)", async () => {
                    let speed = await arachne.zettel.search("id:3", "*", "zettel");
                    chai.expect(speed.length).to.equal(1);
                    chai.expect(speed[0].id).to.equal(3);
                }).timeout(20000);
                it("Prüfe: Array", async () => {
                    let results = [];
                    for(const sT of speedTest){
                        if(sT.id === 3){results.push(sT)}
                    }
                    chai.expect(results.length).to.equal(1);
                    chai.expect(results[0].id).to.equal(3);
                });
            });
            describe("sonstige Methoden:", () => {
                it("Prüfe: is()", async () => {
                    chai.expect(1).to.equal(1);
                });
            });
        });

        describe("Datenbank", () => {
            describe("Autoren", () => {
                it("Prüfe: ist aktuell... ", async () => {
                    let version = await arachne.author.version();
                    // SELECT MAX(u_date) FROM work;
                    chai.expect(version).to.equal(serverStats.author[0]);
                });
                it("Prüfe: ist komplett... ", async () => {
                    let count = await arachne.author.getAll();
                    // SELECT COUNT(*) FROM work;
                    chai.expect(count.length).to.equal(serverStats.author[1]);
                });
            });
            describe("Werke", () => {
                it("Prüfe: ist aktuell... ", async () => {
                    let version = await arachne.work.version();
                    // SELECT MAX(u_date) FROM work;
                    chai.expect(version).to.equal(serverStats.work[0]);
                });
                it("Prüfe: ist komplett... ", async () => {
                    let count = await arachne.work.getAll();
                    // SELECT COUNT(*) FROM work;
                    chai.expect(count.length).to.equal(serverStats.work[1]);
                });
            });
            describe("Lemmata", () => {
                it("Prüfe: ist aktuell... ", async () => {
                    let version = await arachne.lemma.version();
                    // SELECT MAX(u_date) FROM work;
                    chai.expect(version).to.equal(serverStats.lemma[0]);
                });
                it("Prüfe: ist komplett... ", async () => {
                    let count = await arachne.lemma.getAll();
                    chai.expect(count.length).to.equal(serverStats.lemma[1]);
                });
                it("Prüfe: Sortierung nach Lemma/Lemma Nr... ", async () => {
                    let count = await arachne.lemma.getAll("lemma");
                    chai.expect(count.length).to.equal(serverStats.lemma[1]);
                });
            });
            describe("Zettel", () => {
                it("Prüfe: ist aktuell... ", async () => {
                    let version = await arachne.zettel.version();
                    chai.expect(version).to.equal(serverStats.zettel[0]);
                });
                it("Prüfe: ist komplett... ", async () => {
                    let count = await arachne.zettel.getAll();
                    chai.expect(count.length).to.equal(serverStats.zettel[1]);
                }).timeout(10000);
                it("Prüfe: Sotierung nach Lemma/Lemma Nr/Datierung ... ", async () => {
                    let count = await arachne.zettel.getAll("zettel");
                    chai.expect(count.length).to.equal(serverStats.zettel[1]);
                }).timeout(10000);
            });
        }); 

        mocha.checkLeaks();
        mocha.run();
    }
}
