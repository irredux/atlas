"use strict";(self.webpackChunkatlas=self.webpackChunkatlas||[]).push([[537],{1537:function(e,n,t){t.r(n),t.d(n,{MainBody:function(){return o},MainNavBar:function(){return l}});var a=t(885),s=t(2791),r=(t(4483),t(6407)),i=t(184);function o(e){r.Q.changeLog=c;var n=null;if(null===e.res)n=(0,i.jsx)(u,{loadMain:function(){e.loadMain.apply(e,arguments)}});else n=(0,i.jsxs)("div",{children:['Unbekannter Men\xfc-Punkt: "',e.res,'"']});return(0,i.jsx)(i.Fragment,{children:n})}function l(e){return(0,i.jsx)(i.Fragment,{})}var c=[{title:"Beta 1.0",date:"2022-06-05",description:(0,i.jsx)(i.Fragment,{children:(0,i.jsx)("p",{children:"Beta Version online!"})})}];function u(e){var n=(0,s.useState)(""),t=(0,a.Z)(n,2),r=t[0],o=t[1],l=new BroadcastChannel("echo");return l.onmessage=function(e){"hello"===e.data.type&&"echo"===e.data.msg?l.postMessage({type:"hello",msg:"back"}):"edition"===e.data.type&&o(e.data.url)},(0,s.useEffect)((function(){l.postMessage({type:"hello",msg:"world"})}),[]),(0,i.jsx)("div",{children:(0,i.jsx)("iframe",{height:"100%",width:"100%",style:{position:"absolute",top:0,bottom:0,left:0,right:0},src:r})})}}}]);
//# sourceMappingURL=537.29d7b354.chunk.js.map