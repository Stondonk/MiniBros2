const canvas = document.getElementById("GameArea");
const ctx = canvas.getContext("2d");
import {DeltaTime, cameraX, cameraY, cameraIntX, cameraIntY, drawImage, Inputs, lerp, LevelX, DEG2RAD, RAD2DEG, clamp,MoveCamTarget, MenuUIImage, MouseX, MouseY, LoadLevel, SetScreen, VeclineLine, TitleImage, EntityImage, LoadLevelTransition, boxbox, lineline, SetPlayer, PlayMusic, MusicTrackTitle, MusicTrack, PlaySound} from "./index.js";

export default class OptionsMenu{
    constructor(){
        this.position = {
            x : -16,
            y : 2,
            z : 0,
        }
        this.Cursor = {
            x : 0,
            y : 0,
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
            Jumped : false,
        }
        this.Started = false;

        this.ButtonsCharacter = [-12,-11,12,17,0,-11,12,17,-18,23,36,9,];
        this.ButtonsOpitions = [-12,-13,24,5,-12,-5,24,5,-12,3,24,5,-12,11,24,5,];
        this.ButtonsCol = this.ButtonsCharacter;
        this.SelectedButton = 0;
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
                    //interactions
                    switch(this.SelectedButton){
                        case 0:
                            SetPlayer(0);
                            LoadLevelTransition("Bros1.lvl", 1);
                        break;
                        case 1:
                            SetPlayer(1);
                            LoadLevelTransition("Bros1.lvl", 1);
                        break;
                        case 2:
                            this.MenuScreen = 1;
                            this.ButtonsCol = this.ButtonsOpitions;
                            this.Cursor.x = this.ButtonsCol[0] + (this.ButtonsCol[2] / 2);
                            this.Cursor.y = this.ButtonsCol[1] + (this.ButtonsCol[3] / 2);
                            this.SelectedButton = 0;
                        break;
                    }
                    this.HasAPressed = true;
            }
        }else if(this.MenuScreen == 1){
            if(this.HasAPressed == false && Inputs.a.pressed == true){
                //interactions
                switch(this.SelectedButton){
                    case 0:
                        //Sfx volume
                        if(window.SFXVolume >= 1)
                            window.SFXVolume = 0;
                        else
                            window.SFXVolume += 0.125;
                        PlaySound("Jump", 1, 1);
                    break;
                    case 1:
                        //Music volume
                        if(window.MusicVolume >= 1)
                            window.MusicVolume = 0;
                        else
                            window.MusicVolume += 0.125;
                        MusicTrack.volume = window.MusicVolume;
                        //PlayMusic(MusicTrackTitle, MusicTrack.currentTime + DeltaTime);
                    break;
                    case 2:
                        //Graphics detail on off
                        window.DetailLow = !window.DetailLow;
                    break;
                    case 3:
                        //Back
                        this.MenuScreen = 0;
                        this.ButtonsCol = this.ButtonsCharacter;
                        this.Cursor.x = this.ButtonsCol[0] + (this.ButtonsCol[2] / 2);
                        this.Cursor.y = this.ButtonsCol[1] + (this.ButtonsCol[3] / 2);
                        this.SelectedButton = 0;
                        this.SetNewEntityMode(this.SelectedButton);
                    break;
                }
                this.HasAPressed = true;
            }
        }
        if(this.PointPress == false){
            var CurrentSelect = this.SelectedButton * 4;
            if(Inputs.x.Axis != 0 || Inputs.y.Axis != 0){
                var DrX = Inputs.x.Axis, DrY = -Inputs.y.Axis;
                var Closest = -1, ClosestDist = 10000;
                for (let index = 0; index < this.ButtonsCol.length / 4; index++) {
                    const Current = index * 4;
                    if(index != this.SelectedButton){
                        if(lineline(this.Cursor.x,this.Cursor.y,this.Cursor.x + (64 * DrX),this.Cursor.y, this.ButtonsCol[Current] + (this.ButtonsCol[Current+2] / 2), this.ButtonsCol[Current + 1], this.ButtonsCol[Current] + (this.ButtonsCol[Current+2] / 2), this.ButtonsCol[Current + 1] + this.ButtonsCol[Current + 3])){
                            if(Math.pow(this.ButtonsCol[Current] + (this.ButtonsCol[Current+2] / 2) - this.Cursor.x,2) < Math.pow(ClosestDist - this.Cursor.x,2)){
                                Closest = index;
                                ClosestDist = this.ButtonsCol[Current] + (this.ButtonsCol[Current+2] / 2);
                                console.log(ClosestDist);
                            }
                        }
                        if(lineline(this.Cursor.x,this.Cursor.y,this.Cursor.x,this.Cursor.y + (64 * DrY), this.ButtonsCol[Current], this.ButtonsCol[Current + 1]  + (this.ButtonsCol[Current+3] / 2), this.ButtonsCol[Current] + (this.ButtonsCol[Current+2]), this.ButtonsCol[Current + 1] +  + (this.ButtonsCol[Current+3] / 2))){
                            if(Math.pow(this.ButtonsCol[Current+1] + (this.ButtonsCol[Current+3] / 2) - this.Cursor.y,2) < Math.pow(ClosestDist - this.Cursor.y,2)){
                                Closest = index;
                                ClosestDist = this.ButtonsCol[Current+1] + (this.ButtonsCol[Current+3] / 2);
                                console.log(ClosestDist);
                            }
                        }
                    }
                }
                if(ClosestDist < 10000 && Closest >= 0){
                    this.SelectedButton = Closest;
                    CurrentSelect = this.SelectedButton * 4;
                    this.Cursor.x = this.ButtonsCol[CurrentSelect] + (this.ButtonsCol[CurrentSelect+2] / 2);
                    this.Cursor.y = this.ButtonsCol[CurrentSelect + 1] + (this.ButtonsCol[CurrentSelect+3] / 2);
                    console.log(this.SelectedButton);
                    this.SetNewEntityMode(this.SelectedButton);
                }
                this.PointPress = true;
            }
        }else{
            if(Inputs.x.Axis == 0 && Inputs.y.Axis == 0)
                this.PointPress = false;
        }


        if(this.HasAPressed == true && Inputs.a.pressed == false)
            this.HasAPressed = false;
    }
    Draw(){
        if(this.MenuScreen == 0){
            drawImage(ctx, TitleImage, 64, 0, 64, 64, 0, 0, 64, 64, 0);
            
            switch(this.SelectedButton){
                case 0:
                    ctx.fillStyle = "#b13e53";
                    ctx.fillRect(-12 - cameraIntX,8 - cameraIntY,10,1);
                break;
                case 1:
                    ctx.fillStyle = "#38b764";
                    ctx.fillRect(2 - cameraIntX,8 - cameraIntY,10,1);
                break;
                case 2:
                    ctx.fillStyle = "#f4f4f4";
                    ctx.fillRect(-18 - cameraIntX,27 - cameraIntY,3,1);
                    ctx.fillRect(15 - cameraIntX,27 - cameraIntY,3,1);
                break;
            }
            //ctx.fillRect(this.Cursor.x - cameraIntX, this.Cursor.y - cameraIntY, 2, 2);
            drawImage(ctx, EntityImage, this.FakeEntity.Frame * 8,this.FakeEntity.MovementMode * 16 + (8*this.FakeEntity.LayerOffest),8,8,Math.round(this.FakeEntity.position.x -4 - cameraIntX) , Math.round(this.FakeEntity.position.y - 4 - cameraIntY), 8,8,0);

            if(this.FakeEntity.FrameTick >= 0.125){
                this.FakeEntity.Frame++;
                if(this.FakeEntity.Frame >= this.FakeEntity.FramePoint + this.FakeEntity.FrameLength)
                    this.FakeEntity.Frame = 0;
                else if(this.FakeEntity.Frame < this.FakeEntity.FramePoint)
                    this.FakeEntity.Frame = this.FakeEntity.FramePoint;
                this.FakeEntity.FrameTick = 0;
            }else{
                this.FakeEntity.FrameTick += DeltaTime;
            }
            if(this.FakeEntity.position.y <= 15)
                {this.FakeEntity.FramePoint = 4; this.FakeEntity.FrameLength = 0;}
            else{
                this.FakeEntity.FramePoint = 0; this.FakeEntity.FrameLength = 4;}
            switch(this.FakeEntity.MovementMode){
                case 0:{
                    if(this.FakeEntity.position.x >= -8 && !this.FakeEntity.Jumped){
                        this.FakeEntity.velocity.y = -100;this.FakeEntity.Jumped=true}
                    this.FakeEntity.velocity.y += 500 * DeltaTime;

                    if(this.FakeEntity.position.x >= 40 || this.FakeEntity.position.x <= -40)
                        this.SetNewEntityMode(0);
                }break;
                case 1:{
                    if(this.FakeEntity.position.x >= -8 && !this.FakeEntity.Jumped){
                        this.FakeEntity.velocity.y = -100;this.FakeEntity.Jumped=true;}
                    this.FakeEntity.velocity.y += 500 * DeltaTime;

                    if(this.FakeEntity.position.x >= 40 || this.FakeEntity.position.x <= -40)
                        this.SetNewEntityMode(1);
                }break;
                case 2:{
                    if(this.FakeEntity.position.x >= -6 && !this.FakeEntity.Jumped){
                        this.FakeEntity.velocity.y = -75;this.FakeEntity.Jumped=true;}
                    this.FakeEntity.velocity.y += 500 * DeltaTime;

                    if(this.FakeEntity.position.x >= 40 || this.FakeEntity.position.x <= -40)
                        this.SetNewEntityMode(2);
                }break;
            }

            this.FakeEntity.LayerOffest = ((-this.FakeEntity.Direction + 1) / 2);
                
            this.FakeEntity.position.x += this.FakeEntity.velocity.x * DeltaTime;
            this.FakeEntity.position.y = clamp(this.FakeEntity.position.y + this.FakeEntity.velocity.y * DeltaTime, -32, 16);
            //screen has placed logo
            //drawImage(ctx, MenuUIImage, 0, 178, 6, 6, this.pointerPoint[(this.pointAxisPoint * 2)], this.pointerPoint[(this.pointAxisPoint * 2) + 1], 6, 6, 0);
        }else if(this.MenuScreen == 1){
            drawImage(ctx, TitleImage, 128, 0, 64, 64, 0, 0, 64, 64, 0);

            switch(this.SelectedButton){
                case 0:
                    ctx.fillStyle = "#f4f4f4";
                    for (let index = 0; index < Math.floor(window.SFXVolume * 8); index++) {
                        ctx.fillRect(-15 - cameraIntX + (index * 4),-14 - cameraIntY,3,1);
                    }
                    
                break;
                case 1:
                    ctx.fillStyle = "#f4f4f4";
                    for (let index = 0; index < Math.floor(window.MusicVolume * 8); index++) {
                        ctx.fillRect(-15 - cameraIntX + (index * 4),-6 - cameraIntY,3,1);
                    }
                break;
                case 2:
                    ctx.fillStyle = "#38b764";
                    if(window.DetailLow)
                        ctx.fillStyle = "#b13e53";
                    ctx.fillRect(-15 - cameraIntX,2 - cameraIntY,3,1);
                break;
                case 3:
                    ctx.fillStyle = "#f4f4f4";
                    ctx.fillRect(-15 - cameraIntX,27 - cameraIntY,3,1);
                break;
            }
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
    SetNewEntityMode(selection){
            const OldNum = this.FakeEntity.MovementMode;
            this.FakeEntity.MovementMode = selection;
            this.FakeEntity.Direction = 1;
            this.FakeEntity.velocity = {x : 40, y : 0};
            this.FakeEntity.position.y = 16;
            this.FakeEntity.position.x = -39;
            this.FakeEntity.Jumped = false;
        
    }
}