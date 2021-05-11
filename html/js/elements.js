export { Elements, html };

function html(i){
    if(i==null){return ""}
    else{return DOMPurify.sanitize(i.replace(/&lt;/g, "<").replace(/&gt;/g, ">"), { ALLOWED_TAGS: ["aut", "b", "i", "sup"] })}
};

class Elements {
    constructor(){
        //this.ctn = ctn;
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
    table(values, widths=null){
        /*
         * values = 2 dimensional array containing str/HTML elements
         * widths = array containing width in pixel for cols
         */
        let tbl = document.createElement("TABLE");
        for(const row of values){
            let tRow = document.createElement("TR");
            for(const col of row){
                let tCol = document.createElement("TD");
                if(typeof col === "string"){
                    tCol.innerHTML = col;
                } else if(col == null){
                    tCol.textContent = "";
                } else {
                    tCol = col;
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
        p.textContent = value;
        return p;
    }
}

