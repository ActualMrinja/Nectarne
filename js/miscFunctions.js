//Battle builder
function battleBuild(type, difficulty) {
    if (missions[battleInfo[0]].companion !== undefined) {
        rooms[0].Companion = new bugBuild(missions[battleInfo[0]].companion[0], 0, 0, missions[battleInfo[0]].companion[1], missions[battleInfo[0]].companion[3]);
        rooms[0].Companion.Gender = missions[battleInfo[0]].companion[2];
        rooms[0].Companion.Trait = missions[battleInfo[0]].companion[4];
        rooms[0].Companion.Albino = false;
        rooms[0].Companion.Immortal = true;
        battleBugs.push(rooms[0].Companion);
    }

    battleMode = true;
    scrollx = 0;
    battleBugs.map(bugCollect => [bugCollect.X = 75, bugCollect.Y = 225, bugCollect.defects = {}]);
    battleBugs.sort(function(a, b) {
        return bugs.indexOf(a) == -1 ? b : bugs.indexOf(a) - bugs.indexOf(b)
    });

    battleMap = [
        [1, 1, 1, 1],
        [1, 1, 0, type == "Skies" ? 0 : 1],
        [1, 0, 0, type == "Skies" ? 1 : 0],
        [1, 0, 0, (type == "Skies" || type == "Pond") ? 1 : 0],
        [1, 1, 0, 1],
        [1, 1, 1, 1],
    ];

    boxselector = "";
    bugSelected = -1;

    music.pause();
    music = new Audio("muzak/" + type + "Theme.mp3");
    music.loop = true;
    music.volume = musicvolume;
    music.play();

    diggerY = 3;
    randomizer = Math.floor(Math.random() * 100) + 1;

    for (let diggerX = 0; diggerX < difficulty; diggerX++) {
        randomizer = Math.floor(Math.random() * 100) + 1;

        switch (type) {

            case "Nest":
                battleMap[0].push(1);
                battleMap[1].push(1);
                battleMap[2].push(1);
                battleMap[3].push(1);
                battleMap[4].push(1);
                battleMap[diggerY][diggerX + 4] = Math.floor(Math.random() * 20) == 0 ? 7 : 0;
                battleMap[5].push(1);

                if ((randomizer <= 25 && diggerY - 1 > 0 && difficulty - diggerX > 4) || (difficulty - diggerX <= 4 && diggerY > 3)) {
                    battleMap[diggerY - 1][diggerX + 4] = Math.floor(Math.random() * 20) == 0 ? 7 : 0;
                    diggerY -= 1;
                } else if ((randomizer <= 50 && diggerY + 1 < 5 && difficulty - diggerX > 4) || (difficulty - diggerX <= 4 && diggerY < 3)) {
                    battleMap[diggerY + 1][diggerX + 4] = Math.floor(Math.random() * 20) == 0 ? 7 : 0;
                    diggerY += 1;
                }
                break;
            case "Hive":

                if (Math.floor(Math.random() * 3) < 2) {
                    diggerX -= 1;
                } else {
                    battleMap[0].push(1);
                    battleMap[1].push(1);
                    battleMap[2].push(1);
                    battleMap[3].push(1);
                    battleMap[4].push(1);
                    battleMap[diggerY][diggerX + 4] = Math.floor(Math.random() * 20) == 0 ? 7 : 0;
                    battleMap[5].push(1);
                }

                if ((randomizer <= 35 && diggerY - 1 > 0 && difficulty - diggerX > 4) || (difficulty - diggerX <= 4 && diggerY > 3)) {
                    battleMap[diggerY - 1][diggerX + 4] = Math.floor(Math.random() * 20) == 0 ? 7 : 0;
                    diggerY -= 1;
                } else if ((randomizer <= 70 && diggerY + 1 < 5 && difficulty - diggerX > 4) || (difficulty - diggerX <= 4 && diggerY < 3)) {
                    battleMap[diggerY + 1][diggerX + 4] = Math.floor(Math.random() * 20) == 0 ? 7 : 0;
                    diggerY += 1;
                }
                break;
            case "Pond":
                battleMap[0].push(Math.floor(Math.random() * 20) == 0 ? 7 : 0);
                battleMap[1].push(Math.floor(Math.random() * 20) == 0 ? 7 : 0);
                battleMap[2].push(Math.floor(Math.random() * 20) == 0 ? 7 : 0);
                battleMap[3].push(diggerY + 1 == 4 ? Math.floor(Math.random() * 5) == 0 ? 1 : 2 : 0);
                battleMap[4].push(diggerY + 1 == 4 ? Math.floor(Math.random() * 5) == 0 ? 1 : 2 : 0);
                battleMap[diggerY][diggerX + 4] = 2;
                battleMap[5].push(1);

                //crevice maker
                if (diggerX > 3 && (randomizer <= 15 && diggerY - 1 > 2 && difficulty - diggerX > 4) || (difficulty - diggerX <= 4 && diggerY > 3)) {
                    battleMap[diggerY][diggerX + 2] = 1;
                    battleMap[diggerY][diggerX + 3] = 1;
                    battleMap[diggerY][diggerX + 4] = Math.floor(Math.random() * 20) == 0 ? 7 : 0;
                    diggerY -= 1;
                    battleMap[diggerY][diggerX + 3] = 1;
                    battleMap[diggerY][diggerX + 4] = 2;
                    battleMap[diggerY + 1][diggerX + 4] = 1;
                } else if (diggerX > 3 && (randomizer <= 30 && diggerY + 1 < 5 && difficulty - diggerX > 4) || (difficulty - diggerX <= 4 && diggerY < 3)) {
                    battleMap[diggerY][diggerX + 3] = 1;
                    battleMap[diggerY][diggerX + 4] = Math.floor(Math.random() * 20) == 0 ? 7 : 0;
                    diggerY += 1;
                    battleMap[diggerY][diggerX + 2] = 1;
                    battleMap[diggerY][diggerX + 3] = 1;
                    battleMap[diggerY][diggerX + 4] = 2;
                    battleMap[diggerY + 1][diggerX + 4] = 1;
                }

                if (difficulty - diggerX == 1) {
                    battleMap[diggerY][diggerX + 4] = Math.floor(Math.random() * 20) == 0 ? 7 : 0;
                    battleMap[diggerY][diggerX + 3] = 1;
                    battleMap[diggerY + 1][diggerX + 2] = 1;
                    battleMap[diggerY + 1][diggerX + 3] = 1;
                    battleMap[diggerY + 1][diggerX + 4] = 1;
                    battleMap[diggerY - 3][diggerX + 4] = 1;
                }
                break;
            case "Skies":
                battleMap[0].push(Math.floor(Math.random() * 40) == 0 ? 7 : 0);
                battleMap[1].push(Math.floor(Math.random() * 40) == 0 ? 7 : 0);
                battleMap[2].push(Math.floor(Math.random() * 40) == 0 ? 7 : 0);
                battleMap[3].push(Math.floor(Math.random() * 40) == 0 ? 7 : 0);
                battleMap[4].push(Math.floor(Math.random() * 40) == 0 ? 7 : 0);
                battleMap[5].push(Math.floor(Math.random() * 40) == 0 ? 7 : 0);
                diggerY = 4;
                break;
            case "Prairie":
                battleMap[0].push(Math.floor(Math.random() * 20) == 0 ? 7 : 0);
                battleMap[1].push(Math.floor(Math.random() * 20) == 0 ? 7 : 0);
                battleMap[2].push(Math.floor(Math.random() * 20) == 0 ? 7 : 0);
                battleMap[3].push(Math.floor(Math.random() * 20) == 0 ? 7 : 0);
                battleMap[4].push((Math.floor(Math.random() * 15) == 0 && battleMap[4][diggerX + 3] !== 3) ? 1 : Math.floor(Math.random() * 20) == 0 ? 7 : 0);
                battleMap[diggerY - 1][diggerX + 4] = 1;
                battleMap[5].push(1);

                if (diggerX > 2 && (randomizer <= 15 && diggerY - 1 > 1 && difficulty - diggerX > 4) || (difficulty - diggerX <= 4 && diggerY > 3)) {
                    battleMap[diggerY - 1][diggerX + 4] = 0;
                    diggerY -= 1;
                } else if (diggerX > 4 && (randomizer <= 50 && diggerY + 1 < 4 && difficulty - diggerX > 4) || (difficulty - diggerX <= 4 && diggerY < 3)) {
                    battleMap[diggerY + 1][diggerX + 4] = 0;
                    diggerY += 1;
                }

                if (((battleMap[4][diggerX + 3] == 1 && battleMap[4][diggerX + 2] == 0) || battleMap[4][diggerX + 3] == 2) && diggerX > 2) {
                    battleMap[4][diggerX + 4] = 2;
                    if (Math.floor(Math.random() * 10) == 0) {
                        battleMap[5][diggerX + 4] = 2;
                        battleMap[5][diggerX + 3] = 1;
                        battleMap[5][diggerX + 5] = 1;
                    }
                }

                if (difficulty - diggerX == 1) {
                    battleMap[0][diggerX + 4] = 1;
                    battleMap[5][diggerX + 4] = 1;
                }
                break;

        }

        randomizer = Math.floor(Math.random() * 100) + 1;

        if (randomizer <= 1 && difficulty - diggerX > 4 && diggerX > 2) {
            battleMap[diggerY - (type == "Prairie" ? 2 : type == "Pond" ? 1 : 0)][diggerX + 4] = 6;
        } else if (randomizer <= 3 && difficulty - diggerX > 4 && diggerX > 2) {
            battleMap[diggerY - (type == "Prairie" ? 2 : type == "Pond" ? 1 : 0)][diggerX + 4] = 5;
        } else if (randomizer <= 5 && difficulty - diggerX > 4 && diggerX > 2) {
            battleMap[diggerY - (type == "Prairie" ? 2 : type == "Pond" ? 1 : 0)][diggerX + 4] = 4;
        }

        if (randomizer <= 10 && type == "Skies" && difficulty - diggerX > 4 && diggerX > 2) {
            battleMap[5][diggerX + 3] = 1;
            battleMap[5][diggerX + 4] = 1;
        } else if (randomizer <= 10 && type == "Prairie" && difficulty - diggerX > 4 && diggerX > 2 && battleMap[4][diggerX + 2] !== 3) {
            //dirt pillar
            battleMap[0][diggerX + 3] = 1;
            battleMap[1][diggerX + 3] = 1;
            battleMap[2][diggerX + 3] = 1;
            battleMap[3][diggerX + 3] = 1;
            battleMap[4][diggerX + 3] = 3;
            battleMap[5][diggerX + 3] = 1;

            //existing ponds are deleted to make room for slide doors
            battleMap[4][diggerX + 2] = 0;
            if (battleMap[4][diggerX + 1] !== 3 && battleMap[4][diggerX + 2] !== 3 && battleMap[4][diggerX] !== 3) {
                battleMap[4][diggerX + 1] = 1;
                battleMap[5][diggerX + 1] = 1;
            }

            //hole maker
            battleMap[4][diggerX + 4] = Math.floor(Math.random() * 20) == 0 ? 7 : 0;
            battleMap[diggerY - 1][diggerX + 4] = 6;
        }
    }

    //Finishing touches - queen room
    if (!(battleInfo[1][0][3] > 0)) {
        battleMap[0].push(type == "Skies" ? 1 : 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1);
        battleMap[1].push(1, 1, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 1);
        battleMap[2].push(1, 0, 3, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1);
        battleMap[3].push(3, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1);
        battleMap[4].push(1, 1, 1, 1, 1, 0, 0, 0, 0, 0, difficulty == 150 ? 4 : difficulty == 100 ? 5 : 0, difficulty == 150 ? 4 : 0, 1);
        battleMap[5].push(type == "Skies" ? 1 : 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1);

        battleEnemies = [];
        battleEnemies.push(new bugBuild(missions[battleInfo[0]].queenName, (battleMap[0].length * 50) - 100, 275, missions[battleInfo[0]].primary, 202.5, true, difficulty == 150 ? 300 : difficulty == 100 ? 225 : 150));
        battleEnemies[0].HealthTotal = Math.ceil(battleEnemies[0].HealthTotal * (difficulty == 150 ? 2 : difficulty == 100 ? 1.75 : 1.5));
        battleEnemies[0].Health = battleEnemies[0].HealthTotal;
        battleEnemies[0].Gender = "Female";
        battleEnemies[0].Trait = 1;
        battleEnemies[0].Immortal = true;
    }

}

function battleLoot(mission) {
    let loot = [
        ["Territs", 1, 1, 1],
        [1, 1, 1, 1]
    ];

    loot[1][0] = mission < 15 ? (mission + 1) * 100 : missions[mission].difficulty * 10;
    loot[0][1] = missions[mission].difficulty > 100 ? 1 : 0;
    loot[1][1] = missions[mission].difficulty == 100 ? 3 : 1;
    loot[0][2] = missions[mission].type == "Nest" || missions[mission].type == "Hive" ? 4 : missions[mission].type == "Pond" ? 3 : 2;
    loot[1][2] = missions[mission].difficulty / 50;

    if (missions[mission].queenName !== undefined) {
        loot[0][3] = mission == 25 ? "Centipede Queen Brood" : (bugStats[missions[mission].primary].offspring !== undefined ? bugStats[missions[mission].primary].offspring + " Queen Brood" : missions[mission].primary + " Queen Brood");
        loot[1][3] = 0;
    } else {
        loot[0][3] = missions[mission].difficulty == 50 ? (missions[mission].type == "Nest" || missions[mission].type == "Hive" ? 5 : 6) : (missions[mission].type == "Nest" || missions[mission].type == "Hive" ? 7 : missions[mission].type == "Prairie" ? 9 : 8)
        loot[1][3] = missions[mission].difficulty == 150 ? 3 : missions[mission].difficulty == 100 ? 1 : 2;
    }

    return loot;
}

function battleClose() {
    battleBugs.map(bugCollect => [bugCollect.X = 25, bugCollect.Y = 280, bugCollect.Fury = 0, bugCollect.defects = {}, bugCollect.Attacking = false]);
    scrollx = 0;
    battleBugs = [];
    bugs.map(bugCollect => bugCollect.Patrol.Type == 0 ? battleBugs.push(bugCollect) : "");
    battleEnemies = [];
    battleMode = false;
    boxSelector = "";
    music.pause();
    music = new Audio("muzak/MainTheme.mp3");
    music.loop = true;
    music.volume = musicvolume;
    music.play();

    territs = Math.min(99999, territs + battleInfo[1][1][0]);
    items[battleInfo[1][0][1]].quantity = Math.min(99, items[battleInfo[1][0][1]].quantity + battleInfo[1][1][1]);
    items[battleInfo[1][0][2]].quantity = Math.min(99, items[battleInfo[1][0][2]].quantity + battleInfo[1][1][2]);

    //Queen missions have brood, exploration missions have special items
    if (!(battleInfo[1][0][3] > 0) && bugs.length < rooms.length * 8) {
        bugs.push(new bugBuild("Queen Brood", 25, 280, battleInfo[1][0][3].split(" Queen Brood")[0].split(" ").join("_"), Math.floor(Math.random() * 359) + 1, false, 0));
        bugs[bugs.length - 1].defects.evolution = 1;
        bugs[bugs.length - 1].Story = bugs[bugs.length - 1].Story.split("\nFather").join(" from a queen's brood\nFather");
        bugs[bugs.length - 1].Story = bugs[bugs.length - 1].Story.split("Father: Unknown").join("Father: Drone " + Math.floor(Math.random() * 999 + 1));
        bugs[bugs.length - 1].Story = bugs[bugs.length - 1].Story.split("Mother: Unknown").join("Mother: " + (missions[battleInfo[0]].queenName !== undefined ? missions[battleInfo[0]].queenName : "Queen " + missions[battleInfo[0]].primary.split("_").join(" ")));
    } else if (battleInfo[1][0][3] > 0) {
        items[battleInfo[1][0][3]].quantity = Math.min(99, items[battleInfo[1][0][3]].quantity + battleInfo[1][1][3]);
    }

    let missionCalculate = battleInfo[0];

    if (missionCalculate < 14) {
        missionCalculate += 1;
        rooms[0].MissionList[0] = [missionCalculate, battleLoot(missionCalculate)];
    } else if (missionCalculate == 14) {
        missionCalculate = 25 + Math.floor(Math.random() * 5);
        rooms[0].MissionList.splice(0, 1);
        rooms[0].MissionList.push([missionCalculate, battleLoot(missionCalculate)]);
    } else if (missionCalculate < 20) {
        while (missionCalculate == battleInfo[0]) {
            missionCalculate = 15 + Math.floor(Math.random() * 5);
        }
        rooms[0].MissionList[rooms[0].MissionSelect] = [missionCalculate, battleLoot(missionCalculate)];
    } else if (missionCalculate < 25) {
        while (missionCalculate == battleInfo[0]) {
            missionCalculate = 20 + Math.floor(Math.random() * 5);
        }
        rooms[0].MissionList[rooms[0].MissionSelect] = [missionCalculate, battleLoot(missionCalculate)];
    } else if (missionCalculate < 30) {
        while (missionCalculate == battleInfo[0]) {
            missionCalculate = 25 + Math.floor(Math.random() * 5);
        }
        rooms[0].MissionList[rooms[0].MissionSelect] = [missionCalculate, battleLoot(missionCalculate)];
    }

    battleInfo = rooms[0].MissionList[0];
    rooms[0].MissionSelect = 0;
    save();
}

//global sound effects to deal with multiple sound effects efficently
function soundeffect(file = false) {
    if (file) {
        sounds[soundsloop] = miscAudio[audioNm.indexOf(file)].cloneNode();
        sounds[soundsloop].volume = soundeffectvolume;
        sounds[soundsloop].play();
        soundsloop += 1;
        if (soundsloop > 9) {
            soundsloop = 0;
        }
    } else {
        for (let volumeDown = 0; volumeDown < 10; volumeDown++) {
            sounds[volumeDown].volume = soundeffectvolume;
        }
    }
}

//basic non-advanced collision
function collision(x1, y1, w1, h1, x2, y2, w2, h2) {
    if (x1 <= x2 + w2 && x1 + w1 >= x2 && y1 <= y2 + h2 && y1 + h1 >= y2) {
        return true;
    } else {
        return false;
    }

}

//basic circle collision
function circleCollision(x, y, r){
    if (Math.pow(Math.pow(Math.abs(mousex - (x + r)), 2) + Math.pow(Math.abs(mousey - (y + r)), 2), 0.5) < r) {
        return true;
    } else {
        return false;
    }
}

//global textmaker
function textMaker(text, x, y, size, sizeswitch = false, color = "#ffffff") {

    ctx.globalAlpha = 1;
    let textFitter = (window.devicePixelRatio == 1 ? 1 : window.devicePixelRatio * 0.5) - 1

    //loop allows line breaks to be available with \n
    for (let textsplit = 0; textsplit < text.split("\n").length; textsplit++) {

        if (sizeswitch) {
            if (text[0] == "$" && !capsSelected) {
                text = boxSelector == "Bug Selector Item" ? text.split("$").join("") : text.split("$").join(" ");
                ctx.drawImage(miscImg[23], x - (ctx.measureText(text.split("\n")[textsplit]).width / 2) - 25 * (size / 25), (y + (textsplit * size * 1.25)) - (25 / 1.375 * (size / 25)), 25 * (size / 25), 25 * (size / 25));
            } else if (text[0] == "@" && !capsSelected) {
                text = text.split("@").join(" ");
                ctx.drawImage(miscImg[64], x - (ctx.measureText(text.split("\n")[textsplit]).width / 2) - 10 * (size / 25), (y + (textsplit * size * 1.25)) - (25 / 1.375 * (size / 25)), 25 * (size / 25), 25 * (size / 25));
            }

            ctx.font = "600 " + size / (textFitter + 1) + "px TovariSans";
            ctx.strokeStyle = "black";
            ctx.lineWidth = (size / 25) * ((24 / size) + 4);
            ctx.strokeText(text.split("\n")[textsplit], (x + textFitter) - (ctx.measureText(text.split("\n")[textsplit]).width / 2), (y + (textsplit * size * 1.25)), ctx.measureText(text.split("\n")[textsplit]).width);
            ctx.fillStyle = color;
            ctx.fillText(text.split("\n")[textsplit], x - (ctx.measureText(text.split("\n")[textsplit]).width / 2), (y + (textsplit * size * 1.25)), ctx.measureText(text.split("\n")[textsplit]).width);
        } else {
            ctx.font = "600 " + size / (textFitter + 1) + "px TovariSans";
            ctx.strokeStyle = "black";
            ctx.lineWidth = (size / 25) * ((24 / size) + 4);
            ctx.strokeText(text.split("\n")[textsplit], (x + textFitter), (y + (textsplit * size * 1.25)), ctx.measureText(text.split("\n")[textsplit]).width);
            ctx.fillStyle = color;
            ctx.fillText(text.split("\n")[textsplit], x, (y + (textsplit * size * 1.25)), ctx.measureText(text.split("\n")[textsplit]).width);
        }

    }
}

//Global buttonMaker
function buttonMaker(text, x, y, size, action) {
    ctx.globalAlpha = collision(mousex, mousey, 0, 0, x, y, miscImg[13].width / 6 * size, miscImg[13].height / 6 * size) ? 1 : 0.75;
    if (mousedown && ctx.globalAlpha == 1) {
        action();
        mousedown = false;
    }
    ctx.drawImage(miscImg[13], x, y, miscImg[13].width / 6 * size, miscImg[13].height / 6 * size);
    textMaker(text, x + miscImg[13].width / 12 * size, (y + miscImg[13].height / 12 * size) + ((20 - text.length * 1.1) * size / 4), (20 - text.length * 1.1) * size, true);
}

function keyboardMaker(x, y, output){
    let keyBoard = {
        false: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "a", "s", "d", "f", "g", "h", "j", "k", "l", "z", "x", "c", "v", "b", "n", "m", "Space", "Upper", "Confirm", "Delete"],
        true: ["!", "@", "#", "$", "%", "^", "&", "*", "(", ")", "Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "A", "S", "D", "F", "G", "H", "J", "K", "L", "Z", "X", "C", "V", "B", "N", "M", "Space", "Lower", "Confirm", "Delete"]
    }
    
    //Keyboard base
    ctx.strokeStyle = "rgb(0,0,0,1)";
    ctx.fillStyle = "rgb(0,0,0,0.85)";
    ctx.lineWidth = 3;

    ctx.strokeRect(x, y, 500, 150);
    ctx.fillRect(x, y, 500, 150);
   
    for(let keys in keyBoard[capsSelected]){
        if(keys < 36){
            buttonMaker(keyBoard[capsSelected][keys], keys%10*50+15, Math.floor(keys/10)*40+105, 0.9, action => output.length < 20
 ? output += keyBoard[capsSelected][keys] : "");
        } else if(keys == 36) {
            buttonMaker(keyBoard[capsSelected][keys], keys%10*50+15, Math.floor(keys/10)*40+105, 0.9, action => output.length < 20
 ? output += " " : "");
        } else if(keys == 37) {
            buttonMaker(keyBoard[capsSelected][keys], keys%10*50+15, Math.floor(keys/10)*40+105, 0.9, action => capsSelected = !capsSelected);
        } else if(keys == 38) {
            buttonMaker(keyBoard[capsSelected][keys], keys%10*50+15, Math.floor(keys/10)*40+105, 0.9, action => [capsSelected = false, filterSelected = false, save()]);
        } else if(keys == 39) {
            buttonMaker(keyBoard[capsSelected][keys], keys%10*50+15, Math.floor(keys/10)*40+105, 0.9, action => output = output.substr(0,output.length - 1));
        } 
    }

    if(bugSelected !== -1){
        bugSelected.Name = output;
    } else {
        nameFilterContainer = output;
    }
}

function arrowMaker(x, y, angle, pointer=false) {
    ctx.save();
    ctx.translate(x, !pointer ? y+Math.abs(500-date.getMilliseconds())/100 : y);
    ctx.rotate(angle * (Math.PI / 180));

     if(pointer){
        ctx.globalAlpha = collision(mousex, mousey, 0, 0, x - 15, y - 15, 30, 30) ? 1 : 0.85;
        ctx.drawImage(miscImg[74], -15, -15, 30, 30);
         
        if(mousedown && ctx.globalAlpha == 1) {
        battleBugs[0].keyDown(pointer[0]);
        battleBugs[0].keyUp[pointer[1]] = true;
        } else if(battleBugs[0].keyUp[pointer[1]]) {
        battleBugs[0].keyUp[pointer[0]] = false; 
        battleBugs[0].keyUp[pointer[1]] = false; 
        }
         
     } else {
         ctx.globalAlpha = 1;
         ctx.drawImage(miscImg[74], -7.5, -7.5, 15, 15);
     }
    
    ctx.restore();
}

function weatherDraw() {
    if (weather[1] <= 5) {
        weather[1] = Math.min(5, weather[1] + 1 / 30)
    } else {
        weather[1] = Math.max(5, weather[1] - 1 / 30)
        if (weather[1] <= 5) {
            weather[1] = weather[0] == "Snowstorm" ? 15 : weather[0] == "Thunderstorm" ? 10 : 5;
            weather[0] = "Sunny"
        }
    }

    if (weather[1] >= 2.5) {
        for (let weatherEffect = 2; weatherEffect < (weather[0] == "Thunderstorm" ? 32 : weather[0] == "Snowstorm" ? 27 : 22); weatherEffect++) {

            if (weather[weatherEffect][0] - scrollx < 0 || weather[weatherEffect][0] - scrollx > 528) {
                weather[weatherEffect][0] = Math.random() * 528 + scrollx;
            }

            ctx.save();
            ctx.translate(weather[weatherEffect][0] - scrollx, weather[weatherEffect][1]);
            ctx.rotate((weather[0] == "Snowstorm" ? weather[weatherEffect][1] % 90 * 4 : 0) * (Math.PI / 180));
            ctx.drawImage(miscImg[weather[0] == "Snowstorm" ? 27 : 26], 0, -weather[weatherEffect][1] / 10, miscImg[26].width, miscImg[26].height, -miscImg[26].width / 12, -miscImg[26].height / 12 - weather[weatherEffect][1] / 60, miscImg[26].width / 6, miscImg[26].height / 6);

            if (weather[1] <= 5 || weather[weatherEffect][1] >= -25) {
                weather[weatherEffect][1] += weather[0] == "Thunderstorm" ? 18 : weather[0] == "Drizzle" ? 12 : 6;
            }
            if (weather[0] == "Snowstorm") {
                weather[weatherEffect][0] += (weather[weatherEffect][1] % 3) - 1;
            }

            ctx.restore();

            if (weather[weatherEffect][1] > Math.random() * 15 + 260) {
                weather[weatherEffect][0] = Math.random() * 528 + scrollx;
                weather[weatherEffect][1] = -50 - Math.random() * 250;
                if (weather[0] !== "Snowstorm") {
                    soundeffect("Rain.mp3");
                }
            }

        }
        //Every 12 seconds there is thunder in a thunderstorm
        if (weather[0] == "Thunderstorm" && date.getSeconds() % 12 == 0 & weather[1] <= 5) {
            ctx.globalAlpha = 0.5 + (500 - date.getMilliseconds()) / 1000;
            ctx.fillStyle = "#ffff99";
            ctx.fillRect(0, 0, 528, 5);
            if (date.getMilliseconds() < 50) {
                soundeffect("Thunder.mp3");
            }
        }

    }
}

function bugBubble(x, y, scale = 1, mouseOver = false, bugList = 0) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);

    if (mouseOver) {
        circleCollision(x, y, 33.5 * scale) ? ctx.globalAlpha = 1: ctx.globalAlpha = 0.75;
        if (ctx.globalAlpha == 1 && !filterSelected) {
            bugSelected = bugList;
            if (mousedown && boxSelector == "Bug Selector Full") {
                boxSelector = "Bug Selector History";
            } else if (mousedown && boxSelector.split(" Facility ")[0] == "Info") {
                if (bugs.indexOf(bugList) !== -1 || bugList == "+") {
                    battleBugs[(x - 50) / 125] !== undefined ? [battleBugs.splice((x - 50) / 125, 1), bugList.Patrol = false] : boxSelector = "Bug Selector Facility" + boxSelector.split(" Facility ")[1];
                    save();
                    mousedown = false;
                }
            } else if (mousedown && boxSelector.substr(0, 21) == "Bug Selector Facility") {
                if (rooms[boxSelector.substr(21)].Type == 0) {
                    battleBugs.push(bugList);
                    bugList.Patrol = rooms[boxSelector.substr(21)];
                    save();
                    bugSelected = -1;
                    boxSelector = "Info Facility " + boxSelector.substr(21);
                } else {
                    if (bugs.filter(nameSearch => nameSearch.Patrol == rooms[boxSelector.substr(21)]).length < 8 || bugList.Patrol == rooms[boxSelector.substr(21)]) {
                        bugList.Patrol = bugList.Patrol !== rooms[boxSelector.substr(21)] ? rooms[boxSelector.substr(21)] : false;
                        save();
                    }
                }
                mousedown = false;
            } else if (mousedown) { 
                //Purple item consumption (Erudite)
                if(!(bugSelected.Trait == 2 && boxSelector.substr(21, 21) >= 2 && boxSelector.substr(21, 21) <= 4)){
                items[boxSelector.substr(21, 21)].quantity -= 1;
                }

                //effects can either be value, boolean, or based on an objects other values
                let itemAction = items[boxSelector.substr(21, 21)].action[1];

                if (itemAction == "Randomize") {
                    let uniqueTrait = Math.floor(Math.random() * traitDescp.length);
                    while (bugSelected.Trait == uniqueTrait) {
                        uniqueTrait = Math.floor(Math.random() * traitDescp.length);
                    }
                    bugSelected.Trait = uniqueTrait;
                    boxSelector = "Bug Selector History";
                } else {
                    bugSelected[items[boxSelector.substr(21, 21)].action[0]] =
                        (itemAction == "!Albino" ? !bugSelected["Albino"] : bugSelected[itemAction] !== undefined ? bugSelected[itemAction] : itemAction)
                    boxSelector = "Bug Selector Item";

                    //resets alignment text in case of change
                    bugSelected.AlignmentsText = [(100 / 90) * (90 - Math.abs(90 - bugSelected.Alignments)) > 0 ? (100 / 90) * (90 - Math.abs(90 - bugSelected.Alignments)) : 0,
                        (100 / 90) * (90 - Math.abs(180 - bugSelected.Alignments)) > 0 ? (100 / 90) * (90 - Math.abs(180 - bugSelected.Alignments)) : 0,
                        (100 / 90) * (90 - Math.abs(270 - bugSelected.Alignments)) > 0 ? (100 / 90) * (90 - Math.abs(270 - bugSelected.Alignments)) : 0
                    ];

                    bugSelected = -1;
                }
                save();
            }
        }
    } else {
        ctx.globalAlpha = 1;
    }

    ctx.drawImage(miscImg[1], 3, 3, 71, 71);

    if (bugList == "+") {
        textMaker("+", 77 / 2, 51.5, 50, true);
    } else if (mouseOver || (!mouseOver && bugList.obtained) || boxSelector.substr(0, 13) == "Info Facility" || battleMode) {
        ctx.drawImage(bugList.image !== undefined ? bugList.image : bugList.Image, bugList.image !== undefined ? bugList.image.width / 6 - 150 : bugList.Image.width / 6 - 150, bugList.image !== undefined ? bugList.cropY : bugStats[bugList.Species].cropY, 150, 22.5, 13, 15, 50, 7.5);
        ctx.drawImage(bugList.image !== undefined ? bugList.image : bugList.Image, bugList.image !== undefined ? bugList.image.width / 6 - 162 : bugList.Image.width / 6 - 162, bugList.image !== undefined ? bugList.cropY + 22.5 : bugStats[bugList.Species].cropY + 22.5, 162, 22.5, 9, 22.5, 54, 7.5);
        ctx.drawImage(bugList.image !== undefined ? bugList.image : bugList.Image, bugList.image !== undefined ? bugList.image.width / 6 - 174 : bugList.Image.width / 6 - 174, bugList.image !== undefined ? bugList.cropY + 45 : bugStats[bugList.Species].cropY + 45, 174, 60, 5, 30, 58, 20);
        ctx.drawImage(bugList.image !== undefined ? bugList.image : bugList.Image, bugList.image !== undefined ? bugList.image.width / 6 - 162 : bugList.Image.width / 6 - 162, bugList.image !== undefined ? bugList.cropY + 105 : bugStats[bugList.Species].cropY + 105, 162, 22.5, 9, 50, 54, 7.5);
        ctx.drawImage(bugList.image !== undefined ? bugList.image : bugList.Image, bugList.image !== undefined ? bugList.image.width / 6 - 150 : bugList.Image.width / 6 - 150, bugList.image !== undefined ? bugList.cropY + 127.5 : bugStats[bugList.Species].cropY + 127.5, 150, 19.5, 13, 57.5, 50, 6.5);
        ctx.drawImage(bugList.image !== undefined ? bugList.image : bugList.Image, bugList.image !== undefined ? bugList.image.width / 6 - 129 : bugList.Image.width / 6 - 129, bugList.image !== undefined ? bugList.cropY + 147 : bugStats[bugList.Species].cropY + 147, 105, 13.5, 20, 64, 35, 4.5);
    } else {
        textMaker("?", 77 / 2, 55, 50, true);
    }

    if (!battleMode || bugSelected !== -1) {
        ctx.beginPath();
        ctx.strokeStyle = bugs.indexOf(bugList) !== -1 && bugList.Patrol == rooms[boxSelector.substr(21)] && (boxSelector.substr(0, 21) == "Bug Selector Facility" || boxSelector.substr(0, 13) == "Info Facility") ? "#6e6e6e" : "#3a3a3a";
        ctx.lineWidth = 4.5;
        ctx.arc(77 / 2, 77 / 2, 33.5, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.closePath();
    } else if (bugSelected == -1 && bugList) {
        ctx.beginPath();
        ctx.strokeStyle = "#ce4c71";
        ctx.lineWidth = 4.5;
        ctx.arc(77 / 2, 77 / 2, 33.5, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.closePath();
        ctx.beginPath();
        ctx.strokeStyle = bugList.defects.poison > 0 ? "#cc66cc" : bugList.defects.slowDown > 0 ? "#0099ff" : bugList.defects.intimidate > 0 ? "#fcba03" : "#53db65";
        ctx.lineWidth = 4.5;
        ctx.arc(77 / 2, 77 / 2, 33.5, -(Math.PI / 180) * 90, -(Math.PI / 180) * ((bugList.Health / bugList.HealthTotal) * 360 + 90), true);
        ctx.stroke();
        ctx.closePath();
        
        if(circleCollision(x, y, 33.5 * scale) && mousedown && battleBugs.length > 0 && battleBugs[0].Health > 0 && scale == 0.5){
            x == 5 ? battleBugs[0].keyDown(49) : x == 45 ? battleBugs[0].keyDown(50) : battleBugs[0].keyDown(51);
            mousedown = false;
        }
    }
    ctx.restore();
}

function traitMaker(x, y, bugList) {
    ctx.globalAlpha = collision(mousex, mousey, 0, 0, x, y, 30, 30) ? 1 : 0.85;

    if (ctx.globalAlpha == 1) {
        ctx.fillStyle = "rgb(100,100,100,0.85)";
        ctx.strokeStyle = "rgb(50,50,50)";
        ctx.lineWidth = 5;
        ctx.strokeRect(x + 15, y - 50, 150, 75);
        ctx.fillRect(x + 15, y - 50, 150, 75);
        textMaker("Trait:", x + 35, y - 45, 15);
        textMaker(traitDescp[bugList.Trait][0], x + 70, y - 45, 15, false, traitDescp[bugList.Trait][1]);
        textMaker(traitDescp[bugList.Trait][2], x + 20, y - 25, 15, false);
        if (mousedown && boxSelector == "Bug Selector History" && bugSelected.Age >= 100) {
            boxSelector = "Bug Selector Item";
            bugSelected = -1;
            mousedown = false;
        }
    }

    ctx.beginPath();
    ctx.strokeStyle = traitDescp[bugList.Trait][1];
    ctx.lineWidth = 5;
    ctx.arc(x + 15, y + 15, 12.5, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.closePath();

    ctx.drawImage(miscImg[70], x, y, 30, 30);
}

function dialogueMaker() {
    ctx.strokeStyle = "rgb(0,0,0,1)";
    ctx.fillStyle = "rgb(0,0,0,0.75)";
    ctx.lineWidth = 6;
    ctx.strokeRect(-10, 225, 550, 100);
    ctx.fillRect(-10, 225, 550, 100);
    textMaker(textInfo[1][0], 90, 250, 25, false);
    textMaker(textInfo[1][2].substr(0, textInfo[1][3]), 80, 270, 15, false);
    textInfo[0] = bugStats[textInfo[1][1].split(" ").join("_")].image.cloneNode();
    ctx.drawImage(textInfo[0], 0, 0, textInfo[0].width / 6, textInfo[0].height / 3, 75 - textInfo[0].width / 18, 310 - textInfo[0].height / 9, textInfo[0].width / 18, textInfo[0].height / 9);

    textInfo[1][3] += 3;

    if (textInfo[1][3] < textInfo[1][2].length && textInfo[1][3] % 9 == 0) {
        soundeffect("Dialogue.mp3");
    }

    buttonMaker("Next", 420, 220, 1, action => [mousedown = false, textInfo.splice(1, 1)]);
    buttonMaker("Skip", 470, 220, 1, action => textInfo.splice(1, textInfo.length - 1));

    //Paused music plays after all dialogue is finished
    if (textInfo.length == 1) {
        music.play();
    }

}

//mouse follower, switches to touch move for mobile
function mousemake(event, clickAddOn=false) {
    if(clickAddOn){
        mousedown = true;
    }
    
    if(event.touches !== undefined){
        //2nd finger check for mobile, resets to first finger
        if(event.touches.length > 1){
        mousex = (event.touches[event.touches.length-1].clientX - nectarneCanvas.getBoundingClientRect().left) / (nectarneCanvas.height / 297);
        mousey = (event.touches[event.touches.length-1].clientY - nectarneCanvas.getBoundingClientRect().top) / (nectarneCanvas.height / 297);
            if(circleCollision(470, 245, 50)) { 
                battleBugs[0].keyDown(32); 
                battleBugs[0].keyUp["skillCheck"] = true;
             }
        }
            
        event = event.touches[0];
    }

    mousex = (event.clientX - nectarneCanvas.getBoundingClientRect().left) / (nectarneCanvas.height/297)
    mousey = (event.clientY - nectarneCanvas.getBoundingClientRect().top) / (nectarneCanvas.height/297)
}

function keydownmisc(event) {
    if (boxSelector.split("Select Facility ").length > 1) {
        let facilityIndex = Number(boxSelector.split(" Facility ")[1]);
        if ((event.keyCode == 39 || event.keyCode == 68)) {
            boxSelector = (facilityIndex >= rooms.length - 1 ? "Select Facility 0" : "Select Facility " + (facilityIndex + 1))
        }
        if ((event.keyCode == 37 || event.keyCode == 65)) {
            boxSelector = (facilityIndex - 1 < 0 ? "Select Facility " + (rooms.length - 1) : "Select Facility " + (Number(boxSelector.split(" Facility ")[1]) - 1))
        }

    } else if (boxSelector == "Guide") {
        if ((event.keyCode == 39 || event.keyCode == 68)) {
            page + 1 > 4 ? page = 0 : page += 1
        }
        if ((event.keyCode == 37 || event.keyCode == 65)) {
            page - 1 < 0 ? page = 4 : page -= 1
        }

    } else if (boxSelector == "Bug Compendium") {
        if ((event.keyCode == 39 || event.keyCode == 68)) {
            page + 1 > bugCompendium.length - 1 ? page = 0 : page += 1
        }
        if ((event.keyCode == 37 || event.keyCode == 65)) {
            page - 1 < 0 ? page = bugCompendium.length - 1 : page -= 1
        }

    } else if (!filterSelected && boxSelector.substr(0, 12) == "Bug Selector") {
        if ((event.keyCode == 39 || event.keyCode == 68)) {
            page + 1 > Math.floor((nameFilter.length - 1) / 8) ? page = 0 : page += 1
        }
        if ((event.keyCode == 37 || event.keyCode == 65)) {
            page - 1 < 0 ? page = Math.floor((nameFilter.length - 1) / 8) : page -= 1
        }

    } else if (filterSelected && boxSelector !== "Bug Selector History" && boxSelector.substr(0, 12) == "Bug Selector" && ((nameFilterContainer.length < 20 && ((event.keyCode >= 65 && event.keyCode <= 90) || event.keyCode == 32 || (event.keyCode >= 48 && event.keyCode <= 57))) || event.keyCode == 8 || event.keyCode == 13 || event.keyCode == 16)) {
        event.keyCode == 16 ? capsSelected = !capsSelected : event.keyCode == 13 ? [capSelected = false, filterSelected = false, save()] : event.keyCode == 8 ? nameFilterContainer = nameFilterContainer.substr(0, nameFilterContainer.length - 1) : nameFilterContainer += event.key

    } else if (filterSelected && boxSelector == "Bug Selector History" && ((bugSelected.Name.length < 20 && ((event.keyCode >= 65 && event.keyCode <= 90) || event.keyCode == 32 || (event.keyCode >= 48 && event.keyCode <= 57))) || event.keyCode == 8 || event.keyCode == 13 || event.keyCode == 16)) {
        event.keyCode == 16 ? capsSelected = !capsSelected : event.keyCode == 13 ? [capSelected = false, filterSelected = false, save()] : event.keyCode == 8 ? bugSelected.Name = bugSelected.Name.substr(0, bugSelected.Name.length - 1) : bugSelected.Name += event.key;
    } else {
        keyUp = event.keyCode;
    }
}

function keyupmake(event) {
    if (battleMode && battleBugs.length > 0 && battleBugs[0].keyUp[event.keyCode]) {
        battleBugs[0].keyUp[event.keyCode] = false;
    } else {
        keyUp = -1;
    }
}

function fullScreen(screenFit = true) {
    let ws = (window.innerWidth && document.documentElement.clientWidth) ?
            Math.min(window.innerWidth, document.documentElement.clientWidth) :
            window.innerWidth ||
            document.documentElement.clientWidth ||
            document.body.clientWidth;

    let hs = Math.floor(ws / (528 / 297));
    
    if (!document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement && !document.webkitCurrentFullScreenElement) {
        //If both are supported choose the lesser, if not choose the one that is supported. This helps with mobile support

            if (nectarneCanvas.webkitRequestFullscreen && screenFit) {
                /* Chrome, Safari and Opera */
                nectarneCanvas.webkitRequestFullscreen();
            } else if (nectarneCanvas.requestFullscreen && screenFit) {
                nectarneCanvas.requestFullscreen();
            } else if (nectarneCanvas.mozRequestFullScreen && screenFit) {
                /* Firefox */
                nectarneCanvas.mozRequestFullScreen();
            } else if (nectarneCanvas.msRequestFullscreen && screenFit) {
                /* IE/Edge */
                nectarneCanvas.msRequestFullscreen();
            }

            nectarneCanvas.width = ws
            nectarneCanvas.height = hs;

        mousedown = false;
    } else {
        if (document.webkitExitFullscreen) {
            /* Chrome, Safari and Opera */
            document.webkitExitFullscreen();
        } else if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.mozCancelFullScreen) {
            /* Firefox */
            document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
            /* IE/Edge */
            document.msExitFullscreen();
        }

        mousedown = false;
    } 
}

function bugTotal() {
    let total = 0;
    for (totalAdd in bugCompendium) {
        if (bugStats[bugCompendium[totalAdd]].obtained) {
            total += 1
        }
    }
    return total
}

function sellHandle(sellTotal, bugsReset) {
    bugsReset.map(reset => bugs.splice(bugs.indexOf(reset), 1))
    soundeffect("Territ.mp3")
    territs = Math.min(99999, territs + sellTotal)
    save();
    boxSelector = "";
}

function price(bugData, buy = true, albino = false) {
    /**
       Algorithm:
       1.Health + Speed + Attack
       2.
           Minus 100 if Common (101-150)
           Minus 150 if Rare (151-200)
           Minus 200 if Epic (201-250)
           Minus 250 if Legendary (251-300)
       3.Divide by (100/3)
       4.Add one
       Stat multiplier range ~  1x - 2.5x
       ----
           Value:
           Common > 1 (10-25 or 4-5)
           Rare > 2 (100-250 or 10-16)
           Legendary & Epic >  4 (10000-25000 or 100-159)

       5. Price = (10 ^ Value)*statMult - Ceil
       5. Selling Price = ((10 ^ Value)*statMult) ^ 0.5 - Ceil
           5a.Double selling price if Albino
    **/

    let statMult = (1 + (bugData.baseHealth + (bugData.baseSpeed * 12.5) + (bugData.baseAttack * 8) - (bugData.rarity == "Common" ? 100 : bugData.rarity == "Rare" ? 150 : bugData.rarity == "Epic" ? 200 : 250)) / (100 / 3))

    if (!buy) {
        return Math.ceil(Math.pow(Math.pow(10, bugData.rarity == "Epic" || bugData.rarity == "Legendary" ? 4 : bugData.rarity == "Rare" ? 2 : 1) * statMult, 0.5)) * (albino ? 2 : 1);
    } else {
        return Math.ceil(Math.pow(10, bugData.rarity == "Epic" || bugData.rarity == "Legendary" ? 4 : bugData.rarity == "Rare" ? 2 : 1) * statMult);
    }
}

function shopHandle(x, y, index, thumbnail) {
    if (index < 4) {
        if ((date - shop[index][1]) >= shop[index][2] * 3600000) {
            let randomizer = Math.floor(Math.random() * shop[index][3].length);
            while (shop[index][0] == shop[index][3][randomizer] && index !== 3) {
                randomizer = Math.floor(Math.random() * shop[index][3].length);
            }
            shop[index][0] = shop[index][3][randomizer];
            shop[index][1] = new Date();
            
            if (index == 3) {
                shop[index][1].setHours(0);
                shop[index][4] = 1;
                
                if(date.getDay() < 3){
                    shop[index][0] = shop[index][3][2];
                    
                    //Randomizes trait for the week
                    if (date.getDay() == 1) {  
                        shop[index][5] = Math.floor(Math.random()*7)+1;
                    } 
                } else if(date.getDay() < 5){
                    shop[index][0] = shop[index][3][1];
                } else {
                    shop[index][0] = shop[index][3][0];
                }
                
            } else if(index == 2) {
                shop[index][1].setHours(0);
            } else if(index == 1) {
                if(date.getHours() < 6) {
                    shop[index][1].setHours(0);
                } else if(date.getHours() < 12) {
                    shop[index][1].setHours(6);
                } else if(date.getHours() < 18) {
                    shop[index][1].setHours(12);
                } else {
                    shop[index][1].setHours(18);
                }
            } else {
                shop[index][1].setHours(date.getHours());
            }
              
            shop[index][1].setMinutes(0, 0, 0);
            save("Shop", JSON.stringify(shop));
        }

        ctx.save();
        ctx.filter = (index == 3 && shop[index][4] == 0) || bugs.length >= rooms.length * 8 || territs < price(bugStats[shop[index][0]], true) ? "brightness(60%)" : collision(mousex, mousey, 0, 0, x, y, 200, 100) ?
            "brightness(100%)" : "brightness(80%)"
        ctx.drawImage(miscImg[thumbnail], x, y, 200, 100);
        ctx.drawImage(bugStats[shop[index][0]].image, 0, 0, bugStats[shop[index][0]].image.width / 6, bugStats[shop[index][0]].image.height / 3, x + 100 - bugStats[shop[index][0]].image.width / 36, y + 50 - bugStats[shop[index][0]].image.height / 18, bugStats[shop[index][0]].image.width / 18, bugStats[shop[index][0]].image.height / 9);
  
        if (mousedown && Number(ctx.filter.split("(")[1].split("%)")[0]) == 100) {
            bugs.push(new bugBuild(shop[index][0].split("_").join(" "), Math.random() * 528, 280, shop[index][0], 0, false, 0));
            bugs[bugs.length - 1].defects.evolution = 1;
            bugs[bugs.length - 1].Story = bugs[bugs.length - 1].Story.split("\nFather").join(" from the Nectarne Market\nFather");
            soundeffect("Territ.mp3")
            territs -= price(bugStats[shop[index][0]], true);
            save();
            mousedown = false;
            if (index == 3) { 
                shop[index][4] = 0;
                bugs[bugs.length - 1].Trait = shop[index][5];
            }
        }
        ctx.restore();

        textMaker(index == 3 ? "Shop Exclusive ": shop[index][0].split("_").join(" "), x + 100, y + 10, 25, true);
        textMaker(index == 3 ? "Get exclusive bugs throughout the week!\nOnly one bug can be bought a day for\nthis 5 day event. Bugs are traited.\n" : bugStats[shop[index][0]].descp, x + 100, y + 125, 15, true);
        textMaker("$  " + price(bugStats[shop[index][0]], true), x + 110, y + 100, 25, true);
        textMaker("@" + (shop[index][2] - 1 - Math.floor((date - shop[index][1]) / 3600000)) + ":" + ("0" + (60 - Math.ceil((date - shop[index][1]) % 3600000 / 60000))).slice(-2), x, y + 10, 15, true);
        
        if (index == 3){
            textMaker(shop[index][4]+"/1   Trait:", 528/2-30, y + 180, 15, true);
            textMaker(traitDescp[shop[index][5]][0], 528/2+30, y + 180, 15, true, traitDescp[shop[index][5]][1]);
        }

    } else {
        ctx.save();
        ctx.filter = bugs.length >= rooms.length * 8 || territs < 250 ? "brightness(60%)" : collision(mousex, mousey, 0, 0, x, y, 200, 100) ? "brightness(100%)" : "brightness(80%)"

        ctx.strokeStyle = shop[index][2];
        ctx.lineWidth = shop[index][1];
        ctx.strokeRect(x, y, 200, 100);
        shop[index][1] = Math.max(2, shop[index][1] - 32 / 30);
        ctx.drawImage(miscImg[thumbnail], x, y, 200, 100);

        if (mousedown && Number(ctx.filter.split("(")[1].split("%)")[0]) == 100) {
            //Weekends go through 0-50 effectively doubling the rarity of rares and epics
            let randomizer = date.getDay() == 0 || date.getDay() == 6 ? Math.floor(Math.random() * 50) + 1 : Math.floor(Math.random() * 100) + 1;
            let bannerPull = randomizer <= 1 ? 2 : randomizer <= 10 ? 1 : 0;
            shop[index][2] = randomizer <= 1 ? "rgb(236,179,255,0.85)" : randomizer <= 10 ? "rgb(128,179,255,0.85)" : "rgb(179,255,179,0.85)";
            shop[index][0] = shop[bannerPull][3][Math.floor(Math.random() * shop[bannerPull][3].length)];

            bugs.push(new bugBuild(shop[index][0].split("_").join(" "), Math.random() * 528, 280, shop[index][0], 0, false, 0));
            bugs[bugs.length - 1].defects.evolution = 1;
            bugs[bugs.length - 1].Story = bugs[bugs.length - 1].Story.split("\nFather").join(" from a Nectarne Special\nFather");
            soundeffect("Territ.mp3")
            territs -= 250;
            shop[index][1] = 10;
            save();
            mousedown = false;
        }

        ctx.restore();

        textMaker(date.getDay() == 0 || date.getDay() == 6 ? "Weekend Special" : "Special", x + 100, y + 10, 25, true);
        textMaker("Test your luck against this special banner!\nChances are doubled on weekends.", x + 100, y + 125, 15, true);
        textMaker("Common: ", x + 80, y + 30, 15, true, "#b3ffb3");
        textMaker("Rare: ", x + 90, y + 50, 15, true, "#80b3ff");
        textMaker("Epic: ", x + 92, y + 70, 15, true, "#ecb3ff");
        textMaker(date.getDay() == 0 || date.getDay() == 6 ? "80%\n18%\n2%" : "90%\n9%\n1%", x + 120, y + 30, 15, true);
        textMaker("$  250", x + 110, y + 100, 25, true);
        if (date.getDay() == 0 || date.getDay() == 6) {
            textMaker("2x value!", x + 190, y + 100, 15, true);
        }
    }
}

function tutorial() {
    if (rooms.length < 3 && textInfo[0].src.split("/")[textInfo[0].src.split("/").length - 1] !== "Termite.png") {
        textInfo.push(["???", "Termite", "You must be the new manager of Nectarne? Hm, it seems as though there is\nstill a lot of unused land. I'll set up a vitality field.", 0], ["???", "Termite", "No bugs eh? We all have to start somewhere don't we. Antonio and Venus\nwill help you get started. Click them to continue with our little tutorial.", 0]);
    } else if (rooms.length < 3 && textInfo.length == 1 && textInfo[0].src.split("/")[textInfo[0].src.split("/").length - 1] == "Termite.png") {
        //Albino lock
        rooms.push(new facilityBuild(6, 2));
        bugs.push(new bugBuild("Antonio", -50, 268, "Ant", 270, false, 50));
        bugs[bugs.length - 1].defects.evolution = 1;
        bugs[bugs.length - 1].Gender = "Male";
        bugs[bugs.length - 1].Immortal = true;
        bugs.push(new bugBuild("Venus", -25, 268, "Fly", 0, false, 50));
        bugs[bugs.length - 1].defects.evolution = 1;
        bugs[bugs.length - 1].Gender = "Female";
        bugs[bugs.length - 1].Immortal = true;
        save();
    } else if (rooms[0].MissionList.length == 0 && bugSelected !== -1 && bugs[bugs.length - 1].Story.split(" from Teresa").length == 1) {
        textInfo.push(["???", "Termite", "This is a bug's stats. Here you can find a bug's health, attack, speed, and age. You\ncan also find their alignments, passiveness, intelligence, and aggressiveness.", 0], ["???", "Termite", "In the top right you'll see their rarity, skill, and whether or not they're\nalbino, agile swimmers, and can fly.", 0], ["???", "Termite", "I've set up a guide in your field settings! Open it up in the top right\nmenu. After you're done reading it meet me in Corntill Plains.", 0]);
        bugs[bugs.length - 1].Story = bugs[bugs.length - 1].Story.split("\nFather").join(" from Teresa\nFather");
        bugs[bugs.length - 2].Story = bugs[bugs.length - 2].Story.split("\nFather").join(" from Teresa\nFather");
        save("Bugs", JSON.stringify(bugs));
    } else if (rooms[0].MissionList.length == 0 && boxSelector == "Guide" && page == 4 && bugs[bugs.length - 1].Story.split(" from Teresa").length > 1) {
        rooms[0].MissionList.push([0, battleLoot(0)]);
        soundeffect("GateClose.mp3");
        save("Facilities", JSON.stringify(rooms));
    } else if (rooms[0].MissionList.length !== 0 && rooms[0].MissionList[0][0] == 1 && items[9].quantity == 0 && textInfo.length == 1) {
        textInfo.push(["???", "Termite", "You handled yourself pretty well there if I say so myself! I don't think we had\na formal introduction yet. I'm Teresa, a mercenary consultant.", 0], ["Teresa", "Termite", "You may have noticed me and your troops are still doing well. Venus, Antonio,\nand I are immortal.", 0], ["Teresa", "Termite", "Not all bugs are so I suggest you choose your battles wisely. I wouldn't risk\na favorite dying on patrol. Say, here's a slouching miracle. You've earned it.", 0]);
        items[9].quantity += 1;
        save("Items", JSON.stringify(items));
    } else if (rooms[0].MissionList.length !== 0 && rooms[0].MissionList[0][0] == 2 && rooms.length < 4 && textInfo.length == 1) {
        textInfo.push(["Teresa", "Termite", "Interesting. I'm impressed. Sadly, I have to go, see you around.", 0], ["Teresa", "Termite", "Before I go, I would like to mention a Love Field has been built! Annie would\nlike to help your colony as well. Maybe you can show her around?", 0], ["Teresa", "Termite", "She's good at working these things out. I suggest a blind date. With who?\nI'll leave that up to you to decide!", 0]);
        rooms.push(new facilityBuild(5, 3));
        bugs.push(new bugBuild("Annie", -50, 268, "Ant", 90, false, 75));
        bugs[bugs.length - 1].defects.evolution = 1;
        bugs[bugs.length - 1].Gender = "Female";
        bugs[bugs.length - 1].Trait = 4;
        bugs[bugs.length - 1].Story = bugs[bugs.length - 1].Story.split("\nFather").join(" from Teresa\nFather");
        save();
    } else if (rooms[0].MissionList.length !== 0 && rooms[0].MissionList[0][0] == 3 && rooms.length < 5 && textInfo.length == 1) {
        textInfo.push(["Teresa", "Termite", "Just stopped a guild fight. Things are getting wild around these parts\never since that blight.", 0], ["Teresa", "Termite", "We finished building one of those specialized Nectar Groves! If you\nhave some intelligent bugs, now would be a good time to use them!", 0]);
        rooms.push(new facilityBuild(3, 4));
        save();
    } else if (rooms[0].MissionList.length !== 0 && rooms[0].MissionList[0][0] == 4 && rooms.length < 6) {
        rooms.push(new facilityBuild(4, 5));
        save("Facilities", JSON.stringify(rooms));
    } else if (rooms[0].MissionList.length !== 0 && rooms[0].MissionList[0][0] == 5 && rooms.length < 7 && textInfo.length == 1) {
        textInfo.push(["Teresa", "Termite", "Those bees had a Territ Stronghold! I would've never expected one of these\nin a hive. They must be taking this seriously?", 0], ["Teresa", "Termite", "Anyway. You have more missions available, I suggest to stay low. The\nnorthern ponds are an isolated place...", 0]);
        rooms.push(new facilityBuild(2, 6));
        rooms[0].MissionList.push([19, battleLoot(19)]);
        save();
    } else if (rooms[0].MissionList.length !== 0 && rooms[0].MissionList[0][0] == 9 && rooms.length < 8 && textInfo.length == 1) {
        textInfo.push(["Teresa", "Termite", "We got enough air to make an Air Dome - what about those butterflies?\nThey were originally from the prairies.", 0], ["Teresa", "Termite", "I saw some mercenaries in the prairies. Let's see if they know what's going\non. I'm getting a hunch they might not take this lightly.", 0]);
        rooms.push(new facilityBuild(9, 7));
        save();
    } else if (rooms[0].MissionList.length !== 0 && rooms[0].MissionList[0][0] == 10 && rooms.length < 9 && textInfo.length == 1) {
        textInfo.push(["Teresa", "Termite", "Were those spiders of any use? No? I think they know by now how much\nof a dominant force we are.", 0], ["Teresa", "Termite", "Anyway. You have more missions available, and a Life Field! We were able to\npick one up in the prairies.", 0], ["Teresa", "Termite", "Let's keep searching for more clues.", 0]);
        rooms.push(new facilityBuild(7, 8));
        rooms[0].MissionList.push([22, battleLoot(22)]);
        save();
    } else if (rooms[0].MissionList.length !== 0 && rooms[0].MissionList[0][0] == 13 && rooms.length < 10 && textInfo.length == 1) {
        textInfo.push(["Teresa", "Termite", "We gathered enough water to make a Water Dome - if you have aquatic bugs\nthis is a perfect place to heal up!", 0], ["Teresa", "Termite", "That was a strange turn of events. On a mission I met tarantulas talking\nabout primordial power? Let's visit their lair...", 0]);
        rooms.push(new facilityBuild(8, 9));
        save();
    }
    
    //Pointer arrows
    if (rooms.length == 3 && rooms[0].MissionList.length == 0 && bugs.length > 0 && bugSelected == -1 && bugs[bugs.length - 1].Story.split(" from Teresa").length == 1){
        arrowMaker(bugs[0].X-scrollx, bugs[0].Y-40, 0, false);
        arrowMaker(bugs[1].X-scrollx, bugs[1].Y-40, 0, false);
    } else if(rooms[0].MissionList.length == 0 && rooms[0].MissionList.length == 0 && bugs.length > 0 && bugs[bugs.length - 1].Story.split(" from Teresa").length > 1) {
        arrowMaker(496.5, 65, 180, false);
    } else if (rooms[0].MissionList.length !== 0 && rooms[0].MissionList[0][0] == 0) {
        arrowMaker(245, 60, 180, false);
    }
    
}

function save(key = null, value = null) {
    if (key == null) {
        localStorage.setItem("Bugs", JSON.stringify(bugs));
        localStorage.setItem("Facilities", JSON.stringify(rooms));
        localStorage.setItem("Items", JSON.stringify(items));
        localStorage.setItem("Compendium", JSON.stringify(bugStats));
        localStorage.setItem("Shop", JSON.stringify(shop));
        localStorage.setItem("Territs", JSON.stringify(territs));
        localStorage.setItem("Food", JSON.stringify(food));
        localStorage.setItem("Weather", JSON.stringify(weather));
        localStorage.setItem("Music", JSON.stringify(musicvolume));
        localStorage.setItem("FullScreen", JSON.stringify(nectarneCanvas.width));
        localStorage.setItem("Sound", JSON.stringify(soundeffectvolume));
    } else {
        localStorage.setItem(key, value);
    }
}

function load(deleteFile = false) {
    if (!deleteFile) {
        scrollx = 0;
        bugs = JSON.parse(localStorage.getItem("Bugs"));
        bugSelected = -1;
        battleBugs = [];
        rooms = JSON.parse(localStorage.getItem("Facilities"));
        shop = JSON.parse(localStorage.getItem("Shop"));

        //Deal refresh, keeps all deals on pace
        shop[0][1] = new Date(shop[0][1]);
        shop[1][1] = new Date(shop[1][1]);
        shop[2][1] = new Date(shop[2][1]);
        shop[3][1] = new Date(shop[3][1]);

        territs = JSON.parse(localStorage.getItem("Territs"));
        food = JSON.parse(localStorage.getItem("Food"));
        weather = JSON.parse(localStorage.getItem("Weather"));
        musicvolume = JSON.parse(localStorage.getItem("Music"));
        soundeffectvolume = JSON.parse(localStorage.getItem("Sound"));

        if(boxSelector == "" && music.src.split("muzak/")[1] !== "MainTheme.mp3"){
            music.pause();
            music = new Audio("muzak/MainTheme.mp3");
            music.volume = 0.7;
            music.loop = true;
            music.play();
        }
        
        //resets battles
        battleEnemies = [];
        battleInfo = rooms[0].MissionList[rooms[0].MissionSelect];
        battleMode = false;
        boxSelector = "";
        
        for (let roomImage in rooms) {
            rooms[roomImage].Image = miscImg[facilities[rooms[roomImage].Type].miscIndex].cloneNode();
            rooms[roomImage].info = facilityBuild.prototype.info;
            rooms[roomImage].draw = facilityBuild.prototype.draw;
        }

        for (let bugImage in bugs) {
            bugs[bugImage].Image = bugStats[bugs[bugImage].Species].image.cloneNode();
            bugs[bugImage].DateRecord = new Date(bugs[bugImage].DateRecord);
            bugs[bugImage].Patrol = bugs[bugImage].Patrol !== false ? rooms[bugs[bugImage].Patrol.Index] : false;
            bugs[bugImage].bugCollision = bugBuild.prototype.bugCollision;
            bugs[bugImage].collision = bugBuild.prototype.collision;
            bugs[bugImage].constants = bugBuild.prototype.constants;
            bugs[bugImage].skill = bugBuild.prototype.skill;
            bugs[bugImage].combat = bugBuild.prototype.combat;
            bugs[bugImage].keyDown = bugBuild.prototype.keyDown;
            bugs[bugImage].stats = bugBuild.prototype.stats;
            bugs[bugImage].bubbleCreate = bugBuild.prototype.bubbleCreate;
            bugs[bugImage].draw = bugBuild.prototype.draw;
            bugs[bugImage].defects = {};
            if (bugs[bugImage].Patrol.Type == 0) {
                battleBugs.push(bugs[bugImage]);
            }
        }

        for (let obtainedBugs in bugCompendium) {
            const obtainedChecker = JSON.parse(localStorage.getItem("Compendium"));
            bugStats[bugCompendium[obtainedBugs]].obtained = obtainedChecker[bugCompendium[obtainedBugs]].obtained ? true : false;
        }

        for (let itemIndex = 0; itemIndex < 10; itemIndex++) {
            const quantityChecker = JSON.parse(localStorage.getItem("Items"));
            items[itemIndex].quantity = quantityChecker[itemIndex].quantity;
        }
             
    } else {
        localStorage.clear();
        scrollx = 0;
        boxSelector = "";
        bugs = [];
        rooms = [new facilityBuild(0, 0), new facilityBuild(1, 1)];
        for (let refresh = 0; refresh < 10; refresh++) {
            items[refresh].quantity = 0;
        }
        for (bugIndex in bugCompendium) {
            bugStats[bugCompendium[bugIndex]].obtained = false;
        }
        territs = 25;
        food = 500;
        shop = [
        ["Ant", new Date(0), 1, ["Ant", "Termite", "Fly", "Wriggler", "Water_Tiger"]],
        ["Glowworm", new Date(0), 6, ["Glowworm", "Caterpillar", "Pondskater", "Bed_Bug", "Bee"]],
        ["Scorpion", new Date(0), 24, ["Weta", "Mantis", "Scorpion", "Spider", "Millipede"]],
        ["Ant", new Date(0), 24, ["Centipede", "Giant_Water_Bug", "Mantis"], 0, 0],
        ["Ant", 0, "rgb(179,255,179,0.85)"],
        ];
        textInfo = [new Image()]
    }
}
