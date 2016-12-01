/**
 * Created by samsung on 2016/11/29.
 */
(function(){
    var psd_size={width:1080,height:3300};
    var stage_scale= calculateScale(psd_size.width);
    var screen=getScreenSize();

    loadRes();
    function loadRes(){
        var imgArr=document.getElementsByTagName("img");
        var loadArr=[];
        for(var i=0;i<imgArr.length;i++){
            var img={id:imgArr[i].getAttribute("id"),src:imgArr[i].getAttribute("data-src")};
            loadArr.push(img);
        }
        loadImages(loadArr,loadResFinish);
    }

    function loadResFinish(){
        var road_container=new DOMObject(eid("road_container"),[{height:psd_size.height*stage_scale}]);
        road_container.ele.style.height=road_container.height+"px";

        createSprite();
        //return;

        var road_container=new DOMObject(eid("road_container"),[{height:0}]);
        var tween=new TWEEN.Tween(road_container);
        tween.to({height:psd_size.height*stage_scale},3500).onUpdate(update).onComplete(complete);
        tween.start();
        function update(){
            road_container.ele.style.height=road_container.height+"px";
            if(road_container.height>screen.height){
                window.scrollTo(0,road_container.height-screen.height);
            }
        };
        function complete(){
            setTimeout(function(){
                var positon={y:road_container.height-screen.height};
                var tween2=new TWEEN.Tween(positon);
                tween2.to({y:0},1000).onUpdate(function(){
                    window.scrollTo(0,positon.y);
                });
                tween2.start();
            },2000);
        }
    }

    function createSprite(){
        var sprites=document.getElementsByClassName("sprite");
        for(var i=0;i<sprites.length;i++){
//            var sprite=new Sprite(eid(sprites[i].getAttribute("id")));
            var sprite=new Sprite(sprites[i]);
            sprite.start();
        }
    }

    //浏览器原生每秒60帧运行
//    animate();
//    function animate( time ) {
//        var time =new Date().getTime();
//        requestAnimationFrame( animate );
//        TWEEN.update( time );
//    }

    //每秒30帧运行
    function startGame(){
        setInterval(function(){
            var time=new Date().getTime();
            TWEEN.update(time);
        },33);
    }

    startGame();

})();