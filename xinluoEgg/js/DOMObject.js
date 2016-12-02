/**
 * Created by samsung on 2016/11/29.
 */
function DOMObject(ele,args){
    this.ele=ele;
    for(var i=0;i<args.length;i++){
        for(var key in args[i]){
            this[key]=args[i][key];
        }
    }
}