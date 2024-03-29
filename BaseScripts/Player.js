
const canvas = document.getElementById("GameArea");
const ctx = canvas.getContext("2d");
import RagDoll from "./RagDoll.js";
import {DeltaTime, cameraX, cameraY, cameraIntX, cameraIntY, drawImage, Inputs, lerp, LevelX, DEG2RAD, RAD2DEG, clamp,MoveCamTarget, MouseX, MouseY, MasterArrayLevelSize, PlayerImage, lerpAngle, lineBlock, VeclineLine, magnitude, EntityImage, PlaySound, boxbox, PlayMusic, MusicTrack, LoadLevelTransition, CurrentLevel, DeathPlaneHeight} from "../index.js";

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
            HiddenX : 0,
            HiddenY : 0,
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
        this.Health = 2;
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
        this.CharacterSounds = ["","PickUp1","Throw1","HitSo","deathSM","Luigi","LuigiPickUp","LuigiThrow","LuigiHit","LuigiDead"];
        this.WalkTiming = 0.2;

        this.HasHitForX = false;
        this.HasHitForY = false;
        this.CollisionXPoint = 0;
        this.CollisionYPoint = 0;
    }
    #image(fileName) {
        const img = new Image();
        img.src = `images/${fileName}`;
        return img;
    }
    Start(){
        if(this.CharacterSounds[this.CharacterSkin * 5] != "")
            PlaySound(this.CharacterSounds[this.CharacterSkin * 5], 1, 1);
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

        for (let index = 0; index < this.Health; index++) {
            const PointX = 2, PointY = (5*index) + 2;
            drawImage(ctx,this.sprite,59,96 + (this.CharacterSkin * 5), 5, 5, PointX, PointY, 5, 5, this.lerpAngle);
        }
    }
    CollisionDect(){
        const HalfWidth = this.width / 2, HalfHeight = this.height / 2;
        const CornerX = this.position.x - HalfWidth, CornerY = this.position.y - HalfHeight;
        var CurrentOneX = this.position.x;
        var CurrentOneY = this.position.y;
        var hasHitX = false, hasHitY = false, hasHitCornor = false;
        for (let index = 0; index < Math.floor((LevelX.length) / MasterArrayLevelSize); index++) {
            const indev = index * MasterArrayLevelSize;


            if(LevelX[indev + 5] == 0){
                if (CornerX + (this.velocity.x + this.velocity.HiddenX) * DeltaTime >= LevelX[indev] - this.width && CornerX + (this.velocity.x + this.velocity.HiddenX)* DeltaTime <= LevelX[indev] + LevelX[indev + 2]  && CornerY + this.height >= LevelX[indev+1] && CornerY <= LevelX[indev+1] + LevelX[indev + 3]) {
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
    
                if ((CornerY + (this.velocity.y + this.velocity.HiddenY) * DeltaTime >= LevelX[indev + 1] - this.height && CornerY + (this.velocity.y + this.velocity.HiddenY) * DeltaTime <= LevelX[indev + 1] + LevelX[indev + 3] && CornerX + this.width >= LevelX[indev] && CornerX <= LevelX[indev] + LevelX[indev + 2]) || (CornerY >= LevelX[indev + 1] - this.height && CornerY <= LevelX[indev + 1] + LevelX[indev + 3] && CornerX + this.width >= LevelX[indev] && CornerX <= LevelX[indev] + LevelX[indev + 2])) {
                    var Cyp = this.position.y;
                    if(hasHitY){
                        if(Math.pow(LevelX[indev + 1]- this.position.y, 2) < Math.pow(LevelX[indev+ 1] + (LevelX[indev + 3]) - this.position.y, 2)){
                            if(Math.pow(LevelX[indev+ 1]- this.position.y, 2) < Math.pow(CurrentOneY - this.position.y, 2))
                                CurrentOneY = LevelX[indev+ 1] - (this.height / 2) - 0.2;
                        }else{
                            if(Math.pow(LevelX[indev+ 1] + (LevelX[indev + 3])- this.position.y, 2) < Math.pow(CurrentOneY - this.position.y, 2))
                                CurrentOneY = LevelX[indev+ 1] + LevelX[indev + 3] + (this.height / 2) +0.2;
                        }
                        if (CornerY + this.height  < LevelX[indev + 1] && CornerY  > LevelX[indev + 1] + LevelX[indev + 3]) {
                            this.velocity.y = 0;
                        }
                    }else{
                        if(Math.pow(LevelX[indev+1]- this.position.y, 2) < Math.pow(LevelX[indev+1] + (LevelX[indev + 3]) - this.position.y, 2))
                            CurrentOneY = LevelX[indev+1] - (this.height / 2) - 0.2;
                        else
                            CurrentOneY = LevelX[indev+1] + (LevelX[indev + 3]) + (this.height / 2) + 0.2;
                        hasHitY = true;
                    }
                }

                //ground
                if (CornerX + (this.velocity.x + this.velocity.HiddenX) * DeltaTime >= LevelX[indev] - this.width && CornerX + (this.velocity.x + this.velocity.HiddenX)* DeltaTime <= LevelX[indev] + LevelX[indev + 2]  && CornerY + this.height + (this.velocity.y + this.velocity.HiddenY) * DeltaTime >= LevelX[indev+1] && CornerY + (this.velocity.y + this.velocity.HiddenY) * DeltaTime <= LevelX[indev+1] + LevelX[indev + 3]) {
                    hasHitCornor = true;
                }
            
                if (CornerY + ((this.velocity.y + this.velocity.HiddenY) * DeltaTime) + 1 >= LevelX[indev + 1] - this.height && CornerY + ((this.velocity.y + this.velocity.HiddenY) * DeltaTime) <= LevelX[indev + 1] + LevelX[indev + 3] - this.height && CornerX + this.width >= LevelX[indev] && CornerX <= LevelX[indev] + (LevelX[indev + 2])){
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
            else if(LevelX[indev + 5] == 2){
                if (CornerX + (this.velocity.x + this.velocity.HiddenX) * DeltaTime >= LevelX[indev] - this.width && CornerX + (this.velocity.x + this.velocity.HiddenX)* DeltaTime <= LevelX[indev] + LevelX[indev + 2]  && CornerY + this.height >= LevelX[indev+1] && CornerY <= LevelX[indev+1] + LevelX[indev + 3]){
                    this.Climbing = true;
                }
            }
            
        }
        if(hasHitX)
        {
            //this.position.x = (CurrentOneX);
            this.velocity.x = 0;
            this.velocity.HiddenX = 0;

            this.HasHitForX = true;
            this.CollisionXPoint = (CurrentOneX);
            this.fHorizontal = this.velocity.x;
        }
        if(hasHitY)
        {
            //this.position.y = (CurrentOneY);
            this.velocity.y = 0;
            this.velocity.HiddenY = 0;
            var HitPlaceY = 0;
            if(hasHitX){
                if(CurrentOneY > this.position.y)
                HitPlaceY = -1;
                else
                HitPlaceY = 1;
            }

            this.HasHitForY = true;
            this.CollisionYPoint = (CurrentOneY) ;
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
                    this.isGrounded = true;
                }
                
            }
            
        }
        if(hasHitY)
        {
            this.CollisionYPoint = (CurrentOneY);
            this.HasHitForY = true;
            this.velocity.HiddenX = CurrentVx;
            if(CurrentVy < 0)
                this.velocity.HiddenY = CurrentVy;

                this.velocity.y = 0;
        }
    }
    Animation(){
        //Bad way of doing it I know but what you gonna do about huh, yeah joe I know your looking hear get out shoo
        //flipSprite
        this.spriteOffsetLayer = Math.round((-this.Direction + 1) / 2);
        this.OffSPickY = 0;

        if(this.isGrounded == false){
            this.SpritelockStart = 4;
            this.SpritelockLength = 1;

            if(this.Climbing && (this.controller.x.Axis != 0 || this.controller.y.Axis != 0)){
                this.SpritelockStart = 7;
                this.SpritelockLength = 2;}
            else if(this.Climbing && (this.controller.x.Axis == 0 && this.controller.y.Axis == 0)){
                this.SpritelockStart = 7;
                this.SpritelockLength = 0;
            }
        }
        else if(Math.round(this.velocity.x) < -1.1 || Math.round(this.velocity.x) > 1.1){
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

            if(this.Climbing && !this.isGrounded){
                this.SpritelockStart = 7;
                this.SpritelockLength = 0;}

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
        if(this.controller.x.Axis != 0 || this.controller.y.Axis != 0)
            this.angle = Math.atan2(this.controller.x.Axis ,this.controller.y.Axis) * 180 / Math.PI;

        this.ForwardX = Math.sin(Math.PI / 180.0 * this.angle);
        this.ForwardY = -Math.cos(Math.PI / 180.0 * this.angle);
        //Animation drawing
        this.Animation();
        this.Draw();

        //Direction
        if(this.controller.x.Axis != 0)
            this.Direction = this.controller.x.Axis;

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
        this.fHorizontal += this.controller.x.Axis * this.Currentspeed * DeltaTime;

        const fHorizontalDampingWhenStopping = 0.5, fHorizontalDampingWhenTurning = 0.65, fHorizontalDampingBasic = 0.65;
        if (Math.abs(this.controller.x.Axis) < 0.01)
            this.fHorizontal *= Math.pow(1 - fHorizontalDampingWhenStopping, DeltaTime * 10);
        else if (Math.sign(this.controller.x.Axis) != Math.sign(this.fHorizontal))
            this.fHorizontal *= Math.pow(1 - fHorizontalDampingWhenTurning, DeltaTime * 10);
        else
            this.fHorizontal *= Math.pow(1 - fHorizontalDampingBasic, DeltaTime * 10);

        this.velocity.x = this.fHorizontal;
        if(!this.Climbing)
            this.velocity.y += this.Gravity * DeltaTime;
        else{
            this.fVertical = this.velocity.y;
            this.fVertical -= this.controller.y.Axis * this.Currentspeed * DeltaTime;
            this.fVertical *= Math.pow(1.0 - (0.65), DeltaTime * 10);

            this.velocity.y = this.fVertical;
        }

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
            this.PickUpOBJ.velocity.x = 0;
            this.PickUpOBJ.velocity.y = 0;
            this.PickUpOBJ.Direction = this.Direction;
        }


        //Ducking
        this.Duck = (this.controller.y.Axis <= -0.5);
    
        if(!this.Duck)
            this.JustDuck = false;

        //Death
        if(this.Health <= 0 || this.position.y >= DeathPlaneHeight + this.height){
            this.Death();
        }

        this.isGrounded = false;
        this.Climbing = false;
        this.velocity.HiddenX = 0;
        this.velocity.HiddenY = 0;

        this.HasHitForX = false;
        this.HasHitForY = false;

        this.EntityCollision();
        this.CollisionDect();
        
        if(this.HasHitForX)
            this.position.x = this.CollisionXPoint;
        if(this.HasHitForY)
            this.position.y = this.CollisionYPoint;
        
        this.position.x += (this.velocity.x + this.velocity.HiddenX) * DeltaTime;
        this.position.y += (this.velocity.y + this.velocity.HiddenY) * DeltaTime;
        
        //camera
        //this.Direction * 16
        this.camOffX = lerp(this.camOffX, 0, 2 * DeltaTime);
        this.camOffY = lerp(this.camOffY, 0, 2 * DeltaTime);

        MoveCamTarget(Math.round((this.position.x - 32) + Math.floor(this.camOffX)), clamp(Math.round((this.position.y - 32) + Math.floor(this.camOffY)), -64 - (canvas.height / 2),- (canvas.height / 2)));
    }
    PickUp(){
        console.log("pickup");
        if(this.PickUpOBJ == null && (Math.round(this.velocity.x / 2) == 0) && this.isGrounded && this.Duck){
            var IncroTime = false;
                for (let index = 0; index < window.Players.length; index++) {
                    const Current = window.Players[index];
                    if(Current.CanBePickedUp == true){
                        if(this.PickUpHoldTime < 1){
                            //AtemptPickUp
                            if(boxbox(this.position.x - (this.width / 2), this.position.y - (this.height / 2), this.position.x + (this.width / 2), this.position.y + (this.height / 2) + 2, Current.position.x - (Current.width / 2), Current.position.y - (Current.height / 2), Current.position.x + (Current.width / 2), Current.position.y + (Current.height / 2)) == true && IncroTime == false){
                                this.PickUpHoldTime += DeltaTime; IncroTime = true;}
                        }
                        if(this.PickUpHoldTime >= 1){
                                this.PickUpOBJ = window.Players[index];
                                this.PickUpOBJ.Throw = false;
                                this.PickUpOBJ.HoldSprite = true;
                                this.PickUpOBJ.velocity.x = 0;
                                this.PickUpOBJ.velocity.y = 0;
                                this.PickUpOBJ.NoPickUpCol = false;
                                PlaySound(this.CharacterSounds[(this.CharacterSkin * 5)+1], 1, 1);
                                console.log(this.PickUpOBJ);
                                this.PickUpHoldTime = 0;
                                index = window.Players.length;
                        }
                    }
                }
            
        }else if(this.PickUpOBJ != null && !this.PickUpPress){
            PlaySound(this.CharacterSounds[(this.CharacterSkin * 5)+2], 1, 1);
            if(this.PickUpOBJ.HasCollision == true){
                this.PickUpOBJ.position.x = this.position.x - (1 * this.Direction);
                this.PickUpOBJ.position.y = this.position.y;
            }
            this.PickUpOBJ.NoPickUpCol = true;
            this.PickUpOBJ.velocity.x = (50 * this.Direction) + this.velocity.x;
            this.PickUpOBJ.Throw = true;
            this.PickUpOBJ = null;
        }else{
            this.PickUpHoldTime = 0;
        }
        if(IncroTime == false)
            this.PickUpHoldTime = 0;
        //this.PickUpOBJ
    }
    Damage(amount, x, y){
        if(this.timebtwHits <= 0){
            this.Health -= amount;
            //if(this.Health <= 0)
                //this.Death();
            this.velocity.x = clamp(this.position.x - x, -1, 1) * 100;
            if(this.Health > 0){
                if(this.CharacterSkin != 1)
                    PlaySound(this.CharacterSounds[(this.CharacterSkin * 5)+3],1,1);
                else
                    PlaySound("LuigiHit",1,1);
                    this.timebtwHits = 1;
            }
        }
    }
    Death(){
        var rt = new RagDoll();
        rt.position.x = this.position.x;
        rt.position.y = this.position.y;
        rt.sprite = this.sprite;
        rt.spriteOffsetX = 0;
        rt.spriteOffsetY = (this.CharacterSkin * 2);
        rt.SpriteWidth = 8;
        rt.SpriteHeight = 8;
        rt.SpritelockStart = 9;
        rt.SpritelockLength = 2;
        rt.velocity.y = - 100;
        //rt.velocity.x = this.Direction * 100;
        rt.width = this.width;
        rt.height = this.height;
        window.Players.push(rt);
        //CutMusic
        MusicTrack.currentTime = 0;
        MusicTrack.pause();
        PlaySound(this.CharacterSounds[(this.CharacterSkin * 5)+4],1,1);

        LoadLevelTransition(CurrentLevel, 2);
        if(this.PickUpOBJ != null)
            this.PickUp();

        window.KillList.push(this);
    }
}