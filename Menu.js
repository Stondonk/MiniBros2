const canvas = document.getElementById("GameArea");
const ctx = canvas.getContext("2d");
import {DeltaTime, cameraX, cameraY, cameraIntX, cameraIntY, drawImage, Inputs, lerp, LevelX, DEG2RAD, RAD2DEG, clamp,MoveCamTarget, MenuUIImage, MouseX, MouseY, LoadLevel, SetScreen, VeclineLine, TitleImage, EntityImage, LoadLevelTransition} from "./index.js";

export default class MainMenu{
    constructor(){
        this.position = {
            x : -16,
            y : 2,
            z : 0,
        }
        
        this.MenuScreen = 0;
        this.HasAPressed = false;
        this.pointerPoint = [60, 104, 50, 112, 56, 120];
        this.pointAxisPoint = 0;
        this.PointPress = false;
        
        this.FakeEntity = {
            position : {
                x : 0,
                y : 0,
            },
            velocity : {
                x : 0,
                y : 0,
            },
            Frame : 0,
            FramePoint: 0,
            FrameLength: 4,
            FrameTick : 0,
            LayerOffest: 0,
            MovementMode : 0,
            Direction : 1,
        }
        this.Started = false;
    }

    Start(){
        this.FakeEntity.position.x = -32;
        this.SetNewEntityMode();
        this.Started = true;
    }

    Update(){
        if(this.Started == false)
            this.Start();
        

        if(this.MenuScreen == 0){
                if(this.HasAPressed == false && Inputs.a.pressed == true){
                        //Menu interactions
                        switch(this.pointAxisPoint){
                            case 0:
                                LoadLevelTransition("Options.lvl", 1);
                            break;
                        }
                        this.HasAPressed = true;
            }
        }


        if(this.HasAPressed == true && Inputs.a.pressed == false)
        this.HasAPressed = false;

        if(this.PointPress == false && Inputs.y.Axis != 0){
            this.pointAxisPoint = clamp(this.pointAxisPoint - Inputs.y.Axis,0,this.pointerPoint.length/2 - 1);
            console.log(this.pointAxisPoint)
            this.PointPress = true;
        }if(this.PointPress == true && Inputs.y.Axis == 0){
            this.PointPress = false;
        }
    }
    Draw(){
        if(this.MenuScreen == 0){
            drawImage(ctx, TitleImage, 0, 0, 64, 64, 0, 0, 64, 64, 0);
            drawImage(ctx, EntityImage, this.FakeEntity.Frame * 8,this.FakeEntity.MovementMode * 16 + (8*this.FakeEntity.LayerOffest),8,8,Math.round(this.FakeEntity.position.x -4 - cameraIntX) , Math.round(this.FakeEntity.position.y - 4 - cameraIntY), 8,8,0);
            if(this.FakeEntity.FrameTick >= 0.25){
                this.FakeEntity.Frame++;
                if(this.FakeEntity.Frame >= this.FakeEntity.FramePoint + this.FakeEntity.FrameLength)
                    this.FakeEntity.Frame = 0;
                else if(this.FakeEntity.Frame < this.FakeEntity.FramePoint)
                    this.FakeEntity.Frame = this.FakeEntity.FramePoint;
                this.FakeEntity.FrameTick = 0;
            }else{
                this.FakeEntity.FrameTick += DeltaTime;
            }
            switch(this.FakeEntity.MovementMode){
                case 0:{
                    if(this.FakeEntity.position.x >= 40 || this.FakeEntity.position.x <= -40)
                        this.SetNewEntityMode();
                }break;
                case 1:{
                    if(this.FakeEntity.position.y >= 15)
                        this.FakeEntity.velocity.y = -100;
                    this.FakeEntity.velocity.y += 500 * DeltaTime;

                    if(this.FakeEntity.position.x >= 40 || this.FakeEntity.position.x <= -40)
                        this.SetNewEntityMode();
                }break;
            }

            if(this.FakeEntity.velocity.x < 0)
                this.FakeEntity.Direction = -1;
            else
                this.FakeEntity.Direction = 1;
            this.FakeEntity.LayerOffest = ((-this.FakeEntity.Direction + 1) / 2);
                
            this.FakeEntity.position.x += this.FakeEntity.velocity.x * DeltaTime;
            this.FakeEntity.position.y = clamp(this.FakeEntity.position.y + this.FakeEntity.velocity.y * DeltaTime, -32, 16);
            //screen has placed logo
            //drawImage(ctx, MenuUIImage, 0, 178, 6, 6, this.pointerPoint[(this.pointAxisPoint * 2)], this.pointerPoint[(this.pointAxisPoint * 2) + 1], 6, 6, 0);
        }

        /*
        var local1X = 0, local1Y = 0;
        local1X = VeclineLine(2, 2, 16, 16, 2,12,24,12).x2;
        local1Y = VeclineLine(2, 2, 16, 16, 2,12,24,12).y2;
        ctx.beginPath();
        ctx.moveTo(2, 2);
        ctx.lineTo(local1X, local1Y);
        ctx.stroke();
        */
    }
    SetNewEntityMode(){
        const OldNum = this.FakeEntity.MovementMode;
        this.FakeEntity.MovementMode = Math.floor(Math.random() * 2);
        if(OldNum == this.FakeEntity.MovementMode)
            this.FakeEntity.Direction = -this.FakeEntity.Direction;

        switch(this.FakeEntity.MovementMode){
            case 0:{
                this.FakeEntity.velocity = {x : this.FakeEntity.Direction * 20, y : 0};
                this.FakeEntity.position.y = 16;
                this.FakeEntity.position.x = this.FakeEntity.Direction * -39;
            }break;
            case 1:{
                this.FakeEntity.Direction = ((Math.floor(Math.random() * 2) * 2) - 1);
                console.log(this.FakeEntity.Direction);
                this.FakeEntity.velocity.x = this.FakeEntity.Direction * 30;
                this.FakeEntity.position.y = 16;
                this.FakeEntity.position.x = -this.FakeEntity.Direction * 39;
            }break;
            case 2:{

            }break;
            case 3:{

            }break;
        }
    }
}