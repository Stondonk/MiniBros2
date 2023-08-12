
const canvas = document.getElementById("GameArea");
const ctx = canvas.getContext("2d");
import {DeltaTime, cameraX, cameraY, cameraIntX, cameraIntY, drawImage, Inputs, lerp, LevelX, DEG2RAD, RAD2DEG, clamp,MoveCamTarget, magnitude,MasterArrayLevelSize} from "../index.js";
import player from "./Player.js";

export default class RagDoll{
    constructor(){
        this.position = {
            x : 20,
            y : -4,
            z : 0,
        }
        this.velocity = {
            x : 0,
            y : 0,
        }
        this.ID = "RagDoll";
        this.Gravity = 200;
        this.FixedPlace = false;
        this.LockRangeT = false;
        this.TargetFollow;
        this.TimebtwShot = 0;
        this.shootSpeed = 75;
        this.lockTarget = null;
        this.ForwardX = 0;
        this.ForwardY = 0;
        this.angle = 0;
        this.TurnSpeed = 200;
        this.width = 11;
        this.height = 7;
        this.speed = 24; //700 ish and it can break though pixel gaps
        this.fSpeed = 0;
        this.spriteOffsetX =0;
        this.spriteOffsetY =0;
        //this.sprite = MasterImage; //this.#image("Brian.png");
        this.SpriteWidth = 16;
        this.SpriteHeight = 16;
        this.SpriteHeightOffset = -3;
        this.SpriteScaleX = 1;
        this.SpriteScaleY = 1;

        this.SpritePos = 0;
        this.SpritelockStart = 0;
        this.SpritelockLength = 0;
        this.AnimTick = 0;
        this.AnimSpeed = 1;

        this.Collision = false;

        this.started =false;
        this.LifeTime = 0;
        this.StartLifeTime = 0;
    }
    #image(fileName) {
        const img = new Image();
        img.src = `images/${fileName}`;
        return img;
    }
    start(){
        this.StartLifeTime = this.LifeTime;
        this.started = true;
    }
    Draw(){
        drawImage(ctx,this.sprite,this.spriteOffsetX * this.SpriteWidth,this.spriteOffsetY * this.SpriteHeight, this.SpriteWidth, this.SpriteHeight, (Math.round(this.position.x - cameraIntX - (this.SpriteWidth / 2) * this.SpriteScaleX)),Math.round((this.position.y - cameraIntY - (this.SpriteHeight / 2) * this.SpriteScaleY)), this.SpriteWidth * this.SpriteScaleX, this.SpriteHeight * this.SpriteScaleY,this.angle);
    }
    CollisionDect(){
        const HalfWidth = this.width / 2, HalfHeight = this.height / 2;
        const CornerX = this.position.x - HalfWidth, CornerY = this.position.y - HalfHeight;
        var CurrentOneX = this.position.x;
        var CurrentOneY = this.position.y;
        var hasHitX = false, hasHitY = false;
        for (let index = 0; index < Math.floor((LevelX.length) / MasterArrayLevelSize); index++) {
            const indev = index * MasterArrayLevelSize;


            if(LevelX[indev + 5] == 0){
                if (CornerX + this.velocity.x * DeltaTime >= LevelX[indev] - this.width && CornerX + this.velocity.x * DeltaTime <= LevelX[indev] + LevelX[indev + 2]  && CornerY + this.height >= LevelX[indev+1] && CornerY <= LevelX[indev+1] + LevelX[indev + 3]) {
                    var Cxp = this.position.x;
                    if(hasHitX){
                        if(Math.pow(LevelX[indev]- this.position.x, 2) < Math.pow(LevelX[indev] + (LevelX[indev + 2]) - this.position.x, 2)){
                            if(Math.pow(LevelX[indev]- this.position.x, 2) < Math.pow(CurrentOneX - this.position.x, 2))
                                CurrentOneX = LevelX[indev] - (this.width / 2) - 0.1;
                        }else{
                            if(Math.pow(LevelX[indev] + (LevelX[indev + 2])- this.position.x, 2) < Math.pow(CurrentOneX - this.position.x, 2))
                                CurrentOneX = LevelX[indev] + LevelX[indev + 2] + (this.width / 2) + 0.1;
                        }
                        if (CornerX + this.width < LevelX[indev] && CornerX  > LevelX[indev] + LevelX[indev + 2] ) {
                            this.velocity.x = 0;
                        }
                    }else{
                        if(Math.pow(LevelX[indev]- this.position.x, 2) < Math.pow(LevelX[indev] + (LevelX[indev + 2]) - this.position.x, 2))
                            CurrentOneX = LevelX[indev] - (this.width / 2) - 0.1;
                        else
                            CurrentOneX = LevelX[indev] + (LevelX[indev + 2]) + (this.width / 2) + 0.1;
                        hasHitX = true;
                    }
                }
    
                if ((CornerY + this.velocity.y * DeltaTime >= LevelX[indev + 1] - this.height && CornerY + this.velocity.y * DeltaTime <= LevelX[indev + 1] + LevelX[indev + 3] && CornerX + this.width >= LevelX[indev] && CornerX <= LevelX[indev] + LevelX[indev + 2]) || (CornerY >= LevelX[indev + 1] - this.height && CornerY <= LevelX[indev + 1] + LevelX[indev + 3] && CornerX + this.width >= LevelX[indev] && CornerX <= LevelX[indev] + LevelX[indev + 2])) {
                    var Cyp = this.position.y;
                    if(hasHitY){
                        if(Math.pow(LevelX[indev + 1]- this.position.y, 2) < Math.pow(LevelX[indev+ 1] + (LevelX[indev + 3]) - this.position.y, 2)){
                            if(Math.pow(LevelX[indev+ 1]- this.position.y, 2) < Math.pow(CurrentOneY - this.position.y, 2))
                                CurrentOneY = LevelX[indev+ 1] - (this.height / 2) - 0.1;
                        }else{
                            if(Math.pow(LevelX[indev+ 1] + (LevelX[indev + 3])- this.position.y, 2) < Math.pow(CurrentOneY - this.position.y, 2))
                                CurrentOneY = LevelX[indev+ 1] + LevelX[indev + 3] + (this.height / 2) +0.1;
                        }
                        if (CornerY + this.height  < LevelX[indev + 1] && CornerY  > LevelX[indev + 1] + LevelX[indev + 3]) {
                            this.velocity.y = 0;
                        }
                    }else{
                        if(Math.pow(LevelX[indev+1]- this.position.y, 2) < Math.pow(LevelX[indev+1] + (LevelX[indev + 3]) - this.position.y, 2))
                            CurrentOneY = LevelX[indev+1] - (this.height / 2) - 0.1;
                        else
                            CurrentOneY = LevelX[indev+1] + (LevelX[indev + 3]) + (this.height / 2) + 0.1;
                        hasHitY = true;
                    }
                }

                //ground
            
                if (CornerY + (this.velocity.y * DeltaTime) + 1 >= LevelX[indev + 1] - this.height && CornerY + (this.velocity.y * DeltaTime) <= LevelX[indev + 1] + LevelX[indev + 3] - this.height && CornerX + this.width >= LevelX[indev] && CornerX <= LevelX[indev] + (LevelX[indev + 2])){
                    this.isGrounded = true;
                }
            }
            else if(LevelX[indev + 5] == 1){
                if (CornerY + (this.velocity.y * DeltaTime) + 1 >= LevelX[indev + 1] - this.height && CornerY + (this.velocity.y * DeltaTime) <= LevelX[indev + 1] + LevelX[indev + 3] - this.height && CornerX + this.width >= LevelX[indev] && CornerX <= LevelX[indev] + (LevelX[indev + 2]) && this.velocity.y >= 0){
                    this.isGrounded = true;
                    if(LevelX[indev + 1] < CurrentOneY && hasHitY){
                        CurrentOneY = LevelX[indev + 1] - (this.height / 2) - 0.1;
                    }else if(!hasHitY){
                        CurrentOneY = LevelX[indev + 1] - (this.height / 2) - 0.1;
                        hasHitY = true;
                    }
                }
            }
            
        }
        if(hasHitX)
        {
            this.position.x = (CurrentOneX);
            this.velocity.x = 0;
            this.fHorizontal = this.velocity.x;
        }
        if(hasHitY)
        {
            this.position.y = (CurrentOneY);
            this.velocity.y = 0;
        }
        if(hasHitX && hasHitY){
            var offit = 0.1;
            if(this.position.y < CurrentOneY)
                offit = -0.1;
            this.position.y -= offit;
        }
    }
    Animation(){
        //Bad way of doing it I know but what you gonna do about huh, yeah joe I know your looking hear get out shoo
        //flipSprite  
        if(this.SpritelockLength > 0){
            this.AnimTick += DeltaTime;
            if(this.AnimTick >= 0.125 * (1 / this.AnimSpeed)){
                this.SpritePos+=1; this.AnimTick = 0;}

            if(this.SpritePos >= this.SpritelockStart + this.SpritelockLength)
                this.SpritePos = this.SpritelockStart;
            else if(this.SpritePos < this.SpritelockStart)
                this.SpritePos = this.SpritelockStart;
        }
        else if(this.SpritelockLength == 0)
            this.SpritePos = this.SpritelockStart;


        this.spriteOffsetX = this.SpritePos;
    }
    Update(){
        if(!this.started)
            this.start();
        this.velocity.x = lerp(this.velocity.x, 0, 2 * DeltaTime);
        this.velocity.y += this.Gravity * DeltaTime;

        if(this.Collision == true)
            this.CollisionDect();
        if(this.SpritelockLength > 1)
            this.Animation();

        if(this.LifeTime <= 0 && this.StartLifeTime != 0)
            this.Death();
        if(this.LifeTime > 0)
            this.LifeTime -= DeltaTime;

        this.position.x += this.velocity.x * DeltaTime;
        this.position.y += this.velocity.y * DeltaTime;
    }
    Damage(){

    }
    Death(){
        window.KillList.push(this);
    }

}