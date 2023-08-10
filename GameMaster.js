const canvas = document.getElementById("GameArea");
const ctx = canvas.getContext("2d");
import {DeltaTime, cameraX, cameraY, cameraIntX, cameraIntY, drawImage, Inputs, lerp, LevelX, DEG2RAD, RAD2DEG, clamp,MoveCamTarget, MouseX, MouseY, MasterArrayLevelSize, TextImg, PlayerImage, DrawChar, DrawText} from "./index.js";


var myFont = new FontFace('myFont', 'url(images/fonts/pixelsix14.ttf)');
document.fonts.add(myFont);
var Time = 0;
var StartTime;
var TimeActive = false;
var GameMastStart = false;
function gameMastStartFunc(){
    if(GameMastStart == false){
        
        GameMastStart = true;
    }
}
export function gameMastUpdateFunc(){
    Time += DeltaTime;
    gameMastDrawFunc();
}
export function gameMastDrawFunc(){
    //bg
    ctx.fillStyle = "#5c85b6";


    //text drawing
    /*
    const FinalText = TimeDraw.toString();
    var NewText = "";
    for (let index = 0; index < 7 - FinalText.length; index++) {
        if(index == 1 || index == 4)
            NewText += '.';
        else
            NewText += '0';

        if(index >= 7 - FinalText.length - 1)
            NewText += FinalText;
    }
    DrawText(NewText.toString(),1,2,2,0);
    */

    //Coins
    const CointCount = parseInt(window.Coins);
    const TROffsetX = -2;
    const TROffsetY = 2;

    //drawImage(ctx, NumberImg, 16,0,8,8,canvas.width-(TtRub.toString().length * 8)-8 + TROffsetX, TROffsetY, 8, 8,0);
    //const TtRubSt = String(TtRub);
    //DrawText(TtRub.toString(),1,canvas.width-(TtRub.toString().length * 8) + TROffsetX,TROffsetY,0);
}
export function gameMastRestartFunc(){
    Time = 0;
}