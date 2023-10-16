/**
*   DOMmy.JS
*   Author:    Riccardo Degni (http://www.riccardodegni.com)
*   What:      Allows modern and super lite DOM navigation, Elements Collections,
*              CSS styles, FX animations through CSS3, Events, Storage, Fetch-AJAX, DOMReady.
*              All DOMmy.js methods are cross-browser and well-supported by all MODERN browsers.
*   License:   MIT License
*   Version:   2.0
*   Copyright: Copyright (c) 2019 Riccardo Degni (http://www.riccardodegni.com)
**/

var Dommy = {
  'author': {
    'name': 'Riccardo Degni',
    'website': 'http://www.riccardodegni.com/'
  },
  'version': 2.0,
  'copyright': 'Riccardo Degni',
  'license': 'MIT License'
};

Dommy.Globals = {
  "ExtendObj": function (obj, properties){
    for (prop in properties) {
      obj[prop] = properties[prop];
    }
  },
  "Extend": function (obj, properties){
    for (prop in properties) {
      Object.defineProperty(obj, prop, {
        'value': properties[prop],
        'writable': false,
        'configurable': false,
        'enumerable': false
      });
    }
  },
  "Extends": function (){
    for(let i = 0; i<arguments.length; i++) {
      Dommy.Globals.Extend(arguments[i][0], arguments[i][1]);
    }
  },
  "ElementFeatures": {
    "css": [ "width" , "height", "top", "left", "right", "bottom", "position", "float", "clear",
             "padding", "margin", "border", "padding-top", "padding-right", "padding-bottom", "padding-left",
             "margin-top", "margin-right", "margin-bottom", "margin-left",
             "border-top", "border-right", "border-bottom", "border-left", "border-width",
             "border-top-width"], // you can add all the properties you want
    "attr": [ "title", "lang"]
  },
  "ElementCssPrefixes": ["", "-webkit-", "-moz-"],
  "ElementUnits": ["px", "%", "em", "rem", "vw"]
};

Dommy.ElementUtilities = {
  "computeRelativeCssValue": function(prop, value) {
    var val, currentVal, newVal, _unit = "px", args = arguments;

    if(arguments[1].indexOfOr(["+=", "-="]) != -1) {
      Dommy.Globals.ElementUnits.forEach(function(unit) {
        if(args[1].indexOf(unit) != -1)
          _unit = unit;
      });

      val = parseInt(arguments[1].replaceMulti(["+=", "-="], ""));
      currentVal = parseInt(this.getCss(arguments[0].toCamelCase()));

      switch (arguments[1].charAt(0)) {
        case "+":
          newVal = (val+currentVal)+_unit;
          break;
        case "-":
          newVal = (currentVal-val)+_unit;
          break;
      }
    } else {
      newVal = arguments[1];
    }

    return newVal;
  }
};

Dommy.ElementMethods = {
  /**
  *	@Method: setCss
  *	@What:	sets one or multiple CSS values
  *	@How:
  *	el.setCss({'width': '100px', 'height': '200px'});
  *	el.setCss('width', '100px');
  **/
  "setCss" : function() {
    switch (arguments.length) {
      case 1:
          var css = arguments[0];
          for(prop in css){
            let finalVal = Dommy.ElementUtilities.computeRelativeCssValue.call(this, prop, css[prop]);
            this.style[prop.toCamelCase()] = finalVal;
          }
        break;
      case 2:
          let finalVal = Dommy.ElementUtilities.computeRelativeCssValue.call(this, arguments[0], arguments[1]);
          this.style[arguments[0].toCamelCase()] = finalVal;
        break;
      }
      return this;
  },

  /**
  *	@Method: getCss
  *	@What:	gets one or multiple CSS values
  *	@How:
  *	el.getCss('width', 'height');
  **/
  "getCss" : function() {
    let styles = window.getComputedStyle(this);
    switch (arguments.length) {
      case 1:
          return styles[arguments[0].toCamelCase()];
          //return styles.getPropertyValue(arguments[0].toCamelCase());
        break;
      default:
          var resultObject = {};
          for (let i = 0; i < arguments.length; i++) {
              resultObject[arguments[i]] = styles.getPropertyValue(arguments[i].toCamelCase());
          }
          return resultObject;
    }
  },

  "getFullWidth": function(includeBorders = false) {
    return (includeBorders) ? this.offsetWidth : this.clientWidth;
  },

  "getFullHeight": function(includeBorders = false) {
    return (includeBorders) ? this.offsetHeight : this.clientHeight;
  },

  /**
  *	@Method: addClass
  *	@What:	adds one or several classes
  *	@How:
  *	el.addClass('classA');
  *	el.addClass('classA', 'classB');
  **/
  "addClass": function() {
    if(this.classList) {
      for (let i = 0; i < arguments.length; i++) {
        this.classList.add(arguments[i]);
      }
      return this;
    }

    // IE 9
    let currentClass = this.className;
    this.className += (currentClass) ? ' ' : '';
    switch (arguments.length) {
      case 1:
          this.className += arguments[0];
        break;
      default:
        for (let i = 0; i < arguments.length; i++) {
          this.className += arguments[i] + ((i == arguments.length-1) ? '' : ' ');
        }
    }
    return this;
  },

  /**
  *	@Method: toggleClass
  *	@What:	toggles one or several classes
  *	@How:
  *	el.toggleClass('classA');
  *	el.toggleClass('classA', 'classB');
  **/
  "toggleClass": function() {
    if(this.classList) {
      for (let i = 0; i < arguments.length; i++) {
        this.classList.toggle(arguments[i]);
      }
      return this;
    }

    // IE 9
    let currentClass = this.className;
    this.className += (currentClass) ? ' ' : '';

    for (let i = 0; i < arguments.length; i++) {
      let classes = this.className.split(" ");
      let check = classes.indexOf(arguments[i]);

      if (check >= 0)
        classes.splice(check, 1);
      else
        classes.push(arguments[i]);

      this.className = classes.join(" ");
    }

    return this;
  },

  /**
  *	@Method: setHtml
  *	@What:	sets or appends HTML content
  *	@How:
  *	el.setHtml('new content');
  *	el.setHtml('new content', 'a');
  **/
  "setHtml": function() {
    switch (arguments.length) {
      case 1:
          this.innerHTML = arguments[0];
        break;
      case 2:
          if(arguments[1].toLowerCase() == "a")
            this.innerHTML +=  arguments[0];
        break;
    }
    return this;
  },

  /**
  *	@Method: setAttr
  *	@What:	sets one or multiple attributes
  *	@How:
  *	el.setAttr({'title': 'the title', 'lang': 'en'});
  *	el.setAttr('title', 'the title');
  **/
  "setAttr": function() {
    switch (arguments.length) {
      case 1:
        for (let arg in arguments[0]){
          this.setAttribute(arg, arguments[0][arg]);
        }
        break;
      case 2:
        this.setAttribute(arguments[0], arguments[1]);
        break;
    }
    return this;
  },

  /**
  *	@Method: getAttr
  *	@What:	returns one or multiple attributes
  *	@How:
  *	el.getAttr('title', 'class');
  **/
  "getAttr": function () {
    switch (arguments.length) {
      case 1:
          return this.getAttribute(arguments[0].toCamelCase());
        break;
      default:
          var resultObject = {};
          for (let i = 0; i < arguments.length; i++){
              resultObject[arguments[i]] = this.getAttribute(arguments[i].toCamelCase());
          }
          return resultObject;
    }
  },

  "addEvent": function (type, fn, bubble = true) {
    if (window.addEventListener != undefined) {
      this.addEventListener(type, fn, bubble);
    } else if(window.attachEvent != undefined){
      this.attachEvent(type, fn);
    }
    return this;
  },

  /**
  *	@Method: on
  *	@What:	adds one or multiple events in a cross-browser fashion
  *	@How:
  *	el.on('click', fn);
  *	el.on({'click': fn, 'mouseover': fn2});
  **/
  "on": function () {
    switch (typeof(arguments[0])) {
      case "string":
        return this.addEvent.apply(this, Array.prototype.slice.call(arguments));
      default:
        for (let arg in arguments[0]) {
          this.addEvent.apply(this, [arg, arguments[0][arg], arguments[1]]);
        }
    }
    return this;
  },

  /**
  *	@Method: hover
  *	@What:	adds an event for both mouse-over and mouse-out. 'this' is bound to current element
  *	@How:
  *	el.hover(fnOn, fnOut);
  **/
  "hover": function(on, out) {
    return this.on({
      'mouseover': on.bind(this),
      'mouseout': out.bind(this),
    });
  },

  /**
  *	@Method: set
  *	@What:	sets a value to the internal storage
  *	@How:
  *	el.set('prop', 'value');
  * el.set({'prop1': 'value1', 'prop2': 'value2'});
  **/
  "set": function() {
    if(!this.storage) this.storage = {};
    switch(arguments.length) {
      case 1:
        for(var prop in arguments[0]) {
          this.storage[prop] = arguments[0][prop];
        }
      case 2:
        this.storage[arguments[0]] = arguments[1];
    }

    return this;
  },

  /**
  *	@Method: get
  *	@What:	returns a value from the internal storage
  *	@How:
  *	el.get('prop');
  **/
  "get": function(prop) {
    if(!this.storage) this.storage = {};
    return this.storage[prop] != undefined ? this.storage[prop] : undefined;
  },

  /**
  *	@Method: data
  *	@What:	sets or returns a value from the internal storage. Shorthand for .get and .set
  *	@How:
  *	el.data('prop');  // get
  *	el.data('prop', 'value'); // set
  * el.data({'prop1': 'value1', 'prop2': 'value2'});  // set
  **/
  "data": function() {
    if(!this.storage) this.storage = {};
    switch(arguments.length) {
      case 1:
        switch(typeOf(arguments[0])) {
          case 'string':
            return this.get(arguments[0]);
          case 'object':
            return this.set(arguments[0]);
        }
      break;

      case 2:
        return this.set(arguments[0], arguments[1]);
    }
  },

  "clearFx": function() {
    let props = {};
    Dommy.Globals.ElementCssPrefixes.forEach(function(variant) {
      props[variant+'transition-property'] = 'none';
    });
    return this.setCss(props);
  },

  /**
  *	@Method: fx
  *	@What:	performs a CSS3 animation or a chain of animations
  *	@How:
  *	el.fx([cssObj, duration, onComplete], [cssObj, duration, onComplete], ...);
  **/
  "fx": function() {

    let settings = Array.prototype.slice.call(arguments);
    let fullDuration = 0, delay;

    this.set('fx', uuidv4());

    if(!this.get("timeoutFx")) this.set("timeoutFx", []);
    if(!this.get("timeoutComplete")) this.set("timeoutComplete", []);

    if(this.get("timeoutFx")) {
      this.get("timeoutFx").forEach(function(tm) {
        clearTimeout(tm);
      }, this);
    }

    if(this.get("timeoutComplete")) {
      this.get("timeoutComplete").forEach(function(tm) {
        clearTimeout(tm);
      }, this);
    }

    settings.forEach(function(setting, i) {
      let css = setting[0];
      let duration = setting[1] || 5;
      let complete = setting[2] || false;
      let props = {};

      // standard, old safari, old mozilla
      Dommy.Globals.ElementCssPrefixes.forEach(function(variant) {
        props[variant+'transition-property'] = 'all';
        props[variant+'transition-duration'] = duration + 's';
        props[variant+'transition-timing-function'] = 'linear';
      });

      Dommy.Globals.ExtendObj(props, css);
      let cssFx = function() {
          if(complete) {
            this.get("timeoutComplete").push( complete.bind(this).delay((duration*1000)-100) );
          }
          this.setCss.call(this, props);
      }.bind(this);

      delay = (i == 0) ? 0 : fullDuration;

      fullDuration += duration;
      this.get("timeoutFx").push( cssFx.delay((delay*1000)+10) );
    }, this);

    return this;
  },

  /**
  *	@Method: ajax
  *	@What:	produces a Fecth-Ajax request that expects a JSON response. Success and error handlers are this-bound.
  *         The response is optionally injected into 'this' element as HTML.
  *	@How:
  *	el.ajax(url, successFn, errorFn, options?, inject?);
  **/
  "ajax": function(url, success, error, options = {}, inject = true) {
    let _this = this;
    let errorFn = error || function(error) {log(error);};

    fetch(url)
    .then((resp) => resp.json())
    .then(function(data) {
      let ret = success.apply(_this, [data]);
      if(inject) _this.setHtml(ret);
    })
    .catch(errorFn.bind(_this));
  }
};

Dommy.Globals.Extends(
  // HTML Elements
  [HTMLElement.prototype, Dommy.ElementMethods],

  // Strings
  [String.prototype, {
    "toCamelCase" : function () {
      return this.replace(/^([A-Z])|[\s-_]+(\w)/g, function(match, p1, p2, offset) {
        if (p2) return p2.toUpperCase();
        return p1.toLowerCase();
      });
    },
    "ucFirst" : function(){
        return this.slice(0,1).toUpperCase() + this.slice(1);
    },
    "replaceMulti": function(strings, replacement) {
      var obj = this;
      strings.forEach(function(string) {
        obj = obj.replace(string, replacement);
      });
      return obj;
    },
    "indexOfOr": function(strings) {
      let ret = -1;
      for (let i = 0; i < strings.length; i ++) {
        if (this.indexOf(strings[i]) != -1){
          ret = this.indexOf(strings[i]);
          break;
        }
      }
      return ret;
    }
  }],

  // Function
  [Function.prototype, {
    /**
    *	@Method: delay
    *	@What:	delays a function
    *	@How:
    *	fn.delay(1000);
    **/
    "delay": function(delayTime, argsIn, thisObj) {
      return setTimeout.apply(null,
        [(thisObj ? this.bind(thisObj) : this), delayTime, argsIn].flat());
    }
  }],

  // Window
  [window, {
    /**
    *	@Method: $
    *	@What:	returns an Element by id
    *	@How:
    *	$('element')
    **/
    "$" : function (selector) {
      return document.getElementById(selector);
    },

    /**
    *	@Method: $$
    *	@What:	returns a collection of Elements by selector
    *	@How:
    *	$$('selector')
    **/
    "$$" : function (selector) {
      return document.querySelectorAll(selector);
    },

    /**
    *	@Method: log
    *	@What:	shorthand, safe check for console.log
    *	@How:
    *	log('element', ...)
    **/
    "log": function(){
      if(!console) return;
      for(let i = 0; i< arguments.length;i++)
        console.log(arguments[i]);
    },

    /**
    *	@Method: uuidv4
    *	@What:	returns a UUID
    *	@How:
    *	uuidv4()
    **/
    "uuidv4": function() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    },

    /**
    *	@Method: typeOf
    *	@What:	returns the correct type of the variable. Checks for array, date and null
    *	@How:
    *	typeOf([1, 2, 3]) --> 'array'
    * typeOf(new Date()) --> 'date'
    **/
    "typeOf": function(data) {
      let type = typeof data;
      switch(type) {
        case 'object':
          if(data === null) return 'null';
          if(Array.isArray(data)) return 'array';
          if(data.constructor === Date) return 'date';
          return type;

        default:
          return type;
      }
    }
  }]

);

/**
*	@Method: shorctcuts
*	@What:	returns or applies CSS style property with a shorthand
*	@How:
*	el.setWidth("100px"); el.setHeight("100px");
* el.getWidth();
**/
// Add element shorctcuts setCss("width": "100px") --> setWidth("100px")
Dommy.ElementMethodsShortcut = { };
for(let type in Dommy.Globals["ElementFeatures"]) {

  Dommy.Globals["ElementFeatures"][type].forEach(function(prop) {
    let methodName = prop.toCamelCase().ucFirst();
    let methodNameSetter = "set" + methodName;
    let methodNameGetter = "get" + methodName;

    Dommy.ElementMethodsShortcut[methodNameSetter] = function(val){
        return this["set" + type.ucFirst()](prop, val);
    };
    Dommy.ElementMethodsShortcut[methodNameGetter] = function(){
        return this["get" + type.ucFirst()](prop);
    };
    Dommy.Globals.Extend(HTMLElement.prototype, Dommy.ElementMethodsShortcut);
  });

}
Dommy.Globals.Extend(Dommy.ElementMethods, Dommy.ElementMethodsShortcut);

// add multi-element capability
var methods = { };
for(let methodName in Dommy.ElementMethods) {

  methods[methodName] = function(){
    let args = arguments;
    let rets = [];

    this.forEach(function (el){
      let ret = el[methodName].bind(el).apply(el, args);
      if(!(ret instanceof HTMLElement)) {
        rets.push(ret);
      }
    });

    return (rets.length > 0) ? rets : this;
  };

}
Dommy.Globals.Extend(NodeList.prototype, methods);
Dommy.Globals.Extend(HTMLCollection.prototype, methods);

/**
*	@Method: Collection.forEach
*	@What:	loops through a collection of HTML elements and execute a function passing in both the element and the index
*	@How:
*	$$('#myBox img').forEach(function(img, el) {
*   // ...
  })
**/
Dommy.Globals.Extend(NodeList.prototype, {
  'forEach': function(fn) {
    for (let i = 0; i < this.length; i++) {
      fn.apply(this, [this[i], i]);
    }
    return this;
  }
});

/**
*	@Method: Element
*	@What:	creates an HTML element of the specified type with attributes and CSS styles applied
*	@How:
*	let myel = Dommy.Element('div', {
*  'attr': {'id': 'myDiv'},
*  'css': {'width': '100px', 'height': '100px', 'background-color': 'blue'}
* });
**/
Dommy.Globals.Extend(Dommy, {
  'Element': function(tagName, features) {
    let element = document.createElement(tagName);
    if(features) {
      if(features['attr']) element.setAttr(features['attr']);
      if(features['css']) element.setCss(features['css']);
      if(features['events']) element.on(features['events']);
      if(features['appendTo']) features['appendTo'].appendChild(element);
    }
    return element;
  },
  'Div': function(features) {
    return Dommy.Element('div', features);
  }
});

/**
*	@Method: $$$
*	@What:	fires the event handler when DOM is ready
*	@How:
*	$$$(fn)
**/
Dommy.DomReady = {
    'bindReady': function(handler) {
        var called = false;
        function ready() {
            if (called) return;
            called = true;
            handler();
        }
        if ( document.addEventListener ) {
            document.addEventListener( "DOMContentLoaded", function() {
                ready();
            }, false )
        } else if ( document.attachEvent ) {
            if ( document.documentElement.doScroll && window == window.top ) {
                function tryScroll(){
                    if (called) return;
                    if (!document.body) return;
                    try {
                        document.documentElement.doScroll("left");
                        ready();
                    } catch(e) {
                        setTimeout(tryScroll, 0);
                    }
                }
                tryScroll();
            }
            document.attachEvent("onreadystatechange", function(){
                if ( document.readyState === "complete" ) {
                    ready();
                }
            })
        }
        if (window.addEventListener)
            window.addEventListener('load', ready, false);
        else if (window.attachEvent)
            window.attachEvent('onload', ready);
    },

    'readyList': [],

    '$$$': function (handler) {
        if (!this.readyList.length) {
            this.bindReady(function() {
                for(var i=0; i<this.readyList.length; i++) {
                    this.readyList[i]();
                }
            })
        }
        this.readyList.push(handler);
    }
};
Dommy.Globals.Extend(window, Dommy.DomReady);


/*
  Needed Polyfills
*/
// Array.isArray
if (!Array.isArray) {
  Array.isArray = function(arg) {
    return Object.prototype.toString.call(arg).indexOf('Array') != -1;
  };
}

// Array.proto.flat
if (!Array.prototype.flat) {
	Dommy.Globals.Extend(Array.prototype, {
		'flat': function() {
			return this.reduce((acc, val) => acc.concat(val), []);
		}
	});
}
