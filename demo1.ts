import CameraMoveScript from "./script/common/CameraMoveScript"
import MobileMoveScript from "./script/MobileMoveScript"
import ViewMoveScript from "./script/ViewMoveScript"
class LoadResourceDemo{
	private _scene:Laya.Scene3D;

    constructor(){
        this._scene =null;
        //初始化引擎
		Laya3D.init(0, 0);
		Laya.stage.scaleMode = Laya.Stage.SCALE_FULL;
		Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;
        Laya.stage.screenMode = "horizontal";
		//显示性能面板
		Laya.Stat.show();

		//批量预加载方式
		this.PreloadingRes();
    }

    //批量预加载方式
    PreloadingRes(){
        //预加载所有资源
		var resource = [
            "res/threeDimen/scene/XunLongShi/XunLongShi.ls",  
            "res/threeDimen/skyBox/skyBox2/skyBox2.lmat",
            "res/threeDimen/texture/earth.png",
            "res/threeDimen/skinModel/LayaMonkey/Assets/LayaMonkey/LayaMonkey-LayaMonkey.lm",
            "res/threeDimen/skinModel/LayaMonkey/LayaMonkey.lh","res/threeDimen/skinModel/BoneLinkScene/PangZiNoAni.lh", 
			"res/threeDimen/skinModel/BoneLinkScene/Assets/Model3D/PangZi-Take 001.lani"];
            Laya.loader.create(resource, Laya.Handler.create(this, this.onPreLoadFinish));	
    }
    onPreLoadFinish(){
        //初始化3D场景
		this._scene = Laya.stage.addChild(Laya.Loader.getRes("res/threeDimen/scene/XunLongShi/XunLongShi.ls")) as Laya.Scene3D;
        this._scene.name = "scene";
		//添加相机
		var camera = new Laya.Camera();
        camera.name = "camera";
		this._scene.addChild(camera);
		//设置相机清楚标记，使用天空
		camera.clearFlag =Laya.BaseCamera.CLEARFLAG_SKY;
		//调整相机的位置
		camera.transform.translate(new Laya.Vector3(3, 20, 47));
		//相机视角控制组件(脚本)
		camera.addComponent(CameraMoveScript);
		camera.addComponent(MobileMoveScript);

		//添加光照
		var directionLight = new Laya.DirectionLight();
		this._scene.addChild(directionLight);
		//光照颜色
		directionLight.color = new Laya.Vector3(1, 1, 1);
		directionLight.transform.rotate(new Laya.Vector3( -3.14 / 3, 0, 0));
		
		//使用材质
		var skyboxMaterial = Laya.Loader.getRes("res/threeDimen/skyBox/skyBox2/skyBox2.lmat");
		var skyRenderer = camera.skyRenderer;
		skyRenderer.mesh = Laya.SkyBox.instance;
		skyRenderer.material = skyboxMaterial;

        // 方法1：使用loadImage //视角控制区域
        var viewMove: Laya.Sprite = new Laya.Sprite();
        Laya.stage.addChild(viewMove);
        viewMove.loadImage("res/threeDimen/monkey.png");
        viewMove.addComponent(ViewMoveScript);

        viewMove.size(500,500);
        viewMove.pos(Laya.stage.width - viewMove.width,(Laya.stage.height - viewMove.height) / 2);
        console.log(Laya.stage.width,viewMove);



    }
}

//激活启动类
new LoadResourceDemo();