import { Oculus } from "/file/js/oculus.js";
import { ContextMenu } from "/file/js/contextmenu.js";
//import { stringToQuery } from "/file/js/arachneWW.js";
import "/file/js/chart.js";

export { Administration, AdministrationDetail, Statistics, Tests };

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

class Statistics extends Oculus{
constructor(res, resId=null, access=[], main=false){
    super(res, resId, access, main);
}
async load(){
        this.ctn.innerHTML = `
<div class='card'>
    <h2>Server-Statistik</h3>
    <div id="loadLabel">Statistik wird geladen...</div>
    <div style="display:none;" id="statBox">
        <div style="width: 400px;">
            <h3>Zettel</h3>
            <canvas id="zettelChart"></canvas>
        </div>
        <div style="width: 400px;">
            <h3>Lemmata</h3>
            <canvas id="lemmaChart"></canvas>
        </div>
    </div>
</div>
`;
        this.loadScript();
    }

    async loadScript(){
        const zettels = await arachne.zettel.search("*");
        let results = [0, 0, 0, 0];
        for(const zettel of zettels){
            if(zettel.lemma_id!=null && zettel.work_id!=null){
                results[0]++;
            } else if(zettel.lemma_id!=null){
                results[1]++;
            } else if (zettel.work_id!=null){
                results[2]++;
            } else {
                results[3]++;
            }
        }
        new Chart(document.getElementById("zettelChart"), {
            type: "pie",
            data: {
                labels: ['abgeschlossen', 'nur mit Lemma verknüpft', 'nur mit Werk verknüpft', "unbearbeitet"],
                datasets: [{
                    label: '# of Votes',
                    data: [results[0], results[1], results[2], results[3]],
                    backgroundColor: [
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)'
                    ],
                    borderColor: [
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)'
                    ],
                    borderWidth: 1
                }]
            }
        });

        const lemmata = await arachne.lemma.search("*");
        new Chart(document.getElementById("lemmaChart"), {
            type: "pie",
            data: {
                labels: ["Lemmata"],
                datasets: [{
                    label: '# of Votes',
                    data: [lemmata.length],
                    backgroundColor: [
                        'rgba(54, 162, 235, 0.2)',
                    ],
                    borderColor: [
                        'rgba(54, 162, 235, 1)',
                    ],
                    borderWidth: 1
                }]
            }
        });

        document.getElementById("loadLabel").style.display = "none";
        document.getElementById("statBox").style.display = "flex";
    }
}

class Tests extends Oculus{
    constructor(res, resId=null, access=[], main=false){
        super(res, resId, access, main);
    }
    async load(){
        const serverStats = await fetch("/config/server_stats", {
            headers: {"Authorization": `Bearer ${argos.token}`}}).
            then(re => re.json()).
            catch(e => {throw e});
        console.log(serverStats);
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
                    chai.expect(stringToQuery("test")).to.deep.equal([{
                        col: "*",
                        negative: false,
                        operator: "&&",
                        regex: false,
                        value: "test",
                        greater: false,
                        smaller: false
                    }]);
                    chai.expect(stringToQuery("teste mich")).to.deep.equal([
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
                    chai.expect(stringToQuery("-test")).to.deep.equal([{
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
                    chai.expect(stringToQuery(">test")).to.deep.equal([{
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
                    chai.expect(stringToQuery("<test")).to.deep.equal([{
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
                    chai.expect(stringToQuery("id:test")).to.deep.equal([{
                        col: "id",
                        negative: false,
                        operator: "&&",
                        regex: false,
                        value: "test",
                        greater: false,
                        smaller: false
                    }]);
                    chai.expect(stringToQuery("id:test lemma:rest")).to.deep.equal([
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
                    chai.expect(stringToQuery("id:>test")).to.deep.equal([{
                        col: "id",
                        negative: false,
                        operator: "&&",
                        regex: false,
                        value: "test",
                        greater: true,
                        smaller: false
                    }]);
                    chai.expect(stringToQuery("id:<test")).to.deep.equal([{
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
                    chai.expect(stringToQuery("id:-test")).to.deep.equal([{
                        col: "id",
                        negative: true,
                        operator: "&&",
                        regex: false,
                        value: "test",
                        greater: false,
                        smaller: false
                    }]);
                    chai.expect(stringToQuery("id:test lemma:-rest")).to.deep.equal([
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
                    chai.expect(stringToQuery("test lemma:rest")).to.deep.equal([
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
                    chai.expect(stringToQuery("lemma:stern*")).to.deep.equal([
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
                    let search = await arachne.lemma.search("id:>9000");
                    chai.expect(search.length).to.equal(486);
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
                });
                /*
                it("Prüfe: is() (index)", async () => {
                    let speed = await arachne.zettel.is(3, "zettel");
                    chai.expect(speed.id).to.equal(3);
                });*/
                it("Prüfe: search() (index)", async () => {
                    let speed = await arachne.zettel.search("id:3", "*", "zettel");
                    chai.expect(speed.length).to.equal(1);
                    chai.expect(speed[0].id).to.equal(3);
                });
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
