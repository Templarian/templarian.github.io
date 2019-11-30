!function(e){function t(t){for(var a,s,l=t[0],n=t[1],p=t[2],d=0,m=[];d<l.length;d++)s=l[d],Object.prototype.hasOwnProperty.call(r,s)&&r[s]&&m.push(r[s][0]),r[s]=0;for(a in n)Object.prototype.hasOwnProperty.call(n,a)&&(e[a]=n[a]);for(c&&c(t);m.length;)m.shift()();return o.push.apply(o,p||[]),i()}function i(){for(var e,t=0;t<o.length;t++){for(var i=o[t],a=!0,l=1;l<i.length;l++){var n=i[l];0!==r[n]&&(a=!1)}a&&(o.splice(t--,1),e=s(s.s=i[0]))}return e}var a={},r={1:0},o=[];function s(t){if(a[t])return a[t].exports;var i=a[t]={i:t,l:!1,exports:{}};return e[t].call(i.exports,i,i.exports,s),i.l=!0,i.exports}s.m=e,s.c=a,s.d=function(e,t,i){s.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:i})},s.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},s.t=function(e,t){if(1&t&&(e=s(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var i=Object.create(null);if(s.r(i),Object.defineProperty(i,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var a in e)s.d(i,a,function(t){return e[t]}.bind(null,a));return i},s.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return s.d(t,"a",t),t},s.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},s.p="/";var l=window.webpackJsonp=window.webpackJsonp||[],n=l.push.bind(l);l.push=t,l=l.slice();for(var p=0;p<l.length;p++)t(l[p]);var c=n;o.push([11,0,2]),i()}({11:function(e,t,i){e.exports=i(13)},13:function(e,t,i){"use strict";i.r(t);var a=i(0);var r=[function(e,t,i){return"code"+t+"{font-family:monospace;background-color:#fff;vertical-align:middle;padding:.25rem;border-radius:.25rem;border:1px solid #ddd}h2"+t+"{margin:1rem .5rem .5rem;font-weight:400;font-size:1.75rem}p"+t+"{margin:.5rem;line-height:1.5rem}p:last-of-type"+t+"{margin:.5rem .5rem 1rem}ul"+t+"{margin:0;padding-left:.125rem;list-style:none}ul"+t+" li"+t+"{line-height:1.5rem}ul"+t+" li"+t+" ui-icon"+t+"{vertical-align:middle;margin-right:.25rem;margin-top:-2px}.container"+t+"{max-width:960px;margin:0 auto;display:flex;flex-direction:column;padding:0 1rem 2rem}.mr-2"+t+"{margin-right:.5rem}.mt-5"+t+"{margin-top:1.25rem}my-stl"+t+"{margin-bottom:.5rem}.flex"+t+"{display:flex;flex-direction:row}.flex-item"+t+"{flex:1;margin-bottom:.5rem}.flex-item:empty"+t+"{margin-bottom:0}.flex-spacer"+t+"{width:.5rem}.content"+t+"{flex:3;margin-right:.5rem}.details"+t+"{flex:2}@media (max-width:480px){.flex"+t+"{flex-direction:column}.flex-item"+t+"{margin-top:.5rem}.flex-spacer"+t+"{width:0}.content"+t+"{flex:1;margin-right:0}.details"+t+"{flex:1}.mt-5"+t+"{margin-top:0}}"}],o=i(7),s=i(8),l=i(1),n=i(9),p=i(5),c=i(6),d=i(4);var m=[function(e,t,i){return".stl"+t+"{box-shadow:inset 0 0 5px rgba(0,0,0,.2);margin-bottom:.5rem;border-radius:.25rem;background-color:#f1f1f1;position:relative}.webgl"+t+"{width:200px;height:180px}.name"+t+"{background:#fff;padding:.25rem .5rem;box-shadow:0 0 5px rgba(0,0,0,.2);border-left:1px solid #ddd;border-bottom:1px solid #ddd;border-right:1px solid #ddd;border-radius:0 0 .25rem .25rem;color:#333}.stl"+t+" ui-icon"+t+"{position:absolute;top:.25rem;right:.25rem;pointer-events:none}@media (max-width:480px){.webgl"+t+"{width:100%}}"}],y=i(10);function h(e,t,i,a){const{h:r,d:o,c:s,t:n}=e;return[s("ui-card",p.a,{key:7},[s("ui-card-body",d.a,{key:6},[r("div",{classMap:{stl:!0},key:3},[r("div",{classMap:{webgl:!0},context:{lwc:{dom:"manual"}},key:0},[]),r("div",{classMap:{name:!0},key:1},[o(t.file)]),s("ui-icon",l.a,{props:{path:t.mdiRotate3d},key:2},[])]),s("ui-button",y.a,{props:{block:!0,href:t.href},key:5},[s("ui-icon",l.a,{attrs:{slot:"left"},props:{path:t.mdiDownload},key:4},[]),n("Download")])])])]}var u=Object(a.registerTemplate)(h);h.stylesheets=[],m&&h.stylesheets.push.apply(h.stylesheets,m),h.stylesheetTokens={hostAttribute:"my-stl-_stl-host",shadowAttribute:"my-stl-_stl"};var f=i(3);class k extends a.LightningElement{constructor(...e){super(...e),this.stlViewer=null,this._file=null,this.mdiDownload=f.h,this.mdiRotate3d=f.k,this.rotationX=0,this.rotationY=0,this.rotationZ=0}get href(){return`https://github.com/Templarian/magnetic-tiles/blob/master/src/stl/${this._file}`}get file(){return this._file}set file(e){this._file=e}renderedCallback(){this.stlViewer=new StlViewer(this.template.querySelector(".webgl"),{zoom:100,canvas_width:190,canvas_height:175,models:[{id:0,filename:`stl/${this._file}`,rotationx:this.rotationX,rotationy:this.rotationY,rotationz:this.rotationZ}]})}}Object(a.registerDecorators)(k,{publicProps:{file:{config:3},rotationX:{config:0},rotationY:{config:0},rotationZ:{config:0}},track:{mdiDownload:1,mdiRotate3d:1},fields:["stlViewer","_file"]});var g=Object(a.registerComponent)(k,{tmpl:u});function b(e,t,i,a){const{c:r,t:m,h:y}=e;return[r("ui-nav",o.a,{styleMap:{marginBottom:"1rem"},key:4},[r("ui-nav-brand",s.a,{props:{href:"/magnetic-tiles"},key:1},[r("ui-icon",l.a,{attrs:{slot:"logo"},props:{path:t.mdiDiceD20},key:0},[]),m("Magnetic Tiles")]),r("ui-nav-item",n.a,{props:{href:"https://github.com/Templarian/magnetic-tiles"},key:3},[r("ui-icon",l.a,{props:{path:t.mdiGithubCircle},key:2},[])])]),y("div",{classMap:{container:!0},key:101},[y("div",{classMap:{flex:!0},key:19},[y("div",{classMap:{content:!0},key:7},[y("h2",{key:5},[m("Introduction")]),y("p",{key:6},[m("Each magnetic tile not only magnets to one another, but allow walls and character pieces to snap in place. Reusable bases ensure that a majority of magnets are seperate from the growing collection of tiles and walls.")])]),y("div",{classMap:{details:!0},key:18},[r("ui-card",p.a,{key:17},[r("ui-card-header",c.a,{key:8},[m("Features")]),r("ui-card-body",d.a,{key:16},[y("ul",{key:15},[y("li",{key:10},[r("ui-icon",l.a,{props:{path:t.mdiBorderNoneVariant},key:9},[]),m("1.25 inch grid")]),y("li",{key:12},[r("ui-icon",l.a,{props:{path:t.mdiAccountBox},key:11},[]),m("1 inch base minatures")]),y("li",{key:14},[r("ui-icon",l.a,{props:{path:t.mdiBorderStyle},key:13},[]),m("0.25 inch walls")])])])])])]),y("div",{classMap:{flex:!0},key:44},[y("div",{classMap:{content:!0},key:30},[y("h2",{key:20},[m("Getting Started")]),y("p",{key:28},[m("All STL files need to be scaled to "),y("code",{key:21},[m("50%")]),m(". Start by printing several "),y("code",{key:22},[m("top.stl")]),m(", "),y("code",{key:23},[m("base.stl")]),m(", and "),y("code",{key:24},[m("tile-blank.stl")]),m(" models. Print one "),y("code",{key:25},[m("rig.stl")]),m(" file as a way to align "),y("code",{key:26},[m("top")]),m(" and "),y("code",{key:27},[m("tile-*")]),m(" models while gluing them together.")]),y("p",{key:29},[m("Print a few walls to get an idea of how the magnets connect between tiles. After deciding if this system works for your gameplay move on to the decorative tiles.")])]),y("div",{classMap:{details:!0},key:43},[r("ui-card",p.a,{classMap:{"mt-5":!0},key:42},[r("ui-card-header",c.a,{key:31},[m("Requirements")]),r("ui-card-body",d.a,{key:41},[y("ul",{key:40},[y("li",{key:33},[r("ui-icon",l.a,{props:{path:t.mdiChevronRight},key:32},[]),m("Base uses 6x6x2mm cylinder magnets")]),y("li",{key:35},[r("ui-icon",l.a,{props:{path:t.mdiChevronRight},key:34},[]),m("Top uses 6x6x2mm cylinder magnets")]),y("li",{key:37},[r("ui-icon",l.a,{props:{path:t.mdiChevronRight},key:36},[]),m("Walls use 4x4x4mm cyclinder magnets")]),y("li",{key:39},[r("ui-icon",l.a,{props:{path:t.mdiCommentAlert},key:38},[]),m("Top magets are optional")])])])])])]),y("div",{classMap:{flex:!0},key:56},[y("div",{classMap:{"flex-item":!0},key:46},[r("my-stl",g,{props:{file:"top.stl",rotationX:"45",rotationY:"45"},key:45},[])]),y("div",{classMap:{"flex-spacer":!0},key:47},[]),y("div",{classMap:{"flex-item":!0},key:49},[r("my-stl",g,{props:{file:"base.stl"},key:48},[])]),y("div",{classMap:{"flex-spacer":!0},key:50},[]),y("div",{classMap:{"flex-item":!0},key:52},[r("my-stl",g,{props:{file:"tile-blank.stl",rotationX:"6.0",rotationY:"0.3"},key:51},[])]),y("div",{classMap:{"flex-spacer":!0},key:53},[]),y("div",{classMap:{"flex-item":!0},key:55},[r("my-stl",g,{props:{file:"rig.stl",rotationX:"6.0",rotationY:"0.3"},key:54},[])])]),y("div",{classMap:{flex:!0},key:65},[y("div",{classMap:{"flex-item":!0},key:58},[r("my-stl",g,{props:{file:"wall-full.stl",rotationY:"180",rotationZ:"180"},key:57},[])]),y("div",{classMap:{"flex-spacer":!0},key:59},[]),y("div",{classMap:{"flex-item":!0},key:60},[]),y("div",{classMap:{"flex-spacer":!0},key:61},[]),y("div",{classMap:{"flex-item":!0},key:62},[]),y("div",{classMap:{"flex-spacer":!0},key:63},[]),y("div",{classMap:{"flex-item":!0},key:64},[])]),y("h2",{key:66},[m("Everything Else...")]),y("p",{key:67},[m("Once trying out the system with the above tiles you can move to printing some of the more decorative tiles.")]),y("div",{classMap:{flex:!0},key:79},[y("div",{classMap:{"flex-item":!0},key:69},[r("my-stl",g,{props:{file:"tile-blank-broken-1.stl",rotationX:"6.0",rotationY:"0.3"},key:68},[])]),y("div",{classMap:{"flex-spacer":!0},key:70},[]),y("div",{classMap:{"flex-item":!0},key:72},[r("my-stl",g,{props:{file:"tile-blank-grate.stl",rotationX:"6.0",rotationY:"0.3"},key:71},[])]),y("div",{classMap:{"flex-spacer":!0},key:73},[]),y("div",{classMap:{"flex-item":!0},key:75},[r("my-stl",g,{props:{file:"tile-brick.stl",rotationX:"6.0",rotationY:"0.3"},key:74},[])]),y("div",{classMap:{"flex-spacer":!0},key:76},[]),y("div",{classMap:{"flex-item":!0},key:78},[r("my-stl",g,{props:{file:"tile-brick-arrow.stl",rotationX:"6.0",rotationY:"0.3"},key:77},[])])]),y("div",{classMap:{flex:!0},key:100},[y("div",{classMap:{content:!0},key:85},[y("h2",{key:80},[m("Want to Contribute?")]),y("p",{key:83},[m("Each of the "),y("code",{key:81},[m("tile-*")]),m(" and "),y("code",{key:82},[m("wall-*")]),m(" models follow the same specs allowing for easy contribution from those that know any 3D Software.")]),y("p",{key:84},[m("These were all built in TinkerCAD a free online software for creating 3D models.")])]),y("div",{classMap:{details:!0},key:99},[r("ui-card",p.a,{classMap:{"mt-5":!0},key:98},[r("ui-card-header",c.a,{key:86},[m("GitHub")]),r("ui-card-body",d.a,{key:97},[y("ul",{key:96},[y("li",{key:89},[r("ui-icon",l.a,{props:{path:t.mdiChevronRight},key:87},[]),m("Open an "),y("a",{attrs:{href:"https://github.com/Templarian/magnetic-tiles/issues",target:"_blank"},key:88},[m("Issue")])]),y("li",{key:91},[r("ui-icon",l.a,{props:{path:t.mdiChevronRight},key:90},[]),m("Zip STL file and attach to issue")]),y("li",{key:93},[r("ui-icon",l.a,{props:{path:t.mdiChevronRight},key:92},[]),m("Be sure to be descriptive in the name and the tiles purpose.")]),y("li",{key:95},[r("ui-icon",l.a,{props:{path:t.mdiCommentAlert},key:94},[]),m("For wall contributions ensure you include all variants.")])])])])])])])]}var v=Object(a.registerTemplate)(b);b.stylesheets=[],r&&b.stylesheets.push.apply(b.stylesheets,r),b.stylesheetTokens={hostAttribute:"my-app-_app-host",shadowAttribute:"my-app-_app"};class x extends a.LightningElement{constructor(...e){super(...e),this.mdiDiceD20=f.g,this.mdiGithubCircle=f.i,this.mdiBorderNoneVariant=f.b,this.mdiBorderStyle=f.c,this.mdiAccountBox=f.a,this.mdiChevronRight=f.d,this.mdiCommentAlert=f.f}}Object(a.registerDecorators)(x,{track:{mdiDiceD20:1,mdiGithubCircle:1,mdiBorderNoneVariant:1,mdiBorderStyle:1,mdiAccountBox:1,mdiChevronRight:1,mdiCommentAlert:1}});var w=Object(a.registerComponent)(x,{tmpl:v});customElements.define("my-app",Object(a.buildCustomElementConstructor)(w))}});