/*
 * "Totem-Pole.js" v0.0.7
 * 
 * Copyright 2013 Kevin Shu
 * Released under the MIT license
 */

(function() {

    // if ( 'undefined' === typeof TP ) {

    var subscriber = { any:[] },
        groups = [],
        // All the events that available
        EVENTS = [  "click", "change", "focus", "keydown", "keypress", "keyup", "mousedown", "mouseout", "mouseover", "mouseup", "submit"  ];

    TP = function(id, initData) {
        this.view = document.getElementById(id).cloneNode(true);
        this.view.id='';
        this.data = {};
        this.set = returnSet( this.view );
        this.kill = kill;
        this.html = this.view.outerHTML;
        this._id = 0;
        this._group = id;

        if ( (typeof initData)==="object" ) {
            this.set(initData);
        }

        if (!groups[id]){
            groups[id] = [];
        }
        groups[id].push(this);
        this._id = groups[id].length;
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
            max=subscriber[event]?subscriber[event].length:0;
        if ( (typeof event)=="object" && args==null) {
            args = event;
            event = "any";
        }
        for (;i<max;i++) {
            subscriber[event][i].apply(null,args);
        }
    };

    TP.all = function(){
        var totemPole = [],
            key = "",
            i = 0,
            max = 0;
        for (key in groups) {
            max = groups[key].length;
            for(i=0;i<max;i++){
                if (groups[key][i]) {
                    totemPole.push(groups[key][i]);
                }
            }
        }
        return totemPole;
    };

    TP.group = function(groupName){
        var totemPole = [],
            group = groups[groupName],
            i = 0,
            max = group.length;
        for(;i<max;i++){
            if (group[i]) {
                totemPole.push(group[i]);
            }
        }
        return totemPole;
    };

    TP.chain = function(group, callback){
        if(group == "all"){

        } else {
            (function(group, callback){
                TP.subscribe( group, function(){
                    var totemPole = TP.group(group),
                        i = 0,
                        max = totemPole.length;
                    for (; i<max; i++) {
                        callback.call(totemPole[i]);
                    }
                });
            })(group, callback);
        }
    };

    TP.clearGroup = function(){
        for (var key in groups) {
            delete groups[key];
        }
    };

    initialize();
    
    // }

    function returnSet(view) {

        var elemDatas = parseDom.call(view,{});

        // Set one attritute a time
        function setByOnce(key, value) {
            if ( elemDatas.hasOwnProperty(key) ) { // If illegal data pass in, ignore it.
                var _this = elemDatas[key];
                this.data[key] = value;
            }
        }

        return  function (key, value) {
                    var settings = {};
                    if ( (typeof key)==="object" ) {
                        settings = key;
                        for ( var _key in settings) {
                            setByOnce.call(this, _key, settings[_key]);
                        }
                    } else if ( (typeof key)==="string" && ["string","object","function"].indexOf(typeof value)!==-1 ) {
                        setByOnce.call(this, key, value);
                        settings[key] = value;
                    }
                    TP.publish("data-change", [this, elemDatas, settings]);
                }
    }

    // This function will be called by each of viewModel's data.
    function renderView(viewModel, elemDatas, settings) {
        for (var key in settings) {

            // If illegal data pass in, ignore it.
            if (!elemDatas.hasOwnProperty(key)) {continue;}

            var elem = elemDatas[key].element,
                type = elemDatas[key].type,
                data = settings[key];
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
            } else if ( EVENTS.indexOf(type)!==-1 ) {
                (function(elem, data){
                    elem.addEventListener(type, function(e){ data.call(elem, viewModel); });
                })(elem, data);
            } else if ( type==="text" || type==="" ) {
                elem.innerText = data;
            } else if ( type==="value" ) {
                elem.value = data;
                elem.addEventListener( "change", function(e){ TP.publish("ui-change", [viewModel, key, elem.value]); } );
            } else {
                elem[type]=data;
            }
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
        delete groups[this._group][this._id];
    }

    function initialize() {
        TP.subscribe("ui-change", function(viewModel, key, value){
            viewModel.data[key] = value;
            TP.publish(viewModel._group);
        });
        TP.subscribe("data-change", function(viewModel, elemDatas, settings){
            renderView(viewModel, elemDatas, settings); // "this" represents viewModel
            viewModel.html = viewModel.view.outerHTML;
            TP.publish(viewModel._group);
        });
    }
    
})();