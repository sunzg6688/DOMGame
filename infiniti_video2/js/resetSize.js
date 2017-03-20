/**
 * Created by samsung on 2017/2/8.
 */
var currentPlayer = "loading";
var webpSupport = false;
//(function () {
//    var t = new Image;
//    t.onload = function () {
//        webpSupport = true;
//    }
//    t.onerror = function () {
//        webpSupport = false;
//    }
//    t.src = "data:image/webp;base64,UklGRjAAAABXRUJQVlA4ICQAAACyAgCdASoBAAEALy2Wy2WlpaWlpYEsSygABc6zbAAA/upgAAA=";
//})();

//(function () {
//    var t = new Image;
//    var webpSupport2;
//    t.onload = function () {
//        webpSupport2 = true;
//        alert(webpSupport2);
//    }
//    t.onerror = function () {
//        webpSupport2 = false;
//        alert(webpSupport2);
//    }
//    t.src = "data:image/webp;base64,UklGRjAAAABXRUJQVlA4ICQAAACyAgCdASoBAAEALy2Wy2WlpaWlpYEsSygABc6zbAAA/upgAAA=";
//})();

function initVideoContent() {
    var w = document.documentElement.clientWidth;
    var h = document.documentElement.clientHeight;

    if (w < h) {

        var widthValue = h + "px";
        var heightValue = w + "px";

        var videoHeight=w;
        var videoWidth=(w/422)*750;
        var videoLeft=-(videoWidth-h)/2;

        var videoScaleSize={height:videoHeight+"px",width:videoWidth+"px",left:videoLeft+"px",top:"0px"};
        setElementStyles("video1",videoScaleSize);
        setElementStyles("video2",videoScaleSize);

        var videoWidth=h;
        var videoHeight=534/856*h;
        var videoTop=-(videoHeight-w)/2;
        var videoScaleSize2={height:videoHeight+"px",width:videoWidth+"px",left:"0px",top:videoTop+"px"};
        setElementStyles("yindaogif1",videoScaleSize2);
        setElementStyles("yindaogif2",videoScaleSize2);
        setElementStyles("infogif",videoScaleSize2);

        var transformValue = "rotate(90deg)";
        var transformValue2 = "rotate(-90deg)";
        var transformOriginValue = w / 2 + "px " + w / 2 + "px";
        var styles = {
            width: widthValue,
            height: heightValue,
            transform: transformValue,
            transformOrigin: transformOriginValue
        };
        var styles2 = {
            width: widthValue,
            height: heightValue,
            transform: transformValue2,
            transformOrigin: transformOriginValue
        };
        setElementStyles("video1Content", styles);
        setElementStyles("video2Content", styles2);
        setElementStyles("loadContent", styles);
        setElementStyles("yindao1", styles);
        setElementStyles("yindao2", styles2);

        var loadImgWidth = w * 0.6 + "px";
        var loadImgHeight = w * 0.6 + "px";
        var loadImgLeft = (h - w * 0.6) / 2 + "px";
        var loadImgTop = "30px";
        var styles3 = {width: loadImgWidth, height: loadImgHeight, left: loadImgLeft, top: loadImgTop};
        setElementStyles("loadImg", styles3);

        eid("loadSpan").style.top = (w * 0.6) + "px";
        eid("loadPercent").style.top = (w - 30) + "px";

        eid("yindaoDiv").style.top=(w-186)/2+"px";
        eid("yindaoDiv2").style.top=(w-214)/2+"px";
    } else {

        var widthValue = w + "px";
        var heightValue = h + "px";

        var videoHeight=h;
        var videoWidth=(h/422)*750;
        var videoLeft=-(videoWidth-w)/2;

        var videoScaleSize={height:videoHeight+"px",width:videoWidth+"px",left:videoLeft+"px",top:"0px"};
        //setElementStyles("video1",videoScaleSize);
        //setElementStyles("video2",videoScaleSize);

        var videoWidth=w;
        var videoHeight=534/856*w;
        var videoTop=-(videoHeight-h)/2;
        var videoScaleSize2={height:videoHeight+"px",width:videoWidth+"px",left:"0px",top:videoTop+"px"};
        setElementStyles("yindaogif1",videoScaleSize2);
        setElementStyles("yindaogif2",videoScaleSize2);
        setElementStyles("infogif",videoScaleSize2);


        setElementStyles("video1",videoScaleSize2);
        setElementStyles("video2",videoScaleSize2);


        var transformValue = "rotate(0deg)";
        var transformOriginValue = "0px 0px";
        var styles = {
            width: widthValue,
            height: heightValue,
            transform: transformValue,
            transformOrigin: transformOriginValue
        };
        setElementStyles("video1Content", styles);
        setElementStyles("video2Content", styles);
        setElementStyles("loadContent", styles);
        setElementStyles("yindao1", styles);
        setElementStyles("yindao2", styles);

        var loadImgWidth = h * 0.6 + "px";
        var loadImgHeight = h * 0.6 + "px";
        var loadImgLeft = (w - h * 0.6) / 2 + "px";
        var loadImgTop = "30px";
        var styles3 = {width: loadImgWidth, height: loadImgHeight, left: loadImgLeft, top: loadImgTop};
        setElementStyles("loadImg", styles3);

        eid("loadSpan").style.top = (h * 0.6) + "px";
        eid("loadPercent").style.top = (h - 30) + "px";
        eid("yindaoDiv").style.top=(h-186)/2+"px";
        eid("yindaoDiv2").style.top=(h-214)/2+"px";
    }
    resizeInfoContent();
}

var videoSize={height:422,width:750};

function resizeInfoContent(){
    var w = document.documentElement.clientWidth;
    var h = document.documentElement.clientHeight;
    if (w < h) {
        var widthValue = h + "px";
        var heightValue = w + "px";

        var transformValue = "rotate(90deg)";
        var transformValue2 = "rotate(-90deg)";
        var transformOriginValue = w / 2 + "px " + w / 2 + "px";
        var styles = {
            width: widthValue,
            height: heightValue,
            top:"0px",
            bottom:"",
            transform: transformValue,
            transformOrigin: transformOriginValue
        };
        var styles2 = {
            width: widthValue,
            height: heightValue,
            top:"",
            bottom:"0px",
            transform: transformValue2,
            transformOrigin: transformOriginValue
        }
        if(currentPlayer==1){
            setElementStyles("infoContent",styles);
        }else if(currentPlayer==2){
            setElementStyles("infoContent",styles2);
        }else{
            setElementStyles("infoContent",styles);
        }
    }else{
        var widthValue = w + "px";
        var heightValue = h + "px";

        var transformValue = "rotate(0deg)";
        var transformOriginValue = "0px 0px";
        var styles = {
            width: widthValue,
            height: heightValue,
            top:"0px",
            bottom:" ",
            transform: transformValue,
            transformOrigin: transformOriginValue
        };
        setElementStyles("infoContent",styles);
    }
}

function setElementStyles(id, styles) {
    var element = eid(id);
    for (var key in styles) {
        if (key == "transform") {
            element.style.webkitTransform = styles[key];
            element.style.MozTransform = styles[key];
            element.style.msTransform = styles[key];
            element.style.OTransform = styles[key];
            element.style.transform = styles[key];
        } else if (key == "transformOrigin") {
            element.style.webkitTransformOrigin = styles[key];
            element.style.MozTransformOrigin = styles[key];
            element.style.msTransformOrigin = styles[key];
            element.style.OTransformOrigin = styles[key];
            element.style.transformOrigin = styles[key];
        } else if (key == "width") {
            element.style.width = styles[key];
        } else if (key == "height") {
            element.style.height = styles[key];
        } else if (key == "left") {
            element.style.left = styles[key];
        } else if (key == "top") {
            element.style.top = styles[key];
        }else if(key=="bottom"){
            element.style.bottom=styles[key];
        }
    }
}

function resizeHandler1() {
    initVideoContent();
    if(resizeTimer){
        clearInterval(resizeTimer);
    }
}
initVideoContent();
eid("loadContent").style.display="block";

var resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize'
window.addEventListener(resizeEvt, resizeHandler1, false);

var resizeTimer=setInterval(function(){
    initVideoContent();
},50);

function createSprite() {
    var sprites = document.getElementsByClassName("sprite");
    for (var i = 0; i < sprites.length; i++) {
        var sprite = new Sprite(sprites[i]);
        sprite.start();
    }
}

createSprite();

var loadTxt1;
var loadTxt2;
var loadTxt3;
var suoTip;
var txt1_1;
var txt1_2;
var txt1_3;
var icon_txt;
var txt3;
var icon2;
var icon3;
var loadingPlayComplete=false;
function createAnimateTxt(){
    loadTxt1=new Sprite(document.getElementById("loadTxt1"));
    loadTxt2=new Sprite(document.getElementById("loadTxt2"));
    loadTxt3=new Sprite(document.getElementById("loadTxt3"));
    suoTip=new Sprite(document.getElementById("suoTip"));
    txt1_1=new Sprite(document.getElementById("txt1_1"));
    txt1_2=new Sprite(document.getElementById("txt1_2"));
    txt1_3=new Sprite(document.getElementById("txt1_3"));
    icon_txt=new Sprite(document.getElementById("icon_txt"));
    txt3=new Sprite(document.getElementById("txt3"));
    icon2=new Sprite(document.getElementById("icon2"));
    icon3=new Sprite(document.getElementById("icon3"));
    loadTxt1.start();
    setTimeout(function(){
        loadTxt2.start();
    },2500);
    setTimeout(function(){
        loadTxt3.start();
    },5000);
    setTimeout(function(){
        suoTip.start();
    },7500);
    setTimeout(function(){
        loadingPlayComplete=true;
        if (videoPlayer1&&videoPlayer1.canPlay && videoPlayer2&&videoPlayer2.canPlay) {
            videoPlayer1.playCompleteCallBack = videoPlayComplete;
            videoPlayer2.playCompleteCallBack = videoPlayComplete;
            eid("yindao1").style.display = "block";
            eid("loadContent").style.display="none";
            animateYindao1();
        }
    },10000);
}

createAnimateTxt();

animate();
function animate(time) {
    var time = new Date().getTime();
    requestAnimationFrame(animate);
    TWEEN.update(time);
}
