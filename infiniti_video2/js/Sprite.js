/**
 * Created by samsung on 2016/11/29.
 */
function Sprite(element){

    this.element=element;

    this.tweensString=this.element.getAttribute("tweens");

    var self=this;

    //this.state="stop";

    if(this.tweensString){
        this.tweens=eval(this.tweensString);
        for(var i=0;i<this.tweens.length;i++){
            this.tweens[i].current=this.tweens[i].from;
            this.tweens[i].ele=this.element;
        }
    };

    this.start=function(){
        //if(this.state=="start")return;
        //this.state="start";
        if(this.tweens){
            for(var i=0;i<this.tweens.length;i++){
                var obj=this.tweens[i];
                this.startTween(obj);
            }
        }
    };

    this.removeTween=function(){
        //this.state="stop";
        for(var i=0;i<this.tweens.length;i++){
            var obj=this.tweens[i];
            if(obj.tween){
                TWEEN.remove(obj.tween);
            }
            if(obj.tweenBack){
                TWEEN.remove(obj.tweenBack);
            }
        }
    }

    this.startTween=function(tween){
        var obj=tween;
        if(obj.delay){
            setTimeout(delayStart,obj.delay)
        }else{
            delayStart();
        }
        function delayStart(){
            var tween=new TWEEN.Tween(obj);
            tween.to({current:obj.to},obj.time).onUpdate(updateAttribute);
            obj.tween=tween;
            if(obj.loopType){
                var tweenBack=new TWEEN.Tween(obj);
                tweenBack.to({current:obj.from},obj.time).onUpdate(updateAttribute);
                obj.tweenBack=tweenBack;
                tween.chain(tweenBack);
                tweenBack.chain(tween);
                tween.start();
            }else{
                tween.start();
                if(obj.repeat){
                    tween.repeat(Infinity);
                }
            }
            function updateAttribute(){
                obj.ele.style.display="block";
                if(obj.type=="rotate"){
                    obj.ele.style.webkitTransform = 'rotate(' + Math.floor(obj.current) + 'deg)';
                    obj.ele.style.MozTransform = 'rotate(' + Math.floor(obj.current) + 'deg)';
                }else if(obj.type=="scale"){
                    obj.ele.style.webkitTransform = 'scale('+ obj.current+','+obj.current+')';
                    obj.ele.style.MozTransform = 'scale('+ obj.current+','+obj.current+')';
                }else if(obj.type=="opacity"){
                    obj.ele.style.opacity=obj.current;
                }else if(obj.type=="moveLeft"){
                    obj.ele.style.left=obj.current+"%";
                }else if(obj.type="moveTop"){
                    obj.ele.style.top=obj.current+"%";
                }
            }
        }
    }
}