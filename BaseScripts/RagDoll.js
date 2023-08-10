
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
        this.SpriteScale = 1;
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
        const HalfWidth = this.width / 2, HalfHeight = this.height / 2;
        const CornerX = this.position.x - HalfWidth, CornerY = this.position.y - HalfHeight;

        for (let index = 0; index < Math.floor((LevelX.length) / MasterArrayLevelSize); index++) {
            const indev = index * MasterArrayLevelSize;


            if(LevelX[indev + 5] == 0){
                if (CornerX + this.velocity.x * DeltaTime >= LevelX[indev] - this.width && CornerX + this.velocity.x * DeltaTime <= LevelX[indev] + LevelX[indev + 2]  && CornerY + this.height >= LevelX[indev+1] && CornerY <= LevelX[indev+1] + LevelX[indev + 3]) {
                    var CurrentOneX = this.position.x;
                    var Cxp = this.position.x;
                    if (this.position.x < LevelX[indev] + (LevelX[indev + 2] / 2)) {
                        CurrentOneX = LevelX[indev] - HalfWidth - 0.1; Cxp = this.position.x + this.width;
                    }
                    else if (this.position.x > LevelX[indev] + (LevelX[indev + 2] / 2)) {
                        CurrentOneX = LevelX[indev] + HalfWidth + LevelX[indev + 2] + 0.1; Cxp = this.position.x;
                    }
                    if (CornerX + this.width < LevelX[indev] && CornerX  > LevelX[indev] + LevelX[indev + 2] ) {
                        this.velocity.x = 0;
                    }
                    else {
                        this.position.x = (CurrentOneX);
                        this.velocity.x = (this.position.x - CurrentOneX) / DeltaTime;
                        this.fHorizontal = this.velocity.x;
                    }
                }
    
                if (CornerY + this.velocity.y * DeltaTime >= LevelX[indev + 1] - this.height && CornerY + this.velocity.y * DeltaTime <= LevelX[indev + 1] + LevelX[indev + 3] && CornerX + this.width >= LevelX[indev] && CornerX <= LevelX[indev] + LevelX[indev + 2]) {
                    var CurrentOneY = this.position.y;
                    var Cyp = this.position.y;
                    if (this.position.y < LevelX[indev + 1] + (LevelX[indev + 3] / 2) ) {
                        CurrentOneY = LevelX[indev + 1] - HalfHeight - 0.1; Cyp = this.position.y + this.height;
                    }
                    else if (this.position.y > LevelX[indev + 1] + (LevelX[indev + 3] / 2)) {
                        CurrentOneY = LevelX[indev + 1] + HalfHeight + LevelX[indev + 3] + 0.1; Cyp = this.position.y;
                    }
                    if (CornerY + this.height  < LevelX[indev + 1] && CornerY  > LevelX[indev + 1] + LevelX[indev + 3]) {
                        this.velocity.y = 0;
                    }
                    else {
                        this.position.y = CurrentOneY;
                        this.velocity.y = (this.position.y - CurrentOneY) / DeltaTime;
                    
                    }
                }
            
                if (CornerY >= LevelX[indev + 1] - this.height && CornerY <= LevelX[indev + 1] + LevelX[indev + 3] && CornerX + this.width >= LevelX[indev] && CornerX <= LevelX[indev] + LevelX[indev + 2]) {
                    var Xp = 1;
                    var Yp = -1;
    
                    if(this.position.x > LevelX[indev] + (LevelX[indev + 2]) / 2)
                        Xp = -1;
                    if(this.position.y > LevelX[indev + 1] + (LevelX[indev + 3]) / 2)
                        Yp = 1;
                
                    this.position.y += Yp;
                }
            
                //ground
            
                if (CornerY + (this.velocity.y * DeltaTime) + 1 >= LevelX[indev + 1] - this.height && CornerY + (this.velocity.y * DeltaTime) <= LevelX[indev + 1] + LevelX[indev + 3] - this.height && CornerX + this.width >= LevelX[indev] && CornerX <= LevelX[indev] + (LevelX[indev + 2])){
                    this.isGrounded = true;
                }

                const wallcheck =  clamp(this.width * this.Direction, -1, this.width);

            //point check lazy but works
            }
            else if(LevelX[indev + 5] == 1){
                if (CornerY + (this.velocity.y * DeltaTime) + 1 >= LevelX[indev + 1] - this.height && CornerY + (this.velocity.y * DeltaTime) <= LevelX[indev + 1] + LevelX[indev + 3] - this.height && CornerX + this.width >= LevelX[indev] && CornerX <= LevelX[indev] + (LevelX[indev + 2]) && this.velocity.y >= 0){
                    this.isGrounded = true;
                    this.position.y = LevelX[indev + 1] - 0.1 - this.height / 2;
                    this.velocity.y = (this.position.y - (LevelX[indev + 1] - HalfHeight - 0.1)) / DeltaTime;
                }
            }
            
        }

        //Object dect

        /*
        for (let index = 0; index < window.Players.length; index++) {
            if(window.Players[index].ID == "Ramp" && this.position.z <= 0){
                var ObjxH = window.Players[index].width / 2, ObjyH = window.Players[index].height / 2;
                if (CornerX + this.width >= window.Players[index].position.x - ObjxH && CornerX <= window.Players[index].position.x + ObjxH && CornerY + this.height >= window.Players[index].position.y - ObjyH && CornerY <= window.Players[index].position.y + ObjyH)
                    this.velocity.z = 50;
            }
            
        }
        */
        
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