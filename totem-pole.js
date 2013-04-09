/*
 * "Totem-Pole.js" v0.0.5
 * 
 * Copyright 2013 Kevin Shu
 * Released under the MIT license
 */

(function() {

    if ( 'undefined' === typeof TP ) {

        TP = function(id, initData) {
            this.view = document.getElementById(id).cloneNode(true);
            this.view.id='';
            this.data = {};
            this.setData = returnSetData( this.view );
            this.kill = kill;
            this.html = this.view.outerHTML;

            if ( (typeof initData)==="object" ) {
                this.setData(initData);
            }
        };

        TP.extend = function(fnName, fn) {
            for ( var fnName in fn ) {
                that.prototype[fnName] = fn[fnName];
            }
        };
    }

    var events = [  "onclick",
                    "onchange",
                    "onfocus",
                    "onkeydown",
                    "onkeypress",
                    "onkeyup",
                    "onmousedown",
                    "onmouseout",
                    "onmouseover",
                    "onmouseup",
                    "onsubmit"  ];

    function returnSetData(view) {

        var elemData = parseDom.call(view,{});

        return  function (key, value) {
                    if ( (typeof key)==="object" ) {
                        var data = key;
                        for ( var _key in data) {
                            if( elemData.hasOwnProperty(_key) ){ // If illegal data pass in, ignore it.
                                var _this = elemData[_key];
                                renderView.call(_this, data[_key], this);
                                this.data[_key] = data[_key];
                            }
                        }
                    } else if ( (typeof key)==="string" && ["string","object","function"].indexOf(typeof value)!==-1 ) {
                        if ( elemData.hasOwnProperty(key) ) { // If illegal data pass in, ignore it.
                            var _this = elemData[key];
                            renderView.call(_this, value, this);
                            this.data[key] = value;
                        }
                    }
                    this.html = this.view.outerHTML;
                }
    }

    // This function will be called by each of viewModel's data.
    function renderView(data, viewModel) {
        var elem = this.element;
        var type = this.type;
        if ( type==="style" ) {
            for ( var _key in data ) {
                elem.style[_key]=data[_key];
            }
        } else if (type==="attr") {
            for ( var _key in data){
                elem[_key]=data[_key];
            }
        } else if ( type==="html" ) {
            elem.innerHTML = data;
        } else if ( events.indexOf(type)!==-1 ) {
            elem[type] = function(e){ data.call(elem,viewModel);};
        } else if ( type==="text" || type==="" ) {
            elem.innerText = data;
        } else {
            elem[type]=data;
        }
    }

    function parseDom(tpData) {
        var children = this.children;
        if (children && children.length!=0) {
            for ( var _i in children){
                tpData = parseDom.call(children[_i],tpData);
            }
        }
        if (this.dataset && this.dataset['tp']) {
            var attrs = this.dataset['tp'].replace(/\s/g, '').split(",");
            for ( var _i in attrs) {
                tpData[ attrs[_i].split(":")[0] ] = {
                    type: attrs[_i].split(":")[1] || "",
                    element: this
                };
            }
        }
        return tpData;
    }

    function kill() {
        this.view.remove();
    }
    
})();