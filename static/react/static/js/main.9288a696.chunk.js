(this["webpackJsonpmlw-react"]=this["webpackJsonpmlw-react"]||[]).push([[0],{26:function(e,t,n){},28:function(e,t,n){"use strict";n.r(t);var i=n(5),r=n.n(i),s=n(8),a=n(3),c=n(4),l=n(7),o=n(6),u=n(2),d=n.n(u),p=n(15),h=n.n(p),j=n(10),x=(n(26),n(9)),b=function(){function e(t,n,i){Object(a.a)(this,e),this.res=t,this.url=n,this.key=i}return Object(c.a)(e,[{key:"search",value:function(){var e=Object(s.a)(r.a.mark((function e(t){var n,i,s=arguments;return r.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return n=s.length>1&&void 0!==s[1]?s[1]:{},i="/data/".concat(this.res,"?query=").concat(JSON.stringify(t)),!0===n.count&&(i+="&count=1"),n.limit&&(i+="&limit="+n.limit),n.offset&&(i+="&offset="+n.offset),e.next=7,fetch(i,{headers:{Authorization:"Bearer ".concat(this.key)}}).then((function(e){if(200===e.status)return e.json();window.open("/","_self")}));case 7:return e.abrupt("return",e.sent);case 8:case"end":return e.stop()}}),e,this)})));return function(t){return e.apply(this,arguments)}}()}]),e}(),f=new(function(){function e(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"";Object(a.a)(this,e),this.url=t,this.key=null}return Object(c.a)(e,[{key:"open",value:function(){var e=Object(s.a)(r.a.mark((function e(t,n){var i,s,a,c,l,o,u=arguments;return r.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return i=u.length>2&&void 0!==u[2]?u[2]:null,e.next=3,fetch(this.url+"/session",{method:"post",headers:{"Content-Type":"application/json"},body:JSON.stringify({user:t,password:n})});case 3:if(200!==(s=e.sent).status){e.next=27;break}return e.next=7,s.text();case 7:return this.key=e.sent,e.next=10,fetch(this.url+"/session",{headers:{Authorization:"Bearer ".concat(this.key)}});case 10:if(a=e.sent,200!==s.status){e.next=17;break}return e.next=14,a.json();case 14:this.user=e.sent,e.next=18;break;case 17:return e.abrupt("return",!1);case 18:if(null!=i){e.next=22;break}return e.next=21,this.tables();case 21:i=e.sent;case 22:c=Object(x.a)(i);try{for(c.s();!(l=c.n()).done;)this[o=l.value]=new b(o,this.url,this.key)}catch(r){c.e(r)}finally{c.f()}return e.abrupt("return",!0);case 27:return e.abrupt("return",!1);case 28:case"end":return e.stop()}}),e,this)})));return function(t,n){return e.apply(this,arguments)}}()},{key:"close",value:function(){var e=Object(s.a)(r.a.mark((function e(){return r.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:this.key=null;case 1:case"end":return e.stop()}}),e,this)})));return function(){return e.apply(this,arguments)}}()}]),e}()),m=n(0),v=function(e){Object(l.a)(n,e);var t=Object(o.a)(n);function n(){return Object(a.a)(this,n),t.apply(this,arguments)}return Object(c.a)(n,[{key:"render",value:function(){return Object(m.jsxs)("div",{style:{padding:"20px 40px"},children:[Object(m.jsxs)("p",{children:[Object(m.jsx)("a",{href:"https://gitlab.lrz.de/haeberlin/dmlw/-/wikis/00-Start",children:"Hilfe und Informationen"})," zu dMLW finden Sie auf unsererer ",Object(m.jsx)("a",{href:"https://gitlab.lrz.de/haeberlin/dmlw",children:"GitLab-Seite"}),"."]}),Object(m.jsxs)("p",{children:["Informationen zu der aktuellen Version von dMLW und den Ver\xe4nderungen finden Sie ",Object(m.jsx)("a",{href:"https://gitlab.lrz.de/haeberlin/dmlw/-/blob/master/CHANGELOG.md",children:"in unserem Changelog"}),"."]}),Object(m.jsxs)("p",{children:["Informationen zum W\xf6rterbuch-Projekt auf ",Object(m.jsx)("a",{href:"www.mlw.badw.de",children:"www.mlw.badw.de"})]})]})}}]),n}(d.a.Component),O=n(12),g=function(e){Object(l.a)(n,e);var t=Object(o.a)(n);function n(e){var i;return Object(a.a)(this,n),(i=t.call(this,e)).item=e.item,i}return Object(c.a)(n,[{key:"render",value:function(){var e=this;return Object(m.jsxs)("div",{className:"searchFields",style:{boxShadow:"0 0.3px 4px #d9d9d9",marginRight:"10px",marginBottom:"10px",padding:"10px 15px 10px 15px",backgroundColor:"white"},children:[Object(m.jsxs)("select",{style:{width:"100px",marginRight:"0px",border:"none",color:"var(--mainColor)"},children:[Object(m.jsx)("option",{value:"lemma",children:"Lemma"}),Object(m.jsx)("option",{value:"type",children:"Typ"}),Object(m.jsx)("option",{value:"id",children:"ID"}),Object(m.jsx)("option",{value:"opus",children:"Werk"})]}),Object(m.jsxs)("select",{style:{width:"40px",marginRight:"0px",border:"none",color:"var(--mainColor)"},children:[Object(m.jsx)("option",{value:"=",children:"="}),Object(m.jsx)("option",{value:">",children:">"}),Object(m.jsx)("option",{value:"<",children:"<"})]}),Object(m.jsx)("input",{type:"text",placeholder:"...",style:{width:"100px",marginRight:"22px",border:"none"}}),Object(m.jsx)(j.a,{color:"LightGray",icon:O.a,onClick:function(){e.props.removeSearchFields(e.props.item.id)}})]})}}]),n}(d.a.Component),y=function(e){Object(l.a)(n,e);var t=Object(o.a)(n);function n(e){var i;return Object(a.a)(this,n),(i=t.call(this,e)).queryTxt="",i.state={nextID:1,searchFields:[{id:0,c:"lemma",o:"=",v:""}]},i}return Object(c.a)(n,[{key:"render",value:function(){var e,t=this,n=[],i=Object(x.a)(this.state.searchFields);try{for(i.s();!(e=i.n()).done;){var r=e.value;n.push(Object(m.jsx)(g,{removeSearchFields:function(e){t.removeSearchFields(e)},item:r},r.id))}}catch(s){i.e(s)}finally{i.f()}return Object(m.jsxs)("div",{style:{paddingBottom:"65px"},children:[Object(m.jsxs)("div",{style:{boxShadow:"0 0 2px #d9d9d9",backgroundColor:"rgb(253, 253, 253)",margin:"0 -20px 0 -20px",padding:"12px 24px",display:"flex",flexWrap:"wrap",alignItems:"center"},children:[n,Object(m.jsx)(j.a,{color:"LightGray",icon:O.b,style:{color:"var(--mainColor)",backgroundColor:"var(--mainBG)",position:"relative",top:"-5px",fontSize:"25px"},onClick:function(){t.addSearchFields()}})]}),Object(m.jsx)("input",{style:{float:"right",marginTop:"10px"},type:"button",value:"suchen",onClick:function(){t.sendQuery()}})]})}},{key:"removeSearchFields",value:function(e){var t=this.state.searchFields.filter((function(t){return t.id!=e}));this.setState({searchFields:t})}},{key:"addSearchFields",value:function(){var e=this.state.searchFields;e.push({id:this.state.nextID,c:"lemma",o:"=",v:""}),this.setState({nextID:this.state.nextID+1,searchFields:e})}},{key:"sendQuery",value:function(){var e,t=[],n=document.querySelectorAll(".searchFields"),i=Object(x.a)(n);try{for(i.s();!(e=i.n()).done;){var r=e.value;""!=r.children[2].value&&t.push({c:r.children[0].value,o:r.children[1].value,v:r.children[2].value})}}catch(s){i.e(s)}finally{i.f()}t.length>0?this.props.searchQuery(t):alert("Geben Sie einen Suchtext ein!")}}]),n}(d.a.Component),w=function(e){Object(l.a)(n,e);var t=Object(o.a)(n);function n(e){var i;return Object(a.a)(this,n),(i=t.call(this,e)).state={count:0},i}return Object(c.a)(n,[{key:"render",value:function(){var e=this;return Object(m.jsxs)("div",{style:{padding:"0 10px"},children:[Object(m.jsx)(y,{searchQuery:function(t){e.searchQuery(t)}}),Object(m.jsx)(k,{loadPage:function(t){e.loadPage(t)},currentElements:this.state.currentElements,count:this.state.count,currentPage:this.state.currentPage,pageMax:this.state.pageMax,styleRight:null!=this.state.itemDetail?"450px":"0px",showDetail:function(t){e.setState({itemDetail:t})}}),null!=this.state.itemDetail?Object(m.jsx)(C,{close:function(){e.setState({itemDetail:null})},item:this.state.itemDetail}):""]})}},{key:"searchQuery",value:function(){var e=Object(s.a)(r.a.mark((function e(t){var n,i;return r.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,f.zettel.search(t,{count:!0});case 2:return n=e.sent,e.next=5,f.zettel.search(t,{limit:100});case 5:i=e.sent,this.setState({query:t,count:n[0].count,pageMax:Math.floor(n[0].count/100)+1,currentPage:1,currentElements:i});case 7:case"end":return e.stop()}}),e,this)})));return function(t){return e.apply(this,arguments)}}()},{key:"loadPage",value:function(){var e=Object(s.a)(r.a.mark((function e(t){var n;return r.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(!(this.state.currentPage+t>0&&this.state.currentPage+t<=this.state.pageMax)){e.next=5;break}return e.next=3,f.zettel.search(this.state.query,{limit:100,offset:100*(this.state.currentPage+t-1)});case 3:n=e.sent,this.setState({currentPage:this.state.currentPage+t,currentElements:n});case 5:case"end":return e.stop()}}),e,this)})));return function(t){return e.apply(this,arguments)}}()}]),n}(d.a.Component),k=function(e){Object(l.a)(n,e);var t=Object(o.a)(n);function n(){return Object(a.a)(this,n),t.apply(this,arguments)}return Object(c.a)(n,[{key:"render",value:function(){var e=this;if(this.props.count>0){var t,n=[],i=Object(x.a)(this.props.currentElements);try{for(i.s();!(t=i.n()).done;){var r=t.value;n.push(Object(m.jsx)(S,{item:r,showDetail:function(t){e.props.showDetail(t)}},r.id))}}catch(s){i.e(s)}finally{i.f()}return Object(m.jsxs)("div",{style:{position:"absolute",right:this.props.styleRight,padding:"0 10px"},children:[Object(m.jsx)("div",{style:{position:"absolute",left:"50px"},children:Object(m.jsxs)("span",{className:"minorTxt",children:[this.props.count," Treffer"]})}),Object(m.jsxs)("div",{id:"navItems",children:[Object(m.jsx)("span",{onClick:function(){e.props.loadPage(-1)},children:"<"}),Object(m.jsxs)("span",{id:"navSelect",children:[this.props.currentPage," von ",this.props.pageMax]}),Object(m.jsx)("span",{onClick:function(){e.props.loadPage(1)},children:">"})]}),Object(m.jsx)("div",{className:"zettel_box",children:n})]})}return""}}]),n}(d.a.Component),S=function(e){Object(l.a)(n,e);var t=Object(o.a)(n);function n(){return Object(a.a)(this,n),t.apply(this,arguments)}return Object(c.a)(n,[{key:"render",value:function(){var e=this,t=this.props.item,n={width:"500px"};if(null!=t.img_path){var i="";return 0==t.in_use?i+="zettel_img no_use":i+="zettel_img in_use",Object(m.jsxs)("div",{className:"zettel",id:t.id,style:n,onDoubleClick:function(){e.props.showDetail(e.props.item)},children:[Object(m.jsx)("img",{className:i,src:t.img_path+".jpg"}),",",Object(m.jsx)("div",{className:"zettel_msg"}),",",Object(m.jsxs)("div",{className:"zettel_menu",children:[Object(m.jsx)("span",{style:{float:"left"},children:t.lemma_display}),Object(m.jsx)("span",{style:{float:"right"},children:t.opus})]})]})}return n.height="var(--zettelHeight)",Object(m.jsx)("div",{className:"zettel",id:t.id,style:n,onDoubleClick:function(){e.props.showDetail(e.props.item)},children:Object(m.jsxs)("div",{className:"digitalZettel",children:[Object(m.jsx)("div",{className:"digitalZettelLemma",children:t.lemma_display}),Object(m.jsx)("div",{className:"digitalZettelDate",children:t.date_display}),Object(m.jsx)("div",{className:"digitalZettelWork",children:t.opus}),Object(m.jsx)("div",{className:"digitalZettelText",children:t.txt})]})})}}]),n}(d.a.Component),C=function(e){Object(l.a)(n,e);var t=Object(o.a)(n);function n(){return Object(a.a)(this,n),t.apply(this,arguments)}return Object(c.a)(n,[{key:"render",value:function(){var e=this;return Object(m.jsxs)("div",{style:{position:"fixed",top:0,bottom:0,right:0,width:"400px",padding:"10px 15px",backgroundColor:"white",boxShadow:"rgb(60, 110, 113) 0px 0px 2px"},children:[Object(m.jsx)("div",{style:{position:"absolute",top:"10px",right:"20px"},onClick:function(){e.props.close()},accessKey:"w",children:Object(m.jsx)(j.a,{icon:O.c})}),Object(m.jsxs)("div",{style:{display:"grid",gridTemplateColumns:"150px auto",gridTemplateRows:"1fr 0px 1fr 1fr 1fr",rowGap:"10px",margin:"10px 0 30px 0"},children:[Object(m.jsx)("div",{style:{gridArea:"1/1/1/2",textAlign:"left"},children:Object(m.jsxs)("i",{children:["ID: ",this.props.item.id]})}),Object(m.jsx)("div",{style:{gridArea:"3/1/3/2"},children:"Zetteltyp:"}),Object(m.jsx)("div",{style:{gridArea:"3/2/3/3"},children:Object(m.jsxs)("select",{value:this.props.item.type,children:[Object(m.jsx)("option",{value:"0",children:"..."}),Object(m.jsx)("option",{value:"1",children:"verzettel"}),Object(m.jsx)("option",{value:"2",children:"Exzerpt"}),Object(m.jsx)("option",{value:"3",children:"Index"}),Object(m.jsx)("option",{value:"4",children:"Literatur"})]})}),Object(m.jsx)("div",{style:{gridArea:"4/1/4/2"},children:"Lemma:"}),Object(m.jsx)("div",{style:{gridArea:"4/2/4/3"},children:Object(m.jsx)("input",{type:"text",value:this.props.item.lemma_display})}),Object(m.jsx)("div",{style:{gridArea:"5/1/5/2"},children:"Werk:"}),Object(m.jsx)("div",{style:{gridArea:"5/2/5/3"},children:Object(m.jsx)("input",{type:"text",value:this.props.item.opus})})]}),Object(m.jsxs)("div",{style:{borderTop:"1px solid rgb(186, 203, 205)",paddingTop:"30px",display:"grid",gridTemplateColumns:"150px auto",gridTemplateRows:"1fr",rowGap:"10px",margin:"10px 0 30px 0"},children:[Object(m.jsx)("div",{style:{gridArea:"1/1/1/2"},children:"Datierung:"}),Object(m.jsx)("div",{style:{gridArea:"1/2/1/3"},children:this.props.item.date_display})]}),Object(m.jsxs)("div",{style:{borderTop:"1px solid rgb(186, 203, 205)",paddingTop:"30px"},children:[Object(m.jsx)("div",{style:{gridArea:"7/1/7/2"},children:"Ressourcen:"}),Object(m.jsx)("div",{style:{gridArea:"7/2/7/3"},children:"x"}),Object(m.jsx)("div",{style:{gridArea:"6/1/6/2"},children:"Text:"}),Object(m.jsx)("div",{style:{gridArea:"6/2/6/3"},children:this.props.item.txt}),Object(m.jsx)("div",{style:{gridArea:"8/2/8/3"},v:!0,children:Object(m.jsx)("input",{type:"button",value:"speichern"})})]})]})}}]),n}(d.a.Component),z="#3c6e71",A=function(e){Object(l.a)(n,e);var t=Object(o.a)(n);function n(e){var i;Object(a.a)(this,n);return(i=t.call(this,e)).state={menuEntries:{"Zettel- und Wortmaterial":{visible:!1,items:{"Zettel-Datenbank":"zettel"}},Einstellungen:{visible:!1,items:{Hilfe:"help",abmelden:"logout"}}},currentSubmenu:null},i}return Object(c.a)(n,[{key:"render",value:function(){var e=this,t={position:"fixed",top:0,left:0,boxShadow:"0 0 2px ".concat(z),padding:"10px 15px",zIndex:1e6,backgroundColor:"white"},n=[];if(1===this.props.onTop){t.right=0,t.display="flex",t.position="absolute",t.justifyContent="space-evenly";var i=-1,r=function(t){i++;var r="";if(e.state.currentSubmenu===t){var s=[],a=function(n){s.push(Object(m.jsx)("div",{style:{margin:"10px 0 10px 10px"},onClick:function(){e.setState({currentSubmenu:""}),e.props.loadMain(e.state.menuEntries[t].items[n])},children:n},n))};for(var c in e.state.menuEntries[t].items)a(c);r=Object(m.jsx)("div",{style:{position:"absolute",boxShadow:"rgb(60, 110, 113) 0px 0px 2px",backgroundColor:"white",top:"43px",padding:"10px 25px",marginLeft:"-10px"},children:s},s)}n.push(Object(m.jsxs)("div",{children:[Object(m.jsx)("span",{onClick:function(){e.setState({currentSubmenu:t})},children:t}),r]},i))};for(var s in this.state.menuEntries)r(s)}else{t.transition="left 0.5s",this.state.hidden&&(t.left="-290px"),t.bottom="0",t.width="300px";var a=-1,c=function(t){n.push(Object(m.jsx)("div",{style:{marginTop:"15px"},children:t},t));var i=function(i){a++,n.push(Object(m.jsx)("div",{style:{marginLeft:"15px",display:"inline-block"},onClick:function(){e.props.loadMain(e.state.menuEntries[t].items[i])},children:i},i)),n.push(Object(m.jsx)("br",{},a))};for(var r in e.state.menuEntries[t].items)i(r)};for(var l in this.state.menuEntries)c(l)}return Object(m.jsx)("nav",{className:"mainMenu",style:t,onClick:function(){1!=e.props.onTop&&(e.state.hidden?e.setState({hidden:!1}):e.setState({hidden:!0}))},children:n})}}]),n}(d.a.Component),T=function(e){Object(l.a)(n,e);var t=Object(o.a)(n);function n(e){var i;Object(a.a)(this,n);i=t.call(this,e);var r=1;return window.innerWidth<1e3&&(r=0),i.state={login:!1,res:null,mainMenuPos:r},window.addEventListener("resize",(function(){window.innerWidth<1e3?i.setState({mainMenuPos:0}):i.setState({mainMenuPos:1})})),i}return Object(c.a)(n,[{key:"loadMain",value:function(e){"logout"===e?(f.close(),this.setState({login:!1,res:null})):this.setState({res:e})}},{key:"render",value:function(){var e=this;if(this.state.login){var t=null;switch(this.state.res){case null:break;case"help":t=Object(m.jsx)(v,{});break;case"zettel":t=Object(m.jsx)(w,{});break;default:throw"UNKNOWN RES IN 'loadMain': ".concat(this.state.res)}return Object(m.jsxs)("div",{style:1===this.state.mainMenuPos?{marginTop:"60px"}:{marginLeft:"40px"},children:[Object(m.jsx)(A,{onTop:this.state.mainMenuPos,loadMain:function(t){e.loadMain(t)}}),t]})}return Object(m.jsx)("div",{style:{position:"absolute",display:"grid",height:"100%",width:"100%",gridTemplateColumns:"1fr 2fr 1fr",gridTemplateRows:"1fr 2fr 1fr"},children:Object(m.jsxs)("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gridTemplateRows:"auto 100px 50px 50px 50px auto",gridColumn:"2",gridRow:"2",padding:"10px 15px",borderRadius:"5px",boxShadow:"0 1.2px 6px ".concat(z)},children:[Object(m.jsx)("h1",{style:{textAlign:"center",gridArea:"2/2/2/4"},children:"dMLW"}),Object(m.jsx)("span",{style:{gridArea:"3/2/3/3"},children:"Email:"}),Object(m.jsx)("div",{style:{gridArea:"3/3/3/4"},children:Object(m.jsx)("input",{type:"text",name:"email",style:{width:"300px"}})}),Object(m.jsx)("span",{style:{gridArea:"4/2/4/3"},children:"Passwort:"}),Object(m.jsx)("div",{style:{gridArea:"4/3/4/4"},children:Object(m.jsx)("input",{type:"password",name:"password",style:{width:"300px"}})}),Object(m.jsx)("div",{style:{gridArea:"5/3/5/4"},children:Object(m.jsx)("input",{type:"submit",value:"anmelden",onClick:function(){e.login()}})})]})})}},{key:"login",value:function(){var e=Object(s.a)(r.a.mark((function e(){var t,n,i;return r.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(t=document.querySelector("input[name=email]").value,n=document.querySelector("input[name=password]").value,i=["zettel"],e.t0=""!=t&&""!=n,!e.t0){e.next=8;break}return e.next=7,f.open(t,n,i);case 7:e.t0=e.sent;case 8:if(!e.t0){e.next=12;break}this.setState({login:!0}),e.next=13;break;case 12:alert("Geben Sie eine g\xfcltige Email-Adresse und Passwort ein!");case 13:case"end":return e.stop()}}),e,this)})));return function(){return e.apply(this,arguments)}}()}]),n}(d.a.Component);h.a.render(Object(m.jsx)(T,{}),document.getElementById("root"))}},[[28,1,2]]]);
//# sourceMappingURL=main.9288a696.chunk.js.map