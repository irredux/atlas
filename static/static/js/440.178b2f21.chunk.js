"use strict";(self.webpackChunkatlas=self.webpackChunkatlas||[]).push([[440],{3440:function(e,t,n){n.r(t),n.d(t,{BatchInputType:function(){return S},DOMOpera:function(){return B},DOMRessource:function(){return W},Etudaus:function(){return D},IndexBoxDetail:function(){return M},Konkordanz:function(){return A},LemmaAsideContent:function(){return k},LemmaHeader:function(){return f},LemmaRow:function(){return v},MainMenuContent:function(){return L},StatisticsChart:function(){return H},ZettelAddLemmaContent:function(){return C},ZettelCard:function(){return y},ZettelSingleContent:function(){return F},arachneTbls:function(){return b},exportZettelObject:function(){return I},fetchIndexBoxData:function(){return Q},lemmaSearchItems:function(){return Z},newZettelObject:function(){return z},zettelBatchOptions:function(){return w},zettelPresetOptions:function(){return E},zettelSearchItems:function(){return _},zettelSortOptions:function(){return N}});var r=n(7762),a=n(5861),l=n(885),i=n(7757),s=n.n(i),o=n(3222),c=n(6407),d=n(2791),u=n(7022),m=n(9743),h=n(2677),x=n(2354),g=(n(6546),n(9683)),p=n(184);function b(){return["lemma","work","zettel","user","konkordanz","opera","comment","etudaus","ocr_jobs","edition","statistics"]}function f(){return(0,p.jsxs)("tr",{children:[(0,p.jsx)("th",{width:"30%",children:"Lemma"}),(0,p.jsx)("th",{width:"20%",children:"Farbe"}),(0,p.jsx)("th",{children:"Kommentar"}),(0,p.jsx)("th",{children:"dom en ligne"})]})}var j={gelb:"#E9AB17","gr\xfcn":"green",blau:"#0000A0",rot:"#C11B17",lila:"#4B0082","t\xfcrkis":"#3f888f"};function v(e){return(0,p.jsxs)("tr",{id:e.lemma.id,onDoubleClick:function(t){e.showDetail(parseInt(t.target.closest("tr").id))},children:[(0,p.jsx)("td",{title:"ID: "+e.lemma.id,children:(0,p.jsx)("a",{dangerouslySetInnerHTML:(0,o.rg)(e.lemma.lemma_display),onClick:function(t){localStorage.setItem("searchBox_zettel",'[[{"id":0,"c":"lemma_id","o":"=","v":'.concat(e.lemma.id,'}],1,["id"]]')),e.loadMain(t)}})}),(0,p.jsx)("td",{style:{color:j[e.lemma.farbe]},children:e.lemma.farbe}),(0,p.jsx)("td",{dangerouslySetInnerHTML:(0,o.rg)(e.lemma.comment)}),(0,p.jsx)("td",{children:e.lemma.URL?(0,p.jsx)("a",{href:"https://dom-en-ligne.de/"+e.lemma.URL,target:"_blank",rel:"noreferrer",children:"zum Artikel"}):null})]})}function Z(){return[["lemma","Lemma"],["id","ID"],["farbe","Farbe"],["URL","URL"]]}function k(e){var t=(0,d.useState)(e.item.lemma),n=(0,l.Z)(t,2),i=n[0],x=n[1],g=(0,d.useState)(e.item.lemma_simple),b=(0,l.Z)(g,2),f=b[0],j=b[1],v=(0,d.useState)(e.item.nr),Z=(0,l.Z)(v,2),k=Z[0],_=Z[1],y=(0,d.useState)(e.item.normgraphie),w=(0,l.Z)(y,2),S=w[0],C=w[1],F=(0,d.useState)(e.item.dom_normgraphie),z=(0,l.Z)(F,2),I=z[0],E=z[1],N=(0,d.useState)(e.item.verworfen),L=(0,l.Z)(N,2),B=L[0],A=L[1],D=(0,d.useState)(e.item.unsicher),W=(0,l.Z)(D,2),Q=W[0],M=W[1],H=(0,d.useState)(e.item.farbe),T=(0,l.Z)(H,2),O=T[0],R=T[1],V=(0,d.useState)(e.item.comment),K=(0,l.Z)(V,2),J=K[0],U=K[1],G=(0,d.useState)(e.item.reference_id),P=(0,l.Z)(G,2),Y=P[0],$=P[1],q=(0,d.useState)(e.item.reference),X=(0,l.Z)(q,2),ee=X[0],te=X[1];return(0,d.useEffect)((function(){x(e.item.lemma),j(e.item.lemma_simple),_(e.item.nr),C(e.item.normgraphie),E(e.item.dom_normgraphie),A(e.item.verworfen),M(e.item.unsicher),R(e.item.farbe),U(e.item.comment),$(e.item.reference_id),te(e.item.reference)}),[e.id]),(0,p.jsxs)(u.Z,{children:[(0,p.jsxs)(m.Z,{className:"mb-2",children:[(0,p.jsx)(h.Z,{children:"Wort:"}),(0,p.jsx)(h.Z,{children:(0,p.jsx)("input",{type:"text",value:i,onChange:function(e){x(e.target.value)}})})]}),(0,p.jsxs)(m.Z,{className:"mb-2",children:[(0,p.jsxs)(h.Z,{children:["Wort: ",(0,p.jsx)("small",{children:"(ohne Sonderz.)"})]}),(0,p.jsx)(h.Z,{children:(0,p.jsx)("input",{type:"text",value:f,onChange:function(e){j(e.target.value)}})})]}),(0,p.jsxs)(m.Z,{className:"mb-2",children:[(0,p.jsx)(h.Z,{children:"Farbe:"}),(0,p.jsx)(h.Z,{children:(0,p.jsx)(o.SA,{options:[["gelb","gelb"],["gr\xfcn","gr\xfcn"],["rot","rot"],["blau","blau"],["lila","lila"],["t\xfcrkis","t\xfcrkis"]],onChange:function(e){R(e.target.value)},value:O})})]}),["blau","t\xfcrkis","lila"].includes(O)?(0,p.jsxs)(m.Z,{children:[(0,p.jsx)(h.Z,{children:"Referenz:"}),(0,p.jsx)(h.Z,{children:(0,p.jsx)(o.Qc,{onChange:function(e,t){te(e),$(t)},tbl:"lemma",col:"ac_w",value:ee})})]}):null,(0,p.jsxs)(m.Z,{className:"mt-4 mb-2",children:[(0,p.jsx)(h.Z,{children:"Homonym-Nr.:"}),(0,p.jsx)(h.Z,{children:(0,p.jsx)("input",{type:"text",value:k,onChange:function(e){_(e.target.value)}})})]}),(0,p.jsxs)(m.Z,{className:"mb-2",children:[(0,p.jsx)(h.Z,{children:"Normgraphie:"}),(0,p.jsx)(h.Z,{children:(0,p.jsx)(o.SA,{options:[[0,"Nein"],[1,"Ja"]],onChange:function(e){C(e.target.value)},value:S})})]}),(0,p.jsxs)(m.Z,{className:"mb-2",children:[(0,p.jsx)(h.Z,{children:"DOM-Normgraphie:"}),(0,p.jsx)(h.Z,{children:(0,p.jsx)(o.SA,{options:[[0,"Nein"],[1,"Ja"]],onChange:function(e){E(e.target.value)},value:I})})]}),(0,p.jsxs)(m.Z,{className:"mb-2",children:[(0,p.jsx)(h.Z,{children:"verworfen:"}),(0,p.jsx)(h.Z,{children:(0,p.jsx)(o.SA,{options:[[0,"Nein"],[1,"Ja"]],onChange:function(e){A(e.target.value)},value:B})})]}),(0,p.jsxs)(m.Z,{className:"mb-2",children:[(0,p.jsx)(h.Z,{children:"unsicher:"}),(0,p.jsx)(h.Z,{children:(0,p.jsx)(o.SA,{options:[[0,"Nein"],[1,"Ja"]],onChange:function(e){M(e.target.value)},value:Q})})]}),(0,p.jsxs)(m.Z,{className:"mb-4",children:[(0,p.jsx)(h.Z,{children:"Kommentar:"}),(0,p.jsx)(h.Z,{children:(0,p.jsx)("textarea",{onChange:function(e){U(e.target.value)},style:{resize:"false",width:"97%"},value:J})})]}),(0,p.jsx)(m.Z,{children:(0,p.jsxs)(h.Z,{children:[(0,p.jsx)(o.YG,{value:"speichern",onClick:(0,a.Z)(s().mark((function t(){var n;return s().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(""!==i){t.next=4;break}return t.abrupt("return",{status:!1,error:"Bitte ein g\xfcltiges Wort eintragen!"});case 4:if(""!==f){t.next=8;break}return t.abrupt("return",{status:!1,error:"Bitte tragen Sie eine g\xfcltiges Wort (ohne Sonderzeichen) ein!"});case 8:return n={id:e.id,lemma:i,lemma_simple:f,reference_id:Y,normgraphie:S,dom_normgraphie:I,verworfen:B,unsicher:Q,farbe:O,comment:J},isNaN(k)||(n.nr=k),t.next=12,c.Q.lemma.save(n);case 12:return e.onUpdate(e.id),t.abrupt("return",{status:!0});case 14:case"end":return t.stop()}}),t)})))}),c.Q.access("l_edit")?(0,p.jsx)(o.YG,{style:{marginLeft:"10px"},variant:"danger",value:"l\xf6schen",onClick:(0,a.Z)(s().mark((function t(){var n,a,l,i,o;return s().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(!window.confirm("Soll das Wort gel\xf6scht werden? Das Wort wird von allen verkn\xfcpften Zettel entfernt. Dieser Schritt kann nicht r\xfcckg\xe4ngig gemacht werden!")){t.next=15;break}return t.next=3,c.Q.zettel.get({lemma_id:e.id});case 3:n=t.sent,a=[],l=(0,r.Z)(n);try{for(l.s();!(i=l.n()).done;)o=i.value,a.push({id:o.id,lemma_id:null})}catch(s){l.e(s)}finally{l.f()}if(!(a.length>0)){t.next=10;break}return t.next=10,c.Q.zettel.save(a);case 10:return t.next=12,c.Q.lemma.delete(e.id);case 12:return e.onClose(),e.onReload(),t.abrupt("return",{status:!0});case 15:case"end":return t.stop()}}),t)})))}):null]})})]})}function _(){return[["lemma_simple","Wort"],["lemma_id","Wort-ID"],["farbe","Farbe"],["id","ID"],["editor","EditorIn"],["comment","Kommentar"],["zettel_sigel","Sigel"]]}function y(e){var t=e.item,n={width:c.Q.options.z_width+"px",height:"100%"},r=null;if(null!=t.img_path){var a="";0===t.in_use?a+="zettel_img no_use":a+="zettel_img in_use",r=(0,p.jsxs)("div",{className:"zettel",id:t.id,style:n,children:[(0,p.jsx)("img",{alt:"",style:{objectFit:"fill",borderRadius:"7px"},className:a,src:"/dom"+t.img_path+".jpg"}),e.showDetail?(0,p.jsxs)("div",{className:"zettel_menu",children:[(0,p.jsx)("span",{style:{float:"left",overflow:"hidden",maxHeight:"50px",maxWidth:"250px"},dangerouslySetInnerHTML:(0,o.rg)(t.lemma_display)}),(0,p.jsx)("span",{style:{float:"right"},dangerouslySetInnerHTML:(0,o.rg)(t.zettel_sigel)})]}):null]})}else r=(0,p.jsx)("div",{className:"zettel",id:t.id,style:n,children:(0,p.jsxs)("div",{className:"digitalZettel",children:[(0,p.jsx)("div",{className:"digitalZettelLemma",dangerouslySetInnerHTML:(0,o.rg)(t.lemma_display)}),(0,p.jsx)("div",{className:"digitalZettelWork",dangerouslySetInnerHTML:(0,o.rg)(t.zettel_sigel)}),(0,p.jsx)("div",{className:"digitalZettelText",dangerouslySetInnerHTML:(0,o.rg)(t.txt)})]})});return r}function w(){return[[1,"Wort","lemma_id",!0],[2,"Sigel","konkordanz_id",!0]]}function S(e){switch(e.batchType){case 1:return(0,p.jsx)(o.Qc,{onChange:function(t,n){e.setBatchValue(t),e.setBatchValueId(n)},value:e.batchValue,tbl:"lemma",searchCol:"ac_w",returnCol:"ac_w"});case 2:return(0,p.jsx)(o.Qc,{value:e.batchValue,tbl:"konkordanz",searchCol:"zettel_sigel",returnCol:"zettel_sigel",onChange:function(t,n){e.setBatchValue(t),e.setBatchValueId(n)}});default:return(0,p.jsx)("div",{style:{color:"red"},children:"Unbekannter Stapel-Typ!"})}}function C(e){var t=(0,d.useState)(e.newLemma),n=(0,l.Z)(t,2),r=n[0],a=n[1],i=(0,d.useState)(e.newLemmaDisplay),s=(0,l.Z)(i,2),c=s[0],u=s[1],x=(0,d.useState)(0),g=(0,l.Z)(x,2),b=g[0],f=g[1],j=(0,d.useState)("gelb"),v=(0,l.Z)(j,2),Z=v[0],k=v[1],_=(0,d.useState)(""),y=(0,l.Z)(_,2),w=y[0],S=y[1],C=(0,d.useState)(null),F=(0,l.Z)(C,2),z=F[0],I=F[1],E=(0,d.useState)(0),N=(0,l.Z)(E,2),L=N[0],B=N[1],A=(0,d.useState)(0),D=(0,l.Z)(A,2),W=D[0],Q=D[1],M=(0,d.useState)(0),H=(0,l.Z)(M,2),T=H[0],O=H[1],R=(0,d.useState)(0),V=(0,l.Z)(R,2),K=V[0],J=V[1],U=(0,d.useState)(""),G=(0,l.Z)(U,2),P=G[0],Y=G[1],$=(0,d.useState)(!1),q=(0,l.Z)($,2),X=q[0],ee=q[1],te=(0,d.useState)(!1),ne=(0,l.Z)(te,2),re=ne[0],ae=ne[1],le=["blau","t\xfcrkis","lila"];return(0,d.useEffect)((function(){e.setLemmaObject({lemma:r,lemma_simple:c,nr:b>0?b:null,farbe:Z,reference_id:le.includes(Z)?z:null,normgraphie:L,dom_normgraphie:W,verworfen:T,unsicher:K,comment:""!==P?P:null}),ee(""===r),ae(""===c),""===r||r.indexOf(" ")>-1||""===c?e.setNewLemmaOK(!1):e.setNewLemmaOK(!0)}),[r,c,b,Z,w,L,W,T,K,P]),(0,p.jsxs)(p.Fragment,{children:[(0,p.jsxs)(m.Z,{className:"mb-2",children:[(0,p.jsx)(h.Z,{children:"Wort:"}),(0,p.jsx)(h.Z,{children:(0,p.jsx)("input",{type:"text",className:X?"invalidInput":null,value:r,onChange:function(e){a(e.target.value)}})})]}),(0,p.jsxs)(m.Z,{className:"mb-2",children:[(0,p.jsxs)(h.Z,{children:["Wort: ",(0,p.jsx)("small",{children:"(ohne Sonderzeichen)"})]}),(0,p.jsx)(h.Z,{children:(0,p.jsx)("input",{type:"text",className:re?"invalidInput":null,value:c,onChange:function(e){u(e.target.value)}})})]}),(0,p.jsxs)(m.Z,{children:[(0,p.jsx)(h.Z,{children:"Farbe:"}),(0,p.jsx)(h.Z,{children:(0,p.jsx)(o.SA,{options:[["gelb","gelb"],["gr\xfcn","gr\xfcn"],["rot","rot"],["blau","blau"],["lila","lila"],["t\xfcrkis","t\xfcrkis"]],onChange:function(e){k(e.target.value)}})})]}),le.includes(Z)?(0,p.jsxs)(m.Z,{className:"mt-2",children:[(0,p.jsx)(h.Z,{children:"Referenz:"}),(0,p.jsx)(h.Z,{children:(0,p.jsx)(o.Qc,{onChange:function(e,t){S(e),I(t)},tbl:"lemma",col:"ac_w"})})]}):null,(0,p.jsxs)(m.Z,{className:"mt-4 mb-2",children:[(0,p.jsx)(h.Z,{children:"Zahlzeichen:"}),(0,p.jsx)(h.Z,{children:(0,p.jsx)(o.SA,{options:[[0,""],[1,1],[2,2],[3,3],[4,4],[5,5],[6,6]],onChange:function(e){f(e.target.value)}})})]}),(0,p.jsxs)(m.Z,{className:"mb-2",children:[(0,p.jsx)(h.Z,{children:"Normgraphie:"}),(0,p.jsx)(h.Z,{children:(0,p.jsx)(o.SA,{options:[[0,"Nein"],[1,"Ja"]],onChange:function(e){B(e.target.value)}})})]}),(0,p.jsxs)(m.Z,{className:"mb-2",children:[(0,p.jsx)(h.Z,{children:"DOM-Normgraphie:"}),(0,p.jsx)(h.Z,{children:(0,p.jsx)(o.SA,{options:[[0,"Nein"],[1,"Ja"]],onChange:function(e){Q(e.target.value)}})})]}),(0,p.jsxs)(m.Z,{className:"mb-2",children:[(0,p.jsx)(h.Z,{children:"verworfen:"}),(0,p.jsx)(h.Z,{children:(0,p.jsx)(o.SA,{options:[[0,"Nein"],[1,"Ja"]],onChange:function(e){O(e.target.value)}})})]}),(0,p.jsxs)(m.Z,{className:"mb-2",children:[(0,p.jsx)(h.Z,{children:"unsicher:"}),(0,p.jsx)(h.Z,{children:(0,p.jsx)(o.SA,{options:[[0,"Nein"],[1,"Ja"]],onChange:function(e){J(e.target.value)}})})]}),(0,p.jsxs)(m.Z,{className:"mb-4",children:[(0,p.jsx)(h.Z,{children:"Kommentar:"}),(0,p.jsx)(h.Z,{children:(0,p.jsx)("textarea",{onChange:function(e){Y(e.target.value)},style:{resize:"false",width:"97%"},value:P})})]})]})}function F(e){var t=(0,d.useState)(e.item.ac_w),n=(0,l.Z)(t,2),r=n[0],i=n[1],u=(0,d.useState)(e.item.lemma_id),x=(0,l.Z)(u,2),g=x[0],b=x[1],f=(0,d.useState)(e.item.zettel_sigel),j=(0,l.Z)(f,2),v=j[0],Z=j[1],k=(0,d.useState)(e.item.konkordanz_id),_=(0,l.Z)(k,2),y=_[0],w=_[1],S=(0,d.useState)(e.item.txt),C=(0,l.Z)(S,2),F=C[0],z=C[1],I=(0,d.useState)(null),E=(0,l.Z)(I,2),N=E[0],L=E[1];return(0,d.useEffect)((function(){var e=function(){var e=(0,a.Z)(s().mark((function e(){var t,n;return s().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,c.Q.konkordanz.get({id:y},{select:["opera_id"]});case 2:if(!((t=e.sent).length>0)){e.next=11;break}return e.next=6,c.Q.opera.get({id:t[0].opera_id});case 6:n=e.sent,console.log(n),n.length>0?L(n[0]):L(null),e.next=12;break;case 11:L(null);case 12:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}();y>0?e():L(null)}),[y]),(0,d.useEffect)((function(){i(e.item.ac_w),b(e.item.lemma_id),Z(e.item.zettel_sigel),w(e.item.konkordanz_id),z(e.item.txt)}),[e.item.id]),(0,d.useEffect)((function(){e.setZettelObject({id:e.item.id,lemma_id:g>0?g:null,konkordanz_id:y>0?y:null,txt:F})}),[F,g,y]),(0,d.useEffect)((function(){e.setLemma(r)}),[r]),(0,p.jsxs)(p.Fragment,{children:[(0,p.jsxs)(m.Z,{className:"mb-2",children:[(0,p.jsx)(h.Z,{xs:4,children:"Wort:"}),(0,p.jsx)(h.Z,{children:(0,p.jsx)(o.Qc,{classList:"onOpenSetFocus",style:{width:"100%"},onChange:function(e,t){i(e),b(t)},value:r||"",tbl:"lemma",searchCol:"ac_w",returnCol:"ac_w"})})]}),(0,p.jsxs)(m.Z,{className:"mb-2",children:[(0,p.jsx)(h.Z,{xs:4,children:"Sigel:"}),(0,p.jsx)(h.Z,{children:(0,p.jsx)(o.Qc,{style:{width:"100%"},value:v||"",tbl:"konkordanz",searchCol:"zettel_sigel",returnCol:"zettel_sigel",onChange:function(){var e=(0,a.Z)(s().mark((function e(t,n){return s().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:Z(t),w(n);case 2:case"end":return e.stop()}}),e)})));return function(t,n){return e.apply(this,arguments)}}()})})]}),N?(0,p.jsx)(m.Z,{children:(0,p.jsx)(h.Z,{children:(0,p.jsxs)("small",{children:[(0,p.jsx)("b",{children:N.sigel})," = ",(0,p.jsx)("span",{dangerouslySetInnerHTML:(0,o.rg)(N.werk)})]})})}):null,null===e.item.img_path&&(0,p.jsxs)(m.Z,{className:"mb-2",children:[(0,p.jsx)(h.Z,{xs:4,children:"Text:"}),(0,p.jsx)(h.Z,{children:(0,p.jsx)("textarea",{style:{width:"100%"},value:F,onChange:function(e){z(e.target.value)}})})]})]})}function z(){return{txt:"Neuer Zettel"}}function I(){return["img_path","zettel_sigel","lemma_display","txt"]}function E(){return null}function N(){return[['["id"]',"ID"],['["lemma_simple"]',"Lemma"]]}function L(e){return(0,p.jsxs)(p.Fragment,{children:[(0,p.jsx)(x.Z.Item,{onClick:function(t){e.loadMain(t,"konkordanz")},children:"Konkordanz"}),(0,p.jsx)(x.Z.Item,{onClick:function(t){e.loadMain(t,"quellenverzeichnis")},children:"Quellenverzeichnis"}),(0,p.jsx)(x.Z.Item,{onClick:function(t){e.loadMain(t,"etudaus")},children:"Etudaus"}),(0,p.jsx)(x.Z.Item,{onClick:function(t){e.loadMain(t,"domressource")},children:"Ressourcen"})]})}function B(e){var t=[["neuer Eintrag",function(){var e=(0,a.Z)(s().mark((function e(t){var n;return s().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(!window.confirm("Soll ein neuer Eintrag erstellt werden?")){e.next=5;break}return e.next=3,c.Q.opera.save({sigel:"neues Werk"});case 3:n=e.sent,t.setState({newItemCreated:[{id:0,c:"id",o:"=",v:n}]});case 5:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}()]];return(0,p.jsx)(o.HA,{tblName:"opera",searchOptions:[["sigel","Sigel"],["id","ID"],["konkordanz_count","verknpft. Konk."]],sortOptions:[['["id"]',"ID"],['["sigel"]',"Sigel"]],menuItems:t,tblRow:function(e){return(0,p.jsxs)(p.Fragment,{children:[(0,p.jsx)("td",{title:"ID: "+e.cEl.id,dangerouslySetInnerHTML:(0,o.rg)(e.cEl.sigel)}),(0,p.jsx)("td",{dangerouslySetInnerHTML:(0,o.rg)(e.cEl.werk)}),(0,p.jsxs)("td",{className:"minorTxt",children:[e.cEl.bibgrau&&(0,p.jsx)("p",{dangerouslySetInnerHTML:(0,o.rg)(e.cEl.bibgrau)}),e.cEl.bibvoll&&(0,p.jsx)("p",{dangerouslySetInnerHTML:(0,o.rg)(e.cEl.bibvoll)}),e.cEl.bibzusatz&&(0,p.jsx)("p",{dangerouslySetInnerHTML:(0,o.rg)(e.cEl.bibzusatz)})]}),(0,p.jsx)("td",{style:{textAlign:"right"},children:e.cEl.konkordanz_count})]})},tblHeader:(0,p.jsxs)(p.Fragment,{children:[(0,p.jsx)("th",{children:"Sigel"}),(0,p.jsx)("th",{children:"Titel der Quelle"}),(0,p.jsx)("th",{children:"Bibliographie"}),(0,p.jsx)("th",{children:"verknpft. Konkordanz-Eintr\xe4ge"})]}),asideContent:[{caption:"dol-ID",type:"text",col:"db_id"},{caption:"Sigel",type:"text",col:"sigel"},{caption:"Quelle",type:"text",col:"werk"},{caption:"Bib-Grau",type:"text",col:"bibgrau"},{caption:"Bib-Zusatz",type:"text",col:"bibzusatz"},{caption:"Bib-Voll",type:"text",col:"bibvoll"}]})}function A(e){var t=[["neuer Eintrag",function(){var e=(0,a.Z)(s().mark((function e(t){var n;return s().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(!window.confirm("Soll ein neuer Eintrag erstellt werden?")){e.next=5;break}return e.next=3,c.Q.konkordanz.save({zettel_sigel:"neuer Verweis"});case 3:n=e.sent,t.setState({newItemCreated:[{id:0,c:"id",o:"=",v:n}]});case 5:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}()]];return(0,p.jsx)(o.HA,{tblName:"konkordanz",searchOptions:[["zettel_sigel","Sigel"],["id","ID"],["opera_id","Werk-ID"]],sortOptions:[['["id"]',"ID"],['["zettel_sigel"]',"Sigel"]],menuItems:t,tblRow:function(e){return(0,p.jsxs)(p.Fragment,{children:[(0,p.jsx)("td",{title:"ID: "+e.cEl.id,dangerouslySetInnerHTML:(0,o.rg)(e.cEl.zettel_sigel)}),(0,p.jsx)("td",{children:e.cEl.comment}),(0,p.jsx)("td",{children:e.cEl.opera_id&&(0,p.jsxs)("span",{children:[e.cEl.opera," ",(0,p.jsxs)("i",{className:"minorTxt",children:["(ID: ",e.cEl.opera_id,")"]})]})})]})},tblHeader:(0,p.jsxs)(p.Fragment,{children:[(0,p.jsx)("th",{children:"Angabe auf Zettel"}),(0,p.jsx)("th",{children:"Bemerkung"}),(0,p.jsx)("th",{children:"Quelle"})]}),asideContent:[{caption:"Zettel-Sigel",type:"text",col:"zettel_sigel"},{caption:"verknpft. Quelle",type:"auto",col:["sigel","opera_id"],search:{tbl:"opera",sCol:"sigel",rCol:"sigel"}},{caption:"Kommentar",type:"area",col:"comment"}]})}function D(e){var t=[["neuer Eintrag",function(){var e=(0,a.Z)(s().mark((function e(t){var n;return s().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(!window.confirm("Soll ein neuer Eintrag erstellt werden?")){e.next=5;break}return e.next=3,c.Q.etudaus.save({zettel_sigel:"neuer Verweis"});case 3:n=e.sent,t.setState({newItemCreated:[{id:0,c:"id",o:"=",v:n}]});case 5:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}()]];return(0,p.jsx)(o.HA,{tblName:"etudaus",searchOptions:[["sigel","Sigel"],["id","ID"],["opera_id","Werk-ID"],["werk","Quelle"]],sortOptions:[['["id"]',"ID"],['["sigel"]',"Sigel"]],menuItems:t,tblRow:function(e){return(0,p.jsxs)(p.Fragment,{children:[(0,p.jsx)("td",{title:"ID: "+e.cEl.id,dangerouslySetInnerHTML:(0,o.rg)(e.cEl.sigel)}),(0,p.jsx)("td",{dangerouslySetInnerHTML:(0,o.rg)(e.cEl.werk)}),(0,p.jsx)("td",{dangerouslySetInnerHTML:(0,o.rg)(e.cEl.opera)})]})},tblHeader:(0,p.jsxs)(p.Fragment,{children:[(0,p.jsx)("th",{children:"Angabe auf Zettel"}),(0,p.jsx)("th",{children:"Werk"}),(0,p.jsx)("th",{children:"Quelle"})]}),asideContent:[{caption:"Sigel",type:"text",col:"sigel"},{caption:"verknpft. Quelle",type:"auto",col:["opera","opera_id"],search:{tbl:"opera",sCol:"sigel",rCol:"sigel"}},{caption:"Titel der Quelle",type:"area",col:"werk"}]})}function W(e){var t=[["neuer Eintrag",function(){var e=(0,a.Z)(s().mark((function e(t){var n;return s().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(!window.confirm("Soll ein neuer Eintrag erstellt werden?")){e.next=5;break}return e.next=3,c.Q.edition.save({editor:"EditorIn",year:2022});case 3:n=e.sent,t.setState({newItemCreated:[{id:0,c:"id",o:"=",v:n}]});case 5:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}()]],n=[{caption:"EditorIn",type:"text",col:"editor"},{caption:"Jahr",type:"text",col:"year"},{caption:"verknpft. Werk",type:"auto",col:["sigel","opera_id"],search:{tbl:"opera",sCol:"sigel",rCol:"sigel"}},{caption:(0,p.jsxs)("span",{children:["URL ",(0,p.jsx)("small",{children:"(extern)"})]}),type:"text",col:"url"},{caption:(0,p.jsxs)("span",{children:["Pfad ",(0,p.jsx)("small",{children:"(auf dem Server)"})]}),type:"text",col:"path"},{caption:"Kommentar",type:"area",col:"comment"},{caption:"Seiten-verh\xe4ltnis",type:"text",col:"aspect_ratio"}];return(0,p.jsx)(o.HA,{tblName:"edition",searchOptions:[["id","ID"],["editor","EditorIn"],["year","Jahr"]],sortOptions:[['["id"]',"ID"]],menuItems:t,tblRow:function(e){return(0,p.jsxs)(p.Fragment,{children:[(0,p.jsxs)("td",{title:"ID: "+e.cEl.id,children:[e.cEl.editor," ",e.cEl.year]}),(0,p.jsxs)("td",{children:[e.cEl.sigel," ",(0,p.jsxs)("small",{children:["(ID ",e.cEl.opera_id,")"]})]})]})},tblHeader:(0,p.jsxs)(p.Fragment,{children:[(0,p.jsx)("th",{children:"K\xfcrzel"}),(0,p.jsx)("th",{children:"verknpft. Werk"})]}),asideContent:n})}var Q=function(){var e=(0,a.Z)(s().mark((function e(){var t;return s().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,c.Q.lemma.getAll({select:["id","lemma_display","lemma_simple","nr","farbe"],order:["lemma_simple"]});case 2:return t=(t=e.sent).map((function(e){var t='<span style="color: '.concat(j[e.farbe],'">').concat(e.lemma_display,"</span>");return{id:e.id,lemma_display:t,lemma:e.lemma_simple?e.lemma_simple.toLowerCase():""}})),e.abrupt("return",t);case 5:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}();function M(e){var t=(0,d.useState)(null),n=(0,l.Z)(t,2),r=n[0],i=n[1],u=(0,d.useState)(null),m=(0,l.Z)(u,2),h=m[0],x=m[1];return(0,d.useEffect)((function(){var t=function(){var t=(0,a.Z)(s().mark((function t(){var n,r;return s().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,c.Q.lemma.get({id:e.lemma_id});case 2:return n=t.sent,i(n[0]),t.next=6,c.Q.zettel.get({lemma_id:e.lemma_id});case 6:r=t.sent,x(r);case 8:case"end":return t.stop()}}),t)})));return function(){return t.apply(this,arguments)}}();i(null),x(null),t()}),[e.lemma_id]),r?(0,p.jsxs)(p.Fragment,{children:[(0,p.jsxs)("h1",{children:[(0,p.jsx)("span",{dangerouslySetInnerHTML:(0,o.rg)(r.lemma_display)}),(0,p.jsxs)("small",{style:{fontSize:"40%",marginLeft:"10px"},children:["(ID ",r.id,")"]})]}),(0,p.jsx)("div",{children:r.URL?(0,p.jsx)("a",{href:"https://dom-en-ligne.de/"+r.URL,target:"_blank",children:"zum Artikel"}):(0,p.jsx)("span",{children:"Kein Artikel verf\xfcgbar."})}),(0,p.jsx)("div",{children:null!==h?0===h.length?(0,p.jsx)("span",{children:"Keine Zettel mit diesem Lemma verkn\xfcpft!"}):h.map((function(e){return(0,p.jsxs)("div",{children:[(0,p.jsx)("div",{children:(0,p.jsx)("img",{style:{width:c.Q.options.z_width},src:"https://dienste.badw.de:9999/dom"+e.img_path+".jpg"})}),(0,p.jsxs)("div",{children:[e.opera," (",e.id,")"]})]},e.id)})):(0,p.jsx)("span",{children:"Zettel werden geladen..."})})]}):(0,p.jsx)("div",{children:"Daten werden geladen..."})}function H(e){var t=null;switch(e.name){case"lemma_letter":case"zettel_letter":t=(0,p.jsxs)("div",{style:{marginBottom:"80px",margin:"auto",width:"70%",height:"600px"},children:[(0,p.jsx)("h4",{children:"nach Buchstaben"}),(0,p.jsx)(g.$Q,{options:{plugins:{legend:{display:!1,position:"bottom"}},scales:{x:{stacked:!0},y:{stacked:!0}}},data:{labels:["A","B","C","D","E","F","G","H","I","K","L","M","N","O","P","Q","R","S","T","U","V","X","Y","Z"],datasets:[{label:"blau",data:e.data[0],backgroundColor:j.blau,borderColor:j.blau,borderWidth:1},{label:"lila",data:e.data[1],backgroundColor:j.lila,borderColor:j.lila,borderWidth:1},{label:"t\xfcrkis",data:e.data[2],backgroundColor:j["t\xfcrkis"],borderColor:j["t\xfcrkis"],borderWidth:1},{label:"rot",data:e.data[3],backgroundColor:j.rot,borderColor:j.rot,borderWidth:1},{label:"gr\xfcn",data:e.data[4],backgroundColor:j["gr\xfcn"],borderColor:j["gr\xfcn"],borderWidth:1},{label:"gelb",data:e.data[5],backgroundColor:j.gelb,borderColor:j.gelb,borderWidth:1}]}})]});break;case"lemma_farbe":t=(0,p.jsxs)("div",{style:{margin:"auto",marginBottom:"80px",width:"450px",height:"450px"},children:[(0,p.jsx)("h4",{children:"nach Farbe"}),(0,p.jsx)(g.by,{options:{plugins:{legend:{display:!0,position:"bottom"}}},data:{labels:["blau","gelb","gr\xfcn","lila","rot","t\xfcrkis","keine"],datasets:[{label:"",data:e.data,backgroundColor:[j.blau,j.gelb,j["gr\xfcn"],j.lila,j.rot,j["t\xfcrkis"],"#EAF2F3"],borderColor:[j.blau,j.gelb,j["gr\xfcn"],j.lila,j.rot,j["t\xfcrkis"],"#EAF2F3"],borderWidth:1}]}})]});break;case"zettel_process":t=(0,p.jsxs)("div",{style:{margin:"auto",marginBottom:"80px",width:"450px",height:"450px"},children:[(0,p.jsx)("h4",{children:"nach Bearbeitungsstand"}),(0,p.jsx)(g.by,{options:{plugins:{legend:{position:"bottom"}}},data:{labels:["abgeschlossen","nur Lemma","unbearbeitet"],datasets:[{label:"# of Votes",data:e.data,backgroundColor:["#114B79","#347F9F","#EAF2F3"],borderColor:["#1B3B6F","#065A82","#E8F1F2"],borderWidth:1}]}})]});break;case"zettel_type":t=(0,p.jsxs)("div",{style:{margin:"auto",marginBottom:"80px",width:"450px",height:"450px"},children:[(0,p.jsx)("h4",{children:"nach Farbe"}),(0,p.jsx)(g.by,{options:{plugins:{legend:{position:"bottom"}}},data:{labels:["blau","gelb","gr\xfcn","lila","rot","t\xfcrkis","keine"],datasets:[{label:"# of Votes",data:e.data,backgroundColor:[j.blau,j.gelb,j["gr\xfcn"],j.lila,j.rot,j["t\xfcrkis"],"#EAF2F3"],borderColor:[j.blau,j.gelb,j["gr\xfcn"],j.lila,j.rot,j["t\xfcrkis"],"#EAF2F3"],borderWidth:1}]}})]});break;case"zettel_created_changed":t=(0,p.jsxs)("div",{style:{marginBottom:"80px",width:"100%",height:"400px"},children:[(0,p.jsx)("h4",{children:"nach Jahren"}),(0,p.jsx)(g.$Q,{options:{aspectRatio:!1,plugins:{legend:{display:!0,position:"bottom"}}},data:{labels:["2021","2022"],datasets:[{label:"ver\xe4ndert",data:e.data[1],backgroundColor:["#114B79"],borderColor:["#114B79"],borderWidth:1,type:"line"},{label:"erstellt",data:e.data[0],backgroundColor:["#347F9F"],borderColor:["#347F9F"],borderWidth:1}]}})]});break;case"zettel_created_changed_current":t=(0,p.jsxs)("div",{style:{marginBottom:"80px",width:"100%",height:"400px"},children:[(0,p.jsx)("h4",{children:"in diesem Jahr"}),(0,p.jsx)(g.$Q,{options:{aspectRatio:!1,plugins:{legend:{display:!0,position:"bottom"}}},data:{labels:["Jan.","Feb.","M\xe4r.","Apr.","Mai","Jun.","Jul.","Aug.","Sep.","Okt.","Nov.","Dez."].slice(0,(new Date).getMonth()+1),datasets:[{label:"ver\xe4ndert",data:e.data[1],backgroundColor:["#114B79"],borderColor:["#114B79"],borderWidth:1,type:"line"},{label:"erstellt",data:e.data[0],backgroundColor:["#347F9F"],borderColor:["#347F9F"],borderWidth:1}]}})]});break;case"ressource_work":t=(0,p.jsxs)("div",{style:{margin:"auto",marginBottom:"80px",width:"450px",height:"450px"},children:[(0,p.jsx)("h4",{children:"Werke nach Volltext und pdfs"}),(0,p.jsx)(g.by,{options:{plugins:{legend:{position:"bottom"}}},data:{labels:["mit Volltext und pdf","nur mit pdf","ohne pdf und Volltext","nicht in Benutzung"],datasets:[{label:"",data:e.data,backgroundColor:["#114B79","#347F9F","#EAF2F3","#FFFFFF"],borderColor:["#1B3B6F","#065A82","#E8F1F2","#EFEFEF"],borderWidth:1}]}})]});break;case"ressource_scans":t=(0,p.jsxs)("div",{style:{margin:"auto",marginBottom:"80px",width:"450px",height:"450px"},children:[(0,p.jsx)("h4",{children:"Scan-Seiten und Volltexte"}),(0,p.jsx)(g.by,{options:{plugins:{legend:{position:"bottom"}}},data:{labels:["gepr\xfcfter Volltext","automatischer Volltext","ohne Volltext","kein lat. Text"],datasets:[{label:"",data:e.data,backgroundColor:["#114B79","#347F9F","#EAF2F3","#FFFFFF"],borderColor:["#1B3B6F","#065A82","#E8F1F2","#EFEFEF"],borderWidth:1}]}})]});break;default:console.log(e.name)}return t}}}]);
//# sourceMappingURL=440.178b2f21.chunk.js.map