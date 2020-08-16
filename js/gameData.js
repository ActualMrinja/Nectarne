ctx = nectarneCanvas.getContext("2d");

/**Hello there! You must be one of those young queens ready to start a colony. Thats nice to see this land hasn't been forgotten. I'm Terrace the Termite. I see a lot of potential here, I've been needing to do something about these two but I never had the item - meet Antonio and Walker.**/ 

date = new Date();
months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    
//References other items
bugCompendium = ["Ant","Termite","Fly","Wriggler","Mosquito","Water_Tiger","Diving_Beetle","Glowworm","Firefly","Caterpillar","Butterfly","Pondskater","Bed_Bug","Bee","Weta","Mantis","Scorpion","Spider","Millipede","Centipede","Tarantula","Wasp","Giant_Water_Bug","Dragonfly_Nymph","Dragonfly"];

//Current deal, deal date, deal duration (hours), possible deals,
shop = [["Ant",new Date(0),1,["Ant","Termite","Fly","Wriggler","Water_Tiger"]],["Glowworm",new Date(0),6,["Glowworm","Caterpillar","Pondskater","Bed_Bug","Bee"]],["Scorpion",new Date(0),24,["Weta","Mantis","Scorpion","Spider","Millipede"]],["Ant",0,"rgb(179,255,179,0.85)"]];

miscNm = ["bugHeader.png","bugImgHeader.png","Health.png","Attack.png","Speed.png","Age.png","CommandCenter.png","Swim.png","Fly.png","Mandible.png","Albino.png","MaleSm.png","FemaleSm.png","ButtonHeader.png","MudBlock.png","SalivaSalvo.png","HiveBlock.png","WoodBlock.png","StoneBlock.png","DartAmbush.png","PrairieBlock.png","PoisonSting.png","BoxContainer.png","Territs.png","Population.png","Food.png","RainDroplet.png","Snowflake.png","Sunny.png","Drizzle.png","Thunderstorm.png","Snowstorm.png","NectarStick.png","NectarBranch.png","ThornstumpFruit.png","TwinbearBerry.png","PorousScreecher.png","HealingClover.png","AgingClover.png","TraitModifier.png","GeneModifier.png","SlouchingMiracle.png","ImmortalHealth.png","Mission.png","LoveField.png","TerritStronghold.png","ShadowHightail.png","NectarGrove.png","ParasiticSting.png","VenomSpray.png","VenomousAmbush.png","Settings.png","LuminescentCavern.png","Soundwave.png","StridulatingRetreat.png","WaterDome.png","DefensiveCoil.png","SpecializedAmbush.png","AirDome.png","SmugglerJunkyard.png","LifeField.png","LifeMeal.png","NoxiousWhimper.png","VitalityField.png","Time.png","CommonBanner.png","RareBanner.png","EpicBanner.png","SpecialBanner.png","HorrendousAmbush.png","Trait.png","DifficultyNormal.png","DifficultyHard.png","DifficultyImpossible.png"];
miscImg = [];

for(let miscImgLoad = 0;miscImgLoad < miscNm.length;miscImgLoad++){
miscImg.push(new Image());
miscImg[miscImg.length-1].src = "images/ui/"+miscNm[miscImgLoad];
}

//User stats
/**Legendary team 
new bugBuild("Berserk",190,200,"Centipede",270),new bugBuild("Webster",190,200,"Tarantula",225),new bugBuild("Blackjacket",150,200,"Wasp",180),new bugBuild("Nessie",190,200,"Giant_Water_Bug",135),new bugBuild("Meganeura",190,200,"Dragonfly",90)

new bugBuild("Berserk",190,200,"Millipede",270),new bugBuild("Webster",190,200,"Spider",225),new bugBuild("Blackjacket",150,200,"Scorpion",180),new bugBuild("Nessie",190,200,"Mantis",135),new bugBuild("Meganeura",190,200,"Weta",90)
**/


bugs = [];
bugs.push();

bugSelected = -1;

rooms = [new facilityBuild(0,0),new facilityBuild(1,1)];

territs = 25;
food = 500;
netFood = 0;
weather = ["Sunny",0];
for(let weatherParticles = 0;weatherParticles < 30;weatherParticles++){
weather.push([Math.random()*528,-50-Math.random()*250]);
}

mousex = 0;
mousey = 0;
mousedown = false;
keyUp = -1;
scrollx = 0;

music = new Audio("muzak/MainTheme.mp3");
musicvolume = 0.7;
music.volume = 0.7;
music.play();

soundeffectvolume = 1;
sounds = [0,0,0,0,0,0,0,0,0,0];
soundsloop = 0;

boxSelector = "";
boxAnimation = 0;
page = 0;
nameFilterContainer = "";
nameFilter = "";
filterSelected = false;   

battleMode = false;
battleInfo = [];

battleMap = [];
battleEnemies = [];
battleBugs = [];
bugEnemiesOnScreen = 0;

//Name, Species, Dialogue, Typewriter
textInfo = [new Image()];

if(localStorage.length > 2){ load() }

mainGame = function(){
date = new Date();   

if(localStorage.length > 2&&Number(JSON.parse(localStorage.getItem("FullScreen"))) !== nectarneCanvas.width||(!document.fullscreenElement&&!document.mozFullScreenElement&&!document.webkitFullscreenElement&&!document.msFullscreenElement&&!document.webkitCurrentFullScreenElement&&nectarneCanvas.width !== 528)){
  fullScreen();
  save("FullScreen",nectarneCanvas.width)
}     
    
ctx.save(); 
ctx.translate(0,0);
ctx.scale(nectarneCanvas.width/528,nectarneCanvas.width/528);
    
grd = ctx.createLinearGradient(530/2,0,530/2,300);
   
if(!battleMode||(battleMode&&(missions[battleInfo[0]].type == "Skies"||missions[battleInfo[0]].type == "Pond"||missions[battleInfo[0]].type == "Prairie"))){
grd.addColorStop(0, "hsl(200, "+(100-(weather[0] == "Drizzle" ? 5*weather[1] : weather[0] == "Thunderstorm" ? 10*weather[1] : weather[0] == "Snowstorm" ? 15*weather[1] : 5*weather[1]))+"%, "+(70-Math.abs(12-date.getHours())*4-(date.getMinutes()/15))+"%)");
grd.addColorStop(0.33, "hsl(200,"+(100-(weather[0] == "Drizzle" ? 5*weather[1] : weather[0] == "Thunderstorm" ? 10*weather[1] : weather[0] == "Snowstorm" ? 15*weather[1] : 5*weather[1]))+"%, "+(60-Math.abs(12-date.getHours())*4-(date.getMinutes()/15))+"%)");
grd.addColorStop(0.66, "hsl(200, "+(100-(weather[0] == "Drizzle" ? 5*weather[1] : weather[0] == "Thunderstorm" ? 10*weather[1] : weather[0] == "Snowstorm" ? 15*weather[1] : 5*weather[1]))+"%, "+(50-Math.abs(12-date.getHours())*4-(date.getMinutes()/15))+"%)");
} else if(battleMode&&missions[battleInfo[0]].type == "Nest") {
grd.addColorStop(0, "hsl(40, "+(100-(weather[0] == "Drizzle" ? 5*weather[1] : weather[0] == "Thunderstorm" ? 10*weather[1] : weather[0] == "Snowstorm" ? 15*weather[1] : 5*weather[1]))+"%, "+(32-Math.abs(12-date.getHours())-(date.getMinutes()/60))+"%)");
grd.addColorStop(0.33, "hsl(40,"+(100-(weather[0] == "Drizzle" ? 5*weather[1] : weather[0] == "Thunderstorm" ? 10*weather[1] : weather[0] == "Snowstorm" ? 15*weather[1] : 5*weather[1]))+"%, "+(22-Math.abs(12-date.getHours())-(date.getMinutes()/60))+"%)");
grd.addColorStop(0.66, "hsl(40, "+(100-(weather[0] == "Drizzle" ? 5*weather[1] : weather[0] == "Thunderstorm" ? 10*weather[1] : weather[0] == "Snowstorm" ? 15*weather[1] : 5*weather[1]))+"%, "+(12-Math.abs(12-date.getHours())-(date.getMinutes()/60))+"%)");
} else if(battleMode&&missions[battleInfo[0]].type == "Hive") {
grd.addColorStop(0, "hsl(50, "+(100-(weather[0] == "Drizzle" ? 5*weather[1] : weather[0] == "Thunderstorm" ? 10*weather[1] : weather[0] == "Snowstorm" ? 15*weather[1] : 5*weather[1]))+"%, "+(100-Math.abs(12-date.getHours())-(date.getMinutes()/60))+"%)");
grd.addColorStop(0.33, "hsl(50,"+(100-(weather[0] == "Drizzle" ? 5*weather[1] : weather[0] == "Thunderstorm" ? 10*weather[1] : weather[0] == "Snowstorm" ? 15*weather[1] : 5*weather[1]))+"%, "+(90-Math.abs(12-date.getHours())-(date.getMinutes()/60))+"%)");
grd.addColorStop(0.66, "hsl(50, "+(100-(weather[0] == "Drizzle" ? 5*weather[1] : weather[0] == "Thunderstorm" ? 10*weather[1] : weather[0] == "Snowstorm" ? 15*weather[1] : 5*weather[1]))+"%, "+(80-Math.abs(12-date.getHours())-(date.getMinutes()/60))+"%)");
}
    
ctx.clearRect(0,0,nectarneCanvas.width,nectarneCanvas.height);
  
ctx.globalAlpha = 1;
ctx.fillStyle = grd;
ctx.fillRect(0,0,nectarneCanvas.width,nectarneCanvas.height);

if(battleMode){    
    
for(blockY = 5;blockY > -1;blockY--){
    for(blockX = Math.floor(scrollx/50);blockX < Math.floor(scrollx/50)+12;blockX++){
        /**Solid Blocks**/
        if(battleMap[blockY][blockX] == 1){
        ctx.globalAlpha = 1;
        ctx.drawImage(miscImg[missions[battleInfo[0]].type == "Nest" ? 14 : missions[battleInfo[0]].type == "Hive" ? 16 : missions[battleInfo[0]].type == "Skies" ? 17 : missions[battleInfo[0]].type == "Pond" ? 18 : 20],blockX*50-scrollx,blockY*50-2.5,55,55); 
          if(battleBugs.length > 0){ battleBugs[0].collision([blockX*50,blockY*50,55,55,[blockY,blockX]]); }
            for(enemyLoad in battleEnemies){ 
            battleEnemies[enemyLoad].collision([blockX*50,blockY*50,55,55,[blockY,blockX]]) 
            }
        /** Water **/
        } else if(battleMap[blockY][blockX] == 2){
        ctx.fillStyle = "#4da6ff"
        ctx.globalAlpha = 0.9;
            if(battleMap[blockY-1][blockX] == 2) { 
                ctx.fillRect(blockX*50-scrollx,blockY*50+2,50.4,50); 
            } else {
               ctx.fillRect(blockX*50-scrollx,blockY*50+30,50.4,25); 
            }
            
            if(battleBugs.length > 0){ battleBugs[0].collision([blockX*50,blockY*50+(battleMap[blockY-1][blockX] == 2 ? 2 : 30),50,(battleMap[blockY-1][blockX] == 2 ? 50 : 25),[blockY,blockX]]); }
            for(enemyLoad in battleEnemies){ 
            battleEnemies[enemyLoad].collision([blockX*50,blockY*50+(battleMap[blockY-1][blockX] == 2 ? 2 : 30),50,(battleMap[blockY-1][blockX] == 2 ? 50 : 25),[blockY,blockX]]);
             }
        /** Gate Blocks **/
        } else if(battleMap[blockY][blockX] == 3){
             ctx.drawImage(miscImg[missions[battleInfo[0]].type == "Nest" ? 14 : missions[battleInfo[0]].type == "Hive" ? 16 : missions[battleInfo[0]].type == "Skies" ? 17 : missions[battleInfo[0]].type == "Pond" ? 18 : 20],0,150-miscImg[14].height/12,miscImg[14].width,miscImg[14].height/12,blockX*50-scrollx,blockY*50+55,55,55/12); 
             if(battleBugs.length > 0&&battleBugs[0].X > blockX*50+55){ 
                 battleMap[blockY][blockX] = 1;
                 soundeffect("GateClose.mp3");
             }
        /** Summon Blocks **/ 
        } else if(battleMap[blockY][blockX] >= 4&&battleMap[blockY][blockX] <= 6){
          if(battleMap[blockY][blockX] == 5||battleMap[blockY][blockX] == 6){                                                     
        battleEnemies.push(new bugBuild(missions[battleInfo[0]].secondary.split("_").join(" ")+" Hunter",blockX*50+11.5,blockY*50+50,missions[battleInfo[0]].secondary,225,true,Math.floor(Math.random()*11)+80));
         }
         if(battleMap[blockY][blockX] == 6||battleMap[blockY][blockX] == 4){ battleEnemies.push(new bugBuild(missions[battleInfo[0]].primary.split("_").join(" ")+" Warmonger",blockX*50+22.5,blockY*50+50,missions[battleInfo[0]].primary,270,true,Math.floor(Math.random()*11)+90)); 
         }
          if(battleMap[blockY][blockX] == 5||battleMap[blockY][blockX] == 6){                                                            
        battleEnemies.push(new bugBuild(missions[battleInfo[0]].secondary.split("_").join(" ")+" Hunter",blockX*50+33.5,blockY*50+50,missions[battleInfo[0]].secondary,225,true,Math.floor(Math.random()*11)+80));
         }
         battleMap[blockY][blockX] = 0; 
        /** Territ Blocks ***/
        } else if(battleMap[blockY][blockX] == 7) {
         ctx.save();
         ctx.translate(blockX*50-scrollx+55/2,blockY*50+55/2);
         ctx.scale(date.getMilliseconds() > 500 ? -1+Math.abs(750-date.getMilliseconds())/250 : 1-Math.abs(250-date.getMilliseconds())/250,1);
         ctx.drawImage(miscImg[23],-10,-10,30/1.5,30/1.5);
         ctx.restore();
         if(battleBugs.length > 0&&collision(blockX*50+55/2-10,blockY*50+55/2-10,30/1.5,30/1.5,battleBugs[0].X-battleBugs[0].Image.width/144*(battleBugs[0].Age/150+0.5),battleBugs[0].Y-battleBugs[0].Image.height/36*(battleBugs[0].Age/150+0.5)-battleBugs[0].Image.height/72,battleBugs[0].Image.width/72*(battleBugs[0].Age/150+0.5),battleBugs[0].Image.height/36*(battleBugs[0].Age/150+0.5))){  
           battleInfo[1][1][0] += this.Trait == 3 ? 20 : 10;
           soundeffect("Territ.mp3");
           battleMap[blockY][blockX] = 0; 
         } 
        }
    }
}
       
    bugEnemiesOnScreen = battleEnemies.filter(bugsOnScreen => bugsOnScreen.X-scrollx > -10&&bugsOnScreen.X < 538+scrollx);
    for(enemyDraw = 0; enemyDraw < bugEnemiesOnScreen.length; enemyDraw++){ 
      bugEnemiesOnScreen[enemyDraw].draw();
    } 
   
    //Bugs not on screen can't be infoed
    if(bugSelected !== -1&&bugSelected.Enemy&&bugEnemiesOnScreen.indexOf(bugSelected) == -1){ bugSelected = -1 }
  
    if(battleBugs.length > 0){ battleBugs[0].draw(); }
    
    if(battleBugs.length > 0){ bugBubble(0,5,0.75,false,battleBugs[0]); } else if(boxSelector == "") { music.pause(); soundeffect("MissionFail.mp3"); boxSelector = "Pause"; boxAnimation = -300; }
    if(battleBugs.length > 1){ bugBubble(5,65,0.5,false,battleBugs[1]); textmaker("1",25,75,10,true); }
    if(battleBugs.length > 2){ bugBubble(45,45,0.5,false,battleBugs[2]); textmaker("2",65,55,10,true); }
    if(battleBugs.length > 3){ bugBubble(60,5,0.5,false,battleBugs[3]); textmaker("3",80,15,10,true); }
    if(music.src.split("/")[music.src.split("/").length-1] == "QueenTheme.mp3"&&textInfo.length == 1&&battleEnemies.length > 0&&battleEnemies[0].Age > 100){ bugBubble(410,20,1,false,battleEnemies[0]); textmaker(battleEnemies[0].Name,445,30,20,true); }    
    
} else { 
    
 //Teresa dialogue
 if((rooms[0].MissionList.length == 0||rooms[0].MissionList[0][0] < 15)){ tutorial(); }  
 if(bugs.length < 2&&territs < 25){ territs = 25; textInfo.push(["Teresa","Termite","It seems as though you're in a sticky situation! Here's some territs.",0]); }   
    
 rooms[Math.floor(scrollx/531)].draw(Math.floor(scrollx/531)); 
 rooms[Math.floor(scrollx/531)+1].draw(Math.floor(scrollx/531)+1); 
      
 if(boxSelector == ""){
  netFood = 0;
  for(bugDraw in bugs){ 
   bugs[bugDraw].draw();
  }
 } 
  
 /**Dome Display**/
 ctx.globalAlpha = 0.8;
 if(rooms[Math.floor(scrollx/528)].Type == 8||rooms[Math.floor(scrollx/528)].Type == 9){ 
 ctx.drawImage(miscImg[facilities[rooms[Math.floor(scrollx/528)].Type].miscIndex],Math.floor(rooms[Math.floor(scrollx/528)].Animation)*1584+24,0,1551,891,(528*rooms[Math.floor(scrollx/528)].Index)+8-scrollx,0,517,297); }   
 if(rooms[Math.floor(scrollx/528)+1] !== undefined&&(rooms[Math.floor(scrollx/528)+1].Type == 8||rooms[Math.floor(scrollx/528)+1].Type == 9)){
  ctx.drawImage(miscImg[facilities[rooms[Math.floor(scrollx/528)+1].Type].miscIndex],Math.floor(rooms[Math.floor(scrollx/528)+1].Animation)*1584+24,0,1551,891,(528*rooms[Math.floor(scrollx/528)+1].Index+1)+8-scrollx,0,517,297); }
 ctx.globalAlpha = 1;
 /**Dome Display**/
    
 ctx.drawImage(miscImg[13],10,10,miscImg[13].width/3,miscImg[13].height/3);
 ctx.drawImage(miscImg[13],120,10,miscImg[13].width/3,miscImg[13].height/3);
 ctx.drawImage(miscImg[13],230,10,miscImg[13].width/3,miscImg[13].height/3);
 territs = Math.min(99999,territs);
 food = Math.min(99999,food);
 textmaker(""+Math.floor(territs),45,36,20,false);
 textmaker(""+bugs.length+"/"+(rooms.length*8),155,35,20,false,(bugs.length < rooms.length*8) ? "white" : "crimson");
 textmaker(""+Math.ceil(food),264,36,20,false,netFood > 0 ? "springGreen" : netFood == 0 ? "white" : "crimson");
 ctx.save();
 collision(mousex,mousey,0,0,10,15,30,30) && rooms[0].MissionList.length > 0 ? ctx.filter = "brightness(150%)" : ctx.filter = ""; 
 if(boxSelector == ""&&rooms[0].MissionList.length > 0&&ctx.filter == "brightness(150%)"&&mousedown) { boxSelector = "Shop"; mousedown = false; }
 ctx.drawImage(miscImg[23],10,15,30,30);
 ctx.restore();
 ctx.save();
 collision(mousex,mousey,0,0,120,15,30,30) && rooms[0].MissionList.length > 0 ? ctx.filter = "brightness(150%)" : ctx.filter = ""; 
 if(boxSelector == ""&&rooms[0].MissionList.length > 0&&ctx.filter == "brightness(150%)"&&mousedown) { page = 0; boxSelector = "Bug Selector Full"; mousedown = false; }
 ctx.drawImage(miscImg[24],120,15,30,30);   
 ctx.restore();
 ctx.save();
 collision(mousex,mousey,0,0,230,15,30,30) && rooms[0].MissionList.length > 0 ? ctx.filter = "brightness(150%)" : ctx.filter = ""; 
 if(boxSelector == ""&&rooms[0].MissionList.length > 0&&ctx.filter == "brightness(150%)"&&mousedown) { page = 0; boxSelector = "Select Facility "+Math.floor(scrollx/528); mousedown = false; }
 ctx.drawImage(miscImg[25],230,15,30,30);  
 ctx.restore();
    
if(weather[0] !== "Sunny"){ weatherDraw() } else { weather[1] = Math.max(0,weather[1]-1/30) }  
 
//Every minute there is a 33% for the weather to change
if(date.getMilliseconds() < (1/3)*100&&Math.floor(Math.random()*3) == 0&&date.getSeconds() % 60 == 0&&weather[0] == "Sunny"){ 
    weather[0] = Math.floor(Math.random()*2) == 0 ? "Drizzle" : "Snowstorm"; 
    weather[1] = 0;
    save("Weather",JSON.stringify(weather));
} else if(date.getMilliseconds() < (1/3)*100&&Math.floor(Math.random()*3) == 0&&date.getSeconds() % 60 == 0&&weather[0] == "Drizzle"){ 
    weather[0] = "Thunderstorm";
    weather[1] = 2.5;
    save("Weather",JSON.stringify(weather));
} else if(date.getMilliseconds() < (1/3)*100&&Math.floor(Math.random()*3) == 0&&date.getSeconds() % 60 == 0){
    weather[1] = 6+(2/3); 
    save("Weather",JSON.stringify(weather));
}
   
ctx.globalAlpha = weather[0] == "Sunny" ? 1 : (Math.abs(2.5-weather[1])/2.5);
ctx.drawImage(weather[0] == "Snowstorm" && weather[1] > 2.5 ? miscImg[31] : weather[0] == "Drizzle" && weather[1] > 2.5 ? miscImg[29] : weather[0] == "Thunderstorm" && weather[1] > 2.5 ? miscImg[30] : miscImg[28],468,5,50,50);
ctx.globalAlpha = 1;       
}
  
ctx.globalAlpha = (Math.pow(Math.pow(Math.abs(mousex-(5+25)),2)+Math.pow(Math.abs(mousey-(245+25)),2),0.5) < 25) ? 1 : 0.85;
if(textInfo.length == 1&&boxSelector == ""&&ctx.globalAlpha == 1&&mousedown){ boxSelector = "Pause"; boxAnimation = 0; }
ctx.drawImage(miscImg[51],5,245,50,50);     
   
if(!battleMode&&boxSelector == ""&&(collision(mousex,mousey,0,0,0,0,30,500)|(keyUp == 37||keyUp == 65))&&scrollx > 0){ 
    scrollx = Math.max(0,scrollx-30);
    ctx.fillStyle = "#cc7a00";
    ctx.globalAlpha = 0.5;
    ctx.fillRect(-10,-10,40,320);
    ctx.strokeRect(-10,-10,40,320);
    textmaker("<",15,150,35,true);  
}   
    
if(!battleMode&&boxSelector == ""&&(collision(mousex,mousey,0,0,498,0,30,500)||(keyUp == 39||keyUp == 68))&&scrollx < (rooms.length-1)*528){ 
    scrollx = Math.min((rooms.length-1)*528,scrollx+30); 
    ctx.fillStyle = "#cc7a00";
    ctx.strokeStyle = "#000000"
    ctx.globalAlpha = 0.5;
    ctx.fillRect(498,-10,40,320);
    ctx.strokeRect(498,-10,40,320);
    textmaker(">",515,150,35,true);  
}     
    
ctx.globalAlpha = 1;
  
    if(boxSelector !== ""){
    ctx.drawImage(miscImg[22],264-500/2,boxAnimation+150-281.25/2,500,281.25);
    switch(boxSelector.split("Bug Selector")[0].split(" Facility ")[0]){       
        case "Info":
        bugSelected = -1;
        rooms[boxSelector.split(" Facility ")[1]].info(); 
        break;
            
        case "Select":
        let facilityIndex = Number(boxSelector.split(" Facility ")[1]);
            
        buttonmaker("<",264-String((facilityIndex+1)+"/"+rooms.length).length*(60/3)-110,boxAnimation+15,2,action => boxSelector = (facilityIndex-1 < 0 ? "Select Facility "+(rooms.length-1) : "Select Facility "+(Number(boxSelector.split(" Facility ")[1])-1)));
        buttonmaker(">",264+String((facilityIndex+1)+"/"+rooms.length).length*(60/3),boxAnimation+15,2,action => boxSelector = (facilityIndex >= rooms.length-1 ? "Select Facility 0" : "Select Facility "+(facilityIndex+1)));
        textmaker((facilityIndex+1)+"/"+rooms.length,264,45,30,true); 
            
        //Facility displayer
        ctx.fillStyle = grd;
        ctx.fillRect(355-(264/2),105,264,148.5);
        ctx.fillStyle = "#333332"
        ctx.strokeStyle = "#161616";
        ctx.lineWidth = 5;
        ctx.drawImage(rooms[facilityIndex].Image,0,0,528*3,297*3,355-(264/2),105,264,148.5);
        ctx.strokeRect(355-(264/2),105,264,150);
            
        textmaker(facilities[rooms[facilityIndex].Type].name,36,100,20,false);
        textmaker(facilities[rooms[facilityIndex].Type].descp,24,125,15,false);
          
        buttonmaker("Back",330,boxAnimation+75,1,action => boxSelector = ""); 
        buttonmaker("Select",35,boxAnimation+225,1,action => boxSelector = (facilities[rooms[facilityIndex].Type].infoScreen ? "Info Facility " : "Bug Selector Facility")+facilityIndex);
            
        ctx.save();
        let swapFind = rooms.filter(swapRoom => swapRoom.Swap)
        ctx.filter = swapFind.length > 0 ? "brightness(150%)" : "brightness(100%)";
            
        if(rooms[facilityIndex].Type > 1){
        buttonmaker("Swap",95,boxAnimation+225,1,
        action => 
        swapFind.length == 0 ? [rooms[boxSelector.split(" Facility ")[1]].Swap = true] : 
        [rooms[facilityIndex].Index = swapFind[0].Index,rooms.splice(swapFind[0].Index,1,rooms[facilityIndex]),rooms.splice(facilityIndex,1,swapFind[0]),swapFind[0].Index = facilityIndex,swapFind[0].Swap = false,save("Facilities", JSON.stringify(rooms))]); 
        } else if(rooms[facilityIndex].Type == 1){
        let bugsOnMarket = bugs.filter(nameSearch => nameSearch.Patrol == rooms[facilityIndex] && nameSearch.X > nameSearch.Patrol.Index*528 && nameSearch.X < nameSearch.Patrol.Index*528+528);
        let priceTotal = 0;
        bugsOnMarket.map(add => priceTotal += price(bugStats[add.Species],false,add.Albino))
         if(bugsOnMarket.length > 0){
         buttonmaker("$"+priceTotal,89,boxAnimation+250,1.25,
                    action => sellHandle(priceTotal,bugsOnMarket));
         }
        }
              
       ctx.restore();    
            
        buttonmaker("Jump",155,boxAnimation+225,1,action => [scrollx = rooms[boxSelector.split(" Facility ")[1]].Index*528,boxSelector = ""]); 
        break;
        
        case "":
        if(boxSelector == "Bug Selector Full"||boxSelector.substr(0,21) == "Bug Selector ItemGive"||boxSelector.substr(0,21) == "Bug Selector Facility"){
        bugSelected = -1; 
        ctx.globalAlpha = 0.9;
        ctx.fillStyle = "#f2f2f2";
        ctx.strokeStyle = "#262626";
        ctx.lineWidth = 3;
        ctx.fillRect(30,60,275,30);
        ctx.strokeRect(30,60,275,30); 
        if(mousedown&&collision(mousex,mousey,0,0,30,60,275,30)){ filterSelected = true; } else if(mousedown){ filterSelected = false; }
            
        textmaker(nameFilterContainer+(Math.abs(500-date.getMilliseconds()) > 200 && nameFilterContainer.length < 20 && filterSelected ? "|" : ""),40,80,15);
                 
        nameFilter = bugs.filter(nameSearch => nameSearch.Name.substr(0,nameFilterContainer.length).toUpperCase().indexOf(nameFilterContainer.toUpperCase()) !== -1); 
            
        //If selecting through other selectors a secondary filter will be put in place
        if(boxSelector.substr(0,21) == "Bug Selector ItemGive") {
        nameFilter = nameFilter.filter(items[boxSelector.substr(21)].filter); 
        } else if(boxSelector.substr(0,21) == "Bug Selector Facility") {
        nameFilter = nameFilter.filter(facilities[rooms[boxSelector.substr(21)].Type].filter);
        nameFilter = nameFilter.filter(nameSearch => (nameSearch.Patrol == false||nameSearch.Patrol == rooms[boxSelector.substr(21)]));
           if(rooms[boxSelector.substr(21)].Type !== 0) {
             buttonmaker("Clear",442.5,boxAnimation+62.5,1.25,action => [bugs.filter(nameSearch => nameSearch.Patrol == rooms[boxSelector.substr(21)] ? nameSearch.Patrol = false : undefined),save()]);
             textmaker(String(bugs.filter(nameSearch => nameSearch.Patrol == rooms[boxSelector.substr(21)]).length+"/8"),330,82.5,25);
           }
        }
            
        buttonmaker("<",264-String(page+1+"/"+Number(1+Math.floor((nameFilter.length-1)/8))).length*(60/3)-110,boxAnimation+15,2,action => page - 1 < 0 ? page = Math.floor((nameFilter.length-1)/8) : page -= 1);
        buttonmaker(">",264+String(page+1+"/"+Number(1+Math.floor((nameFilter.length-1)/8))).length*(60/3),boxAnimation+15,2,action => page + 1 > Math.floor((nameFilter.length-1)/8) ? page = 0 : page += 1);  
            
        if(page > Math.floor((nameFilter.length-1)/8)) { page = Math.floor((nameFilter.length-1)/8) }
        if(Math.floor((nameFilter.length-1)/8) > -1&&page < 0) { page = 0 }      
            
        textmaker(String(page+1)+"/"+Number(1+Math.floor((nameFilter.length-1)/8)),264,45,30,true);
            
        for(let bugLoad = page*8; bugLoad < (page+1)*8; bugLoad++){
         if(nameFilter[bugLoad] !== undefined) { bugBubble(bugLoad % 4 *125 + 35,Math.floor((bugLoad-page*8) / 4) * 100 + 100,1,true,nameFilter[bugLoad]) }
        }
  
        //Facilities go to selected facilities if info is not available
        buttonmaker("Back",boxSelector == "Bug Selector Full" ? 312.5 : 377.5,boxAnimation+62.5,1.25,
            action => [mousedown = false,boxSelector = (boxSelector == "Bug Selector Full" ? "" : boxSelector.substr(0,21) == "Bug Selector Facility" ? (facilities[rooms[boxSelector.substr(21)].Type].infoScreen ? "Info Facility "+boxSelector.substr(21) : "Select Facility "+boxSelector.substr(21)) : boxSelector.substr(0,17))]);
                    
        if(boxSelector == "Bug Selector Full") { 
            buttonmaker("Items",377.5,boxAnimation+62.5,1.25,action => [page = 0,items[0].bulk = 0,items[1].bulk = 0,boxSelector = "Bug Selector Item"]); 
            buttonmaker("Compendium",442.5,boxAnimation+62.5,1.25,action => [page = 0,boxSelector = "Bug Compendium"]);
        }   
            
        } else if(boxSelector == "Bug Selector Item") {    
        for(let itemsDraw = 0;itemsDraw < 10;itemsDraw++){
        ctx.save();
        ctx.filter = items[itemsDraw].quantity > 0 ? "brightness(75%)" : "brightness(50%)"; 
        if(Math.pow(Math.pow(Math.abs(mousex-((itemsDraw%5*100+26)+37.5)),2)+Math.pow(Math.abs(mousey-((100+Math.floor(itemsDraw/5)*100)+37.5)),2),0.5) < 30.5){
            ctx.filter = "brightness("+(Number(ctx.filter.split("(")[1].split("%)")[0])+25)+"%)" 
            textmaker(items[itemsDraw].name,264,30,35,true);
            textmaker(items[itemsDraw].descp,264,50,15,true);
           if(((items[itemsDraw].bulk == undefined&&items[itemsDraw].quantity > 0)||items[itemsDraw].bulk > 0)&&mousedown){ 
               if(itemsDraw < 2){    
               boxSelector = ""; 
               food += items[itemsDraw].bulk * (itemsDraw == 0 ? 100 : 1000)
               items[itemsDraw].quantity -= items[itemsDraw].bulk;
               items[itemsDraw].bulk = 0;
               mousedown = false;
               save();
               } else {
               boxSelector = "Bug Selector ItemGive"+itemsDraw;
               mousedown = false;
               }
           }
        }   
                
        ctx.drawImage(miscImg[itemsDraw+32],itemsDraw%5*100+26,100+Math.floor(itemsDraw/5)*100,75,75);  
        ctx.restore();
        textmaker("x"+(items[itemsDraw].quantity-(itemsDraw < 2 ? items[itemsDraw].bulk : 0)),itemsDraw%5*100+26,165+Math.floor(itemsDraw/5)*100,25);
           
         if(itemsDraw < 2&&items[itemsDraw].quantity > 0) {
            textmaker(""+items[itemsDraw].bulk,itemsDraw%5*100+96,145+Math.floor(itemsDraw/5)*100,25,true); 
         }
            
         if(itemsDraw < 2&&items[itemsDraw].bulk < items[itemsDraw].quantity&&food+(items[itemsDraw].bulk * (itemsDraw == 0 ? 100 : 1000)) < 99999) { 
            //adding bulk removes all current bulk
            buttonmaker("+",itemsDraw%5*100+76,95+Math.floor(itemsDraw/5)*100,0.75,action => [itemsDraw == 0 ? items[1].bulk = 0 : items[0].bulk = 0,items[itemsDraw].bulk += 1]); 
         }
            
         if(itemsDraw < 2&&items[itemsDraw].bulk > 0) {   
            buttonmaker("-",itemsDraw%5*100+76,165+Math.floor(itemsDraw/5)*100,0.75,action => items[itemsDraw].bulk -= 1);   
         } 
            
         if(items[itemsDraw].price !== undefined&&items[itemsDraw].quantity < 99&&territs > items[itemsDraw].price)  {
              buttonmaker("$"+items[itemsDraw].price,itemsDraw%5*100+41,100+Math.floor(itemsDraw/5)*100+75,1,action => [soundeffect("Territ.mp3"),items[itemsDraw].quantity += 1,territs -= items[itemsDraw].price,save()]);
          }
            
        }
         
        buttonmaker("Back",16,boxAnimation+10,1,action => boxSelector = "Bug Selector Full");    
            
        } else {
        textmaker(bugSelected.Name+(Math.abs(500-date.getMilliseconds()) > 200 && bugSelected.Name.length < 20 && filterSelected ? "|" : ""),264,50+(filterSelected ? 15 : 0),28,true);
        if(!filterSelected) { buttonmaker("Change Name",264-50,boxAnimation+65,2,action => filterSelected = true); } else {
          if(mousedown){ filterSelected = false }
        }
            
        //Bugs uses their filter colors in their info     
        ctx.save();
        ctx.filter = "hue-rotate("+(bugSelected.Albino ? Math.abs(180-bugSelected.Alignments) : bugSelected.Alignments)+"deg) brightness("+(bugSelected.Albino ? 200 : 100)+"%)";
        ctx.drawImage(bugSelected.Image,0,0,bugSelected.Image.width/6,bugSelected.Image.height/3,110-bugSelected.Image.width/36,175-bugSelected.Image.height/18,bugSelected.Image.width/18,bugSelected.Image.height/9);
        ctx.restore();    
            
        textmaker("Information",200,125,25);
        textmaker(bugSelected.Story,200,150,15);
        traitmaker(25,250,bugSelected); 
        buttonmaker("Back",20,boxAnimation+10,1,action => [bugSelected = -1, boxSelector = "Bug Selector Full"]);
        }       
        break;   
         
    //Results
        case "End Game":
    textmaker(missions[battleInfo[0]].name+" Mission Rewards",264,boxAnimation+45,35,true);
    textmaker(itemsLoad(battleInfo[1]),264,boxAnimation+85,20,true);
    buttonmaker("Next",190,boxAnimation+190,3,action => battleClose());
        break;
       
    //Pause for battles and home
        case "Pause":
    textmaker(battleMode && battleBugs.length == 0 ? "Mission Failed" : "Game Paused",264,boxAnimation+45,35,true);
            
    if(!battleMode||battleBugs.length > 0){
    textmaker("Music",124,boxAnimation+120,25,true);
    textmaker("Sound",405,boxAnimation+120,25,true);  
    buttonmaker(musicvolume == 0 ? "Off" : "On",75,boxAnimation+140,2,action => [musicvolume = musicvolume == 0 ? 0.7 : 0,music.volume = musicvolume,save("Music",musicvolume)]); 
    buttonmaker(soundeffectvolume == 0 ? "Off" : "On",355,boxAnimation+140,2,action => [soundeffectvolume = soundeffectvolume == 0 ? 1 : 0,save("Sound",soundeffectvolume),soundeffect()]);
       
      //Disabled full screen on extensions
      if(((window.innerWidth && document.documentElement.clientWidth) ?
            Math.min(window.innerWidth, document.documentElement.clientWidth) :
            window.innerWidth ||
            document.documentElement.clientWidth ||
            document.body.clientWidth) !== 534){
      textmaker("Full Screen",265,boxAnimation+135,25,true);
      buttonmaker(nectarneCanvas.width == 528 ? "Off" : "On",215,boxAnimation+155,2,action => [fullScreen(),save("FullScreen",nectarneCanvas.width)]);
      }      
    }
            
    if(!battleMode||battleBugs.length > 0){ buttonmaker(battleMode ? "Continue" : "Back",20,boxAnimation+10,1,action => boxSelector = ""); }
            
    if(battleMode){ 
        textmaker(missions[battleInfo[0]].name,264,boxAnimation+85,30,true);
        buttonmaker("Restart",125,boxAnimation+(battleBugs.length > 0 ? 220 : 160),2,action => [load(),battleBuild(missions[battleInfo[0]].type,missions[battleInfo[0]].difficulty)]);
        buttonmaker("Return",315,boxAnimation+(battleBugs.length > 0 ? 220 : 160),2,action => load());
    } else {
        buttonmaker("Guide",125,boxAnimation+220,2,action => [boxSelector = "Guide",page = 0]); 
        buttonmaker("Delete File",315,boxAnimation+220,2,action => boxSelector = "File Deletion");
    }
        break;
        
    //Guidebook (1-3)
        case "Guide":
    textmaker("Guide",264,boxAnimation+35,35,true);
    textmaker(page == 0 ? "Basics" : page == 1 ? "Base Stats" : page == 2 ? "Breeding" : page == 3 ? "Resources" : "Missions",264,boxAnimation+85,35,true);    
    buttonmaker("<",50,boxAnimation+55,2,action => page - 1 < 0 ? page = 4 : page -= 1);
    buttonmaker(">",375,boxAnimation+55,2,action => page + 1 > 4 ? page = 0 : page += 1);  
    buttonmaker("Back",20,boxAnimation+10,1,action => boxSelector = "Pause");

    if (page == 0){
    textmaker("Bugs are bought, stolen, bred, and sold. A mutation that discolors\nbugs, albinism, doubles the selling price of bugs.\n\nA bug can breed with another bug using the Love Field facility.\nBugs can be raised and eventually be used to maintain the colony\nor sold in the Smuggler Junkyard.\n\nAfter reaching age 50 bugs are able to participate in missions or\nharvest resources. Bugs can be deployed in the Command Center.",94,boxAnimation+115,15,false);
    } else if(page == 1){
    textmaker("Bugs have 3 base stats depending on species:\n    Health - Hitpoints of a bug until death.\n    Only knocks out bugs in battles if made immortal \n\n    Attack - Damage inflicted with skills.\n    Affected by the fury bar and aggressiveness \n\n    Speed - Speed of which bugs moves.\n    Speed is halved when non-aquatic bugs swim",164,boxAnimation+115,15,false);
    ctx.drawImage(miscImg[2],100,105,45,45);
    ctx.drawImage(miscImg[3],100,165,45,45);
    ctx.drawImage(miscImg[4],100,225,45,45);
    } else if(page == 2){
    textmaker("Bugs can be bred with a mate when healthy. The higher a bug's\npassiveness the lower the required health to breed. At max\npassiveness, bugs can breed in two sessions without needing to\nbe healed in-between. Traits from either parents are passed down.\n\nTo breed, bugs must be:\n* The same species\n* Opposite gender\n* Age 50 or older",264,boxAnimation+115,15,true);
    } else if(page == 3){
    textmaker("Bugs consume food and lose health when there is none. The higher a bug's\nintelligence the more efficient they are at harvesting resources.\n The intelligence alignment can be passed down through a mixture of\npassiveness and aggressiveness or through brood/items.\n\nTerrits can be used to buy rotating bugs in the Nectarne Market\nor buy items\n\nBugs only lose health in famines when actively looked after",264,boxAnimation+115,15,true);
    } else if(page == 4){
    textmaker("After reaching age 50 bugs can be deployed for missions. The higher a bug's\naggressiveness the more damage they can inflict with skills. A maximum\nof three bugs can be deployed however a fourth companion bug may\naccompany troops as well. Missions grant territs, items, brood,\nand various other loot.\n\nMissions fall into two categories: Explore and Queen Takedown\nQueen Takedown missions end in a queen room and reward queen brood.\nThese rare brood are born with alignments by default ",264,boxAnimation+115,15,true);
    }
        break;
         
    //File confirmation
       case "File Deletion":
    textmaker("Delete File",264,boxAnimation+45,35,true);
    textmaker("Files cannot be recovered once deleted\n\nAre you sure you would like to delete your file?",264,boxAnimation+95,20,true);     buttonmaker("Back",20,boxAnimation+10,1,action => boxSelector = "Pause"); 
    buttonmaker("Yes",220,boxAnimation+200,2,action => load(true));
        break;
            
        break;
        case "Bug Compendium":         
     textmaker(bugStats[bugCompendium[page]].obtained ? bugCompendium[page].split("_").join(" ") : "???",264,boxAnimation+45,35,true);
     buttonmaker("<",50,boxAnimation+55,2,action => page - 1 < 0 ? page = bugCompendium.length-1 : page -= 1);
     buttonmaker(">",375,boxAnimation+55,2,action => page + 1 > bugCompendium.length-1 ? page = 0 : page += 1);
         bugBubble(158,55,0.6,false,page == 0 ? bugStats[bugCompendium[bugCompendium.length-1]] : bugStats[bugCompendium[page-1]]);
         bugBubble(228,55,1,false,bugStats[bugCompendium[page]]);
         bugBubble(318,55,0.6,false,page == bugCompendium.length-1 ? bugStats[bugCompendium[0]] : bugStats[bugCompendium[page+1]]);
   
   ctx.save();         
   bugStats[bugCompendium[page]].obtained && bugStats[bugCompendium[page]].skillName !== "???" ? ctx.filter = "brightness(100%)" : ctx.filter = "brightness(50%)"
   if(bugStats[bugCompendium[page]].obtained&&collision(mousex,mousey,0,0,200,140,45,45)){ ctx.filter = "brightness("+(Number(ctx.filter.split("(")[1].split("%)")[0])+25)+"%)" }
   ctx.drawImage(miscImg[bugStats[bugCompendium[page]].skillBubble],200,140,45,45);
   bugStats[bugCompendium[page]].swimAble && bugStats[bugCompendium[page]].obtained ? ctx.filter = "brightness(100%)" : ctx.filter = "brightness(50%)"
   if(bugStats[bugCompendium[page]].obtained&&collision(mousex,mousey,0,0,200,190,45,45)){ ctx.filter = "brightness("+(Number(ctx.filter.split("(")[1].split("%)")[0])+25)+"%)" }
   ctx.drawImage(miscImg[7],200,190,45,45);
   bugStats[bugCompendium[page]].flyAble && bugStats[bugCompendium[page]].obtained ? ctx.filter = "brightness(100%)" : ctx.filter = "brightness(50%)"
   if(bugStats[bugCompendium[page]].obtained&&collision(mousex,mousey,0,0,200,240,45,45)){ ctx.filter = "brightness("+(Number(ctx.filter.split("(")[1].split("%)")[0])+25)+"%)" }
   ctx.drawImage(miscImg[8],200,240,45,45);  
   ctx.restore();
            
      if(bugStats[bugCompendium[page]].obtained){ 
 ctx.drawImage(bugStats[bugCompendium[page]].image,0,0,bugStats[bugCompendium[page]].image.width/6,bugStats[bugCompendium[page]].image.height/3,115-bugStats[bugCompendium[page]].image.width/36,200-bugStats[bugCompendium[page]].image.height/18,bugStats[bugCompendium[page]].image.width/18,bugStats[bugCompendium[page]].image.height/9);
     } else {
     textmaker("?",125,boxAnimation+220,60,true);     
     }                 
            
   textmaker("Completion: "+bugTotal()+"/"+bugCompendium.length,430,20,20,true); 
            
        if(bugStats[bugCompendium[page]].obtained&&collision(mousex,mousey,0,0,200,140,45,45)){
        textmaker(bugStats[bugCompendium[page]].skillName,370,boxAnimation+190,20,true);
        textmaker(skillDescp[bugStats[bugCompendium[page]].skillName],370,boxAnimation+210,18,true);
        } else if(bugStats[bugCompendium[page]].obtained&&collision(mousex,mousey,0,0,200,190,45,45)){ 
         textmaker(bugStats[bugCompendium[page]].swimAble ? "This bug is an agile swimmer\n(Normal speed while swimming)" : "This bug cannot swim very well\n(Speed is halved while swimming)",370,boxAnimation+210,20,true);
        } else if(bugStats[bugCompendium[page]].obtained&&collision(mousex,mousey,0,0,200,240,45,45)){ 
         textmaker(bugStats[bugCompendium[page]].flyAble ? "This bug can fly\n(Jump to start, down key to stop)" : "This bug cannot fly\n(Up key performs jumps)",370,boxAnimation+210,20,true);
        } else {
         textmaker(bugStats[bugCompendium[page]].obtained ? bugStats[bugCompendium[page]].descp : "???",375,boxAnimation+150,15,true);
         textmaker(bugStats[bugCompendium[page]].rarity,375,125,20,true,bugStats[bugCompendium[page]].rarity == "Common" ? "#b3ffb3" :            bugStats[bugCompendium[page]].rarity == "Rare" ? "#80b3ff" : bugStats[bugCompendium[page]].rarity == "Epic" ? "#ecb3ff" : "#ffff66");     
         ctx.drawImage(miscImg[2],250,210,45,45);
         textmaker(bugStats[bugCompendium[page]].obtained ? ""+bugStats[bugCompendium[page]].baseHealth : "???",310,240,25,true);         
         ctx.drawImage(miscImg[3],335,210,45,45);
         textmaker(bugStats[bugCompendium[page]].obtained ? ""+Math.floor(bugStats[bugCompendium[page]].baseAttack*8) : "???",395,240,25,true);         
         ctx.drawImage(miscImg[4],420,210,45,45);
         textmaker(bugStats[bugCompendium[page]].obtained ? ""+Math.floor(bugStats[bugCompendium[page]].baseSpeed*12.5) : "???",480,240,25,true);   
        }  
        buttonmaker("Back",20,boxAnimation+10,1,action => [page = 0,boxSelector = "Bug Selector Full"]);
        break; 
        case "Shop":    
         textmaker("Nectarne Market",264,45,35,true); 
         shopHandle(45,60,0,65);
         shopHandle(275,60,1,66);
         shopHandle(45,175,2,67);
         shopHandle(275,175,3,68);
            
        buttonmaker("Back",20,boxAnimation+10,1,action => boxSelector = ""); 
        break; 
    }        
            
    if(boxAnimation < 0&&(!battleMode||boxSelector == "End Game"||boxSelector == "Pause")){ boxAnimation = Math.min(0,boxAnimation+25); }

    if(battleMode&&boxAnimation > -300&&boxSelector !== "End Game"&&boxSelector !== "Pause"){ 
        boxAnimation = Math.max(-300,boxAnimation-25);
        if(boxAnimation <= -300){ boxSelector = "" }
    }
}      
   
if(bugSelected !== -1&&bugSelected !== "+"&&(boxSelector == ""||(boxSelector !== "Bug Selector History"&&boxSelector !== "Bug Compendium"&&boxSelector.split("Bug Selector").length > 1)||boxSelector.substr(0,13) == "Info Facility")){ bugSelected.stats(); }        

if(textInfo.length > 1){ dialoguemaker(); boxSelector = ""; }     
    
if(music.currentTime > music.duration-.24){ music.currentTime = 0; }   
mousedown = false; 
ctx.restore();
}

nectarneCanvas.addEventListener("mousemove", mousemake);
nectarneCanvas.addEventListener("mousedown", mousedownmake);
nectarneCanvas.addEventListener("keydown", keydownmake => battleMode && battleBugs.length > 0 ? battleBugs[0].keyDown(event) : keydownmisc(event));
nectarneCanvas.addEventListener("keyup", keyupmake);

setInterval(mainGame,1000/30);