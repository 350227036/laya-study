export default class CameraMoveScript extends Laya.Script {

    protected  _tempVector3:Laya.Vector3 = new Laya.Vector3();
    protected  lastMouseX:number;
    protected  lastMouseY:number;
    protected  yawPitchRoll:Laya.Vector3 = new Laya.Vector3();
    protected  resultRotation:Laya.Quaternion = new Laya.Quaternion();
    protected  tempRotationZ:Laya.Quaternion = new Laya.Quaternion();
    protected  tempRotationX:Laya.Quaternion = new Laya.Quaternion();
    protected  tempRotationY:Laya.Quaternion = new Laya.Quaternion();
    protected  isMouseDown:Boolean;
    protected  rotaionSpeed:number = 0.00022;
    // protected  rotaionSpeed:number = 0.00006;
    protected  camera:Laya.BaseCamera;
    protected  scene:Laya.Scene3D;

    protected  isMouseOut:Boolean;
    // protected  camera:Laya.BaseCamera;
    private _scene:Laya.Scene3D;
    private round:Laya.Sprite; //控制圆

    private direction:Laya.Sprite; //方向圆

    private speed:number = 0;
    private angle:number;

    private centerX:number = -1;
    private centerY:number = -1;

    constructor() {
        super();


        this.round = new Laya.Sprite;
        this.direction = new Laya.Sprite;

        Laya.stage.addChild(this.round);
        Laya.stage.addChild(this.direction);

        Laya.timer.frameLoop(1,this,this.heroMove);
    }

    /**
     * @private
     */
    protected  _updateRotation():void {
        if (Math.abs(this.yawPitchRoll.y) < 1.50) {
            Laya.Quaternion.createFromYawPitchRoll(this.yawPitchRoll.x, this.yawPitchRoll.y, this.yawPitchRoll.z, this.tempRotationZ);
            this.tempRotationZ.cloneTo(this.camera.transform.localRotation);
            this.camera.transform.localRotation = this.camera.transform.localRotation;
        }
    }
    
    /**
     * @inheritDoc
     */
    public  onAwake():void {
        this._scene = Laya.stage.getChildByName("scene") as Laya.Scene3D;

        this.camera = this._scene.getChildByName("camera") as Laya.Camera;

        this.owner.on(Laya.Event.MOUSE_DOWN,this,this.mouseDown);
        this.owner.on(Laya.Event.MOUSE_UP,this,this.mouseUp);
    }

    /**
     * @inheritDoc
     */
    public  onUpdate():void {
        var elapsedTime:number = Laya.timer.delta;
        // var speed = 5;
        var speed = 0.01;

        if (!isNaN(this.lastMouseX) && !isNaN(this.lastMouseY) && this.isMouseDown) {
            var scene:Laya.Scene3D = this.owner.scene;
            Laya.KeyBoardManager.hasKeyDown(87) && this.moveForward(-speed * elapsedTime);//W
            Laya.KeyBoardManager.hasKeyDown(83) && this.moveForward(speed * elapsedTime);//S
            Laya.KeyBoardManager.hasKeyDown(65) && this.moveRight(-speed * elapsedTime);//A
            Laya.KeyBoardManager.hasKeyDown(68) && this.moveRight(speed * elapsedTime);//D
            Laya.KeyBoardManager.hasKeyDown(32) && this.moveVertical(speed * elapsedTime);//Q
            Laya.KeyBoardManager.hasKeyDown(16) && this.moveVertical(-speed * elapsedTime);//E

            var offsetX:number = Laya.stage.mouseX - this.lastMouseX;
            var offsetY:number = Laya.stage.mouseY - this.lastMouseY;

            var yprElem:Laya.Vector3 = this.yawPitchRoll;
            yprElem.x -= offsetX * this.rotaionSpeed * elapsedTime;
            yprElem.y -= offsetY * this.rotaionSpeed * elapsedTime;
            this._updateRotation();
        }
        this.lastMouseX = Laya.stage.mouseX;
        this.lastMouseY = Laya.stage.mouseY;
    }

    
    protected  mouseDown(e:Event):void {
        console.log(e);
        e.stopPropagation();
        this.camera.transform.localRotation.getYawPitchRoll(this.yawPitchRoll);

        this.lastMouseX = Laya.stage.mouseX;
        this.lastMouseY = Laya.stage.mouseY;
        this.isMouseDown = true;

        this.direction.pos(Laya.stage.mouseX, Laya.stage.mouseY);
        this.direction.graphics.drawCircle(0, 0, 5, "#0000ff");
        this.round.graphics.drawCircle(Laya.stage.mouseX, Laya.stage.mouseY, 25, "#00ffff");
        this.round.graphics.drawCircle(Laya.stage.mouseX, Laya.stage.mouseY, 3, "#ffffff");
        this.centerX = Laya.stage.mouseX;
        this.centerY = Laya.stage.mouseY;
        Laya.stage.on(Laya.Event.MOUSE_MOVE, this, this.mouseMove);


    }

    protected mouseMove(e: MouseEvent) {
        if (this.centerX >= 0 && this.centerY >= 0) {
            //计算两点距离 如果超过一定距离 就停留在距离最大值处
            let dis = this.dis(this.centerX, this.centerY, Laya.stage.mouseX, Laya.stage.mouseY);

            if (dis > 20) {
                this.direction.pos(this.centerX + Math.cos(this.angle) * 20, this.centerY + Math.sin(this.angle) * 20);
            } else {
                this.direction.pos(Laya.stage.mouseX, Laya.stage.mouseY);
            }

            //如果距离太小 就代表没动
            if (dis > 3) {
                this.speed = 5;  //此处还可以通过距离 控制速度
            } else {
                this.speed = 0;
            }

        }
    }
    protected onMouseUp(e:Event):void {
        this.isMouseDown = false;
        Laya.stage.off(Laya.Event.MOUSE_MOVE, this, this.mouseMove);
        this.speed = 0;
        this.round.graphics.clear();
        this.direction.graphics.clear();
        console.log("弹起了");

    }

    protected heroMove() {
        if (this.speed > 0) {
            let dx: number = Laya.stage.mouseX - this.centerX;
            let dy: number = Laya.stage.mouseY - this.centerY;
            this.angle = Math.atan2(dy, dx);

            // this.hero.x += Math.cos(this.angle) * this.speed;
            // this.hero.y += Math.sin(this.angle) * this.speed;

            // var elapsedTime:number = Laya.timer.delta;

            var _tempVector3 = { x: Math.cos(this.angle) * this.speed, y: 0, z: Math.sin(this.angle) * this.speed };
            // _tempVector3.x = _tempVector3.z = 0;
            // _tempVector3.y = -0.11 * elapsedTime;]
            // this.camera.transform.translate(_tempVector3);
            this.speed = 1;
            // this.camera.transform.rotate(new Laya.Vector3(-Math.sin(this.angle) * this.speed, -Math.cos(this.angle) * this.speed, 0), true, false);

        }
    }

    protected dis(centerX, centerY, mouseX, mouseY) {
        let dx: number = centerX - mouseX;
        let dy: number = centerY - mouseY;
        let distance: number = Math.sqrt(dx * dx + dy * dy);
        return distance;
    }

    public onMouseOut():void {
        console.log("出去了");
        Laya.stage.off(Laya.Event.MOUSE_MOVE, this, this.mouseMove);
        this.speed = 0;
        this.round.graphics.clear();
        this.direction.graphics.clear();

    }


}
