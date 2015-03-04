// JavaScript Document
(function(window) {
    window.D = function(elem) {
        return new dom(elem);
    }
    //创建元素
    D.create_elem=function(obj) {
        if(!(obj&&obj.nodeName)){
            return null;
        }
        if((typeof obj.reload!="undefined")&&obj.reload){
            var elem =typeof obj.id=="string"?document.getElementById(obj.id):obj.id;
            elem.innerHTML="";
        }else{
            var elem = document.createElement(obj.nodeName);
        }
        for (var i in obj) {
            if (i == "nodeName") {
                continue;
            } else if (i == "childs") {
                var tmp_obj = obj[i];
                for (var j = 0, len = tmp_obj.length; j < len; j++) {
                    if(!tmp_obj[j]){
                        continue;
                    }
                    if (tmp_obj[j].ownerDocument) {
                        elem.appendChild(tmp_obj[j]);
                    } else {
                        elem.appendChild(arguments.callee(tmp_obj[j]));
                    }
                }
            } else if (i == "css") {
                var styles = obj[i];
                for (var j in styles) {
                    if (j == "float") {
                        if (document.all) {
                            elem.style.styleFloat = styles[j];
                        } else {
                            elem.style.cssFloat = styles[j];
                        }
                    } else {
                        elem.style[j] = styles[j];
                    }
                }
            }else if(i == "className"){
                D(elem).addClass(obj[i]);
            }else if (typeof elem[i] != "undefined") {
                elem[i] = obj[i];
            } else {
                elem.setAttribute(i, obj[i]);
            }
        }
        return elem;
    }
    function dom(elem) {
        this.elem = elem;
    }
    dom.prototype.getParent=dom.prototype.isparent_or_owner = function(obj) {
        var parent_elem = this.elem;
        while (parent_elem) {
            if (parent_elem != null && parent_elem != document.body) {
                    var isparent = true;
                    for (var i in obj) {
                        if (!(i == "className" ? new RegExp("(^| )"+obj[i]+"( |$)").test(parent_elem[i]) : (i=="elem"?parent_elem==obj[i]:parent_elem[i] == obj[i]))) {
                            isparent = false;
                        }
                    }
                    if (isparent) {
                        return parent_elem;
                    } else {
                        parent_elem = parent_elem.parentNode;
                    }
            } else {
                    return false;
            }
        }
        return false;
    }
    dom.prototype.prev = function() {
        elem = this.elem;
        while (elem.previousSibling != null) {
            elem = elem.previousSibling;
            if (elem.nodeType == 1) {
                return elem;
            }
        }
        return null;
    }
    dom.prototype.next = function() {
        elem = this.elem;
        while (elem.nextSibling != null) {
            elem = elem.nextSibling;
            if (elem.nodeType == 1) {
                return elem;
            }
        }
        return null;
    }
    dom.prototype.getSiblings = function() {
            elem = this.elem;
            var childrens = elem.parentNode.childNodes;
            var siblings = new Array();
            for (var i = 0, len = childrens.length; i < len; i++) {
                var current = childrens[i];
                if (current.nodeType == 1) {
                    if (current != elem) {
                        siblings.push(current);
                    }
                }
            }
            return siblings.length > 0 ? siblings : null;
        }
        //添加class和删除class
    dom.prototype.addClass = function(value) {
        elem = this.elem;
        var classValue = elem.className;
        if (classValue == "") {
            elem.className = value;
        } else {
            var arr = classValue.split(" ");
            for (var i = 0, len = arr.length; i < len; i++) {
                if (arr[i] == value) {
                    return this;
                }
            }
            elem.className = elem.className + " " + value;
            return this;
        }
    }
    dom.prototype.removeClass = function(value) {
        elem = this.elem;
        var classValue = elem.className;
        if (classValue.indexOf(" ") < 0) {
            if (classValue == value) {
                elem.className = "";
            }
        } else {
            var arr = classValue.split(" ");
            for (var i = 0, len = arr.length; i < len; i++) {
                if (arr[i] == value) {
                    arr.splice(i, 1);
                    elem.className = arr.join(" ");
                    break;
                }
            }
        }
    }
    dom.prototype.hasClass = function(value) {
        elem = this.elem;
        var classValue = elem.className;
        var reg = new RegExp("(?:" + value + ")\\b");
        if (reg.test(classValue)) {
            return true;
        } else {
            return false;
        }
    }
    dom.prototype.getChilds = function(index) {
        elem = this.elem;
        if (typeof index == "undefined") {
            var childs = elem.childNodes;
            var results = new Array();
            for (var i = 0, len = childs.length; i < len; i++) {
                if (childs[i].nodeType == 1) {
                    results.push(childs[i]);
                }
            }
            return results;
        } else {
            var childs = elem.childNodes;
            var currentIndex = 0;
            for (var i = 0, len = childs.length; i < len; i++) {
                if (childs[i].nodeType == 1) {
                    if (currentIndex == index) {
                        return childs[i];
                    } else {
                        currentIndex++;
                    }
                }
            }
        }
        return [];
    }
})(window);
var utils={
    //获取有前缀的样式名称，用于js动态设置
    get_vendor_style:function(style){
        var jstyle=style.charAt(0).toUpperCase()+style.substr(1);
        var vendor=[style,"webkit"+jstyle,"ms"+jstyle,"o"+jstyle,"moz"+jstyle];
        var elem_style=document.createElement("div").style;
        for(var i=0,len=vendor.length;i<len;i++){
            if(vendor[i] in elem_style){
                return vendor[i];
            }
        }
    },
    get_obj_type:function(obj){
        return Object.prototype.toString.call(obj).slice(8,-1).toLowerCase();
    },
    extend:function(old,newo,filter){
        var self=this;
        filter=filter||function(){return false;}
        function _extend(_old,_new){
            for(var i in _new){
                if(self.get_obj_type(_new[i])=="object"){
                    if(self.get_obj_type(_old[i])!="object"){
                        _old[i]={};
                    }
                    _extend(_old[i],_new[i]);
                }else{
                    if(!filter(i,_old,_new)){
                        _old[i]=_new[i];
                    }
                }
            }
        }
        _extend(old,newo);
    },
    window_open:function(){
        if (target == "_blank") {
            var ziyemian = window.open("about:blank", target);
            ziyemian.location.href = url;
        } else {
            window.open(url, target);
        }
    },
    import_script:function(){//快捷引入脚本
        for (var i = 0, len = arr.length; i < len; i++) {
            document.write("<script src='" + arr[i] + "'><\/script>");
        }
    },
    import_style:function(arr) {//快捷引入样式
        for (var i = 0, len = arr.length; i < len; i++) {
            document.write("<link rel='stylesheet' type='text/css' href='" + arr[i] + "' />");
        }
    },
    require_script:function(src, func) {
        var script = document.createElement("script");
        if (typeof require_script.script == "object") {
            if (require_script.script[src] == true) {
                return true;
            }
        } else {
            require_script.script = new Object();
        }
        require_script.script[src] = true;
        script.type = "text/javascript";
        if (script.readyState) {
            script.onreadystatechange = function() {
                if (script.readyState == "loaded" || script.readyState == "complete") {
                    script.onreadystatechange = null;
                    if (typeof func == "function") {
                        func();
                    }
                }
            }
        } else {
            script.onload = function() {
                func();
            }
        }
        script.src = src;
        document.getElementsByTagName("head")[0].appendChild(script);
    },
    yibu_tishi:function(message) {//异步提示插件
        var option = {
            top: "10px",
            left: "50%",
            width: "200px",
            height: "50px",
            background: "#EDFF91",
			zIndex:1000000
        }
        var div = document.createElement("div");
        div.style.position = "fixed";
        div.style.bottom = "-" + option.height;
        div.style.left = option.left;
        div.style.width = option.width;
        div.style.height = option.height;
        div.style.backgroundColor = option.background;
        div.style.marginLeft = "-" + parseInt(option.width.slice(0, -2) / 2) + "px";
        div.innerHTML = message;
        $(div).css({
            opacity: "50",
            textAlign: "center",
            paddingTop: "15px"
        });
        $(div).animate({
            opacity: "show",
            top: option.top
        }, 700);
        document.body.appendChild(div);
        setTimeout(function() {
            document.body.removeChild(div);
        }, 3200);
    },
    lionload:function (func) {//onload函数
        var odd = window.onload;
        window.onload = function() {
            odd && odd();
            func();
        }
    },
    map:function(arr, func) {//常用map函数
        for (var i = 0, len = arr.length; i < len; i++) {
            func(arr[i], i);
        }
    },
    getScriptPath:function(script, add) {//得到js文件本身路径
        var scripts = document.scripts;
        var srcs = new Array();
        for (var i = 0, len = scripts.length; i < len; i++) {
            if (scripts[i].src == null) {
                continue;
            }
            var regstr = "/^(.*)\\/" + script + "$/";
            var reg = eval(regstr);
            var matchs = reg.exec(scripts[i].src);
            if (matchs) {
                srcs.push(matchs[1] + "/");
            }
        }
        if (srcs.length == 0) {
            return null;
        } else if (srcs.length == 1) {
            return srcs[0];
        } else {
            if (typeof add == "undefined") {
                return srcs[0];
            }
            var regstr = "/\\/" + add + "\\//";
            var reg = eval(regstr);
            for (var i = 0, len = srcs.length; i < len; i++) {
                if (srcs[i].search(reg) >= 0) {
                    return srcs[i];
                }
            }
            return null;
        }
    }
}
var EventUtil = {
    addHandler: function(element, type, handler) {
        if (element.addEventListener) {
            element.addEventListener(type, handler, false);
        } else if (element.attachEvent) {
            element.attachEvent("on" + type, handler);
        } else {
            element["on" + type] = handler;
        }
    },
    addMousewheel: function(element, handler) {
        this.addHandler(element, "mousewheel", handler);
        this.addHandler(element, "DOMMouseScroll", handler);
    },
    getButton: function(event) {
        if (document.implementation.hasFeature("MouseEvents", "2.0")) {
            return event.button;
        } else {
            switch (event.button) {
                case 0:
                case 1:
                case 3:
                case 5:
                case 7:
                    return 0;
                case 2:
                case 6:
                    return 2;
                case 4:
                    return 1;
            }
        }
    },
    getCharCode: function(event) {
        if (typeof event.charCode == "number") {
            return event.charCode;
        } else {
            return event.keyCode;
        }
    },
    getClipboardText: function(event) {
        var clipboardData = (event.clipboardData || window.clipboardData);
        return clipboardData.getData("text");
    },
    getEvent: function(event) {
        return event ? event : window.event;
    },
    getRelatedTarget: function(event) {
        if (event.relatedTarget) {
            return event.relatedTarget;
        } else if (event.toElement) {
            return event.toElement;
        } else if (event.fromElement) {
            return event.fromElement;
        } else {
            return null;
        }

    },
    getTarget: function(event) {
        return event.target || event.srcElement;
    },
    getWheelDelta: function(event) {
        if (event.wheelDelta) {
            return (event.wheelDelta);
        } else {
            return -event.detail * 40;
        }
    },
    preventDefault: function(event) {
        if (event.preventDefault) {
            event.preventDefault();
        } else {
            event.returnValue = false;
        }
    },
    removeHandler: function(element, type, handler) {
        if (element.removeEventListener) {
            element.removeEventListener(type, handler, false);
        } else if (element.detachEvent) {
            element.detachEvent("on" + type, handler);
        } else {
            element["on" + type] = null;
        }
    },
    setClipboardText: function(event, value) {
        if (event.clipboardData) {
            event.clipboardData.setData("text/plain", value);
        } else if (window.clipboardData) {
            window.clipboardData.setData("text", value);
        }
    },
    stopPropagation: function(event) {
        if (event.stopPropagation) {
            event.stopPropagation();
        } else {
            event.cancelBubble = true;
        }
    },
    delegate:function(receiver, typeEvent, sender, func) {
        EventUtil.addHandler(receiver, typeEvent, function(event) {
            event = EventUtil.getEvent(event);
            var target = EventUtil.getTarget(event);
            if (target == receiver) {
                return null;
            }
            var current = target;
            var yes = false;
            do {
                if (judge(target)) {
                    yes = true;
                    var sendElem = target;
                    break;
                } {
                    var parent = target.parentNode;
                    target = parent;
                }
            } while (parent != receiver);
            if (yes) {
                func(receiver, sendElem, current, event);
            }
        });

        function judge(elem) {
            var yes = true;
            for (var i in sender) {
                if (elem[i] != sender[i]) {
                    yes = false;
                }
            }
            return yes;
        }
    }
};
