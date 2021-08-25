function mainZettel(){
    class Zettel extends React.Component{
        constructor(props){
            super(props);
        }
        render(){
            const zettel = this.props.item;
            let style = {width: "var(--zettelWidth)"};
            let classList = "zettel";
            let zettelContent = null;
            if(zettel.img_path!=null){
                if(zettel.in_use==0){classList+=", zettel_img, no_use"}
                else{classList+=", zettel_img, in_use"}
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
                zettelContent=(<img src={zettel.img_path+".jpg"}></img>/*,
                <div className="zettel_msg"></div>/*,
                <div className="zettel_menu"><span style={{float: "left"}}>{zettel.lemma_display}</span><span style={{float: "right"}}>{zettel.opus}</span></div>*/);
                /*
                let zettelMenu = document.createElement("DIV");
                zettelMenu.classList.add("zettel_menu");
                zettelMenu.innerHTML = ``;
                box.appendChild(zettelMenu);
                */
            } else {
                style.height = "var(--zettelHeight)";
                zettelContent = 
                <div className="digitalZettel">
                    <div className='digitalZettelLemma'>{zettel.lemma_display}</div>
                    <div className='digitalZettelDate'>{zettel.date_display}</div>
                    <div className='digitalZettelWork'>{zettel.opus}</div>
                    <div className='digitalZettelText'>{zettel.txt}</div>
                </div>;
            }
            const box = <div className={classList} id={zettel.id} style={style}>
                {zettelContent}
            </div>;
            return box;
        }
    }
    let mainBody = document.querySelector("main");
    mainBody.style.display = "block";
    class SearchBox extends React.Component{
        constructor(props){
            super(props);
            this.queryTxt = "";
        }
        render(){
            return <div>
                <input type="text" onChange={(e) => this.queryTxt = e.target.value} placeholder="Lemma..." style={{width:"200px"}} />
                <input type="button" value="suchen" onClick={() => {this.sendQuery()}} />
                
            </div>
        }
        sendQuery(){
            if(this.queryTxt!=""){this.props.searchQuery(this.queryTxt)} 
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
                //let txt = <h1>hallo! {this.state.currentElements}</h1>;
                let cEls = [];
                for(const cEl of this.state.currentElements){
                    cEls.push(<Zettel item={cEl} key={cEl.id} />);
                }

                let txt =
                    (<div>
                        <p className="minorTxt">gefunden: {this.state.count}</p>
                        <div id="navItems">&lt;<span id="navSelect">
                            {this.state.currentPage} von {this.state.pageMax}</span>&gt;
                        </div>
                        <div className="zettel_box">{cEls}</div>
                    </div>);
                return txt;
            } else {
                return "";
            }
        }
        async loadQuery(newQuery){
            const count = await loadData("zettel", {lemma: newQuery}, {count:true});
            const currentElements = await loadData("zettel", {lemma: newQuery}, {limit:100});
            this.setState({
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