/**
 * Created by samsung on 2017/2/8.
 */




function resizeHandler1() {
    document.getElementById("loadPercent").innerHTML="onresize";
    alert(1)
}
var resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize'
window.addEventListener(resizeEvt, resizeHandler1, false);

