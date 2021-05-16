export { Elements, html };

function html(i){
    if(i==null){return ""}
    else{return DOMPurify.sanitize(i.replace(/&lt;/g, "<").replace(/&gt;/g, ">"), { ADD_TAGS: ["aut"] })}
};

class Elements {
    constructor(){
        //this.ctn = ctn;
    }
    div(content=null, attr = {}){
        let div = document.createElement("DIV");
        if(content!=null){div.innerHTML = html(content)}
        if(attr.class!=null){div.classList.add(attr.class)}
        return div;
    }
    i(content, attr = {}){
        // classList must be an array
        let i = document.createElement("I");
        i.innerHTML = html(content);
        if(attr.class!=null){i.classList.add(attr.class)}
        return i;
    }
    pop(button, content, direction = "left"){
        let box = document.createElement("DIV");
        box.classList.add("popOver");
        box.innerHTML = html(`<a>${button}</a>`);
        let boxContent = document.createElement("DIV");
        boxContent.classList.add("popOverContent");
        boxContent.style.textAlign = direction;
        boxContent.innerHTML = html(content);
        box.appendChild(boxContent);
        return box;
    }
    tab(value, name){
        let tab = document.createElement("DIV");
        tab.classList.add("tab");
        tab.setAttribute("name", name);
        tab.textContent = value;
        return tab;
    }
    tabContainer(name){
        let container = document.createElement("DIV");
        container.classList.add("tab_container");
        container.setAttribute("name", name);
        return container;
    }
    table(values, widths=[]){
        /*
         * values = 2 dimensional array containing str/HTML elements
         * widths = array containing width in pixel for cols
         */
        let tbl = document.createElement("TABLE");
        for(const row of values){
            let tRow = document.createElement("TR");
            let i = 0;
            for(;i<row.length;i++){
                let tCol = document.createElement("TD");
                if(widths[i]!=null){tCol.width = widths[i]}
                if(typeof row[i] === "string"){
                    tCol.innerHTML = row[i];
                } else if(row[i] == null){
                    tCol.textContent = "";
                } else {
                    tCol.appendChild(row[i]);
                }
                tRow.appendChild(tCol);
            }
            tbl.appendChild(tRow);
        }
        return tbl;
    }
    card(){
        let card = document.createElement("DIV");
        card.classList.add("card");
        return card;
    }
    status(type, displayTxt = ""){
        let statusBox = document.createElement("DIV");
        statusBox.classList.add("statusLabel");
        switch(type){
            case "saved":
                statusBox.textContent = (displayTxt==="") ? "Eintrag gespeichert." : displayTxt;
                break;
            case "error":
                statusBox.textContent =  (displayTxt==="") ? "Ein Fehler ist aufgetreten." : displayTxt;
                statusBox.style.color = "var(--errorStat)";
                break;
            default:
                statusBox.textContent =  (displayTxt==="") ? "Ein Fehler ist aufgetreten." : displayTxt;
        }
        document.body.appendChild(statusBox);
        setTimeout(() => {statusBox.remove()}, 2000);
    }
    h(value, lvl){
        let h = document.createElement("H"+lvl);
        h.innerHTML = html(value);
        return h;
    }
    text(value=""){
        let txt = document.createElement("INPUT");
        txt.type = "text";
        txt.value = value;
        return txt;
        //this.ctn.appendChild(txt);
    }
    area(value=""){
        let area = document.createElement("TEXTAREA");
        area.value = value;
        return area;
    }
    button(value){
        let button = document.createElement("INPUT");
        button.type = "button";
        button.value = value;
        return button;
    }
    closeButton(eye){
        let closeLabel = document.createElement("DIV");
        closeLabel.textContent = "X"; closeLabel.classList.add("closeLabel");
        closeLabel.onclick = () => {eye.close()}
        return closeLabel;
    }
    select(selected, values = {0: "Nein", 1: "Ja"}){
        let select = document.createElement("SELECT");
        for(const value in values){
            let op = document.createElement("OPTION");
            op.value = value;
            op.textContent = values[value];
            if(selected==value){op.selected = true}
            select.appendChild(op);
        }
        return select;
    }
    p(value){
        let p = document.createElement("P");
        p.innerHTML = html(value);
        return p;
    }
}

