var t;const e=Symbol("path"),n=Symbol("view");let o=class extends HTMLElement{constructor(){super(),this[t]="M13,14H11V10H13M13,18H11V16H13M1,21H23L12,2L1,21Z"}static get observedAttributes(){return["path"]}set path(t){this[e]=t||"M13,14H11V10H13M13,18H11V16H13M1,21H23L12,2L1,21Z",this.render()}get path(){return this[e]}render(){this[n].path.setAttribute("d",this.path)}connectedCallback(){console.log(this.path),console.log("connected callback")}disconnectedCallback(){console.log("disconnected callback")}componentWillMount(){this[n]={path:this.shadowRoot.querySelector("path")},console.log("component will mount")}componentDidMount(){console.log("component did mount")}componentWillUnmount(){console.log("component will unmount")}componentDidUnmount(){console.log("component did unmount")}};t=e,o=function(t,e,n,o){var l,c=arguments.length,i=c<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,n):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)i=Reflect.decorate(t,e,n,o);else for(var s=t.length-1;s>=0;s--)(l=t[s])&&(i=(c<3?l(i):c>3?l(e,n,i):l(e,n))||i);return c>3&&i&&Object.defineProperty(e,n,i),i}([(t=>e=>{if(!t.template)throw new Error("You need to pass a template for the element");const n=document.createElement("template");t.style&&(t.template=`<style>${t.style}</style> ${t.template}`),n.innerHTML=t.template;const o=e.prototype.connectedCallback||(()=>{}),l=e.prototype.disconnectedCallback||(()=>{});e.prototype.connectedCallback=function(){const e=document.importNode(n.content,!0);!1===t.useShadow?this.appendChild(e):this.attachShadow({mode:"open"}).appendChild(e),this.componentWillMount&&this.componentWillMount(),this.render&&this.render(),o.call(this),this.componentDidMount&&this.componentDidMount()},e.prototype.disconnectedCallback=function(){this.componentWillUnmount&&this.componentWillUnmount(),l.call(this),this.componentDidUnmount&&this.componentDidUnmount()},e.prototype.attributeChangedCallback=function(t,e,n){this[t]=n},window.customElements.define(t.selector,e)})({selector:"mdi-icon",style:":host {\r\n  display: inline-block;\r\n}\r\n:host svg {\r\n  width: 1.5rem;\r\n  height: 1.5rem;\r\n}\r\n:host svg path {\r\n  fill: red;\r\n}",template:'<svg viewBox="0 0 24 24">\r\n  <path d="M13,14H11V10H13M13,18H11V16H13M1,21H23L12,2L1,21Z"/>\r\n</svg>'})],o);
//# sourceMappingURL=mdi-icon.js.map