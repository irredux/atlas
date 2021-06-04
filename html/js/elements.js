export { Elements, html };

function html(i){
    if(i==null){return ""}
    else{return DOMPurify.sanitize(i.replace(/&lt;/g, "<").replace(/&gt;/g, ">"), { ADD_TAGS: ["aut", "gruen", "gelb", "rot", "blau"] })}
};

class Elements {
    constructor(){
        //this.ctn = ctn;
    }
    span(content=null, attr = {}){
        let span = document.createElement("span");
        if(content!=null){span.innerHTML = html(content)}
        if(attr.class!=null){span.classList.add(attr.class)}
        return span;
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
    pop(button, content, direction = "right", position = "absolute"){
        let box = document.createElement("DIV");
        box.style.position = position;
        box.classList.add("popOver");
        box.innerHTML = html(`<a>${button}</a>`);
        let boxContent = document.createElement("DIV");
        boxContent.classList.add("popOverContent");
        if(position === "relative"){boxContent.style.position = "absolute"}
        boxContent.style.textAlign = direction;
        boxContent.innerHTML = html(content);
        box.appendChild(boxContent);
        return box;
    }
    popHTMLHelp(){
        let helpContent = `
<h3>Hilfe bei der Formatierung</h3>
<p class='minorTxt'>Texte können per HTML-Elementen formatiert werden. Der Text, der formatiert werden soll, muss links und rechts mit den speziellen 'Tags' umschlossen werden. Im Folgenden finden Sie eine Liste mit den möglichen Formatierungen.</p>
<table class='minorTxt'>
        <tr>
            <td><b>Formatierung</b></td>
            <td><b>Beschreibung</b></td>
            <td><b>Beispiel</b></td>
        </tr>
        <tr>
            <td><b>fett</b></td>
            <td>Text mit Schriftstärke 'fett' (engl. bold)</td>
            <td>&#60;b&gt;fett&#60;/b&gt; &rarr; <b>fett</b></td>
        </tr>
        <tr>
            <td><i>kursiv</i></td>
            <td>Text mit Schriftlage 'kursiv' (engl. italic)</td>
            <td>&#60;i&gt;kursiv&#60;/i&gt; &rarr; <i>kursiv</i></td>
        </tr>
        <tr>
            <td>Text<sup>hochgestellt</sup></td>
            <td>Hochgestellter Text (engl. superscript text)</td>
            <td>Text&#60;sup&gt;hochgestellt&#60;/sup&gt; &rarr; Text<sup>hochgestellt</sup></td>
        </tr>
        <tr>
            <td><aut>Autor</aut></td>
            <td>Text in Kapitälchen (= Autorangabe)</td>
            <td>&#60;aut&gt;Autor&#60;/aut&gt; &rarr; <aut>Autor</aut></td>
        </tr>
        <tr>
            <td><gruen>grün</gruen></td>
            <td>Grün markierter Text</td>
            <td>&#60;gruen&gt;grün&#60;/gruen&gt; &rarr; <gruen>grün</gruen></td>
        </tr>
        <tr>
            <td><gelb>gelb</gelb></td>
            <td>Gelb markierter Text</td>
            <td>&#60;gelb&gt;gelb&#60;/gelb&gt; &rarr; <gelb>gelb</gelb></td>
        </tr>
        <tr>
            <td><rot>rot</rot></td>
            <td>Rot markierter Text</td>
            <td>&#60;rot&gt;rot&#60;/rot&gt; &rarr; <rot>rot</rot></td>
        </tr>
        <tr>
            <td><blau>blau</blau></td>
            <td>Blau markierter Text</td>
            <td>&#60;blau&gt;blau&#60;/blau&gt; &rarr; <blau>blau</blau></td>
        </tr>
</table>
<p>
    <i class='minorTxt'>Achtung: HTML-Tags werden bei der Suche berücksichtigt und sollten darum nur in Feldern benutzt werden, welche ausschließlich zur Anzeige dienen.</i>
</p>
<h3>Sonderzeichen</h3>
<p class='minorTxt'>Sonderzeichen können per Copy&amp;Paste eingesetzt werden, oder als HTML-Entity eingegeben werden. Im Folgenden finden Sie eine Liste mit Zeichen, die in den Text eingefügt werden können.
<table class='minorTxt'>
    <tr>
        <td><b>Zeichen</b></td>
        <td><b>HTML Code</b></td>
    </tr>
    <tr>
        <td>&para; <i>(Zeilenumbruch)</i></td>
        <td>&#60;br /&gt;</td>
    </tr>
    <tr>
        <td>&dagger;</td>
        <td>&amp;dagger&#59;</td>
    </tr>
</table>
        `;
        return this.pop("Hilfe", helpContent, "left");
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
            case "updated":
                statusBox.textContent = (displayTxt==="") ? "Die Datenbank ist jetzt aktuell." : displayTxt;
                break;
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

