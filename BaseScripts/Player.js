
const canvas = document.getElementById("GameArea");
const ctx = canvas.getContext("2d");
import RagDoll from "./RagDoll.js";
import {DeltaTime, cameraX, cameraY, cameraIntX, cameraIntY, drawImage, Inputs, lerp, LevelX, DEG2RAD, RAD2DEG, clamp,MoveCamTarget, MouseX, MouseY, MasterArrayLevelSize, PlayerImage, lerpAngle, lineBlock, VeclineLine, magnitude, EntityImage, PlaySound, boxbox} from "../index.js";

export default class player{
    constructor(){
        this.position = {
            x : -16,
            y : 2,
            z : 1,
        }
        this.velocity = {
            x : 10,
            y : 0,
        }
        this.weapon = {
            sx : 8,
            sy : -2,
            bullets : 1,
            angle : 0,
            randomSpread : true,
            speed : 30,
            timeForShot : 0.2,
            timeForBullet : 0.4,
            Gravity : 0, //200 default
        }
        this.controller  = {
            x: {
                L:false,
                R:false,
                LastAxis:1,
                Axis: 0
            },
            y: {
                D:false,
                U:false,
                LastAxis:1,
                Axis: 0
            },
            a: {
                pressed: false
            },
            b: {
                pressed: false
            },
            c: {
                pressed: false
            },
            space: {
                pressed: false
            },
            enter:{
                pressed: false
            }
        };
        this.CanDoLoad = false;
        this.SelfDraw = true;
        this.Health = 3;
        this.ID = "Player";
        
        this.timebtwHits = 0;
        this.timebtwShots = 0;

        this.fHorizontal = 0;
        this.fVertical = 0;

        this.SpritePos = 0;
        this.SpritelockStart = 0;
        this.SpritelockLength = 0;
        this.AnimTick = 0;
        this.AnimSpeed = 1;

        this.JumpPressed = false;

        this.PressDirX = 0;
        this.PressDirY = 0;

        this.Direction = 1;
        
        this.angle = 0;
        this.lerpAngle = 0;
        this.width = 6;
        this.height = 8;
        this.speed = 400; //700 ish and it can break though pixel gaps
        this.topSpeed = 10;
        this.isGrounded = false;
        this.JumpForce = 100;
        this.Gravity = 200;

        this.Started = false;
        
        this.camOffX = 0;
        this.camOffY = -60;

        this.Duck = false;
        //for Audio reasons
        this.JustDuck = false;

        this.Running = false;

        this.Climbing = false;
        this.ClimbingPoint = {x:0,y:0};

        this.PickUpOBJ = null;
        this.PickUpPress = false;
        this.OffSPickUpX = 0;
        this.OffSPickUpY = 0;
        this.PickUpHoldTime = 0;

        this.Currentspeed = 1200;
        this.spriteOffset = 0;
        this.spriteOffsetLayer = 0;
        this.sprite = EntityImage;
        this.SpriteWidth = 8;
        this.SpriteHeight = 8;
        this.SpriteHeightOffset = 0;
        this.SpriteScaleX = 1;
        this.SpriteScaleY = 1;
        //Health interface
        this.ShowHealthTime = 3;
        this.floatRadius = 0;
        this.floatRadiusDistanceMult = 1;
        this.bgDim = 0.5;

        this.CharacterSkin = 0;
        this.WalkTiming = 0.2;
    }
    #image(fileName) {
        const img = new Image();
        img.src = `images/${fileName}`;
        return img;
    }
    Start(){
        if(this.CharacterSkin == 1)
            PlaySound("Luigi", 1, 1);
        MoveCamTarget(this.position.x - 32, )
        this.Started = true;
    }
    Draw(){

        //Draw Player Stuff
        ctx.fillStyle = "#c7f0d8";
        //ctx.fillRect(this.position.x + cameraX - (this.SpriteWidth / 2), this.position.y + cameraY - (this.SpriteHeight / 2), this.width, this.height);
        //ctx.drawImage(this.sprite,this.spriteOffset * this.SpriteWidth,this.spriteOffsetLayer * this.SpriteHeight, this.SpriteWidth, this.SpriteHeight, ((lockedx + cameraX)),(lockedy + cameraY), 128, 128);
        //ctx.setTransform(16, 0, 0, 16, this.position.x-16*16, this.position.y-16*16);
        //ctx.scale(4,4);
        if(Math.round(this.timebtwHits * 10)%2==0)
            drawImage(ctx,this.sprite,this.spriteOffset * this.SpriteWidth,(this.spriteOffsetLayer) * this.SpriteHeight + (this.CharacterSkin *( this.SpriteHeight * 2)), this.SpriteWidth, this.SpriteHeight, (Math.round(this.position.x - cameraIntX - (this.SpriteWidth / 2) * this.SpriteScaleX)),Math.round((this.position.y - cameraIntY - (this.SpriteHeight / 2) * this.SpriteScaleY) + this.SpriteHeightOffset), this.SpriteWidth * this.SpriteScaleX, this.SpriteHeight * this.SpriteScaleY,this.lerpAngle);
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
    Animation(){
        //Bad way of doing it I know but what you gonna do about huh, yeah joe I know your looking hear get out shoo
        //flipSprite
        this.spriteOffsetLayer = Math.round((-this.Direction + 1) / 2);
        this.OffSPickY = 0;

        if(this.isGrounded == false){
            this.SpritelockStart = 4;
            this.SpritelockLength = 1;
        }
        else if(Math.round(this.fHorizontal) < -1.1 || Math.round(this.fHorizontal) > 1.1){
            this.SpritelockStart = 0;
            this.SpritelockLength = 4;

            this.WalkTiming -=DeltaTime;
            if(this.WalkTiming <= 0)
                {
                    this.WalkTiming = 0.25; 
                    //PlaySound("WalkQuick", 1, 1 + ((Math.random() * 100) / 50));
                }
        }
        else{
            this.SpritelockStart = 0;
            this.SpritelockLength = 0;
            if(this.Duck){
                if(this.PickUpHoldTime <= 0){
                    this.SpritelockStart = 5;
                    this.SpritelockLength = 0;
                }if(this.PickUpHoldTime > 0){
                    //whenPickingSomethingUp
                    this.SpritelockStart = 5;
                    this.SpritelockLength = 2;
                }
                this.OffSPickY = 2;
                if(!this.JustDuck){
                    PlaySound("Duck", 0.5, 1 + (Math.random() / 2));this.JustDuck = true;}
            }
        }
        
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


        this.spriteOffset = this.SpritePos;
    }
    Update(){
        if(!this.Started)
            this.Start();

        this.controller.x.L = Inputs.x.L;
        this.controller.x.R = Inputs.x.R;
        this.controller.y.U = Inputs.y.U;
        this.controller.y.D = Inputs.y.D;
        this.controller.x.Axis = Inputs.x.Axis;
        this.controller.y.Axis = Inputs.y.Axis;
        this.controller.x.LastAxis = Inputs.x.LastAxis;
        this.controller.y.LastAxis = Inputs.y.LastAxis;
        this.controller.a.pressed = Inputs.a.pressed;
        this.controller.b.pressed = Inputs.b.pressed;
        this.controller.space.pressed = Inputs.space.pressed;
        this.controller.enter.pressed = Inputs.enter.pressed;
        this.controller.c.pressed = Inputs.c.pressed;

        //this.velocity.x = this.speed * Inputs.x.Axis;

        //var xrt = (Inputs.x.Axis * Inputs.x.Axis);

        //if(this.position.y <= 0)
        //MoveCamTarget(-24,Math.round((this.position.y - 56)));
        if(Inputs.x.Axis != 0 || Inputs.y.Axis != 0)
            this.angle = Math.atan2(Inputs.x.Axis ,Inputs.y.Axis) * 180 / Math.PI;

        this.ForwardX = Math.sin(Math.PI / 180.0 * this.angle);
        this.ForwardY = -Math.cos(Math.PI / 180.0 * this.angle);
        //Animation drawing
        this.Animation();
        this.Draw();

        //Direction
        if(Inputs.x.Axis != 0)
            this.Direction = Inputs.x.Axis;

        //Timings

        if(this.timebtwHits > 0){
            this.timebtwHits -= DeltaTime;
            this.Currentspeed = this.speed / 2;
        }
        else{
            this.Currentspeed = this.speed;
        }
        //Movment X axis
        this.fHorizontal = this.velocity.x;
        this.fHorizontal += Inputs.x.Axis * this.Currentspeed * DeltaTime;

        const fHorizontalDampingWhenStopping = 0.5, fHorizontalDampingWhenTurning = 0.65, fHorizontalDampingBasic = 0.65;
        if (Math.abs(Inputs.x.Axis) < 0.01)
            this.fHorizontal *= Math.pow(1 - fHorizontalDampingWhenStopping, DeltaTime * 10);
        else if (Math.sign(Inputs.x.Axis) != Math.sign(this.fHorizontal))
            this.fHorizontal *= Math.pow(1 - fHorizontalDampingWhenTurning, DeltaTime * 10);
        else
            this.fHorizontal *= Math.pow(1 - fHorizontalDampingBasic, DeltaTime * 10);

        this.velocity.x = this.fHorizontal;
        this.velocity.y += this.Gravity * DeltaTime;

        //Jumping
        if(this.controller.a.pressed == true){
            if(this.isGrounded == true && this.JumpPressed == false){
                this.velocity.y = -this.JumpForce;
                this.JumpPressed = true;
                PlaySound("Jump", 1, 1 + (Math.random() / 2));
            } //normal jump
        }
        else{
            this.JumpPressed = false;}

        //PickUp
        if(this.controller.b.pressed == true){
                    this.PickUp();
                if(!this.PickUpPress){
                    this.PickUpPress = true;
                }
            
        }
        if(!this.controller.b.pressed){
            this.PickUpHoldTime = 0;
            if(this.PickUpPress)
                this.PickUpPress = false;
        }

        if(this.PickUpOBJ != null){
            this.PickUpOBJ.position.x = Math.round(this.position.x + (this.velocity.x * DeltaTime));
            this.PickUpOBJ.position.y = Math.round(this.position.y - (this.width / 2) - (this.PickUpOBJ.height / 2) +(this.velocity.y * DeltaTime))+ this.OffSPickY;
        }


        //Ducking
        this.Duck = (this.controller.y.Axis <= -0.5);
    
        if(!this.Duck)
            this.JustDuck = false;

        this.isGrounded = false;
        this.CollisionDect();
        
        this.position.x += this.velocity.x * DeltaTime;
        this.position.y += this.velocity.y * DeltaTime;
        
        //camera
        //this.Direction * 16
        this.camOffX = lerp(this.camOffX, 0, 2 * DeltaTime);
        this.camOffY = lerp(this.camOffY, 0, 2 * DeltaTime);

        MoveCamTarget(Math.round((this.position.x - 32) + Math.floor(this.camOffX)), clamp(Math.round((this.position.y - 32) + Math.floor(this.camOffY)), -64 - (canvas.height / 2),- (canvas.height / 2)));
    }
    PickUp(){
        console.log("pickup");
        if(this.PickUpOBJ == null && (Math.round(this.velocity.x / 2) == 0) && this.isGrounded && this.Duck){
                for (let index = 0; index < window.Players.length; index++) {
                    const Current = window.Players[index];
                    if(Current.ID == "Pickup"){
                        if(this.PickUpHoldTime < 1){
                            //AtemptPickUp
                            if(boxbox(this.position.x - (this.width / 2), this.position.y - (this.height / 2), this.position.x + (this.width / 2), this.position.y + (this.height / 2), Current.position.x - (Current.width / 2), Current.position.y - (Current.height / 2), Current.position.x + (Current.width / 2), Current.position.y + (Current.height / 2)) == true){
                                this.PickUpHoldTime += DeltaTime;}
                        }
                        if(this.PickUpHoldTime >= 1){
                                this.PickUpOBJ = window.Players[index];
                                this.PickUpOBJ.Throw = false;
                                this.PickUpOBJ.HoldSprite = true;
                                this.PickUpOBJ.velocity.x = 0;
                                this.PickUpOBJ.velocity.y = 0;
                                PlaySound("PickUp1", 1, 1);
                                console.log(this.PickUpOBJ);
                                this.PickUpHoldTime = 0;
                        }
                    }
                }
            
        }else if(this.PickUpOBJ != null && !this.PickUpPress){
            PlaySound("Throw1", 1, 1);
            this.PickUpOBJ.velocity.x = (50 * this.Direction) + this.velocity.x;
            this.PickUpOBJ.Throw = true;
            this.PickUpOBJ = null;
        }else{
            this.PickUpHoldTime = 0;
        }
        //this.PickUpOBJ
    }
    Damage(amount, x, y){
        if(this.timebtwHits <= 0){
            this.Health -= amount;
            //if(this.Health <= 0)
                //this.Death();
            this.fHorizontal = clamp(this.position.x - x, -1, 1) * 200;
            this.timebtwHits = 1;
        }
    }
    Death(){
        var rt = new RagDoll();
        rt.position.x = this.position.x;
        rt.position.y = this.position.y;
        rt.sprite = PlayerImage;
        rt.spriteOffsetX = 0;
        rt.spriteOffsetY = 2;
        rt.velocity.y = this.velocity.y - 100;
        rt.velocity.x = this.velocity.x + this.Direction * 100;
        rt.width = this.width - 2;
        rt.SpriteHeightOffset = -4;
        window.Players.push(rt);

        window.KillList.push(this);
    }
}