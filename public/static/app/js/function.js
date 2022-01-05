
var tips = {
    //通用对话框
    alert: function(msg, act) {
        if (frameElement == null || frameElement.api == undefined) {
            this.alert1(msg, act);
        } else {
            var api = frameElement.api,
                W = api.opener;
            W.$.dialog.alert(msg, function() {
                setTimeout(function() {
                    if (typeof act == 'function') {
                        act();
                    } else {
                        eval(act);
                    }
                }, 1);
            });
        }
    },
    alert1: function(msg, act) {
        $.dialog.alert(msg, function() {
            if (typeof act == 'function') {
                act();
            } else {
                eval(act);
            }
        });
    },
    alertByTime: function(src, msg, t) {
        if (src == 1) {
            src = "success.gif";
        } else {
            src = "error.gif";
        }
        if (t == ''){ t = 2; }
        $.dialog.tips(msg, t, src, function() {});

    },
    confirm: function(msg, fun1, fun2) {
        if (frameElement == null || frameElement.api == undefined) {
            this.confirm1(msg, fun1, fun2);
        } else {
            var api = frameElement.api,
                W = api.opener;
            W.$.dialog.confirm(msg, function() {
                setTimeout(function() {
                    eval(fun1);
                }, 1);
            }, function() {
                setTimeout(function() {
                    eval(fun2);
                }, 1);
            });
        }
    },
    confirm1: function(msg, fun1, fun2) {
        $.dialog.confirm(msg, function() {
            if (typeof fun1 == 'function') {
                fun1();
            } else {
                eval(fun1);
            }
        }, function() {
            if (typeof fun2 == 'function') {
                fun2();
            } else {
                eval(fun2);
            }
        });
    },
    message: function(ico, msg, fun) {
        if (frameElement == null || frameElement.api == undefined) {
            this.message1(ico, msg, fun);
        } else {
            var api = frameElement.api,
                W = api.opener;
            W.$.dialog.tips(msg, 2, ico, function() {
                setTimeout(function() {
                    eval(fun);
                }, 1);
            });

        }
    },
    message1: function(ico, msg, fun) {
        $.dialog.tips(msg, 2);
        setTimeout(function() {
            eval(fun);
        }, 2000);
    },
    tips: function(title, msg, w, h) {
        $.dialog({
            title: title,
            content: msg,
            width: w,
            height: h,
            max: false,
            min: false
        });
    }
};

// 常用工具方法
var tools = {
    setData: function (key , value) {
        if (typeof value == 'object') {
            value = JSON.stringify( value );
        }
        return localStorage.setItem(key,value);
    },
    getData: function (key) {
        var value  =  localStorage.getItem(key);
        if (tools.isJson(value)) {
            value = JSON.parse(value);
        }
        return value;
    },
    clearAllsData: function () {
        localStorage.clear();
    },
    clearField: function (key) {
        localStorage.removeItem(key);
    },
    isJson: function (str) {
        if (typeof str == 'string') {
            try {
                var obj=JSON.parse(str);
                if(str.indexOf('{')>-1){
                    return true;
                }else{
                    return false;
                }

            } catch(e) {
                // console.log(e);
                return false;
            }
        }
        return false;
    },
    /**
     * 实例表单验证插件
     * @param options
     * @param messagetype
     * @returns {*}
     */
    databind: function (options) {
        if (!options) options = {};
        var def = {
            errorHandle:function (message , thisEle , tipsEle) {
                tips.alert(message);
            }
        };
        options = $.extend(def , options);
        return $.databind(options);
    },
    ajaxRequest: function (defaults) {
        var options = new Object();

        options.type  = defaults.type;
        options.url   = defaults.url;
        options.async = defaults.async;
        options.data =  $.extend({} , defaults.data);
        if (!defaults.error) {
            defaults.error = function (result) {
                if (result) {
                    tips.alert1(result.msg);
                } else {
                    tips.alert1("网络错误，请刷新页面重试!");
                }
            }
        }
        options.error = defaults.error;
        options.success = function (result) {
            if (result.status != 0) {
                defaults.error && defaults.error(result);
                return;
            }
            defaults.success && defaults.success(result);
        };
        $.ajax(options);
    },
    /**
     * 上传文件请求
     * @param {Object} options  参数对象
     * options.files 	  上传文件框元素
     * options.filesdata  上传文件数据
     * options.ufield     上传字段名称
     * options.url		  提交网址
     * options.success    成功回调
     * options.error 	  失败回调
     */
    ajaxUploadFile: function (options) {
        var thisData = new FormData();
        var ufield   = options.hasOwnProperty('ufield') ? options.ufield : 'image';
        if(options.files) {
            var files = $(options.files).prop('files');
            thisData.append(ufield, files[0]);
        }
        if(options.filesdata) {
            thisData.append(ufield, options.filesdata);
        }
        //携带数据
        if (options.hasOwnProperty('data') && (options.data).constructor == Object) {
            for (e in options.data){
                thisData.append(e , options.data[e]);
            }
        }
        //异步
        var async = options.hasOwnProperty('async') ? options.async : true;
        var defoptions = {
            url:options.url,
            type:'POST',
            data:thisData,
            processData:false,
            contentType:false,
            async:async
        };
        if (options.hasOwnProperty('success')) {
            defoptions.success = options.success;
        }
        if (options.hasOwnProperty('error')) {
            defoptions.error = options.error;
        }
        //run
        $.ajax(defoptions);
    },
    /**
     * 搜索某个值是否存在数组之内
     * @param needle 搜索的值
     * @param haystack 被搜索的数组
     * */
    in_array: function (needle, haystack) {
        var length = haystack.length;
        for(var i = 0; i < length; i++) {
            if(haystack[i] == needle) return true;
        }
        return false;
    }
};


/**
 * @type {{encode: base64.encode, decode: base64.decode}}
 */
var base64 = {
    encode:function (str) {
        try {
            return str ? window.btoa(window.encodeURIComponent(str)) : null;
        } catch (e) {
            return null;
        }
    },
    decode:function (str) {
        try {
            return str ? window.decodeURIComponent(window.atob(str)) : null;
        } catch (e) {
            return null;
        }
    }
}

var json = {
    filter:function (json) {
        return json ? json.replace(/\n/g,"\\n").replace(/\r/g,"\\r").replace(/\t/g , "\\t") : '';
    }
};


/**
 * 获取地址栏参数
 * @param par
 * @returns {*}
 */
function getPar(par){
    //获取当前URL
    var local_url = document.location.href;
    //获取要取得的get参数位置
    var get = local_url.indexOf(par +"=");
    if(get == -1){
        return false;
    }
    //截取字符串
    var get_par = local_url.slice(par.length + get + 1);
    //判断截取后的字符串是否还有其他get参数
    var nextPar = get_par.indexOf("&");
    if(nextPar != -1){
        get_par = get_par.slice(0, nextPar);
    }

    return get_par;
}

function isMobile() {
    if ((navigator.userAgent.match(/(iPhone|iPod|Android|ios|iOS|iPad|Backerry|WebOS|Symbian|Windows Phone|Phone)/i))) {
        return true;
    }else{
        return false;
    }
}

/**
 * @param options
 * @param compatible
 * @constructor
 */
function LayerIFrameBox(options , compatible){
    if (compatible === undefined) compatible = true;
    if (compatible && isMobile()) {
        window.open(options.content);
        return;
    }
    var defaults = {
        type: 2,
        title: '',
        shadeClose: true,
        shade: 0.8,
        area: ['380px', '90%'],
        maxmin:true
    };
    var splis = $.extend(defaults , options);
    layer.open(splis);
}

/**
 * 实例化Jedate日期插件，文档地址 http://www.jemui.com/uidoc/jedate.html#core
 * @param ele
 * @param options
 */
function loadJedate(ele , options) {
    if (options === undefined) options = {};
    let defs = {
        skinCell:"jedateblue",             //日期风格样式，默认蓝色
        format:"YYYY-MM-DD hh:mm:ss",      //日期格式
        minDate:"1900-01-01 00:00:00",     //最小日期 或者 "1900-01-01" 或者 "10:30:25"
        maxDate:"2099-12-31 23:59:59",     //最大日期 或者 "2099-12-31" 或者 "16:35:25"
        onClose:true,                      //是否为选中日期后关闭弹层，为false时选中日期后关闭弹层
        isTime:true,                       //是否开启时间选择
        isClear:true,                      //是否显示清空
        fixed:true,                        //是否静止定位，为true时定位在输入框，为false时居中定位
        zIndex:29891018,                   //弹出层的层级高度
    }
    options = $.extend(defs , options);
    jeDate(ele , options)
}

/**
 * 删除数组中指定的值
 * @param arr
 * @param val
 */
function removeArrayValue(arr, val) {
    for(var i=0; i<arr.length; i++) {
        if(arr[i] == val) {
            arr.splice(i, 1);
            break;
        }
    }
    return arr;
}

/**
 * @param date
 * @param format
 * @returns {*}
 */
function dateFormatToString (date , format) {
    if (!format) {
        return '';
    }
    if (!(date instanceof Date)) {
        return '';
    }
    let full = function (text) {
        return ('00' + String(text)).substr(-2)
    }

    format = format.replace('%Y' , date.getFullYear())
    format = format.replace('%m' , full( date.getMonth() + 1 ))
    format = format.replace('%d' , full(date.getDate()))
    format = format.replace('%H' , full(date.getHours()))
    format = format.replace('%i' , full(date.getMinutes()))
    format = format.replace('%s' , full(date.getSeconds()))
    return format;
}

//日期格式化
Date.prototype.format = function(fmt) {
    var o = {
        "M+" : this.getMonth()+1,                 //月份
        "d+" : this.getDate(),                    //日
        "h+" : this.getHours(),                   //小时
        "m+" : this.getMinutes(),                 //分
        "s+" : this.getSeconds(),                 //秒
        "q+" : Math.floor((this.getMonth()+3)/3), //季度
        "S"  : this.getMilliseconds()             //毫秒
    };
    if(/(y+)/.test(fmt)) {
        fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
    }
    for(var k in o) {
        if(new RegExp("("+ k +")").test(fmt)){
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
        }
    }
    return fmt;
}