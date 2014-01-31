/*
 * "Totem-Pole.js" v0.1.0
 * 
 * Copyright 2014 Kevin Shu
 * Released under the MIT license
 */
function add(e){var t=e.data.content,n=TP.template("#event-template",{event:t,check:check});document.getElementById("todolist").appendChild(n.view)}function check(e){e.set("isCheck",e.data.isCheck=="&times;"?"":"&times;");if(e.data.isCheck=="&times;"){var t=confirm("Delete it now?");t&&e.kill()}}(function(){function Totem(e,t){return this.data={},this.set=returnSet(this),this.kill=kill,this.html=this.view.outerHTML,this._id=0,this._group=t,this.addClass=addClass,this.removeClass=removeClass,typeof e=="object"&&this.set(e),groups[t]||(groups[t]=[]),this._id=groups[t].length,groups[t].push(this),this}function returnSet(e){function a(e,t){typeof t!="function"&&(this.data[e]=t)}var t=parseDom.call(e.view,{}),n="",r={};for(n in t){var i=0,s=t[n].length;r[n]=null;for(;i<s;i++){var o=t[n][i].dom,u=t[n][i].type;u==="html"&&o.innerHTML?r[n]=o.innerHTML:u==="text"&&o.innerText?r[n]=o.innerText:u==="value"&&o.value?r[n]=o.value:EVENTS.indexOf(u)!==-1&&(r[n]=n)}}return renderView(e,t,r),function(n,r){var i={};if(typeof n=="object"){i=n;for(var s in i)a.call(this,s,i[s])}else typeof n=="string"&&["string","object","function"].indexOf(typeof r)!==-1&&(a.call(this,n,r),i[n]=r);return TP.publish("data-change",[this,t,i]),e}}function renderView(viewModel,elemDatas,settings){for(var key in settings){if(!elemDatas.hasOwnProperty(key))continue;var elements=elemDatas[key],type="",element={},data=settings[key],i=0,max=elements.length;for(;i<max;i++){type=elements[i].type,element=elements[i].dom;if(type==="style")for(var _key in data)element.style[_key]=data[_key];else if(type==="attr")for(var _key in data)element[_key]=data[_key];else type==="html"?element.innerHTML=data:EVENTS.indexOf(type)!==-1&&data?function(elem,data){var _fn=function(){eval(data+".call(elem, viewModel);")};elem.addEventListener(type,function(e){_fn()})}(element,data):type==="text"?element.innerText=data:type==="value"?(element.value=data,function(e,t){t.onchange=function(n){viewModel.set(e,t.value)}}(key,element)):element[type]=data}}}function parseDom(e){var t=this.children;if(t&&t.length!=0)for(var n in t)e=parseDom.call(t[n],e);if(this.dataset&&this.dataset.tp){var r=this.dataset.tp.replace(/\s/g,"").split(",");for(var n in r){var i=r[n].split(":");i.length==1&&(i=[null].concat(i)),e[i[1]]?e[i[1]].push({type:i[0]||"text",dom:this}):e[i[1]]=[{type:i[0]||"text",dom:this}]}}return e}function kill(){this.view.remove(),delete groups[this._group][this._id]}function addClass(e){this.view.className+=" "+e}function removeClass(e){var t=this.view.className.split(" "),n=0,r=t.length,i="";for(;n<r;n++)t[n]!=e&&(i+=" "+t[n]);this.view.className=i}function initialize(){TP.subscribe("data-change",function(e,t,n){renderView(e,t,n),e.html=e.view.outerHTML,TP.publish(e._group),TP.publish("all")})}function insertAfter(e,t){var n=t.parentNode,r=t.nextSibling;return r===null?n.appendChild(e):n.insertBefore(e,r),e}var subscriber={any:[]},groups=[],EVENTS=["click","change","focus","keydown","keypress","keyup","mousedown","mouseout","mouseover","mouseup","submit"];TP=function(e,t){var n=document.querySelectorAll(e);if(n.length===1){n=n[0];if(t instanceof Array){if(t.length==0)return n.style.display="none",null;var r=[],i=e.split(" ")[e.split(" ").length-1],s=1,o=t.length;r.push(Totem.call({view:n},t[0],i));for(;s<o;s++){var u=n.cloneNode(!0),a=Totem.call({view:u},t[s],i);u.id="",r.push(a),insertAfter(u,n),n=u}return r}return Totem.call({view:n},t)}if(n.length>1){var o=n.length,s=0,f=[];for(;s<o;s++)f.push(Totem.call({view:n[s]},t));return f}},TP.template=function(e,t){var n={},r=e.split(" ")[e.split(" ").length-1];return n.view=document.querySelector(e).cloneNode(!0),Totem.call(n,t,r),n},TP.subscribe=function(e,t){typeof e=="function"&&(t=e,e="any"),subscriber[e]=subscriber[e]||[],subscriber[e].push(t)},TP.publish=function(e,t){var n=0,r=subscriber[e]?subscriber[e].length:0;typeof e=="object"&&t==null&&(t=e,e="any");for(;n<r;n++)subscriber[e][n].apply(null,t)},TP.all=function(){var e=[],t="",n=0,r=0;for(t in groups){r=groups[t].length;for(n=0;n<r;n++)groups[t][n]&&e.push(groups[t][n])}return e},TP.group=function(e){var t=[],n=groups[e],r=0,i=n.length;for(;r<i;r++)n[r]&&t.push(n[r]);return t},TP.chain=function(e,t){e!="all"&&function(e,t){TP.subscribe(e,function(){var n=TP.group(e),r=0,i=n.length;for(;r<i;r++)t.call(n[r])})}(e,t)},initialize()})(),TP("#controller");