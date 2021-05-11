import { Oculus } from "/file/js/oculus.js";
import { ContextMenu } from "/file/js/contextmenu.js";
import { stringToQuery } from "/file/js/arachne.js";
import "/file/js/chart.js";

export { Administration, Statistics, Tests };

class Administration extends Oculus{
    constructor(res, resId=null, access=[], main=false){
        super(res, resId, access, main);
    }
    async load(){
        let url = `/page/${this.res}`;
        if (this.resId != null){url += "/"+this.resId}
        arachne.getPage(url, this.ctn)
            .then(text => {this.ctn.innerHTML=text})
            .then(rest => {this.loadScript()})
            .catch(e => {throw e});
    }

    loadScript(){
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

/*
        }, "server_stats": function(me){
            me._getJSON("/data/zettel_stats", function(rData){
                let zettelStat = me.ctn.querySelector("div#zettelStat");
                let zTotal = rData.length;
                let zWork = 0;
                let zLemma = 0;
                let zWorkLemma = 0;
                let zProgress = {};
                let zTypes = {0: 0, 1: 0, 2: 0, 3: 0, 4:0, 5: 0, undefined: 0};
                const zTypesProps = Object.keys(zTypes);
                for(const zettel of rData){
                    if(zettel.work_id!=null && zettel.lemma_id!=null){zWorkLemma++}
                    else if(zettel.work_id!=null){zWork++}
                    else if(zettel.lemma_id!=null){zLemma++}
                    if(zettel.c_date != null){
                        if(zProgress[zettel.c_date.slice(0,7)]!=null){zProgress[zettel.c_date.slice(0,7)] ++}
                        else{zProgress[zettel.c_date.slice(0,7)]=1}
                    }
                    else{console.log(zettel)}
                    zTypes[zettel.type] ++;
                    /*
                    if(zTypesProps.includes(zettel.type)){
                        zTypes[zettel.type] ++;
                    } else {
                        zTypes.unknown ++;
                    }
                    */
/*
                }
                console.log(zTypes);
                console.log(Object.keys(zProgress).sort());
                const zLemmaPro =Math.round(100/zTotal*zLemma);
                const zWorkPro =Math.round(100/zTotal*zWork);
                const zFinishedPro =Math.round(100/zTotal*zWorkLemma);
                const fiColor = "#6D9C4B";
                const seColor = "#A4BA57";
                const thColor = "#D9D962";
                const foColor = "#F4F4E4";
                zettelStat.innerHTML = `<table style="position:relative; left: 400px; top: 100px; width: 500px;">
                <tr style="color:${fiColor};"><td>abgeschlossen:</td><td style="text-align:right;">${zWorkLemma}</td><td style="text-align:right;">${zFinishedPro}%</td></tr>
                <tr style="color:${seColor};"><td>nur mit Lemma verknüpft:</td><td style="text-align:right;">${zLemma}</td><td style="text-align:right;">${zLemmaPro}%</td></tr>
                <tr style="color:${thColor};"><td>nur mit Werk verknüpft:</td><td style="text-align:right;">${zWork}</td><td style="text-align:right;">${zWorkPro}%</td></tr>
                <tr style="border-top: 1px solid var(--mainTxtColor);"><td>Zettel gesamt:</td><td style="text-align:right;">${zTotal}</td><td style="text-align:right;">100%</td></tr>
                </table>`;
                const sPoint= Math.PI*1.5;

                let zCircle = document.createElement("CANVAS");
                zCircle.style.position = "relative";
                zCircle.style.top = "-140px";
                zCircle.style.left = "50px";
                zCircle.width = 250;
                zCircle.height = 250;
                const zCircleFirst = Math.PI*2/100*zFinishedPro;
                const zCircleSecond = Math.PI*2/100*(zLemmaPro+zFinishedPro);
                const zCircleThird = Math.PI*2/100*(zWorkPro+zLemmaPro+zFinishedPro);
                const zCircleFourth = Math.PI*2/100*((100-zWorkPro-zLemmaPro-zFinishedPro)+zWorkPro+zLemmaPro+zFinishedPro);
                let zCircleCtx = zCircle.getContext("2d");
                zCircleCtx.beginPath();
                zCircleCtx.fillStyle = fiColor;
                zCircleCtx.moveTo(125,125);
                zCircleCtx.arc(125, 125, 120, sPoint, sPoint+zCircleFirst, false);
                zCircleCtx.fill();
                zCircleCtx.beginPath();
                zCircleCtx.fillStyle = seColor;
                zCircleCtx.moveTo(125,125);
                zCircleCtx.arc(125, 125, 120, sPoint+zCircleFirst, sPoint+zCircleSecond, false);
                zCircleCtx.fill();
                zCircleCtx.beginPath();
                zCircleCtx.fillStyle = thColor;
                zCircleCtx.moveTo(125,125);
                zCircleCtx.arc(125, 125, 120, sPoint+zCircleSecond, sPoint+zCircleThird, false);
                zCircleCtx.fill();
                zCircleCtx.beginPath();
                zCircleCtx.fillStyle = foColor;
                zCircleCtx.moveTo(125,125);
                zCircleCtx.arc(125, 125, 120, sPoint+zCircleThird, sPoint+zCircleFourth, false);
                zCircleCtx.fill();
                zettelStat.appendChild(zCircle);

                /*
                zettelStat.innerHTML += `<table style="position:relative; left: 400px; top: 100px; width: 500px;">
                <tr style="color:${fiColor};"><td>Verzetteltes Material:</td><td style="text-align:right;">${zTypes[1]}</td><td style="text-align:right;">${zFinishedPro}%</td></tr>
                <tr style="color:${seColor};"><td>Exzerpt-Zettel:</td><td style="text-align:right;">${zTypes[2]}</td><td style="text-align:right;">${zLemmaPro}%</td></tr>
                <tr style="color:${thColor};"><td>Index-Zettel:</td><td style="text-align:right;">${zTypes[3]}</td><td style="text-align:right;">${zWorkPro}%</td></tr>
                <tr style="border-top: 1px solid var(--mainTxtColor);"><td>Literaturzettel:</td><td style="text-align:right;">${zTypes[4]}</td><td style="text-align:right;">100%</td></tr>
                <tr style="border-top: 1px solid var(--mainTxtColor);"><td>Unbekannter Zetteltyp:</td><td style="text-align:right;">${zTypes[0]+zTypes[undefined]}</td><td style="text-align:right;">100%</td></tr>
                </table>`;
                */
                /*
                let zCircle2 = document.createElement("CANVAS");
                const zSeg1= Math.PI*2/100*;
                const zSeg2= Math.PI*2/100*(zLemmaPro+zFinishedPro);
                const zSeg3= Math.PI*2/100*(zWorkPro+zLemmaPro+zFinishedPro);
                //const zSeg4= Math.PI*2/100*((100-zWorkPro-zLemmaPro-zFinishedPro)+zWorkPro+zLemmaPro+zFinishedPro);
                zCircle2.width = 250;
                zCircle2.height = 250;
                let zCircleCtx2 = zCircle2.getContext("2d");
                zCircleCtx2.beginPath();
                zCircleCtx2.fillStyle = fiColor;
                zCircleCtx2.moveTo(125,125);
                zCircleCtx2.arc(125, 125, 120, sPoint, sPoint+zCircleFirst, false);
                zCircleCtx2.fill();

                zettelStat.appendChild(zCircle2);
                */
/*


            }, {});
        }, "user_access": function(me){
            me.setSelection("main", "tr.userAccess", false);

            // contextmenu
            var cContext = new ContextMenu();
            cContext.addEntry('tr.userAccess', 'a', 'Zugriffsrechte verwalten', function(){argos.load("user_access_detail", me.selMarker["main"]["lastRow"])});
            me.setContext = cContext.menu;
        }, "user_access_detail": function(me){
            me.setSelection("main", "div.userAccessItem", true);
            const cAccess = JSON.parse(me.ctn.querySelector("div#cAccess").textContent);
            const rights = {"auth": "Profil aktiviert", "admin": "Adminrechte", "o_view": "Kommentarspalte (opera-Listen)",
            "o_edit": "opera-Listen bearbeiten", "z_add": "Zettel importieren", "z_edit": "Zettel bearbeiten",
            "l_edit": "Lemma-Liste bearbeiten", "library": "Zugriff auf Bibliothek", "e_edit": "Bibliothek bearbeiten",
            "setup": "Zugriff auf Datenbanksetup", "module": "Zugriff über Python-Modul",
            "editor": "Zugriff auf Lemmastrecken-Editor", "comment": "Zugriff auf Kommentarfunktion",
            "comment_moderator": "Kommentare moderieren"};
            let userAccessBox = me.ctn.querySelector("div#userAccessBox");
            for(const [right, description] of Object.entries(rights)){
                let nRight = document.createElement("DIV");
                nRight.classList.add("userAccessItem");
                if(cAccess.includes(right)){
                    nRight.classList.add("selMarked");
                    me.selMarker.main.ids.push(right);
                    me.selMarker.main.lastRow = right;
                }
                nRight.id = right;
                nRight.textContent = description;
                userAccessBox.appendChild(nRight);
            }

            // submit changes
            me.ctn.querySelector("input#submitUserEdit").addEventListener("click", function(){
            me._put("data/user_access/"+me.resId, {"access": JSON.stringify(me.selMarker.main.ids)}, function(){location.reload()});
            });
 */

class Tests extends Oculus{
    constructor(res, resId=null, access=[], main=false){
        super(res, resId, access, main);
    }
    async load(){
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
        mocha.slow(0);

        describe("Arachne", () => {
            describe("Umwandlungen (StQ):", () => {
                it("Prüfe: einfach", async () => {
                    chai.expect(stringToQuery("test")).to.deep.equal([{
                        col: "*",
                        negative: false,
                        operator: "&&",
                        regex: false,
                        value: "test"
                    }]);
                    chai.expect(stringToQuery("teste mich")).to.deep.equal([
                        {
                            col: "*",
                            negative: false,
                            operator: "&&",
                            regex: false,
                            value: "teste"
                        },
                        {
                            col: "*",
                            negative: false,
                            operator: "&&",
                            regex: false,
                            value: "mich"
                        }
                    ]);
                });
                it("Prüfe: einfach negativ", async () => {
                    chai.expect(stringToQuery("-test")).to.deep.equal([{
                        col: "*",
                        negative: true,
                        operator: "&&",
                        regex: false,
                        value: "test"
                    }]);
                });
                it("Prüfe: Feldnamen", async () => {
                    chai.expect(stringToQuery("id:test")).to.deep.equal([{
                        col: "id",
                        negative: false,
                        operator: "&&",
                        regex: false,
                        value: "test"
                    }]);
                    chai.expect(stringToQuery("id:test lemma:rest")).to.deep.equal([
                        {
                            col: "id",
                            negative: false,
                            operator: "&&",
                            regex: false,
                            value: "test"
                        },
                        {
                            col: "lemma",
                            negative: false,
                            operator: "&&",
                            regex: false,
                            value: "rest"
                        }
                    ]);
                });
                it("Prüfe: Feldnamen negativ", async () => {
                    chai.expect(stringToQuery("id:-test")).to.deep.equal([{
                        col: "id",
                        negative: true,
                        operator: "&&",
                        regex: false,
                        value: "test"
                    }]);
                    chai.expect(stringToQuery("id:test lemma:-rest")).to.deep.equal([
                        {
                            col: "id",
                            negative: false,
                            operator: "&&",
                            regex: false,
                            value: "test"
                        },
                        {
                            col: "lemma",
                            negative: true,
                            operator: "&&",
                            regex: false,
                            value: "rest"
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
                            value: "test"
                        },
                        {
                            col: "lemma",
                            negative: false,
                            operator: "&&",
                            regex: false,
                            value: "rest"
                        }
                    ]);
                });
            });
            describe("Suche:", () => {
                it("Prüfe: Feldname", async () => {
                    let search = await arachne.lemma.search("lemma:k");
                    chai.expect(search[0].id).to.equal(1);
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
                    chai.expect(version).to.equal("2021-04-14 18:00:00");
                });
                it("Prüfe: ist komplett... ", async () => {
                    let count = await arachne.author.getAll();
                    // SELECT COUNT(*) FROM work;
                    chai.expect(count.length).to.equal(956);
                });
            });
            describe("Werke", () => {
                it("Prüfe: ist aktuell... ", async () => {
                    let version = await arachne.work.version();
                    // SELECT MAX(u_date) FROM work;
                    chai.expect(version).to.equal("2021-05-01 14:59:51");
                });
                it("Prüfe: ist komplett... ", async () => {
                    let count = await arachne.work.getAll();
                    // SELECT COUNT(*) FROM work;
                    chai.expect(count.length).to.equal(3995);
                });
            });
            describe("Lemmata", () => {
                it("Prüfe: ist aktuell... ", async () => {
                    let version = await arachne.lemma.version();
                    // SELECT MAX(u_date) FROM work;
                    chai.expect(version).to.equal("2021-05-06 12:52:10");
                });
                it("Prüfe: ist komplett... ", async () => {
                    let count = await arachne.lemma.getAll();
                    chai.expect(count.length).to.equal(9360);
                });
                it("Prüfe: Sortierung nach Lemma/Lemma Nr... ", async () => {
                    let count = await arachne.lemma.getAll("lemma");
                    chai.expect(count.length).to.equal(9360);
                });
            });
            describe("Zettel", () => {
                it("Prüfe: ist aktuell... ", async () => {
                    let version = await arachne.zettel.version();
                    chai.expect(version).to.equal("2021-05-06 14:28:56");
                });
                it("Prüfe: ist komplett... ", async () => {
                    let count = await arachne.zettel.getAll();
                    chai.expect(count.length).to.equal(124523);
                }).timeout(10000);
                it("Prüfe: Sotierung nach Lemma/Lemma Nr/Datierung ... ", async () => {
                    let count = await arachne.zettel.getAll("zettel");
                    chai.expect(count.length).to.equal(124523);
                }).timeout(10000);
            });
        }); 

        mocha.checkLeaks();
        mocha.run();
    }
}
