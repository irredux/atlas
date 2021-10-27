(this["webpackJsonpmlw-react"]=this["webpackJsonpmlw-react"]||[]).push([[0],{27:function(t,e,n){},29:function(t,e,n){"use strict";n.r(e);var a=n(1),s=n.n(a),r=n(3),i=n(7),c=n(8),o=n(10),u=n(9),l=n(6),d=n.n(l),p=n(15),h=n.n(p),x=n(4),f=n(5),b=(n(27),n(11)),m=function(){function t(e,n,a){Object(i.a)(this,t),this.tblName=e,this.url=n,this.key=a}return Object(c.a)(t,[{key:"getAll",value:function(){var t=Object(r.a)(s.a.mark((function t(){var e,n=arguments;return s.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return e=n.length>0&&void 0!==n[0]?n[0]:{},t.next=3,this.search([{c:"id",o:">",v:0}],e);case 3:return t.abrupt("return",t.sent);case 4:case"end":return t.stop()}}),t,this)})));return function(){return t.apply(this,arguments)}}()},{key:"get",value:function(){var t=Object(r.a)(s.a.mark((function t(e){var n,a,r,i=arguments;return s.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:for(r in n=i.length>1&&void 0!==i[1]?i[1]:{},a=[],e)a.push({c:r,o:"=",v:e[r]});return t.next=5,this.search(a,n);case 5:return t.abrupt("return",t.sent);case 6:case"end":return t.stop()}}),t,this)})));return function(e){return t.apply(this,arguments)}}()},{key:"search",value:function(){var t=Object(r.a)(s.a.mark((function t(e){var n,a,r=arguments;return s.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return n=r.length>1&&void 0!==r[1]?r[1]:{},a="".concat(this.url,"/data/").concat(this.tblName,"?query=").concat(JSON.stringify(e)),!0===n.count&&(a+="&count=1"),n.limit&&(a+="&limit="+n.limit),n.offset&&(a+="&offset="+n.offset),n.select&&(a+="&select="+JSON.stringify(n.select)),n.order&&(a+="&order="+JSON.stringify(n.order)),a=encodeURI(a),t.next=10,fetch(a,{headers:{Authorization:"Bearer ".concat(this.key)}}).then((function(t){if(200===t.status)return t.json();var e=new CustomEvent("arachneError",{detail:{method:"search",status:t.status}});window.dispatchEvent(e)}));case 10:return t.abrupt("return",t.sent);case 11:case"end":return t.stop()}}),t,this)})));return function(e){return t.apply(this,arguments)}}()},{key:"delete",value:function(){var t=Object(r.a)(s.a.mark((function t(e){var n,a,r,i;return s.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return n="".concat(this.url,"/data/").concat(this.tblName,"/").concat(e),a=null,Array.isArray(e)&&(n="".concat(this.url,"/data_batch/").concat(this.tblName),a=JSON.stringify(e)),t.next=5,fetch(n,{method:"delete",headers:{Authorization:"Bearer ".concat(this.key),"Content-Type":"application/json"},body:a});case 5:if(200!==(r=t.sent).status){t.next=10;break}return t.abrupt("return",!0);case 10:i=new CustomEvent("arachneError",{detail:{method:"delete",status:r.status}}),window.dispatchEvent(i);case 12:case"end":return t.stop()}}),t,this)})));return function(e){return t.apply(this,arguments)}}()},{key:"save",value:function(){var t=Object(r.a)(s.a.mark((function t(e){var n,a,r,i,c;return s.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return n="POST",a="",r=1,Array.isArray(e)?a="".concat(this.url,"/data_batch/").concat(this.tblName):(a="".concat(this.url,"/data/").concat(this.tblName),r=e.id,null!=e.id&&(a+="/".concat(e.id),n="PATCH",delete e.id)),t.next=6,fetch(a,{method:n,headers:{"Content-Type":"application/json",Authorization:"Bearer ".concat(this.key)},body:JSON.stringify(e)});case 6:if(201!==(i=t.sent).status||"POST"!==n){t.next=21;break}if(!Array.isArray(e)){t.next=14;break}return t.next=11,r;case 11:return t.abrupt("return",t.sent);case 14:return t.t0=parseInt,t.next=17,i.text();case 17:return t.t1=t.sent,t.abrupt("return",(0,t.t0)(t.t1));case 19:t.next=27;break;case 21:if(200!==i.status||"PATCH"!==n){t.next=25;break}return t.abrupt("return",r);case 25:c=new CustomEvent("arachneError",{detail:{method:"save",status:i.status}}),window.dispatchEvent(c);case 27:case"end":return t.stop()}}),t,this)})));return function(e){return t.apply(this,arguments)}}()}]),t}(),j=new(function(){function t(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"";Object(i.a)(this,t),""===e&&"http://localhost:3000"===window.location.origin?this.url="http://localhost:8080":this.url=e,this.key=null,this.me=null;var n=localStorage.getItem("dmlwOptions");n?(n=JSON.parse(n),this.options={z_width:n.z_width?n.z_width:500}):this.options={z_width:500}}return Object(c.a)(t,[{key:"setOptions",value:function(t,e){this.options[t]=e,localStorage.setItem("dmlwOptions",JSON.stringify(this.options))}},{key:"login",value:function(){var t=Object(r.a)(s.a.mark((function t(e,n){var a,r,i=arguments;return s.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return a=i.length>2&&void 0!==i[2]?i[2]:null,t.next=3,fetch(this.url+"/session",{method:"post",headers:{"Content-Type":"application/json"},body:JSON.stringify({user:e,password:n})});case 3:if(200!==(r=t.sent).status){t.next=11;break}return t.next=7,r.text();case 7:return this.key=t.sent,t.abrupt("return",this.open(a));case 11:return t.abrupt("return",!1);case 12:case"end":return t.stop()}}),t,this)})));return function(e,n){return t.apply(this,arguments)}}()},{key:"open",value:function(){var t=Object(r.a)(s.a.mark((function t(){var e,n,a,r,i,c=arguments;return s.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return e=c.length>0&&void 0!==c[0]?c[0]:null,t.next=3,this.getUser();case 3:if(!(n=t.sent)){t.next=10;break}this.me=n,this.me.selectKey="ctrl",navigator.appVersion.indexOf("Mac")>-1&&(this.me.selectKey="cmd"),t.next=11;break;case 10:return t.abrupt("return",!1);case 11:if(null!=e){t.next=15;break}return t.next=14,this.tables();case 14:e=t.sent;case 15:a=Object(b.a)(e);try{for(a.s();!(r=a.n()).done;)this[i=r.value]=new m(i,this.url,this.key)}catch(s){a.e(s)}finally{a.f()}return t.abrupt("return",!0);case 18:case"end":return t.stop()}}),t,this)})));return function(){return t.apply(this,arguments)}}()},{key:"close",value:function(){var t=Object(r.a)(s.a.mark((function t(){return s.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:this.key=null;case 1:case"end":return t.stop()}}),t,this)})));return function(){return t.apply(this,arguments)}}()},{key:"getUser",value:function(){var t=Object(r.a)(s.a.mark((function t(){var e;return s.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,fetch(this.url+"/session",{headers:{Authorization:"Bearer ".concat(this.key)}});case 2:if(200!==(e=t.sent).status){t.next=9;break}return t.next=6,e.json();case 6:return t.abrupt("return",t.sent);case 9:return t.abrupt("return",!1);case 10:case"end":return t.stop()}}),t,this)})));return function(){return t.apply(this,arguments)}}()},{key:"createAccount",value:function(){var t=Object(r.a)(s.a.mark((function t(e){var n;return s.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,fetch(this.url+"/data/user",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(e)});case 2:return n=t.sent,t.abrupt("return",n.status);case 4:case"end":return t.stop()}}),t,this)})));return function(e){return t.apply(this,arguments)}}()},{key:"importScans",value:function(){var t=Object(r.a)(s.a.mark((function t(e){var n;return s.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,fetch(this.url+"/file/scan",{method:"POST",headers:{Authorization:"Bearer ".concat(this.key)},body:e});case 2:return n=t.sent,t.t0=n.status,t.next=6,n.json();case 6:return t.t1=t.sent,t.abrupt("return",{status:t.t0,body:t.t1});case 8:case"end":return t.stop()}}),t,this)})));return function(e){return t.apply(this,arguments)}}()},{key:"exec",value:function(){var t=Object(r.a)(s.a.mark((function t(e){var n;return s.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,fetch(this.url+"/exec/"+e,{method:"GET",headers:{Authorization:"Bearer ".concat(this.key)}});case 2:return n=t.sent,t.abrupt("return",n.status);case 4:case"end":return t.stop()}}),t,this)})));return function(e){return t.apply(this,arguments)}}()},{key:"access",value:function(t){var e=this;return!!this.me&&("string"===typeof t&&(t=JSON.parse('["'.concat(t,'"]'))),t.every((function(t){return e.me.access.includes(t)})))}},{key:"getScan",value:function(){var t=Object(r.a)(s.a.mark((function t(e){var n,a;return s.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,fetch("".concat(this.url,"/file/scan/").concat(e),{headers:{Authorization:"Bearer ".concat(this.key)}}).then((function(t){return t.blob()}));case 2:return n=t.sent,a=URL.createObjectURL(n),t.abrupt("return",a);case 5:case"end":return t.stop()}}),t,this)})));return function(e){return t.apply(this,arguments)}}()}]),t}()),v=n(16),y=n.n(v),g=n(0),O=function(t){Object(o.a)(n,t);var e=Object(u.a)(n);function n(t){var a;return Object(i.a)(this,n),(a=e.call(this,t)).item=t.item,a}return Object(c.a)(n,[{key:"render",value:function(){var t,e=this,n=[],a=Object(b.a)(this.props.searchOptions);try{for(a.s();!(t=a.n()).done;){var s=t.value;n.push(Object(g.jsx)("option",{value:s[0],children:s[1]},s[0]))}}catch(r){a.e(r)}finally{a.f()}return Object(g.jsxs)("div",{className:"searchFields mainColors",style:{boxShadow:"rgb(217, 217, 217) 0px 0px 2px",marginRight:"10px",marginBottom:"10px",padding:"10px 15px 10px 15px"},children:[Object(g.jsx)("select",{style:{width:"100px",marginRight:"0px",border:"none",color:"#284b63"},children:n}),Object(g.jsxs)("select",{style:{width:"40px",marginRight:"0px",border:"none",color:"#284b63"},children:[Object(g.jsx)("option",{value:"=",children:"="}),Object(g.jsx)("option",{value:"!=",children:"\u2260"}),Object(g.jsx)("option",{value:">",children:">"}),Object(g.jsx)("option",{value:">=",children:"\u2265"}),Object(g.jsx)("option",{value:"<",children:"<"}),Object(g.jsx)("option",{value:"<=",children:"\u2264"})]}),Object(g.jsx)("input",{type:"text",placeholder:"...",style:{width:"100px",marginRight:"22px",border:"none"},onKeyUp:function(t){13===t.keyCode&&e.props.clickButton()}}),Object(g.jsx)(x.a,{color:"LightGray",icon:f.l,onClick:function(){e.props.removeSearchFields(e.props.item.id)}})]})}}]),n}(d.a.Component),w=(d.a.Component,d.a.Component,function(t){Object(o.a)(n,t);var e=Object(u.a)(n);function n(t){var a;return Object(i.a)(this,n),(a=e.call(this,t)).state={id:a.props.status.id,visible:!1},a.statusBox=d.a.createRef(),a.timeOutHandle=null,a}return Object(c.a)(n,[{key:"render",value:function(){var t=this;if(this.state.visible){var e="",n=null;switch(this.state.type){case"searching":n=Object(g.jsx)("div",{style:{display:"inline-block",backgroundColor:"#246EB9"},children:Object(g.jsx)(x.a,{color:"#FDFFFC",style:{padding:"3px",fontSize:"40px"},icon:f.n,spin:!0})}),e="Suche l\xe4uft...",null!=this.timeOutHandle&&clearTimeout(this.timeOutHandle);break;case"found":n=Object(g.jsx)(x.a,{color:"#FDFFFC",style:{padding:"3px",backgroundColor:"#4CB944",fontSize:"40px"},icon:f.h}),e="Eintr\xe4ge gefunden!",null!=this.timeOutHandle&&clearTimeout(this.timeOutHandle),this.timeOutHandle=setTimeout((function(){t.statusBox.current.style.opacity="0",setTimeout((function(){t.setState({visible:!1})}),500)}),3e3);break;case"notFound":n=Object(g.jsx)(x.a,{color:"#FDFFFC",style:{padding:"3px",backgroundColor:"#353535",fontSize:"40px"},icon:f.d}),e="Keine Eintr\xe4ge gefunden!",null!=this.timeOutHandle&&clearTimeout(this.timeOutHandle),this.timeOutHandle=setTimeout((function(){t.statusBox.current.style.opacity="0",setTimeout((function(){t.setState({visible:!1})}),500)}),3e3);break;case"saved":n=Object(g.jsx)(x.a,{color:"#FDFFFC",style:{padding:"3px",backgroundColor:"#4CB944",fontSize:"40px"},icon:f.e}),e="Speichern erfolgreich.",null!=this.timeOutHandle&&clearTimeout(this.timeOutHandle),this.timeOutHandle=setTimeout((function(){t.statusBox.current.style.opacity="0",setTimeout((function(){t.setState({visible:!1})}),500)}),2e3);break;case"error":n=Object(g.jsx)(x.a,{color:"#FDFFFC",style:{padding:"3px",backgroundColor:"#F06543",fontSize:"40px"},icon:f.o}),e="Ein Fehler ist aufgetreten.",null!=this.timeOutHandle&&clearTimeout(this.timeOutHandle),this.timeOutHandle=setTimeout((function(){t.statusBox.current.style.opacity="0",setTimeout((function(){t.setState({visible:!1})}),500)}),3e3);break;case"saving":e="Eintr\xe4ge werden gespeichert.",n=Object(g.jsx)("div",{style:{display:"inline-block",backgroundColor:"#246EB9"},children:Object(g.jsx)(x.a,{color:"#FDFFFC",style:{padding:"3px",fontSize:"40px"},icon:f.n,spin:!0})}),null!=this.timeOutHandle&&clearTimeout(this.timeOutHandle),this.timeOutHandle=null;break;default:e="Programm arbeitet.",n=Object(g.jsx)(x.a,{color:"#FDFFFC",style:{padding:"3px",backgroundColor:"#F5EE9E",fontSize:"40px"},icon:f.f}),null!=this.timeOutHandle&&clearTimeout(this.timeOutHandle),this.timeOutHandle=setTimeout((function(){t.statusBox.current.style.opacity="0",setTimeout((function(){t.setState({visible:!1})}),500)}),2e3)}return null!=this.state.value&&(e=this.state.value),Object(g.jsxs)("div",{ref:this.statusBox,style:{position:"fixed",bottom:"30px",left:"30px",boxShadow:"0 2px 5px #d9d9d9",transition:"opacity 0.5s",opacity:"1",borderRadius:"3px",overflow:"hidden",zIndex:9e6},className:"mainColors",children:[n,Object(g.jsx)("span",{style:{position:"relative",top:"-10px",padding:"10px 20px"},children:e})]})}return null}},{key:"componentDidUpdate",value:function(){this.props.status.id!=this.state.id&&this.setState({id:this.props.status.id,visible:!0,type:this.props.status.type,value:this.props.status.value})}}]),n}(d.a.Component)),k=function(t){Object(o.a)(n,t);var e=Object(u.a)(n);function n(){return Object(i.a)(this,n),e.apply(this,arguments)}return Object(c.a)(n,[{key:"render",value:function(){var t,e=this,n=[],a=Object(b.a)(this.props.options);try{for(a.s();!(t=a.n()).done;){var s=t.value;n.push(Object(g.jsx)("option",{value:s[0],children:s[1]},s[0]))}}catch(r){a.e(r)}finally{a.f()}return Object(g.jsxs)("div",{style:this.props.style,children:[Object(g.jsx)("select",{className:this.props.classList,value:this.props.value,style:{width:"100%"},onChange:function(t){e.props.onChange(t)},children:n}),Object(g.jsx)("div",{style:{pointerEvents:"none",textAlign:"right",margin:"-26px 10px 0 0"},children:Object(g.jsx)(x.a,{color:"LightGray",icon:f.a})})]})}}]),n}(d.a.Component),S=(d.a.Component,function(t){Object(o.a)(n,t);var e=Object(u.a)(n);function n(t){return Object(i.a)(this,n),e.call(this,t)}return Object(c.a)(n,[{key:"render",value:function(){var t=this;return Object(g.jsx)("div",{className:"selectWrapper"+("1"===this.props.isSelected?" selMarked":""),style:{transition:"box-shadow 0.3s",margin:"10px 5px"},id:this.props.children.props.id,ref:this.element,onClick:function(t){t.stopPropagation()},onMouseUp:function(e){t.props.onSelect(t.props.children,{shift:e.shiftKey,meta:e.metaKey,ctrl:e.ctrlKey})},children:this.props.children})}}]),n}(d.a.Component));d.a.Component;function C(t){return null==t?{__html:null}:{__html:y.a.sanitize(t.replace(/&lt;/g,"<").replace(/&gt;/g,">"),{ADD_TAGS:["aut","gruen","gelb","rot","blau"]})}}var T=function(t){Object(o.a)(n,t);var e=Object(u.a)(n);function n(t){var a;return Object(i.a)(this,n),(a=e.call(this,t)).state={mode:"img",imgURL:null,fullTextEdit:!1,scanLst:[],scanLstSelected:[]},window.addEventListener("keyup",(function(t){37===t.keyCode&&a.state.cIndex>0?a.setState({cIndex:a.state.cIndex-1}):39===t.keyCode&&a.state.cIndex<a.state.scanLst.length-1&&a.setState({cIndex:a.state.cIndex+1})})),a}return Object(c.a)(n,[{key:"render",value:function(){var t=this,e=[];if(this.state.contentMenu){var n,a=-1,i=Object(b.a)(this.state.scanLst);try{for(i.s();!(n=i.n()).done;){var c=n.value;a++,e.push(Object(g.jsxs)("li",{children:[c.full_text?Object(g.jsx)(x.a,{icon:f.k,style:{fontSize:"10px",margin:"0 5px 1px 0"}}):null,Object(g.jsx)("a",{id:a,style:{color:this.state.scanLstSelected.includes(c.id)?"red":"inherit"},onClick:function(e){t.setState({cIndex:parseInt(e.target.id),contentMenu:!1})},children:isNaN(c.filename)?c.filename:parseInt(c.filename)})]},a))}}catch(l){i.e(l)}finally{i.f()}}var o={margin:"20px 40px 65px 40px",display:"grid",gridTemplateColumns:"img"===this.state.mode||"text"===this.state.mode?"1fr":"1fr 1fr",gridTemplateRows:"1fr",columnGap:"20px"},u=Object(g.jsx)("i",{children:"Kein Flie\xdftext verf\xfcgbar."});return this.state.txt&&!this.state.fullTextEdit?u=Object(g.jsx)("span",{style:{fontSize:"18px"},dangerouslySetInnerHTML:C(this.state.txt.replace(new RegExp("".concat(this.state.currentQuery),"g"),"<mark>".concat(this.state.currentQuery,"</mark>")).replace(/\n/g,"<br />"))}):this.state.fullTextEdit&&(u=Object(g.jsx)("textarea",{style:{outline:"none",resize:"none",width:"100%",height:"500px"},value:this.state.txt?this.state.txt:"",onChange:function(e){t.setState({txt:e.target.value})},onBlur:function(e){t.props.status("saving"),j.scan.save({id:t.state.scanLst[t.state.cIndex].scan_id,full_text:e.target.value}),t.props.status("saved")}})),Object(g.jsxs)("div",{children:[Object(g.jsxs)("main",{style:o,children:[this.state.imgURL&&("img"===this.state.mode||"split"===this.state.mode)&&Object(g.jsx)("div",{style:{boxShadow:"0 2px 3px gray"},children:Object(g.jsx)("img",{src:this.state.imgURL,style:{width:"100%"}})}),("text"===this.state.mode||"split"===this.state.mode)&&Object(g.jsxs)("div",{style:{boxShadow:"0 2px 3px gray",padding:"20px 40px",position:"relative"},children:[Object(g.jsxs)("div",{className:"minorTxt",style:{textAlign:"center",marginBottom:"30px"},children:[Object(g.jsx)("span",{dangerouslySetInnerHTML:C(this.state.title)}),Object(g.jsx)("span",{style:{float:"right"},children:this.state.page})]}),Object(g.jsx)("div",{style:{textAlign:"justify"},children:u}),j.access("e_edit")?Object(g.jsx)(x.a,{icon:f.i,style:{position:"absolute",bottom:"10px",right:"10px",color:"gray"},onClick:function(){t.state.fullTextEdit?t.setState({fullTextEdit:!1}):t.setState({fullTextEdit:!0})}}):null]}),this.state.cIndex>0?Object(g.jsx)("div",{className:"leftArrow",onClick:function(){t.setState({cIndex:t.state.cIndex-1})}}):null,this.state.cIndex<this.state.scanLst.length-1?Object(g.jsx)("div",{className:"rightArrow",onClick:function(){t.setState({cIndex:t.state.cIndex+1})}}):null]}),this.state.contentMenu?Object(g.jsxs)("div",{className:"mainColors",style:{position:"fixed",top:"0",left:"0",bottom:"0",width:"150px",boxShadow:"0 0 2px gray",padding:"20px 20px",overflow:"scroll"},children:[Object(g.jsx)("h4",{children:"Inhalt"}),Object(g.jsx)("ul",{style:{listStyleType:"none",margin:"0",padding:"0"},children:e}),Object(g.jsx)("div",{style:{height:"70px"}}),Object(g.jsx)("div",{className:"mainColors",style:{position:"fixed",bottom:"42px",left:"0",width:"180px",borderTop:"0.5px solid gray",padding:"4px 5px"},children:Object(g.jsx)("input",{type:"text",style:{margin:"3px 1px",padding:"0",boxShadow:"none",width:"170px"},onKeyUp:function(){var e=Object(r.a)(s.a.mark((function e(n){var a;return s.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(13!==n.keyCode){e.next=5;break}return e.next=3,j.scan_lnk.search([{c:"edition_id",o:"=",v:t.props.edition},{c:"full_text",o:"=",v:"*".concat(n.target.value,"*")}],{select:["id"]});case 3:a=e.sent,t.setState({currentQuery:n.target.value,scanLstSelected:a.map((function(t){return t.id}))});case 5:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}()})})]}):null,Object(g.jsxs)("footer",{className:"mainColors",style:{position:"fixed",bottom:"0",right:"0",left:"0",boxShadow:"0 0 2px gray",display:"grid",gridTemplateColumns:"1fr 1fr"},children:[Object(g.jsx)("div",{children:Object(g.jsx)(x.a,{icon:f.c,style:{fontSize:"30px",margin:"5px 0 2px 25px"},onClick:function(){t.state.contentMenu?t.setState({contentMenu:!1}):t.setState({contentMenu:!0})}})}),Object(g.jsxs)("div",{style:{textAlign:"right"},children:[Object(g.jsx)(x.a,{icon:f.j,style:{fontSize:"35px",margin:"5px 25px 3px 0"},onClick:function(){t.setState({mode:"img"})}}),Object(g.jsx)(x.a,{icon:f.g,style:{fontSize:"30px",margin:"0 20px 5px 0"},onClick:function(){t.setState({mode:"split"})}}),Object(g.jsx)(x.a,{icon:f.k,style:{fontSize:"33px",margin:"0 30px 4px 0"},onClick:function(){t.setState({mode:"text"})}})]})]})]})}},{key:"componentDidMount",value:function(){var t=this;(function(){var e=Object(r.a)(s.a.mark((function e(){var n,a,r;return s.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,j.edition.get({id:t.props.edition});case 2:return n=e.sent,e.next=5,j.scan_lnk.get({edition_id:t.props.edition});case 5:a=(a=e.sent).sort((function(t,e){return e.filename<t.filename})),r="".concat(n[0].opus.replace(" <cit></cit>","")," (").concat(n[0].label,")"),t.setState({title:r,edition:n[0],scanLst:a,cIndex:a.length-1});case 9:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}})()()}},{key:"componentDidUpdate",value:function(t,e){var n=this;e.cIndex!=this.state.cIndex&&j.getScan(this.state.scanLst[this.state.cIndex].scan_id).then((function(t){n.setState({imgURL:t,txt:n.state.scanLst[n.state.cIndex].full_text,page:isNaN(n.state.scanLst[n.state.cIndex].filename)?n.state.scanLst[n.state.cIndex].filename:parseInt(n.state.scanLst[n.state.cIndex].filename)})})).catch((function(t){throw t}))}}]),n}(d.a.Component),A=function(t){Object(o.a)(n,t);var e=Object(u.a)(n);function n(t){var a;return Object(i.a)(this,n),(a=e.call(this,t)).state={mode:"login",status:{}},window.addEventListener("arachneError",(function(t){401===t.detail.status?a.newStatus("error","Der Server hat die Zugangsdaten abgelehnt. Melden Sie sich neu an!"):a.newStatus("error","Die Verbindung zum Server ist unterbrochen.")})),a.tbls=["edition","lemma","opera_maiora","opera_minora","scan","scan_lnk","work","zettel","user"],a}return Object(c.a)(n,[{key:"render",value:function(){var t=this;if("main"===this.state.mode){var e=Object(g.jsx)(T,{edition:this.state.edition,status:function(e,n){t.newStatus(e,n)}});return Object(g.jsxs)("div",{children:[e,Object(g.jsx)(w,{status:this.state.status})]})}return"create"===this.state.mode?Object(g.jsxs)("div",{style:{position:"absolute",display:"grid",height:"100%",width:"100%",gridTemplateColumns:"1fr 2fr 1fr",gridTemplateRows:"1fr 2fr 1fr"},children:[Object(g.jsxs)("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gridTemplateRows:"auto 100px 50px 50px 50px 50px 50px auto",gridColumn:"2",gridRow:"2",padding:"10px 15px",borderRadius:"5px",boxShadow:"0 1.2px 6px #3c6e71"},children:[Object(g.jsx)("h1",{style:{textAlign:"center",gridArea:"2/2/2/4"},children:"Konto erstellen"}),Object(g.jsx)("span",{style:{gridArea:"3/2/3/3"},children:"Vorname:"}),Object(g.jsx)("div",{style:{gridArea:"3/3/3/4"},children:Object(g.jsx)("input",{type:"text",value:this.state.createFirstName?this.state.createFirstName:"",onChange:function(e){t.setState({createFirstName:e.target.value})}})}),Object(g.jsx)("span",{style:{gridArea:"4/2/4/3"},children:"Nachname:"}),Object(g.jsx)("div",{style:{gridArea:"4/3/4/4"},children:Object(g.jsx)("input",{type:"text",value:this.state.createLastName?this.state.createLastName:"",onChange:function(e){t.setState({createLastName:e.target.value})}})}),Object(g.jsx)("span",{style:{gridArea:"5/2/5/3"},children:"E-Mail:"}),Object(g.jsx)("div",{style:{gridArea:"5/3/5/4"},children:Object(g.jsx)("input",{type:"text",value:this.state.createEmail?this.state.createEmail:"",onChange:function(e){t.setState({createEmail:e.target.value})}})}),Object(g.jsx)("span",{style:{gridArea:"6/2/6/3"},children:"Passwort:"}),Object(g.jsx)("div",{style:{gridArea:"6/3/6/4"},children:Object(g.jsx)("input",{type:"password",value:this.state.createPassword?this.state.createPassword:"",onChange:function(e){t.setState({createPassword:e.target.value})}})}),Object(g.jsxs)("div",{style:{gridArea:"8/3/8/4"},children:[Object(g.jsx)("input",{type:"button",value:"registrieren",onClick:Object(r.a)(s.a.mark((function e(){var n,a;return s.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(!(t.state.createFirstName&&t.state.createFirstName&&t.state.createEmail&&t.state.createPassword)){e.next=19;break}return t.newStatus("saving"),n={first_name:t.state.createFirstName,last_name:t.state.createLastName,email:t.state.createEmail,password:t.state.createPassword},e.next=5,j.createAccount(n);case 5:a=e.sent,e.t0=a,e.next=201===e.t0?9:409===e.t0?12:406===e.t0?14:16;break;case 9:return t.newStatus("saved","Der Account wurde erfolgreich erstellt."),setTimeout((function(){t.setState({mode:"login"})}),2100),e.abrupt("break",17);case 12:return t.newStatus("error","Die Email-Adresse ist bereits vorhanden."),e.abrupt("break",17);case 14:return t.newStatus("error","Bitte f\xfcllen Sie alle Felder aus."),e.abrupt("break",17);case 16:t.newStatus("error","Die Registrierung is fehlgeschlagen. Versuchen Sie es erneut.");case 17:e.next=20;break;case 19:t.newStatus("error","Bitte f\xfcllen Sie alle Felder aus!");case 20:case"end":return e.stop()}}),e)})))})," ",Object(g.jsx)("span",{className:"minorTxt",style:{marginLeft:"20px"},children:Object(g.jsx)("a",{onClick:function(){t.setState({mode:"login"})},children:"zur\xfcck"})})]}),Object(g.jsx)("span",{style:{gridArea:"7/2/7/3"}})]}),Object(g.jsx)(w,{status:this.state.status})]}):Object(g.jsxs)("div",{style:{position:"absolute",display:"grid",height:"100%",width:"100%",gridTemplateColumns:"1fr 2fr 1fr",gridTemplateRows:"1fr 2fr 1fr"},children:[Object(g.jsxs)("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gridTemplateRows:"auto 100px 50px 50px 50px 25px 50px auto",gridColumn:"2",gridRow:"2",padding:"10px 15px",borderRadius:"5px",boxShadow:"0 1.2px 6px #3c6e71"},children:[Object(g.jsx)("h1",{style:{textAlign:"center",gridArea:"2/2/2/4"},children:"dMLW"}),Object(g.jsx)("span",{style:{gridArea:"3/2/3/3"},children:"Email:"}),Object(g.jsx)("div",{style:{gridArea:"3/3/3/4"},children:Object(g.jsx)("input",{type:"text",name:"email",style:{width:"300px"}})}),Object(g.jsx)("span",{style:{gridArea:"4/2/4/3"},children:"Passwort:"}),Object(g.jsx)("div",{style:{gridArea:"4/3/4/4"},children:Object(g.jsx)("input",{type:"password",name:"password",style:{width:"300px"}})}),Object(g.jsx)("div",{style:{gridArea:"5/3/5/4"},children:Object(g.jsx)("input",{type:"submit",value:"anmelden",onClick:function(){t.login()}})}),Object(g.jsxs)("span",{style:{gridArea:"7/2/7/4"},className:"minorTxt",children:["Noch kein Konto? Klicken Sie ",Object(g.jsx)("a",{onClick:function(){t.setState({mode:"create"})},children:"hier"}),"."]})]}),Object(g.jsx)("div",{className:"cat",children:Object(g.jsx)(x.a,{color:"black",icon:f.d})})]})}},{key:"componentDidMount",value:function(){var t=this,e=new URLSearchParams(window.location.search);this.setState({edition:e.get("edition")?e.get("edition"):1,page:e.get("page")?e.get("page"):null}),function(){var e=Object(r.a)(s.a.mark((function e(){return s.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,j.getUser();case 2:if(!e.sent){e.next=7;break}return e.next=6,j.open(t.tbls);case 6:t.setState({mode:"main"});case 7:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}()()}},{key:"loadMain",value:function(t){"logout"===t?(j.close(),this.setState({mode:"login",res:null})):this.setState({res:t})}},{key:"login",value:function(){var t=Object(r.a)(s.a.mark((function t(){var e,n;return s.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(e=document.querySelector("input[name=email]").value,n=document.querySelector("input[name=password]").value,t.t0=""!==e&&""!==n,!t.t0){t.next=7;break}return t.next=6,j.login(e,n,this.tbls);case 6:t.t0=t.sent;case 7:if(!t.t0){t.next=11;break}this.setState({mode:"main"}),t.next=12;break;case 11:alert("Geben Sie eine g\xfcltige Email-Adresse und Passwort ein!");case 12:case"end":return t.stop()}}),t,this)})));return function(){return t.apply(this,arguments)}}()},{key:"newStatus",value:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:null;this.setState({status:{id:Date.now(),visible:!0,type:t,value:e}})}}]),n}(d.a.Component);h.a.render(Object(g.jsx)(A,{}),document.getElementById("root"))}},[[29,1,2]]]);
//# sourceMappingURL=main.9e5b83d5.chunk.js.map