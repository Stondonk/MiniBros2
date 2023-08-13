
const canvas = document.getElementById("GameArea");
const ctx = canvas.getContext("2d");
import {DeltaTime, cameraX, cameraY, cameraIntX, cameraIntY, drawImage, Inputs, lerp, LevelX, DEG2RAD, RAD2DEG, clamp,MoveCamTarget, magnitude,MasterArrayLevelSize, EntityImage, boxbox} from "../index.js";
import player from "./Player.js";

export default class PickUpOBJ{
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
        this.SelfDraw = false;
        this.ID = "Pickup";
        this.CanBePickedUp = true;
        this.RideAble = false;
        this.angle = 0;
        this.width = 8
        this.height = 8;
        this.sprite = EntityImage;
        this.spriteOffsetX = 0;
        this.spriteOffsetY = 11;
        this.SpriteTweakX = 0;
        this.SpriteTweakY = 0;
        this.HoldSprite = false;
        this.SpriteWidth = 8;
        this.SpriteHeight = 8;
        this.SpriteScaleX = 1;
        this.SpriteScaleY = 1;
        this.SpriteHeightOffset = 0;
        this.HasCollision = false;
        this.NoPickUpCol = true;
        this.Throw = false;
        this.ChangePickUp = true;

        this.CollisionYPoint = 0;
        this.HasHitForY = false;

        this.Gravity = 120;
    }
    #image(fileName) {
        const img = new Image();
        img.src = `images/${fileName}`;
        return img;
    }
    Draw(){
        //ctx.fillRect((Math.round(this.position.x - cameraIntX - (this.SpriteWidth / 2) * this.SpriteScaleX)),Math.round((this.position.y - cameraIntY - (this.SpriteHeight / 2) * this.SpriteScaleY)), this.SpriteWidth * this.SpriteScaleX, this.SpriteHeight * this.SpriteScaleY);
        drawImage(ctx,this.sprite,this.spriteOffsetX * this.SpriteWidth,this.spriteOffsetY * this.SpriteHeight, this.SpriteWidth, this.SpriteHeight, (Math.round(this.position.x - cameraIntX - (this.SpriteWidth / 2) * this.SpriteScaleX) + this.SpriteTweakX),Math.round((this.position.y - cameraIntY - (this.SpriteHeight / 2) * this.SpriteScaleY) + this.SpriteHeightOffset + this.SpriteTweakY), this.SpriteWidth * this.SpriteScaleX, this.SpriteHeight * this.SpriteScaleY,this.angle);
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
            //this.fHorizontal = this.velocity.x;
        }
        if(hasHitY)
        {
            this.CollisionYPoint = (CurrentOneY);
            this.HasHitForY = true;
            this.velocity.y = 0;
        }
        if(hasHitX && hasHitY){
            var offit = 0.1;
            if(this.position.y < CurrentOneY)
                offit = -0.1;
            this.position.y -= offit;
        }
    }
    EntityCollision(){
        const HalfWidth = this.width / 2, HalfHeight = this.height / 2;
        const CornerX = this.position.x - HalfWidth, CornerY = this.position.y - HalfHeight;
        var CurrentOneX = this.position.x;
        var CurrentOneY = this.position.y;
        var CurrentVx = 0, CurrentVy = 0;
        var hasHitX = false, hasHitY = false;
        for (let index = 0; index < window.Players.length; index++) {
            const Current = window.Players[index];
            if(Current.RideAble == true){
                var CurrentX = Current.position.x - Current.width / 2, CurrentY = Current.position.y - Current.height / 2;
                
                if (CornerY + this.height + (this.velocity.y * DeltaTime) + 1 >= CurrentY && CornerY + this.height + (this.velocity.y * DeltaTime) + 1 <= CurrentY + 2 && CornerX + this.width >= CurrentX && CornerX <= CurrentX + Current.width && this.velocity.y >= 0){
                    if(hasHitY){
                        if(Math.pow(CurrentY - this.position.y, 2) < Math.pow(CurrentOneY - this.position.y, 2))
                            {CurrentOneY = CurrentY - 0.1 - (this.height / 2); hasHitY = true; CurrentVx = Current.velocity.x; CurrentVy = Current.velocity.y;}
                    }else{
                        CurrentOneY = CurrentY - 0.1 - (this.height / 2);
                        CurrentVx = Current.velocity.x;
                        CurrentVy = Current.velocity.y;
                        hasHitY = true;
                    }
                }
                
            }
            
        }
        if(hasHitY)
        {
            this.CollisionYPoint = (CurrentOneY);
            this.HasHitForY = true;
            this.velocity.HiddenX = CurrentVx;


                this.velocity.y = 0;
        }
    }
    Update(){
        //this.velocity.x = lerp(this.velocity.x, 0, 2 * DeltaTime);
        if(this.Throw){
            if(!this.HasCollision)
                this.velocity.y += this.Gravity * DeltaTime;
            else{
                if(Math.round(this.velocity.x / 2) == 0)
                    this.Throw = false;
            }
            this.Attack();
        }

        if(this.ChangePickUp){
            if(this.HoldSprite){
                this.spriteOffsetY = 11;this.SpriteTweakY = 0;}
            else{
                this.spriteOffsetY = 10;this.SpriteTweakY = -4;}
        }
        this.HasHitForY = false;

        if(this.HasCollision && this.NoPickUpCol){
            this.velocity.x = lerp(this.velocity.x, 0, 2 * DeltaTime);
            this.velocity.y += this.Gravity * DeltaTime;
            this.EntityCollision();
            this.CollisionDect();
            this.RideAble = true;
        }else if(this.HasCollision && !this.NoPickUpCol){
            this.RideAble = false;
        }

        if(this.HasHitForY)
            this.position.y = this.CollisionYPoint;

        this.position.x += this.velocity.x * DeltaTime;
        this.position.y += this.velocity.y * DeltaTime;
    }
    Attack(){
        for (let index = 0; index < window.Players.length; index++) {
            const Current = window.Players[index];
            if(Current.ID == "Enemy"){
                if(boxbox(this.position.x - (this.width / 2), this.position.y - (this.height / 2), this.position.x + (this.width / 2), this.position.y + (this.height / 2) + 2, Current.position.x - (Current.width / 2), Current.position.y - (Current.height / 2), Current.position.x + (Current.width / 2), Current.position.y + (Current.height / 2)) == true){
                    Current.Damage(1,this.position.x,this.position.y);
                    this.velocity.y = -10;
                    
                }
            }
            
        }
    }
    Damage(){

    }
    Death(){
        window.KillList.push(this);
    }

}