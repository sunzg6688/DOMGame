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
    this.element=eid(this.videoId);
    this.time=videoParams.time;
    this.canPlayPercent=videoParams.canPlayPercent;

    this.fps=(videoParams.end-videoParams.start)/videoParams.time;

    this.startTime;
    this.playTime=0;

    this.currentIndex=0;
    this.timerId;

    this.srcArr=[];
    this.imgArr=[];
    this.loadImgArr=[];
    this.canPlay=false;
    this.playCompleteCallBack;
    this.canPlayCallBack;
    this.loadPercentNum;
    this.canPlayCallBackTime=0;
    this.loadIndex=0;
    this.state="";
    this.stopTimeByLoading=0;
    this.stopByLoadingCallBack;
    this.playByLoadingCallBack;

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
            if(self.currentIndex>self.loadIndex){
                clearInterval(self.timerId);
                self.state="stopByloading";
                self.stopTimeByLoading=(new Date().getTime()-self.startTime)/1000;
                console.log("self.stopTimeByLoading::",self.stopTimeByLoading);
                self.stopByLoadingCallBack(self.stopTimeByLoading);
            }else{
                self.playTime=new Date().getTime()-self.startTime;
                self.element.src=self.srcArr[self.currentIndex];
                self.currentIndex++;
            }
        }
    }

    this.__defineGetter__("currentTime",function(){
        return this.playTime;
    });
    this.__defineSetter__("currentTime",function(value){
        if(value>=this.time||value<0){
            this.playTime=0;
        }else{
            this.playTime=value;
        }
        this.currentIndex=Math.floor(this.playTime*1000/(1000/this.fps));
        this.element.src=this.srcArr[this.currentIndex];
        if(!this.startTime){
            this.startTime=new Date().getTime()-this.playTime*1000;
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
            this.startTime=new Date().getTime()-this.playTime*1000;
        }
        if(this.timerId){
            clearInterval(this.timerId);
        }
        self.element.src=self.srcArr[self.currentIndex];
    }

    this.stopAudioTime=function(time){

    }

    this.playAudioTime=function(time){
        if(time<=0){
            time=0;
        }
        if(time>=this.time){
            time=this.time;
            videoPlayComplete();
            return;
        }
        this.playTime=time;
        this.currentIndex=Math.floor(this.playTime*1000/(1000/this.fps));
        if(this.currentIndex>=this.loadIndex){
            videosStop(time);
        }else{
            this.element.src=this.srcArr[this.currentIndex];
        }
    }

    this.downLoadPercent=function(num){
        self.loadIndex++;
        self.loadPercentNum=num;
        if(loadStep){
            loadStep(self.videoId);
        }
        if(num==self.canPlayPercent){
            self.canPlay=true;
            if(self.canPlayCallBack){
                self.canPlayCallBackTime++;
                if(self.canPlayCallBackTime==1){
                    self.canPlayCallBack();
                }
            }
        }
        if(self.state=="stopByloading"){
            if(self.loadPercentNum==100){
                console.log("loadPercentNum",self.videoId)
                self.playByLoadingCallBack();
            }
        }
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
    var index=0;
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


        //if(srcFormat==1){
        //    imageSrc=src+iString+".jpg?random="+Math.random();
        //}

        srcArr.push(imageSrc);
        //loadArr.push(imageSrc);
        //var loadImg={"index":index,"src":imageSrc};
        //loadArr.push(loadImg);
        loadArr.push(imageSrc);
        index++;
    }

    function loadImageBySrc(imageSrc){
        var image=new Image();
        image.src=imageSrc;
        image.onload=function(event){

            //srcArr[imageSrcObj.index]=event.target.src;

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

            var errorSrc=event.target.src;
            var indexRandom=errorSrc.indexOf("?random=");
            if(indexRandom==-1){
                errorSrc+="?random="+Math.random();
            }else{
                var newErrorSrc=errorSrc.substring(0,indexRandom);
                newErrorSrc+="?random="+Math.random();
                errorSrc=newErrorSrc;
            }
            loadArr.unshift(errorSrc);
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

    }

    loadImage();
    //loadImage();
    //6个加载进程全开的话，resize事件无法响应；
    //loadImage();
}

//加载3次失败
//if(errorSrc.indexOf("errorTime=")!=-1){
//    var errorTime=errorSrc.slice(-1);
//    if(errorTime==1){
//        var newErrorSrc=errorSrc.substring(0,errorSrc.length-1)+2;
//        loadArr.unshift(newErrorSrc);
//        loadImage();
//    }else if(errorTime==2){
//        var newErrorSrc=errorSrc.substring(0,errorSrc.length-1)+3;
//        loadArr.unshift(newErrorSrc);
//        loadImage();
//    }else if(errorTime==3){
//        //errorArr.push(event.target.src);
//        //loadImage();
//    }
//}else{
//    errorSrc+="?random="+Math.random()+"&errorTime=1";
//    loadArr.unshift(errorSrc);
//    loadImage();
//}