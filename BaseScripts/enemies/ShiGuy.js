
const canvas = document.getElementById("GameArea");
const ctx = canvas.getContext("2d");
import {DeltaTime, cameraX, cameraY, cameraIntX, cameraIntY, drawImage, Inputs, lerp, LevelX, DEG2RAD, RAD2DEG, clamp,MoveCamTarget, magnitude,MasterArrayLevelSize, EntityImage, pointbox, PlaySound, boxbox} from "../../index.js";
import player from "../Player.js";
import PickUpOBJ from "../FloorVeg.js";
import RagDoll from "../RagDoll.js";

export default class ShiGuy{
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
        this.ID = "Enemy";
        this.Health = 1;
        this.timebtwHits = 0;
        this.timeForHits = 0.25;
        this.RideAble = true;
        this.CanBePickedUp = true;
        this.angle = 0;
        this.width = 8
        this.height = 8;
        this.sprite = EntityImage;
        this.spriteOffsetX = 0;
        this.spriteOffsetY = 4;
        this.spriteDirOff = 0;
        this.SpriteTweakX = 0;
        this.SpriteTweakY = 0;
        this.HoldSprite = false;
        this.SpriteWidth = 8;
        this.SpriteHeight = 8;
        this.SpriteScaleX = 1;
        this.SpriteScaleY = 1;
        this.SpriteHeightOffset = 0;
        this.HasCollision = true;
        this.Throw = false;

        this.Direction = 1;
        this.Speed = 20;

        this.Gravity = 120;
    }
    #image(fileName) {
        const img = new Image();
        img.src = `images/${fileName}`;
        return img;
    }
    Draw(){
        //ctx.fillRect((Math.round(this.position.x - cameraIntX - (this.SpriteWidth / 2) * this.SpriteScaleX)),Math.round((this.position.y - cameraIntY - (this.SpriteHeight / 2) * this.SpriteScaleY)), this.SpriteWidth * this.SpriteScaleX, this.SpriteHeight * this.SpriteScaleY);
        if(Math.round(this.timebtwHits * 10)%2==0)
            drawImage(ctx,this.sprite,this.spriteOffsetX * this.SpriteWidth,(this.spriteOffsetY + this.spriteDirOff) * this.SpriteHeight, this.SpriteWidth, this.SpriteHeight, (Math.round(this.position.x - cameraIntX - (this.SpriteWidth / 2) * this.SpriteScaleX) + this.SpriteTweakX),Math.round((this.position.y - cameraIntY - (this.SpriteHeight / 2) * this.SpriteScaleY) + this.SpriteHeightOffset + this.SpriteTweakY), this.SpriteWidth * this.SpriteScaleX, this.SpriteHeight * this.SpriteScaleY,this.angle);
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
    Update(){
        //this.velocity.x = lerp(this.velocity.x, 0, 2 * DeltaTime);
        this.velocity.y += this.Gravity * DeltaTime;
        this.spriteDirOff = Math.round((-this.Direction + 1) / 2);
        if(this.HoldSprite){
            var newSpawnTr = new PickUpOBJ();
            newSpawnTr.position.x = this.position.x;
            newSpawnTr.position.y = this.position.y;
            newSpawnTr.velocity.x = this.velocity.x;
            newSpawnTr.velocity.y = this.velocity.y;
            newSpawnTr.spriteOffsetX = this.spriteOffsetX;
            newSpawnTr.spriteOffsetY = this.spriteOffsetY + this.spriteDirOff;
            newSpawnTr.ChangePickUp = false;
            //newSpawnTr.Throw = true;
            for (let index = 0; index < window.Players.length; index++) {
                if(window.Players[index].ID == "Player"){
                    if(window.Players[index].PickUpOBJ == this)
                    window.Players[index].PickUpOBJ = newSpawnTr;
                }
            }
            window.Players.push(newSpawnTr);
            window.KillList.push(this);
        }else{
            this.velocity.x = lerp(this.velocity.x, this.Speed * this.Direction, 8 * DeltaTime);
            this.Attack();

            for (let index = 0; index < Math.floor((LevelX.length) / MasterArrayLevelSize); index++) {
                const indev = index * MasterArrayLevelSize;
                if(LevelX[indev + 5] == 0){
                    if(pointbox(this.position.x + (this.Direction * 5), this.position.y, LevelX[indev], LevelX[indev+1], LevelX[indev] + LevelX[indev+2],LevelX[indev + 1] + LevelX[indev + 3])){
                        this.Direction = -this.Direction;
                    }
                }
            }
            for (let index = 0; index < window.Players.length; index++) {
                const current = window.Players[index];
                if(current.ID == "Enemy"){
                    if(pointbox(this.position.x + (this.Direction * 5), this.position.y, current.position.x - (current.width / 2), current.position.y - (current.height / 2), current.position.x + (current.width / 2), current.position.y + (current.height / 2))){
                        this.Direction = -this.Direction;
                    }
                }
            }
        }

        if(this.timebtwHits > 0){
            this.timebtwHits -= DeltaTime;
        }

        if(this.HasCollision)
            this.CollisionDect();
        this.position.x += this.velocity.x * DeltaTime;
        this.position.y += this.velocity.y * DeltaTime;
    }
    Attack(){
        for (let index = 0; index < window.Players.length; index++) {
            const Current = window.Players[index];
            if(Current.ID == "Player"){
                if(boxbox(this.position.x - (this.width / 2), this.position.y - (this.height / 4), this.position.x + (this.width / 2), this.position.y + (this.height / 4), Current.position.x - (Current.width / 2), Current.position.y - (Current.height / 2), Current.position.x + (Current.width / 2), Current.position.y + (Current.height / 2)) == true)
                    window.Players[index].Damage(1,this.position.x,this.position.y);
            }
        }
    }
    Damage(amount, x, y){
        if(this.timebtwHits <= 0){
            this.Health -= amount;
            //if(this.Health <= 0)
                //this.Death();
            this.velocity.x = clamp(this.position.x - x, -1, 1) * 100;
            if(this.Health <= 0)
                this.Death();
            
            this.timebtwHits = this.timeForHits;
        }
        //window.KillList.push(this);
    }
    Death(){
        var rt = new RagDoll();
        rt.position.x = this.position.x;
        rt.position.y = this.position.y;
        rt.sprite = this.sprite;
        rt.spriteOffsetX = 0;
        rt.spriteOffsetY = 12;
        rt.SpriteWidth = 8;
        rt.SpriteHeight = 8;
        rt.SpritelockStart = 0;
        rt.SpritelockLength = 4;
        rt.velocity.y = 0;
        rt.Gravity = 0;
        rt.LifeTime = 0.45;
        rt.width = this.width;
        rt.height = this.height;
        window.Players.push(rt);
        PlaySound("Throw1", 0.8, 1);
        window.KillList.push(this);
    }

}