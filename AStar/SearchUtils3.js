/**
 * Created by samsung on 2017/3/28.
 */
function SearchUtils3() {

    var nodeData = [];
    var openList = [];
    var closeList = [];
    var startNode;
    var targetNode;

    this.times=0;

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
            this.times="二分法寻路消耗的时间为:"+times;
        }else{
            this.times="二分法寻路消耗的时间为:"+times+",没有找到有效路径，已给出最近路线";
        }
        console.log("二分法寻路消耗的时间为:" + times);
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

    //按照fValue大小插入，使用二分法查找插入。最最垃圾的，可能是因为需要频繁改写对象属性indexInOpenList导致的？？？
    function pushNodeToOpenList(node) {
        node.inOpenList = true;
        if (openList.length == 0) {
            node.indexInOpenList = 0;
            openList.push(node);
        } else {
            var inserIndex = getInsertIndex(node);
            node.indexInOpenList = inserIndex;
            openList.splice(inserIndex, 0, node);
            for(var i=inserIndex;i<openList.length;i++){
                openList[i].indexInOpenList=i;
            }
        }
    }

    function resetOpenListByNode(node) {
        //先从原数组中删除，再按照fValue大小重新插入
        openList.splice(node.indexInOpenList, 1);
        for(var i=node.indexInOpenList;i<openList.length;i++){
            openList[i].indexInOpenList=i;
        }
        pushNodeToOpenList(node);
    }

    function shiftNodeFromOpenList(){
        var node=openList.shift();
        for(var i=0;i<openList.length;i++){
            openList[i].indexInOpenList=i;
        }
        return node;
    }

    //通过2分法查找应该插入的位置
    function getInsertIndex(node) {
        var low = 0;
        var high = openList.length - 1;
        while (low <= high) {
            var mid = (low + high) >> 1;
            if (node.fValue == openList[mid].fValue) {
                return mid;
            } else if (node.fValue < openList[mid].fValue) {
                high = mid - 1;
            } else {
                low = mid + 1;
            }
        }
        return low;
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
        while (openList.length && !targetNode.inOpenList) {
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
