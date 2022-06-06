"use strict";(self.webpackChunkatlas=self.webpackChunkatlas||[]).push([[354],{4413:function(e,n,t){t.d(n,{gP:function(){return d}});var r=t(885),o=t(2791);function a(e,n,t,r){Object.defineProperty(e,n,{get:t,set:r,enumerable:!0,configurable:!0})}var i={};a(i,"SSRProvider",(function(){return u})),a(i,"useSSRSafeId",(function(){return d})),a(i,"useIsSSR",(function(){return f}));var s={prefix:String(Math.round(1e10*Math.random())),current:0},l=o.createContext(s);function u(e){var n=(0,o.useContext)(l),t=(0,o.useMemo)((function(){return{prefix:n===s?"":"".concat(n.prefix,"-").concat(++n.current),current:0}}),[n]);return o.createElement(l.Provider,{value:t},e.children)}var c=Boolean("undefined"!==typeof window&&window.document&&window.document.createElement);function d(e){var n=(0,o.useContext)(l);return n!==s||c||console.warn("When server rendering, you must wrap your application in an <SSRProvider> to ensure consistent ids are generated between the client and server."),(0,o.useMemo)((function(){return e||"react-aria".concat(n.prefix,"-").concat(++n.current)}),[e])}function f(){var e=(0,o.useContext)(l)!==s,n=(0,o.useState)(e),t=(0,r.Z)(n,2),a=t[0],i=t[1];return"undefined"!==typeof window&&e&&(0,o.useLayoutEffect)((function(){i(!1)}),[]),a}},9723:function(e,n,t){t.d(n,{Z:function(){return Ze}});var r=t(1413),o=t(5987),a=t(1694),i=t.n(a),s=t(2791),l=t(885),u=t(3808),c=t(3070),d=t(8580),f=t(2803),v=t(3649),p=t(9392),m=t(9007),g=s.createContext(null),h=t(7731),Z=t(4403),w=t(6050),b=t(1012),x=t(184),y=["children"];var C=function(){};function P(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},n=(0,s.useContext)(g),t=(0,h.Z)(),r=(0,l.Z)(t,2),o=r[0],a=r[1],i=(0,s.useRef)(!1),u=e.flip,c=e.offset,d=e.rootCloseEvent,f=e.fixed,v=void 0!==f&&f,p=e.placement,m=e.popperConfig,x=void 0===m?{}:m,y=e.enableEventListeners,P=void 0===y||y,k=e.usePopper,E=void 0===k?!!n:k,N=null==(null==n?void 0:n.show)?!!e.show:n.show;N&&!i.current&&(i.current=!0);var S=function(e){null==n||n.toggle(!1,e)},j=n||{},M=j.placement,T=j.setMenu,O=j.menuElement,D=j.toggleElement,R=(0,Z.Z)(D,O,(0,b.ZP)({placement:p||M||"bottom-start",enabled:E,enableEvents:null==P?N:P,offset:c,flip:u,fixed:v,arrowElement:o,popperConfig:x})),I=Object.assign({ref:T||C,"aria-labelledby":null==D?void 0:D.id},R.attributes.popper,{style:R.styles.popper}),K={show:N,placement:M,hasShown:i.current,toggle:null==n?void 0:n.toggle,popper:E?R:null,arrowProps:E?Object.assign({ref:a},R.attributes.arrow,{style:R.styles.arrow}):{}};return(0,w.Z)(O,S,{clickTrigger:d,disabled:!N}),[I,K]}function k(e){var n=e.children,t=P(function(e,n){if(null==e)return{};var t,r,o={},a=Object.keys(e);for(r=0;r<a.length;r++)t=a[r],n.indexOf(t)>=0||(o[t]=e[t]);return o}(e,y)),r=(0,l.Z)(t,2),o=r[0],a=r[1];return(0,x.jsx)(x.Fragment,{children:n(o,a)})}k.displayName="DropdownMenu",k.defaultProps={usePopper:!0};var E=k,N=t(4413),S=function(e){var n;return"menu"===(null==(n=e.getAttribute("role"))?void 0:n.toLowerCase())},j=function(){};function M(){var e=(0,N.gP)(),n=(0,s.useContext)(g)||{},t=n.show,r=void 0!==t&&t,o=n.toggle,a=void 0===o?j:o,i=n.setToggle,l=n.menuElement,u=(0,s.useCallback)((function(e){a(!r,e)}),[r,a]),c={id:e,ref:i||j,onClick:u,"aria-expanded":!!r};return l&&S(l)&&(c["aria-haspopup"]=!0),[c,{show:r,toggle:a}]}function T(e){var n=e.children,t=M(),r=(0,l.Z)(t,2),o=r[0],a=r[1];return(0,x.jsx)(x.Fragment,{children:n(o,a)})}T.displayName="DropdownToggle";var O=T,D=t(4942),R=t(8633),I=t(4784),K=t(5341),A=t(1306),B=["eventKey","disabled","onClick","active","as"];function F(e){var n=e.key,t=e.href,r=e.active,o=e.disabled,a=e.onClick,i=(0,s.useContext)(R.Z),l=((0,s.useContext)(I.Z)||{}).activeKey,u=(0,R.h)(n,t),c=null==r&&null!=n?(0,R.h)(l)===u:r,d=(0,m.Z)((function(e){o||(null==a||a(e),i&&!e.isPropagationStopped()&&i(u,e))}));return[(0,D.Z)({onClick:d,"aria-disabled":o||void 0,"aria-selected":c},(0,A.PB)("dropdown-item"),""),{isActive:c}]}var L=s.forwardRef((function(e,n){var t=e.eventKey,r=e.disabled,o=e.onClick,a=e.active,i=e.as,s=void 0===i?K.ZP:i,u=function(e,n){if(null==e)return{};var t,r,o={},a=Object.keys(e);for(r=0;r<a.length;r++)t=a[r],n.indexOf(t)>=0||(o[t]=e[t]);return o}(e,B),c=F({key:t,href:u.href,disabled:r,onClick:o,active:a}),d=(0,l.Z)(c,1)[0];return(0,x.jsx)(s,Object.assign({},u,{ref:n},d))}));L.displayName="DropdownItem";var H=L,V=t(8865);function $(){var e=(0,v.Z)(),n=(0,s.useRef)(null),t=(0,s.useCallback)((function(t){n.current=t,e()}),[e]);return[n,t]}function G(e){var n=e.defaultShow,t=e.show,r=e.onSelect,o=e.onToggle,a=e.itemSelector,i=void 0===a?"* [".concat((0,A.PB)("dropdown-item"),"]"):a,v=e.focusFirstItemOnShow,h=e.placement,Z=void 0===h?"bottom-start":h,w=e.children,b=(0,V.Z)(),y=(0,d.$c)(t,n,o),C=(0,l.Z)(y,2),P=C[0],k=C[1],E=$(),N=(0,l.Z)(E,2),j=N[0],M=N[1],T=j.current,O=$(),D=(0,l.Z)(O,2),I=D[0],K=D[1],B=I.current,F=(0,f.Z)(P),L=(0,s.useRef)(null),H=(0,s.useRef)(!1),G=(0,s.useContext)(R.Z),U=(0,s.useCallback)((function(e,n){var t=arguments.length>2&&void 0!==arguments[2]?arguments[2]:null==n?void 0:n.type;k(e,{originalEvent:n,source:t})}),[k]),W=(0,m.Z)((function(e,n){null==r||r(e,n),U(!1,n,"select"),n.isPropagationStopped()||null==G||G(e,n)})),q=(0,s.useMemo)((function(){return{toggle:U,placement:Z,show:P,menuElement:T,toggleElement:B,setMenu:M,setToggle:K}}),[U,Z,P,T,B,M,K]);T&&F&&!P&&(H.current=T.contains(T.ownerDocument.activeElement));var z=(0,m.Z)((function(){B&&B.focus&&B.focus()})),J=(0,m.Z)((function(){var e=L.current,n=v;if(null==n&&(n=!(!j.current||!S(j.current))&&"keyboard"),!1!==n&&("keyboard"!==n||/^key.+$/.test(e))){var t=(0,u.Z)(j.current,i)[0];t&&t.focus&&t.focus()}}));(0,s.useEffect)((function(){P?J():H.current&&(H.current=!1,z())}),[P,H,z,J]),(0,s.useEffect)((function(){L.current=null}));var Q=function(e,n){if(!j.current)return null;var t=(0,u.Z)(j.current,i),r=t.indexOf(e)+n;return t[r=Math.max(0,Math.min(r,t.length))]};return(0,p.Z)((0,s.useCallback)((function(){return b.document}),[b]),"keydown",(function(e){var n,t,r=e.key,o=e.target,a=null==(n=j.current)?void 0:n.contains(o),i=null==(t=I.current)?void 0:t.contains(o);if((!/input|textarea/i.test(o.tagName)||!(" "===r||"Escape"!==r&&a||"Escape"===r&&"search"===o.type))&&(a||i)&&("Tab"!==r||j.current&&P)){L.current=e.type;var s={originalEvent:e,source:e.type};switch(r){case"ArrowUp":var l=Q(o,-1);return l&&l.focus&&l.focus(),void e.preventDefault();case"ArrowDown":if(e.preventDefault(),P){var u=Q(o,1);u&&u.focus&&u.focus()}else k(!0,s);return;case"Tab":(0,c.ZP)(o.ownerDocument,"keyup",(function(e){var n;("Tab"!==e.key||e.target)&&null!=(n=j.current)&&n.contains(e.target)||k(!1,s)}),{once:!0});break;case"Escape":"Escape"===r&&(e.preventDefault(),e.stopPropagation()),k(!1,s)}}})),(0,x.jsx)(R.Z.Provider,{value:W,children:(0,x.jsx)(g.Provider,{value:q,children:w})})}G.displayName="Dropdown",G.Menu=E,G.Toggle=O,G.Item=H;var U=G,W=s.createContext({});W.displayName="DropdownContext";var q=W,z=t(6445),J=t(162),Q=["bsPrefix","className","eventKey","disabled","onClick","active","as"],X=s.forwardRef((function(e,n){var t=e.bsPrefix,a=e.className,s=e.eventKey,u=e.disabled,c=void 0!==u&&u,d=e.onClick,f=e.active,v=e.as,p=void 0===v?z.Z:v,m=(0,o.Z)(e,Q),g=(0,J.vE)(t,"dropdown-item"),h=F({key:s,href:m.href,disabled:c,onClick:d,active:f}),Z=(0,l.Z)(h,2),w=Z[0],b=Z[1];return(0,x.jsx)(p,(0,r.Z)((0,r.Z)((0,r.Z)({},m),w),{},{ref:n,className:i()(a,g,b.isActive&&"active",c&&"disabled")}))}));X.displayName="DropdownItem";var Y=X,_=t(9815),ee=t(3201),ne=(t(2391),t(1991)),te=t(5715);t(2176);function re(e,n){return e}var oe=["bsPrefix","className","align","rootCloseEvent","flip","show","renderOnMount","as","popperConfig","variant"];function ae(e,n,t){var r=e?t?"bottom-start":"bottom-end":t?"bottom-end":"bottom-start";return"up"===n?r=e?t?"top-start":"top-end":t?"top-end":"top-start":"end"===n?r=e?t?"left-end":"right-end":t?"left-start":"right-start":"start"===n&&(r=e?t?"right-end":"left-end":t?"right-start":"left-start"),r}var ie=s.forwardRef((function(e,n){var t=e.bsPrefix,a=e.className,u=e.align,c=e.rootCloseEvent,d=e.flip,f=e.show,v=e.renderOnMount,p=e.as,m=void 0===p?"div":p,g=e.popperConfig,h=e.variant,Z=(0,o.Z)(e,oe),w=!1,b=(0,s.useContext)(te.Z),y=(0,J.vE)(t,"dropdown-menu"),C=(0,s.useContext)(q),k=C.align,E=C.drop,N=C.isRTL;u=u||k;var S=(0,s.useContext)(ne.Z),j=[];if(u)if("object"===typeof u){var M=Object.keys(u);if(M.length){var T=M[0],O=u[T];w="start"===O,j.push("".concat(y,"-").concat(T,"-").concat(O))}}else"end"===u&&(w=!0);var D=ae(w,E,N),R=P({flip:d,rootCloseEvent:c,show:f,usePopper:!b&&0===j.length,offset:[0,2],popperConfig:g,placement:D}),I=(0,l.Z)(R,2),K=I[0],A=I[1],B=A.hasShown,F=A.popper,L=A.show,H=A.toggle;if(K.ref=(0,ee.Z)(re(n),K.ref),(0,_.Z)((function(){L&&(null==F||F.update())}),[L]),!B&&!v&&!S)return null;"string"!==typeof m&&(K.show=L,K.close=function(){return null==H?void 0:H(!1)},K.align=u);var V=Z.style;return null!=F&&F.placement&&(V=(0,r.Z)((0,r.Z)({},Z.style),K.style),Z["x-placement"]=F.placement),(0,x.jsx)(m,(0,r.Z)((0,r.Z)((0,r.Z)((0,r.Z)({},Z),K),{},{style:V},(j.length||b)&&{"data-bs-popper":"static"}),{},{className:i().apply(void 0,[a,y,L&&"show",w&&"".concat(y,"-end"),h&&"".concat(y,"-").concat(h)].concat(j))}))}));ie.displayName="DropdownMenu",ie.defaultProps={flip:!0};var se=ie,le=t(3360),ue=["bsPrefix","split","className","childBsPrefix","as"],ce=s.forwardRef((function(e,n){var t=e.bsPrefix,a=e.split,u=e.className,c=e.childBsPrefix,d=e.as,f=void 0===d?le.Z:d,v=(0,o.Z)(e,ue),p=(0,J.vE)(t,"dropdown-toggle"),m=(0,s.useContext)(g),h=(0,s.useContext)(ne.Z);void 0!==c&&(v.bsPrefix=c);var Z=M(),w=(0,l.Z)(Z,1)[0];return w.ref=(0,ee.Z)(w.ref,re(n)),(0,x.jsx)(f,(0,r.Z)((0,r.Z)({className:i()(u,p,a&&"".concat(p,"-split"),!!h&&(null==m?void 0:m.show)&&"show")},w),v))}));ce.displayName="DropdownToggle";var de=ce,fe=t(6543),ve=["bsPrefix","drop","show","className","align","onSelect","onToggle","focusFirstItemOnShow","as","navbar","autoClose"],pe=(0,fe.Z)("dropdown-header",{defaultProps:{role:"heading"}}),me=(0,fe.Z)("dropdown-divider",{Component:"hr",defaultProps:{role:"separator"}}),ge=(0,fe.Z)("dropdown-item-text",{Component:"span"}),he=s.forwardRef((function(e,n){var t=(0,d.Ch)(e,{show:"onToggle"}),a=t.bsPrefix,l=t.drop,u=t.show,c=t.className,f=t.align,v=t.onSelect,p=t.onToggle,g=t.focusFirstItemOnShow,h=t.as,Z=void 0===h?"div":h,w=(t.navbar,t.autoClose),b=(0,o.Z)(t,ve),y=(0,s.useContext)(ne.Z),C=(0,J.vE)(a,"dropdown"),P=(0,J.SC)(),k=(0,m.Z)((function(e,n){var t;n.originalEvent.currentTarget!==document||"keydown"===n.source&&"Escape"!==n.originalEvent.key||(n.source="rootClose"),t=n.source,(!1===w?"click"===t:"inside"===w?"rootClose"!==t:"outside"!==w||"select"!==t)&&(null==p||p(e,n))})),E=ae("end"===f,l,P),N=(0,s.useMemo)((function(){return{align:f,drop:l,isRTL:P}}),[f,l,P]);return(0,x.jsx)(q.Provider,{value:N,children:(0,x.jsx)(U,{placement:E,show:u,onSelect:v,onToggle:k,focusFirstItemOnShow:g,itemSelector:".".concat(C,"-item:not(.disabled):not(:disabled)"),children:y?b.children:(0,x.jsx)(Z,(0,r.Z)((0,r.Z)({},b),{},{ref:n,className:i()(c,u&&"show",(!l||"down"===l)&&C,"up"===l&&"dropup","end"===l&&"dropend","start"===l&&"dropstart")}))})})}));he.displayName="Dropdown",he.defaultProps={navbar:!1,align:"start",autoClose:!0};var Ze=Object.assign(he,{Toggle:de,Menu:se,Item:Y,ItemText:ge,Divider:me,Header:pe})},1991:function(e,n,t){var r=t(2791).createContext(null);r.displayName="InputGroupContext",n.Z=r},2354:function(e,n,t){var r=t(1413),o=t(5987),a=t(1694),i=t.n(a),s=t(2791),l=t(162),u=t(9723),c=t(9102),d=t(184),f=["id","title","children","bsPrefix","className","rootCloseEvent","menuRole","disabled","active","renderMenuOnMount","menuVariant"],v=s.forwardRef((function(e,n){var t=e.id,a=e.title,s=e.children,v=e.bsPrefix,p=e.className,m=e.rootCloseEvent,g=e.menuRole,h=e.disabled,Z=e.active,w=e.renderMenuOnMount,b=e.menuVariant,x=(0,o.Z)(e,f),y=(0,l.vE)(void 0,"nav-item");return(0,d.jsxs)(u.Z,(0,r.Z)((0,r.Z)({ref:n},x),{},{className:i()(p,y),children:[(0,d.jsx)(u.Z.Toggle,{id:t,eventKey:null,active:Z,disabled:h,childBsPrefix:v,as:c.Z,children:a}),(0,d.jsx)(u.Z.Menu,{role:g,renderOnMount:w,rootCloseEvent:m,variant:b,children:s})]}))}));v.displayName="NavDropdown",n.Z=Object.assign(v,{Item:u.Z.Item,ItemText:u.Z.ItemText,Divider:u.Z.Divider,Header:u.Z.Header})},9102:function(e,n,t){var r=t(1413),o=t(885),a=t(5987),i=t(1694),s=t.n(i),l=t(2791),u=t(6445),c=t(4787),d=t(8633),f=t(162),v=t(184),p=["bsPrefix","className","as","active","eventKey"],m=l.forwardRef((function(e,n){var t=e.bsPrefix,i=e.className,l=e.as,m=void 0===l?u.Z:l,g=e.active,h=e.eventKey,Z=(0,a.Z)(e,p);t=(0,f.vE)(t,"nav-link");var w=(0,c.v)((0,r.Z)({key:(0,d.h)(h,Z.href),active:g},Z)),b=(0,o.Z)(w,2),x=b[0],y=b[1];return(0,v.jsx)(m,(0,r.Z)((0,r.Z)((0,r.Z)({},Z),x),{},{ref:n,className:s()(i,t,Z.disabled&&"disabled",y.isActive&&"active")}))}));m.displayName="NavLink",m.defaultProps={disabled:!1},n.Z=m}}]);
//# sourceMappingURL=354.3869b491.chunk.js.map