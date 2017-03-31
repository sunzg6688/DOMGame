/**
 * Created by samsung on 2017/3/28.
 */
function SearchUtilsAnimate() {

    this.nodeData = [];
    this.openList = [];
    this.closeList = [];
    this.startNode;
    this.targetNode;
    this.startTime;
    this.path;
    this.callback;
    var self=this;

    this.getPath = function (start, target, data,callback) {
        this.path=[];
        this.pathNode=null;
        this.callback=callback;
        if (!target.cross) {
            console.log("目标点无法到达==>目标点不是可穿越类型");
            return null;
        }
        this.startNode = start;
        this.targetNode = target;
        this.nodeData = data;
        this.startTime = new Date().getTime();
        this.resetNode(this.startNode, 0, null);
        this.pushNodeToOpenList(this.startNode);

        this.animateSearchPath();
    }

    this.pathNode;
    this.getPathNodes=function() {
        if (this.targetNode.parent) {
            this.pathNode = this.targetNode;
        } else {
            console.log("目标点无法到达==>无法搜索到有效路径,给出离目标点最近的点");
            this.pathNode = this.closeList[0];
            for (var i = 0; i < this.closeList.length; i++) {
                if (this.closeList[i].hValue < this.pathNode.hValue) {
                    this.pathNode = this.closeList[i];
                }
            }
        }

        this.nextPathNode();
    }

    this.getNodeParent=function(){
        if(this.pathNode.parent){
            this.path.unshift(this.pathNode);
            this.pathNode = this.pathNode.parent;
            this.pathNode.element.style.backgroundColor="green";
            this.nextPathNode();
        }else{
            this.path.unshift(this.startNode);

            var times=new Date().getTime() - this.startTime;
            if(this.targetNode.parent){
                this.times="普通寻路消耗的时间为:"+times;
            }else{
                this.times="普通寻路消耗的时间为:"+times+",没有找到有效路径，已给出最近路线";
            }
            console.log("普通寻路消耗的时间为:" + times);

            this.resetList();
            this.callback();
        }
    }

    this.nextPathNode=function(){
        setTimeout(function(){
            self.getNodeParent();
        },100);
    }

    this.resetList=function() {
        var node;
        while (this.openList.length) {
            node = this.openList.shift();
            node.parent = null;
            node.inOpenList = false;
            node.indexInOpenList = -1;
            node.inCloseList = false;
            node.indexInOpenList = -1;
            node.addValue = -1;
            node.fValue = -1;
            node.gValue = -1;
            node.hValue = -1;
        }
        while (this.closeList.length) {
            node = this.closeList.shift();
            node.parent = null;
            node.inOpenList=false;
            node.indexInOpenList=-1;
            node.inCloseList = false;
            node.indexInOpenList = -1;
            node.addValue = -1;
            node.fValue = -1;
            node.gValue = -1;
            node.hValue = -1;
        }
    }

    this.resetNode=function(node, gValue, parent) {
        node.parent = parent;
        node.gValue = gValue;
        node.hValue = Math.abs(this.targetNode.x - node.x) * 10 + Math.abs(this.targetNode.y - node.y) * 10;
        node.fValue = node.gValue + node.hValue;
    }

    //按照fValue大小插入,属于初级阶段，简单优化了下插入顺序。
    this.pushNodeToOpenList=function(node) {
        node.inOpenList = true;
        if (this.openList.length == 0) {
            this.openList.push(node);
        } else {
            var inserIndex = this.getInsertIndex(node);
            this.openList.splice(inserIndex, 0, node);
        }
    }

    this.resetOpenListByNode=function(node) {
        //先从原数组中删除，再按照fValue大小重新插入
        for(var i=0;i<this.openList.length;i++){
            if(node.x==this.openList[i].x&&node.y==this.openList[i].y){
                var index=i;
                this.openList.splice(index, 1);
                this.pushNodeToOpenList(node);
                return;
            }
        }
    }

    this.getInsertIndex=function(node) {
        for(var i=0;i<this.openList.length;i++){
            if(node.fValue<=this.openList[i].fValue){
                return i;
            }
        }
        return this.openList.length;
    }


    this.getAroundNodes=function(node) {
        var array = [];
        for (var y = node.y - 1; y <= node.y + 1; y++) {
            if (0 <= y && y < this.nodeData.length) {
                for (var x = node.x - 1; x <= node.x + 1; x++) {
                    if (0 <= x && x < this.nodeData[y].length) {
                        if (y == node.y && x == node.x) {

                        } else {
                            if (this.nodeData[y][x] && this.nodeData[y][x].cross && !this.nodeData[y][x].inCloseList) {
                                var aroundNode;
                                if (x == node.x || y == node.y) {
                                    this.nodeData[y][x].addValue = 10;
                                    aroundNode = this.nodeData[y][x];
                                    array.push(this.nodeData[y][x]);
                                } else {
                                    if (y == node.y - 1) {
                                        if (x == node.x - 1) {
                                            if (this.nodeData[y][x + 1].cross && this.nodeData[y + 1][x].cross) {
                                                this.nodeData[y][x].addValue = 14;
                                                aroundNode = this.nodeData[y][x];
                                                array.push(this.nodeData[y][x]);
                                            }
                                        } else if (x == node.x + 1) {
                                            if (this.nodeData[y][x - 1].cross && this.nodeData[y + 1][x].cross) {
                                                this.nodeData[y][x].addValue = 14;
                                                aroundNode = this.nodeData[y][x];
                                                array.push(this.nodeData[y][x]);
                                            }
                                        }
                                    } else if (y == node.y + 1) {
                                        if (x == node.x - 1) {
                                            if (this.nodeData[y - 1][x].cross && this.nodeData[y][x + 1].cross) {
                                                this.nodeData[y][x].addValue = 14;
                                                aroundNode = this.nodeData[y][x];
                                                array.push(this.nodeData[y][x]);
                                            }
                                        } else if (x == node.x + 1) {
                                            if (this.nodeData[y - 1][x].cross && this.nodeData[y][x - 1].cross) {
                                                this.nodeData[y][x].addValue = 14;
                                                aroundNode = this.nodeData[y][x];
                                                array.push(this.nodeData[y][x]);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        return array;
    }

    this.animateSearchPath=function() {
        if (this.openList.length && !this.targetNode.inOpenList) {
            var node = this.openList.shift();
            node.inOpenList=false;
            node.inCloseList=true;
            this.closeList.push(node);
            if(node.x==this.startNode.x&&node.y==this.startNode.y){
            }else{
                node.element.style.backgroundColor="yellow";
            }
            var aroundNodes = this.getAroundNodes(node);
            for (var i = 0; i < aroundNodes.length; i++) {
                aroundNodes[i].element.style.backgroundColor="blue";
                var newGValue = node.gValue + aroundNodes[i].addValue;
                if (aroundNodes[i].inOpenList) {
                    if (newGValue < aroundNodes[i].gValue) {
                        this.resetNode(aroundNodes[i], newGValue, node);
                        this.resetOpenListByNode(aroundNodes[i]);
                    }
                } else {
                    this.resetNode(aroundNodes[i], newGValue, node);
                    this.pushNodeToOpenList(aroundNodes[i]);
                }
            }
            this.nextSearchNode();
        }else{
            this.getPathNodes();
        }
    }

    this.nextSearchNode=function(){
        setTimeout(function(){
            self.animateSearchPath();
        },100);
    }
}
