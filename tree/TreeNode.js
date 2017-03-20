/**
 * Created by samsung on 2017/3/14.
 */

//设置原始数据源
var nodeList=treeData;
//声明一个root根节点，所有node节点都为root节点的子孙节点
var rootNode={id:"rootNode",name:"rootNode",level:0,children:[]}

function byID(a, b) {
    return a.id - b.id
}

//设置node节点的父节点
function setNodeParent(node) {
    node.parent = null;
    for (var i = 0; i < nodeList.length; i++) {
        if (node.Adpos_Depth_Index == nodeList[i].id) {
            node.parent = nodeList[i];
            if(!nodeList[i].children){
                nodeList[i].children=[];
            }
            nodeList[i].children.push(node);
        }
    }
}

//设置node节点的等级
function setNodeLevel(node){
    if(node.children){
        for(var i=0;i<node.children.length;i++){
            node.children[i].level=node.level+1;
            setNodeLevel(node.children[i]);
        }
    }
}

//排列原始数据，并根据原始数据生成对应的层级父子关系和等级
function sortNode(){
    nodeList.sort(byID);

    for (var i = 0; i < nodeList.length; i++) {
        var node = nodeList[i];
        setNodeParent(node);
    }

    //如果node节点没有父节点，那么设此节点的父节点为rootNode。
    for(var i=0;i<nodeList.length;i++){
        if(!nodeList[i].parent){
            nodeList[i].parent=rootNode;
            rootNode.children.push(nodeList[i])
        }
    }

    setNodeLevel(rootNode);
}

function eid(id){
    return document.getElementById(id);
}

//必须设置nodePanel的display="block，因为在后面会根据此属性判断计算并设置展开父节点。
var nodePanel=eid("nodePanel");
nodePanel.style.display="block";

//添加，删除，重命名等功能的编辑面板
var editPanel=eid("editPanel");

//node节点的宽度和高度
var nodeWidth=140;
var nodeHeight=60;

//生成node节点以及子节点对应的dom树结构
function createDomNode(node,i,parent,isLast){
    if(node.name=="rootNode"){
        node.open=true;
        node.element=nodePanel;
        nodePanel.style.width=(rootNode.children.length)*nodeWidth+"px";
    }else{
        var element=getElementByNode(node,i,isLast);
        parent.appendChild(element);
    }
    if(node.children){
        for(var i=0;i<node.children.length;i++){
            var isLast=false;
            if(i==node.children.length-1){
                isLast=true;
            }
            createDomNode(node.children[i],i,node.element,isLast);
        }
    }
}

//根据node节点所包含的信息生成所对应的dom元素节点
function getElementByNode(node,i,isLast){
    var nameElement=document.createElement("div");
    nameElement.style.width=(nodeWidth/2)+"px";
    nameElement.style.height=nodeHeight/2+"px";
    nameElement.style.lineHeight=nodeHeight/2+"px";
    nameElement.style.overflow="hidden";
    nameElement.style.background="#555555";
    nameElement.style.margin=nodeHeight/4+"px"+" auto";

    var eidtElement=document.createElement("div");
    eidtElement.style.width="30px";
    eidtElement.style.height="20px";
    eidtElement.style.lineHeight="20px";
    eidtElement.style.position="absolute";
    eidtElement.style.backgroundColor="rgb(0, 0, 204)";
    eidtElement.style.textAlign="center";
    eidtElement.innerHTML="编辑";
    eidtElement.style.cursor="pointer";
    eidtElement.style.fontSize="12px";
    eidtElement.style.left="106px";
    eidtElement.style.top="20px";

    var element=document.createElement("div");
    element.style.width=nodeWidth+"px";
    element.style.height=nodeHeight+"px";
    element.style.position="relative";
    element.style.float="left";

    var upLine=document.createElement("div");
    upLine.style.position="absolute";
    upLine.style.width="2px";
    upLine.style.height="15px";
    upLine.style.left=nodeWidth/2-1+"px";
    upLine.style.top="0px";
    upLine.style.backgroundColor="#555555";

    var leftLine=document.createElement("div");
    leftLine.style.position="absolute";
    leftLine.style.width=nodeWidth/2+"px";
    leftLine.style.height="2px";
    leftLine.style.left="0px";
    leftLine.style.top="0px";
    leftLine.style.backgroundColor="#555555";

    var rightLine=document.createElement("div");
    rightLine.style.position="absolute";
    rightLine.style.width=nodeWidth/2+"px";;
    rightLine.style.height="2px";
    rightLine.style.left=nodeWidth/2+1+"px";
    rightLine.style.top="0px";
    rightLine.style.backgroundColor="#555555";

    var downLine=document.createElement("div");
    downLine.style.position="absolute";
    downLine.style.width="2px";
    downLine.style.height="15px";
    downLine.style.left=nodeWidth/2-1+"px";
    downLine.style.top="45px";
    downLine.style.backgroundColor="#555555";

    element.appendChild(upLine);
    element.appendChild(leftLine);
    element.appendChild(rightLine);
    element.appendChild(downLine);
    element.appendChild(eidtElement);

    if(i==0){
        leftLine.style.display="none";
    }
    if(isLast){
        rightLine.style.display="none";
    }
    downLine.style.display="none";

    if(node.children){
        nameElement.innerHTML=' + '+node.name;
        nameElement.style.cursor="pointer";
    }else{
        nameElement.innerHTML=node.name;
    }
    if(node.parent!=rootNode){
        element.style.display="none";
    }else{
        element.style.display="block";
    }
    element.nodeData=node;
    nameElement.nodeData=node;
    nameElement.onclick=openOrCloseNode;
    eidtElement.onclick=showEidtPanel;
    eidtElement.nodeData=node;

    node.open=false;
    node.index=i;
    node.element=element;
    node.nameElement=nameElement;
    node.eidtElement=eidtElement;

    node.upLine=upLine;
    node.leftLine=leftLine;
    node.rightLine=rightLine;
    node.downLine=downLine;

    element.appendChild(nameElement);
    return  element;
}

var selectedNode;
function showEidtPanel(event){
    if(editPanel.style.display==""||editPanel.style.display=="none"){
        selectedNode=event.target.nodeData;
        editPanel.style.display="block";
        editPanel.style.left=(event.clientX+document.body.scrollLeft+5)+"px";
        var offsetHeight=eid("developerDoc").offsetHeight+eid("searchPanel").offsetHeight;
        editPanel.style.top=(event.clientY+document.body.scrollTop-offsetHeight-5)+"px";
    }else{
        editPanel.style.display="none";
    }
}

var focusEidtPanel=false;
function hideEidtPanel(){
    if(focusEidtPanel){
        editPanel.style.display="block";
    }else{
        editPanel.style.display="none";
    }
}

editPanel.onmouseover=function(){
    focusEidtPanel=true;
}
editPanel.onmouseout=function(){
    focusEidtPanel=false;
    setTimeout(hideEidtPanel,1000);
}

//设置node节点上的显示线的位置和尺寸
function resetNodeLineSize(node,newWidth){
    node.downLine.style.left=(newWidth/2-1)+"px";
    node.upLine.style.left=(newWidth/2-1)+"px";
    node.leftLine.style.width=newWidth/2+'px';
    node.rightLine.style.left=newWidth/2+1+'px';
    node.rightLine.style.width=newWidth/2+'px';
    node.eidtElement.style.left=(newWidth/2+36)+"px";
}

//关闭node节点下的所有子节点
function closeNodeChildren(node){
    node.open=false;
    if(node.children){
        node.nameElement.innerHTML=' + '+node.name;
        node.element.style.width=nodeWidth+"px";
        for(var i=0;i<node.children.length;i++){
            node.children[i].element.style.display="none";
            if(node.children[i].open){
                closeNodeChildren(node.children[i])
            }
        }
    }
    var newWidth=nodeWidth;
    node.downLine.style.display="none";
    resetNodeLineSize(node,newWidth);
}

//展开或者关闭node节点的子节点
function openOrCloseNode(event){
    var node=event.target.nodeData;
    if(node.open){
        node.open=false;
        if(node.children){
            node.nameElement.innerHTML=' + '+node.name;
            for(var i=0;i<node.children.length;i++){
                node.children[i].element.style.display="none";
                if(node.children[i].open){
                    closeNodeChildren(node.children[i])
                }
            }

            var offsetWidth=node.element.offsetWidth;
            var newWidth=nodeWidth;

            node.element.style.width=nodeWidth+"px";
            node.downLine.style.display="none";
            resetNodeLineSize(node,newWidth);

            var addWidth=newWidth-offsetWidth;
            nodeParentAddWidth(node,addWidth);
        }
    }else{
        node.open=true;
        if(node.children){
            node.nameElement.innerHTML=' - '+node.name;
            for(var i=0;i<node.children.length;i++){
                node.children[i].element.style.display="block";
            }

            var newWidth=node.children.length*nodeWidth;
            node.element.style.width=newWidth+"px";
            node.downLine.style.display="block";
            resetNodeLineSize(node,newWidth);

            var addWidth=(node.children.length-1)*nodeWidth;
            nodeParentAddWidth(node,addWidth);
        }
    }
}

//计算并设置node父节点的宽度，addWidth为父节点需要增加的宽度可以为正值也可以为负值。
function nodeParentAddWidth(node,addWidth){
    if(node.parent){
        var newWidth=node.parent.element.offsetWidth+addWidth;
        node.parent.element.style.width=newWidth+"px";
        if(node.parent.downLine){
            resetNodeLineSize(node.parent,newWidth);
        }
        nodeParentAddWidth(node.parent,addWidth);
    }
}

//设置node节点上的显示线是否显示
function resetNodeChildrenLine(node){
    if(node.children){
        if(node.children.length==1){
            node.children[0].leftLine.style.display="none";
            node.children[0].rightLine.style.display="none";
        }else if(node.children.length>1){
            for(var i=0;i<node.children.length;i++){
                if(i==0){
                    node.children[i].leftLine.style.display="none";
                    node.children[i].rightLine.style.display="block";
                }
                if(i==node.children.length-1){
                    node.children[i].leftLine.style.display="block";
                    node.children[i].rightLine.style.display="none";
                }
                if(i!=0&&i!=node.children.length-1){
                    node.children[i].leftLine.style.display="block";
                    node.children[i].rightLine.style.display="block";
                }
            }
        }
    }
}

var indexNum=9999;

//给选中的node节点添加子节点
function addNodeHandler(){
    editPanel.style.display="none";
    if(!selectedNode.children){
        selectedNode.children=[];
    }

    indexNum++;
    var newId=indexNum;
    var newNode={id:newId,name:indexNum,Adpos_Depth_Index:selectedNode.id};
    newNode.parent=selectedNode;
    newNode.level=selectedNode.level+1;
    newNode.open=false;

    var iIndex=selectedNode.children.length;
    var isLast=true;
    var element=getElementByNode(newNode,iIndex,isLast);

    //得到的node节点对应的dom节点默认是隐藏状态，需要设置成显示状态
    element.style.display="block";
    selectedNode.element.appendChild(element);
    selectedNode.children.push(newNode);

    var node=selectedNode;
    if(!selectedNode.open){
        node.open=true;
        if(node.children){
            node.nameElement.innerHTML=' - '+node.name;
            for(var i=0;i<node.children.length;i++){
                node.children[i].element.style.display="block";
            }
            var newWidth;

            newWidth=node.children.length*nodeWidth;
            node.element.style.width=newWidth+"px";

            node.downLine.style.display="block";
            resetNodeLineSize(node,newWidth);

            var addWidth=(node.children.length-1)*nodeWidth;
            nodeParentAddWidth(node,addWidth);
        }
    }else{
        node.open=true;

        var addWidth;
        if(node.children.length==1){
            addWidth=0;
        }else{
            addWidth=nodeWidth;
        }

        newWidth=selectedNode.element.offsetWidth+addWidth;
        node.element.style.width=newWidth+"px";

        //得到的node节点对应的dom节点默认是隐藏状态，需要设置成显示状态
        node.downLine.style.display="block";
        resetNodeLineSize(node,newWidth);

        nodeParentAddWidth(node,addWidth);
    }
    resetNodeChildrenLine(node);
}

//删除node节点以及包含的所有子节点
function deleteNodeHandler(){
    editPanel.style.display="none";
    var deleteNode=selectedNode;
    if(deleteNode.parent){
        var index;
        for(var i=0;i<deleteNode.parent.children.length;i++){
            if(deleteNode.id==deleteNode.parent.children[i].id){
                index=i;
            }
        }
        deleteNode.parent.children.splice(index,1);

        var node=deleteNode.parent;
        var addWidth;
        if(node.children.length==0){
            node.open=false;
            node.children=null;
            node.nameElement.innerHTML=node.name;
            node.downLine.style.display="none";

            var offsetWidth=deleteNode.element.offsetWidth;
            addWidth=nodeWidth-offsetWidth;
        }else{
            addWidth=-deleteNode.element.offsetWidth;
        }

        //必须在此处从dom树中删除此节点，否则上面获取的deleteNode.element.offsetWidth始终为0;
        deleteNode.parent.element.removeChild(deleteNode.element);
        nodeParentAddWidth(deleteNode,addWidth);
        resetNodeChildrenLine(node);
    }
}

//根据相关信息查找节点
function searchNodeHandler(){
    var value=eid("searchInput").value;
    if(value){

        nodePanel.innerHTML="";
        //不需要重新设置数据的父子级关系，因为在nodelist中可能包含被删除的数据节点，只需要根据rootNode节点重新生成dom节点即可。
        createDomNode(rootNode,0,nodePanel,true);

        var level=parseInt(value);
        if(value<=0)return;

        searchNodeByLevel(rootNode,level)
    }
}

//查找所有等于level等级的节点，并展开显示出来。
function searchNodeByLevel(node,level){
    if(level>node.level){
        if(node.children){
            if(node.children[0].level==level){
                if(node.element.style.display==""||node.element.style.display=="none"){
                    var addWidth=node.children.length*nodeWidth;
                    for(var i=0;i<node.children.length;i++){
                        node.children[i].element.style.display="block";
                    }
                    node.element.style.display="block";
                    node.element.style.width=addWidth+"px";
                    node.downLine.style.display="block";
                    node.nameElement.innerHTML=" - "+node.name;
                    node.open=true;

                    var parentWidth=addWidth;
                    if(node.parent){
                        if(node.parent.children.length==1){
                            parentWidth=addWidth;
                        }else{
                            parentWidth=(node.parent.children.length-1)*nodeWidth+addWidth;
                        }
                        for(var j=0;j<node.parent.children.length;j++){
                            node.parent.children[j].element.style.display="block";
                        }
                    }
                    resetNodeLineSize(node,addWidth);
                    setNodeParentWidth(node,parentWidth);
                }else{
                    if(node.children[0].element.style.display==""||node.children[0].element.style.display=="none"){
                        var addWidth;
                        var newWidth;
                        if(node.children.length==1){
                            addWidth=0;
                            newWidth=nodeWidth;
                        }else{
                            addWidth=(node.children.length-1)*nodeWidth;
                            newWidth=node.children.length*nodeWidth;
                        }
                        for(var i=0;i<node.children.length;i++){
                            node.children[i].element.style.display="block";
                        }
                        node.element.style.width=newWidth+"px";
                        node.downLine.style.display="block";
                        node.nameElement.innerHTML=" - "+node.name;
                        node.open=true;

                        resetNodeLineSize(node,newWidth);
                        nodeParentAddWidth(node,addWidth);
                    }
                }
            }else{
                for(var i=0;i<node.children.length;i++){
                    searchNodeByLevel(node.children[i],level);
                }
            }
        }
    }
}

//设置node父节点的宽度，parentWidth为父节点的宽度
function setNodeParentWidth(node,parentWidth){
    if(node.parent){
        var parentNode=node.parent;
        if(parentNode.element.style.display==""||parentNode.element.style.display=="none"){
            parentNode.element.style.display="block";
            parentNode.open=true;
            parentNode.element.style.width=parentWidth+"px";

            var newParentWidth=parentWidth;
            if(parentNode.parent){
                if(parentNode.parent.children.length==1){
                    newParentWidth=parentWidth;
                }else{
                    newParentWidth=parentWidth+(parentNode.parent.children.length-1)*nodeWidth;
                }
                for(var j=0;j<parentNode.parent.children.length;j++){
                    parentNode.parent.children[j].element.style.display="block";
                }
            }
            setNodeParentWidth(parentNode,newParentWidth);
        }else{
            parentNode.open=true;
            var offsetWidth=parentNode.element.offsetWidth;
            parentNode.element.style.width=parentWidth+"px";
            var addWidth=parentWidth-offsetWidth;
            nodeParentAddWidth(parentNode,addWidth);
        }
        if(parentNode.downLine){
            parentNode.downLine.style.display="block";
            resetNodeLineSize(parentNode,parentWidth);
            parentNode.nameElement.innerHTML=" - "+parentNode.name;
        }
    }
}

//初始化并排列所有数据，并根据生成父子级关系生成dom节点并显示到页面上
function initTree(){
    sortNode();
    createDomNode(rootNode,0,nodePanel,true);
}

initTree();

//给功能按钮添加监听器
eid("addNodeBtn").onclick=addNodeHandler;
eid("deleteNodeBtn").onclick=deleteNodeHandler;
eid("searchBtn").onclick=searchNodeHandler;