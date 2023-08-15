import player from "./BaseScripts/Player.js";
import RagDoll from "./BaseScripts/RagDoll.js";
import MainMenu from "./Menu.js";
import { gameMastUpdateFunc, gameMastDrawFunc, gameMastRestartFunc } from "./GameMaster.js";
import BasicBox from "./BaseScripts/InteractObjects/BasicBox.js";
import OptionsMenu from "./Options.js";
import PickUpOBJ from "./BaseScripts/FloorVeg.js";
import ShiGuy from "./BaseScripts/enemies/ShiGuy.js";
import FlyGuy from "./BaseScripts/enemies/FlyGuy.js";
import GoalOBJ from "./BaseScripts/Goal.js";
const canvas = document.getElementById("GameArea");
const ctx = canvas.getContext("2d");

window.DetailLow = false;

ctx.imageSmoothingEnabled = false;

export const MasterArrayLevelSize = 6;
var InBrows = true, JustPause = false;
var NoPause = false;
var PauseButtonPressed = false;
const LogoImage = image("MikeLogo.png");
const TitleImage = image("TitleCard.png");
const PlayerImage = image("BasePl1Spr.png");
const EntityImage = image("miniBrosEntities.png");
const TextImg = image("TextDisplay.png");
const MissItems = image("MissItems.png");
var BGImg = image("CloudsBg1.png");
var TileTextureImage = image("MinibrosTileSet.png");
var PauseTimeSinc = 0;
var DeathPlaneHeight = 40;
//transition Stuff
var CharacterSpawnSet = 0;
var TransitionVal = 0, ScreenTime = 1, OpenTransition = true, TransitionForTime = 1, TimeWhenStartTransition = 0, LevelToLoad = "", CurrentLevel = "";
var MusicTrack = document.getElementById('MusicTrack'), MusicTrackTitle = "";
var SFXTrack = document.getElementById('SFXTrack');
var PauseSelect = 0, PausePress = false;
window.SFXVolume = 1; 
window.MusicVolume = 1;

var SpriteTileRef = [0,0,16,16,16,0,32,32,0,16,16,8,0,24,16,8]

window.Coins = 0;

window.PlanetScore = 0;
var ShowGameUI = false;
var Ruby = 0;

var MouseX = 0;
var MouseY = 0;

var Screen = -1;

var LoadValTime = 0;

var MONEYCOUNT = 0;

var objectLoadList = [new player(),]

const Struct = (...keys) => ((...v) => keys.reduce((o, k, i) => {o[k] = v[i]; return o} , {}))
const Block = Struct('x', 'y', 'sx', 'sy');
function image(fileName) {
    const img = new Image();
    img.src = `images/${fileName}`;
    return img;
}
const BarImg = image("Brian.png");
///deltaTime
var DeltaTime = 0.013;
export const DEG2RAD = 0.0174533;
export const RAD2DEG = 57.2958;
var cameraX = -32, cameraY = -32;
var cameraIntX = -32, cameraIntY = -32;
var LevelTimes = [];
export var LevelX = [
    -48,20,84,4,
    0,0,8,20,
    -8,0,32,8,
    24,2,8,8,
]
window.Players = [
    new player(),
];
window.KillList = [

];

var controllerEnable = false;
var controllerIndex = null;

export var Inputs = {
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
}

LoadLevel("Menu.lvl");

document.body.addEventListener('keydown', keydown)
document.body.addEventListener('keyup', keyup);

//controller support - not my i Know im an ass for not making it myself but.. hear me out 
  window.addEventListener("gamepadconnected", (event) => {
    controllerIndex = event.gamepad.index;
    console.log("connected");
  });
  
  window.addEventListener("gamepaddisconnected", (event) => {
    console.log("disconnected");
    controllerIndex = null;
  });

function controllerInput() {
    const DZ = 0.4;
    if (controllerIndex !== null && controllerEnable == true) {
      const gamepad = navigator.getGamepads()[controllerIndex];
  
    const buttons = gamepad.buttons;
    if(typeof buttons[12] !== 'undefined'){
        //Normal controller
      Inputs.y.U = buttons[12].pressed;
      Inputs.y.D = buttons[13].pressed;
      Inputs.x.L = buttons[14].pressed;
      Inputs.x.R = buttons[15].pressed;
  
      const LeftRight = gamepad.axes[0];
  
      if (LeftRight >= DZ) {
        Inputs.x.R = true;
      } else if (LeftRight <= -DZ) {
        Inputs.x.L = true;
      }
  
      const UpDown = gamepad.axes[1];
  
      if (UpDown >= DZ) {
        Inputs.y.D = true;
      } else if (UpDown <= -DZ) {
        Inputs.y.U = true;
      }

      Inputs.a.pressed = buttons[0].pressed;
      Inputs.b.pressed = buttons[2].pressed;
      Inputs.c.pressed = buttons[1].pressed;
      Inputs.enter.pressed = buttons[9].pressed;
    }
    else{
        //Mega Drive Pad
        Inputs.y.U = false;
        Inputs.y.D = false;
        Inputs.x.L = false;
        Inputs.x.R = false;

        const LeftRight = gamepad.axes[0];
  
        if (LeftRight >= DZ) {
          Inputs.x.R = true;
        } else if (LeftRight <= -DZ) {
          Inputs.x.L = true;
        }
    
        const UpDown = gamepad.axes[1];
    
        if (UpDown >= DZ) {
          Inputs.y.D = true;
        } else if (UpDown <= -DZ) {
          Inputs.y.U = true;
        }

        Inputs.a.pressed = buttons[2].pressed;
        Inputs.b.pressed = buttons[1].pressed;
        Inputs.c.pressed = buttons[0].pressed;
        Inputs.enter.pressed = buttons[9].pressed;
    }
  
    }else if(controllerIndex !== null && controllerEnable == false){
        const gamepad = navigator.getGamepads()[controllerIndex];
        const buttons = gamepad.buttons;
        for (let index = 0; index < 16; index++) {
            if(typeof buttons[index] !== 'undefined'){
                if(buttons[index].pressed == true)
                    controllerEnable = true;}
            else
                break;
        }
        if((gamepad.axes[1] >= DZ || gamepad.axes[1] <= -DZ) || (gamepad.axes[0] >= DZ || gamepad.axes[0] <= -DZ) )
            controllerEnable = true;
    }
}

function keydown(key){
    if(key.key == "a" || key.key == "A"){
        Inputs.x.L = true;}
    if(key.key == "d"|| key.key == "D"){
        Inputs.x.R = true;}

    if(key.key == "w"|| key.key == "W"){
        Inputs.y.U = true;}
     if(key.key == "s"|| key.key == "S"){
        Inputs.y.D = true;}

    if(key.key == " "){
        Inputs.a.pressed = true;}
    if(key.keyCode == 13){
        Inputs.b.pressed = true;}
    if(key.key == "e" || key.key == "E"){
        Inputs.c.pressed = true;}
    
    if(key.keyCode == 27){
        Inputs.enter.pressed = true;}

    if(key.keyCode == 48){
        LoadLevel("Brin.lvl");
    }
    controllerEnable = false;
}

function keyup(key){
    if(key.key == "a" || key.key == "A"){
        Inputs.x.L = false;}
    if(key.key == "d"|| key.key == "D"){
        Inputs.x.R = false;}

    if(key.key == "w"|| key.key == "W"){
        Inputs.y.U = false;}
    if(key.key == "s"|| key.key == "S"){
        Inputs.y.D = false;}

    if(key.key == " "){
        Inputs.a.pressed = false;}
    if(key.keyCode == 13){
        Inputs.b.pressed = false;}
    if(key.key == "e" || key.key == "E"){
        Inputs.c.pressed = false;}
    
    if(key.keyCode == 27){
        Inputs.enter.pressed = false;}

}

export function SetScreen(y){
    Screen = y;
}

export function LoadLevel(LevelName){
    
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", "levels/" + LevelName, false);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                //reset varaibles
                LevelX = [];
                window.Players = [];
                ShowGameUI = false;
                NoPause = false;
                cameraX = -32;
                cameraY = -32;
                cameraIntX = -32;
                cameraIntY = -32;

                const fileV = rawFile.responseText;
                var HolderD = [];
                var CurrentObjectPriorityList = [""];
                CurrentObjectPriorityList.length = 0;
                var CurrentOBJState = 0;
                var CurrentItem = "";
                var BuildMode = 0;

                for (let index = 0; index < fileV.length; index++) {
                    const elt = String(fileV[index]);
                    if(BuildMode ==1){
                        //adds level collision and shit data
                        CurrentItem +=(elt);
                        if(elt == ','){
                            HolderD.push(parseFloat(CurrentItem));
                            //console.log(parseFloat(CurrentItem));
                            CurrentItem = "";
                        }
                    }
                    else if(BuildMode == -2){
                        if(elt == '-')
                            BuildMode = 0;
                        else if(elt == ','){
                            SpriteTileRef.push(parseInt(CurrentItem));
                            CurrentItem = "";
                        }
                        else{
                            CurrentItem +=(elt);}
                    }
                    else if(BuildMode == -1){
                        if(elt == '!'){
                            TileTextureImage = image(CurrentItem);
                            console.log(CurrentItem)
                            //BuildMode = 0;
                            CurrentItem = "";
                        }else if(elt == '-'){
                            BuildMode = -2;
                            SpriteTileRef = [];
                        }
                        else{
                            CurrentItem +=(elt);}
                    }
                    else if(BuildMode == 2){
                        if(elt != ',')
                            CurrentItem+=(elt);
                        else{
                            CurrentObjectPriorityList.push(String(CurrentItem));
                            //console.log(parseFloat(CurrentItem));
                            CurrentItem = "";
                        }
                        if(elt == "}"){
                            //objectLoadList[CurrentObjectPriorityList[0]].position.x = CurrentObjectPriorityList[1];
                            //objectLoadList[CurrentObjectPriorityList[0]].position.y = CurrentObjectPriorityList[2];
                            console.log(String(CurrentObjectPriorityList[0]))
                            switch(String(CurrentObjectPriorityList[0])){
                                case "Player":
                                    var Pl = new player();
                                    Pl.position.x = parseFloat(CurrentObjectPriorityList[1]);
                                    Pl.position.y = parseFloat(CurrentObjectPriorityList[2]);
                                    Pl.angle = parseFloat(CurrentObjectPriorityList[3]);
                                    Pl.CharacterSkin = CharacterSpawnSet;
                                    window.Players.push(Pl);
                                break;
                                case "ShiGuy":
                                    var Pic = new ShiGuy();
                                    Pic.position.x = parseFloat(CurrentObjectPriorityList[1]);
                                    Pic.position.y = parseFloat(CurrentObjectPriorityList[2]);
                                    Pic.Direction = parseFloat(CurrentObjectPriorityList[4]);
                                    window.Players.push(Pic);
                                break;
                                case "FlyGuy":
                                    var Pic = new FlyGuy();
                                    Pic.position.x = parseFloat(CurrentObjectPriorityList[1]);
                                    Pic.position.y = parseFloat(CurrentObjectPriorityList[2]);
                                    Pic.Direction = parseFloat(CurrentObjectPriorityList[4]);
                                    window.Players.push(Pic);
                                break;
                                case "Turnip":
                                    var Pic = new PickUpOBJ();
                                    Pic.position.x = parseFloat(CurrentObjectPriorityList[1]);
                                    Pic.position.y = parseFloat(CurrentObjectPriorityList[2]);
                                    //Pic.angle = parseFloat(CurrentObjectPriorityList[3]);
                                    window.Players.push(Pic);
                                break;
                                case "Goal":
                                    var Gol = new GoalOBJ();
                                    Gol.position.x = parseFloat(CurrentObjectPriorityList[1]);
                                    Gol.position.y = parseFloat(CurrentObjectPriorityList[2]);
                                    //Pic.angle = parseFloat(CurrentObjectPriorityList[3]);
                                    Gol.LoadLevel = CurrentObjectPriorityList[4];
                                    window.Players.push(Gol);
                                break;
                                case "Mushroom":
                                    var Mus = new PickUpOBJ();
                                    Mus.position.x = parseFloat(CurrentObjectPriorityList[1]);
                                    Mus.position.y = parseFloat(CurrentObjectPriorityList[2]);
                                    Mus.spriteOffsetX = 3;
                                    Mus.RideAble = true;
                                    Mus.ChangePickUp = false;
                                    Mus.HasCollision = true;
                                    //Pic.angle = parseFloat(CurrentObjectPriorityList[3]);
                                    window.Players.push(Mus);
                                break;
                                case "MainMenu":
                                    var Agnt = new MainMenu();
                                    Agnt.position.x = parseFloat(CurrentObjectPriorityList[1]);
                                    Agnt.position.y = parseFloat(CurrentObjectPriorityList[2]);
                                    window.Players.push(Agnt);
                                break;
                                case "OptionsMenu":
                                    var Agnt = new OptionsMenu();
                                    Agnt.position.x = parseFloat(CurrentObjectPriorityList[1]);
                                    Agnt.position.y = parseFloat(CurrentObjectPriorityList[2]);
                                    window.Players.push(Agnt);
                                break;
                                case "Box":
                                    var box = new BasicBox();
                                    box.position.x = parseFloat(CurrentObjectPriorityList[1]);
                                    box.position.y = parseFloat(CurrentObjectPriorityList[2]);
                                    box.position.angle = parseFloat(CurrentObjectPriorityList[3]);
                                    window.Players.push(box);
                                break;
                                case "GameUI":
                                    ShowGameUI = true;
                                break;
                                case "NoPause":
                                    NoPause = true;
                                break;
                                case "BG":
                                    BGImg = image(CurrentObjectPriorityList[1]);
                                break;
                                case "DeathPlane":
                                    DeathPlaneHeight = parseFloat(CurrentObjectPriorityList[1]);
                                break;
                                case "Music":
                                    PlayMusic(CurrentObjectPriorityList[1]);
                                break;
                            }
                            //RTOB.position.x = CurrentObjectPriorityList[1];
                            //RTOB.position.y = CurrentObjectPriorityList[2];
                            CurrentObjectPriorityList = [];
                            CurrentItem = "";
                            CurrentOBJState = 0;
                            //console.log(CurrentObject);
                            //window.Players.push(RTOB);
                        }
                    }
                    else if(BuildMode == 3){
                        CurrentItem +=(elt);
                        if(elt == ','){
                            LevelTimes.push(parseFloat(CurrentItem));
                            CurrentItem = "";
                        }
                    }

                    //checks for object and entity
                    switch(elt){
                        case "[":
                            BuildMode = 1;
                            CurrentItem = "";
                            break;
                        case "]":
                            BuildMode = 0;
                            break;
                        case "{":
                            BuildMode = 2;
                            CurrentItem = "";
                            break;
                        case "}":
                            BuildMode = 0;
                            break;
                        case "(":
                            BuildMode = 3;
                            CurrentItem = "";
                            break;
                        case ")":
                            BuildMode = 0;
                            break;
                        case "*":
                            BuildMode = -1;
                            CurrentItem = "";
                            break;
                    }
                    
                }
                LevelX = HolderD;
                InBrows = true;
                //console.log(HolderD)
                //alert(allText);
            }
            gameMastRestartFunc();
            CurrentLevel = LevelName;
        }
    }
    rawFile.send(null);
    
}

export function LoadLevelTransition(Level, Time = 1){
    if(LevelToLoad == ""){
        TimeWhenStartTransition = Time;
        LevelToLoad = Level;
    }
}

export function CoinsAdd(v){
    window.Coins+=v;
    const rubGH = window.Coins;
    setCookie("Coins", rubGH, 30);
    console.log(rubGH);
}

if(getCookie("PlanetScore") != "")
    window.PlanetScore = getCookie("PlanetScore");

function setCookie(Sname,Svalue,exdays) {
    const T = new Date();
    T.setTime(T.getTime() + (exdays*24*60*60*1000));
    let expires = "expires=" + T.toUTCString();
    document.cookie = Sname + "=" + Svalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }

function LoadRubbie()
{
    const amount = getCookie("Coins");
    if(amount != "")
        window.Coins = parseInt(amount);
    else
        window.Coins = 0;
    console.log(amount);
}
LoadRubbie();

export function MoveCamTarget(x,y){
    cameraX = x;
    cameraY = y;
}

export const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

export function lerp (start, end, amt){
    return (1-amt)*start+amt*end
}
export function VectLerpAngle(A, B, T){
    const Cx = (Math.sin(Math.PI / 180.0 * (A)));
    const Cy = (-Math.cos(Math.PI / 180.0 * (A)));
    const Tx = (Math.sin(Math.PI / 180.0 * (B)));
    const Ty = (-Math.cos(Math.PI / 180.0 * (B)));
    const x = Math.atan2(lerp(Cx, Tx, T),-lerp(Cy, Ty, T)) * 180.0 / Math.PI;
    return x;
}
function repeat(t, m) {
    return clamp(t - Math.floor(t / m) * m, 0, m);
}

export function lerpAngle(A,B,T){
    const dt = repeat(B - A, 360);
    return lerp(A, A + (dt > 180 ? dt - 360 : dt), T);
}

export function magnitude(X,Y){
    return Math.sqrt((X * X) + (Y * Y));
}
export function pointCircle(px, py, cx, cy,r) {
    const distX = px - cx;
    const  distY = py - cy;
    const distance = Math.sqrt( (distX*distX) + (distY*distY) );
    if (distance <= r) 
      return true;
    return false;
  }

export function DrawCirle (x0, y0, radius) {
    var x = radius;
    var y = 0;
    var radiusError = 1 - x;
    
    while (x >= y) {
      ctx.fillRect(x + x0, y + y0, 1, 1);
      ctx.fillRect(y + x0, x + y0, 1, 1);
      ctx.fillRect(-x + x0, y + y0, 1, 1);
      ctx.fillRect(-y + x0, x + y0, 1, 1);
      ctx.fillRect(-x + x0, -y + y0, 1, 1);
      ctx.fillRect(-y + x0, -x + y0, 1, 1);
      ctx.fillRect(x + x0, -y + y0, 1, 1);
      ctx.fillRect(y + x0, -x + y0, 1, 1);
      y++;
      
      if (radiusError < 0) {
          radiusError += 2 * y + 1;
      }
      else {
          x--;
          radiusError+= 2 * (y - x + 1);
      }
    }
};

export function DrawChar(charRef,x,y,rot){
    const CharIntLocal = (Number((charRef.charCodeAt(0))) - 32);
    ctx.imageSmoothingEnabled = false;
    ctx.save();
    ctx.translate(x+4, y+4);
    ctx.rotate(Math.round(rot)*(Math.PI/180.0));
    ctx.translate(-x-4, -y-4);
    ctx.drawImage(TextImg,0, 8*CharIntLocal, 8, 8, x, y, 8, 8);
}
export function DrawText(TextRef,Side,x,y,rot){
    var offX = 0, offY = 0, Centre = ((Side + 1) / 2) * (TextRef.length * 8);
    var EndCap = 0;
    for (let r = 0; r < TextRef.length; r++) {
        const element = TextRef[r];
        if(EndCap > 0)
            {offX -= EndCap; EndCap = 0;}
        if(element == '.'){
            offX -= 2; EndCap = 2;}
        if(element == '\n'){
            offY += 8; offX -= r * 8 + offX;
        }
        DrawChar(element, x + r * 8 + offX - Centre, y + offY, rot);
    }
}

export function drawImage(rtx, image, Sx, Sy, Sw, Sh, x, y, w, h, degrees){
    rtx.imageSmoothingEnabled = false;
    rtx.save();
    rtx.translate(x+w/2, y+h/2);
    rtx.rotate(Math.round(degrees)*(Math.PI/180.0));
    rtx.translate(-x-w/2, -y-h/2);
    rtx.drawImage(image,Sx, Sy, Sw, Sh, x, y, w, h);
    rtx.restore();
}
export function drawTextLoop(rtx, image, Sx, Sy, Sw, Sh, x, y, w, h){
    rtx.imageSmoothingEnabled = false;
    rtx.save();
    const xRows = clamp(Math.ceil(w / Sw),1,128);
    const yRows = clamp(Math.ceil(h / Sh),1,128);
    //console.log("s"+xRows);
    for (let Yi = 0; Yi < yRows; Yi++) {
        for (let Xi = 0; Xi < xRows; Xi++) {
            //crop sprite tile edges
            //Check if drawing on screen
            if(x + (Xi * Sw) < 160 && x + (Xi * Sw) + Sw > 0 && y + (Yi * Sh) < 160 && y + (Yi * Sh) + Sh > 0){
            
            if(Xi >= xRows - 1 && Yi >= yRows - 1)
                rtx.drawImage(image,Sx, Sy, w -((xRows - 1) * Sw), h - ((yRows - 1) * Sh), x + (Xi * Sw), y + (Yi * Sh), w -((xRows - 1) * Sw), h - ((yRows - 1) * Sh));
            else if(Xi >= xRows - 1)
                rtx.drawImage(image,Sx, Sy, w -((xRows - 1) * Sw), Sh, x + (Xi * Sw), y + (Yi * Sh), w - ((xRows - 1) * Sw), Sh);
            else if(Yi >= yRows - 1)
                rtx.drawImage(image,Sx, Sy, Sw, h - ((yRows - 1) * Sh), x + (Xi * Sw), y + (Yi * Sh), Sw, h - ((yRows - 1) * Sh));
            else
                rtx.drawImage(image,Sx, Sy, Sw, Sh, x + (Xi * Sw), y + (Yi * Sh), Sw, Sh);
            }
        }
        
    }
    ///rtx.translate(x+w/2, y+h/2);
    //rtx.rotate(Math.round(degrees)*(Math.PI/180.0));
    ///rtx.translate(-x-w/2, -y-h/2);
    rtx.restore();
}

export function lineline(x1, y1, x2, y2, x3, y3, x4, y4) {

    // calculate the direction of the lines
    const uA = ((x4-x3)*(y1-y3) - (y4-y3)*(x1-x3)) / ((y4-y3)*(x2-x1) - (x4-x3)*(y2-y1));
    const uB = ((x2-x1)*(y1-y3) - (y2-y1)*(x1-x3)) / ((y4-y3)*(x2-x1) - (x4-x3)*(y2-y1));
  
    // if uA and uB are between 0-1, lines are colliding
    if (uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1) {
  
      // optionally, draw a circle where the lines meet
      const intersectionX = x1 + (uA * (x2-x1));
      const intersectionY = y1 + (uA * (y2-y1));
  
      //Ellipise(intersectionX, intersectionY, 20, 20);
  
      return true;
    }
    return false;
  }

export function VeclineLine(x1, y1, x2, y2, x3, y3, x4, y4) {
    // calculate the direction of the lines
    var uA = ((x4-x3)*(y1-y3) - (y4-y3)*(x1-x3)) / ((y4-y3)*(x2-x1) - (x4-x3)*(y2-y1));
    var  uB = ((x2-x1)*(y1-y3) - (y2-y1)*(x1-x3)) / ((y4-y3)*(x2-x1) - (x4-x3)*(y2-y1));
  
    // if uA and uB are between 0-1, lines are colliding
    if (uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1) {
  
      // optionally, draw a circle where the lines meet
      var intersectionX = x1 + (uA * (x2-x1));
      var intersectionY = y1 + (uA * (y2-y1));
  
      //Ellipise(intersectionX, intersectionY, 20, 20);
      x2 = intersectionX; y2 = intersectionY;
    }
    return {x2,y2};
  }

export function lineBlock(lx1,ly1,lx2,ly2,bx,by,bw,bh){
    var WallPoints = [VeclineLine(lx1, ly1, lx2, ly2, bx, by, bx + bw, by),VeclineLine(lx1, ly1, lx2, ly2, bx, by + bh, bx + bw, by + bh),VeclineLine(lx1, ly1, lx2, ly2, bx, by, bx, by + bh), VeclineLine(lx1, ly1, lx2, ly2, bx + bw, by, bx + bw, by + bh)];
    var closest = {x2 : lx2, y2 : ly2, Nx : 0, Ny : 0};
    const PreCalcNorms = [{x2 : 0, y2 : 1}, {x2 : 0, y2 : -1}, {x2 : -1, y2 : 0}, {x2 : 1, y2 : 0}]
    for (let index = 0; index < WallPoints.length; index++) {
        const element = WallPoints[index];
        if(magnitude(element.x2 - lx1,element.y2 - ly1) < magnitude(closest.x2 - lx1,closest.y2 - ly1)){
            closest = WallPoints[index];
            closest.Nx = PreCalcNorms[index].x2; 
            closest.Ny = PreCalcNorms[index].y2;
        }
    }
    return closest;
}
export function boxbox(x1,y1,x2,y2,x3,y3,x4,y4){
    if((x1 <= x4 && x2 >= x3 && y1 <= y4 && y2 >= y3)){
        return true;}
    return false;
}
export function pointbox(x1,y1,x2,y2,x3,y3){
    if((x1 >= x2 && x1 <= x3 && y1 >= y2 && y1 <= y3)){
        return true;}
    return false;
}
//Music
export function PlayMusic(Track, Time = 0){
    MusicTrackTitle = Track;
    MusicTrack.currentTime = 0;
    MusicTrack.pause();
    MusicTrack = new Audio("sounds/Music/" + Track + '.mp3');
    MusicTrack.volume = window.MusicVolume;
    MusicTrack.currentTime = Time;
    MusicTrack.play();
}
//Sound Effects
export function PlaySound(SFX, Volume = 1, Pitch = 1){
    SFXTrack = new Audio("sounds/SFX/" + SFX + '.mp3');
    SFXTrack.pitch = Pitch;
    SFXTrack.volume = Volume * window.SFXVolume;
    SFXTrack.play();
}

export function SetPlayer(Player = 0){
    CharacterSpawnSet = Player;
}

//Level Drawing
function DrawLevel(Upper = false){
    for (let index = 0; index < Math.ceil(LevelX.length / MasterArrayLevelSize); index++) {
        const indev = index * MasterArrayLevelSize;
        //render if in frame
        if(LevelX[indev] > cameraIntX + 160 || LevelX[indev] + LevelX[indev + 2] < cameraIntX){
            //console.log("norend")
        }
        else{
            //if((Upper == true && LevelX[indev+5] >= 0) || (Upper == false && LevelX[indev+5] < 0)){
            const textFlow = (LevelX[indev+4] - 1) * 4;
            if((LevelX[indev+4]) == 0 || window.DetailLow){
                ctx.fillStyle = "#83758b";
                if((LevelX[indev+5]) < 0)
                    ctx.fillStyle = "#d1cfc9";
                else if((LevelX[indev+5]) > 0)
                    ctx.fillStyle = "#4d4c49";

                ctx.fillRect(LevelX[indev] - cameraX,LevelX[indev+1] - cameraY, LevelX[indev+2], LevelX[indev+3]);}
            else
                drawTextLoop(ctx, TileTextureImage,SpriteTileRef[textFlow],SpriteTileRef[textFlow+1],clamp(LevelX[indev+2],0,SpriteTileRef[textFlow+2]),clamp(LevelX[indev+3],0,SpriteTileRef[textFlow+3]), LevelX[indev] - cameraIntX, LevelX[indev+1] - cameraIntY,LevelX[indev+2], LevelX[indev+3]);
            //}
        }

        //LevelX.length[indev];
        
    }
}

function clearScreen(){
    ctx.fillStyle = "#43523d";
    ctx.fillRect(0,0, canvas.width, canvas.height);
    drawImage(ctx, BGImg, 0,0,160,160,0,0,160,160,0);
}

var Last = Date.now(), Now = Date.now();

window.addEventListener('focus', function (event) {
    Last = Date.now();
});
window.addEventListener('blur', function (event) {
    Last = Date.now();
    InBrows = false;
    MusicTrack.pause();
});

document.addEventListener("visibilitychange", () => {
    //if (document.hidden) {
        InBrows = false;
        Last = Date.now();
        DeltaTime = 0;
        MusicTrack.pause();
    //}
});

canvas.onmousemove = function (event) {
    //dvide free thats the screeen scaling size
    MouseX = Math.round((event.pageX - canvas.offsetLeft) / 3) ;
    MouseY = Math.round((event.pageY - canvas.offsetTop) / 3);
    //console.log("BREX" + MouseX + " BREY" + MouseY)
};

function CallUpdate(){

    DeltaTime = ((Now - Last) / 1000);
    DeltaTime = clamp(DeltaTime, 0, 1);
    Last = Now;
    Now = Date.now();
    //console.log(1/DeltaTime);
    
    if(Last != Now)
        Update();
    
    //control extras
    if(Inputs.x.L == true){
        Inputs.x.Axis = -1;Inputs.x.LastAxis = -1;}
    else if(Inputs.x.R == true){
        Inputs.x.Axis = 1;Inputs.x.LastAxis = 1;}
    else
        Inputs.x.Axis = 0;

    if(Inputs.y.D == true){
        Inputs.y.Axis = -1;Inputs.y.LastAxis = -1;}
    else if(Inputs.y.U == true){
        Inputs.y.Axis = 1;Inputs.y.LastAxis = 1;}
    else
        Inputs.y.Axis = 0;

    controllerInput();
    //setInterval(Update,1000);
    //canvas.
    requestAnimationFrame(CallUpdate);
}
CallUpdate();

function Update(){
    clearScreen();

    if(Inputs.enter.pressed == true && PauseButtonPressed == false){
        InBrows = !InBrows; PauseTimeSinc = 0;
        PauseButtonPressed = true;}
    if(Inputs.enter.pressed == false){
        PauseButtonPressed = false;}

    cameraIntX = Math.round(cameraX);
    cameraIntY = Math.round(cameraY);

    if(Screen == 0){
        let SlotPreOrg = window.Players;
        SlotPreOrg.sort((a, b) => a.position.z - b.position.z);
        if(InBrows == true || NoPause == true){
            //inPlay
            if(JustPause == true)
                MusicTrack.play();
            
            for (var i = 0; i < window.Players.length; i++) {
                    var CheckXWidth = 0;
                    if(window.Players[i].SelfDraw != true && window.Players[i].position.z < 0)
                        window.Players[i].Draw();
            }
            DrawLevel(false);
            for (var i = 0; i < window.Players.length; i++) {
                var CheckXWidth = 0;
                if(window.Players[i].width != null)
                    CheckXWidth = window.Players[i].width / 2;
                if(window.Players[i].position.x < cameraIntX + 64 + CheckXWidth && window.Players[i].position.x > cameraIntX - CheckXWidth)
                    window.Players[i].Update();
                else if(window.Players[i].CanDoLoad == false)
                    window.Players[i].Update();
                if(window.Players[i].SelfDraw != true && window.Players[i].position.z >= 0)
                    window.Players[i].Draw();
                //Players[i].Draw();
            }
            //DrawLevel(true);

            if(ShowGameUI)
                gameMastUpdateFunc();

            JustPause = false;
        }
        else{
            //paused
            JustPause = true;
            MusicTrack.pause();
            DrawLevel(false);
            for (var i = 0; i < window.Players.length; i++) {
                window.Players[i].Draw();
                //Players[i].Draw();
            }
            //DrawLevel(true);

            ctx.fillStyle = "#f4f4f4";
            ctx.fillRect(8,32 + (PauseSelect*10), 48, 1);
            if(PausePress == false && Inputs.y.Axis != 0)
                {PauseSelect = clamp(PauseSelect - Inputs.y.Axis, 0, 1);   PausePress = true;}
            else{
                PausePress = false;}
            if(Inputs.b.pressed == true ||Inputs.a.pressed == true  ){
                InBrows = true;
                if(PauseSelect == 1)
                    LoadLevelTransition("Menu.lvl",1);
            }
            DrawText("RESUME",0,32,32 - 8,0);
            DrawText("Quit",0,32,32 + 2,0);

            gameMastDrawFunc();

            //Puase Icon shit
            ctx.fillStyle = "#ffffff";
            if(Math.round(PauseTimeSinc)%2 == 0)
            {
                ctx.fillStyle = "#f4f4f4";
                ctx.fillRect(0,0, 1, 64);
                ctx.fillRect(0,0, 64, 1);
                ctx.fillRect(63,0, 1, 64);
                ctx.fillRect(0,63, 64, 1);
            }
            //drawImage(ctx,MasterImage,103,0, 25, 8, 68,0, 25, 8,0);
        
            if(PauseTimeSinc >= 2)
                PauseTimeSinc = 0;
            else
                PauseTimeSinc+=DeltaTime * 4;
        }
    
    }
    else if(Screen == -1){
        //LoadingScreen
        LoadValTime += DeltaTime;
        ctx.fillStyle = "#43523d";
        ctx.fillRect(0,0,canvas.width, canvas.height);
        drawImage(ctx, LogoImage, 0,0,16,16,32 - 8,32 - 8,16,16,0);
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0,63, 64 * LoadValTime, 1);
        if(LoadValTime > 1){
            Screen=0; LoadLevel("Menu.lvl");}
    }

    if(window.KillList.length > 0){
        for (let index = 0; index < window.KillList.length; index++) {
            for (let index2 = 0; index2 < window.Players.length; index2++) {
                if(window.KillList[index] == window.Players[index2]){
                    window.Players.splice(index2, 1);
                }
                
            }
        }

        window.KillList.splice(0,window.KillList.length);
    }

    if(MusicTrack.currentTime >= MusicTrack.duration)
        PlayMusic(MusicTrackTitle);

    if(TimeWhenStartTransition <= 1.5 && TimeWhenStartTransition > 0)
        OpenTransition = false;

    if(TimeWhenStartTransition > 0){
        TimeWhenStartTransition -= DeltaTime;
    }else if(TimeWhenStartTransition <= 0 && LevelToLoad != "")
    {
        LoadLevel(LevelToLoad);
        OpenTransition = true;
        LevelToLoad = "";
    }
    TransitionVal = ScreenTime;
    if(OpenTransition)
        ScreenTime = clamp(ScreenTime - (1 / TransitionForTime) * DeltaTime, 0 ,1);
    else
        ScreenTime = clamp(ScreenTime + (1 / TransitionForTime) * DeltaTime, 0 ,1);
    ctx.globalAlpha = TransitionVal;
    ctx.fillStyle = "#000000";
    ctx.fillRect(0,0,canvas.width, canvas.height);
    ctx.globalAlpha = 1;

}

export {DeltaTime, cameraX, cameraIntX, cameraY, cameraIntY, MouseX, MouseY, PlayerImage, TitleImage, TextImg, MissItems, InBrows, EntityImage, TileTextureImage, MusicTrackTitle, SpriteTileRef, MusicTrack, SFXTrack, CurrentLevel, DeathPlaneHeight};