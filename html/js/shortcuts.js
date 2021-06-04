export class ShortCuts{
    constructor(arg){
        this.elements = {};

        // lemma
        this.add("lemma", "w", arg.popEye);
        this.add("lemma", "e", function(){
            if(arg.o["lemma"].selMarker["main"]["lastRow"] != ""){
                arg.loadEye("lemma_edit", arg.o["lemma"].selMarker["main"]["lastRow"])
            }
        });
        this.add("lemma", "n", function(){arg.loadEye("lemma_add")});
        // library 
        this.add("library", "w", arg.popEye);
        // opera 
        this.add("opera_mai", "w", arg.popEye);
        this.add("opera_min", "w", arg.popEye);
        // zettel
        this.add("zettel", "w", arg.popEye);
        this.add("zettel", "b", function(){arg.loadEye("zettel_batch")});
        this.add("zettel", "n", function(){arg.loadEye("zettel_add")});
        // user_access 
        this.add("user_access", "w", arg.popEye);
        // project
        this.add("project", "w", arg.popEye);
        this.add("project", "a", function(){argos.main.editArticleStructure()});
        this.add("project", "d", function(){
            if(argos.main.selMarker.main.lastRow!==0){
                argos.main.resultLst = [];
                for(const id of argos.main.selMarker.main.ids){
                    argos.main.resultLst.push(parseInt(id));
                }
                arg.loadEye("zettel_detail", argos.main.selMarker.main.lastRow);
        }});
        this.add("project", "p", function(){arg.loadEye("project_export",argos.main.resId)});
        this.add("project", "m", function(){
            if(argos.main.selMarker.main.lastRow!==0){
                argos.main.currentArticle = document.querySelector(".detail_zettel[id='"+argos.main.selMarker.main.lastRow+"']").parentNode;
                argos.loadEye("zettel_add");
            }
        });
        this.add("project", "i", function(){
            if(argos.main.selMarker.main.lastRow!==0){argos.main.includeInExport()}
        });
        this.add("project", "e", function(){
            const cObj = document.getElementById("edition");
            if(cObj!=null){cObj.querySelector(".projectMenuButton").click()}
        });
        this.add("project", "k", function(){
            const cObj = document.getElementById("comment");
            if(cObj!=null){cObj.querySelector(".projectMenuButton").click()}
        });
        this.add("project", "o", function(){
            const cObj = document.getElementById("opera");
            if(cObj!=null){cObj.querySelector(".projectMenuButton").click()}
        });
        this.add("project", "z", function(){
            const cObj = document.getElementById("zettel");
            if(cObj!=null){cObj.querySelector(".projectMenuButton").click()}
        });
        // viewer 
        this.add("viewer", "e", () => {
            if(argos.access.includes("l_edit")){argos.loadEye("library_edit", argos.main.resId)}
        });
    }

    add(res, key, onEvent){
        if(Object.keys(this.elements).includes(res)){
            this.elements[res].push({"key": key, "function": onEvent});
        } else {
            this.elements[res] = [{"key": key, "function": onEvent}];
        }
    }

    load(res){
        let oldElements = document.querySelectorAll("div.accessKeySys");
        if(oldElements != null){oldElements.forEach(function(e){e.remove()})}
        if(Object.keys(this.elements).includes(res)){
            for(var element of this.elements[res]){
                var nElement = document.createElement("DIV");
                nElement.classList.add("accessKeySys");
                nElement.onclick = element["function"];
                nElement.setAttribute("accesskey", element["key"]);
                document.body.appendChild(nElement);
            }
        }
    }
}
