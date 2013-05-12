/*
 * "Totem-Pole.js" v0.0.6
 * 
 * Copyright 2013 Kevin Shu
 * Released under the MIT license
 */

(function() {

    if ( 'undefined' === typeof TP ) {

        var subscriber = { any:[] };

        TP = function(id, initData) {
            this.view = document.getElementById(id).cloneNode(true);
            this.view.id='';
            this.data = {};
            this.set = returnSet( this.view );
            this.kill = kill;
            this.html = this.view.outerHTML;

            if ( (typeof initData)==="object" ) {
                this.set(initData);
            }
        };

        TP.subscribe = function (event, callback) {
            if (typeof event == "function") {
                callback = event;
                event = "any";
            }
            subscriber[event] = subscriber[event]||[];
            subscriber[event].push(callback);
        };

        TP.publish = function (event, args) {
            var i=0,
                max=subscriber[event].length;
            if ( (typeof event)=="object" && args==null) {
                args = event;
                event = "any";
            }
            for (;i<max;i++) {
                subscriber[event][i].apply(null,args);
            }
        }
    }

    // All the events that available
    var events = [  "click",
                    "change",
                    "focus",
                    "keydown",
                    "keypress",
                    "keyup",
                    "mousedown",
                    "mouseout",
                    "mouseover",
                    "mouseup",
                    "submit"  ];

    function returnSet(view) {

        var elemData = parseDom.call(view,{});

        function setByOnce(key, value) {
            if ( elemData.hasOwnProperty(key) ) { // If illegal data pass in, ignore it.
                var _this = elemData[key];
                renderView.call(_this, value, this); // "this" presents viewModel
                this.data[key] = value;
            }
        }

        return  function (key, value) {
                    if ( (typeof key)==="object" ) {
                        var data = key;
                        for ( var _key in data) {
                            setByOnce.call(this, _key, data[_key]);
                        }
                    } else if ( (typeof key)==="string" && ["string","object","function"].indexOf(typeof value)!==-1 ) {
                        setByOnce.call(this, key, value);
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
            elem["on"+type] = function(e){ data.call(elem,viewModel);};
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