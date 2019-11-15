// 程序入口
class GameMain{

    private round:Laya.Sprite; //控制圆
    private hero:Laya.Sprite; //人物

    private direction:Laya.Sprite; //方向圆

    private speed:number = 0;
    private angle:number;

    private centerX:number = -1;
    private centerY:number = -1;

    constructor()
    {
        Laya.init(1027,800);

        Laya.stage.on(Laya.Event.MOUSE_DOWN,this,this.mouseDown);
        Laya.stage.on(Laya.Event.MOUSE_UP,this,this.mouseUp);

        this.round = new Laya.Sprite;
        this.direction = new Laya.Sprite;
        
        this.hero = new Laya.Sprite;
        this.hero.graphics.drawPoly(Laya.stage.width/2, Laya.stage.height/2, [0, 100, 50, 0, 100, 100], "#ffff00");
        this.hero.pivot(50,50);

        Laya.stage.addChild(this.round);
        Laya.stage.addChild(this.direction);
        Laya.stage.addChild(this.hero);

        Laya.timer.frameLoop(1,this,this.heroMove);
    }

    mouseDown(){
        this.direction.pos(Laya.stage.mouseX,Laya.stage.mouseY);
        this.direction.graphics.drawCircle(0, 0, 5, "#0000ff");
        this.round.graphics.drawCircle(Laya.stage.mouseX, Laya.stage.mouseY, 25, "#00ffff");
        this.round.graphics.drawCircle(Laya.stage.mouseX, Laya.stage.mouseY, 3, "#ffffff");
        this.centerX = Laya.stage.mouseX;
        this.centerY = Laya.stage.mouseY;
        Laya.stage.on(Laya.Event.MOUSE_MOVE,this,this.mouseMove);
    }

    mouseUp(){
        Laya.stage.off(Laya.Event.MOUSE_MOVE,this,this.mouseMove);
        this.speed = 0;
        this.round.graphics.clear();
        this.direction.graphics.clear();
    }


    mouseMove(e:MouseEvent){
        if(this.centerX>=0&&this.centerY>=0){
            //计算两点距离 如果超过一定距离 就停留在距离最大值处
            let dis = this.dis(this.centerX,this.centerY,Laya.stage.mouseX,Laya.stage.mouseY);

            if(dis>20){
                this.direction.pos(this.centerX + Math.cos(this.angle)*20,this.centerY + Math.sin(this.angle)*20);
            }else{
                this.direction.pos(Laya.stage.mouseX,Laya.stage.mouseY);
            }

            //如果距离太小 就代表没动 
            if(dis>3){
                this.speed = 3;  //此处还可以通过距离 控制速度
            }else{
                this.speed = 0;
            }
            
        }
    }

    heroMove(){
        if(this.speed>0){
            let dx:number = Laya.stage.mouseX - this.centerX;
            let dy:number = Laya.stage.mouseY - this.centerY;
            this.angle = Math.atan2(dy,dx);

            this.hero.x += Math.cos(this.angle)*this.speed;
            this.hero.y += Math.sin(this.angle)*this.speed;
        }
    }

    dis(centerX,centerY,mouseX,mouseY){
        let dx:number = centerX - mouseX;
        let dy:number = centerY - mouseY;
        let distance:number = Math.sqrt(dx*dx+dy*dy);
        return distance;
    }
}
new GameMain();
