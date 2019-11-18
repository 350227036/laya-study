export default class MouseScript extends Laya.Script3D{
    private meshsp:Laya.MeshSprite3D;
    constructor(){super();}
    /**
     * 覆写3D对象组件被激活后执行，此时所有节点和组件均已创建完毕，此方法只执行一次
     */
    onAwake(){
        this.meshsp = this.owner as Laya.MeshSprite3D();
    }
    //物体必须拥有碰撞组件（Collider）
    //当被鼠标点击
    onMouseDown(e){
        //console.log("点击到了我box",owner.name);
        //从父容器销毁我自己
        this.owner.removeSelf();
    }
}