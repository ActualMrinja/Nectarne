itemsLoad = function(itemsIterate){
  let valuesGrabbed = "";
  for(let valueGrab in itemsIterate[0]){
      valuesGrabbed += "x"+itemsIterate[1][valueGrab]+"  "+(itemsIterate[0][valueGrab] < 10 ? items[itemsIterate[0][valueGrab]].name : itemsIterate[0][valueGrab])+"\n"
  }
    //alert(valuesGrabbed);
  return valuesGrabbed
}

items = {
 0:{
 name: "Potion of Immortality",
 descp: "A rare and elusive potion containing a single bacteria that rapidly regenerates the drinker's cell allowing them to recover from any lethal situation",
 }
}

imgMake = function(path){
    let img = new Image();
    img.src = "Bugs/"+path+".png";
    return img
}



bugStats = {
 Ant:{
 malesToFemales: 20,
 baseSpeed: 4,
 baseHealth: 50,
 baseAttack: 12.5,
 skillName: "Mandible Press",
 skillDescp: "Neutral damage",
 skillBubble: 9,
 swimAble: false,
 flyAble: false,
 rarity: "Common",
 price: 10,
 image: imgMake("Ant"),
},
 Fly:{
 malesToFemales: 50,
 baseSpeed: 5.2,
 baseHealth: 40,
 baseAttack: 11.25,
 skillName: "Saliva Salvo",
 skillDescp: "Damage is halved, however targets are slowed down for 2 seconds",
 skillBubble: 15,
 swimAble: false,
 flyAble: true,
 rarity: "Common",
 price: 10,
 image: imgMake("Fly"),
},
 Diving_Beetle:{
 malesToFemales: 80,
 baseSpeed: 2.8,
 baseHealth: 60,
 baseAttack: 13.75,
 skillName: "Mandible Press",
 skillDescp: "Neutral damage",
 skillBubble: 15,
 swimAble: true,
 flyAble: true,
 rarity: "Common",
 price: 10,
 image: imgMake("DivingBeetle"),
},
 Pondskater:{
 malesToFemales: 75,
 baseSpeed: 6,
 baseHealth: 55,
 baseAttack: 12.5,
 skillName: "Leap Strike",
 skillDescp: "Time between attacks is increased by 25%, however attacks turn into neutral damaging leaps",
 skillBubble: 19,
 swimAble: true,
 flyAble: true,
 rarity: "Rare",
 price: 10,
 image: imgMake("Pondskater"),
},
 Bee:{
 malesToFemales: 25,
 baseSpeed: 6.8,
 baseHealth: 60,
 baseAttack: 11.25,
 skillName: "Poison Sting",
 skillDescp: "Damage is cut thrice, however targets are poisoned for 3 seconds",
 skillBubble: 21,
 swimAble: false,
 flyAble: true,
 rarity: "Rare",
 price: 10,
 image: imgMake("Bee"),
}
}