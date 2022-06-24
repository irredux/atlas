"use strict";(self.webpackChunkatlas=self.webpackChunkatlas||[]).push([[395],{1395:function(s,e,t){t.r(e),t.d(e,{Opera:function(){return W}});var r=t(885),a=t(7762),n=t(5861),i=t(5671),c=t(3144),l=t(136),d=t(8505),o=t(7757),x=t.n(o),h=t(1413),m=t(5987),u=t(2791),j=t(1694),p=t.n(j),v=t(162),f=t(2677),g=["animation","bg","bsPrefix","size"],N=["className"];function _(s){var e=s.animation,t=s.bg,a=s.bsPrefix,n=s.size,i=(0,m.Z)(s,g);a=(0,v.vE)(a,"placeholder");var c=(0,f.r)(i),l=(0,r.Z)(c,1)[0],d=l.className,o=(0,m.Z)(l,N);return(0,h.Z)((0,h.Z)({},o),{},{className:p()(d,e?"".concat(a,"-").concat(e):a,n&&"".concat(a,"-").concat(n),t&&"bg-".concat(t))})}var k=t(3360),w=t(184),b=u.forwardRef((function(s,e){var t=_(s);return(0,w.jsx)(k.Z,(0,h.Z)((0,h.Z)({},t),{},{ref:e,disabled:!0,tabIndex:-1}))}));b.displayName="PlaceholderButton";var y=b,S=["as"],Z=u.forwardRef((function(s,e){var t=s.as,r=void 0===t?"span":t,a=_((0,m.Z)(s,S));return(0,w.jsx)(r,(0,h.Z)((0,h.Z)({},a),{},{ref:e}))}));Z.displayName="Placeholder";var L=Object.assign(Z,{Button:y}),C=t(4775),I=t(4817),A=t(7022),H=t(3350),T=t(3174),B=t(4483),Q=t(6407),z=t(3222),R=function(s){(0,l.Z)(t,s);var e=(0,d.Z)(t);function t(s){var r;return(0,i.Z)(this,t),(r=e.call(this,s)).state={author:null,work:null,authorLst:[]},r}return(0,c.Z)(t,[{key:"render",value:function(){var s=this;return(0,w.jsxs)(C.Z,{show:!0,placement:"end",scroll:!0,backdrop:!1,onHide:function(){s.props.onClose()},children:[(0,w.jsx)(C.Z.Header,{closeButton:!0,children:(0,w.jsx)(C.Z.Title,{})}),(0,w.jsxs)(C.Z.Body,{children:[this.state.author&&(0,w.jsxs)("div",{style:{display:"grid",gridTemplateColumns:"150px auto",rowGap:"10px",margin:"0"},children:[(0,w.jsxs)("h3",{children:["Autor ",(0,w.jsxs)("i",{style:{fontSize:"60%"},children:["ID: ",this.state.author.id,")"]})]}),(0,w.jsx)("div",{}),(0,w.jsx)("div",{children:"Name:"}),(0,w.jsx)("div",{children:(0,w.jsx)("input",{type:"text",value:this.state.author.full?this.state.author.full.replace(/&lt;/g,"<").replace(/&gt;/g,">"):"",onChange:function(e){var t=s.state.author;t.full=e.target.value,s.setState({author:t})}})}),(0,w.jsx)("div",{children:"Abk\xfcrzung:"}),(0,w.jsx)("div",{children:(0,w.jsx)("input",{type:"text",value:this.state.author.abbr,onChange:function(e){var t=s.state.author;t.abbr=e.target.value,s.setState({author:t})}})}),(0,w.jsx)("div",{children:"Abk\xfcrzung (Sortierung):"}),(0,w.jsx)("div",{children:(0,w.jsx)("input",{type:"text",value:this.state.author.abbr_sort,onChange:function(e){var t=s.state.author;t.abbr_sort=e.target.value,s.setState({author:t})}})}),(0,w.jsx)("div",{children:"Anzeigedatum:"}),(0,w.jsx)("div",{children:(0,w.jsx)("input",{type:"text",value:this.state.author.date_display,onChange:function(e){var t=s.state.author;t.date_display=e.target.value,s.setState({author:t})}})}),(0,w.jsx)("div",{children:"Sortierdatum:"}),(0,w.jsx)("div",{children:(0,w.jsx)("input",{type:"text",value:this.state.author.date_sort,onChange:function(e){var t=s.state.author;t.date_sort=e.target.value,s.setState({author:t})}})}),(0,w.jsx)("div",{children:"Sortierdatum-Typ:"}),(0,w.jsx)("div",{children:(0,w.jsx)("input",{type:"text",value:this.state.author.date_type,onChange:function(e){var t=s.state.author;t.date_type=e.target.value,s.setState({author:t})}})}),(0,w.jsx)("div",{children:"in Benutzung:"}),(0,w.jsx)("div",{children:(0,w.jsx)(z.SA,{style:{width:"86%"},options:[[0,"Nein"],[1,"Ja"]],value:this.state.author.in_use,onChange:function(e){var t=s.state.author;t.in_use=e.target.value,s.setState({author:t})}})}),(0,w.jsx)("div",{}),(0,w.jsxs)("div",{children:[(0,w.jsx)(z.YG,{value:"speichern",onClick:(0,n.Z)(x().mark((function e(){return x().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,Q.Q.author.save(s.state.author);case 2:return s.props.onUpdate(),e.abrupt("return",{status:!0});case 4:case"end":return e.stop()}}),e)})))}),(0,w.jsx)(z.YG,{value:"l\xf6schen",variant:"danger",style:{marginLeft:"10px"},onClick:(0,n.Z)(x().mark((function e(){var t,r,n,i,c;return x().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,Q.Q.work.search([{c:"author_id",o:"=",v:s.state.author.id}],{select:["id"]});case 2:t=e.sent,r=[],n=(0,a.Z)(t);try{for(n.s();!(i=n.n()).done;)c=i.value,r.push(c.id)}catch(l){n.e(l)}finally{n.f()}if(!window.confirm("Soll der Autor wirklich gel\xf6scht werden? ".concat(r.length>1?r.length+" verkn\xfcpfte Werke werden":"Ein verkn\xfcpftes Werk wird"," ebenfalls gel\xf6scht. Dieser Schritt kann nicht mehr r\xfcckg\xe4ngig gemacht werden!"))){e.next=19;break}if(!(r.length>0)){e.next=10;break}return e.next=10,Q.Q.work.delete(r);case 10:return e.next=13,Q.Q.author.delete(s.state.author.id);case 13:return e.next=15,Q.Q.exec("opera_update");case 15:return s.props.onReload(),e.abrupt("return",{status:!0});case 19:return e.abrupt("return",{status:0});case 20:case"end":return e.stop()}}),e)})))})]})]}),this.state.work&&(0,w.jsxs)("div",{style:{display:"grid",gridTemplateColumns:"150px auto",rowGap:"10px",margin:"50px 0"},children:[(0,w.jsxs)("h3",{children:["Werk ",(0,w.jsxs)("i",{style:{fontSize:"60%"},children:["(ID: ",this.state.work.id,")"]})]}),(0,w.jsx)("div",{}),(0,w.jsx)("div",{children:"Werktitel:"}),(0,w.jsx)("div",{children:(0,w.jsx)("input",{type:"text",value:this.state.work.full?this.state.work.full.replace(/&lt;/g,"<").replace(/&gt;/g,">"):"",onChange:function(e){var t=s.state.work;t.full=e.target.value,s.setState({work:t})}})}),(0,w.jsx)("div",{children:"Abk\xfcrzung:"}),(0,w.jsx)("div",{children:(0,w.jsx)("input",{type:"text",value:this.state.work.abbr,onChange:function(e){var t=s.state.work;t.abbr=e.target.value,s.setState({work:t})}})}),(0,w.jsx)("div",{children:"Abk\xfcrzung (Sortierung):"}),(0,w.jsx)("div",{children:(0,w.jsx)("input",{type:"text",value:this.state.work.abbr_sort,onChange:function(e){var t=s.state.work;t.abbr_sort=e.target.value,s.setState({work:t})}})}),(0,w.jsx)("div",{children:"Anzeigedatum:"}),(0,w.jsx)("div",{children:(0,w.jsx)("input",{type:"text",value:this.state.work.date_display,onChange:function(e){var t=s.state.work;t.date_display=e.target.value,s.setState({work:t})}})}),(0,w.jsx)("div",{children:"Sortierdatum:"}),(0,w.jsx)("div",{children:(0,w.jsx)("input",{type:"text",value:this.state.work.date_sort,onChange:function(e){var t=s.state.work;t.date_sort=e.target.value,s.setState({work:t})}})}),(0,w.jsx)("div",{children:"Sortierdatum-Typ:"}),(0,w.jsx)("div",{children:(0,w.jsx)("input",{type:"text",value:this.state.work.date_type,onChange:function(e){var t=s.state.work;t.date_type=e.target.value,s.setState({work:t})}})}),(0,w.jsxs)("div",{children:["Abweichender Autorenname (z.B. bei ",(0,w.jsx)("aut",{children:"Vita"}),"):"]}),(0,w.jsx)("div",{children:(0,w.jsx)("input",{type:"text",value:this.state.work.author_display,onChange:function(e){var t=s.state.work;t.author_display=e.target.value,s.setState({work:t})}})}),(0,w.jsx)("div",{children:"verknpft. Autor:"}),(0,w.jsx)("div",{children:(0,w.jsx)(z.SA,{style:{width:"86%"},options:this.state.authorLst,value:this.state.work.author_id,onChange:function(e){var t=s.state.work;t.author_id=e.target.value,s.setState({work:t})}})}),(0,w.jsxs)("div",{children:["Stellenangabe: ",(0,w.jsx)("span",{className:"minorTxt",children:"(Bsp.)"})]}),(0,w.jsx)("div",{children:(0,w.jsx)("input",{type:"text",value:this.state.work.citation,onChange:function(e){var t=s.state.work;t.citation=e.target.value,s.setState({work:t})}})}),(0,w.jsxs)("div",{children:["Stellenangabe Bibliographie: ",(0,w.jsx)("i",{className:"minorTxt",children:"(nur minora)"})]}),(0,w.jsx)("div",{children:(0,w.jsx)("input",{type:"text",value:this.state.work.bibliography_cit,onChange:function(e){var t=s.state.work;t.bibliography_cit=e.target.value,s.setState({work:t})}})}),(0,w.jsx)("div",{children:"Referenz:"}),(0,w.jsx)("div",{children:(0,w.jsx)("input",{type:"text",value:this.state.work.reference,onChange:function(e){var t=s.state.work;t.reference=e.target.value,s.setState({work:t})}})}),(0,w.jsx)("div",{children:"in Benutzung:"}),(0,w.jsx)("div",{children:(0,w.jsx)(z.SA,{style:{width:"86%"},options:[[0,"Nein"],[1,"Ja"]],value:this.state.work.in_use,onChange:function(e){var t=s.state.work;t.in_use=e.target.value,s.setState({work:t})}})}),(0,w.jsxs)("div",{children:[(0,w.jsx)("i",{children:"opus maius"}),":"]}),(0,w.jsx)("div",{children:(0,w.jsx)(z.SA,{style:{width:"86%"},options:[[0,"Nein"],[1,"Ja"]],value:this.state.work.is_maior,onChange:function(e){var t=s.state.work;t.is_maior=e.target.value,s.setState({work:t})}})}),(0,w.jsx)("div",{children:"Kommentar:"}),(0,w.jsx)("div",{children:(0,w.jsx)("textarea",{value:this.state.work.txt_info,onChange:function(e){var t=s.state.work;t.txt_info=e.target.value,s.setState({work:t})},style:{width:"205px",height:"130px"}})}),(0,w.jsx)("div",{children:"Bibliographie:"}),(0,w.jsx)("div",{children:(0,w.jsx)("textarea",{value:this.state.work.bibliography,onChange:function(e){var t=s.state.work;t.bibliography=e.target.value,s.setState({work:t})},style:{width:"205px",height:"130px"}})}),(0,w.jsx)("div",{}),(0,w.jsxs)("div",{children:[(0,w.jsx)(z.YG,{value:"speichern",onClick:(0,n.Z)(x().mark((function e(){return x().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,Q.Q.work.save(s.state.work);case 2:return s.props.onUpdate(),e.abrupt("return",{status:!0});case 4:case"end":return e.stop()}}),e)})))}),(0,w.jsx)(z.YG,{value:"l\xf6schen",variant:"danger",style:{marginLeft:"10px"},onClick:(0,n.Z)(x().mark((function e(){var t;return x().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,Q.Q.work.search([{c:"author_id",o:"=",v:s.state.work.author_id}],{count:!0});case 2:if(t=e.sent,!(t[0].count<2)){e.next=8;break}return e.abrupt("return",{status:-1,error:"Das Werk kann nicht gel\xf6scht werden, da es das lezte Werk des Autors ist."});case 8:if(!window.confirm("Soll das Werk wirklich gel\xf6scht werden? Dieser Schritt kann nicht mehr r\xfcckg\xe4ngig gemacht werden!")){e.next=17;break}return e.next=11,Q.Q.work.delete(s.state.work.id);case 11:return e.next=13,Q.Q.exec("opera_update");case 13:return s.props.onReload(),e.abrupt("return",{status:!0});case 17:return e.abrupt("return",{status:0});case 18:case"end":return e.stop()}}),e)})))})]})]})]})]})}},{key:"componentDidMount",value:function(){var s=this,e=function(){var e=(0,n.Z)(x().mark((function e(){var t,r,n,i,c;return x().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,Q.Q.author.getAll({select:["id","abbr"],order:["abbr_sort"]});case 2:t=e.sent,r=[],n=(0,a.Z)(t);try{for(n.s();!(i=n.n()).done;)c=i.value,r.push([c.id,c.abbr])}catch(l){n.e(l)}finally{n.f()}s.setState({authorLst:r});case 7:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}();if(e(),this.props.item.author_id>0){var t=function(){var e=(0,n.Z)(x().mark((function e(){var t;return x().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,Q.Q.author.get({id:s.props.item.author_id});case 2:t=e.sent,s.setState({author:t[0]});case 4:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}();t()}if(this.props.item.work_id>0){var r=function(){var e=(0,n.Z)(x().mark((function e(){var t;return x().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,Q.Q.work.get({id:s.props.item.work_id});case 2:t=e.sent,s.setState({work:t[0]});case 4:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}();r()}}},{key:"componentDidUpdate",value:function(s){var e=this;if(s.item.author_id!=this.props.item.author_id)if(this.props.item.author_id>0){var t=function(){var s=(0,n.Z)(x().mark((function s(){var t;return x().wrap((function(s){for(;;)switch(s.prev=s.next){case 0:return s.next=2,Q.Q.author.get({id:e.props.item.author_id});case 2:t=s.sent,e.setState({author:t[0]});case 4:case"end":return s.stop()}}),s)})));return function(){return s.apply(this,arguments)}}();t()}else this.setState({author:null});if(s.item.work_id!=this.props.item.work_id)if(this.props.item.work_id>0){var r=function(){var s=(0,n.Z)(x().mark((function s(){var t;return x().wrap((function(s){for(;;)switch(s.prev=s.next){case 0:return s.next=2,Q.Q.work.get({id:e.props.item.work_id});case 2:t=s.sent,e.setState({work:t[0]});case 4:case"end":return s.stop()}}),s)})));return function(){return s.apply(this,arguments)}}();r()}else this.setState({work:null})}}]),t}(u.Component),M=function(s){(0,l.Z)(t,s);var e=(0,d.Z)(t);function t(s){var r;return(0,i.Z)(this,t),(r=e.call(this,s)).state={oLst:[],cHitId:0},r.resultsOnPage=18,r}return(0,c.Z)(t,[{key:"render",value:function(){var s=this,e=[],t=[],r=0,i=0;this.scrollRef=null;var c,l=(0,a.Z)(this.props.cTrLst);try{var d=function(){var a=c.value;r++;var n={};a.o.id===s.state.cHitId?(n="searchHit",s.scrollRef=u.createRef()):s.state.cHitId>0&&s.state.hits.some((function(s){return s.id===a.o.id}))&&(n="searchAllHits"),e.push((0,w.jsx)("tr",{className:n,ref:a.o.id===s.state.cHitId?s.scrollRef:null,onDoubleClick:function(e){e.stopPropagation(),s.props.showDetail(a.o)},children:a.data},r)),e.length>=s.resultsOnPage&&(i++,t.push((0,w.jsxs)("div",{id:"operaBox_"+i,style:{borderBottom:"1px dotted black",paddingBottom:"15px",margin:"10px"},children:[(0,w.jsx)("table",{className:"operaBox",children:(0,w.jsx)("tbody",{children:e})}),(0,w.jsx)("div",{style:{textAlign:"center"},children:i})]},i)),e=[])};for(l.s();!(c=l.n()).done;)d()}catch(m){l.e(m)}finally{l.f()}i>0&&t.push((0,w.jsxs)("div",{id:"operaBox_"+(i+1),style:{margin:"10px"},children:[(0,w.jsx)("table",{className:"operaBox",children:(0,w.jsx)("tbody",{children:e})}),(0,w.jsx)("div",{style:{textAlign:"center"},children:i+1})]},i+1));var o=(0,w.jsx)("table",{className:"operaBox",style:{width:"100%"},children:(0,w.jsxs)("tbody",{children:[(0,w.jsxs)("tr",{children:[(0,w.jsx)("td",{className:"c1"}),(0,w.jsx)("td",{className:"c2",children:(0,w.jsx)(L,{sm:10})}),(0,w.jsx)("td",{className:"c3",children:(0,w.jsx)(L,{sm:10})}),(0,w.jsx)("td",{className:"c4"}),(0,w.jsx)("td",{className:"c5"})]}),(0,w.jsxs)("tr",{children:[(0,w.jsx)("td",{className:"c1",children:(0,w.jsx)(L,{sm:10})}),(0,w.jsxs)("td",{className:"c2",children:["\xa0\xa0\xa0",(0,w.jsx)(L,{sm:10})]}),(0,w.jsxs)("td",{className:"c3",children:["\xa0\xa0\xa0",(0,w.jsx)(L,{sm:10})]}),(0,w.jsxs)("td",{className:"c4",children:[(0,w.jsx)(L,{sm:10}),(0,w.jsx)(L,{sm:8})," ",(0,w.jsx)(L,{bg:"primary",sm:4})]}),(0,w.jsx)("td",{className:"c5",children:(0,w.jsx)(L,{sm:5})})]}),(0,w.jsxs)("tr",{children:[(0,w.jsx)("td",{className:"c1"}),(0,w.jsx)("td",{className:"c2",children:(0,w.jsx)(L,{sm:10})}),(0,w.jsx)("td",{className:"c3",children:(0,w.jsx)(L,{sm:10})}),(0,w.jsx)("td",{className:"c4"}),(0,w.jsx)("td",{className:"c5"})]}),(0,w.jsxs)("tr",{children:[(0,w.jsx)("td",{className:"c1",children:(0,w.jsx)(L,{sm:10})}),(0,w.jsxs)("td",{className:"c2",children:["\xa0\xa0\xa0",(0,w.jsx)(L,{sm:10})]}),(0,w.jsxs)("td",{className:"c3",children:["\xa0\xa0\xa0",(0,w.jsx)(L,{sm:10})]}),(0,w.jsxs)("td",{className:"c4",children:[(0,w.jsx)(L,{sm:10})," ",(0,w.jsx)(L,{sm:10}),(0,w.jsx)(L,{sm:8})," ",(0,w.jsx)(L,{bg:"primary",sm:6})]}),(0,w.jsx)("td",{className:"c5",children:(0,w.jsx)(L,{sm:6})})]}),(0,w.jsxs)("tr",{children:[(0,w.jsx)("td",{className:"c1"}),(0,w.jsx)("td",{className:"c2",children:(0,w.jsx)(L,{sm:10})}),(0,w.jsxs)("td",{className:"c3",children:[(0,w.jsx)(L,{sm:10}),(0,w.jsx)(L,{sm:8})]}),(0,w.jsx)("td",{className:"c4"}),(0,w.jsx)("td",{className:"c5"})]}),(0,w.jsxs)("tr",{children:[(0,w.jsx)("td",{className:"c1",children:(0,w.jsx)(L,{sm:10})}),(0,w.jsxs)("td",{className:"c2",children:["\xa0\xa0\xa0",(0,w.jsx)(L,{sm:10})]}),(0,w.jsxs)("td",{className:"c3",children:["\xa0\xa0\xa0",(0,w.jsx)(L,{sm:10})]}),(0,w.jsxs)("td",{className:"c4",children:[(0,w.jsx)(L,{sm:11})," ",(0,w.jsx)(L,{sm:10})," ",(0,w.jsx)(L,{sm:8}),(0,w.jsx)(L,{sm:8}),(0,w.jsx)(L,{sm:10})," ",(0,w.jsx)(L,{sm:9})," ",(0,w.jsx)(L,{sm:10}),(0,w.jsx)(L,{sm:8})," ",(0,w.jsx)(L,{bg:"primary",sm:6})]}),(0,w.jsx)("td",{className:"c5",children:(0,w.jsx)(L,{sm:8})})]}),(0,w.jsxs)("tr",{children:[(0,w.jsx)("td",{className:"c1"}),(0,w.jsx)("td",{className:"c2",children:(0,w.jsx)(L,{sm:10})}),(0,w.jsx)("td",{className:"c3",children:(0,w.jsx)(L,{sm:10})}),(0,w.jsx)("td",{className:"c4"}),(0,w.jsx)("td",{className:"c5"})]}),(0,w.jsxs)("tr",{children:[(0,w.jsx)("td",{className:"c1",children:(0,w.jsx)(L,{sm:10})}),(0,w.jsxs)("td",{className:"c2",children:["\xa0\xa0\xa0",(0,w.jsx)(L,{sm:10})]}),(0,w.jsxs)("td",{className:"c3",children:["\xa0\xa0\xa0",(0,w.jsx)(L,{sm:10})]}),(0,w.jsxs)("td",{className:"c4",children:[(0,w.jsx)(L,{sm:11}),(0,w.jsx)(L,{sm:9})," ",(0,w.jsx)(L,{bg:"primary",sm:8})]}),(0,w.jsx)("td",{className:"c5",children:(0,w.jsx)(L,{sm:5})})]}),(0,w.jsxs)("tr",{children:[(0,w.jsx)("td",{className:"c1"}),(0,w.jsx)("td",{className:"c2",children:(0,w.jsx)(L,{sm:10})}),(0,w.jsx)("td",{className:"c3",children:(0,w.jsx)(L,{sm:10})}),(0,w.jsx)("td",{className:"c4"}),(0,w.jsx)("td",{className:"c5"})]}),(0,w.jsxs)("tr",{children:[(0,w.jsx)("td",{className:"c1",children:(0,w.jsx)(L,{sm:10})}),(0,w.jsxs)("td",{className:"c2",children:["\xa0\xa0\xa0",(0,w.jsx)(L,{sm:10})]}),(0,w.jsxs)("td",{className:"c3",children:["\xa0\xa0\xa0",(0,w.jsx)(L,{sm:10})]}),(0,w.jsxs)("td",{className:"c4",children:[(0,w.jsx)(L,{sm:9})," ",(0,w.jsx)(L,{sm:11})," ",(0,w.jsx)(L,{sm:8})," ",(0,w.jsx)(L,{bg:"primary",sm:4})]}),(0,w.jsx)("td",{className:"c5",children:(0,w.jsx)(L,{sm:5})})]}),(0,w.jsxs)("tr",{children:[(0,w.jsx)("td",{className:"c1",children:(0,w.jsx)(L,{sm:10})}),(0,w.jsxs)("td",{className:"c2",children:["\xa0\xa0\xa0",(0,w.jsx)(L,{sm:10})]}),(0,w.jsxs)("td",{className:"c3",children:["\xa0\xa0\xa0",(0,w.jsx)(L,{sm:10})]}),(0,w.jsxs)("td",{className:"c4",children:[(0,w.jsx)(L,{sm:10})," ",(0,w.jsx)(L,{sm:10})," ",(0,w.jsx)(L,{sm:10}),(0,w.jsx)(L,{sm:8})," ",(0,w.jsx)(L,{bg:"primary",sm:4})]}),(0,w.jsx)("td",{className:"c5",children:(0,w.jsx)(L,{sm:4})})]}),(0,w.jsxs)("tr",{children:[(0,w.jsx)("td",{className:"c1",children:(0,w.jsx)(L,{sm:10})}),(0,w.jsxs)("td",{className:"c2",children:["\xa0\xa0\xa0",(0,w.jsx)(L,{sm:10})]}),(0,w.jsxs)("td",{className:"c3",children:["\xa0\xa0\xa0",(0,w.jsx)(L,{sm:10})]}),(0,w.jsxs)("td",{className:"c4",children:[(0,w.jsx)(L,{sm:8})," ",(0,w.jsx)(L,{sm:11})," ",(0,w.jsx)(L,{sm:10}),(0,w.jsx)(L,{sm:9})," ",(0,w.jsx)(L,{bg:"primary",sm:8})]}),(0,w.jsx)("td",{className:"c5",children:(0,w.jsx)(L,{sm:7})})]})]})});"opera_minora"===this.props.listName?o=(0,w.jsx)("table",{className:"operaBox",style:{width:"100%"},children:(0,w.jsxs)("tbody",{children:[(0,w.jsxs)("tr",{children:[(0,w.jsx)("td",{className:"c1_min",children:(0,w.jsx)(L,{sm:8})}),(0,w.jsx)("td",{className:"c2_min",children:(0,w.jsx)(L,{sm:10})}),(0,w.jsx)("td",{className:"c5_min",children:(0,w.jsx)(L,{bg:"primary",sm:4})})]}),(0,w.jsxs)("tr",{children:[(0,w.jsx)("td",{className:"c1_min",children:(0,w.jsx)(L,{sm:8})}),(0,w.jsx)("td",{className:"c2_min",children:(0,w.jsx)(L,{sm:11})}),(0,w.jsxs)("td",{className:"c5_min",children:[(0,w.jsx)(L,{sm:4}),(0,w.jsx)("br",{}),(0,w.jsx)(L,{sm:2})]})]}),(0,w.jsxs)("tr",{children:[(0,w.jsx)("td",{className:"c1_min",children:(0,w.jsx)(L,{sm:7})}),(0,w.jsx)("td",{className:"c2_min",children:(0,w.jsx)(L,{sm:8})}),(0,w.jsx)("td",{className:"c5_min"})]}),(0,w.jsxs)("tr",{children:[(0,w.jsx)("td",{className:"c1_min"}),(0,w.jsx)("td",{className:"c2_min",children:(0,w.jsx)(L,{sm:11})}),(0,w.jsx)("td",{className:"c5_min",children:(0,w.jsx)(L,{sm:5})})]}),(0,w.jsxs)("tr",{children:[(0,w.jsx)("td",{className:"c1_min",children:(0,w.jsx)(L,{sm:5})}),(0,w.jsx)("td",{className:"c2_min",children:(0,w.jsx)(L,{sm:7})}),(0,w.jsx)("td",{className:"c5_min",children:(0,w.jsx)(L,{sm:4})})]}),(0,w.jsxs)("tr",{children:[(0,w.jsx)("td",{className:"c1_min"}),(0,w.jsx)("td",{className:"c2_min",children:(0,w.jsx)(L,{sm:8})}),(0,w.jsx)("td",{className:"c5_min",children:(0,w.jsx)(L,{sm:4})})]}),(0,w.jsxs)("tr",{children:[(0,w.jsx)("td",{className:"c1_min"}),(0,w.jsx)("td",{className:"c2_min",children:(0,w.jsx)(L,{sm:8})}),(0,w.jsx)("td",{className:"c5_min",children:(0,w.jsx)(L,{sm:6})})]}),(0,w.jsxs)("tr",{children:[(0,w.jsx)("td",{className:"c1_min",children:(0,w.jsx)(L,{sm:8})}),(0,w.jsx)("td",{className:"c2_min",children:(0,w.jsx)(L,{sm:10})}),(0,w.jsx)("td",{className:"c5_min"})]}),(0,w.jsxs)("tr",{children:[(0,w.jsx)("td",{className:"c1_min",children:(0,w.jsx)(L,{sm:8})}),(0,w.jsx)("td",{className:"c2_min",children:(0,w.jsx)(L,{sm:7})}),(0,w.jsx)("td",{className:"c5_min",children:(0,w.jsx)(L,{sm:5})})]}),(0,w.jsxs)("tr",{children:[(0,w.jsx)("td",{className:"c1_min",children:(0,w.jsx)(L,{sm:8})}),(0,w.jsx)("td",{className:"c2_min",children:(0,w.jsx)(L,{sm:11})}),(0,w.jsx)("td",{className:"c5_min",children:(0,w.jsx)(L,{sm:6})})]}),(0,w.jsxs)("tr",{children:[(0,w.jsx)("td",{className:"c1_min",children:(0,w.jsx)(L,{sm:8})}),(0,w.jsx)("td",{className:"c2_min",children:(0,w.jsx)(L,{sm:10})}),(0,w.jsx)("td",{className:"c5_min",children:(0,w.jsx)(L,{sm:3})})]}),(0,w.jsxs)("tr",{children:[(0,w.jsx)("td",{className:"c1_min",children:(0,w.jsx)(L,{sm:8})}),(0,w.jsx)("td",{className:"c2_min",children:(0,w.jsx)(L,{sm:10})}),(0,w.jsx)("td",{className:"c5_min",children:(0,w.jsx)(L,{sm:3,bg:"primary"})})]}),(0,w.jsxs)("tr",{children:[(0,w.jsx)("td",{className:"c1_min"}),(0,w.jsx)("td",{className:"c2_min",children:(0,w.jsx)(L,{sm:11})}),(0,w.jsx)("td",{className:"c5_min",children:(0,w.jsx)(L,{sm:8})})]}),(0,w.jsxs)("tr",{children:[(0,w.jsx)("td",{className:"c1_min",children:(0,w.jsx)(L,{sm:2})}),(0,w.jsx)("td",{className:"c2_min",children:(0,w.jsx)(L,{sm:6})}),(0,w.jsx)("td",{className:"c5_min"})]}),(0,w.jsxs)("tr",{children:[(0,w.jsx)("td",{className:"c1_min",children:(0,w.jsx)(L,{sm:7})}),(0,w.jsx)("td",{className:"c2_min",children:(0,w.jsx)(L,{sm:7})}),(0,w.jsx)("td",{className:"c5_min",children:(0,w.jsx)(L,{sm:5,bg:"primary"})})]}),(0,w.jsxs)("tr",{children:[(0,w.jsx)("td",{className:"c1_min",children:(0,w.jsx)(L,{sm:8})}),(0,w.jsx)("td",{className:"c2_min",children:(0,w.jsx)(L,{sm:10})}),(0,w.jsx)("td",{className:"c5_min",children:(0,w.jsx)(L,{sm:4,bg:"primary"})})]}),(0,w.jsxs)("tr",{children:[(0,w.jsx)("td",{className:"c1_min",children:(0,w.jsx)(L,{sm:8})}),(0,w.jsx)("td",{className:"c2_min",children:(0,w.jsx)(L,{sm:8})}),(0,w.jsx)("td",{className:"c5_min",children:(0,w.jsx)(L,{sm:5})})]}),(0,w.jsxs)("tr",{children:[(0,w.jsx)("td",{className:"c1_min",children:(0,w.jsx)(L,{sm:2})}),(0,w.jsx)("td",{className:"c2_min",children:(0,w.jsx)(L,{sm:7})}),(0,w.jsx)("td",{className:"c5_min",children:(0,w.jsx)(L,{sm:6})})]}),(0,w.jsxs)("tr",{children:[(0,w.jsx)("td",{className:"c1_min",children:(0,w.jsx)(L,{sm:4})}),(0,w.jsx)("td",{className:"c2_min",children:(0,w.jsx)(L,{sm:9})}),(0,w.jsx)("td",{className:"c5_min",children:(0,w.jsx)(L,{sm:5})})]}),(0,w.jsxs)("tr",{children:[(0,w.jsx)("td",{className:"c1_min",children:(0,w.jsx)(L,{sm:8})}),(0,w.jsx)("td",{className:"c2_min",children:(0,w.jsx)(L,{sm:10})}),(0,w.jsx)("td",{className:"c5_min",children:(0,w.jsx)(L,{sm:3})})]}),(0,w.jsxs)("tr",{children:[(0,w.jsx)("td",{className:"c1_min"}),(0,w.jsx)("td",{className:"c2_min",children:(0,w.jsx)(L,{sm:11})}),(0,w.jsx)("td",{className:"c5_min",children:(0,w.jsx)(L,{sm:11})})]}),(0,w.jsxs)("tr",{children:[(0,w.jsx)("td",{className:"c1_min"}),(0,w.jsx)("td",{className:"c2_min",children:(0,w.jsx)(L,{sm:8})}),(0,w.jsx)("td",{className:"c5_min",children:(0,w.jsx)(L,{sm:5})})]}),(0,w.jsxs)("tr",{children:[(0,w.jsx)("td",{className:"c1_min"}),(0,w.jsx)("td",{className:"c2_min",children:(0,w.jsx)(L,{sm:10})}),(0,w.jsx)("td",{className:"c5_min",children:(0,w.jsx)(L,{sm:4})})]}),(0,w.jsxs)("tr",{children:[(0,w.jsx)("td",{className:"c1_min",children:(0,w.jsx)(L,{sm:4})}),(0,w.jsx)("td",{className:"c2_min",children:(0,w.jsx)(L,{sm:7})}),(0,w.jsx)("td",{className:"c5_min",children:(0,w.jsx)(L,{sm:3})})]})]})}):"tll_index"===this.props.listName&&(o=(0,w.jsx)("table",{className:"operaBox",style:{width:"100%"},children:(0,w.jsxs)("tbody",{children:[(0,w.jsxs)("tr",{children:[(0,w.jsx)("td",{className:"c1_tll",children:(0,w.jsx)(L,{sm:10})}),(0,w.jsx)("td",{className:"c2_tll",children:(0,w.jsx)(L,{sm:10})}),(0,w.jsx)("td",{className:"c3_tll"}),(0,w.jsx)("td",{className:"c4_tll",children:(0,w.jsx)(L,{sm:10})}),(0,w.jsx)("td",{className:"c5_tll"})]}),(0,w.jsxs)("tr",{children:[(0,w.jsxs)("td",{className:"c1_tll",children:["\xa0\xa0\xa0",(0,w.jsx)(L,{sm:10})]}),(0,w.jsxs)("td",{className:"c2_tll",children:["\xa0\xa0\xa0",(0,w.jsx)(L,{sm:10})]}),(0,w.jsx)("td",{className:"c3_tll"}),(0,w.jsxs)("td",{className:"c4_tll",children:["\xa0\xa0\xa0",(0,w.jsx)(L,{sm:10}),(0,w.jsx)("br",{}),"\xa0\xa0\xa0",(0,w.jsx)(L,{sm:8})]}),(0,w.jsxs)("td",{className:"c5_tll",children:["\xa0\xa0\xa0",(0,w.jsx)(L,{sm:9}),(0,w.jsx)("br",{}),"\xa0\xa0\xa0",(0,w.jsx)(L,{sm:3})]})]}),(0,w.jsxs)("tr",{children:[(0,w.jsxs)("td",{className:"c1_tll",children:["\xa0\xa0\xa0",(0,w.jsx)(L,{sm:10})]}),(0,w.jsxs)("td",{className:"c2_tll",children:["\xa0\xa0\xa0",(0,w.jsx)(L,{sm:10})]}),(0,w.jsx)("td",{className:"c3_tll"}),(0,w.jsxs)("td",{className:"c4_tll",children:["\xa0\xa0\xa0",(0,w.jsx)(L,{sm:10}),(0,w.jsx)("br",{}),"\xa0\xa0\xa0",(0,w.jsx)(L,{sm:8})]}),(0,w.jsx)("td",{className:"c5_tll"})]})]})}));var h=[["opera-Listen aktualisieren",(0,n.Z)(x().mark((function e(){return x().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(!window.confirm("Soll die opera-Liste aktualisiert werden? Der Prozess dauert ca. 30 Sekunden.")){e.next=5;break}return e.next=3,Q.Q.exec("opera_update");case 3:return e.next=5,s.props.getLst();case 5:case"end":return e.stop()}}),e)})))]];return Q.Q.access("o_edit")&&(h.push(["Neuer Autor erstellen",(0,n.Z)(x().mark((function e(){var t;return x().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(!window.confirm("Soll ein neuer Autor erstellt werden? Er heisst '+NEUER AUTOR'")){e.next=11;break}return e.next=3,Q.Q.author.save({full:"+Neuer Autor",abbr:"+Neuer Autor",abbr_sort:"+Neuer Autor",in_use:1});case 3:return t=e.sent,e.next=6,Q.Q.work.save({full:"Neues Werk",abbr:"Neues Werk",abbr_sort:"Neues Werk",author_id:t,is_maior:1,in_use:1});case 6:if(!window.confirm("Ein neuer Autor wurde erstellt. Soll die opera-Liste aktualisiert werden?")){e.next=11;break}return e.next=9,Q.Q.exec("opera_update");case 9:return e.next=11,s.props.getLst();case 11:case"end":return e.stop()}}),e)})))]),h.push(["Neues Werk erstellen",(0,n.Z)(x().mark((function e(){return x().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(!window.confirm("Soll ein neues Werk erstellt werden? Das Werk wird ABBO FLOR. zugewiesen.")){e.next=9;break}return e.next=3,Q.Q.work.save({full:"Neues Werk",abbr:"Neues Werk",abbr_sort:"Neues Werk",author_id:1,is_maior:1,in_use:1});case 3:if(e.sent,!window.confirm("Ein neues Werk wurde erstellt. Soll die opera-Liste aktualisiert werden?")){e.next=9;break}return e.next=7,Q.Q.exec("opera_update");case 7:return e.next=9,s.props.getLst();case 9:case"end":return e.stop()}}),e)})))])),(0,w.jsxs)(w.Fragment,{children:[0===t.length?null:(0,w.jsx)(I.Z,{fixed:"bottom",bg:"light",children:(0,w.jsxs)(A.Z,{fluid:!0,children:[(0,w.jsx)(I.Z.Collapse,{className:"justify-content-start",children:(0,w.jsx)(D,{listName:this.props.listName,setHitIndex:function(e){s.setState({cHitId:e})},setHits:function(e){s.setState({hits:e})}})}),(0,w.jsxs)(I.Z.Collapse,{className:"justify-content-end",children:[(0,w.jsx)(I.Z.Text,{children:(0,w.jsx)(H.Z.Control,{type:"text",style:{textAlign:"right",width:"80px",padding:"2px 5px",marginRight:"20px"},accessKey:"p",placeholder:"Seite...",onKeyUp:function(s){if(13===s.keyCode){var e=document.querySelector("div#operaBox_"+s.target.value);e&&e.scrollIntoView({behavior:"smooth"})}}})}),(0,w.jsx)(I.Z.Text,{children:(0,w.jsx)(z.vW,{menuItems:h})})]})]})}),(0,w.jsx)("div",{style:{gridArea:this.props.gridArea},children:0===t.length?(0,w.jsx)("div",{children:(0,w.jsx)(L,{animation:"glow",children:o})}):(0,w.jsx)("div",{className:"operaBox_"+this.props.listName,children:t})})]})}},{key:"gotoSearchResult",value:function(s){1===s&&this.state.hitIndex<this.state.maxHits-1?this.setState({hitIndex:this.state.hitIndex+1}):1===s?this.setState({hitIndex:0}):-1===s&&this.state.hitIndex>0?this.setState({hitIndex:this.state.hitIndex-1}):-1===s&&this.setState({hitIndex:this.state.maxHits-1})}},{key:"componentDidUpdate",value:function(s,e){this.state.hits&&this.state.hits.length>0?e.hitIndex!=this.state.hitIndex&&this.setState({cHitId:this.state.hits[this.state.hitIndex].id}):0!=this.state.cHitId&&this.setState({cHitId:0}),this.scrollRef&&this.scrollRef.current.scrollIntoView({behavior:"smooth",block:"center"})}}]),t}(u.Component);function D(s){var e=(0,u.useState)([]),t=(0,r.Z)(e,2),a=t[0],i=t[1],c=(0,u.useState)(0),l=(0,r.Z)(c,2),d=l[0],o=l[1],h=(0,u.useState)(""),m=(0,r.Z)(h,2),j=m[0],p=m[1];(0,u.useEffect)((function(){a.length>0&&s.setHitIndex(a[d].id)}),[a,d]),(0,u.useEffect)((function(){s.setHits(a)}),[a]);var v=function(s){if(1===s)d+1===a.length?o(0):o(d+1);else if(-1===s)o(0===d?a.length-1:d-1);else if(0===s){document.querySelector(".searchHit").scrollIntoView({behavior:"smooth",block:"center"})}};return(0,w.jsxs)(w.Fragment,{children:[(0,w.jsx)(I.Z.Text,{children:(0,w.jsx)(H.Z.Control,{type:"text",style:{padding:"2px 5px"},accessKey:"s",placeholder:"Suche nach Zitiertitel...",onKeyUp:function(){var e=(0,n.Z)(x().mark((function e(t){var r;return x().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(13!==t.keyCode){e.next=13;break}if(""!==t.target.value){e.next=5;break}i([]),e.next=13;break;case 5:if(t.target.value==j){e.next=12;break}return e.next=8,Q.Q[s.listName].search([{c:"search",o:"=",v:"*".concat(t.target.value,"*")}],{select:["id"]});case 8:(r=e.sent).length>0?(p(t.target.value),o(0),i(r)):i([]),e.next=13;break;case 12:v(1);case 13:case"end":return e.stop()}}),e)})));return function(s){return e.apply(this,arguments)}}()})}),a.length>0&&(0,w.jsx)(I.Z.Text,{children:(0,w.jsxs)("div",{style:{display:"flex",marginLeft:"20px",border:"1px solid var(--bs-gray-200)"},children:[(0,w.jsx)(k.Z,{size:"sm",variant:"outline-dark",style:{borderRadius:"0.2rem 0 0 0.2rem"},onClick:function(){v(-1)},disabled:1===a.length,children:(0,w.jsx)(B.G,{icon:T.DYF,style:{fontSize:"14px"}})}),(0,w.jsxs)("div",{style:{borderBottom:"1px solid var(--bs-gray-600)",borderTop:"1px solid var(--bs-gray-600)",padding:"5px 15px",margin:"0",cursor:"pointer"},onClick:function(){v(0)},children:[d+1," / ",a.length]}),(0,w.jsx)(k.Z,{size:"sm",variant:"outline-dark",style:{borderRadius:"0 0.2rem 0.2rem 0"},onClick:function(){v(1)},disabled:1===a.length,children:(0,w.jsx)(B.G,{icon:T.irl,style:{fontSize:"12px"}})})]})})]})}var W=function(s){(0,l.Z)(t,s);var e=(0,d.Z)(t);function t(s){var r;return(0,i.Z)(this,t),(r=e.call(this,s)).state={selectionDetail:null,cTrLst:[]},r}return(0,c.Z)(t,[{key:"render",value:function(){var s=this;return(0,w.jsxs)(w.Fragment,{children:[(0,w.jsx)(A.Z,{className:"mainBody",children:(0,w.jsx)(M,{getLst:(0,n.Z)(x().mark((function e(){return x().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:s.getLst();case 1:case"end":return e.stop()}}),e)}))),cTrLst:this.state.cTrLst,listName:this.props.listName,currentElements:this.state.currentElements,count:this.state.count,currentPage:this.state.currentPage,pageMax:this.state.pageMax,gridArea:this.state.selectionDetail?"2/1/2/2":"2/1/2/3",showDetail:function(e){s.setState({item:e})}})}),Q.Q.access("o_edit")&&this.state.item?(0,w.jsx)(R,{item:this.state.item,onUpdate:function(){s.setState({item:null})},onClose:function(){s.setState({item:null})},onReload:(0,n.Z)(x().mark((function e(){return x().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return s.setState({item:null}),e.next=3,s.getLst();case 3:case"end":return e.stop()}}),e)})))}):null]})}},{key:"componentDidMount",value:function(){this.getLst()}},{key:"componentDidUpdate",value:function(s){this.props.listName!=s.listName&&this.getLst(),this.scrollRef&&this.scrollRef.current.scrollIntoView({behavior:"smooth",block:"center"})}},{key:"getLst",value:function(){var s=(0,n.Z)(x().mark((function s(){var e,t,r;return x().wrap((function(s){for(;;)switch(s.prev=s.next){case 0:return this.setState({cTrLst:[]}),s.next=3,Q.Q[this.props.listName].getAll({count:!0});case 3:return e=s.sent,s.next=6,Q.Q[this.props.listName].getAll();case 6:t=s.sent,r=this.createOperaLists(t,this.props.listName),this.setState({cTrLst:r,oMax:Math.floor(e[0].count/this.resultsOnPage)+1,currentPage:1});case 9:case"end":return s.stop()}}),s,this)})));return function(){return s.apply(this,arguments)}}()},{key:"createOperaLists",value:function(s,e){var t,r=[],n=(0,a.Z)(s);try{for(n.s();!(t=n.n()).done;){var i=t.value,c=[];if(i.editions_id)for(var l=JSON.parse(i.editions_id),d=JSON.parse(i.editions_url),o=JSON.parse(i.editions_label),x=0;x<l.length;x++){var h="/site/argos/"+l[x],m="";d&&""!=d[x]&&(h=d[x],m=(0,w.jsxs)("span",{children:[" ",(0,w.jsx)(B.G,{style:{fontSize:"14px"},icon:T.Xjp})]}));var u="FEHLER!";o&&(u=o[x]),c.push((0,w.jsx)("li",{children:(0,w.jsxs)("a",{href:h,target:"_blank",rel:"noreferrer",children:[u,m]})},x))}if("opera_maiora"==e){var j="<aut>".concat(i.abbr,"</aut>"),p=i.full;i.work_id>0&&null===i.author_id&&(j="<span>&nbsp;&nbsp;&nbsp;".concat(i.abbr,"</span>"),p="<span>&nbsp;&nbsp;&nbsp;".concat(i.full,"</span>")),r.push({o:i,data:[(0,w.jsx)("td",{className:"c1",dangerouslySetInnerHTML:(0,z.rg)(i.date_display)},"0"),(0,w.jsx)("td",{className:"c2",dangerouslySetInnerHTML:(0,z.rg)(j)},"1"),(0,w.jsx)("td",{className:"c3",dangerouslySetInnerHTML:(0,z.rg)(p)},"2"),(0,w.jsxs)("td",{className:"c4",children:[(0,w.jsx)("span",{dangerouslySetInnerHTML:(0,z.rg)(i.bibliography)}),(0,w.jsx)("ul",{className:"noneLst",children:c})]},"3"),(0,w.jsx)("td",{className:"c5",dangerouslySetInnerHTML:(0,z.rg)(i.comment)},"4")]})}else if("opera_minora"===e)r.push({o:i,data:[(0,w.jsx)("td",{className:"c1_min",dangerouslySetInnerHTML:(0,z.rg)(i.date_display)},"0"),(0,w.jsx)("td",{className:"c2_min",dangerouslySetInnerHTML:(0,z.rg)(i.citation)},"1"),(0,w.jsxs)("td",{className:"c5_min",children:[(0,w.jsx)("span",{dangerouslySetInnerHTML:(0,z.rg)(i.bibliography)}),(0,w.jsx)("ul",{className:"noneLst",children:c})]},"2")]});else{if("tll_index"!==e)throw new Error("listname unknown!");var v=null;i.author_id>0&&(v="2rem"),r.push({o:i,data:[(0,w.jsx)("td",{className:"c1_tll",style:{paddingLeft:v},dangerouslySetInnerHTML:(0,z.rg)(i.date_display)},"0"),(0,w.jsx)("td",{className:"c2_tll",style:{paddingLeft:v},dangerouslySetInnerHTML:(0,z.rg)(i.abbr)},"1"),(0,w.jsx)("td",{className:"c3_tll",style:{paddingLeft:v},dangerouslySetInnerHTML:(0,z.rg)(i.ref)},"2"),(0,w.jsx)("td",{className:"c4_tll",style:{paddingLeft:v},dangerouslySetInnerHTML:(0,z.rg)(i.full)},"3"),(0,w.jsx)("td",{className:"c5_tll",style:{paddingLeft:v},dangerouslySetInnerHTML:(0,z.rg)(i.bibliography)},"4")]})}}}catch(f){n.e(f)}finally{n.f()}return r}}]),t}(u.Component)}}]);
//# sourceMappingURL=395.6af85bc5.chunk.js.map