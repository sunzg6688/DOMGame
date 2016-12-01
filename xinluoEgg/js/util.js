/**
 * Created by samsung on 2016/11/29.
 */
(function () {
    //解决IE8之类的老式浏览器，Array不支持indexOf
    if (!Array.prototype.indexOf) {
        Array.prototype.indexOf = function (elt, from) {
            var len = this.length >>> 0;
            var from = Number(arguments[1]) || 0;
            from = (from < 0) ? Math.ceil(from) : Math.floor(from);
            if (from < 0) {
                from += len;
            }
            for (; from < len; from++) {
                if (from in this && this[from] === elt) {
                    return from;
                }
            }
            return -1;
        };
    }

    //解决IE8之类的老式浏览器，不支持getElementsByClassName
    if (!document.getElementsByClassName) {
        document.getElementsByClassName = function (className, element) {
            var children = (element || document).getElementsByTagName('*');
            var elements = new Array();
            for (var i = 0; i < children.length; i++) {
                var child = children[i];
                var classNames = child.className.split(' ');
                for (var j = 0; j < classNames.length; j++) {
                    if (classNames[j] == className) {
                        elements.push(child);
                        break;
                    }
                }
            }
            return elements;
        };
    }

    //根据id获取dom元素
    if (!window.eid) {
        window.eid = function (id) {
            return document.getElementById(id);
        }
    }
})();

//获取屏幕的尺寸大小
function getScreenSize(){
    var width;
    var height;
    if (document.body && document.body.clientWidth) {
        width = document.body.clientWidth;
        height= document.body.clientHeight;
    } else {
        width = document.documentElement.clientWidth;
        height=document.documentElement.clientHeight;
    }
    width = document.documentElement.clientWidth;
    height=document.documentElement.clientHeight;
   return {width:width,height:height};
}

//根据psd的设计的尺寸和屏幕实际的大小计算缩放比例
function calculateScale(psd_width) {
    var stage_width;
    if (document.body && document.body.clientWidth) {
        stage_width = document.body.clientWidth;
    } else {
        stage_width = document.documentElement.clientWidth;
    }
    stage_width = document.documentElement.clientWidth;
    var scale=stage_width/psd_width;
    return scale;
}

//加载图片并根据id赋值
function loadImages(arr,call){
    var total=arr.length;
    var finishNum=0;
    while(arr.length){
        var image=arr.shift();
        var img=new Image();
        img.src=image.src;
        img.uid=image.id;
        img.onload=function(event){
            var domId=event.target.uid;
            eid(domId).src=event.target.src;
            finishNum++;
            if(finishNum==total&&call){
                setTimeout(call,50);
            }
        }
    }
}
