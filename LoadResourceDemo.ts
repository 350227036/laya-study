import CameraMoveScript from "./script/common/CameraMoveScript";

class LoadResourceDemo {
	private _scene: Laya.Scene3D;
	private sprite3D: Laya.Sprite3D;
	private pangzi: Laya.Sprite3D;
	private pangziAnimator: Laya.Animator;
	private camera: Laya.Camera;
	//轮盘代码
	private round: Laya.Sprite; //控制圆
	private hero: Laya.Sprite; //人物

	private direction: Laya.Sprite; //方向圆

	private speed: number = 0;
	private angle: number;

	private centerX: number = -1;
	private centerY: number = -1;
//标记移动的是相机还是视角
	private move: number = 0;
	constructor() {
		this._scene = null;
		this.sprite3D = null;
		//初始化引擎
		Laya3D.init(0, 0);
		Laya.stage.scaleMode = Laya.Stage.SCALE_FULL;
		Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;
		Laya.stage.screenMode = "horizontal";
		//显示性能面板
		Laya.Stat.show();

		//加载资源
		// this.LoadRes();

		//批量预加载方式
		this.PreloadingRes();

	}
	LoadRes() {
		//场景加载
		Laya.Scene3D.load("res/threeDimen/scene/XunLongShi/XunLongShi.ls", Laya.Handler.create(this, function (scene) {
			// Laya.Scene3D.load("res/Conventional/weizou.ls", Laya.Handler.create(this, function(scene) {
			this._scene = scene;
			Laya.stage.addChild(scene);

			//添加相机
			var camera = new Laya.Camera();
			//从场景中获取摄像机
			// var camera = scene.getChildByName("Main Camera");
			console.log("haha", this);
			this._scene.addChild(camera);
			//设置相机清楚标记，使用天空
			camera.clearFlag = Laya.BaseCamera.CLEARFLAG_SKY;
			//调整相机的位置
			camera.transform.translate(new Laya.Vector3(3, 20, 47));
			// camera.transform.translate(new Laya.Vector3(0, 0, 0));
			//相机视角控制组件(脚本)
			camera.addComponent(CameraMoveScript);
			//添加光照
			var directionLight = this._scene.addChild(new Laya.DirectionLight());
			directionLight.color = new Laya.Vector3(1, 1, 1);
			directionLight.transform.rotate(new Laya.Vector3(-3.14 / 3, 0, 0));

			//材质加载
			Laya.BaseMaterial.load("res/threeDimen/skyBox/skyBox2/skyBox2.lmat", Laya.Handler.create(null, function (mat): void {
				//获取相机的天空渲染器
				var skyRenderer: Laya.SkyRenderer = camera.skyRenderer;
				//创建天空盒的mesh
				skyRenderer.mesh = Laya.SkyBox.instance;
				//设置天空盒材质
				skyRenderer.material = mat;
			}));

			// (scene.getChildByName('Scenes').getChildByName('HeightMap')).active = false;
			// (scene.getChildByName('Scenes').getChildByName('Area') ).active = false;

			//加载纹理
			Laya.Texture2D.load("res/threeDimen/texture/earth.png", Laya.Handler.create(null, function (tex): void {
				//使用纹理
				var earth1 = scene.addChild(new Laya.MeshSprite3D(Laya.PrimitiveMesh.createSphere(5, 32, 32))) as Laya.MeshSprite3D;
				earth1.transform.translate(new Laya.Vector3(17, 20, 0));

				var earthMat = new Laya.BlinnPhongMaterial();
				earthMat.albedoTexture = tex;
				earthMat.albedoIntensity = 1;
				earth1.meshRenderer.material = earthMat;
			}));

			//加载地图Mesh 
			// Laya.Mesh.load("res/Conventional/terrain/terrain_Terrain.lm", Laya.Handler.create(this, function(mesh) {
			// var terrain_Terrain = scene.addChild(new Laya.MeshSprite3D(mesh));
			// terrain_Terrain.transform.localScale = new Laya.Vector3(4, 4, 4);
			// terrain_Terrain.transform.rotation = new Laya.Quaternion(0.7071068, 0, 0, -0.7071067);
			// 	terrain_Terrain.transform.translate(new Laya.Vector3(5, 3, 13));
			// }));

			//加载Mesh
			Laya.Mesh.load("res/threeDimen/skinModel/LayaMonkey/Assets/LayaMonkey/LayaMonkey-LayaMonkey.lm", Laya.Handler.create(this, function (mesh) {
				var layaMonkey = scene.addChild(new Laya.MeshSprite3D(mesh));
				layaMonkey.transform.localScale = new Laya.Vector3(4, 4, 4);
				layaMonkey.transform.rotation = new Laya.Quaternion(0.7071068, 0, 0, -0.7071067);
				layaMonkey.transform.translate(new Laya.Vector3(5, 3, 13));
			}));
			//加载精灵
			// Laya.Sprite3D.load("res/Conventional/weizou.lh", Laya.Handler.create(this, function(sp) {
			// 	var weizou = scene.addChild(sp);
			// 	// weizou.transform.localScale = new Laya.Vector3(4, 4, 4);
			// 	weizou.transform.translate(new Laya.Vector3(5, 3, 13));

			// }));
			//加载精灵
			Laya.Sprite3D.load("res/threeDimen/skinModel/LayaMonkey/LayaMonkey.lh", Laya.Handler.create(this, function (sp) {
				var layaMonkey2 = scene.addChild(sp);
				layaMonkey2.transform.localScale = new Laya.Vector3(4, 4, 4);
				layaMonkey2.transform.translate(new Laya.Vector3(-10, 13, 0));
				layaMonkey2.addComponent(MonkeyScript);
			}));

			//加载胖子精灵
			Laya.Sprite3D.load("res/threeDimen/skinModel/BoneLinkScene/PangZiNoAni.lh", Laya.Handler.create(this, function (sp: Laya.Sprite3D): void {
				this.pangzi = scene.addChild(sp) as Laya.Sprite3D;
				this.pangzi.transform.localScale = new Laya.Vector3(4, 4, 4);
				this.pangzi.transform.translate(new Laya.Vector3(-20, 13, 0));
				//获取动画组件
				this.pangziAnimator = this.pangzi.getChildAt(0).getComponent(Laya.Animator) as Laya.Animator;

				Laya.AnimationClip.load("res/threeDimen/skinModel/BoneLinkScene/Assets/Model3D/PangZi-Take 001.lani", Laya.Handler.create(this, function (aniClip: Laya.AnimationClip): void {
					//创建动作状态
					var state1 = new Laya.AnimatorState();
					//动作名称
					state1.name = "hello";
					//动作播放起始时间
					state1.clipStart = 0 / 581;
					//动作播放结束时间
					state1.clipEnd = 581 / 581;
					//设置动作
					state1.clip = aniClip;
					//设置动作循环
					state1.clip.islooping = true;
					//为动画组件添加一个动作状态
					this.pangziAnimator.addState(state1);
					//播放动作
					this.pangziAnimator.play("hello");
				}));
			}));

			//实例化按钮
			this.addButton(200, 200, 160, 40, "向前进", function (e) {
				var elapsedTime: number = Laya.timer.delta;
				console.log(e);
				this._tempVector3 = { x: 0, y: 0, z: -0.17 };
				this._tempVector3.x = this._tempVector3.y = 0;
				this._tempVector3.z = -0.11 * elapsedTime;
				camera.transform.translate(this._tempVector3);
			});
		}));
	}
	//批量预加载方式
	PreloadingRes() {
		//预加载所有资源
		var resource = [
			"res/threeDimen/scene/XunLongShi/XunLongShi.ls",
			
			"res/threeDimen/skyBox/skyBox2/skyBox2.lmat",
			"res/threeDimen/texture/earth.png",
			"res/threeDimen/skinModel/LayaMonkey/Assets/LayaMonkey/LayaMonkey-LayaMonkey.lm",
			"res/threeDimen/skinModel/LayaMonkey/LayaMonkey.lh", "res/threeDimen/skinModel/BoneLinkScene/PangZiNoAni.lh",
			"res/threeDimen/skinModel/BoneLinkScene/Assets/Model3D/PangZi-Take 001.lani",
			"res/Conventional/layaScene.ls"
					
		];

			
		Laya.loader.create(resource, Laya.Handler.create(this, this.onPreLoadFinish));
	}
	onPreLoadFinish() {
		//初始化3D场景
		// this.scene = Laya.stage.addChild(Laya.Loader.getRes("res/threeDimen/scene/XunLongShi/XunLongShi.ls")) as Laya.Scene3D;
		this.scene = Laya.stage.addChild(Laya.Loader.getRes("res/Conventional/layaScene.ls")) as Laya.Scene3D;

		//添加相机
		var camera = new Laya.Camera();
		//获取摄像机
		// var camera = this.scene.getChildByName("Main Camera");
		this.camera = camera;
		camera.name = "camera";
		this.scene.addChild(camera);
		//设置相机清楚标记，使用天空
		camera.clearFlag = Laya.BaseCamera.CLEARFLAG_SKY;
		//调整相机的位置
		camera.transform.translate(new Laya.Vector3(3, 20, 47));
		// camera.transform.translate(new Laya.Vector3(-24541, 1000, -34198));

		//相机视角控制组件(脚本)
		camera.addComponent(CameraMoveScript);


		//添加光照
		var directionLight = new Laya.DirectionLight();
		this.scene.addChild(directionLight);
		//光照颜色
		directionLight.color = new Laya.Vector3(1, 1, 1);
		directionLight.transform.rotate(new Laya.Vector3(-3.14 / 3, 0, 0));

		//轮盘代码
		Laya.stage.on(Laya.Event.MOUSE_DOWN, this, this.mouseDown);
		Laya.stage.on(Laya.Event.MOUSE_UP, this, this.mouseUp);
		
		this.round = new Laya.Sprite;
		this.direction = new Laya.Sprite;

		this.hero = new Laya.Sprite;
		this.hero.graphics.drawPoly(Laya.stage.width / 2, Laya.stage.height / 2, [0, 100, 50, 0, 100, 100], "#ffff00");
		this.hero.pivot(50, 50);

		Laya.stage.addChild(this.round);
		Laya.stage.addChild(this.direction);
		// Laya.stage.addChild(this.hero);
		Laya.timer.frameLoop(1, this, this.heroMove);

		//添加ifram
		var iframe:any = Laya.Browser.document.createElement("iframe");
        iframe.style.position ="absolute";//设置布局定位。这个不能少。
        iframe.style.zIndex = 100;//设置层级
        iframe.style.left ="100px";
        iframe.style.top ="100px";
        iframe.src = "https://720yun.com/t/39vkim1ygre?scene_id=36447853";
        Laya.Browser.document.body.appendChild(iframe);


		//使用材质
		var skyboxMaterial = Laya.Loader.getRes("res/threeDimen/skyBox/skyBox2/skyBox2.lmat");
		var skyRenderer = camera.skyRenderer;
		skyRenderer.mesh = Laya.SkyBox.instance;
		skyRenderer.material = skyboxMaterial;

		//激活场景中的子节点
		// (this._scene.getChildByName('Scenes').getChildByName('HeightMap')).active = false;
		// (this._scene.getChildByName('Scenes').getChildByName('Area')).active = false;

		//使用纹理
		var earth1 = this.scene.addChild(new Laya.MeshSprite3D(Laya.PrimitiveMesh.createSphere(5, 32, 32))) as Laya.MeshSprite3D;
		earth1.transform.translate(new Laya.Vector3(17, 20, 0));

		var earthMat = new Laya.BlinnPhongMaterial();
		earthMat.albedoTexture = Laya.Loader.getRes("res/threeDimen/texture/earth.png");
		earthMat.albedoIntensity = 1;
		earth1.meshRenderer.material = earthMat;

		//创建一个精灵
		this.sprite3D = new Laya.Sprite3D();
		this.scene.addChild(this.sprite3D);
		//获取Mesh资源
		var mesh = Laya.Loader.getRes("res/threeDimen/skinModel/LayaMonkey/Assets/LayaMonkey/LayaMonkey-LayaMonkey.lm");
		//为精灵设置Mesh资源
		var layaMonkey = new Laya.MeshSprite3D(mesh);
		this.sprite3D.addChild(layaMonkey);
		layaMonkey.transform.localScale = new Laya.Vector3(4, 4, 4);
		layaMonkey.transform.rotation = new Laya.Quaternion(0.7071068, 0, 0, -0.7071067);
		layaMonkey.transform.translate(new Laya.Vector3(5, 3, 13));


		//使用精灵
		var sp = Laya.Loader.getRes("res/threeDimen/skinModel/LayaMonkey/LayaMonkey.lh");
		var layaMonkey2 = this.scene.addChild(sp) as Laya.MeshSprite3D;
		layaMonkey2.transform.localScale = new Laya.Vector3(4, 4, 4);
		layaMonkey2.transform.translate(new Laya.Vector3(-10, 13, 0));
	
		//使用精灵
		this.pangzi = Laya.Loader.getRes("res/threeDimen/skinModel/BoneLinkScene/PangZiNoAni.lh");
		this.scene.addChild(this.pangzi);
		this.pangzi.transform.localScale = new Laya.Vector3(4, 4, 4);
		this.pangzi.transform.translate(new Laya.Vector3(-20, 13, 0));
		//获取动画组件
		this.pangziAnimator = this.pangzi.getChildAt(0).getComponent(Laya.Animator) as Laya.Animator;

		var pangAni = Laya.Loader.getRes("res/threeDimen/skinModel/BoneLinkScene/Assets/Model3D/PangZi-Take 001.lani") as Laya.AnimationClip;
		//创建动作状态
		var state1 = new Laya.AnimatorState();
		//动作名称
		state1.name = "hello";
		//动作播放起始时间
		state1.clipStart = 0 / 581;
		//动作播放结束时间
		state1.clipEnd = 581 / 581;
		//设置动作
		state1.clip = pangAni;
		//设置动作循环
		state1.clip.islooping = true;
		//为动画组件添加一个动作状态
		this.pangziAnimator.addState(state1);
		//播放动作
		this.pangziAnimator.play("hello");

		//实例化前进按钮
		this.addButton(100, 100, 100, 40, "重置", function (e) {
			var elapsedTime: number = Laya.timer.delta;
			var scale: Laya.Vector3 = new Laya.Vector3(1.11 * elapsedTime, 1.11 * elapsedTime, 1.11 * elapsedTime);
			// this.pangzi.transform.localScale = scale;
			// camera.transform.translate(new Laya.Vector3(3, 20, 47));
			// this.camera.transform.rotate(new Laya.Vector3(0, 0, 0), true, false);
			this.camera.transform.lookAt(this.pangzi.transform.position, new Laya.Vector3(0, 0, 0));
		});

		//实例化前进按钮
		this.addButton(500, 300, 100, 40, "上升", function (e) {
			var elapsedTime: number = Laya.timer.delta;
			console.log(e);
			this._tempVector3 = { x: 0, y: 0, z: -0.17 };
			this._tempVector3.x = this._tempVector3.z = 0;
			this._tempVector3.y = 0.11 * elapsedTime;
			camera.transform.translate(this._tempVector3);



		});
		//实例化前进按钮
		this.addButton(500, 350, 100, 40, "下降", function (e) {
			var elapsedTime: number = Laya.timer.delta;
			console.log(e);
			this._tempVector3 = { x: 0, y: 0, z: -0.17 };
			this._tempVector3.x = this._tempVector3.z = 0;
			this._tempVector3.y = -0.11 * elapsedTime;
			camera.transform.translate(this._tempVector3);



		});

		//实例化前进速率按钮
		var input: TextInput = new Laya.TextInput();
		input.prompt = '速率:';
		input.size(100, 100);
		input.x = 200;
		input.y = 100;

		input.fontSize = 30;
		input.bold = true;
		input.color = "#FFFFFF";

		Laya.stage.addChild(input);

		//转动视角
		const Text = Laya.Text;

				//转动视角
				
				var txt1 = new Text();
				Laya.stage.addChild(txt1);
				txt1.on(Laya.Event.MOUSE_DOWN, this, this.mouseDown);
				txt1.on(Laya.Event.MOUSE_UP, this, this.mouseUp);
				txt1.text = "转动视角转动视角转动视角转动视角转动视角转动视角转动视角转动视角";
				txt1.width = 600;
				txt1.height = 600;
				txt1.name= "view";
				txt1.fontSize = 40;
				txt1.color = "#ffffff";
				// 设置文本是否自动换行
				txt1.wordWrap = true;
				txt1.x = Laya.stage.width - txt1.textWidth >> 1;
				txt1.y = Laya.stage.height - txt1.textHeight >> 1;
	}

	//安义按钮方法
	private addButton(x: number, y: number, width: number, height: number, text: string, clickFun: Function): void {
		Laya.loader.load(["res/threeDimen/ui/button.png"], Laya.Handler.create(this, function () {
			var changeActionButton: Laya.Button = Laya.stage.addChild(new Laya.Button("res/threeDimen/ui/button.png", text)) as Laya.Button;
			changeActionButton.size(width, height);
			changeActionButton.labelBold = true;
			changeActionButton.labelSize = 30;
			changeActionButton.sizeGrid = "4,4,4,4";
			changeActionButton.scale(Laya.Browser.pixelRatio, Laya.Browser.pixelRatio);
			changeActionButton.pos(x, y);
			changeActionButton.on(Laya.Event.MOUSE_DOWN, this, clickFun);
		}));
	}

	//轮盘代码

	mouseDown(e) {
		console.log(e);
		if(e.target.name == "view"){
			this.move = 0; 
		}else{
			this.move = 1; 
		}
		this.direction.pos(Laya.stage.mouseX, Laya.stage.mouseY);
		this.direction.graphics.drawCircle(0, 0, 5, "#0000ff");
		this.round.graphics.drawCircle(Laya.stage.mouseX, Laya.stage.mouseY, 25, "#00ffff");
		this.round.graphics.drawCircle(Laya.stage.mouseX, Laya.stage.mouseY, 3, "#ffffff");
		this.centerX = Laya.stage.mouseX;
		this.centerY = Laya.stage.mouseY;
		Laya.stage.on(Laya.Event.MOUSE_MOVE, this, this.mouseMove);
	}

	mouseUp() {
		Laya.stage.off(Laya.Event.MOUSE_MOVE, this, this.mouseMove);
		this.speed = 0;
		this.round.graphics.clear();
		this.direction.graphics.clear();
	}


	mouseMove(e: MouseEvent) {
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
				this.speed = 100;  //此处还可以通过距离 控制速度
			} else {
				this.speed = 0;
			}

		}
	}

	heroMove() {
		if (this.speed > 0) {
			let dx: number = Laya.stage.mouseX - this.centerX;
			let dy: number = Laya.stage.mouseY - this.centerY;
			this.angle = Math.atan2(dy, dx);

			// this.hero.x += Math.cos(this.angle) * this.speed;
			// this.hero.y += Math.sin(this.angle) * this.speed;

			// var elapsedTime:number = Laya.timer.delta;

			var _tempVector3 = { x: Math.cos(this.angle) * this.speed, y: 0, z: Math.sin(this.angle) * this.speed };
			// _tempVector3.x = _tempVector3.z = 0;
			// _tempVector3.y = -0.11 * elapsedTime;
			if(this.move == 1){
			
				this.camera.transform.translate(_tempVector3);
			}else{
				
				this.camera.transform.rotate(new Laya.Vector3(-Math.sin(this.angle) * this.speed, -Math.cos(this.angle) * this.speed, 0), true, false);
				// todo
				// Laya.Quaternion.createFromYawPitchRoll(this.yawPitchRoll.x, this.yawPitchRoll.y, this.yawPitchRoll.z, this.tempRotationZ);
				// this.tempRotationZ.cloneTo(this.camera.transform.localRotation);
				// this.camera.transform.localRotation = this.camera.transform.localRotation;
			}
		
			

		}
	}

	dis(centerX, centerY, mouseX, mouseY) {
		let dx: number = centerX - mouseX;
		let dy: number = centerY - mouseY;
		let distance: number = Math.sqrt(dx * dx + dy * dy);
		return distance;
	}
}





//激活启动类
new LoadResourceDemo();