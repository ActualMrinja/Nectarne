facilityBuild = function(type,index){
  this.Type = type;
  this.Image = miscImg[facilities[type].miscIndex].cloneNode();

  this.MissionList = [];
  this.MissionSelect = 0;
  this.Companion = undefined;
  this.Index = index;
    
  this.Animation = 0;
  this.AnimationReverse = false;
  this.Swap = false;
}

facilityBuild.prototype.info = function(){
  if(!battleMode){  
  textmaker(missions[this.MissionList[this.MissionSelect][0]].name,265,30,30,true);

  ctx.save();
  for(let drawMissions = 0; drawMissions < this.MissionList.length; drawMissions++){
    ctx.filter = this.MissionSelect == drawMissions ? "brightness(100%)" : "brightness(75%)"; 
    if(collision(mousex,mousey,0,0,465-45/2,40+(60*drawMissions),45,45)){
    ctx.filter = "brightness("+(Number(ctx.filter.split("(")[1].split("%)")[0])+25)+"%)" 
        if(mousedown){ battleInfo = this.MissionList[drawMissions]; this.MissionSelect = drawMissions; }
    }   
    ctx.drawImage(miscImg[43],465-45/2,40+(60*drawMissions),45,45);    
  }
  ctx.restore();
  textmaker(missions[this.MissionList[this.MissionSelect][0]].descp+"\n\nMission Rewards\n"+itemsLoad(this.MissionList[this.MissionSelect][1]),265,50,15,true);  
      
 //Mission UI
  ctx.drawImage(miscImg[70+Math.floor(missions[this.MissionList[this.MissionSelect][0]].difficulty/50)],40,60,84,19);
  bugBubble(40,missions[this.MissionList[this.MissionSelect][0]].companion !== undefined ? 100 : 125,0.5,false,bugStats[missions[this.MissionList[this.MissionSelect][0]].primary]);
  bugBubble(70,missions[this.MissionList[this.MissionSelect][0]].companion !== undefined ? 110 : 135,0.375,false,bugStats[missions[this.MissionList[this.MissionSelect][0]].secondary]);
  textmaker("Difficulty",40,60,15,false);
  textmaker("Scout",40,missions[this.MissionList[this.MissionSelect][0]].companion !== undefined ? 100 : 125,15,false);
 if(missions[this.MissionList[this.MissionSelect][0]].companion !== undefined){
 this.Companion = new bugBuild(missions[this.MissionList[this.MissionSelect][0]].companion[0],0,0,missions[this.MissionList[this.MissionSelect][0]].companion[1],missions[this.MissionList[this.MissionSelect][0]].companion[3]);
 this.Companion.Gender = missions[this.MissionList[this.MissionSelect][0]].companion[2];   
 this.Companion.Trait = missions[this.MissionList[this.MissionSelect][0]].companion[4]; 
 this.Companion.Albino = false;  
 this.Companion.Immortal = true;
 bugBubble(45,155,0.625,true,this.Companion);
 textmaker("Companion",40,160,15,false);
 traitmaker(30,175,this.Companion);
 }
      
 for(let drawTroops = 0; drawTroops < 3; drawTroops++){ 
  //Bugs that are no longer patrolling a command center are removed from the squad
  if(battleBugs[drawTroops] !== undefined&&battleBugs[drawTroops].Patrol !== this){ battleBugs.splice(drawTroops,1); drawTroops -= 1;
    } else { bugBubble(50+(125*drawTroops),205,1,true,battleBugs[drawTroops] == undefined ? "+" : battleBugs[drawTroops]); }
 }
      
 if(battleBugs.length > 0){
 buttonmaker("Start",390,225,2,action => [battleInfo = this.MissionList[this.MissionSelect],save(),battleBuild(missions[battleInfo[0]].type,missions[battleInfo[0]].difficulty)]); 
 }  
     
 buttonmaker("Back",20,boxAnimation+10,1,action => boxSelector = "Select Facility "+this.Index);
 }
}

facilityBuild.prototype.draw = function(){
  this.AnimationReverse ? this.Animation -= (this.Type == 4 ? 0.25 : 0.75) : this.Animation += (this.Type == 4 ? 0.25 : 0.75);
    
  if(this.Animation >= 3){
   this.AnimationReverse = true;
   this.Animation = this.Animation = 2.9;
  } else if(this.Animation <= 0){
   this.AnimationReverse = false;
   this.Animation = 0.1;
  }
    ctx.drawImage(this.Image,Math.floor(this.Animation)*528*3,0,528*3,297*3,(528*this.Index)-scrollx,0,529,297);
}