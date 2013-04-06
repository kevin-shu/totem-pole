/*
 * "Totem-Pole.js" v0.0.1
 * 
 * Copyright 2013 Kevin Shu
 * Released under the MIT license
 */	

TP = (function(){
	var that = function(id, initData){
		this.view = document.getElementById(id).cloneNode(true);
		this.view.id='';
		this.data = parseDom.call(this.view,{});
		this.setData = setData;
		this.kill = kill;
		this.getView = function(){return this.view;};
		if( (typeof initData)=="object" ){
			this.setData(initData);
		}
	};

	that.extend = function(fnName, fn){
		for(fnName in fn){
			that.prototype[fnName]=fn[fnName];
		}
	}

	var events = [	"onclick",
					"onchange",
					"onfocus",
					"onkeydown",
					"onkeypress",
					"onkeyup",
					"onmousedown",
					"onmouseout",
					"onmouseover",
					"onmouseup",
					"onsubmit"	];

	function setData(key, value){
		if( (typeof key)=="object" ){
			var data = key;
			for (_key in data){
				_this = this.data[_key];
				renderView.call(_this, _key, data[_key], this);
			}
		} else if( (typeof key)=="string" && ["string","object"].indexOf(typeof value)!=-1 ){
			_this = this.data[key];
			renderView.call(_this, key, value);
		}
	}

	// This function will be called by each of viewModel's data.
	function renderView(key, value, viewModel){
		var elem = this.element;
		var type = this.type;
		if(type=="style"){
			for(_key in value){
				elem.style[_key]=value[_key];
			}
		} else if(type=="attr"){
			for(_key in value){
				elem[_key]=value[_key];
			}
		} else if(type=="html"){
			elem.innerHTML = value;
		} else if(events.indexOf(type)!=-1){
			elem[type] = (function(viewModel){
				var _this=elem;
				return function(e){ value.call(_this,viewModel);}
			})(viewModel);
		} else if(type=="text" || type==""){
			elem.innerText = value;
		}
	}

	function parseDom(tpData){
		var children = this.children;
		if(children && children.length!=0){
			for ( _i in children){
				tpData = parseDom.call(children[_i],tpData);
			}
		}
		if(this.dataset && this.dataset['tp']){
			var attrs = this.dataset['tp'].replace(/\s/g, '').split(",");
			for( _i in attrs){
				tpData[ attrs[_i].split(":")[0] ] = {
					type: attrs[_i].split(":")[1] || "",
					element: this
				};
			}
		}
		return tpData;
	}

	function kill(){
		this.view.remove();
	}

	return that;
})();