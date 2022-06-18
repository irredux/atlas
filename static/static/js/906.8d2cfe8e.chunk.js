"use strict";(self.webpackChunkatlas=self.webpackChunkatlas||[]).push([[906],{5906:function(e,t,n){n.r(t),n.d(t,{BatchInputType:function(){return B},IndexBoxDetail:function(){return O},LemmaAsideContent:function(){return C},LemmaHeader:function(){return w},LemmaRow:function(){return F},MainMenuContent:function(){return M},StatisticsChart:function(){return Q},ZettelAddLemmaContent:function(){return E},ZettelCard:function(){return z},ZettelSingleContent:function(){return I},arachneTbls:function(){return v},exportZettelObject:function(){return L},fetchIndexBoxData:function(){return T},lemmaSearchItems:function(){return k},newZettelObject:function(){return W},zettelBatchOptions:function(){return N},zettelPresetOptions:function(){return A},zettelSearchItems:function(){return S},zettelSortOptions:function(){return D}});var a=n(7762),r=n(5861),s=n(885),i=n(7757),l=n.n(i),o=n(3222),d=n(6407),c=n(7022),u=n(9743),m=n(2677),h=n(2354),x=n(1398),p=n(9140),g=n(8949),f=n(4849),j=n(2791),b=n(4483),Z=n(3174),_=(n(6546),n(9683)),y=n(184);function v(){return["project","author","edition","lemma","opera_maiora","opera_minora","scan","scan_lnk","work","zettel","user","seklit","article","zettel_lnk","statistics","scan_paths","ocr_jobs","comment","scan_opera","fulltext_search_view","tags","tag_lnks","sections"]}function w(){return(0,y.jsxs)("tr",{children:[(0,y.jsx)("th",{width:"30%",children:"Wortansatz"}),(0,y.jsx)("th",{width:"20%",children:"W\xf6rterb\xfccher"}),(0,y.jsx)("th",{children:"Kommentar"})]})}function F(e){return(0,y.jsxs)("tr",{id:e.lemma.id,onDoubleClick:function(t){e.showDetail(parseInt(t.target.closest("tr").id))},children:[(0,y.jsx)("td",{title:"ID: "+e.lemma.id,children:(0,y.jsx)("a",{dangerouslySetInnerHTML:(0,o.rg)(e.lemma.lemma_display),onClick:function(t){localStorage.setItem("mlw_searchBox_zettel",'[[{"id":0,"c":"lemma_id","o":"=","v":'.concat(e.lemma.id,'}],1,["id"]]')),e.loadMain(t)}})}),(0,y.jsx)("td",{dangerouslySetInnerHTML:(0,o.rg)(e.lemma.dicts)}),(0,y.jsx)("td",{dangerouslySetInnerHTML:(0,o.rg)(e.lemma.comment)})]})}function k(){return[["lemma","Wort"],["lemma_ac","Wort-Anzeige"],["id","ID"],["dicts","W\xf6rterb\xfccher"],["comment","Kommentar"],["lemma_nr","Zahlzeichen"],["MLW","MLW"],["Stern","Stern"],["Fragezeichen","Fragezeichen"]]}function C(e){var t=(0,j.useState)(e.item.lemma),n=(0,s.Z)(t,2),i=n[0],h=n[1],x=(0,j.useState)(e.item.lemma_display),p=(0,s.Z)(x,2),g=p[0],f=p[1],b=(0,j.useState)(e.item.lemma_nr),Z=(0,s.Z)(b,2),_=Z[0],v=Z[1],w=(0,j.useState)(e.item.MLW),F=(0,s.Z)(w,2),k=F[0],C=F[1],S=(0,j.useState)(e.item.Fragezeichen),z=(0,s.Z)(S,2),N=z[0],B=z[1],E=(0,j.useState)(e.item.Stern),I=(0,s.Z)(E,2),W=I[0],L=I[1],A=(0,j.useState)(e.item.comment),D=(0,s.Z)(A,2),M=D[0],T=D[1],H=(0,j.useState)(e.item.dicts),O=(0,s.Z)(H,2),Q=O[0],J=O[1];return(0,j.useEffect)((function(){h(e.item.lemma),f(e.item.lemma_display),v(e.item.lemma_nr),C(e.item.MLW),B(e.item.Fragezeichen),L(e.item.Stern),T(e.item.comment),J(e.item.dicts)}),[e.id]),(0,y.jsxs)(c.Z,{children:[(0,y.jsxs)(u.Z,{className:"mb-2",children:[(0,y.jsx)(m.Z,{children:"Wort:"}),(0,y.jsx)(m.Z,{children:(0,y.jsx)("input",{type:"text",value:i,onChange:function(e){h(e.target.value)}})})]}),(0,y.jsxs)(u.Z,{className:"mb-5",children:[(0,y.jsx)(m.Z,{children:"Wort-Anzeige:"}),(0,y.jsx)(m.Z,{children:(0,y.jsx)("input",{type:"text",value:(0,o.Nx)(g),onChange:function(e){f(e.target.value)}})})]}),(0,y.jsxs)(u.Z,{className:"mb-2",children:[(0,y.jsx)(m.Z,{children:"Zahlzeichen:"}),(0,y.jsx)(m.Z,{children:(0,y.jsx)(o.SA,{options:[[0,""],[1,1],[2,2],[3,3],[4,4],[5,5],[6,6]],onChange:function(e){v(e.target.value)},value:_})})]}),(0,y.jsxs)(u.Z,{className:"mb-2",children:[(0,y.jsx)(m.Z,{children:"im W\xf6rterbuch:"}),(0,y.jsx)(m.Z,{children:(0,y.jsx)(o.SA,{options:[[0,"Nein"],[1,"Ja"]],onChange:function(e){C(e.target.value)},value:k})})]}),(0,y.jsxs)(u.Z,{className:"mb-2",children:[(0,y.jsx)(m.Z,{children:"Stern:"}),(0,y.jsx)(m.Z,{children:(0,y.jsx)(o.SA,{options:[[0,"Nein"],[1,"Ja"]],onChange:function(e){L(e.target.value)},value:W})})]}),(0,y.jsxs)(u.Z,{className:"mb-5",children:[(0,y.jsx)(m.Z,{children:"Fragezeichen:"}),(0,y.jsx)(m.Z,{children:(0,y.jsx)(o.SA,{options:[[0,"Nein"],[1,"Ja"]],onChange:function(e){B(e.target.value)},value:N})})]}),(0,y.jsxs)(u.Z,{className:"mb-2",children:[(0,y.jsx)(m.Z,{children:"W\xf6rterb\xfccher:"}),(0,y.jsx)(m.Z,{children:(0,y.jsx)("textarea",{style:{width:"210px",height:"50px"},value:Q?Q.replace(/&lt;/g,"<").replace(/&gt;/g,">"):"",onChange:function(e){J(e.target.value)}})})]}),(0,y.jsxs)(u.Z,{className:"mb-4",children:[(0,y.jsx)(m.Z,{children:"Kommentar:"}),(0,y.jsx)(m.Z,{children:(0,y.jsx)("textarea",{style:{width:"210px",height:"150px"},value:M?M.replace(/&lt;/g,"<").replace(/&gt;/g,">"):"",onChange:function(e){T(e.target.value)}})})]}),(0,y.jsx)(u.Z,{className:"mb-4",children:(0,y.jsx)(m.Z,{children:(0,y.jsxs)("small",{children:[(0,y.jsx)("a",{href:"https://gitlab.lrz.de/haeberlin/dmlw/-/wikis/10-WikiHow:-Umlemmatisierung",target:"_blank",rel:"noreferrer",children:"Hier"})," finden Sie Informationen zum Bearbeiten der W\xf6rter."]})})}),(0,y.jsx)(u.Z,{children:(0,y.jsxs)(m.Z,{children:[(0,y.jsx)(o.YG,{value:"speichern",onClick:(0,r.Z)(l().mark((function t(){var n;return l().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(!(""===i||i.indexOf(" ")>-1||i.indexOf("*")>-1||i.indexOf("[")>-1)){t.next=4;break}return t.abrupt("return",{status:!1,error:"Bitte ein g\xfcltiges Wort eintragen!"});case 4:if(""!==g){t.next=8;break}return t.abrupt("return",{status:!1,error:"Bitte tragen Sie eine g\xfcltige Wort-Anzeige ein!"});case 8:return n={id:e.id,lemma:i,lemma_display:g,MLW:k,Fragezeichen:N,Stern:W,comment:M,dicts:Q,lemma_nr:_},t.next=11,d.Q.lemma.save(n);case 11:return t.sent,e.onUpdate(e.id),t.abrupt("return",{status:!0});case 14:case"end":return t.stop()}}),t)})))}),d.Q.access("l_edit")?(0,y.jsx)(o.YG,{style:{marginLeft:"10px"},variant:"danger",value:"l\xf6schen",onClick:(0,r.Z)(l().mark((function t(){var n,r,s,i,o;return l().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(!window.confirm("Soll das Wort gel\xf6scht werden? Das Wort wird von allen verkn\xfcpften Zettel entfernt. Dieser Schritt kann nicht r\xfcckg\xe4ngig gemacht werden!")){t.next=15;break}return t.next=3,d.Q.zettel.get({lemma_id:e.id});case 3:n=t.sent,r=[],s=(0,a.Z)(n);try{for(s.s();!(i=s.n()).done;)o=i.value,r.push({id:o.id,lemma_id:null})}catch(l){s.e(l)}finally{s.f()}if(!(r.length>0)){t.next=10;break}return t.next=10,d.Q.zettel.save(r);case 10:return t.next=12,d.Q.lemma.delete(e.id);case 12:return e.onClose(),e.onReload(),t.abrupt("return",{status:!0});case 15:case"end":return t.stop()}}),t)})))}):null]})})]})}function S(){return[["lemma","Wort"],["lemma_id","Wort-ID"],["type","Typ"],["id","ID"],["ac_web","Werk"],["date_type","Datum-Typ"],["date_own","eigenes Sortierdatum"],["date_own_display","eigenes Anzeigedatum"],["auto","Automatisierung"],["ocr_length","Textl\xe4nge"],["img_path","Bildpfad"]]}function z(e){var t=e.item,n={height:d.Q.options.z_height+"px",width:d.Q.options.z_width+"px"},a=null;if(null!=t.img_path){var r="";0===t.in_use?r+="zettel_img no_use":r+="zettel_img in_use",a=(0,y.jsxs)("div",{className:"zettel",id:t.id,style:n,children:[(0,y.jsx)("img",{alt:"",style:{objectFit:"fill",borderRadius:"7px"},className:r,src:"/mlw"+t.img_path+".jpg"}),e.showDetail?(0,y.jsx)("div",{className:"zettel_msg",dangerouslySetInnerHTML:(0,o.rg)(t.date_own_display?t.date_own_display:t.date_display)}):null,e.showDetail?(0,y.jsxs)("div",{className:"zettel_menu",children:[(0,y.jsx)("span",{style:{float:"left",overflow:"hidden",maxHeight:"50px",maxWidth:"250px"},dangerouslySetInnerHTML:(0,o.rg)(t.lemma_display)}),(0,y.jsx)("span",{style:{float:"right"},dangerouslySetInnerHTML:(0,o.rg)(t.opus)})]}):null]})}else a=(0,y.jsx)("div",{className:"zettel",id:t.id,style:n,children:(0,y.jsxs)("div",{className:"digitalZettel",children:[(0,y.jsx)("div",{className:"digitalZettelLemma",dangerouslySetInnerHTML:(0,o.rg)(t.lemma_display)}),(0,y.jsx)("div",{className:"digitalZettelDate",dangerouslySetInnerHTML:(0,o.rg)(t.date_display)}),(0,y.jsx)("div",{className:"digitalZettelWork",dangerouslySetInnerHTML:(0,o.rg)(t.opus)}),(0,y.jsx)("div",{className:"digitalZettelText",dangerouslySetInnerHTML:(0,o.rg)(t.txt)})]})});return a}function N(){return[[1,"Wort","lemma_id",!0],[2,"Werk","work_id",!0],[3,"Zettel-Typ","type",!1]]}function B(e){switch(e.batchType){case 1:return(0,y.jsx)(o.Qc,{onChange:function(t,n){e.setBatchValue(t),e.setBatchValueId(n)},value:e.batchValue,tbl:"lemma",searchCol:"lemma",returnCol:"lemma_ac"});case 2:return(0,y.jsx)(o.Qc,{value:e.batchValue,tbl:"work",searchCol:"ac_web",returnCol:"ac_web",onChange:function(t,n){e.setBatchValue(t),e.setBatchValueId(n)}});case 3:return(0,y.jsx)(o.SA,{style:{width:"86%"},options:[[0,"..."],[1,"verzettelt"],[2,"Exzerpt"],[3,"Index"],[4,"Literatur"],[6,"Index (unkl. Stelle)"],[7,"Notiz"]],onChange:function(t){e.setBatchValue(t.target.value)}});default:return(0,y.jsx)("div",{style:{color:"red"},children:"Unbekannter Stapel-Typ!"})}}function E(e){var t=(0,j.useState)(e.newLemma),n=(0,s.Z)(t,2),a=n[0],r=n[1],i=(0,j.useState)(e.newLemmaDisplay),l=(0,s.Z)(i,2),d=l[0],c=l[1],h=(0,j.useState)(0),x=(0,s.Z)(h,2),p=x[0],g=x[1],f=(0,j.useState)(0),b=(0,s.Z)(f,2),Z=b[0],_=b[1],v=(0,j.useState)(0),w=(0,s.Z)(v,2),F=w[0],k=w[1],C=(0,j.useState)(0),S=(0,s.Z)(C,2),z=S[0],N=(S[1],(0,j.useState)(!1)),B=(0,s.Z)(N,2),E=B[0],I=B[1],W=(0,j.useState)(!1),L=(0,s.Z)(W,2),A=L[0],D=L[1];return(0,j.useEffect)((function(){e.setLemmaObject({lemma:a,lemma_display:d,lemma_nr:p>0?p:null,MLW:Z,Fragezeichen:z,Stern:F}),""===a||a.indexOf(" ")>-1||a.indexOf("*")>-1||a.indexOf("[")>-1?I(!0):I(!1),D(""===d),""===a||a.indexOf(" ")>-1||a.indexOf("*")>-1||a.indexOf("[")>-1||""===d?e.setNewLemmaOK(!1):e.setNewLemmaOK(!0)}),[a,d,p,Z,F,z]),(0,y.jsxs)(y.Fragment,{children:[(0,y.jsx)(u.Z,{className:"mb-4",children:(0,y.jsxs)(m.Z,{children:[(0,y.jsx)("a",{href:"https://gitlab.lrz.de/haeberlin/dmlw/-/wikis/10-WikiHow:-Umlemmatisierung",target:"_blank",rel:"noreferrer",children:"Hier"})," finden Sie Informationen zum Erstellen neuer W\xf6rter."]})}),(0,y.jsxs)(u.Z,{className:"mb-2",children:[(0,y.jsx)(m.Z,{children:"Wort:"}),(0,y.jsx)(m.Z,{children:(0,y.jsx)("input",{type:"text",className:E?"invalidInput":null,value:a,onChange:function(e){r(e.target.value)}})})]}),(0,y.jsxs)(u.Z,{className:"mb-4",children:[(0,y.jsx)(m.Z,{children:"Wort-Anzeige:"}),(0,y.jsx)(m.Z,{children:(0,y.jsx)("input",{type:"text",className:A?"invalidInput":null,value:d,onChange:function(e){c(e.target.value)}})})]}),(0,y.jsxs)(u.Z,{className:"mb-2",children:[(0,y.jsx)(m.Z,{children:"Zahlzeichen:"}),(0,y.jsx)(m.Z,{children:(0,y.jsx)(o.SA,{options:[[0,""],[1,1],[2,2],[3,3],[4,4],[5,5],[6,6]],onChange:function(e){g(e.target.value)}})})]}),(0,y.jsxs)(u.Z,{className:"mb-2",children:[(0,y.jsx)(m.Z,{children:"im W\xf6rterbuch:"}),(0,y.jsx)(m.Z,{children:(0,y.jsx)(o.SA,{options:[[0,"Nein"],[1,"Ja"]],onChange:function(e){_(e.target.value)}})})]}),(0,y.jsxs)(u.Z,{className:"mb-2",children:[(0,y.jsx)(m.Z,{children:"Stern:"}),(0,y.jsx)(m.Z,{children:(0,y.jsx)(o.SA,{options:[[0,"Nein"],[1,"Ja"]],onChange:function(e){k(e.target.value)}})})]}),(0,y.jsxs)(u.Z,{className:"mb-4",children:[(0,y.jsx)(m.Z,{children:"Fragezeichen:"}),(0,y.jsx)(m.Z,{children:(0,y.jsx)(o.SA,{options:[[0,"Nein"],[1,"Ja"]],onChange:function(e){z(e.target.value)}})})]})]})}function I(e){var t=(0,j.useState)(e.item.type),n=(0,s.Z)(t,2),a=n[0],i=n[1],c=(0,j.useState)(e.item.lemma_ac),h=(0,s.Z)(c,2),x=h[0],p=h[1],g=(0,j.useState)(e.item.lemma_id),f=(0,s.Z)(g,2),b=f[0],Z=f[1],_=(0,j.useState)(e.item.ac_web),v=(0,s.Z)(_,2),w=v[0],F=v[1],k=(0,j.useState)(e.item.work_id),C=(0,s.Z)(k,2),S=C[0],z=C[1],N=(0,j.useState)(e.item.date_type),B=(0,s.Z)(N,2),E=B[0],I=B[1],W=(0,j.useState)(e.item.date_display),L=(0,s.Z)(W,2),A=L[0],D=L[1],M=(0,j.useState)(e.item.date_own),T=(0,s.Z)(M,2),H=T[0],O=T[1],Q=(0,j.useState)(e.item.date_own_display),J=(0,s.Z)(Q,2),V=J[0],K=J[1],R=(0,j.useState)(!1),P=(0,s.Z)(R,2),U=P[0],G=P[1],$=(0,j.useState)(!1),Y=(0,s.Z)($,2),X=Y[0],q=Y[1],ee=(0,j.useState)(e.item.txt),te=(0,s.Z)(ee,2),ne=te[0],ae=te[1];return(0,j.useEffect)((function(){i(e.item.type),p(e.item.lemma_ac),Z(e.item.lemma_id),F(e.item.ac_web),z(e.item.work_id),I(e.item.date_type),D(e.item.date_display),O(e.item.date_own),K(e.item.date_own_display),ae(e.item.txt)}),[e.item.id]),(0,j.useEffect)((function(){isNaN(H)||" "===H||""===H||null===H?G(!0):G(!1)}),[H]),(0,j.useEffect)((function(){q(" "===V||""===V||null===V)}),[V]),(0,j.useEffect)((function(){e.setZettelObject({id:e.item.id,type:a,lemma_id:b>0?b:null,work_id:S>0?S:null,date_type:E,date_own:9===E?H:null,date_own_display:9===E?V:null,txt:ne}),null===V||""===V||null!==H&&""!==H?S>0&&9===E&&(""!=H&&null!=H&&!Number.isInteger(H)||""===H||null===H)?e.setZettelObjectErr({status:1,msg:"Achtung: Dieser Zettel ben\xf6tigt eine Datierung! Soll er trotzdem ohne Datierung gespeichert werden?"}):9!==E||null===H||""===H||null!==V&&""!==V?e.setZettelObjectErr(null):e.setZettelObjectErr({status:2,msg:"Setzen Sie ein Anzeigedatum f\xfcr den Zettel!"}):e.setZettelObjectErr({status:2,msg:"Sie d\xfcrfen kein Anzeigedatum speichern, ohne ein Sortierdatum anzugeben!"})}),[ne,a,b,S,E,H,V]),(0,j.useEffect)((function(){e.setLemma(x)}),[x]),(0,y.jsxs)(y.Fragment,{children:[(0,y.jsxs)(u.Z,{className:"mb-2",children:[(0,y.jsx)(m.Z,{xs:4,children:"Zetteltyp:"}),(0,y.jsx)(m.Z,{children:(0,y.jsx)(o.SA,{style:{width:"100%"},value:a||0,options:[[0,"..."],[1,"verzettelt"],[2,"Exzerpt"],[3,"Index"],[4,"Literatur"],[6,"Index (unkl. Werk)"],[7,"Notiz"]],onChange:function(e){i(parseInt(e.target.value))},classList:"onOpenSetFocus"})})]}),(0,y.jsxs)(u.Z,{className:"mb-2",children:[(0,y.jsx)(m.Z,{xs:4,children:"Wort:"}),(0,y.jsx)(m.Z,{children:(0,y.jsx)(o.Qc,{style:{width:"100%"},onChange:function(e,t){p(e),Z(t)},value:x||"",tbl:"lemma",searchCol:"lemma",returnCol:"lemma_ac"})})]}),4!==a&&a<6&&(0,y.jsxs)(u.Z,{className:"mb-2",children:[(0,y.jsx)(m.Z,{xs:4,children:"Werk:"}),(0,y.jsx)(m.Z,{children:(0,y.jsx)(o.Qc,{style:{width:"100%"},value:w||"",tbl:"work",searchCol:"ac_web",returnCol:"ac_web",onChange:function(){var e=(0,r.Z)(l().mark((function e(t,n){var a;return l().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(F(t),z(n),!(n>0)){e.next=7;break}return e.next=5,d.Q.work.get({id:n},{select:["date_display","date_type"]});case 5:(a=e.sent).length>0&&(I(a[0].date_type),D(a[0].date_display));case 7:case"end":return e.stop()}}),e)})));return function(t,n){return e.apply(this,arguments)}}()})})]}),4!==a&&a<6&&S>0?(0,y.jsxs)(u.Z,{className:"mb-2",children:[(0,y.jsx)(m.Z,{xs:4,children:"Datierung:"}),(0,y.jsx)(m.Z,{children:(0,y.jsx)("span",{style:{width:"100%"},dangerouslySetInnerHTML:(0,o.rg)(A)})})]}):null,9===E?(0,y.jsxs)(y.Fragment,{children:[(0,y.jsx)(u.Z,{className:"mt-4 mb-2",children:(0,y.jsx)(m.Z,{children:(0,y.jsxs)("span",{className:"minorTxt",children:[(0,y.jsx)("b",{children:"Achtung:"})," Dieser Zettel ben\xf6tigt eine ",(0,y.jsx)("a",{href:"https://gitlab.lrz.de/haeberlin/dmlw/-/wikis/09-HiwiHow:-Zettel-verkn\xfcpfen#anzeigedatumsortierdatum",target:"_blank",rel:"noreferrer",children:"eigene Datierung"}),"."]})})}),(0,y.jsxs)(u.Z,{className:"mb-2",children:[(0,y.jsx)(m.Z,{xs:4,children:"Sortierdatum:"}),(0,y.jsx)(m.Z,{children:(0,y.jsx)("input",{className:U?"invalidInput":null,style:{width:"100%"},type:"text",value:H||"",onChange:function(e){O(""===e.target.value?null:e.target.value)}})})]}),(0,y.jsxs)(u.Z,{className:"mb-4",children:[(0,y.jsx)(m.Z,{xs:4,children:"Anzeigedatum:"}),(0,y.jsx)(m.Z,{children:(0,y.jsx)("input",{className:X?"invalidInput":null,style:{width:"100%"},type:"text",value:V||"",onChange:function(e){K(e.target.value)}})})]})]}):null,null===e.item.img_path&&(0,y.jsxs)(u.Z,{className:"mb-2",children:[(0,y.jsx)(m.Z,{xs:4,children:"Text:"}),(0,y.jsx)(m.Z,{children:(0,y.jsx)("textarea",{style:{width:"100%"},value:ne,onChange:function(e){ae(e.target.value)}})})]})]})}function W(){return{type:2,txt:"Neuer Zettel"}}function L(){return["img_path","date_display","ac_web","lemma_display","txt"]}function A(){return[['[{"id":2,"c":"lemma","o":"=","v":"NULL"}]',"Wortzuweisung"],['[{"id": 2,"c":"type","o":"=","v":"NULL"}]',"Typzuweisung"],['[{"id": 2, "c": "ac_web", "o": "=", "v": "NULL"},{"id": 3, "c": "type", "o": "!=", "v": 4},{"id": 4, "c": "type", "o": "!=", "v": 6},{"id": 5, "c": "type", "o": "!=", "v": 7}]',"Werkzuweisung"],['[{"id": 2, "c": "date_type", "o": "=", "v": 9},{"id": 3, "c": "date_own", "o": "!=", "v": "NULL"},{"id": 4, "c": "type", "o": "!=", "v": 3},{"id": 5, "c": "type", "o": "!=", "v": 6},{"id": 6, "c": "type", "o": "!=", "v": 7}]',"Datumszuweisung"]]}function D(){return[['["id"]',"ID"],['["lemma","lemma_nr","date_sort","date_type"]',"Datum"],['["ocr_length"]',"Textl\xe4nge"]]}function M(e){return(0,y.jsxs)(y.Fragment,{children:[(0,y.jsxs)(h.Z.Item,{onClick:function(t){e.loadMain(t,"maiora")},children:[(0,y.jsx)("i",{children:"opera maiora"}),"-Liste"]}),(0,y.jsxs)(h.Z.Item,{onClick:function(t){e.loadMain(t,"minora")},children:[(0,y.jsx)("i",{children:"opera minora"}),"-Liste"]}),(0,y.jsx)(h.Z.Item,{onClick:function(t){e.loadMain(t,"seklit")},children:"Sekund\xe4rliteratur"}),(0,y.jsx)(h.Z.Item,{onClick:function(t){e.loadMain(t,"ressources")},children:"Ressourcen"})]})}var T=function(){var e=(0,r.Z)(l().mark((function e(){var t;return l().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,d.Q.lemma.getAll({select:["id","lemma","lemma_display"],order:["lemma"]});case 2:return t=(t=e.sent).map((function(e){return{id:e.id,lemma_display:e.lemma_display,lemma:e.lemma.toLowerCase()}})),e.abrupt("return",t);case 5:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}();function H(e){var t=(0,j.useState)(""),n=(0,s.Z)(t,2),i=n[0],c=n[1],u=(0,j.useState)([]),m=(0,s.Z)(u,2),h=m[0],g=m[1];return(0,j.useEffect)((function(){var t=function(){var t=(0,r.Z)(l().mark((function t(){var n,r,s,i,o;return l().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(!(e.z.work_id>0)){t.next=8;break}return t.next=3,d.Q.edition.get({work_id:e.z.work_id},{select:["id","label","url"]});case 3:n=t.sent,r=[],s=(0,a.Z)(n);try{for(s.s();!(i=s.n()).done;)o=i.value,r.push((0,y.jsx)(x.Z.Item,{children:(0,y.jsx)("a",{href:""===o.url?"/site/argos/".concat(o.id):o.url,target:"_blank",rel:"noreferrer",children:o.label})},o.id))}catch(l){s.e(l)}finally{s.f()}g(r);case 8:case"end":return t.stop()}}),t)})));return function(){return t.apply(this,arguments)}}();t()}),[]),(0,y.jsxs)(p.Z,{style:{width:"30rem"},className:"mb-3",children:[(0,y.jsx)(b.G,{style:{position:"absolute",top:"12px",right:"10px"},onClick:function(){c(""===i?"v":"")},icon:Z.UO1}),(0,y.jsx)(p.Z.Header,{style:{height:"41px"},dangerouslySetInnerHTML:(0,o.rg)(e.z.opus)}),(0,y.jsx)(p.Z.Img,{variant:"bottom",src:"".concat(d.Q.url,"/mlw").concat(e.z.img_path).concat(i,".jpg")}),(0,y.jsx)(p.Z.Body,{children:(0,y.jsx)(p.Z.Text,{children:(0,y.jsx)(x.Z,{horizontal:!0,children:h})})})]})}function O(e){var t=(0,j.useState)(null),n=(0,s.Z)(t,2),a=n[0],i=n[1],h=(0,j.useState)(null),x=(0,s.Z)(h,2),p=x[0],b=x[1],Z=(0,j.useState)(null),v=(0,s.Z)(Z,2),w=v[0],F=v[1],k=(0,j.useState)(null),C=(0,s.Z)(k,2),S=C[0],z=C[1],N=(0,j.useState)(null),B=(0,s.Z)(N,2),E=B[0],I=B[1],W=(0,j.useState)([]),L=(0,s.Z)(W,2),A=L[0],D=L[1];return(0,j.useEffect)((function(){var t=function(){var t=(0,r.Z)(l().mark((function t(){var n,a,r,s;return l().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return i(null),b(null),F(null),z(null),I(null),t.next=7,d.Q.lemma.get({id:e.lemma_id});case 7:return n=t.sent,i(n[0]),t.next=11,d.Q.zettel.get({lemma_id:e.lemma_id,type:1},{order:["date_sort","date_type"],select:["id","opus","img_path","work_id","date_sort","date_own"]});case 11:return a=t.sent,b(a),t.next=15,d.Q.zettel.get({lemma_id:e.lemma_id,type:2},{order:["date_sort","date_type"],select:["id","opus","img_path","work_id","date_sort","date_own"]});case 15:return r=t.sent,F(r),t.next=19,d.Q.zettel.search([{c:"lemma_id",o:"=",v:e.lemma_id},{c:"type",o:">=",v:"3"},{c:"type",o:"<=",v:"6"},{c:"type",o:"!=",v:"4"}],{order:["date_sort","date_type"],select:["id","opus","img_path","work_id","date_sort","date_own"]});case 19:return s=t.sent,z(s),D(a.concat(r.concat(s))),t.t0=I,t.next=25,d.Q.zettel.search([{c:"lemma_id",o:"=",v:e.lemma_id},{c:"type",o:">=",v:"4"},{c:"type",o:"!=",v:"6"}],{order:["date_sort","date_type"],select:["id","opus","img_path","work_id"]});case 25:t.t1=t.sent,(0,t.t0)(t.t1);case 27:case"end":return t.stop()}}),t)})));return function(){return t.apply(this,arguments)}}();t()}),[e.lemma_id]),a?(0,y.jsxs)(y.Fragment,{children:[(0,y.jsx)("h1",{dangerouslySetInnerHTML:(0,o.rg)(a.lemma_display)}),(0,y.jsxs)(c.Z,{children:[a.dicts&&(0,y.jsxs)(u.Z,{children:[(0,y.jsx)(m.Z,{xs:2,children:"W\xf6rterb\xfccher:"}),(0,y.jsx)(m.Z,{dangerouslySetInnerHTML:(0,o.rg)(a.dicts)})]}),a.comment&&(0,y.jsxs)(u.Z,{className:"mb-4",children:[(0,y.jsx)(m.Z,{xs:2,children:"Kommentar:"}),(0,y.jsx)(m.Z,{dangerouslySetInnerHTML:(0,o.rg)(a.comment)})]}),(0,y.jsx)(u.Z,{children:(0,y.jsx)(m.Z,{children:(0,y.jsxs)(g.Z,{defaultActiveKey:"",children:[(0,y.jsxs)(g.Z.Item,{eventKey:"s",children:[(0,y.jsx)(g.Z.Header,{children:"Statistik"}),(0,y.jsx)(g.Z.Body,{children:(0,y.jsx)("div",{style:{width:"70%",margin:"auto"},children:(0,y.jsx)(_.$Q,{options:{aspectRatio:!1,plugins:{legend:{display:!0,position:"bottom"}}},data:{labels:["6. Jh.","7. Jh.","8. Jh.","9. Jh.","10. Jh.","11. Jh.","12. Jh.","13. Jh."],datasets:[{label:"Anzahl Zettel",data:[A.filter((function(e){return e.date_sort<600})).length,A.filter((function(e){return e.date_sort>599&&e.date_sort<700})).length,A.filter((function(e){return e.date_sort>699&&e.date_sort<800})).length,A.filter((function(e){return e.date_sort>799&&e.date_sort<900})).length,A.filter((function(e){return e.date_sort>899&&e.date_sort<1e3})).length,A.filter((function(e){return e.date_sort>999&&e.date_sort<1100})).length,A.filter((function(e){return e.date_sort>1099&&e.date_sort<1200})).length,A.filter((function(e){return e.date_sort>1199})).length],backgroundColor:["#347F9F"],borderColor:["#347F9F"],borderWidth:1}]}})})})]}),(0,y.jsxs)(g.Z.Item,{eventKey:"v",children:[(0,y.jsxs)(g.Z.Header,{children:["verzetteltes Material\xa0",p?(0,y.jsxs)("span",{children:["(",p.length,")"]}):(0,y.jsx)(f.Z,{size:"sm",animation:"border"})]}),(0,y.jsx)(g.Z.Body,{children:(0,y.jsx)(c.Z,{className:"d-flex flex-wrap justify-content-center",children:p?p.map((function(e){return(0,y.jsx)(H,{z:e},e.id)})):null})})]}),(0,y.jsxs)(g.Z.Item,{eventKey:"e",children:[(0,y.jsxs)(g.Z.Header,{children:["Exzerpt-Zettel\xa0",w?(0,y.jsxs)("span",{children:["(",w.length,")"]}):(0,y.jsx)(f.Z,{size:"sm",animation:"border"})]}),(0,y.jsx)(g.Z.Body,{children:(0,y.jsx)(c.Z,{className:"d-flex flex-wrap justify-content-center",children:w?w.map((function(e){return(0,y.jsx)(H,{z:e},e.id)})):null})})]}),(0,y.jsxs)(g.Z.Item,{eventKey:"i",children:[(0,y.jsxs)(g.Z.Header,{children:["Index-Zettel\xa0",S?(0,y.jsxs)("span",{children:["(",S.length,")"]}):(0,y.jsx)(f.Z,{size:"sm",animation:"border"})]}),(0,y.jsx)(g.Z.Body,{children:(0,y.jsx)(c.Z,{className:"d-flex flex-wrap justify-content-center",children:S?S.map((function(e){return(0,y.jsx)(H,{z:e},e.id)})):null})})]}),(0,y.jsxs)(g.Z.Item,{eventKey:"r",children:[(0,y.jsxs)(g.Z.Header,{children:["restliche Zettel\xa0",E?(0,y.jsxs)("span",{children:["(",E.length,")"]}):(0,y.jsx)(f.Z,{size:"sm",animation:"border"})]}),(0,y.jsx)(g.Z.Body,{children:(0,y.jsx)(c.Z,{className:"d-flex flex-wrap justify-content-center",children:E?E.map((function(e){return(0,y.jsx)(H,{z:e},e.id)})):null})})]})]})})})]})]}):null}function Q(e){var t=null;switch(e.name){case"zettel_process":t=(0,y.jsxs)("div",{style:{margin:"auto",marginBottom:"80px",width:"450px",height:"450px"},children:[(0,y.jsx)("h4",{children:"nach Bearbeitungsstand"}),(0,y.jsx)(_.by,{options:{plugins:{legend:{position:"bottom"}}},data:{labels:["abgeschlossen","nur Lemma","unbearbeitet"],datasets:[{label:"# of Votes",data:e.data,backgroundColor:["#114B79","#347F9F","#EAF2F3"],borderColor:["#1B3B6F","#065A82","#E8F1F2"],borderWidth:1}]}})]});break;case"zettel_type":t=(0,y.jsxs)("div",{style:{margin:"auto",marginBottom:"80px",width:"450px",height:"450px"},children:[(0,y.jsx)("h4",{children:"nach Typen"}),(0,y.jsx)(_.by,{options:{plugins:{legend:{position:"bottom"}}},data:{labels:["verzetteltes Material","Exzerpt","Index","Literatur","Index (unkl. Werk)","Notiz","kein Typ"],datasets:[{label:"# of Votes",data:e.data,backgroundColor:["#114B79","#347F9F","#8FC9D9","#D2EFF4","#EAF2F3","#EFEFEF","#FFFFFF"],borderColor:["#1B3B6F","#065A82","#61A4BC","#BCEDF6","#E8F1F2","#EEEEEE","#EFEFEF"],borderWidth:1}]}})]});break;case"zettel_created_changed":t=(0,y.jsxs)("div",{style:{marginBottom:"80px",width:"100%",height:"400px"},children:[(0,y.jsx)("h4",{children:"nach Jahren"}),(0,y.jsx)(_.$Q,{options:{aspectRatio:!1,plugins:{legend:{display:!0,position:"bottom"}}},data:{labels:["2020","2021","2022"],datasets:[{label:"ver\xe4ndert",data:e.data[1],backgroundColor:["#114B79"],borderColor:["#114B79"],borderWidth:1,type:"line"},{label:"erstellt",data:e.data[0],backgroundColor:["#347F9F"],borderColor:["#347F9F"],borderWidth:1}]}})]});break;case"zettel_created_changed_current":t=(0,y.jsxs)("div",{style:{marginBottom:"80px",width:"100%",height:"400px"},children:[(0,y.jsx)("h4",{children:"in diesem Jahr"}),(0,y.jsx)(_.$Q,{options:{aspectRatio:!1,plugins:{legend:{display:!0,position:"bottom"}}},data:{labels:["Jan.","Feb.","M\xe4r.","Apr.","Mai","Jun.","Jul.","Aug.","Sep.","Okt.","Nov.","Dez."].slice(0,(new Date).getMonth()+1),datasets:[{label:"ver\xe4ndert",data:e.data[1],backgroundColor:["#114B79"],borderColor:["#114B79"],borderWidth:1,type:"line"},{label:"erstellt",data:e.data[0],backgroundColor:["#347F9F"],borderColor:["#347F9F"],borderWidth:1}]}})]});break;case"zettel_letter":t=(0,y.jsxs)("div",{style:{marginBottom:"80px",width:"100%",height:"400px"},children:[(0,y.jsx)("h4",{children:"nach Buchstaben"}),(0,y.jsx)(_.$Q,{options:{aspectRatio:!1,plugins:{legend:{display:!0,position:"bottom"}},scales:{x:{stacked:!0},y:{stacked:!0}}},data:{labels:["A","B","C","D","E","F","G","H","I","K","L","M","N","O","P","Q","R","S","T","U","W","X","Y","Z"],datasets:[{label:"Anzahl verzetteltes Material",data:e.data[0],backgroundColor:["#347F9F"],borderColor:["#347F9F"],borderWidth:1},{label:"Anzahl Exzerpt-Zettel",data:e.data[1],backgroundColor:["#8FC9D9"],borderColor:["#8FC9D9"],borderWidth:1},{label:"Anzahl Index-Zettel",data:e.data[2],backgroundColor:["#D2EFF4"],borderColor:["#D2EFF4"],borderWidth:1},{label:"Anzahl restlicher Zettel",data:e.data[3],backgroundColor:["#EAF2F3"],borderColor:["#EAF2F3"],borderWidth:1}]}})]});break;case"lemma_letter":t=(0,y.jsxs)("div",{style:{marginBottom:"80px",margin:"auto",width:"70%",height:"600px"},children:[(0,y.jsx)("h4",{children:"nach Buchstaben"}),(0,y.jsx)(_.$Q,{options:{plugins:{legend:{display:!1,position:"bottom"}}},data:{labels:["A","B","C","D","E","F","G","H","I","K","L","M","N","O","P","Q","R","S","T","U","V","X","Y","Z"],datasets:[{label:"",data:e.data,backgroundColor:["#114B79","#347F9F","#8FC9D9","#D2EFF4","#EAF2F3"],borderColor:["#1B3B6F","#065A82","#61A4BC","#BCEDF6","#E8F1F2"],borderWidth:1}]}})]});break;case"lemma_mlw":t=(0,y.jsxs)("div",{style:{margin:"auto",marginBottom:"80px",width:"450px",height:"450px"},children:[(0,y.jsx)("h4",{children:"nach Relevanz f\xfcrs W\xf6rterbuch"}),(0,y.jsx)(_.by,{options:{plugins:{legend:{display:!0,position:"bottom"}}},data:{labels:["relevant","nicht relevant"],datasets:[{label:"",data:e.data,backgroundColor:["#114B79","#EAF2F3"],borderColor:["#1B3B6F","#E8F1F2"],borderWidth:1}]}})]});break;case"ressource_work":t=(0,y.jsxs)("div",{style:{margin:"auto",marginBottom:"80px",width:"450px",height:"450px"},children:[(0,y.jsx)("h4",{children:"Werke nach Volltext und pdfs"}),(0,y.jsx)(_.by,{options:{plugins:{legend:{position:"bottom"}}},data:{labels:["mit Volltext und pdf","nur mit pdf","ohne pdf und Volltext","nicht in Benutzung"],datasets:[{label:"",data:e.data,backgroundColor:["#114B79","#347F9F","#EAF2F3","#FFFFFF"],borderColor:["#1B3B6F","#065A82","#E8F1F2","#EFEFEF"],borderWidth:1}]}})]});break;case"ressource_scans":t=(0,y.jsxs)("div",{style:{margin:"auto",marginBottom:"80px",width:"450px",height:"450px"},children:[(0,y.jsx)("h4",{children:"Scan-Seiten und Volltexte"}),(0,y.jsx)(_.by,{options:{plugins:{legend:{position:"bottom"}}},data:{labels:["gepr\xfcfter Volltext","automatischer Volltext","ohne Volltext","kein lat. Text"],datasets:[{label:"",data:e.data,backgroundColor:["#114B79","#347F9F","#EAF2F3","#FFFFFF"],borderColor:["#1B3B6F","#065A82","#E8F1F2","#EFEFEF"],borderWidth:1}]}})]});break;default:console.log(e.name)}return t}},9140:function(e,t,n){n.d(t,{Z:function(){return N}});var a=n(1413),r=n(5987),s=n(1694),i=n.n(s),l=n(2791),o=n(162),d=n(6543),c=n(7472),u=n(184),m=["bsPrefix","className","variant","as"],h=l.forwardRef((function(e,t){var n=e.bsPrefix,s=e.className,l=e.variant,d=e.as,c=void 0===d?"img":d,h=(0,r.Z)(e,m),x=(0,o.vE)(n,"card-img");return(0,u.jsx)(c,(0,a.Z)({ref:t,className:i()(l?"".concat(x,"-").concat(l):x,s)},h))}));h.displayName="CardImg";var x=h,p=n(6040),g=["bsPrefix","className","as"],f=l.forwardRef((function(e,t){var n=e.bsPrefix,s=e.className,d=e.as,c=void 0===d?"div":d,m=(0,r.Z)(e,g),h=(0,o.vE)(n,"card-header"),x=(0,l.useMemo)((function(){return{cardHeaderBsPrefix:h}}),[h]);return(0,u.jsx)(p.Z.Provider,{value:x,children:(0,u.jsx)(c,(0,a.Z)((0,a.Z)({ref:t},m),{},{className:i()(s,h)}))})}));f.displayName="CardHeader";var j=f,b=["bsPrefix","className","bg","text","border","body","children","as"],Z=(0,c.Z)("h5"),_=(0,c.Z)("h6"),y=(0,d.Z)("card-body"),v=(0,d.Z)("card-title",{Component:Z}),w=(0,d.Z)("card-subtitle",{Component:_}),F=(0,d.Z)("card-link",{Component:"a"}),k=(0,d.Z)("card-text",{Component:"p"}),C=(0,d.Z)("card-footer"),S=(0,d.Z)("card-img-overlay"),z=l.forwardRef((function(e,t){var n=e.bsPrefix,s=e.className,l=e.bg,d=e.text,c=e.border,m=e.body,h=e.children,x=e.as,p=void 0===x?"div":x,g=(0,r.Z)(e,b),f=(0,o.vE)(n,"card");return(0,u.jsx)(p,(0,a.Z)((0,a.Z)({ref:t},g),{},{className:i()(s,f,l&&"bg-".concat(l),d&&"text-".concat(d),c&&"border-".concat(c)),children:m?(0,u.jsx)(y,{children:h}):h}))}));z.displayName="Card",z.defaultProps={body:!1};var N=Object.assign(z,{Img:x,Title:v,Subtitle:w,Body:y,Link:F,Text:k,Header:j,Footer:C,ImgOverlay:S})},6040:function(e,t,n){var a=n(2791).createContext(null);a.displayName="CardHeaderContext",t.Z=a}}]);
//# sourceMappingURL=906.8d2cfe8e.chunk.js.map