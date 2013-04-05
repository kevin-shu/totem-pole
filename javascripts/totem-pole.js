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
		// var viewModel = {};
		this.data = parseDom.call(this.view,{});
		this.setData = setData;
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

	function setData(key, value){
		if( (typeof key)=="object" ){
			var data = key;
			for (_key in data){
				_this = this.data[_key];
				renderView.call(_this, _key, data[_key]);
			}
		} else if( (typeof key)=="string" && ["string","object"].indexOf(typeof value)!=-1 ){
			_this = this.data[key];
			renderView.call(_this, key, value);
		}
	}

	function renderView(key, value){
		elem = this.element;
		if(this.type=="style"){
			for(_key in value){
				elem.style[_key]=value[_key];
			}
		} else if(this.type=="html"){
			elem.innerHTML = value;
		} else if(this.type=="text"){
			elem.innerText = value;
		} else if(this.type=="click"){
			elem.onclick = (function(){
				var _this=elem;
				return function(e){ value.call(_this,e);}
			})();
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
					type: attrs[_i].split(":")[1],
					element: this
				};
			}
		}
		// console.log(tpData);
		return tpData;
	}

	return that;
})();