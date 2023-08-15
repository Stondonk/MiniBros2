
const canvas = document.getElementById("GameArea");
const ctx = canvas.getContext("2d");
import {DeltaTime, cameraX, cameraY, cameraIntX, cameraIntY, drawImage, Inputs, lerp, LevelX, DEG2RAD, RAD2DEG, clamp,MoveCamTarget, magnitude,MasterArrayLevelSize, EntityImage, boxbox, LoadLevelTransition} from "../index.js";
import player from "./Player.js";
import RagDoll from "./RagDoll.js";

export default class GoalOBJ{
    constructor(){
        this.position = {
            x : 20,
            y : -4,
            z : 2,
        }
        this.velocity = {
            x : 0,
            y : 0,
        }
        this.SelfDraw = false;
        this.ID = "Goal";
        this.angle = 0;
        this.width = 8
        this.height = 16;
        this.sprite = EntityImage;
        this.spriteOffsetX = 0;
        this.spriteOffsetY = 11;
        this.SpriteTweakX = 0;
        this.SpriteTweakY = 0;
        this.HoldSprite = false;
        this.SpriteWidth = 8;
        this.SpriteHeight = 16;
        this.SpriteScaleX = 1;
        this.SpriteScaleY = 1;
        this.SpriteHeightOffset = 0;
        this.HasCollision = false;
        this.NoPickUpCol = true;
        this.ChangePickUp = true;
        this.LoadLevel = "Menu";
        this.MouthOpen = 0;
        this.OpenDoor = false;

        this.CheckTextureValue = 2;
        this.Direction = -1;

        this.CollisionYPoint = 0;
        this.HasHitForY = false;

        this.Gravity = 120;

        this.Ended = false;
    }
    #image(fileName) {
        const img = new Image();
        img.src = `images/${fileName}`;
        return img;
    }
    Draw(){
        //ctx.fillRect((Math.round(this.position.x - cameraIntX - (this.SpriteWidth / 2) * this.SpriteScaleX)),Math.round((this.position.y - cameraIntY - (this.SpriteHeight / 2) * this.SpriteScaleY)), this.SpriteWidth * this.SpriteScaleX, this.SpriteHeight * this.SpriteScaleY);
        ctx.fillStyle = "#1a1c2c";
        ctx.fillRect(Math.round(this.position.x - cameraIntX + (this.SpriteWidth / 2) - 2), Math.round((this.position.y - cameraIntY + ((this.SpriteHeight* 0.75) / 2) * this.SpriteScaleY) + this.SpriteHeightOffset + this.SpriteTweakY - (this.MouthOpen / 2)), 2, Math.round((this.MouthOpen * this.SpriteScaleY) + 1));
        drawImage(ctx,this.sprite,0,104, this.SpriteWidth, this.SpriteHeight * 0.75, (Math.round(this.position.x - cameraIntX - (this.SpriteWidth / 2) * this.SpriteScaleX) + this.SpriteTweakX),Math.round((this.position.y - cameraIntY - ((this.SpriteHeight* 0.75) / 2) * this.SpriteScaleY) + this.SpriteHeightOffset + this.SpriteTweakY - (this.MouthOpen / 2)), this.SpriteWidth * this.SpriteScaleX, (this.SpriteHeight* 0.75) * this.SpriteScaleY,this.angle);
        drawImage(ctx,this.sprite,0,104 + (this.SpriteHeight * 0.75), this.SpriteWidth, this.SpriteHeight * 0.25, (Math.round(this.position.x - cameraIntX - (this.SpriteWidth / 2) * this.SpriteScaleX) + this.SpriteTweakX),Math.round((this.position.y - cameraIntY - ((this.SpriteHeight* 0.25) / 2) * this.SpriteScaleY + (this.SpriteHeight * 0.5)) + this.SpriteHeightOffset + this.SpriteTweakY + (this.MouthOpen / 2)), this.SpriteWidth * this.SpriteScaleX, (this.SpriteHeight* 0.25) * this.SpriteScaleY,this.angle);
    }
    Update(){
        //this.velocity.x = lerp(this.velocity.x, 0, 2 * DeltaTime);
        this.OpenDoor = false;
        for (let index = 0; index < window.Players.length; index++) {
            const Current = window.Players[index];
            if(Current.ID == "Player"){
                if(magnitude(Current.position.x - this.position.x, Current.position.y - this.position.y) < 20)
                    this.OpenDoor = true;

                if(boxbox(this.position.x - (this.width/2), this.position.y - (this.width/2), this.position.x + (this.width/2), this.position.y + (this.width/2),Current.position.x - (Current.width / 2), Current.position.y - (Current.height / 2), Current.position.x + (Current.width / 2), Current.position.y + (Current.height / 2)) && this.Ended == false){
                    var rt = new RagDoll();
                    rt.position.x = Current.position.x;
                    rt.position.y = this.position.y + (this.MouthOpen / 2);
                    rt.sprite = Current.sprite;
                    rt.spriteOffsetX = 0;
                    rt.spriteOffsetY = (Current.spriteOffsetLayer) * Current.SpriteHeight + (Current.CharacterSkin *( Current.SpriteHeight * 2));
                    rt.SpriteWidth = 8;
                    rt.SpriteHeight = 8;
                    rt.SpritelockStart = 0;
                    rt.SpritelockLength = 1;
                    rt.position.z = -1;
                    rt.velocity.x = -10 * this.Direction;
                    rt.Gravity = 0;
                    rt.Drag = false;
                    //rt.velocity.x = this.Direction * 100;
                    rt.width = this.width;
                    rt.height = this.height;
                    window.Players.push(rt);
                    LoadLevelTransition(this.LoadLevel + ".lvl", 2);
                    window.KillList.push(window.Players[index]);
                    
                    this.Ended = true;
                }
            }
        }

        if(this.OpenDoor)
            this.MouthOpen = lerp(this.MouthOpen, 10, 6 *DeltaTime);
        else
            this.MouthOpen = lerp(this.MouthOpen, 0, 2 *DeltaTime);

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