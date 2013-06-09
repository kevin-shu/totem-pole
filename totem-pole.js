/*
 * "Totem-Pole.js" v0.0.8
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
        var view = (id=="body") ? document.body : document.getElementById(id);

        if (initData instanceof Array) {
            var that = [];
                i=1,
                max=initData.length;
            that = [];
            that.push( Totem.call({view:view},initData[0],id) );

            for(;i<max;i++){
                var clonedView = view.cloneNode(true),
                    totem = Totem.call({view:clonedView},initData[i],id);
                clonedView.id = '';
                that.push(totem);
                insertAfter(clonedView, view); // Insert after the last node.
                view = clonedView; // Set view as last node.
            }
            return that;
        } else {
            return Totem.call({view:view},initData);
        }
    };

    TP.template = function(id, initData){
        var that={};
        that.view = document.getElementById(id).cloneNode(true);
        Totem.call(that, initData, id);
        return that;
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

    initialize();
    
    // }

    function Totem(initData, groupName) {
        this.view.id='';
        this.data = {};
        this.set = returnSet( this );
        this.kill = kill;
        this.html = this.view.outerHTML;
        this._id = 0;
        this._group = groupName;

        if ( (typeof initData)==="object" ) {
            this.set(initData);
        }

        if (!groups[groupName]){
            groups[groupName] = [];
        }
        this._id = groups[groupName].length;
        groups[groupName].push(this);
    }


    function returnSet(viewModel) {

        var elemDatas = parseDom.call(viewModel.view,{}),
            key = "",
            data = {};

        // This section is for fetching the data already existed in the template.
        // And after that, Totem-pole will "renderView" with the data just fetched from the template.
        // In this way, the "ui-binding" would be established.
        // And the data in the template are just like the default value.
        for (key in elemDatas) {
            var i = 0,
                max = elemDatas[key].length;
            data[key] = null;
            for (;i<max;i++) {
                var element = elemDatas[key][i].dom,
                    type = elemDatas[key][i].type;
                if ( type==="html" && element.innerHTML ) {
                    data[key] = element.innerHTML;
                } else if ( type==="text" && element.innerText ) {
                    data[key] = element.innerText;
                } else if ( type==="value" && element.value ) {
                    data[key] = element.value;
                }
            }
        }
        renderView(viewModel, elemDatas, data);
        // END....2013.6.9 v0.0.8

        // Set one attritute a time
        function setByOnce(key, value) {
            if ( elemDatas.hasOwnProperty(key) ) { // If illegal data pass in, ignore it.
                var _this = elemDatas[key];
                if (typeof value != "function") {
                    this.data[key] = value;
                }
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

            var elements = elemDatas[key],
                type = "",
                element = {},
                data = settings[key],
                i=0,
                max = elements.length;
            for (;i<max;i++){
                type=elements[i].type;
                element=elements[i].dom;
                if ( type==="style" ) {
                    for ( var _key in data ) {
                        element.style[_key]=data[_key];
                    }
                } else if (type==="attr") {
                    for ( var _key in data){
                        element[_key]=data[_key];
                    }
                } else if ( type==="html" ) {
                    element.innerHTML = data;
                } else if ( EVENTS.indexOf(type)!==-1 ) {
                    (function(elem, data){
                        elem.addEventListener(type, function(e){ data.call(elem, viewModel); });
                    })(element, data);
                } else if ( type==="text" ) {
                    element.innerText = data;
                } else if ( type==="value" ) {
                    element.value = data;
                    // element.addEventListener( "change", function(e){ viewModel.set(key, element.value);/*TP.publish("ui-change", [viewModel, key, element.value]);*/ } );
                    element.onchange = function(e){ viewModel.set(key, element.value);/*TP.publish("ui-change", [viewModel, key, element.value]);*/ } ;
                } else {
                    element[type]=data;
                }
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
                if (tpData[ attrs[_i].split(":")[0] ]) { // If this data has been registered
                    tpData[ attrs[_i].split(":")[0] ].push({
                        type: attrs[_i].split(":")[1] || "text",
                        dom: this
                    });
                } else {
                    tpData[ attrs[_i].split(":")[0] ] = [{
                        type: attrs[_i].split(":")[1] || "text",
                        dom: this
                    }];
                }
            }
        }
        return tpData;
    }

    function kill() {
        this.view.remove();
        delete groups[this._group][this._id];
    }

    function initialize() {
        // TP.subscribe("ui-change", function(viewModel, key, value){
        //     viewModel.data[key] = value;
        //     TP.publish(viewModel._group);
        //     TP.publish("all");
        // });
        TP.subscribe("data-change", function(viewModel, elemDatas, settings){
            renderView(viewModel, elemDatas, settings); // "this" represents viewModel
            viewModel.html = viewModel.view.outerHTML;
            TP.publish(viewModel._group);
            TP.publish("all");
        });
    }

    function insertAfter(newElement, ref) {
        var refParent = ref.parentNode;
        var refNext = ref.nextSibling;

        if (refNext === null) {
            refParent.appendChild(newElement);
        } else {
            refParent.insertBefore(newElement, refNext);
        }
        return newElement;
    }
    
})();