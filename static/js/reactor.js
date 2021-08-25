class Zettel extends React.Component{
    render(){
        const zettel = this.props.item;
        let style = {width: "var(--zettelWidth)"};
        
        if(zettel.img_path!=null){
            let classList = "";
            if(zettel.in_use==0){classList+="zettel_img no_use"}
            else{classList+="zettel_img in_use"}
                            /*
            let imgMSG = document.createElement("DIV");
            imgMSG.classList.add("zettel_msg");
            if(zettel.sibling>0){
                imgMSG.innerHTML = "<span style='color: var(--contraColor);' title='Geschwisterzettel'>&#x273F;</span>"
            }
            if(zettel.date_sort===9 && zettel.date_own === null){
                imgMSG.innerHTML +="<span style='color: var(--errorStat);' title='Datierung erforderlich'>&#x0021;</span>";
            }
            box.appendChild(imgMSG);
            */
            const box =
            <div className="zettel" id={zettel.id} style={style}>
                <img className={classList} src={zettel.img_path+".jpg"}></img>,
                <div className="zettel_msg"></div>/*,
                <div className="zettel_menu">
                    <span style={{float: "left"}}>{zettel.lemma_display}</span>
                    <span style={{float: "right"}}>{zettel.opus}</span>
                </div>
            </div>;
            return box;
        } else {
            style.height = "var(--zettelHeight)";
            const box =
            <div className="zettel" id={zettel.id} style={style}>
                <div className="digitalZettel">
                    <div className='digitalZettelLemma'>{zettel.lemma_display}</div>
                    <div className='digitalZettelDate'>{zettel.date_display}</div>
                    <div className='digitalZettelWork'>{zettel.opus}</div>
                    <div className='digitalZettelText'>{zettel.txt}</div>
                </div>
            </div>;
            return box;
        }
    }
}

function mainZettel(){
    class SearchInput extends React.Component{
        constructor(props){
            super(props);
            this.item = props.item;
        }
        render(){
            return (
            <div className="searchFields" style={{border: "1px solid var(--minorColor)", width: "290px", marginRight: "10px", marginBottom: "10px"}}>
                <select style={{width: "100px", marginRight: "0px", border: "none", color: "var(--mainColor)"}}>
                    <option value="lemma">Lemma</option>
                    <option value="type">Typ</option>
                    <option value="id">ID</option>
                    <option value="opus">Werk</option>
                </select>
                <select style={{width: "40px", marginRight: "0px", border: "none", color: "var(--mainColor)"}}>
                    <option value="=">=</option>
                    <option value=">">&gt;</option>
                    <option value="<">&lt;</option></select>
                <input type="text" placeholder="..."  style={{width: "100px", marginRight: "17px", border:"none"}} />
                <span style={{backgroundColor: "var(--minorColor)", color: "var(--mainBG)", borderRadius: "25px", padding: "0px 8px 2px 8px"}} onClick={
                    () => {this.props.removeSearchFields(this.props.item.id)}
                }>-</span>
            </div>
            );
        }
    }

    let mainBody = document.querySelector("main");
    mainBody.style.display = "block";
    class SearchBox extends React.Component{
        constructor(props){
            super(props);
            this.queryTxt = "";
            this.state = {nextID: 1, searchFields: [{id: 0, c:"lemma", o:"=", v:""}]};
        }
        render(){
            const searchBox = {
                boxShadow: "0 0 2px var(--shadowBG)",
                padding: "10px 15px",
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center"
            };
            let cSF = [];
            for(const sF of this.state.searchFields){
                cSF.push(<SearchInput removeSearchFields={id => {this.removeSearchFields(id)}} item={sF} key={sF.id} />);
            }
            return <div style={{paddingBottom: "52px"}}>
                <div style={searchBox}>
                    {cSF}
                    <div style={{
                        backgroundColor: "var(--mainColor)",
                        color: "var(--mainBG)",
                        borderRadius: "25px",
                        padding: "0px 8px 2px 8px",
                        position: "relative",
                        top: "-5px"
                    }} onClick={
                        () => {
                            this.addSearchFields();
                        }
                    }>
                        +
                    </div>
                </div>
                <input style={{float: "right", marginTop: "10px"}} type="button" value="suchen" onClick={() => {this.sendQuery()}} />
                
            </div>
        }
        removeSearchFields(id){
            const nSearchFields = this.state.searchFields.filter(s => s.id!=id);
            this.setState({searchFields: nSearchFields});
        }
        addSearchFields(){
            let nSearchFields = this.state.searchFields;
            nSearchFields.push({
                id: this.state.nextID,
                c: "lemma",
                o: "=",
                v: ""
            });
            this.setState({nextID: (this.state.nextID+1), searchFields: nSearchFields});
        }
        sendQuery(){
            let exportSF = [];
            const searchFields = document.querySelectorAll(".searchFields");
            for(const sF of searchFields){
                if(sF.children[2].value != ""){
                    exportSF.push({
                        c: sF.children[0].value,
                        o: sF.children[1].value,
                        v: sF.children[2].value
                    });
                }
            }
            if(exportSF.length > 0){this.props.searchQuery(exportSF)} 
            else {alert("Geben Sie einen Suchtext ein!")}
        }
    }
    class ZettelBox extends React.Component{
        constructor(props){
            super(props);
            let mainHeader = document.querySelector("header");
            mainHeader.style.display = "block";
            ReactDOM.render(<SearchBox searchQuery={(q) => {this.loadQuery(q)}} />, mainHeader);
            this.state = {count:0};
        }
        render(){
            if(this.state.count>0){
                let cEls = [];
                for(const cEl of this.state.currentElements){
                    cEls.push(<Zettel item={cEl} key={cEl.id} />);
                }

                let txt =
                    (<div>
                        <p className="minorTxt">gefunden: {this.state.count}</p>
                        <div id="navItems">
                            <span onClick={()=>{this.loadPage(-1)}}>&lt;</span>
                            <span id="navSelect">{this.state.currentPage} von {this.state.pageMax}</span>
                            <span onClick={()=>{this.loadPage(1)}}>&gt;</span>
                        </div>
                        <div className="zettel_box">{cEls}</div>
                    </div>);
                return txt;
            } else {
                return "";
            }
        }
        async loadPage(move){
            if(this.state.currentPage+move>0&&this.state.currentPage+move<=this.state.pageMax){
                const currentElements = await searchData("zettel", this.state.query, {limit:100, offset:((this.state.currentPage+move-1)*100)});
                this.setState({
                    currentPage: this.state.currentPage+move,
                    currentElements: currentElements
                });
            }
        }
        async loadQuery(newQuery){
            const count = await searchData("zettel", newQuery, {count:true});
            const currentElements = await searchData("zettel", newQuery, {limit:100});
            this.setState({
                query: newQuery,
                count: count[0]["count"],
                pageMax: Math.floor(count[0]["count"]/100)+1,
                currentPage: 1,
                currentElements: currentElements
            });
        }
    }
    ReactDOM.render(<ZettelBox />, mainBody);
}

async function loadData(res, query, options={}){
    // options = {count:true|false, limit:100, offset:100}
    let url = `/data/${res}?query=${JSON.stringify(query)}`;
    if(options.count===true){url += "&count=1"}
    if(options.limit){url += "&limit="+options.limit}
    if(options.offset){url += "&offset="+options.offset}
    return await fetch(url, {headers: {"Authorization": `Bearer ${arachne.key.token}`}})
    .then(re => {
        if(re.status === 200){return re.json()}
        else{window.open("/", "_self")}
    });
}

async function searchData(res, query, options={}){
    // options = {count:true|false, limit:100, offset:100}
    let url = `/data/${res}?query=${JSON.stringify(query)}`;
    if(options.count===true){url += "&count=1"}
    if(options.limit){url += "&limit="+options.limit}
    if(options.offset){url += "&offset="+options.offset}
    return await fetch(url, {headers: {"Authorization": `Bearer ${arachne.key.token}`}})
    .then(re => {
        if(re.status === 200){return re.json()}
        else{window.open("/", "_self")}
    });
}