import Transform3D = Laya.Transform3D;
import Vector3 = laya.d3.math.Vector3;
import Quaternion = laya.d3.math.Quaternion;


/*
    用法：
    //初始化照相机
	var camera = this.newScene.addChild(new Laya.Camera(0, 0.1, 100)) as Laya.Camera;
    camera.transform.rotationEuler = new Laya.Vector3(-32, -75, 0);
    camera.transform.position =new Laya.Vector3(-8.2, 5.3, 2.2);
    var modelViewer = camera.addComponent(ModelViewer);
    modelViewer.AroundPos = plane.transform.position;
 */
export default class ModelViewer extends Laya.Script {
    // Text m_debugTip;
    public canRotation_X: boolean = true;
    public canRotation_Y: boolean = true;
    public canScale: boolean = true;

    /// <summary>
    /// Around center.
    /// </summary>
    //public target: Transform3D;
    public AroundPos: Vector3 = new Vector3();
    /// <summary>
    /// Settings of mouse button, pointer and scrollwheel.
    /// </summary>
    public mouseSettings: MouseSettings = new MouseSettings(0, 1, 0.3);

    /// <summary>
    /// Range limit of angle.
    /// </summary>
    public angleRange: MyRange = new MyRange(5, 90);

    /// <summary>
    /// Range limit of distance.
    /// </summary>
    public distanceRange: MyRange = new MyRange(1, 10);

    /// <summary>
    /// Damper for move and rotate.
    /// </summary>
    ///[Range(0, 10)]
    public damper: number = 5;

    /// <summary>
    /// Camera current angls.
    /// </summary>
    public CurrentAngles: Vector3 = new Vector3();
    public CurrentAnglesTemp: Vector3 = new Vector3();
    /// <summary>
    /// Current distance from camera to target.
    /// </summary>
    public CurrentDistance: number;

    /// <summary>
    /// Camera target angls.
    /// </summary>
    protected targetAngles: Vector3 = new Vector3();


    /// <summary>
    /// Target distance from camera to target.
    /// </summary>
    protected targetDistance: number;


    //protected camera: Laya.Camera;
    constructor() {
        super();
    }
    public transform: Transform3D;

    onStart(): void {
        this.transform = (this.owner as Laya.Sprite3D).transform;
        this.CurrentAngles = new Vector3(-this.transform.rotationEuler.x, this.transform.rotationEuler.y, 0);
        this.targetAngles = new Vector3(-this.transform.rotationEuler.x, this.transform.rotationEuler.y, 0);
        this.CurrentDistance = Vector3.distance(this.transform.position, this.AroundPos);
        this.targetDistance = Vector3.distance(this.transform.position, this.AroundPos);
        Laya.stage.on(Laya.Event.MOUSE_DOWN, this, this.mouseDown);
        Laya.stage.on(Laya.Event.MOUSE_MOVE, this, this.mouseMove);
        Laya.stage.on(Laya.Event.MOUSE_UP, this, this.mouseUp);
        Laya.stage.on(Laya.Event.MOUSE_WHEEL, this, this.mouseWheel)
    }
    onUpdate(): void {
        if (Laya.Browser.onMobile) {
            this.AroundByMobileInput();
        } else {
            this.AroundByMouseInput();
        }
        if (!this.canRotation_X) this.targetAngles.y = 0;
        if (!this.canRotation_Y) this.targetAngles.x = 0;
        //Lerp.
        this.CurrentAngles = this.LerpVector3(this.CurrentAngles, this.targetAngles, this.deltaTime * this.damper);
        this.CurrentDistance = this.LerpNum(this.CurrentDistance, this.targetDistance, this.deltaTime * this.damper);
        //Update transform position and rotation.
        // Quaternion.createFromYawPitchRoll(this.CurrentAngles.y,this.CurrentAngles.x,this.CurrentAngles.z,this.tempRotationZ)
        // this.transform.rotation = this.tempRotationZ;
        this.CurrentAnglesTemp.x = -this.CurrentAngles.x;
        this.CurrentAnglesTemp.y = this.CurrentAngles.y;
        this.CurrentAnglesTemp.z = this.CurrentAngles.z;
        this.transform.rotationEuler = this.CurrentAnglesTemp;
        Vector3.scale(this.GetForward, this.CurrentDistance, this.tempV)
        Vector3.subtract(this.AroundPos, this.tempV, this.tempV1)
        this.transform.position = this.tempV1;
        this.lastMouseX = Laya.stage.mouseX;
        this.lastMouseY = Laya.stage.mouseY;
    }

    //记录上一次手机触摸位置判断用户是在左放大还是缩小手势  
    private oldPosition1: Vector3 = new Vector3();
    private oldPosition2: Vector3 = new Vector3();

    private m_IsSingleFinger: boolean;
    /*
    private void ScaleCamera()
    {
        //计算出当前两点触摸点的位置  
        var tempPosition1 = Input.GetTouch(0).position;
        var tempPosition2 = Input.GetTouch(1).position;
        float currentTouchDistance = Vector3.Distance(tempPosition1, tempPosition2);
        float lastTouchDistance = Vector3.Distance(oldPosition1, oldPosition2);
        //计算上次和这次双指触摸之间的距离差距  
        //然后去更改摄像机的距离  
        distance -= ( currentTouchDistance - lastTouchDistance ) * scaleFactor * Time.deltaTime;
        //把距离限制住在min和max之间  
        distance = Mathf.Clamp(distance, minDistance, maxDistance);
        //备份上一次触摸点的位置，用于对比  
        oldPosition1 = tempPosition1;
        oldPosition2 = tempPosition2;
    }
    */

    public get TouchCount(): number {
        if (Laya.TouchManager.I._event.touches == null) {
            return 0;
        } else {
            return this.myevent.touches.length;
        }
    }
    public get Touchs(): Array<any> {
        return this.myevent.touches
    }
    public get GetAxisX(): number {
        return Laya.stage.mouseX - this.lastMouseX;
    }
    public get GetAxisY(): number {
        return Laya.stage.mouseY - this.lastMouseY;
    }
    public get deltaTime(): number {
        return Laya.timer.delta / 1000;
    }

    public deltaWheel: number = 0;

    public FORWORD: Vector3 = new Vector3();
    public get GetForward(): Vector3 {
        this.transform.getForward(this.FORWORD);
        return this.FORWORD
    }
    protected lastMouseX: number = 0;
    protected lastMouseY: number = 0;
    protected mouseRunning: boolean = false;

    protected mouseDown(e: Laya.Event): void {
        this.mouseRunning = true;
    }
    myevent: Laya.Event;
    protected mouseMove(e: Laya.Event): void {
        this.myevent = e;
    }

    protected mouseWheel(e: Laya.Event): void {
        this.deltaWheel = e.delta;
    }
    protected mouseUp(e: Laya.Event): void {
        this.mouseRunning = false;
    }

    protected Clamp(num, min, max): number {
        if (num < min) {
            return min;
        } else if (num > max) {
            return max;
        } else {
            return num;
        }
    }

    protected LerpVector3(min: Vector3, max: Vector3, t: number): Vector3 {
        var vec: Vector3 = new Vector3();
        vec.x = min.x + t * (max.x - min.x);
        vec.y = min.y + t * (max.y - min.y);
        vec.z = min.z + t * (max.z - min.z);
        return vec;
    }
    protected LerpNum(min: number, max: number, t: number): number {
        return min + t * (max - min);
    }



    protected AroundByMobileInput(): void {
        if (this.TouchCount == 1) {
            console.log(this.targetAngles);
            this.targetAngles.y -= this.GetAxisX * this.mouseSettings.pointerSensitivity;
            this.targetAngles.x += this.GetAxisY * this.mouseSettings.pointerSensitivity;
            //Range.
            this.targetAngles.y = this.Clamp(this.targetAngles.y, this.angleRange.min, this.angleRange.max);
            //Mouse pointer.
            this.m_IsSingleFinger = true;
        }
        //Mouse scrollwheel.
        if (this.canScale) {
            if (this.TouchCount > 1) {
                //计算出当前两点触摸点的位置  
                if (this.m_IsSingleFinger) {
                    this.oldPosition1 = new Vector3(this.Touchs[0].stageX, this.Touchs[0].stageY);
                    this.oldPosition2 = new Vector3(this.Touchs[1].stageX, this.Touchs[1].stageY);
                }
                var tempPosition1 = new Vector3(this.Touchs[0].stageX, this.Touchs[0].stageY);
                var tempPosition2 = new Vector3(this.Touchs[1].stageX, this.Touchs[1].stageY);


                var currentTouchDistance = Vector3.distance(tempPosition1, tempPosition2);
                var lastTouchDistance = Vector3.distance(this.oldPosition1, this.oldPosition2);

                //计算上次和这次双指触摸之间的距离差距  
                //然后去更改摄像机的距离  
                this.targetDistance -= (currentTouchDistance - lastTouchDistance) * this.deltaTime * this.mouseSettings.wheelSensitivity;
                //  m_debugTip.text = ( currentTouchDistance - lastTouchDistance ).ToString() + " + " + targetDistance.ToString();

                //把距离限制住在min和max之间  

                //备份上一次触摸点的位置，用于对比  
                this.oldPosition1 = tempPosition1;
                this.oldPosition2 = tempPosition2;
                this.m_IsSingleFinger = false;
                this.targetDistance = this.Clamp(this.targetDistance, this.distanceRange.min, this.distanceRange.max);
            }
        }
    }
    tempRotationZ: Quaternion = new Quaternion();
    tempV: Vector3 = new Vector3();
    tempV1: Vector3 = new Vector3();


    /// <summary>
    /// Camera around target by mouse input.
    /// </summary>
    protected AroundByMouseInput(): void {
        if (this.mouseRunning) {
            //Mouse pointer.
            this.targetAngles.y -= (this.GetAxisX * this.mouseSettings.pointerSensitivity);
            this.targetAngles.x += (this.GetAxisY * this.mouseSettings.pointerSensitivity);
            //Range.
            this.targetAngles.x = this.Clamp(this.targetAngles.x, this.angleRange.min, this.angleRange.max);
        }
        //Mouse scrollwheel.
        if (this.canScale) {
            this.targetDistance -= this.deltaWheel * this.mouseSettings.wheelSensitivity;
            this.deltaWheel = 0;
            this.targetDistance = this.Clamp(this.targetDistance, this.distanceRange.min, this.distanceRange.max);
        }
    }

}

class MouseSettings {
    /// <summary>
    /// ID of mouse button.
    /// </summary>
    public mouseButtonID: number;

    /// <summary>
    /// Sensitivity of mouse pointer.
    /// </summary>
    public pointerSensitivity: number;

    /// <summary>
    /// Sensitivity of mouse ScrollWheel.
    /// </summary>
    public wheelSensitivity: number;

    /// <summary>
    /// Constructor.
    /// </summary>
    /// <param name="mouseButtonID">ID of mouse button.</param>
    /// <param name="pointerSensitivity">Sensitivity of mouse pointer.</param>
    /// <param name="wheelSensitivity">Sensitivity of mouse ScrollWheel.</param>
    constructor(mouseButtonID: number, pointerSensitivity: number, wheelSensitivity: number) {
        this.mouseButtonID = mouseButtonID;
        this.pointerSensitivity = pointerSensitivity;
        this.wheelSensitivity = wheelSensitivity;
    }
}

/// <summary>
/// Range form min to max.
/// </summary>
class MyRange {
    /// <summary>
    /// Min value of range.
    /// </summary>
    public min: number;

    /// <summary>
    /// Max value of range.
    /// </summary>
    public max: number;

    /// <summary>
    /// Constructor.
    /// </summary>
    /// <param name="min">Min value of range.</param>
    /// <param name="max">Max value of range.</param>
    constructor(min: number, max: number) {
        this.min = min;
        this.max = max;
    }
}


/// <summary>
/// Rectangle area on plane.
/// </summary>
class PlaneArea {
    /// <summary>
    /// Center of area.
    /// </summary>
    public center: Transform3D;

    /// <summary>
    /// Width of area.
    /// </summary>
    public width: number;

    /// <summary>
    /// Length of area.
    /// </summary>
    public length: number;

    /// <summary>
    /// Constructor.
    /// </summary>
    /// <param name="center">Center of area.</param>
    /// <param name="width">Width of area.</param>
    /// <param name="length">Length of area.</param>
    constructor(center: Transform3D, width: number, length: number) {
        this.center = center;
        this.width = width;
        this.length = length;
    }
}