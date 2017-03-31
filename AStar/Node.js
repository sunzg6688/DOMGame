/**
 * Created by samsung on 2017/3/28.
 */
function Node(obj){
    this.x=obj.x;
    this.y=obj.y;
    this.cross=obj.cross;
    this.parent=null;
    this.gValue=-1;
    this.fValue=-1;
    this.addValue=-1;
    this.dir;
    this.element=null;

    this.inCloseList=false;
    this.indexInCloseList=-1;

    this.inOpenList=false;
    this.indexInOpenList=-1;
}