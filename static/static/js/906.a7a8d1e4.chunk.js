"use strict";(self.webpackChunkatlas=self.webpackChunkatlas||[]).push([[906],{5906:function(e,t,n){n.r(t),n.d(t,{BatchInputType:function(){return N},GeschichtsquellenImport:function(){return O},GeschichtsquellenInterfaceAutoren:function(){return V},GeschichtsquellenInterfaceWerke:function(){return J},IndexBoxDetail:function(){return T},LemmaAsideContent:function(){return S},LemmaHeader:function(){return w},LemmaRow:function(){return k},MainMenuContent:function(){return q},StatisticsChart:function(){return Q},ZettelAddLemmaContent:function(){return E},ZettelCard:function(){return z},ZettelSingleContent:function(){return B},arachneTbls:function(){return v},exportZettelObject:function(){return A},fetchIndexBoxData:function(){return M},lemmaSearchItems:function(){return F},newZettelObject:function(){return W},zettelBatchOptions:function(){return I},zettelPresetOptions:function(){return L},zettelSearchItems:function(){return C},zettelSortOptions:function(){return D}});var r=n(7762),a=n(5861),s=n(885),l=n(7757),i=n.n(l),d=n(3222),o=n(6407),c=n(7022),u=n(9743),h=n(2677),m=n(2354),x=n(1398),g=n(9140),p=n(8949),j=n(4849),f=n(2791),b=n(4483),_=n(3174),Z=(n(6546),n(9683)),y=n(184);function v(){return["project","author","edition","lemma","opera_maiora","opera_minora","scan","scan_lnk","work","zettel","user","seklit","article","zettel_lnk","statistics","scan_paths","ocr_jobs","comment","scan_opera","fulltext_search_view","tags","tag_lnks","sections","gq_werke","gq_autoren"]}function w(){return(0,y.jsxs)("tr",{children:[(0,y.jsx)("th",{width:"30%",children:"Wortansatz"}),(0,y.jsx)("th",{width:"20%",children:"W\xf6rterb\xfccher"}),(0,y.jsx)("th",{children:"Kommentar"})]})}function k(e){return(0,y.jsxs)("tr",{id:e.lemma.id,onDoubleClick:function(t){e.showDetail(parseInt(t.target.closest("tr").id))},children:[(0,y.jsx)("td",{title:"ID: "+e.lemma.id,children:(0,y.jsx)("a",{dangerouslySetInnerHTML:(0,d.rg)(e.lemma.lemma_display),onClick:function(t){localStorage.setItem("mlw_searchBox_zettel",'[[{"id":0,"c":"lemma_id","o":"=","v":'.concat(e.lemma.id,'}],1,["id"]]')),e.loadMain(t)}})}),(0,y.jsx)("td",{dangerouslySetInnerHTML:(0,d.rg)(e.lemma.dicts)}),(0,y.jsx)("td",{dangerouslySetInnerHTML:(0,d.rg)(e.lemma.comment)})]})}function F(){return[["lemma","Wort"],["lemma_ac","Wort-Anzeige"],["id","ID"],["dicts","W\xf6rterb\xfccher"],["comment","Kommentar"],["lemma_nr","Zahlzeichen"],["MLW","MLW"],["Stern","Stern"],["Fragezeichen","Fragezeichen"]]}function S(e){var t=(0,f.useState)(e.item.lemma),n=(0,s.Z)(t,2),l=n[0],m=n[1],x=(0,f.useState)(e.item.lemma_display),g=(0,s.Z)(x,2),p=g[0],j=g[1],b=(0,f.useState)(e.item.lemma_nr),_=(0,s.Z)(b,2),Z=_[0],v=_[1],w=(0,f.useState)(e.item.MLW),k=(0,s.Z)(w,2),F=k[0],S=k[1],C=(0,f.useState)(e.item.Fragezeichen),z=(0,s.Z)(C,2),I=z[0],N=z[1],E=(0,f.useState)(e.item.Stern),B=(0,s.Z)(E,2),W=B[0],A=B[1],L=(0,f.useState)(e.item.comment),D=(0,s.Z)(L,2),q=D[0],M=D[1],H=(0,f.useState)(e.item.dicts),T=(0,s.Z)(H,2),Q=T[0],O=T[1];return(0,f.useEffect)((function(){m(e.item.lemma),j(e.item.lemma_display),v(e.item.lemma_nr),S(e.item.MLW),N(e.item.Fragezeichen),A(e.item.Stern),M(e.item.comment),O(e.item.dicts)}),[e.id]),(0,y.jsxs)(c.Z,{children:[(0,y.jsxs)(u.Z,{className:"mb-2",children:[(0,y.jsx)(h.Z,{children:"Wort:"}),(0,y.jsx)(h.Z,{children:(0,y.jsx)("input",{type:"text",value:l,onChange:function(e){m(e.target.value)}})})]}),(0,y.jsxs)(u.Z,{className:"mb-5",children:[(0,y.jsx)(h.Z,{children:"Wort-Anzeige:"}),(0,y.jsx)(h.Z,{children:(0,y.jsx)("input",{type:"text",value:(0,d.Nx)(p),onChange:function(e){j(e.target.value)}})})]}),(0,y.jsxs)(u.Z,{className:"mb-2",children:[(0,y.jsx)(h.Z,{children:"Zahlzeichen:"}),(0,y.jsx)(h.Z,{children:(0,y.jsx)(d.SA,{options:[[0,""],[1,1],[2,2],[3,3],[4,4],[5,5],[6,6]],onChange:function(e){v(e.target.value)},value:Z})})]}),(0,y.jsxs)(u.Z,{className:"mb-2",children:[(0,y.jsx)(h.Z,{children:"im W\xf6rterbuch:"}),(0,y.jsx)(h.Z,{children:(0,y.jsx)(d.SA,{options:[[0,"Nein"],[1,"Ja"]],onChange:function(e){S(e.target.value)},value:F})})]}),(0,y.jsxs)(u.Z,{className:"mb-2",children:[(0,y.jsx)(h.Z,{children:"Stern:"}),(0,y.jsx)(h.Z,{children:(0,y.jsx)(d.SA,{options:[[0,"Nein"],[1,"Ja"]],onChange:function(e){A(e.target.value)},value:W})})]}),(0,y.jsxs)(u.Z,{className:"mb-5",children:[(0,y.jsx)(h.Z,{children:"Fragezeichen:"}),(0,y.jsx)(h.Z,{children:(0,y.jsx)(d.SA,{options:[[0,"Nein"],[1,"Ja"]],onChange:function(e){N(e.target.value)},value:I})})]}),(0,y.jsxs)(u.Z,{className:"mb-2",children:[(0,y.jsx)(h.Z,{children:"W\xf6rterb\xfccher:"}),(0,y.jsx)(h.Z,{children:(0,y.jsx)("textarea",{style:{width:"210px",height:"50px"},value:Q?Q.replace(/&lt;/g,"<").replace(/&gt;/g,">"):"",onChange:function(e){O(e.target.value)}})})]}),(0,y.jsxs)(u.Z,{className:"mb-4",children:[(0,y.jsx)(h.Z,{children:"Kommentar:"}),(0,y.jsx)(h.Z,{children:(0,y.jsx)("textarea",{style:{width:"210px",height:"150px"},value:q?q.replace(/&lt;/g,"<").replace(/&gt;/g,">"):"",onChange:function(e){M(e.target.value)}})})]}),(0,y.jsx)(u.Z,{className:"mb-4",children:(0,y.jsx)(h.Z,{children:(0,y.jsxs)("small",{children:[(0,y.jsx)("a",{href:"https://gitlab.lrz.de/haeberlin/dmlw/-/wikis/10-WikiHow:-Umlemmatisierung",target:"_blank",rel:"noreferrer",children:"Hier"})," finden Sie Informationen zum Bearbeiten der W\xf6rter."]})})}),(0,y.jsx)(u.Z,{children:(0,y.jsxs)(h.Z,{children:[(0,y.jsx)(d.YG,{value:"speichern",onClick:(0,a.Z)(i().mark((function t(){var n;return i().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(!(""===l||l.indexOf(" ")>-1||l.indexOf("*")>-1||l.indexOf("[")>-1)){t.next=4;break}return t.abrupt("return",{status:!1,error:"Bitte ein g\xfcltiges Wort eintragen!"});case 4:if(""!==p){t.next=8;break}return t.abrupt("return",{status:!1,error:"Bitte tragen Sie eine g\xfcltige Wort-Anzeige ein!"});case 8:return n={id:e.id,lemma:l,lemma_display:p,MLW:F,Fragezeichen:I,Stern:W,comment:q,dicts:Q,lemma_nr:Z},t.next=11,o.Q.lemma.save(n);case 11:return t.sent,e.onUpdate(e.id),t.abrupt("return",{status:!0});case 14:case"end":return t.stop()}}),t)})))}),o.Q.access("l_edit")?(0,y.jsx)(d.YG,{style:{marginLeft:"10px"},variant:"danger",value:"l\xf6schen",onClick:(0,a.Z)(i().mark((function t(){var n,a,s,l,d;return i().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(!window.confirm("Soll das Wort gel\xf6scht werden? Das Wort wird von allen verkn\xfcpften Zettel entfernt. Dieser Schritt kann nicht r\xfcckg\xe4ngig gemacht werden!")){t.next=15;break}return t.next=3,o.Q.zettel.get({lemma_id:e.id});case 3:n=t.sent,a=[],s=(0,r.Z)(n);try{for(s.s();!(l=s.n()).done;)d=l.value,a.push({id:d.id,lemma_id:null})}catch(i){s.e(i)}finally{s.f()}if(!(a.length>0)){t.next=10;break}return t.next=10,o.Q.zettel.save(a);case 10:return t.next=12,o.Q.lemma.delete(e.id);case 12:return e.onClose(),e.onReload(),t.abrupt("return",{status:!0});case 15:case"end":return t.stop()}}),t)})))}):null]})})]})}function C(){return[["lemma","Wort"],["lemma_id","Wort-ID"],["type","Typ"],["id","ID"],["ac_web","Werk"],["date_type","Datum-Typ"],["date_own","eigenes Sortierdatum"],["date_own_display","eigenes Anzeigedatum"],["auto","Automatisierung"],["ocr_length","Textl\xe4nge"],["img_path","Bildpfad"]]}function z(e){var t=e.item,n={height:o.Q.options.z_height+"px",width:o.Q.options.z_width+"px"},r=null;if(null!=t.img_path){var a="";0===t.in_use?a+="zettel_img no_use":a+="zettel_img in_use",r=(0,y.jsxs)("div",{className:"zettel",id:t.id,style:n,children:[(0,y.jsx)("img",{alt:"",style:{objectFit:"fill",borderRadius:"7px"},className:a,src:"/mlw"+t.img_path+".jpg"}),e.showDetail?(0,y.jsx)("div",{className:"zettel_msg",dangerouslySetInnerHTML:(0,d.rg)(t.date_own_display?t.date_own_display:t.date_display)}):null,e.showDetail?(0,y.jsxs)("div",{className:"zettel_menu",children:[(0,y.jsx)("span",{style:{float:"left",overflow:"hidden",maxHeight:"50px",maxWidth:"250px"},dangerouslySetInnerHTML:(0,d.rg)(t.lemma_display)}),(0,y.jsx)("span",{style:{float:"right"},dangerouslySetInnerHTML:(0,d.rg)(t.opus)})]}):null]})}else r=(0,y.jsx)("div",{className:"zettel",id:t.id,style:n,children:(0,y.jsxs)("div",{className:"digitalZettel",children:[(0,y.jsx)("div",{className:"digitalZettelLemma",dangerouslySetInnerHTML:(0,d.rg)(t.lemma_display)}),(0,y.jsx)("div",{className:"digitalZettelDate",dangerouslySetInnerHTML:(0,d.rg)(t.date_display)}),(0,y.jsx)("div",{className:"digitalZettelWork",dangerouslySetInnerHTML:(0,d.rg)(t.opus)}),(0,y.jsx)("div",{className:"digitalZettelText",dangerouslySetInnerHTML:(0,d.rg)(t.txt)})]})});return r}function I(){return[[1,"Wort","lemma_id",!0],[2,"Werk","work_id",!0],[3,"Zettel-Typ","type",!1]]}function N(e){switch(e.batchType){case 1:return(0,y.jsx)(d.Qc,{onChange:function(t,n){e.setBatchValue(t),e.setBatchValueId(n)},value:e.batchValue,tbl:"lemma",searchCol:"lemma",returnCol:"lemma_ac"});case 2:return(0,y.jsx)(d.Qc,{value:e.batchValue,tbl:"work",searchCol:"ac_web",returnCol:"ac_web",onChange:function(t,n){e.setBatchValue(t),e.setBatchValueId(n)}});case 3:return(0,y.jsx)(d.SA,{style:{width:"86%"},options:[[0,"..."],[1,"verzettelt"],[2,"Exzerpt"],[3,"Index"],[4,"Literatur"],[6,"Index (unkl. Stelle)"],[7,"Notiz"]],onChange:function(t){e.setBatchValue(t.target.value)}});default:return(0,y.jsx)("div",{style:{color:"red"},children:"Unbekannter Stapel-Typ!"})}}function E(e){var t=(0,f.useState)(e.newLemma),n=(0,s.Z)(t,2),r=n[0],a=n[1],l=(0,f.useState)(e.newLemmaDisplay),i=(0,s.Z)(l,2),o=i[0],c=i[1],m=(0,f.useState)(0),x=(0,s.Z)(m,2),g=x[0],p=x[1],j=(0,f.useState)(0),b=(0,s.Z)(j,2),_=b[0],Z=b[1],v=(0,f.useState)(0),w=(0,s.Z)(v,2),k=w[0],F=w[1],S=(0,f.useState)(0),C=(0,s.Z)(S,2),z=C[0],I=(C[1],(0,f.useState)(!1)),N=(0,s.Z)(I,2),E=N[0],B=N[1],W=(0,f.useState)(!1),A=(0,s.Z)(W,2),L=A[0],D=A[1];return(0,f.useEffect)((function(){e.setLemmaObject({lemma:r,lemma_display:o,lemma_nr:g>0?g:null,MLW:_,Fragezeichen:z,Stern:k}),""===r||r.indexOf(" ")>-1||r.indexOf("*")>-1||r.indexOf("[")>-1?B(!0):B(!1),D(""===o),""===r||r.indexOf(" ")>-1||r.indexOf("*")>-1||r.indexOf("[")>-1||""===o?e.setNewLemmaOK(!1):e.setNewLemmaOK(!0)}),[r,o,g,_,k,z]),(0,y.jsxs)(y.Fragment,{children:[(0,y.jsx)(u.Z,{className:"mb-4",children:(0,y.jsxs)(h.Z,{children:[(0,y.jsx)("a",{href:"https://gitlab.lrz.de/haeberlin/dmlw/-/wikis/10-WikiHow:-Umlemmatisierung",target:"_blank",rel:"noreferrer",children:"Hier"})," finden Sie Informationen zum Erstellen neuer W\xf6rter."]})}),(0,y.jsxs)(u.Z,{className:"mb-2",children:[(0,y.jsx)(h.Z,{children:"Wort:"}),(0,y.jsx)(h.Z,{children:(0,y.jsx)("input",{type:"text",className:E?"invalidInput":null,value:r,onChange:function(e){a(e.target.value)}})})]}),(0,y.jsxs)(u.Z,{className:"mb-4",children:[(0,y.jsx)(h.Z,{children:"Wort-Anzeige:"}),(0,y.jsx)(h.Z,{children:(0,y.jsx)("input",{type:"text",className:L?"invalidInput":null,value:o,onChange:function(e){c(e.target.value)}})})]}),(0,y.jsxs)(u.Z,{className:"mb-2",children:[(0,y.jsx)(h.Z,{children:"Zahlzeichen:"}),(0,y.jsx)(h.Z,{children:(0,y.jsx)(d.SA,{options:[[0,""],[1,1],[2,2],[3,3],[4,4],[5,5],[6,6]],onChange:function(e){p(e.target.value)}})})]}),(0,y.jsxs)(u.Z,{className:"mb-2",children:[(0,y.jsx)(h.Z,{children:"im W\xf6rterbuch:"}),(0,y.jsx)(h.Z,{children:(0,y.jsx)(d.SA,{options:[[0,"Nein"],[1,"Ja"]],onChange:function(e){Z(e.target.value)}})})]}),(0,y.jsxs)(u.Z,{className:"mb-2",children:[(0,y.jsx)(h.Z,{children:"Stern:"}),(0,y.jsx)(h.Z,{children:(0,y.jsx)(d.SA,{options:[[0,"Nein"],[1,"Ja"]],onChange:function(e){F(e.target.value)}})})]}),(0,y.jsxs)(u.Z,{className:"mb-4",children:[(0,y.jsx)(h.Z,{children:"Fragezeichen:"}),(0,y.jsx)(h.Z,{children:(0,y.jsx)(d.SA,{options:[[0,"Nein"],[1,"Ja"]],onChange:function(e){z(e.target.value)}})})]})]})}function B(e){var t=(0,f.useState)(e.item.type),n=(0,s.Z)(t,2),r=n[0],l=n[1],c=(0,f.useState)(e.item.lemma_ac),m=(0,s.Z)(c,2),x=m[0],g=m[1],p=(0,f.useState)(e.item.lemma_id),j=(0,s.Z)(p,2),b=j[0],_=j[1],Z=(0,f.useState)(e.item.ac_web),v=(0,s.Z)(Z,2),w=v[0],k=v[1],F=(0,f.useState)(e.item.work_id),S=(0,s.Z)(F,2),C=S[0],z=S[1],I=(0,f.useState)(e.item.date_type),N=(0,s.Z)(I,2),E=N[0],B=N[1],W=(0,f.useState)(e.item.date_display),A=(0,s.Z)(W,2),L=A[0],D=A[1],q=(0,f.useState)(e.item.date_own),M=(0,s.Z)(q,2),H=M[0],T=M[1],Q=(0,f.useState)(e.item.date_own_display),O=(0,s.Z)(Q,2),J=O[0],V=O[1],G=(0,f.useState)(!1),K=(0,s.Z)(G,2),R=K[0],U=K[1],Y=(0,f.useState)(!1),$=(0,s.Z)(Y,2),P=$[0],X=$[1],ee=(0,f.useState)(e.item.txt),te=(0,s.Z)(ee,2),ne=te[0],re=te[1];return(0,f.useEffect)((function(){l(e.item.type),g(e.item.lemma_ac),_(e.item.lemma_id),k(e.item.ac_web),z(e.item.work_id),B(e.item.date_type),D(e.item.date_display),T(e.item.date_own),V(e.item.date_own_display),re(e.item.txt)}),[e.item.id]),(0,f.useEffect)((function(){isNaN(H)||" "===H||""===H||null===H?U(!0):U(!1)}),[H]),(0,f.useEffect)((function(){X(" "===J||""===J||null===J)}),[J]),(0,f.useEffect)((function(){e.setZettelObject({id:e.item.id,type:r,lemma_id:b>0?b:null,work_id:C>0?C:null,date_type:E,date_own:9===E?H:null,date_own_display:9===E?J:null,txt:ne}),null===J||""===J||null!==H&&""!==H?C>0&&9===E&&(""!=H&&null!=H&&!Number.isInteger(H)||""===H||null===H)?e.setZettelObjectErr({status:1,msg:"Achtung: Dieser Zettel ben\xf6tigt eine Datierung! Soll er trotzdem ohne Datierung gespeichert werden?"}):9!==E||null===H||""===H||null!==J&&""!==J?e.setZettelObjectErr(null):e.setZettelObjectErr({status:2,msg:"Setzen Sie ein Anzeigedatum f\xfcr den Zettel!"}):e.setZettelObjectErr({status:2,msg:"Sie d\xfcrfen kein Anzeigedatum speichern, ohne ein Sortierdatum anzugeben!"})}),[ne,r,b,C,E,H,J]),(0,f.useEffect)((function(){e.setLemma(x)}),[x]),(0,y.jsxs)(y.Fragment,{children:[(0,y.jsxs)(u.Z,{className:"mb-2",children:[(0,y.jsx)(h.Z,{xs:4,children:"Zetteltyp:"}),(0,y.jsx)(h.Z,{children:(0,y.jsx)(d.SA,{style:{width:"100%"},value:r||0,options:[[0,"..."],[1,"verzettelt"],[2,"Exzerpt"],[3,"Index"],[4,"Literatur"],[6,"Index (unkl. Werk)"],[7,"Notiz"]],onChange:function(e){l(parseInt(e.target.value))},classList:"onOpenSetFocus"})})]}),(0,y.jsxs)(u.Z,{className:"mb-2",children:[(0,y.jsx)(h.Z,{xs:4,children:"Wort:"}),(0,y.jsx)(h.Z,{children:(0,y.jsx)(d.Qc,{style:{width:"100%"},onChange:function(e,t){g(e),_(t)},value:x||"",tbl:"lemma",searchCol:"lemma",returnCol:"lemma_ac"})})]}),4!==r&&r<6&&(0,y.jsxs)(u.Z,{className:"mb-2",children:[(0,y.jsx)(h.Z,{xs:4,children:"Werk:"}),(0,y.jsx)(h.Z,{children:(0,y.jsx)(d.Qc,{style:{width:"100%"},value:w||"",tbl:"work",searchCol:"ac_web",returnCol:"ac_web",onChange:function(){var e=(0,a.Z)(i().mark((function e(t,n){var r;return i().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(k(t),z(n),!(n>0)){e.next=7;break}return e.next=5,o.Q.work.get({id:n},{select:["date_display","date_type"]});case 5:(r=e.sent).length>0&&(B(r[0].date_type),D(r[0].date_display));case 7:case"end":return e.stop()}}),e)})));return function(t,n){return e.apply(this,arguments)}}()})})]}),4!==r&&r<6&&C>0?(0,y.jsxs)(u.Z,{className:"mb-2",children:[(0,y.jsx)(h.Z,{xs:4,children:"Datierung:"}),(0,y.jsx)(h.Z,{children:(0,y.jsx)("span",{style:{width:"100%"},dangerouslySetInnerHTML:(0,d.rg)(L)})})]}):null,9===E?(0,y.jsxs)(y.Fragment,{children:[(0,y.jsx)(u.Z,{className:"mt-4 mb-2",children:(0,y.jsx)(h.Z,{children:(0,y.jsxs)("span",{className:"minorTxt",children:[(0,y.jsx)("b",{children:"Achtung:"})," Dieser Zettel ben\xf6tigt eine ",(0,y.jsx)("a",{href:"https://gitlab.lrz.de/haeberlin/dmlw/-/wikis/09-HiwiHow:-Zettel-verkn\xfcpfen#anzeigedatumsortierdatum",target:"_blank",rel:"noreferrer",children:"eigene Datierung"}),"."]})})}),(0,y.jsxs)(u.Z,{className:"mb-2",children:[(0,y.jsx)(h.Z,{xs:4,children:"Sortierdatum:"}),(0,y.jsx)(h.Z,{children:(0,y.jsx)("input",{className:R?"invalidInput":null,style:{width:"100%"},type:"text",value:H||"",onChange:function(e){T(""===e.target.value?null:e.target.value)}})})]}),(0,y.jsxs)(u.Z,{className:"mb-4",children:[(0,y.jsx)(h.Z,{xs:4,children:"Anzeigedatum:"}),(0,y.jsx)(h.Z,{children:(0,y.jsx)("input",{className:P?"invalidInput":null,style:{width:"100%"},type:"text",value:J||"",onChange:function(e){V(e.target.value)}})})]})]}):null,null===e.item.img_path&&(0,y.jsxs)(u.Z,{className:"mb-2",children:[(0,y.jsx)(h.Z,{xs:4,children:"Text:"}),(0,y.jsx)(h.Z,{children:(0,y.jsx)("textarea",{style:{width:"100%"},value:ne,onChange:function(e){re(e.target.value)}})})]})]})}function W(){return{type:2,txt:"Neuer Zettel"}}function A(){return["img_path","date_display","ac_web","lemma_display","txt"]}function L(){return[['[{"id":2,"c":"lemma","o":"=","v":"NULL"}]',"Wortzuweisung"],['[{"id": 2,"c":"type","o":"=","v":"NULL"}]',"Typzuweisung"],['[{"id": 2, "c": "ac_web", "o": "=", "v": "NULL"},{"id": 3, "c": "type", "o": "!=", "v": 4},{"id": 4, "c": "type", "o": "!=", "v": 6},{"id": 5, "c": "type", "o": "!=", "v": 7}]',"Werkzuweisung"],['[{"id": 2, "c": "date_type", "o": "=", "v": 9},{"id": 3, "c": "date_own", "o": "!=", "v": "NULL"},{"id": 4, "c": "type", "o": "!=", "v": 3},{"id": 5, "c": "type", "o": "!=", "v": 6},{"id": 6, "c": "type", "o": "!=", "v": 7}]',"Datumszuweisung"]]}function D(){return[['["id"]',"ID"],['["lemma","lemma_nr","date_sort","date_type"]',"Datum"],['["ocr_length"]',"Textl\xe4nge"]]}function q(e){return(0,y.jsxs)(y.Fragment,{children:[(0,y.jsxs)(m.Z.Item,{onClick:function(t){e.loadMain(t,"maiora")},children:[(0,y.jsx)("i",{children:"opera maiora"}),"-Liste"]}),(0,y.jsxs)(m.Z.Item,{onClick:function(t){e.loadMain(t,"minora")},children:[(0,y.jsx)("i",{children:"opera minora"}),"-Liste"]}),(0,y.jsx)(m.Z.Item,{onClick:function(t){e.loadMain(t,"seklit")},children:"Sekund\xe4rliteratur"}),(0,y.jsx)(m.Z.Item,{onClick:function(t){e.loadMain(t,"ressources")},children:"Ressourcen"}),o.Q.access("geschichtsquellen")&&(0,y.jsx)(m.Z.Item,{onClick:function(t){e.loadMain(t,"gq_autoren")},children:"Geschichtsquellen-Autoren"}),o.Q.access("geschichtsquellen")&&(0,y.jsx)(m.Z.Item,{onClick:function(t){e.loadMain(t,"gq_werke")},children:"Geschichtsquellen-Werke"})]})}var M=function(){var e=(0,a.Z)(i().mark((function e(){var t;return i().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,o.Q.lemma.getAll({select:["id","lemma","lemma_display"],order:["lemma"]});case 2:return t=(t=e.sent).map((function(e){return{id:e.id,lemma_display:e.lemma_display,lemma:e.lemma.toLowerCase()}})),e.abrupt("return",t);case 5:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}();function H(e){var t=(0,f.useState)(""),n=(0,s.Z)(t,2),l=n[0],c=n[1],u=(0,f.useState)([]),h=(0,s.Z)(u,2),m=h[0],p=h[1];return(0,f.useEffect)((function(){var t=function(){var t=(0,a.Z)(i().mark((function t(){var n,a,s,l,d;return i().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(!(e.z.work_id>0)){t.next=8;break}return t.next=3,o.Q.edition.get({work_id:e.z.work_id},{select:["id","label","url"]});case 3:n=t.sent,a=[],s=(0,r.Z)(n);try{for(s.s();!(l=s.n()).done;)d=l.value,a.push((0,y.jsx)(x.Z.Item,{children:(0,y.jsx)("a",{href:""===d.url?"/site/argos/".concat(d.id):d.url,target:"_blank",rel:"noreferrer",children:d.label})},d.id))}catch(i){s.e(i)}finally{s.f()}p(a);case 8:case"end":return t.stop()}}),t)})));return function(){return t.apply(this,arguments)}}();t()}),[]),(0,y.jsxs)(g.Z,{style:{width:"30rem"},className:"mb-3",children:[(0,y.jsx)(b.G,{style:{position:"absolute",top:"12px",right:"10px"},onClick:function(){c(""===l?"v":"")},icon:_.UO1}),(0,y.jsx)(g.Z.Header,{style:{height:"41px"},dangerouslySetInnerHTML:(0,d.rg)(e.z.opus)}),(0,y.jsx)(g.Z.Img,{variant:"bottom",src:"".concat(o.Q.url,"/mlw").concat(e.z.img_path).concat(l,".jpg")}),(0,y.jsx)(g.Z.Body,{children:(0,y.jsx)(g.Z.Text,{children:(0,y.jsx)(x.Z,{horizontal:!0,children:m})})})]})}function T(e){var t=(0,f.useState)(null),n=(0,s.Z)(t,2),r=n[0],l=n[1],m=(0,f.useState)(null),x=(0,s.Z)(m,2),g=x[0],b=x[1],_=(0,f.useState)(null),v=(0,s.Z)(_,2),w=v[0],k=v[1],F=(0,f.useState)(null),S=(0,s.Z)(F,2),C=S[0],z=S[1],I=(0,f.useState)(null),N=(0,s.Z)(I,2),E=N[0],B=N[1],W=(0,f.useState)([]),A=(0,s.Z)(W,2),L=A[0],D=A[1];return(0,f.useEffect)((function(){var t=function(){var t=(0,a.Z)(i().mark((function t(){var n,r,a,s;return i().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return l(null),b(null),k(null),z(null),B(null),t.next=7,o.Q.lemma.get({id:e.lemma_id});case 7:return n=t.sent,l(n[0]),t.next=11,o.Q.zettel.get({lemma_id:e.lemma_id,type:1},{order:["date_sort","date_type"],select:["id","opus","img_path","work_id","date_sort","date_own"]});case 11:return r=t.sent,b(r),t.next=15,o.Q.zettel.get({lemma_id:e.lemma_id,type:2},{order:["date_sort","date_type"],select:["id","opus","img_path","work_id","date_sort","date_own"]});case 15:return a=t.sent,k(a),t.next=19,o.Q.zettel.search([{c:"lemma_id",o:"=",v:e.lemma_id},{c:"type",o:">=",v:"3"},{c:"type",o:"<=",v:"6"},{c:"type",o:"!=",v:"4"}],{order:["date_sort","date_type"],select:["id","opus","img_path","work_id","date_sort","date_own"]});case 19:return s=t.sent,z(s),D(r.concat(a.concat(s))),t.t0=B,t.next=25,o.Q.zettel.search([{c:"lemma_id",o:"=",v:e.lemma_id},{c:"type",o:">=",v:"4"},{c:"type",o:"!=",v:"6"}],{order:["date_sort","date_type"],select:["id","opus","img_path","work_id"]});case 25:t.t1=t.sent,(0,t.t0)(t.t1);case 27:case"end":return t.stop()}}),t)})));return function(){return t.apply(this,arguments)}}();t()}),[e.lemma_id]),r?(0,y.jsxs)(y.Fragment,{children:[(0,y.jsx)("h1",{dangerouslySetInnerHTML:(0,d.rg)(r.lemma_display)}),(0,y.jsxs)(c.Z,{children:[r.dicts&&(0,y.jsxs)(u.Z,{children:[(0,y.jsx)(h.Z,{xs:2,children:"W\xf6rterb\xfccher:"}),(0,y.jsx)(h.Z,{dangerouslySetInnerHTML:(0,d.rg)(r.dicts)})]}),r.comment&&(0,y.jsxs)(u.Z,{className:"mb-4",children:[(0,y.jsx)(h.Z,{xs:2,children:"Kommentar:"}),(0,y.jsx)(h.Z,{dangerouslySetInnerHTML:(0,d.rg)(r.comment)})]}),(0,y.jsx)(u.Z,{children:(0,y.jsx)(h.Z,{children:(0,y.jsxs)(p.Z,{defaultActiveKey:"",children:[(0,y.jsxs)(p.Z.Item,{eventKey:"s",children:[(0,y.jsx)(p.Z.Header,{children:"Statistik"}),(0,y.jsx)(p.Z.Body,{children:(0,y.jsx)("div",{style:{width:"70%",margin:"auto"},children:(0,y.jsx)(Z.$Q,{options:{aspectRatio:!1,plugins:{legend:{display:!0,position:"bottom"}}},data:{labels:["6. Jh.","7. Jh.","8. Jh.","9. Jh.","10. Jh.","11. Jh.","12. Jh.","13. Jh."],datasets:[{label:"Anzahl Zettel",data:[L.filter((function(e){return e.date_sort<600})).length,L.filter((function(e){return e.date_sort>599&&e.date_sort<700})).length,L.filter((function(e){return e.date_sort>699&&e.date_sort<800})).length,L.filter((function(e){return e.date_sort>799&&e.date_sort<900})).length,L.filter((function(e){return e.date_sort>899&&e.date_sort<1e3})).length,L.filter((function(e){return e.date_sort>999&&e.date_sort<1100})).length,L.filter((function(e){return e.date_sort>1099&&e.date_sort<1200})).length,L.filter((function(e){return e.date_sort>1199})).length],backgroundColor:["#347F9F"],borderColor:["#347F9F"],borderWidth:1}]}})})})]}),(0,y.jsxs)(p.Z.Item,{eventKey:"v",children:[(0,y.jsxs)(p.Z.Header,{children:["verzetteltes Material\xa0",g?(0,y.jsxs)("span",{children:["(",g.length,")"]}):(0,y.jsx)(j.Z,{size:"sm",animation:"border"})]}),(0,y.jsx)(p.Z.Body,{children:(0,y.jsx)(c.Z,{className:"d-flex flex-wrap justify-content-center",children:g?g.map((function(e){return(0,y.jsx)(H,{z:e},e.id)})):null})})]}),(0,y.jsxs)(p.Z.Item,{eventKey:"e",children:[(0,y.jsxs)(p.Z.Header,{children:["Exzerpt-Zettel\xa0",w?(0,y.jsxs)("span",{children:["(",w.length,")"]}):(0,y.jsx)(j.Z,{size:"sm",animation:"border"})]}),(0,y.jsx)(p.Z.Body,{children:(0,y.jsx)(c.Z,{className:"d-flex flex-wrap justify-content-center",children:w?w.map((function(e){return(0,y.jsx)(H,{z:e},e.id)})):null})})]}),(0,y.jsxs)(p.Z.Item,{eventKey:"i",children:[(0,y.jsxs)(p.Z.Header,{children:["Index-Zettel\xa0",C?(0,y.jsxs)("span",{children:["(",C.length,")"]}):(0,y.jsx)(j.Z,{size:"sm",animation:"border"})]}),(0,y.jsx)(p.Z.Body,{children:(0,y.jsx)(c.Z,{className:"d-flex flex-wrap justify-content-center",children:C?C.map((function(e){return(0,y.jsx)(H,{z:e},e.id)})):null})})]}),(0,y.jsxs)(p.Z.Item,{eventKey:"r",children:[(0,y.jsxs)(p.Z.Header,{children:["restliche Zettel\xa0",E?(0,y.jsxs)("span",{children:["(",E.length,")"]}):(0,y.jsx)(j.Z,{size:"sm",animation:"border"})]}),(0,y.jsx)(p.Z.Body,{children:(0,y.jsx)(c.Z,{className:"d-flex flex-wrap justify-content-center",children:E?E.map((function(e){return(0,y.jsx)(H,{z:e},e.id)})):null})})]})]})})})]})]}):null}function Q(e){var t=null;switch(e.name){case"zettel_process":t=(0,y.jsxs)("div",{style:{margin:"auto",marginBottom:"80px",width:"450px",height:"450px"},children:[(0,y.jsx)("h4",{children:"nach Bearbeitungsstand"}),(0,y.jsx)(Z.by,{options:{plugins:{legend:{position:"bottom"}}},data:{labels:["abgeschlossen","nur Lemma","unbearbeitet"],datasets:[{label:"# of Votes",data:e.data,backgroundColor:["#114B79","#347F9F","#EAF2F3"],borderColor:["#1B3B6F","#065A82","#E8F1F2"],borderWidth:1}]}})]});break;case"zettel_type":t=(0,y.jsxs)("div",{style:{margin:"auto",marginBottom:"80px",width:"450px",height:"450px"},children:[(0,y.jsx)("h4",{children:"nach Typen"}),(0,y.jsx)(Z.by,{options:{plugins:{legend:{position:"bottom"}}},data:{labels:["verzetteltes Material","Exzerpt","Index","Literatur","Index (unkl. Werk)","Notiz","kein Typ"],datasets:[{label:"# of Votes",data:e.data,backgroundColor:["#114B79","#347F9F","#8FC9D9","#D2EFF4","#EAF2F3","#EFEFEF","#FFFFFF"],borderColor:["#1B3B6F","#065A82","#61A4BC","#BCEDF6","#E8F1F2","#EEEEEE","#EFEFEF"],borderWidth:1}]}})]});break;case"zettel_created_changed":t=(0,y.jsxs)("div",{style:{marginBottom:"80px",width:"100%",height:"400px"},children:[(0,y.jsx)("h4",{children:"nach Jahren"}),(0,y.jsx)(Z.$Q,{options:{aspectRatio:!1,plugins:{legend:{display:!0,position:"bottom"}}},data:{labels:["2020","2021","2022"],datasets:[{label:"ver\xe4ndert",data:e.data[1],backgroundColor:["#114B79"],borderColor:["#114B79"],borderWidth:1,type:"line"},{label:"erstellt",data:e.data[0],backgroundColor:["#347F9F"],borderColor:["#347F9F"],borderWidth:1}]}})]});break;case"zettel_created_changed_current":t=(0,y.jsxs)("div",{style:{marginBottom:"80px",width:"100%",height:"400px"},children:[(0,y.jsx)("h4",{children:"in diesem Jahr"}),(0,y.jsx)(Z.$Q,{options:{aspectRatio:!1,plugins:{legend:{display:!0,position:"bottom"}}},data:{labels:["Jan.","Feb.","M\xe4r.","Apr.","Mai","Jun.","Jul.","Aug.","Sep.","Okt.","Nov.","Dez."].slice(0,(new Date).getMonth()+1),datasets:[{label:"ver\xe4ndert",data:e.data[1],backgroundColor:["#114B79"],borderColor:["#114B79"],borderWidth:1,type:"line"},{label:"erstellt",data:e.data[0],backgroundColor:["#347F9F"],borderColor:["#347F9F"],borderWidth:1}]}})]});break;case"zettel_letter":t=(0,y.jsxs)("div",{style:{marginBottom:"80px",width:"100%",height:"400px"},children:[(0,y.jsx)("h4",{children:"nach Buchstaben"}),(0,y.jsx)(Z.$Q,{options:{aspectRatio:!1,plugins:{legend:{display:!0,position:"bottom"}},scales:{x:{stacked:!0},y:{stacked:!0}}},data:{labels:["A","B","C","D","E","F","G","H","I","K","L","M","N","O","P","Q","R","S","T","U","W","X","Y","Z"],datasets:[{label:"Anzahl verzetteltes Material",data:e.data[0],backgroundColor:["#347F9F"],borderColor:["#347F9F"],borderWidth:1},{label:"Anzahl Exzerpt-Zettel",data:e.data[1],backgroundColor:["#8FC9D9"],borderColor:["#8FC9D9"],borderWidth:1},{label:"Anzahl Index-Zettel",data:e.data[2],backgroundColor:["#D2EFF4"],borderColor:["#D2EFF4"],borderWidth:1},{label:"Anzahl restlicher Zettel",data:e.data[3],backgroundColor:["#EAF2F3"],borderColor:["#EAF2F3"],borderWidth:1}]}})]});break;case"lemma_letter":t=(0,y.jsxs)("div",{style:{marginBottom:"80px",margin:"auto",width:"70%",height:"600px"},children:[(0,y.jsx)("h4",{children:"nach Buchstaben"}),(0,y.jsx)(Z.$Q,{options:{plugins:{legend:{display:!1,position:"bottom"}}},data:{labels:["A","B","C","D","E","F","G","H","I","K","L","M","N","O","P","Q","R","S","T","U","V","X","Y","Z"],datasets:[{label:"",data:e.data,backgroundColor:["#114B79","#347F9F","#8FC9D9","#D2EFF4","#EAF2F3"],borderColor:["#1B3B6F","#065A82","#61A4BC","#BCEDF6","#E8F1F2"],borderWidth:1}]}})]});break;case"lemma_mlw":t=(0,y.jsxs)("div",{style:{margin:"auto",marginBottom:"80px",width:"450px",height:"450px"},children:[(0,y.jsx)("h4",{children:"nach Relevanz f\xfcrs W\xf6rterbuch"}),(0,y.jsx)(Z.by,{options:{plugins:{legend:{display:!0,position:"bottom"}}},data:{labels:["relevant","nicht relevant"],datasets:[{label:"",data:e.data,backgroundColor:["#114B79","#EAF2F3"],borderColor:["#1B3B6F","#E8F1F2"],borderWidth:1}]}})]});break;case"ressource_work":t=(0,y.jsxs)("div",{style:{margin:"auto",marginBottom:"80px",width:"450px",height:"450px"},children:[(0,y.jsx)("h4",{children:"Werke nach Volltext und pdfs"}),(0,y.jsx)(Z.by,{options:{plugins:{legend:{position:"bottom"}}},data:{labels:["mit Volltext und pdf","nur mit pdf","ohne pdf und Volltext","nicht in Benutzung"],datasets:[{label:"",data:e.data,backgroundColor:["#114B79","#347F9F","#EAF2F3","#FFFFFF"],borderColor:["#1B3B6F","#065A82","#E8F1F2","#EFEFEF"],borderWidth:1}]}})]});break;case"ressource_scans":t=(0,y.jsxs)("div",{style:{margin:"auto",marginBottom:"80px",width:"450px",height:"450px"},children:[(0,y.jsx)("h4",{children:"Scan-Seiten und Volltexte"}),(0,y.jsx)(Z.by,{options:{plugins:{legend:{position:"bottom"}}},data:{labels:["gepr\xfcfter Volltext","automatischer Volltext","ohne Volltext","kein lat. Text"],datasets:[{label:"",data:e.data,backgroundColor:["#114B79","#347F9F","#EAF2F3","#FFFFFF"],borderColor:["#1B3B6F","#065A82","#E8F1F2","#EFEFEF"],borderWidth:1}]}})]});break;default:console.log(e.name)}return t}function O(e){var t=(0,f.useState)([null]),n=(0,s.Z)(t,2),r=n[0],l=n[1],c=(0,f.useState)([]),u=(0,s.Z)(c,2),h=u[0],m=u[1],x=(0,f.useState)([]),g=(0,s.Z)(x,2),p=g[0],j=g[1],b=(0,f.useState)([]),_=(0,s.Z)(b,2),Z=_[0],v=_[1],w=(0,f.useState)([]),k=(0,s.Z)(w,2),F=k[0],S=k[1],C=(0,f.useState)([]),z=(0,s.Z)(C,2),I=z[0],N=z[1],E=(0,f.useState)([]),B=(0,s.Z)(E,2),W=B[0],A=B[1];return(0,f.useEffect)((function(){var e=function(){var e=(0,a.Z)(i().mark((function e(){var t,n,r,a,s,d,c,u,h,x,g,p,f,b,_,Z,y;return i().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,o.Q.gq_autoren.getAll();case 2:return t=e.sent,e.next=5,o.Q.gq_werke.getAll();case 5:return n=e.sent,e.next=8,fetch("http://localhost:8080/geschichtsquellen/autoren");case 8:return r=e.sent,e.next=11,r.json();case 11:return a=e.sent,e.next=14,fetch("http://localhost:8080/geschichtsquellen/werke");case 14:return s=e.sent,e.next=17,s.json();case 17:for(_ in d=e.sent,c=[],u=[],h=[],x=[],g=[],p=[],f=n.map((function(e){return e.gq_id})),b=function(e){var t={gq_id:parseInt(d.data[e][0]._.substring(15,d.data[e][0]._.indexOf('"',15))),gq_autor_id:d.data[e][3]._?parseInt(d.data[e][3]._.substring(16,d.data[e][3]._.indexOf('"',16))):null,werk_lat:d.data[e][0]._.replace(/<.*?>/g,""),werk_de:d.data[e][1]._};if(f.includes(parseInt(t.gq_id))){var r=n.find((function(e){return e.gq_id===t.gq_id}));r.gq_autor===t.gq_autor&&r.werk_lat===t.werk_lat&&r.werk_de===t.werk_de||(t.id=r.id,g.push(t))}else x.push(t)},d.data)b(_);for(y in Z=function(e){var n={gq_id:parseInt(a.data[e][0]._.substring(16,a.data[e][0]._.indexOf('"',16))),autor_lat:a.data[e][0]._.replace(/<.*?>/g,""),autor_de:a.data[e][1]._};if(f.includes(parseInt(n.gq_id))){var r=t.find((function(e){return e.gq_id===n.gq_id}));r.autor_lat===n.autor_lat&&r.autor_de===n.autor_de||(n.id=r.id,u.push(n))}else c.push(n)},a.data)Z(y);l([n.length,Object.keys(d.data).length,t.length,Object.keys(a.data).length]),S(x),N(g),A(p),m(c),j(u),v(h);case 36:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}();e()}),[]),(0,y.jsxs)(y.Fragment,{children:[(0,y.jsx)("table",{width:"100%",children:(0,y.jsxs)("tbody",{children:[(0,y.jsxs)("tr",{children:[(0,y.jsx)("th",{}),(0,y.jsx)("th",{children:"Autoren"}),(0,y.jsx)("th",{children:"Werke"})]}),(0,y.jsxs)("tr",{children:[(0,y.jsx)("td",{children:"Datens\xe4tze in der Geschichtsquellen/Datenbank:"}),(0,y.jsxs)("td",{children:[r[3],"/",r[2]]}),(0,y.jsxs)("td",{children:[r[1],"/",r[0]]})]}),(0,y.jsxs)("tr",{children:[(0,y.jsx)("td",{children:"Neue Datens\xe4tze erstellen:"}),(0,y.jsx)("td",{children:h.length}),(0,y.jsx)("td",{children:F.length})]}),(0,y.jsxs)("tr",{children:[(0,y.jsx)("td",{children:"Datens\xe4tze \xe4ndern:"}),(0,y.jsx)("td",{children:p.length}),(0,y.jsx)("td",{children:I.length})]}),(0,y.jsxs)("tr",{children:[(0,y.jsx)("td",{children:"Datens\xe4tze l\xf6schen:"}),(0,y.jsx)("td",{children:Z.length}),(0,y.jsx)("td",{children:W.length})]})]})}),(0,y.jsx)("div",{children:(0,y.jsx)(d.YG,{onClick:(0,a.Z)(i().mark((function e(){return i().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(!(F.length>0)){e.next=3;break}return e.next=3,o.Q.gq_werke.save(F);case 3:if(!(h.length>0)){e.next=6;break}return e.next=6,o.Q.gq_autoren.save(h);case 6:if(!(I.length>0)){e.next=9;break}return e.next=9,o.Q.gq_werke.save(I);case 9:if(!(p.length>0)){e.next=12;break}return e.next=12,o.Q.gq_autoren.save(p);case 12:if(!(W.length>0)){e.next=15;break}return e.next=15,o.Q.gq_werke.delete(W);case 15:if(!(Z.length>0)){e.next=18;break}return e.next=18,o.Q.gq_autoren.delete(Z);case 18:return e.abrupt("return",{status:1});case 19:case"end":return e.stop()}}),e)}))),value:"\xc4nderungen \xfcbernehmen"})})]})}function J(e){return(0,y.jsx)(d.HA,{tblName:"work",searchOptions:[["id","ID"]],sortOptions:[['["id"]',"ID"]],menuItems:[],tblRow:function(e){return(0,y.jsxs)(y.Fragment,{children:[(0,y.jsx)("td",{title:"ID: "+e.cEl.id,dangerouslySetInnerHTML:(0,d.rg)(e.cEl.opus)}),(0,y.jsx)("td",{dangerouslySetInnerHTML:(0,d.rg)(e.cEl.full)}),(0,y.jsx)("td",{children:e.cEl.gq_id})]})},tblHeader:(0,y.jsxs)(y.Fragment,{children:[(0,y.jsx)("th",{children:"Zitiertitel"}),(0,y.jsx)("th",{children:"Informationen"}),(0,y.jsx)("th",{children:"verknpft. Geschichtsquellen-Eintr\xe4ge"})]}),asideContent:[{caption:"Zitiertitel",type:"span",col:"ac_web"},{caption:"Zitiertitel",type:"text",col:"ac_web"},{caption:"Geschichtsquellen:",type:"auto",col:["","gq_id"],search:{tbl:"geschichtsquellen",sCol:"opus",rCol:"opus"}}]})}function V(e){return(0,y.jsx)(d.HA,{tblName:"work",searchOptions:[["id","ID"]],sortOptions:[['["id"]',"ID"]],menuItems:[],tblRow:function(e){return(0,y.jsxs)(y.Fragment,{children:[(0,y.jsx)("td",{title:"ID: "+e.cEl.id,dangerouslySetInnerHTML:(0,d.rg)(e.cEl.opus)}),(0,y.jsx)("td",{dangerouslySetInnerHTML:(0,d.rg)(e.cEl.full)}),(0,y.jsx)("td",{children:e.cEl.gq_id})]})},tblHeader:(0,y.jsxs)(y.Fragment,{children:[(0,y.jsx)("th",{children:"Zitiertitel"}),(0,y.jsx)("th",{children:"Informationen"}),(0,y.jsx)("th",{children:"verknpft. Geschichtsquellen-Eintr\xe4ge"})]}),asideContent:[{caption:"Zitiertitel",type:"span",col:"ac_web"},{caption:"Zitiertitel",type:"text",col:"ac_web"},{caption:"Geschichtsquellen:",type:"auto",col:["","gq_id"],search:{tbl:"geschichtsquellen",sCol:"opus",rCol:"opus"}}]})}}}]);
//# sourceMappingURL=906.a7a8d1e4.chunk.js.map