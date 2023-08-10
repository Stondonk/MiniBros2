
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
        this.ID = "Picktop";

    }
    #image(fileName) {
        const img = new Image();
        img.src = `images/${fileName}`;
        return img;
    }
    Draw(){
        drawImage(ctx,this.sprite,this.spriteOffsetX * this.SpriteWidth,this.spriteOffsetY * this.SpriteHeight, this.SpriteWidth, this.SpriteHeight, (Math.round(this.position.x - cameraIntX - (this.SpriteWidth / 2) * this.SpriteScale)),Math.round((this.position.y - cameraIntY - (this.SpriteHeight / 2) * this.SpriteScale) + this.SpriteHeightOffset), this.SpriteWidth * this.SpriteScale, this.SpriteHeight * this.SpriteScale,this.angle);
    }
    CollisionDect(){
        
    }
    Update(){
        this.velocity.x = lerp(this.velocity.x, 0, 2 * DeltaTime);
        this.velocity.y += this.Gravity * DeltaTime;

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