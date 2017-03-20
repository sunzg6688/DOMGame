/**
 * Created by samsung on 2017/1/9.
 */
function AudioPlayer(src,volume,complete){
    var self=this;
    this.canPlay=false;
    this.src=src;
    this.audio=new Audio();
    this.audio.volume=volume;
    this.audio.type="audio/mpeg";

    this.audio.oncanplaythrough=function(){
        self.canPlay=true;
        complete();
    }
    this.audio.src=src;
    this.audio.load();
    this.play=function(){
        this.audio.play();
    }
    this.pause=function(){
        this.audio.pause();
    }

    this.__defineGetter__("volume",function(){
        return this.audio.volume;
    });
    this.__defineSetter__("volume",function(value){
        this.audio.volume=value;
    });
    this.__defineGetter__("currentTime",function(){
        return this.audio.currentTime;
    });
    this.__defineSetter__("currentTime",function(value){
        this.audio.currentTime=value;
    });
    this.__defineGetter__("muted",function(){
        return this.audio.muted;
    });
    this.__defineSetter__("muted",function(value){
        this.audio.muted=value;
    })
}

function VideoPlayer(videoParams,loadStep,complete){

    this.videoId=videoParams.videoId;
    this.loadId=videoParams.loadId;
    this.time=videoParams.time;

    this.fps=(videoParams.end-videoParams.start)/videoParams.time;

    this.startTime;
    this.playTime=0;

    this.currentIndex=0;
    this.timerId;

    this.srcArr=[];
    this.imgArr=[];
    this.canPlay=false;
    this.playCompleteCallBack;
    this.state="";


    var self=this;

    this.play=function(){
        if(this.canPlay){
            if(this.state!="playing"){
                this.playVideo();
            }
        }
    }

    this.playVideo=function(){
        if(this.playTime==0){
            this.playTime=0;
            this.currentIndex=0;
            this.startTime=new Date().getTime();
        }
        this.timerId=setInterval(this.playImage,1000/this.fps);
        this.state="playing";
    }

    this.playImage=function(){
        if(self.currentIndex>=self.srcArr.length){
            clearInterval(self.timerId);

            self.playTime=0;
            self.currentIndex=0;
            self.startTime=null;

            self.state="playComplete";
            if(self.playCompleteCallBack){
                self.playCompleteCallBack();
            }
        }else{
            eid(self.videoId).src=self.srcArr[self.currentIndex];
            self.currentIndex++;
            self.playTime=new Date().getTime()-self.startTime;
        }
    }

    this.__defineGetter__("currentTime",function(){
        return this.playTime/1000;
    });
    this.__defineSetter__("currentTime",function(value){
        if(value>=this.time||value<0){
            this.playTime=0;
        }else{
            this.playTime=value;
        }
        this.currentIndex=Math.floor(this.playTime*1000/(1000/this.fps));
        if(!this.startTime){
            this.startTime=new Date().getTime()-this.playTime;
        }
        if(this.timerId){
            clearInterval(this.timerId);
        }
        if(this.state=="playing"){
            this.timerId=setInterval(this.playImage,1000/this.fps);
        }
    });

    this.stopTime=function(value){
        if(value>=this.time||value<0){
            this.playTime=0;
        }else{
            this.playTime=value;
        }
        this.currentIndex=Math.floor(this.playTime*1000/(1000/this.fps));
        if(!this.startTime){
            this.startTime=new Date().getTime()-this.playTime;
        }
        if(this.timerId){
            clearInterval(this.timerId);
        }
        eid(self.videoId).src=self.srcArr[self.currentIndex];
    }

    this.downLoadPercent=function(num){
        if(loadStep)loadStep(self.videoId);
    }

    this.downComplete=function(){
        self.canPlay=true;
        complete();
    }

    loadImages(videoParams.srcFormat,videoParams.start,videoParams.end,videoParams.src,this.srcArr,this.imgArr,this.downLoadPercent,this.downComplete);
}

if (!window.eid) {
    window.eid = function (id) {
        return document.getElementById(id);
    }
}

function loadImages(srcFormat,start,end,src,srcArr,imgArr,step,complete){
    var total=end-start+1;
    var finishNum=0;
    var loadArr=[];
    var errorArr=[];
    for(var i=start;i<=end;i++){
        var iString;
        if(srcFormat==1){
            if(i<10){
                iString="0"+i;
            }else{
                iString=i;
            }
        }else{
            if(i<10){
                iString="00"+i;
            }else if(i<100){
                iString="0"+i;
            }else{
                iString=i;
            }
            //iString="120";
        }

        var imageSrc;
        if(webpSupport){
            imageSrc=src+iString+".webp?random="+Math.random();
        }else{
            //imageSrc=src+iString+".jpg?random="+Math.random();
            imageSrc=src+iString+".jpg";
        }
        srcArr.push(imageSrc);
        loadArr.push(imageSrc);
    }

    function loadImageBySrc(imageSrc){
        var image=new Image();
        image.src=imageSrc;
        image.onload=function(event){
            imgArr.push(image);
            finishNum++;
            var percentNum=Math.floor(finishNum/total*100);
            step(percentNum);
            if(finishNum==total){
                complete();
            }
            event.target.onload=null;
            event.target.onerror=null;
            loadImage();
        }
        image.onerror=function(event){
            event.target.onload=null;
            event.target.onerror=null;
            errorArr.push(event.target.src);
            loadImage();
        }
    }

    function loadImage(){
        if(loadArr.length){
            var imageSrc=loadArr.shift();
            loadImageBySrc(imageSrc);
        }else{
            loadErrorArr();
        }
    }

    function loadErrorArr(){
        if(errorArr.length){
            var errorSrc=errorArr.shift();
            var reloadSrc=errorSrc+"?random="+Math.random();
            loadImageBySrc(reloadSrc);
        }
    }

    loadImage();
}