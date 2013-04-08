/*
 * "Totem-Pole.js" v0.0.4
 * 
 * Copyright 2013 Kevin Shu
 * Released under the MIT license
 */	

TP = (function(){
	var that = function(id, initData){

		this.view = document.getElementById(id).cloneNode(true);
		this.view.id='';
		this.data = {};
		this.setData = returnSetData( this.view );
		this.kill = kill;
		this.html = this.view.outerHTML;

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

	function returnSetData(view){

		var elemData = parseDom.call(view,{});

		return 	function (key, value){
					if( (typeof key)=="object" ){
						var data = key;
						for (_key in data){
							_this = elemData[_key];
							if((typeof _this)!="undefined"){ // If illegal data pass in, ignore it.
								renderView.call(_this, _key, data[_key], this);
								this.data[_key] = data[_key];
							}
						}
					} else if( (typeof key)=="string" && ["string","object"].indexOf(typeof value)!=-1 ){
						_this = elemData[key];
						if((typeof _this)!="undefined"){ // If illegal data pass in, ignore it.
							renderView.call(_this, key, value, this);
							this.data[key] = value;
						}
					}
					this.html = this.view.outerHTML;
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
			elem[type] = function(e){ value.call(elem,viewModel);};
		} else if(type=="text" || type==""){
			elem.innerText = value;
		} else{
			elem[key]=value;
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