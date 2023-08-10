
const canvas = document.getElementById("GameArea");
const ctx = canvas.getContext("2d");
import {DeltaTime, cameraX, cameraY, cameraIntX, cameraIntY, drawImage, Inputs, lerp, LevelX, DEG2RAD, RAD2DEG, clamp,MoveCamTarget, magnitude,MasterArrayLevelSize, EntityImage} from "../index.js";
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
        this.Throw = false;

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
        
    }
    Update(){
        //this.velocity.x = lerp(this.velocity.x, 0, 2 * DeltaTime);
        if(this.Throw)
            this.velocity.y += this.Gravity * DeltaTime;

        if(this.HoldSprite){
            this.spriteOffsetY = 11;this.SpriteTweakY = 0;}
        else{
            this.spriteOffsetY = 10;this.SpriteTweakY = -4;}

        this.CollisionDect();
        this.position.x += this.velocity.x * DeltaTime;
        this.position.y += this.velocity.y * DeltaTime;
    }
    Damage(){

    }
    Death(){
        window.KillList.push(this);
    }

}