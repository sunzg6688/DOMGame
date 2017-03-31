/**
 * Created by samsung on 2017/3/28.
 */
function SearchUtils2() {

    var nodeData = [];
    var openList = [];
    var closeList = [];
    var startNode;
    var targetNode;

    this.getPath = function (start, target, data) {
        if (!target.cross) {
            console.log("目标点无法到达==>目标点不是可穿越类型");
            return null;
        }
        startNode = start;
        targetNode = target;
        nodeData = data;
        var startTime = new Date().getTime();
        resetNode(startNode, 0, null);
        pushNodeToOpenList(startNode);
        searchPath();
        var path = getPathNodes();
        var times=new Date().getTime() - startTime;
        if(targetNode.parent){
            this.times="二叉堆寻路消耗的时间为:"+times;
        }else{
            this.times="二叉堆寻路消耗的时间为:"+times+",没有找到有效路径，已给出最近路线";
        }
        console.log("二叉堆寻路消耗的时间为:" + times);
        resetList();
        return path;
    }

    function getPathNodes() {
        var path = [];
        var pathNode;
        if (targetNode.parent) {
            pathNode = targetNode;
        } else {
            console.log("目标点无法到达==>无法搜索到有效路径,给出离目标点最近的点");
            pathNode = closeList[0];
            for (var i = 0; i < closeList.length; i++) {
                if (closeList[i].hValue < pathNode.hValue) {
                    pathNode = closeList[i];
                }
            }
        }

        while (pathNode.parent) {
            path.unshift(pathNode)
            pathNode = pathNode.parent;
        }
        path.unshift(startNode);
        return path;
    }

    function resetList() {
        var node;
        while (openList.length) {
            node = openList.shift();
            node.parent = null;
            node.indexInOpenList = -1;
            node.inOpenList = false;
            node.addValue = -1;
            node.fValue = -1;
            node.gValue = -1;
            node.hValue = -1;
        }
        while (closeList.length) {
            node = closeList.shift();
            node.parent = null;
            node.inCloseList = false
            node.indexInOpenList = -1;
            node.addValue = -1;
            node.fValue = -1;
            node.gValue = -1;
            node.hValue = -1;
        }
    }

    function resetNode(node, gValue, parent) {
        node.parent = parent;
        node.gValue = gValue;
        node.hValue = Math.abs(targetNode.x - node.x) * 10 + Math.abs(targetNode.y - node.y) * 10;
        node.fValue = node.gValue + node.hValue;
    }

    //按照fValue大小插入，使用二叉堆优化
    var fixedNode=new Node({x:-1,y:-1,cross:false});
    function pushNodeToOpenList(node) {
        node.inOpenList = true;
        if (openList.length == 0) {
            //非常关键用node填充数组的第二个元素即索引为1的元素。
            //后面pop时总会弹出索引为1的元素。
            openList.push(fixedNode);
            node.indexInOpenList = 1;
            openList.push(node);
        } else {
            openList.push(node);
            var last=openList.length-1;
            node.indexInOpenList=last;

            while(last>1){
                var half=last>>1;
                if(openList[last].fValue>=openList[half].fValue){
                    break;
                }

                var tmpNode=openList[last];

                openList[last]=openList[half];
                openList[last].indexInOpenList=last;

                openList[half]=tmpNode;
                openList[half].indexInOpenList=half;

                last=last>>1;
            }
        }
    }

    function shiftNodeFromOpenList(){
        var shiftNode=openList[1];
        var last=openList.length-1;
        openList[1]=openList[last];
        openList[1].indexInOpenList=1;
        openList.pop();
        last=openList.length-1;
        var head=1;
        while((head<<1)+1<=last){
            var child1=head<<1;
            var child2=child1+1;
            var childMin=openList[child1].fValue<openList[child2].fValue?child1:child2;
            if(openList[head].fValue<=openList[childMin].fValue){
                break
            }
            var tmpNode=openList[head];
            openList[head]=openList[childMin];
            openList[head].indexInOpenList=head;

            openList[childMin]=tmpNode;
            openList[childMin].indexInOpenList=childMin;
            head=childMin;
        }
        return shiftNode;
    }

    function resetOpenListByNode(node) {
        var last=node.indexInOpenList;
        while(last>1){
            var half=last>>1;
            if(openList[last].fValue>=openList[half].fValue){
                break;
            }
            var tmpNode=openList[last];
            openList[last]=openList[half];
            openList[last].indexInOpenList=last;

            openList[half]=tmpNode;
            openList[half].indexInOpenList=half;
            last=last>>1;
        }
    }

    function getAroundNodes(node) {
        var array = [];
        for (var y = node.y - 1; y <= node.y + 1; y++) {
            if (0 <= y && y < nodeData.length) {
                for (var x = node.x - 1; x <= node.x + 1; x++) {
                    if (0 <= x && x < nodeData[y].length) {
                        if (y == node.y && x == node.x) {

                        } else {
                            if (nodeData[y][x] && nodeData[y][x].cross && !nodeData[y][x].inCloseList) {
                                var aroundNode;
                                if (x == node.x || y == node.y) {
                                    nodeData[y][x].addValue = 10;
                                    aroundNode = nodeData[y][x];
                                    array.push(nodeData[y][x]);
                                } else {
                                    //避免拐角对角线穿过的情形出现
                                    if (y == node.y - 1) {
                                        if (x == node.x - 1) {
                                            if (nodeData[y][x + 1].cross && nodeData[y + 1][x].cross) {
                                                nodeData[y][x].addValue = 14;
                                                aroundNode = nodeData[y][x];
                                                array.push(nodeData[y][x]);
                                            }
                                        } else if (x == node.x + 1) {
                                            if (nodeData[y][x - 1].cross && nodeData[y + 1][x].cross) {
                                                nodeData[y][x].addValue = 14;
                                                aroundNode = nodeData[y][x];
                                                array.push(nodeData[y][x]);
                                            }
                                        }
                                    } else if (y == node.y + 1) {
                                        if (x == node.x - 1) {
                                            if (nodeData[y - 1][x].cross && nodeData[y][x + 1].cross) {
                                                nodeData[y][x].addValue = 14;
                                                aroundNode = nodeData[y][x];
                                                array.push(nodeData[y][x]);
                                            }
                                        } else if (x == node.x + 1) {
                                            if (nodeData[y - 1][x].cross && nodeData[y][x - 1].cross) {
                                                nodeData[y][x].addValue = 14;
                                                aroundNode = nodeData[y][x];
                                                array.push(nodeData[y][x]);
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

    function searchPath() {
        //openList第一个元素为占位元素fixedNode，所以openList长度必须大于1
        while (openList.length>1 && !targetNode.inOpenList) {
            var node = shiftNodeFromOpenList();
            node.inOpenList=false;
            node.indexInOpenList=-1;
            node.inCloseList = true;
            closeList.push(node);
            var aroundNodes = getAroundNodes(node);
            for (var i = 0; i < aroundNodes.length; i++) {
                var newGValue = node.gValue + aroundNodes[i].addValue;
                if (aroundNodes[i].inOpenList) {
                    if (newGValue < aroundNodes[i].gValue) {
                        resetNode(aroundNodes[i], newGValue, node);
                        resetOpenListByNode(aroundNodes[i]);
                    }
                } else {
                    resetNode(aroundNodes[i], newGValue, node);
                    pushNodeToOpenList(aroundNodes[i]);
                }
            }
        }
    }
}
