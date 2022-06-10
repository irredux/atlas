"use strict";(self.webpackChunkatlas=self.webpackChunkatlas||[]).push([[440],{3440:function(e,t,n){n.r(t),n.d(t,{BatchInputType:function(){return w},DOMOpera:function(){return D},DOMRessource:function(){return Q},Etudaus:function(){return M},IndexBoxDetail:function(){return A},Konkordanz:function(){return H},LemmaAsideContent:function(){return b},LemmaHeader:function(){return f},LemmaRow:function(){return Z},MainMenuContent:function(){return L},ZettelAddLemmaContent:function(){return y},ZettelCard:function(){return k},ZettelSingleContent:function(){return I},arachneTbls:function(){return g},exportZettelObject:function(){return C},fetchIndexBoxData:function(){return T},lemmaSearchItems:function(){return v},newZettelObject:function(){return z},zettelBatchOptions:function(){return _},zettelPresetOptions:function(){return N},zettelSearchItems:function(){return S},zettelSortOptions:function(){return E}});var r=n(7762),i=n(5861),a=n(885),l=n(7757),s=n.n(l),c=n(3222),o=n(6407),u=n(2791),d=n(7022),m=n(9743),h=n(2677),x=n(2354),p=n(184);function g(){return["lemma","work","zettel","user","konkordanz","opera","comment","etudaus","ocr_jobs","edition","statistics"]}function f(){return(0,p.jsxs)("tr",{children:[(0,p.jsx)("th",{width:"30%",children:"Lemma"}),(0,p.jsx)("th",{width:"20%",children:"Farbe"}),(0,p.jsx)("th",{children:"Kommentar"}),(0,p.jsx)("th",{children:"dom en ligne"})]})}var j={gelb:"#E9AB17","gr\xfcn":"green",blau:"#0000A0",rot:"#C11B17",lila:"#4B0082","t\xfcrkis":"#3f888f"};function Z(e){return(0,p.jsxs)("tr",{id:e.lemma.id,onDoubleClick:function(t){e.showDetail(parseInt(t.target.closest("tr").id))},children:[(0,p.jsx)("td",{title:"ID: "+e.lemma.id,children:(0,p.jsx)("a",{dangerouslySetInnerHTML:(0,c.rg)(e.lemma.lemma_display),onClick:function(t){localStorage.setItem("searchBox_zettel",'[[{"id":0,"c":"lemma_id","o":"=","v":'.concat(e.lemma.id,'}],1,["id"]]')),e.loadMain(t)}})}),(0,p.jsx)("td",{style:{color:j[e.lemma.farbe]},children:e.lemma.farbe}),(0,p.jsx)("td",{dangerouslySetInnerHTML:(0,c.rg)(e.lemma.comment)}),(0,p.jsx)("td",{children:e.lemma.URL?(0,p.jsx)("a",{href:"https://dom-en-ligne.de/"+e.lemma.URL,target:"_blank",rel:"noreferrer",children:"zum Artikel"}):null})]})}function v(){return[["lemma","Lemma"],["id","ID"],["farbe","Farbe"],["URL","URL"]]}function b(e){var t=(0,u.useState)(e.item.lemma),n=(0,a.Z)(t,2),l=n[0],x=n[1],g=(0,u.useState)(e.item.lemma_simple),f=(0,a.Z)(g,2),j=f[0],Z=f[1],v=(0,u.useState)(e.item.nr),b=(0,a.Z)(v,2),S=b[0],k=b[1],_=(0,u.useState)(e.item.normgraphie),w=(0,a.Z)(_,2),y=w[0],I=w[1],z=(0,u.useState)(e.item.dom_normgraphie),C=(0,a.Z)(z,2),N=C[0],E=C[1],L=(0,u.useState)(e.item.verworfen),D=(0,a.Z)(L,2),H=D[0],M=D[1],Q=(0,u.useState)(e.item.unsicher),T=(0,a.Z)(Q,2),A=T[0],W=T[1],O=(0,u.useState)(e.item.farbe),B=(0,a.Z)(O,2),F=B[0],R=B[1],K=(0,u.useState)(e.item.comment),J=(0,a.Z)(K,2),V=J[0],U=J[1],G=(0,u.useState)(e.item.reference_id),P=(0,a.Z)(G,2),Y=P[0],q=P[1],X=(0,u.useState)(e.item.reference),$=(0,a.Z)(X,2),ee=$[0],te=$[1];return(0,u.useEffect)((function(){x(e.item.lemma),Z(e.item.lemma_simple),k(e.item.nr),I(e.item.normgraphie),E(e.item.dom_normgraphie),M(e.item.verworfen),W(e.item.unsicher),R(e.item.farbe),U(e.item.comment),q(e.item.reference_id),te(e.item.reference)}),[e.id]),(0,p.jsxs)(d.Z,{children:[(0,p.jsxs)(m.Z,{className:"mb-2",children:[(0,p.jsx)(h.Z,{children:"Wort:"}),(0,p.jsx)(h.Z,{children:(0,p.jsx)("input",{type:"text",value:l,onChange:function(e){x(e.target.value)}})})]}),(0,p.jsxs)(m.Z,{className:"mb-2",children:[(0,p.jsxs)(h.Z,{children:["Wort: ",(0,p.jsx)("small",{children:"(ohne Sonderz.)"})]}),(0,p.jsx)(h.Z,{children:(0,p.jsx)("input",{type:"text",value:j,onChange:function(e){Z(e.target.value)}})})]}),(0,p.jsxs)(m.Z,{className:"mb-2",children:[(0,p.jsx)(h.Z,{children:"Farbe:"}),(0,p.jsx)(h.Z,{children:(0,p.jsx)(c.SA,{options:[["gelb","gelb"],["gr\xfcn","gr\xfcn"],["rot","rot"],["blau","blau"],["lila","lila"],["t\xfcrkis","t\xfcrkis"]],onChange:function(e){R(e.target.value)},value:F})})]}),["blau","t\xfcrkis","lila"].includes(F)?(0,p.jsxs)(m.Z,{children:[(0,p.jsx)(h.Z,{children:"Referenz:"}),(0,p.jsx)(h.Z,{children:(0,p.jsx)(c.Qc,{onChange:function(e,t){te(e),q(t)},tbl:"lemma",col:"ac_w",value:ee})})]}):null,(0,p.jsxs)(m.Z,{className:"mt-4 mb-2",children:[(0,p.jsx)(h.Z,{children:"Homonym-Nr.:"}),(0,p.jsx)(h.Z,{children:(0,p.jsx)("input",{type:"text",value:S,onChange:function(e){k(e.target.value)}})})]}),(0,p.jsxs)(m.Z,{className:"mb-2",children:[(0,p.jsx)(h.Z,{children:"Normgraphie:"}),(0,p.jsx)(h.Z,{children:(0,p.jsx)(c.SA,{options:[[0,"Nein"],[1,"Ja"]],onChange:function(e){I(e.target.value)},value:y})})]}),(0,p.jsxs)(m.Z,{className:"mb-2",children:[(0,p.jsx)(h.Z,{children:"DOM-Normgraphie:"}),(0,p.jsx)(h.Z,{children:(0,p.jsx)(c.SA,{options:[[0,"Nein"],[1,"Ja"]],onChange:function(e){E(e.target.value)},value:N})})]}),(0,p.jsxs)(m.Z,{className:"mb-2",children:[(0,p.jsx)(h.Z,{children:"verworfen:"}),(0,p.jsx)(h.Z,{children:(0,p.jsx)(c.SA,{options:[[0,"Nein"],[1,"Ja"]],onChange:function(e){M(e.target.value)},value:H})})]}),(0,p.jsxs)(m.Z,{className:"mb-2",children:[(0,p.jsx)(h.Z,{children:"unsicher:"}),(0,p.jsx)(h.Z,{children:(0,p.jsx)(c.SA,{options:[[0,"Nein"],[1,"Ja"]],onChange:function(e){W(e.target.value)},value:A})})]}),(0,p.jsxs)(m.Z,{className:"mb-4",children:[(0,p.jsx)(h.Z,{children:"Kommentar:"}),(0,p.jsx)(h.Z,{children:(0,p.jsx)("textarea",{onChange:function(e){U(e.target.value)},style:{resize:"false",width:"97%"},value:V})})]}),(0,p.jsx)(m.Z,{children:(0,p.jsxs)(h.Z,{children:[(0,p.jsx)(c.YG,{value:"speichern",onClick:(0,i.Z)(s().mark((function t(){var n;return s().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(""!==l){t.next=4;break}return t.abrupt("return",{status:!1,error:"Bitte ein g\xfcltiges Wort eintragen!"});case 4:if(""!==j){t.next=8;break}return t.abrupt("return",{status:!1,error:"Bitte tragen Sie eine g\xfcltiges Wort (ohne Sonderzeichen) ein!"});case 8:return n={id:e.id,lemma:l,lemma_simple:j,reference_id:Y,normgraphie:y,dom_normgraphie:N,verworfen:H,unsicher:A,farbe:F,comment:V},isNaN(S)||(n.nr=S),t.next=12,o.Q.lemma.save(n);case 12:return e.onUpdate(e.id),t.abrupt("return",{status:!0});case 14:case"end":return t.stop()}}),t)})))}),o.Q.access("l_edit")?(0,p.jsx)(c.YG,{style:{marginLeft:"10px"},variant:"danger",value:"l\xf6schen",onClick:(0,i.Z)(s().mark((function t(){var n,i,a,l,c;return s().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(!window.confirm("Soll das Wort gel\xf6scht werden? Das Wort wird von allen verkn\xfcpften Zettel entfernt. Dieser Schritt kann nicht r\xfcckg\xe4ngig gemacht werden!")){t.next=15;break}return t.next=3,o.Q.zettel.get({lemma_id:e.id});case 3:n=t.sent,i=[],a=(0,r.Z)(n);try{for(a.s();!(l=a.n()).done;)c=l.value,i.push({id:c.id,lemma_id:null})}catch(s){a.e(s)}finally{a.f()}if(!(i.length>0)){t.next=10;break}return t.next=10,o.Q.zettel.save(i);case 10:return t.next=12,o.Q.lemma.delete(e.id);case 12:return e.onClose(),e.onReload(),t.abrupt("return",{status:!0});case 15:case"end":return t.stop()}}),t)})))}):null]})})]})}function S(){return[["lemma_simple","Wort"],["lemma_id","Wort-ID"],["farbe","Farbe"],["id","ID"],["editor","EditorIn"],["comment","Kommentar"],["zettel_sigel","Sigel"]]}function k(e){var t=e.item,n={width:o.Q.options.z_width+"px",height:"100%"},r=null;if(null!=t.img_path){var i="";0===t.in_use?i+="zettel_img no_use":i+="zettel_img in_use",r=(0,p.jsxs)("div",{className:"zettel",id:t.id,style:n,children:[(0,p.jsx)("img",{alt:"",style:{objectFit:"fill",borderRadius:"7px"},className:i,src:t.img_path+".jpg"}),e.showDetail?(0,p.jsxs)("div",{className:"zettel_menu",children:[(0,p.jsx)("span",{style:{float:"left",overflow:"hidden",maxHeight:"50px",maxWidth:"250px"},dangerouslySetInnerHTML:(0,c.rg)(t.lemma_display)}),(0,p.jsx)("span",{style:{float:"right"},dangerouslySetInnerHTML:(0,c.rg)(t.zettel_sigel)})]}):null]})}else r=(0,p.jsx)("div",{className:"zettel",id:t.id,style:n,children:(0,p.jsxs)("div",{className:"digitalZettel",children:[(0,p.jsx)("div",{className:"digitalZettelLemma",dangerouslySetInnerHTML:(0,c.rg)(t.lemma_display)}),(0,p.jsx)("div",{className:"digitalZettelWork",dangerouslySetInnerHTML:(0,c.rg)(t.zettel_sigel)}),(0,p.jsx)("div",{className:"digitalZettelText",dangerouslySetInnerHTML:(0,c.rg)(t.txt)})]})});return r}function _(){return[[1,"Wort","lemma_id",!0],[2,"Sigel","konkordanz_id",!0]]}function w(e){switch(e.batchType){case 1:return(0,p.jsx)(c.Qc,{onChange:function(t,n){e.setBatchValue(t),e.setBatchValueId(n)},value:e.batchValue,tbl:"lemma",searchCol:"ac_w",returnCol:"ac_w"});case 2:return(0,p.jsx)(c.Qc,{value:e.batchValue,tbl:"konkordanz",searchCol:"zettel_sigel",returnCol:"zettel_sigel",onChange:function(t,n){e.setBatchValue(t),e.setBatchValueId(n)}});default:return(0,p.jsx)("div",{style:{color:"red"},children:"Unbekannter Stapel-Typ!"})}}function y(e){var t=(0,u.useState)(e.newLemma),n=(0,a.Z)(t,2),r=n[0],i=n[1],l=(0,u.useState)(e.newLemmaDisplay),s=(0,a.Z)(l,2),o=s[0],d=s[1],x=(0,u.useState)(0),g=(0,a.Z)(x,2),f=g[0],j=g[1],Z=(0,u.useState)("gelb"),v=(0,a.Z)(Z,2),b=v[0],S=v[1],k=(0,u.useState)(""),_=(0,a.Z)(k,2),w=_[0],y=_[1],I=(0,u.useState)(null),z=(0,a.Z)(I,2),C=z[0],N=z[1],E=(0,u.useState)(0),L=(0,a.Z)(E,2),D=L[0],H=L[1],M=(0,u.useState)(0),Q=(0,a.Z)(M,2),T=Q[0],A=Q[1],W=(0,u.useState)(0),O=(0,a.Z)(W,2),B=O[0],F=O[1],R=(0,u.useState)(0),K=(0,a.Z)(R,2),J=K[0],V=K[1],U=(0,u.useState)(""),G=(0,a.Z)(U,2),P=G[0],Y=G[1],q=(0,u.useState)(!1),X=(0,a.Z)(q,2),$=X[0],ee=X[1],te=(0,u.useState)(!1),ne=(0,a.Z)(te,2),re=ne[0],ie=ne[1],ae=["blau","t\xfcrkis","lila"];return(0,u.useEffect)((function(){e.setLemmaObject({lemma:r,lemma_simple:o,nr:f>0?f:null,farbe:b,reference_id:ae.includes(b)?C:null,normgraphie:D,dom_normgraphie:T,verworfen:B,unsicher:J,comment:""!==P?P:null}),ee(""===r),ie(""===o),""===r||r.indexOf(" ")>-1||""===o?e.setNewLemmaOK(!1):e.setNewLemmaOK(!0)}),[r,o,f,b,w,D,T,B,J,P]),(0,p.jsxs)(p.Fragment,{children:[(0,p.jsxs)(m.Z,{className:"mb-2",children:[(0,p.jsx)(h.Z,{children:"Wort:"}),(0,p.jsx)(h.Z,{children:(0,p.jsx)("input",{type:"text",className:$?"invalidInput":null,value:r,onChange:function(e){i(e.target.value)}})})]}),(0,p.jsxs)(m.Z,{className:"mb-2",children:[(0,p.jsxs)(h.Z,{children:["Wort: ",(0,p.jsx)("small",{children:"(ohne Sonderzeichen)"})]}),(0,p.jsx)(h.Z,{children:(0,p.jsx)("input",{type:"text",className:re?"invalidInput":null,value:o,onChange:function(e){d(e.target.value)}})})]}),(0,p.jsxs)(m.Z,{children:[(0,p.jsx)(h.Z,{children:"Farbe:"}),(0,p.jsx)(h.Z,{children:(0,p.jsx)(c.SA,{options:[["gelb","gelb"],["gr\xfcn","gr\xfcn"],["rot","rot"],["blau","blau"],["lila","lila"],["t\xfcrkis","t\xfcrkis"]],onChange:function(e){S(e.target.value)}})})]}),ae.includes(b)?(0,p.jsxs)(m.Z,{className:"mt-2",children:[(0,p.jsx)(h.Z,{children:"Referenz:"}),(0,p.jsx)(h.Z,{children:(0,p.jsx)(c.Qc,{onChange:function(e,t){y(e),N(t)},tbl:"lemma",col:"ac_w"})})]}):null,(0,p.jsxs)(m.Z,{className:"mt-4 mb-2",children:[(0,p.jsx)(h.Z,{children:"Zahlzeichen:"}),(0,p.jsx)(h.Z,{children:(0,p.jsx)(c.SA,{options:[[0,""],[1,1],[2,2],[3,3],[4,4],[5,5],[6,6]],onChange:function(e){j(e.target.value)}})})]}),(0,p.jsxs)(m.Z,{className:"mb-2",children:[(0,p.jsx)(h.Z,{children:"Normgraphie:"}),(0,p.jsx)(h.Z,{children:(0,p.jsx)(c.SA,{options:[[0,"Nein"],[1,"Ja"]],onChange:function(e){H(e.target.value)}})})]}),(0,p.jsxs)(m.Z,{className:"mb-2",children:[(0,p.jsx)(h.Z,{children:"DOM-Normgraphie:"}),(0,p.jsx)(h.Z,{children:(0,p.jsx)(c.SA,{options:[[0,"Nein"],[1,"Ja"]],onChange:function(e){A(e.target.value)}})})]}),(0,p.jsxs)(m.Z,{className:"mb-2",children:[(0,p.jsx)(h.Z,{children:"verworfen:"}),(0,p.jsx)(h.Z,{children:(0,p.jsx)(c.SA,{options:[[0,"Nein"],[1,"Ja"]],onChange:function(e){F(e.target.value)}})})]}),(0,p.jsxs)(m.Z,{className:"mb-2",children:[(0,p.jsx)(h.Z,{children:"unsicher:"}),(0,p.jsx)(h.Z,{children:(0,p.jsx)(c.SA,{options:[[0,"Nein"],[1,"Ja"]],onChange:function(e){V(e.target.value)}})})]}),(0,p.jsxs)(m.Z,{className:"mb-4",children:[(0,p.jsx)(h.Z,{children:"Kommentar:"}),(0,p.jsx)(h.Z,{children:(0,p.jsx)("textarea",{onChange:function(e){Y(e.target.value)},style:{resize:"false",width:"97%"},value:P})})]})]})}function I(e){var t=(0,u.useState)(e.item.ac_w),n=(0,a.Z)(t,2),r=n[0],l=n[1],d=(0,u.useState)(e.item.lemma_id),x=(0,a.Z)(d,2),g=x[0],f=x[1],j=(0,u.useState)(e.item.zettel_sigel),Z=(0,a.Z)(j,2),v=Z[0],b=Z[1],S=(0,u.useState)(e.item.konkordanz_id),k=(0,a.Z)(S,2),_=k[0],w=k[1],y=(0,u.useState)(e.item.txt),I=(0,a.Z)(y,2),z=I[0],C=I[1],N=(0,u.useState)(null),E=(0,a.Z)(N,2),L=E[0],D=E[1];return(0,u.useEffect)((function(){var e=function(){var e=(0,i.Z)(s().mark((function e(){var t,n;return s().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,o.Q.konkordanz.get({id:_},{select:["opera_id"]});case 2:if(!((t=e.sent).length>0)){e.next=11;break}return e.next=6,o.Q.opera.get({id:t[0].opera_id});case 6:n=e.sent,console.log(n),n.length>0?D(n[0]):D(null),e.next=12;break;case 11:D(null);case 12:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}();_>0?e():D(null)}),[_]),(0,u.useEffect)((function(){l(e.item.ac_w),f(e.item.lemma_id),b(e.item.zettel_sigel),w(e.item.konkordanz_id),C(e.item.txt)}),[e.item.id]),(0,u.useEffect)((function(){e.setZettelObject({id:e.item.id,lemma_id:g>0?g:null,konkordanz_id:_>0?_:null,txt:z})}),[z,g,_]),(0,u.useEffect)((function(){e.setLemma(r)}),[r]),(0,p.jsxs)(p.Fragment,{children:[(0,p.jsxs)(m.Z,{className:"mb-2",children:[(0,p.jsx)(h.Z,{xs:4,children:"Wort:"}),(0,p.jsx)(h.Z,{children:(0,p.jsx)(c.Qc,{classList:"onOpenSetFocus",style:{width:"100%"},onChange:function(e,t){l(e),f(t)},value:r||"",tbl:"lemma",searchCol:"ac_w",returnCol:"ac_w"})})]}),(0,p.jsxs)(m.Z,{className:"mb-2",children:[(0,p.jsx)(h.Z,{xs:4,children:"Sigel:"}),(0,p.jsx)(h.Z,{children:(0,p.jsx)(c.Qc,{style:{width:"100%"},value:v||"",tbl:"konkordanz",searchCol:"zettel_sigel",returnCol:"zettel_sigel",onChange:function(){var e=(0,i.Z)(s().mark((function e(t,n){return s().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:b(t),w(n);case 2:case"end":return e.stop()}}),e)})));return function(t,n){return e.apply(this,arguments)}}()})})]}),L?(0,p.jsx)(m.Z,{children:(0,p.jsx)(h.Z,{children:(0,p.jsxs)("small",{children:[(0,p.jsx)("b",{children:L.sigel})," = ",(0,p.jsx)("span",{dangerouslySetInnerHTML:(0,c.rg)(L.werk)})]})})}):null,null===e.item.img_path&&(0,p.jsxs)(m.Z,{className:"mb-2",children:[(0,p.jsx)(h.Z,{xs:4,children:"Text:"}),(0,p.jsx)(h.Z,{children:(0,p.jsx)("textarea",{style:{width:"100%"},value:z,onChange:function(e){C(e.target.value)}})})]})]})}function z(){return{txt:"Neuer Zettel"}}function C(){return["img_path","zettel_sigel","lemma_display","txt"]}function N(){return null}function E(){return[['["id"]',"ID"],['["lemma_simple"]',"Lemma"]]}function L(e){return(0,p.jsxs)(p.Fragment,{children:[(0,p.jsx)(x.Z.Item,{onClick:function(t){e.loadMain(t,"konkordanz")},children:"Konkordanz"}),(0,p.jsx)(x.Z.Item,{onClick:function(t){e.loadMain(t,"quellenverzeichnis")},children:"Quellenverzeichnis"}),(0,p.jsx)(x.Z.Item,{onClick:function(t){e.loadMain(t,"etudaus")},children:"Etudaus"}),(0,p.jsx)(x.Z.Item,{onClick:function(t){e.loadMain(t,"domressource")},children:"Ressourcen"})]})}function D(e){var t=[["neuer Eintrag",function(){var e=(0,i.Z)(s().mark((function e(t){var n;return s().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(!window.confirm("Soll ein neuer Eintrag erstellt werden?")){e.next=5;break}return e.next=3,o.Q.opera.save({sigel:"neues Werk"});case 3:n=e.sent,t.setState({newItemCreated:[{id:0,c:"id",o:"=",v:n}]});case 5:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}()]];return(0,p.jsx)(c.HA,{tblName:"opera",searchOptions:[["sigel","Sigel"],["id","ID"]],sortOptions:[['["id"]',"ID"],['["sigel"]',"Sigel"]],menuItems:t,tblRow:function(e){return(0,p.jsxs)(p.Fragment,{children:[(0,p.jsx)("td",{title:"ID: "+e.cEl.id,dangerouslySetInnerHTML:(0,c.rg)(e.cEl.sigel)}),(0,p.jsx)("td",{dangerouslySetInnerHTML:(0,c.rg)(e.cEl.werk)}),(0,p.jsxs)("td",{className:"minorTxt",children:[e.cEl.bibgrau&&(0,p.jsx)("p",{dangerouslySetInnerHTML:(0,c.rg)(e.cEl.bibgrau)}),e.cEl.bibvoll&&(0,p.jsx)("p",{dangerouslySetInnerHTML:(0,c.rg)(e.cEl.bibvoll)}),e.cEl.bibzusatz&&(0,p.jsx)("p",{dangerouslySetInnerHTML:(0,c.rg)(e.cEl.bibzusatz)})]})]})},tblHeader:(0,p.jsxs)(p.Fragment,{children:[(0,p.jsx)("th",{children:"Sigel"}),(0,p.jsx)("th",{children:"Werktitel"}),(0,p.jsx)("th",{children:"Bibliographie"})]}),asideContent:[{caption:"dol-ID",type:"text",col:"db_id"},{caption:"Sigel",type:"text",col:"sigel"},{caption:"Werk",type:"text",col:"werk"},{caption:"Bib-Grau",type:"text",col:"bibgrau"},{caption:"Bib-Zusatz",type:"text",col:"bibzusatz"},{caption:"Bib-Voll",type:"text",col:"bibvoll"}]})}function H(e){var t=[["neuer Eintrag",function(){var e=(0,i.Z)(s().mark((function e(t){var n;return s().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(!window.confirm("Soll ein neuer Eintrag erstellt werden?")){e.next=5;break}return e.next=3,o.Q.konkordanz.save({zettel_sigel:"neuer Verweis"});case 3:n=e.sent,t.setState({newItemCreated:[{id:0,c:"id",o:"=",v:n}]});case 5:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}()]];return(0,p.jsx)(c.HA,{tblName:"konkordanz",searchOptions:[["zettel_sigel","Sigel"],["id","ID"],["opera_id","Werk-ID"]],sortOptions:[['["id"]',"ID"],['["zettel_sigel"]',"Sigel"]],menuItems:t,tblRow:function(e){return(0,p.jsxs)(p.Fragment,{children:[(0,p.jsx)("td",{title:"ID: "+e.cEl.id,dangerouslySetInnerHTML:(0,c.rg)(e.cEl.zettel_sigel)}),(0,p.jsx)("td",{children:e.cEl.comment}),(0,p.jsx)("td",{children:e.cEl.opera_id&&(0,p.jsxs)("span",{children:[e.cEl.opera," ",(0,p.jsxs)("i",{className:"minorTxt",children:["(ID: ",e.cEl.opera_id,")"]})]})})]})},tblHeader:(0,p.jsxs)(p.Fragment,{children:[(0,p.jsx)("th",{children:"Angabe auf Zettel"}),(0,p.jsx)("th",{children:"Bemerkung"}),(0,p.jsx)("th",{children:"Quelle"})]}),asideContent:[{caption:"Zettel-Sigel",type:"text",col:"zettel_sigel"},{caption:"Verkn\xfcpftes Werk",type:"auto",col:["sigel","opera_id"],search:{tbl:"opera",sCol:"sigel",rCol:"sigel"}},{caption:"Kommentar",type:"area",col:"comment"}]})}function M(e){var t=[["neuer Eintrag",function(){var e=(0,i.Z)(s().mark((function e(t){var n;return s().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(!window.confirm("Soll ein neuer Eintrag erstellt werden?")){e.next=5;break}return e.next=3,o.Q.etudaus.save({zettel_sigel:"neuer Verweis"});case 3:n=e.sent,t.setState({newItemCreated:[{id:0,c:"id",o:"=",v:n}]});case 5:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}()]];return(0,p.jsx)(c.HA,{tblName:"etudaus",searchOptions:[["sigel","Sigel"],["id","ID"],["opera_id","Werk-ID"],["werk","Quelle"]],sortOptions:[['["id"]',"ID"],['["sigel"]',"Sigel"]],menuItems:t,tblRow:function(e){return(0,p.jsxs)(p.Fragment,{children:[(0,p.jsx)("td",{title:"ID: "+e.cEl.id,dangerouslySetInnerHTML:(0,c.rg)(e.cEl.sigel)}),(0,p.jsx)("td",{dangerouslySetInnerHTML:(0,c.rg)(e.cEl.werk)}),(0,p.jsx)("td",{dangerouslySetInnerHTML:(0,c.rg)(e.cEl.opera)})]})},tblHeader:(0,p.jsxs)(p.Fragment,{children:[(0,p.jsx)("th",{children:"Angabe auf Zettel"}),(0,p.jsx)("th",{children:"Werk"}),(0,p.jsx)("th",{children:"Quelle"})]}),asideContent:[{caption:"Sigel",type:"text",col:"sigel"},{caption:"verknpft. Werk",type:"auto",col:["opera","opera_id"],search:{tbl:"opera",sCol:"sigel",rCol:"sigel"}},{caption:"Werk",type:"area",col:"werk"}]})}function Q(e){var t=[["neuer Eintrag",function(){var e=(0,i.Z)(s().mark((function e(t){var n;return s().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(!window.confirm("Soll ein neuer Eintrag erstellt werden?")){e.next=5;break}return e.next=3,o.Q.edition.save({editor:"EditorIn",year:2022});case 3:n=e.sent,t.setState({newItemCreated:[{id:0,c:"id",o:"=",v:n}]});case 5:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}()]],n=[{caption:"EditorIn",type:"text",col:"editor"},{caption:"Jahr",type:"text",col:"year"},{caption:"verknpft. Werk",type:"auto",col:["sigel","opera_id"],search:{tbl:"opera",sCol:"sigel",rCol:"sigel"}},{caption:(0,p.jsxs)("span",{children:["URL ",(0,p.jsx)("small",{children:"(extern)"})]}),type:"text",col:"url"},{caption:(0,p.jsxs)("span",{children:["Pfad ",(0,p.jsx)("small",{children:"(auf dem Server)"})]}),type:"text",col:"path"},{caption:"Kommentar",type:"area",col:"comment"},{caption:"Seiten-verh\xe4ltnis",type:"text",col:"aspect_ratio"}];return(0,p.jsx)(c.HA,{tblName:"edition",searchOptions:[["editor","EditorIn"],["year","Jahr"]],sortOptions:[['["id"]',"ID"]],menuItems:t,tblRow:function(e){return(0,p.jsxs)(p.Fragment,{children:[(0,p.jsxs)("td",{title:"ID: "+e.cEl.id,children:[e.cEl.editor," ",e.cEl.year]}),(0,p.jsxs)("td",{children:[e.cEl.sigel," ",(0,p.jsxs)("small",{children:["(ID ",e.cEl.opera_id,")"]})]})]})},tblHeader:(0,p.jsxs)(p.Fragment,{children:[(0,p.jsx)("th",{children:"K\xfcrzel"}),(0,p.jsx)("th",{children:"verknpft. Werk"})]}),asideContent:n})}var T=function(){var e=(0,i.Z)(s().mark((function e(){var t;return s().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,o.Q.lemma.getAll({select:["id","lemma_display","lemma_simple","nr","farbe"],order:["lemma_simple"]});case 2:return t=(t=e.sent).map((function(e){var t='<span style="color: '.concat(j[e.farbe],'">').concat(e.lemma_display,"</span>");return{id:e.id,lemma_display:t,lemma:e.lemma_simple?e.lemma_simple.toLowerCase():""}})),e.abrupt("return",t);case 5:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}();function A(e){var t=(0,u.useState)(null),n=(0,a.Z)(t,2),r=n[0],l=n[1],d=(0,u.useState)(null),m=(0,a.Z)(d,2),h=m[0],x=m[1];return(0,u.useEffect)((function(){var t=function(){var t=(0,i.Z)(s().mark((function t(){var n,r;return s().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,o.Q.lemma.get({id:e.lemma_id});case 2:return n=t.sent,l(n[0]),t.next=6,o.Q.zettel.get({lemma_id:e.lemma_id});case 6:r=t.sent,x(r);case 8:case"end":return t.stop()}}),t)})));return function(){return t.apply(this,arguments)}}();l(null),x(null),t()}),[e.lemma_id]),r?(0,p.jsxs)(p.Fragment,{children:[(0,p.jsxs)("h1",{children:[(0,p.jsx)("span",{dangerouslySetInnerHTML:(0,c.rg)(r.lemma_display)}),(0,p.jsxs)("small",{style:{fontSize:"40%",marginLeft:"10px"},children:["(ID ",r.id,")"]})]}),(0,p.jsx)("div",{children:r.URL?(0,p.jsx)("a",{href:"https://dom-en-ligne.de/"+r.URL,target:"_blank",children:"zum Artikel"}):(0,p.jsx)("span",{children:"Kein Artikel verf\xfcgbar."})}),(0,p.jsx)("div",{children:null!==h?0===h.length?(0,p.jsx)("span",{children:"Keine Zettel mit diesem Lemma verkn\xfcpft!"}):h.map((function(e){return(0,p.jsxs)("div",{children:[(0,p.jsx)("div",{children:(0,p.jsx)("img",{style:{width:o.Q.options.z_width},src:"https://dienste.badw.de:9998"+e.img_path+".jpg"})}),(0,p.jsxs)("div",{children:[e.opera," (",e.id,")"]})]},e.id)})):(0,p.jsx)("span",{children:"Zettel werden geladen..."})})]}):(0,p.jsx)("div",{children:"Daten werden geladen..."})}}}]);
//# sourceMappingURL=440.bbf67e39.chunk.js.map