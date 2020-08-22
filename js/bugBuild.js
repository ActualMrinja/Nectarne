bugBuild = function(name, x, y, species, alignments, enemy = false, age = 100) {
    this.Species = species;
    this.X = x;
    this.Y = y;

    this.Image = bugStats[this.Species].image.cloneNode();
    this.Gender = Math.floor(Math.random() * 2) == 0 ? "Male" : "Female";

    this.Name = name;
    this.Trait = 0;
    this.Alignments = alignments;
    this.AlignmentsText = [(100 / 90) * (90 - Math.abs(90 - alignments)) > 0 ? (100 / 90) * (90 - Math.abs(90 - alignments)) : 0,
        (100 / 90) * (90 - Math.abs(180 - alignments)) > 0 ? (100 / 90) * (90 - Math.abs(180 - alignments)) : 0,
        (100 / 90) * (90 - Math.abs(270 - alignments)) > 0 ? (100 / 90) * (90 - Math.abs(270 - alignments)) : 0
    ];
    this.Albino = Math.floor(Math.random() * 50) == 0 && !enemy ? true : false;

    //Aesthetic values
    this.Animation = 0;
    this.AnimationReverse = false;
    this.Scale = enemy ? -1 : 1;
    this.Rotate = 0;
    this.SwimmingDistance = 0;
    this.Age = age;

    //Battling Info 
    this.Enemy = enemy;

    this.Speed = bugStats[this.Species].baseSpeed;
    this.Health = bugStats[this.Species].baseHealth;
    this.HealthTotal = bugStats[this.Species].baseHealth;
    this.Attack = bugStats[this.Species].baseAttack;

    this.keyUp = {};
    this.defects = {};
    this.Jump = 0;
    this.Hold = false;
    this.Swimming = false;
    this.Attacking = false;
    this.Fury = 0;
    this.Immortal = false;

    //Facility handlers
    this.Patrol = false;
    this.DateRecord = new Date();

    //Personality assignment
    this.Story = "Received: " + months[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear() + "\nFather: Unknown\nMother: Unknown\n\nPersonality: " +
        (Math.floor(Math.random() * 2) == 0 ? "Extraverted" : "Introverted") +
        (Math.abs(90 - this.Alignments) < 90 ? " and extremely compassionate.\n" : Math.abs(180 - this.Alignments) < 90 ? " and intuitive almost to a fault.\n" : Math.abs(270 - this.Alignments) < 90 ? " and awfully hostile to others.\n" : " down to earth kind of bug.\n") + (bugStats[this.Species].rarity == "Common" ? "They never felt special. In fact, they may not even be\nspecial at all. " : bugStats[this.Species].rarity == "Rare" ? "They feel somewhat special, athough inside they feel like\nthey are never enough. " : bugStats[this.Species].rarity == "Epic" ? "They are very confident in themselves and may be\nmistaken for royalty. " : "They almost have a magnetic personality, others are\ndrawn to their charisma. ") + (this.Albino ? "Strangely, they feel watched." : "");

    //Certain ambushers start invisible
    if (this.Enemy && bugStats[this.Species].skillName == "Specialized Ambush") {
        this.Fury = 1;
    }
}

bugBuild.prototype.bugCollision = function(index, hitBox = false) {
    if (!hitBox) {
        //Coils halve a hit box
        if (bugStats[index.Species].skillName == "Defensive Coil" && index.Animation >= 2.9 && index.Attacking) {
            index.Image.width /= 2;
        }

        if (collision(index.X - index.Image.width / 144 * (index.Age / 150 + 0.5), index.Y - index.Image.height / 36 * (index.Age / 150 + 0.5) - index.Image.height / 144 * (index.Age / 150 + 0.5), index.Image.width / 72 * (index.Age / 150 + 0.5), index.Image.height / 36 * (index.Age / 150 + 0.5), this.X - this.Image.width / 144 * (this.Age / 150 + 0.5), this.Y - this.Image.height / 36 * (this.Age / 150 + 0.5) - this.Image.height / 144 * (this.Age / 150 + 0.5), this.Image.width / 72 * (this.Age / 150 + 0.5), this.Image.height / 36 * (this.Age / 150 + 0.5))) {

            //Resets hitbox
            if (bugStats[index.Species].skillName == "Defensive Coil" && index.Animation >= 2.9 && index.Attacking) {
                index.Image.width *= 2;
            }

            return true;
        } else {

            //Resets hitbox
            if (bugStats[index.Species].skillName == "Defensive Coil" && index.Animation >= 2.9 && index.Attacking) {
                index.Image.width *= 2;
            }

            return false;
        }
    } else {
        if (collision(index.X - index.Image.width / 144 * (index.Age / 150 + 0.5), index.Y - index.Image.height / 36 * (index.Age / 150 + 0.5) - index.Image.height / 72 * (index.Age / 150 + 0.5), index.Image.width / 72 * (index.Age / 150 + 0.5), index.Image.height / 36 * (index.Age / 150 + 0.5), hitBox[0], hitBox[1], hitBox[2], hitBox[3])) {
            return true;
        } else {
            return false;
        }
    }
}

bugBuild.prototype.collision = function(collisionIndex) {
    if (battleMap[Number(collisionIndex[4][0])][Number(collisionIndex[4][1])] == 2 && collision(collisionIndex[0], collisionIndex[1], collisionIndex[2], collisionIndex[3], this.X - this.Image.width / 144 * (this.Age / 150 + 0.5), this.Y - this.Image.height / 36 * (this.Age / 150 + 0.5) - this.Image.height / 72, this.Image.width / 72 * (this.Age / 150 + 0.5), this.Image.height / 36 * (this.Age / 150 + 0.5))) {
        this.Swimming = true;
        this.SwimmingDistance = collisionIndex[3] == 25 && this.Y < (collisionIndex[1] + 30) ? Math.abs(collisionIndex[1] - this.Y) + 25 : 40;
        if (Math.abs(this.SwimmingDistance - 25) <= 10 && !this.Attacking && boxSelector == "") {
            soundeffect("Splash.mp3");
        }
    }

    //Blocks disable sprays 
    if (battleMap[Number(collisionIndex[4][0])][Number(collisionIndex[4][1])] == 1 && this.defects.venomSpray > 0 && collision(this.X + (8 * (this.Age / 150 + 0.5) * this.Scale) - (this.Scale == -1 ? Math.abs(2 - this.defects.venomSpray) * 60 : 0), this.Y - this.Image.height / 72 - 16 * (this.Age / 150 + 0.5), Math.abs(2 - this.defects.venomSpray) * 60, this.Image.height / 600 * (this.Age / 150 + 0.5), collisionIndex[0], collisionIndex[1], collisionIndex[2], collisionIndex[3])) {
        this.defects.venomSpray = 0;
        this.Attacking = 0;
        this.Attacking = false;
    }

    //Enemies can't pass through boss entrances
    if (collisionIndex[4][0] > 0 && battleMap[Number(collisionIndex[4][0]) - 1][Number(collisionIndex[4][1])] == 3 && !(battleInfo[1][0][3] > 0) && collision(collisionIndex[0], collisionIndex[1] - 50, 10, 55, this.X - this.Image.width / 144 * (this.Age / 150 + 0.5), this.Y - this.Image.height / 36 * (this.Age / 150 + 0.5) - this.Image.height / 72, this.Image.width / 72 * (this.Age / 150 + 0.5), this.Image.height / 36 * (this.Age / 150 + 0.5)) && this.Enemy && this.X > battleMap[0].length * 50 - 700) {
        this.X -= 15 * this.Scale;
        this.Health = 0;
        ctx.fillStyle = "#ccf5ff";
        ctx.globalAlpha = 0.85;
        ctx.fillRect(collisionIndex[0] - scrollx, collisionIndex[1] - 50, 10, 50);
        this.Scale *= -1;
        this.bubbleCreate(5);
        this.Scale *= -1;
        soundeffect("Zap.mp3");
    }

    if (battleMap[Number(collisionIndex[4][0])][Number(collisionIndex[4][1])] == 1 && collision(collisionIndex[0], collisionIndex[1], collisionIndex[2], collisionIndex[3], this.X - this.Image.width / 144 * (this.Age / 150 + 0.5), this.Y - this.Image.height / 36 * (this.Age / 150 + 0.5) - this.Image.height / 72, this.Image.width / 72 * (this.Age / 150 + 0.5), this.Image.height / 36 * (this.Age / 150 + 0.5))) {

        if (this.Y - collisionIndex[1] <= 28 && this.Y - collisionIndex[1] >= 15 && collisionIndex[4][0] > 0 && collisionIndex[4][0] > 0 && battleMap[Number(collisionIndex[4][0]) - 1][Number(collisionIndex[4][1])] !== 1 && collision(collisionIndex[0] + (collisionIndex[2] / 2) - (55 / 4) - 5, collisionIndex[1], collisionIndex[2] - 55 / 2 + 10, 20, this.X - this.Image.width / 144 * (this.Age / 150 + 0.5), this.Y - this.Image.height / 36 * (this.Age / 150 + 0.5) - this.Image.height / 72, this.Image.width / 72 * (this.Age / 150 + 0.5), this.Image.height / 36 * (this.Age / 150 + 0.5))) {
            this.Y = collisionIndex[1] + 15;
            this.Hold = true;

            //Touching the floor disables flying
            if (this.Jump == 5 && bugStats[this.Species].flyAble) {
                this.Jump = 0;
                soundeffect("FlyEnd.mp3");
            }

            if (battleBugs.length > 0 && collisionIndex[4][0] > 1 && battleMap[Number(collisionIndex[4][0]) - 2][Number(collisionIndex[4][1])] !== 1 && bugStats[this.Species].flyAble && this.Enemy && this.Y > battleBugs[0].Y && !(battleBugs.length > 0 && bugStats[this.Species].skillName == "Specialized Ambush" && Math.abs(this.X - battleBugs[0].X) > 120)) {
                if (this.Jump == 0 && this.Hold == true) {
                    soundeffect("FlyStart.mp3");
                }
                this.Jump = 10;
            }

            if (battleMap[Number(collisionIndex[4][0]) - 1][Number(collisionIndex[4][1])] == 2) {
                this.Swimming = true;
            }

        }

        if ((this.Y - this.Image.height / 36 * (this.Age / 150 + 0.5) - this.Image.height / 72) > collisionIndex[1]) {

            if (collision(collisionIndex[0] + (collisionIndex[2] / 2) - (55 / 4), collisionIndex[1] + collisionIndex[3] + 3, collisionIndex[2] / 2, 15, this.X - this.Image.width / 144 * (this.Age / 150 + 0.5), this.Y - this.Image.height / 36 * (this.Age / 150 + 0.5) - this.Image.height / 72, this.Image.width / 72 * (this.Age / 150 + 0.5), this.Image.height / 36 * (this.Age / 150 + 0.5)) && collisionIndex[4][0] < 5 && battleMap[Number(collisionIndex[4][0]) + 1][Number(collisionIndex[4][1])] !== 1) {
                this.Y = collisionIndex[1] + collisionIndex[3] + (this.Image.height / 36 * (this.Age / 150 + 0.5)) + this.Image.height / 72 + (this.Speed - 1);
                this.Jump = 5;
            }

            if (collisionIndex[4][1] - 1 > 0 && battleMap[Number(collisionIndex[4][0])][Number(collisionIndex[4][1] - 1)] !== 1 && collision(collisionIndex[0], collisionIndex[1], 1, collisionIndex[3], this.X - this.Image.width / 144 * (this.Age / 150 + 0.5), this.Y - this.Image.height / 36 * (this.Age / 150 + 0.5) - this.Image.height / 72, this.Image.width / 72 * (this.Age / 150 + 0.5), this.Image.height / 36 * (this.Age / 150 + 0.5))) {
                this.X = collisionIndex[0] - (this.Image.width / 144 * (this.Age / 150 + 0.5));

                if (this.Enemy && collisionIndex[4][0] > 0 && collisionIndex[4][0] < 5 && battleMap[Number(collisionIndex[4][0]) - 1][Number(collisionIndex[4][1])] !== 1 && ((this.Y - this.Image.height / 36 * (this.Age / 150 + 0.5)) - collisionIndex[1]) > 35 && this.Jump == 0 && this.Hold) {
                    this.Jump = 10;
                }

                if (this.Enemy && (battleBugs.length == 0 || (bugStats[battleBugs[0].Species].skillName == "Specialized Ambush" && battleBugs[0].Fury >= 0.98))) {
                    this.Scale *= -1
                }

            } else if (collisionIndex[4][1] + 1 < battleMap[0].length && battleMap[Number(collisionIndex[4][0])][Number(collisionIndex[4][1] + 1)] !== 1 && collision(collisionIndex[0] + collisionIndex[2] - 1, collisionIndex[1], 1, collisionIndex[3], this.X - this.Image.width / 144 * (this.Age / 150 + 0.5), this.Y - this.Image.height / 36 * (this.Age / 150 + 0.5) - this.Image.height / 72, this.Image.width / 72 * (this.Age / 150 + 0.5), this.Image.height / 36 * (this.Age / 150 + 0.5))) {
                this.X = collisionIndex[0] + collisionIndex[2] + (this.Image.width / 144 * (this.Age / 150 + 0.5));

                if (this.Enemy && collisionIndex[4][0] > 0 && collisionIndex[4][0] < 5 && battleMap[Number(collisionIndex[4][0]) - 1][Number(collisionIndex[4][1])] !== 1 && ((this.Y - this.Image.height / 36 * (this.Age / 150 + 0.5)) - collisionIndex[1]) > 35 && this.Jump == 0 && this.Hold) {
                    this.Jump = 10;
                }

                if (this.Enemy && (battleBugs.length == 0 || (bugStats[battleBugs[0].Species].skillName == "Specialized Ambush" && battleBugs[0].Fury >= 0.98))) {
                    this.Scale *= -1
                }

            }

        }

        //Touching the center of blocks is an insta-kill
        if (battleMap[Number(collisionIndex[4][0])][Number(collisionIndex[4][1])] == 1 && collision(collisionIndex[0] + collisionIndex[2] / 2 - collisionIndex[2] / 8, collisionIndex[1] + collisionIndex[3] / 2 - collisionIndex[3] / 8, collisionIndex[2] / 4, collisionIndex[3] / 4, this.X - this.Image.width / 144 * (this.Age / 150 + 0.5), this.Y - this.Image.height / 36 * (this.Age / 150 + 0.5) - this.Image.height / 72, this.Image.width / 72 * (this.Age / 150 + 0.5), this.Image.height / 36 * (this.Age / 150 + 0.5))) {
            this.Health = 0;
        }

        return true;
    } else {
        return false;
    }
}

//multFactor is dependent on date difference
bugBuild.prototype.constants = function(multFactor) {
    if (!bugStats[this.Species].obtained) {
        bugStats[this.Species].obtained = true
    }

    if (bugStats[this.Species].evolve && this.Age >= 50) {
        this.defects.evolution = 1;
        if (this.Name.split(" ").join("_") == this.Species) {
            this.Name = bugStats[this.Species].evolve.split("_").join(" ")
        }
        this.Species = bugStats[this.Species].evolve;
        this.Image = bugStats[this.Species].image;
        this.Health = Math.min(bugStats[this.Species].baseHealth, this.Health + bugStats[this.Species].baseHealth - this.HealthTotal);
        this.HealthTotal = bugStats[this.Species].baseHealth;
    }

    //Flying is disabled for all bugs if not in a therapy location
    if (!this.Patrol || (this.Patrol.Type !== 8 && this.Patrol.Type !== 9)) {
        this.Jump = 0
    }

    if (this.Patrol && this.X < 500 + this.Patrol.Index * 528 && this.X > this.Patrol.Index * 528 + 28) {

        switch (this.Patrol.Type) {
            case 0:
                if (this.Health !== this.HealthTotal) {
                    this.Patrol = false;
                    battleBugs.splice(battleBugs.indexOf(this), 1);
                    save();
                }
                break;

            case 2:
                territs = Math.min(99999, territs + ((weather[0] == "Snowstorm" ? 0.1 : 0.05) / 1800 * multFactor) * (this.AlignmentsText[1] / 100));
                break;

            case 3:
                food = Math.min(99999, food + (5 / 1800 * multFactor) * (this.AlignmentsText[1] / 100));
                netFood += 5 * (this.AlignmentsText[1] / 100)
                break;

            case 4:
                food = Math.min(99999, food + ((weather[0] == "Thunderstorm" ? 6 : weather[0] == "Drizzle" ? 5 : 4) / 1800 * multFactor) * (this.AlignmentsText[1] / 100));
                netFood += ((weather[0] == "Thunderstorm" ? 6 : weather[0] == "Drizzle" ? 5 : 4) * (this.AlignmentsText[1] / 100));
                break;

            case 5:
                if (this.Health >= this.HealthTotal * (1 - this.AlignmentsText[0] / 200) || this.defects.love !== undefined) {
                    if (this.Gender == "Female" && this.Age >= 50 && bugs.length < rooms.length * 8) {
                        /**Mates must:
                         *be of the same species
                         *opposite gender
                         *Age 50 or older
                         *Both be in the same love field
                         **/
                        let mates = bugs.filter(
                            mateFinder =>
                            mateFinder.Species == this.Species &&
                            mateFinder.Gender == "Male" &&
                            mateFinder.Age >= 50 &&
                            mateFinder.Patrol == this.Patrol
                        );
                        for (mateSearch in mates) {
                            if (this.bugCollision(mates[mateSearch]) && (Math.floor(Math.random() * 25) == 0 || this.defects.love !== undefined)) {

                                //Mates can only fall in love if healthy enough, however they do not need to be healthy to breed
                                if (this.defects.love == undefined && mates[mateSearch].defects.love == undefined) {
                                    this.defects.love = 5;
                                    mates[mateSearch].defects.love = 5;
                                    mates[mateSearch].Scale = this.Scale * -1;
                                    this.X = mates[mateSearch].X - (this.Scale * 10);
                                    mates[mateSearch].X += (this.Scale * 10);;
                                } else if (this.defects.love > 0 && mates[mateSearch].defects.love > 0 && this.defects.love <= 3 / 30 && mates[mateSearch].defects.love <= 3 / 30) {
                                    this.defects.love = undefined;
                                    mates[mateSearch].defects.love = undefined;

                                    //babies get an average alignment of both parents
                                    bugs.push(new bugBuild(String(mates[mateSearch].Name + "et").substr(0, 20), (this.X + mates[mateSearch].X) / 2, (this.Y + mates[mateSearch].Y) / 2, bugStats[this.Species].offspring ? bugStats[this.Species].offspring : this.Species, (this.Alignments + mates[mateSearch].Alignments) / 2, false, 0));

                                    if (bugs[bugs.length - 1].Gender == "Female") {
                                        bugs[bugs.length - 1].Name = String(this.Name + "ette").substr(0, 20)
                                    }
                                    bugs[bugs.length - 1].Trait = Math.floor(Math.random() * 2) == 0 ? this.Trait : mates[mateSearch].Trait;

                                    //the new baby updates their story to account for their parents
                                    bugs[bugs.length - 1].Story = bugs[bugs.length - 1].Story.split("\nFather").join(" from a union of two bugs\nFather");
                                    bugs[bugs.length - 1].Story = bugs[bugs.length - 1].Story.split("Father: Unknown").join("Father: " + mates[mateSearch].Name);
                                    bugs[bugs.length - 1].Story = bugs[bugs.length - 1].Story.split("Mother: Unknown").join("Mother: " + this.Name);
                                    bugs[bugs.length - 1].defects.evolution = 1;
                                    save();
                                }
                            }
                        }
                    }
                } else if(this.defects.love == undefined) {
                    this.Patrol = false;
                }
                break;

            case 6:
                this.Health = Math.min(this.HealthTotal, this.Health + (2.5 / 1800 * multFactor));
                break;

            case 7:
                this.Age = Math.min(100, this.Age + (5 / 1800 * multFactor));
                break;

            case 8:
                if (bugStats[this.Species].swimAble) {
                    this.Health = Math.min(this.HealthTotal, this.Health + (5 / 1800 * multFactor));
                } else {
                    this.Patrol = false;
                }
                this.Swimming = true;
                this.SwimmingDistance = 0;

                if (this.Y >= 230) {
                    this.Jump = 6;
                } else if (Math.pow(Math.pow(Math.abs(this.Y - 264), 2) + Math.pow(Math.abs(this.X - (264 + this.Patrol.Index * 528)), 2), 0.5) > 230 || this.Y < 90) {
                    this.Jump = 5;
                    if ((this.Scale == -1 && this.X < (70 + this.Patrol.Index * 528)) || (this.Scale == 1 && this.X > (458 + this.Patrol.Index * 528))) {
                        this.Scale *= -1
                    }
                } else {
                    if (Math.floor(Math.random() * 50) == 0) {
                        this.Jump = this.Jump == 6 ? 5 : 6
                    }
                }

                if (this.Jump > 5) {
                    this.Jump = 6
                } else if (this.Jump > 0) {
                    this.Jump = 5
                }
                break;

            case 9:
                if (bugStats[this.Species].flyAble) {
                    this.Health = Math.min(this.HealthTotal, this.Health + (5 / 1800 * multFactor));
                } else {
                    this.Patrol = false;
                }

                if (this.Y >= 230) {
                    this.Jump = 6;
                } else if (Math.pow(Math.pow(Math.abs(this.Y - 264), 2) + Math.pow(Math.abs(this.X - (264 + this.Patrol.Index * 528)), 2), 0.5) > 230 || this.Y < 90) {
                    this.Jump = 5;
                    if ((this.Scale == -1 && this.X < (70 + this.Patrol.Index * 528)) || (this.Scale == 1 && this.X > (458 + this.Patrol.Index * 528))) {
                        this.Scale *= -1
                    }
                } else {
                    if (Math.floor(Math.random() * 50) == 0) {
                        this.Jump = this.Jump == 6 ? 5 : 6
                    }
                }

                if (this.Jump > 5) {
                    this.Jump = 6;
                } else if (this.Jump > 0) {
                    this.Jump = 5
                }
                break;
        }

    } else if (Math.abs(this.X - (this.Patrol.Index * 528 + 264)) > 1056) {
        this.X = this.Patrol.Index * 528 + 28 + (Math.random() * 501);
    }

    /**Extra constants: (+5 age/m, -1 food/m, -5 health/m in famines on-screen)**/
    this.Age = Math.min(100, this.Age + (5 / 1800 * multFactor));
    food = Math.max(0, food - (1 / 1800 * multFactor));
    netFood -= 1;

    if (food <= 0 && this.Trait !== 2 && multFactor <= 1) {
        this.Health = Math.max(0, this.Health - (5 / 1800 * multFactor));
    }
}

bugBuild.prototype.skill = function(victim) {
    if (this.Fury > 0.5 && bugStats[this.Species].skillName !== "Life Meal") {
        this.Attack *= 2;
    }

    let damageCalc = this.Attack * (this.AlignmentsText[2] / 100) <= 0 ? 1 : this.Attack * (this.AlignmentsText[2] / 100);
    switch (bugStats[this.Species].skillName) {

        case "Saliva Salvo":
            damageCalc = Math.max(1, damageCalc * (1 / 2));
            victim.Health -= Math.round(damageCalc);
            victim.defects.hurt = [damageCalc, 1];
            victim.defects.slowDown = Math.max(this.Trait == 6 ? 4 : 2, victim.defects.slowDown == undefined ? 0 : victim.defects.slowDown);
            break;

        case "Noxious Whimper":
            damageCalc = Math.max(1, damageCalc * (1 / 2));
            victim.Health -= Math.round(damageCalc);
            victim.defects.hurt = [damageCalc, 1];
            victim.defects.intimidate = Math.max(this.Trait == 6 ? 4 : 2, victim.defects.slowDown == undefined ? 0 : victim.defects.slowDown);
            break;

        case "Life Meal":
            if (this.Fury > 0.5) {
                this.Health = Math.min(this.HealthTotal, this.Health + Math.floor(damageCalc));
                this.defects.hurt = [-Math.round(damageCalc), 1];
            }

            victim.Health -= Math.round(damageCalc);
            victim.defects.hurt = [damageCalc, 1];
            break;

        case "Poison Sting":
            damageCalc = Math.max(1, damageCalc * (1 / 3));
            victim.Health -= Math.round(damageCalc);
            victim.defects.hurt = [damageCalc, 1];
            victim.defects.poison = Math.max(this.Trait == 6 ? 6 : 3, victim.defects.poison == undefined ? 0 : victim.defects.poison);
            break;

        case "Parasitic Sting":
            damageCalc = Math.max(1, damageCalc * (1 / 3));
            victim.Health -= Math.round(damageCalc);
            victim.defects.hurt = [damageCalc, 1];
            victim.defects.poison = Math.max(this.Trait == 6 ? 6 : 3, victim.defects.poison == undefined ? 0 : victim.defects.poison);

            if (this.defects.droneType == undefined && this.Fury > 0.5) {
                battleEnemies.push(new bugBuild(this.Species + " Drone", victim.X, victim.Y, this.Species, this.Alignments, true, 50));
                battleEnemies[battleEnemies.length - 1].defects.droneType = !this.Enemy;
                battleEnemies[battleEnemies.length - 1].defects.evolution = 1;
            }
            break;

        case "Venom Spray":
            if (!this.defects.venomSpray || this.defects.venomSpray <= 0) {
                this.defects.venomSpray = 2;
                this.Attacking = true;
            } else {
                damageCalc = Math.max(1, damageCalc * (1 / 3));
                victim.Health -= Math.round(damageCalc);
                victim.defects.hurt = [damageCalc, 1];
                victim.defects.poison = Math.max(this.Trait == 6 ? 6 : 3, victim.defects.poison == undefined ? 0 : victim.defects.poison);
                this.defects.venomSpray = 0;
            }
            break;

        case "Venomous Ambush":
            victim.Health -= Math.floor(damageCalc);
            victim.defects.hurt = [damageCalc, 1];
            victim.defects.poison = Math.max(this.Fury > 0.5 ? this.Trait == 6 ? 6 : 3 : 0, victim.defects.poison == undefined ? 0 : victim.defects.poison);
            this.defects.ambushLength = 0;
            break;

        case "Horrendous Ambush":
            victim.Health -= Math.round(damageCalc);
            victim.defects.hurt = [damageCalc, 1];
            victim.defects.slowDown = Math.max(this.Fury > 0.5 ? this.Trait == 6 ? 4 : 2 : 0, victim.defects.slowDown == undefined ? 0 : victim.defects.slowDown);
            victim.defects.intimidate = Math.max(this.Fury > 0.5 ? this.Trait == 6 ? 4 : 2 : 0, victim.defects.intimidate == undefined ? 0 : victim.defects.intimidate);
            this.defects.ambushLength = 0;
            break;

        default:
            if (this.Fury > 0.5 && bugStats[this.Species].skillName == "Mandible Press") {
                damageCalc *= 2;
                victim.Health -= Math.round(damageCalc);
                victim.defects.hurt = [damageCalc, 1];
            } else {
                victim.Health -= Math.round(damageCalc);
                victim.defects.hurt = [damageCalc, 1];
            }
    }
    soundeffect((bugStats[this.Species].skillName.split(" ").join("")) + ".mp3");

    //Fury attackers have a more dramatic sound, attack is reset for none life meal users
    if (this.Fury > 0.5) {
        this.Fury = 0;
        if (bugStats[this.Species].skillName !== "Life Meal") {
            this.Attack /= 2;
        }
        soundeffect((bugStats[this.Species].skillName.split(" ").join("")) + ".mp3");
    } else if (victim && bugStats[this.Species].skillName !== "Specialized Ambush") {
        this.Fury = Math.min(1, this.Fury + 0.5);
    }

    //Reflect damage for unranged attacks
    if (victim && bugStats[victim.Species].skillName == "Defensive Coil" && bugStats[this.Species].skillName !== "Venom Spray" && victim.Animation >= 2.9 && victim.Attacking) {
        let damageCalc = Math.round(this.Attack);
        this.Health -= damageCalc;
        this.defects.hurt = [damageCalc, 1]
        soundeffect((bugStats[victim.Species].skillName.split(" ").join("")) + ".mp3");
        if (victim.Fury > 0.5) {
            this.Health -= damageCalc;
            this.defects.hurt[0] *= 2;
            soundeffect((bugStats[victim.Species].skillName.split(" ").join("")) + ".mp3");
            victim.Fury = 0;
        } else {
            victim.Fury = Math.min(1, victim.Fury + 0.5);
        }
    }
}

bugBuild.prototype.combat = function() {
    this.Animation += bugStats[this.Species].skillName.split("Ambush").length > 1 ? this.Fury > 0.5 ? 0.375 : 0.1875 : this.Fury > 0.5 ? 0.5 : 0.25;

    //Defensive coil is used if held
    if (bugStats[this.Species].skillName == "Defensive Coil" && ((!this.Enemy && this.keyUp[32]) || (this.Enemy && this.bugCollision(battleBugs[0]))) && this.Animation >= 3) {
        this.Animation = 2.9;
    } else if (bugStats[this.Species].skillName == "Defensive Coil" && this.Animation >= 3) {
        this.Attacking = false;
        return;
    }

    //Venomous ambush holds its animation until landing
    if ((bugStats[this.Species].skillName == "Venomous Ambush" || bugStats[this.Species].skillName == "Horrendous Ambush") && !this.Hold && this.Animation >= 3) {
        this.Animation = 2.9;
    }

    //Sound waves intimidate targets
    if (this.Fury > 0.5 && bugStats[this.Species].skillName == "Stridulating Retreat") {
        this.Jump = 12;
        ctx.drawImage(miscImg[53], this.X - this.Animation * 25 - scrollx, this.Y - this.Image.height / 36 * (this.Age / 150 + 0.5) -
            this.Animation * 25, this.Animation * 50, this.Animation * 50);
        if (!this.Enemy) {
            for (enemyLoad in bugEnemiesOnScreen) {
                if (this.bugCollision(bugEnemiesOnScreen[enemyLoad], [this.X - this.Animation * 25, this.Y - this.Image.height / 36 * (this.Age / 150 + 0.5) - this.Animation * 25, this.Animation * 50, this.Animation * 50]) && !bugEnemiesOnScreen[enemyLoad].defects.droneType && bugEnemiesOnScreen[enemyLoad].Health > 0) {
                    bugEnemiesOnScreen[enemyLoad].defects.intimidate = this.Trait == 6 ? 4 : 2;
                }
            }
        } else {
            if (this.bugCollision(battleBugs[0], [this.X - this.Animation * 25, this.Y - this.Image.height / 36 * (this.Age / 150 + 0.5) - this.Animation * 25, this.Animation * 50, this.Animation * 50]) && battleBugs[0].Health > 0) {
                battleBugs[0].defects.intimidate = this.Trait == 6 ? 4 : 2;
            }
        }
    }

    //Decreases falling time
    if (this.defects.ambushLength > 0 && this.Jump > this.defects.ambushLength - 5 && this.Jump <= 5) {
        this.Jump = this.defects.ambushLength - 5;
    }

    //Ambush users
    if (this.Animation < 3 && bugStats[this.Species].skillName.split("Ambush").length > 1) {
        //Venomous Ambush users can hold their jumps
        if ((bugStats[this.Species].skillName == "Venomous Ambush" || bugStats[this.Species].skillName == "Horrendous Ambush") && this.Hold && this.Animation <= 0.5) {
            this.Fury = Math.max(0, this.Fury - 0.2);
            this.defects.ambushLength = 7 + (this.Fury * 5);
            this.Jump = this.defects.ambushLength;
            soundeffect((bugStats[this.Species].skillName.split(" ").join("")) + ".mp3");
        }
        if (this.Swimming) {
            this.bubbleCreate(bugStats[this.Species].swimAble ? 15 : 10);
        }
        if (this.Albino && this.X - scrollx > -10 && this.X < 540 + scrollx) {
            this.bubbleCreate(3, 1);
        }

        if (battleMode && !this.Enemy && ((this.X - scrollx >= 430 && this.Scale == 1) || (this.X - scrollx <= 100 && this.Scale == -1))) {
            scrollx += this.Speed * (this.Animation / 2) * this.Scale * (this.Fury > 0.5 && !this.defects.ambushLength ? 2 : 1);
            this.X += this.Speed * (this.Animation / 2) * this.Scale * (this.Fury > 0.5 && !this.defects.ambushLength ? 2 : 1);
        } else {
            this.X += this.Speed * (this.Animation / 2) * this.Scale * (this.Fury > 0.5 && !this.defects.ambushLength ? 2 : 1);
        }
        if (scrollx < 0) {
            scrollx = 0
        } else if (scrollx > 25 + (battleMap[0].length - 11) * 50) {
            scrollx = 25 + (battleMap[0].length - 11) * 50
        }
    }

    if (this.Animation >= 3) {
        this.AnimationReverse = true;
        this.Animation = 2.9;
        this.Attacking = false;

        if (bugStats[this.Species].skillName == "Venom Spray" && (!this.defects.venomSpray || this.defects.venomSpray <= 0)) {
            this.skill(false);
            return;
        } else if (!this.Enemy || this.defects.droneType) {

            for (enemyLoad in bugEnemiesOnScreen) {
                if ((this.bugCollision(bugEnemiesOnScreen[enemyLoad])) && this !== bugEnemiesOnScreen[enemyLoad] && !bugEnemiesOnScreen[enemyLoad].defects.droneType && bugEnemiesOnScreen[enemyLoad].Health > 0) {
                    this.skill(bugEnemiesOnScreen[enemyLoad]);
                    return;
                }
            }

        } else if (this.bugCollision(battleBugs[0]) && battleBugs[0].Health > 0) {
            this.skill(battleBugs[0]);
        }

    } else if (this.AnimationReverse) {
        this.AnimationReverse = false;
    }
}

bugBuild.prototype.keyDown = function(event) {

    if (boxSelector == "" && (event.keyCode == 39 || event.keyCode == 68 || event.keyCode == 37 || event.keyCode == 65 || event.keyCode == 38 || event.keyCode == 87 || event.keyCode == 32 || event.keyCode == 40 || event.keyCode == 83)) {
        this.keyUp[event.keyCode] = true;
    }

    if (boxSelector == "" && (event.keyCode == 39 || event.keyCode == 68) && !this.Attacking && !this.defects.speedMax) {
        this.Scale = 1;
    }
    if (boxSelector == "" && (event.keyCode == 37 || event.keyCode == 65) && !this.Attacking && !this.defects.speedMax) {
        this.Scale = -1;
    }

    //Code for switching bugs
    if (boxSelector == "" && battleBugs.length > 1 && event.keyCode >= 49 && event.keyCode < 53 && event.keyCode - 48 < battleBugs.length && !this.Attacking && this.Health > 0) {
        this.Jump = 0;
        battleBugs[event.keyCode - 48].keyUp = this.keyUp;
        this.keyUp = {};
        battleBugs[event.keyCode - 48].X = this.X;
        battleBugs[event.keyCode - 48].Scale = this.Scale;
        battleBugs[event.keyCode - 48].Y = this.Y;
        battleBugs.splice(event.keyCode - 48, 0, battleBugs[0]);
        if (bugSelected == this) {
            bugSelected = battleBugs[event.keyCode - 47];
        }
        battleBugs[0] = battleBugs[event.keyCode - 47];
        battleBugs.splice(event.keyCode - 47, 1);
    }
}

bugBuild.prototype.stats = function() {
    ctx.globalAlpha = 1;

    if (boxSelector == "") {
        ctx.beginPath();
        ctx.strokeStyle = "#ffff66";
        ctx.lineWidth = 4;
        ctx.arc(this.X - this.Image.width / 576 * (this.Age / 150 + 0.5) - scrollx, this.Y - this.Image.height / 36 * (this.Age / 150 + 0.5) - this.Image.height / 144 * (this.Age / 150 + 0.5), this.Image.width / 84 * (this.Age / 150 + 0.5) + (date.getMilliseconds() / 25), 0, 2 * Math.PI);
        ctx.stroke();
        ctx.closePath();
    }

    if (!collision(mousex, mousey, 0, 0, this.X - this.Image.width / 144 * (this.Age / 150 + 0.5) - scrollx, this.Y - this.Image.height / 36 * (this.Age / 150 + 0.5) - this.Image.height / 72 * (this.Age / 150 + 0.5), this.Image.width / 72 * (this.Age / 150 + 0.5), this.Image.height / 36 * (this.Age / 150 + 0.5)) && mousedown && textInfo.length == 1) {
        bugSelected = -1;
        mousedown = false;
        return;
    }

    //Image cropper
    ctx.drawImage(miscImg[0], 0, 0, 530, 75);
    bugBubble(0, 0, 1, false, bugStats[this.Species]);
    textmaker("" + this.Name, 80, 30, 20 - this.Name.length * 0.25);
    textmaker("" + Math.ceil(this.Health) + "/" + this.HealthTotal, 90, 62.5, 15);
    textmaker("" + Math.floor(this.Attack * 8), 165, 62.5, 15);
    textmaker("" + Math.floor(this.Speed * 12.5), 240, 62.5, 15);
    textmaker("" + Math.min(Math.floor(this.Age), 100), 315, 62.5, 15);
    textmaker("Psv " + Math.floor(this.AlignmentsText[0]) + "%", 425, 19, 15, true);
    textmaker("Int " + Math.ceil(this.AlignmentsText[1]) + "%", 425, 41, 15, true);
    textmaker("Agr " + Math.floor(this.AlignmentsText[2]) + "%", 425, 63, 15, true);

    //Symbols go here  
    ctx.drawImage(miscImg[this.Gender == "Male" ? 11 : 12], 77 / 2 - 33.5, 77 / 2 - 33.5, 25, 25);

    ctx.drawImage(this.Immortal ? miscImg[42] : miscImg[2], 69, 49, 20, 20);
    ctx.drawImage(miscImg[3], 143, 49, 20, 20);
    ctx.drawImage(miscImg[4], 217.5, 49, 20, 20);
    ctx.drawImage(miscImg[5], 292.5, 49, 20, 20);

    textmaker(bugStats[this.Species].rarity, 500, 12, 13.5, true, bugStats[this.Species].rarity == "Common" ? "#b3ffb3" : bugStats[this.Species].rarity == "Rare" ? "#80b3ff" : bugStats[this.Species].rarity == "Epic" ? "#ecb3ff" : "#ffff66");

    ctx.save();
    ctx.drawImage(miscImg[bugStats[this.Species].skillBubble], 470, 15, 30, 30);
    this.Albino ? ctx.filter = "brightness(100%)" : ctx.filter = "brightness(60%)"
    ctx.drawImage(miscImg[10], 500, 15, 30, 30);
    bugStats[this.Species].swimAble ? ctx.filter = "brightness(100%)" : ctx.filter = "brightness(60%)"
    ctx.drawImage(miscImg[7], 470, 45, 30, 30);
    bugStats[this.Species].flyAble ? ctx.filter = "brightness(100%)" : ctx.filter = "brightness(60%)"
    ctx.drawImage(miscImg[8], 500, 45, 30, 30);
    ctx.restore();
}

//bubble particles
bugBuild.prototype.bubbleCreate = function(bubbleNum, bubbleType = 0) {
    for (let bubbleCreate = 0; bubbleCreate < bubbleNum; bubbleCreate++) {
        ctx.beginPath();
        ctx.globalAlpha = 1;
        ctx.fillStyle = bubbleType == 1 ? "hsl(" + Math.random() * 300 + ",100%,50%)" : "#ccf5ff";
        ctx.arc(this.X - ((this.Image.width / 144 * (this.Age / 150 + 0.5) + Math.random() * 20) * this.Scale) - scrollx, this.Y - this.Image.height / 72 - ((this.Age / 150 + 0.5) * this.Image.height / 36) * Math.random(), Math.random() * 2, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();
    }
}

bugBuild.prototype.draw = function() {

    if (this.Age >= 150 && music.src.split("/")[music.src.split("/").length - 1] !== "QueenTheme.mp3") {

        if (missions[battleInfo[0]].queenFlavor !== undefined) {
            for (let textCreate = 0; textCreate < missions[battleInfo[0]].queenFlavor.length; textCreate++) {
                let flavorCreate = missions[battleInfo[0]].queenFlavor[textCreate];
                flavorCreate[3] = 0;
                textInfo.push(flavorCreate);
            }
        } else {
            textInfo.push([this.Name, this.Species, "--. --- --- -.. -. . ... ... -.-.-- / .... --- .-- / -.-- --- ..- .----. ...- . / --. .-. ---\n .-- -. -.-.-- / .-.. --- ...- . --..-- / .. .----. -- / ... --- .-. .-. -.-- .-.-.-", 0]);
        }

        music.pause();
        music = new Audio("muzak/QueenTheme.mp3");
        music.loop = true;
        music.volume = musicvolume;
    }

    if (!this.Enemy && !battleMode) {
        this.constants((date - this.DateRecord) / (1000 / 30));
        this.DateRecord = date;
        save("Bugs", JSON.stringify(bugs));
    }

    ctx.globalAlpha = 1;
    if (battleMode && bugStats[this.Species].skillName == "Specialized Ambush") {
        ctx.globalAlpha = 1 - this.Fury
    }

    //Immortal bugs always remain with one health
    if (boxSelector == "" && !battleMode && this.Immortal && this.Health <= 1) {
        this.Health = 1;
        this.Rotate = 0;
    }

    if (boxSelector == "" && this.Health <= 0 && this.Rotate > -180 && textInfo.length == 1 && (battleMode || !this.Immortal)) {
        this.Health = 0;
        this.Rotate -= 10;
        this.Jump = 0;
        ctx.globalAlpha = 1 - ((1 / 180) * (this.Rotate * -1))
    } else if (boxSelector == "" && this.Rotate == -180 && textInfo.length == 1) {
        if (bugSelected == this) {
            bugSelected = -1;
        }

        if (!this.Enemy) {
            if (battleBugs.length > 0 && battleMode) {

                if (this.Y > 300) {
                    this.Y = 200
                }

                if (battleBugs.length > 1) {
                    battleBugs[1].Jump = 0;
                    battleBugs[1].keyUp = this.keyUp;
                    battleBugs[1].X = this.X;
                    battleBugs[1].Scale = this.Scale;
                    battleBugs[1].Y = this.Y;
                }

                if (!this.Immortal) {
                    bugs.splice(bugs.indexOf(this), 1);
                }
                battleBugs.splice(0, 1);
            } else {
                bugs.splice(bugs.indexOf(this), 1);
                this.Patrol = false;
            }
        } else {
            if (this.Age > 100 && boxSelector == "") {
                music.pause();
                soundeffect("MissionComplete.mp3");
                boxSelector = "End Game";
                boxAnimation = -300;
            } else if (this.defects.droneType == undefined && battleBugs.length > 0) {
                battleInfo[1][1][0] += battleBugs[0].Trait == 3 ? 20 : 10;
                soundeffect("Territ.mp3");
            }

            enemyDraw -= 1;
            battleEnemies.splice(battleEnemies.indexOf(this), 1);
            bugEnemiesOnScreen.splice(bugEnemiesOnScreen.indexOf(this), 1);
        }
        soundeffect("Death.mp3");
        return;
    } else if (boxSelector == "") {
        this.Rotate = 0;
    }

    //bugs are not drawn if not onscreen
    if (this.X - scrollx > -10 && this.X < 540 + scrollx) {
        ctx.save();
        
        //Death animation offset  
        ctx.translate(this.X - scrollx, this.Y - this.Image.height / 36 * (this.Age / 150 + 0.5) - (this.Health <= 0 ? (this.Rotate / 10) * (this.Age / 300) : 0));
        ctx.scale(this.Scale, 1);
        ctx.rotate(this.Rotate * (Math.PI / 180));

        if ((this.Alignments > 0 && this.Alignments < 360) || this.Albino || this.defects.evolution) {
            ctx.filter = "hue-rotate(" + (this.Albino ? Math.abs(180 - this.Alignments) : this.Alignments) + "deg) brightness(" + ((this.Albino ? 200 : 100) * (this.defects.evolution ? this.defects.evolution + 1 : 1)) + "%)";
        }

        ctx.drawImage(this.Image, Math.floor(this.Animation + (this.Attacking ? 3 : 0)) * (this.Image.width / 6), (bugStats[this.Species].swimAble && this.Swimming ? 2 : bugStats[this.Species].flyAble && this.Jump > 0 && !this.Swimming ? 1 : 0) * (this.Image.height / 3), this.Image.width / 6, this.Image.height / 3, -this.Image.width / 144 * (this.Age / 150 + 0.5), -this.Image.height / 72, this.Image.width / 72 * (this.Age / 150 + 0.5), this.Image.height / 36 * (this.Age / 150 + 0.5));
        ctx.restore();
    }

    if (textInfo.length > 1 || boxSelector == "End Game") {
        return
    }

    /** Battle effects **/
    this.Speed = bugStats[this.Species].baseSpeed;

    //Shadow Hightail/Drone targeting only works on enemies
    if (battleMode && (bugStats[this.Species].skillName == "Shadow Hightail" || this.defects.droneType !== undefined) && ((bugSelected !== -1 && bugSelected !== this && bugSelected.Enemy) || (this.Enemy && this.defects.droneType !== true))) {
        this.defects.speedMax = true;
        this.Speed = 8;
        if (this.defects.droneType == undefined) {
            this.Fury = Math.max(0.5, this.Fury)
        }
    } else {
        this.defects.speedMax = false;
    }

    // Health degradation for drones
    if (boxSelector == "" && this.defects.droneType !== undefined) {
        this.Health = Math.max(0, this.Health - this.HealthTotal * 1 / 60)
    }

    if (boxSelector == "" && battleMode && this.defects.slowDown > 0) {
        this.defects.slowDown -= 1 / 30;
        this.Speed = bugStats[this.Species].baseSpeed / (this.defects.slowDown + 1);
    }

    if (boxSelector == "" && battleMode && this.defects.intimidate > 0) {
        this.defects.intimidate -= 1 / 30;
        this.Attack = bugStats[this.Species].baseAttack / (this.defects.intimidate + 1);
    } else {
        this.Attack = bugStats[this.Species].baseAttack;
    }

    if (boxSelector == "" && battleMode && this.defects.poison > 0) {
        this.defects.poison -= 1 / 30;
        if (this.defects.poison % 1 < 1 / 30 && this.defects.poison > 0) {
            this.defects.hurt = [2, 1];
            this.Health -= 2;
        }
    }

    if (this.Swimming && !bugStats[this.Species].swimAble) {
        this.Speed /= 2
    }

    if (boxSelector == "" && this.Health > 0 && (this.Health < this.HealthTotal || this.Fury > 0 || this.defects.poison > 0 || this.defects.slowDown > 0 || this.defects.intimidate > 0)) {

        if (this.Fury > 1) {
            this.Fury = 1
        }
        if (this.Fury > 0) {
            this.Fury = Math.max(0, this.Fury - 1 / 120)
        }

        /** Battle effects **/
        ctx.globalAlpha = battleMode && bugStats[this.Species].skillName == "Specialized Ambush" ? 1 - this.Fury : 1
        ctx.strokeStyle = "#3f383a";
        ctx.fillStyle = "#ce4c71";
        ctx.lineWidth = 0.5 * this.Image.height / 45 * (this.Age / 150 + 0.5) / 4;
        ctx.strokeRect(this.X - scrollx - this.Image.width / 72 * (this.Age / 150 + 0.5) / 3, this.Y - this.Image.height / 19.5 * (this.Age / 150 + 0.5), (this.Image.width / 72 * (this.Age / 150 + 0.5) / 1.5), this.Image.height / 45 * (this.Age / 150 + 0.5) / 4);
        ctx.fillRect(this.X - scrollx - this.Image.width / 72 * (this.Age / 150 + 0.5) / 3, this.Y - this.Image.height / 19.5 * (this.Age / 150 + 0.5), (this.Image.width / 72 * (this.Age / 150 + 0.5) / 1.5), this.Image.height / 45 * (this.Age / 150 + 0.5) / 4);
        ctx.fillStyle =
            this.defects.poison > 0 ? "#cc66cc" :
            this.defects.slowDown > 0 ? "#0099ff" :
            this.defects.intimidate > 0 ? "#fcba03" : "#53db65";
        ctx.fillRect(this.X - scrollx - this.Image.width / 72 * (this.Age / 150 + 0.5) / 3, this.Y - this.Image.height / 19.5 * (this.Age / 150 + 0.5), (this.Image.width / 72 * (this.Age / 150 + 0.5) / 1.5) / this.HealthTotal * this.Health, this.Image.height / 45 * (this.Age / 150 + 0.5) / 4);

        //Only during battle mode will healthbars show furybars
        if (battleMode) {

            //Max fury <= 25% total health (Irritable)
            if (this.Health <= this.HealthTotal * 0.25 && this.Trait == 1) {
                this.Fury = 1;
            }

            //Queen Fury
            if (this.Health <= this.HealthTotal * 0.5 && this.Age > 100 && this.Alignments !== 225) {
                this.defects.evolution = 1;
                this.Alignments += 22.5;
                battleMap[4][battleMap[4].length - 5] = 6;
                this.AlignmentsText = [(100 / 90) * (90 - Math.abs(90 - this.Alignments)) > 0 ? (100 / 90) * (90 - Math.abs(90 - this.Alignments)) : 0,
                    (100 / 90) * (90 - Math.abs(180 - this.Alignments)) > 0 ? (100 / 90) * (90 - Math.abs(180 - this.Alignments)) : 0,
                    (100 / 90) * (90 - Math.abs(270 - this.Alignments)) > 0 ? (100 / 90) * (90 - Math.abs(270 - this.Alignments)) : 0
                ];
            }

            ctx.beginPath();
            ctx.strokeStyle = "#3f383a";
            ctx.fillStyle = "#aba0a3";
            ctx.lineWidth = 0.75 * this.Image.height / 45 * (this.Age / 150 + 0.5) / 4;
            ctx.arc(this.X - scrollx - this.Image.width / 72 * (this.Age / 150 + 0.5) / 3, this.Y - this.Image.height / 19.5 * (this.Age / 150 + 0.5) * 0.95, this.Image.height / 180 * (this.Age / 150 + 0.5) / 1, 0, 2 * Math.PI);
            ctx.stroke();
            ctx.fill();
            ctx.closePath();
            ctx.beginPath();
            ctx.fillStyle = this.Fury >= 0.5 ? "#ff8566" : "#ffff80";
            ctx.arc(this.X - scrollx - this.Image.width / 72 * (this.Age / 150 + 0.5) / 3, this.Y - this.Image.height / 19.5 * (this.Age / 150 + 0.5) * 0.95, this.Image.height / 180 * (this.Age / 150 + 0.5) / 1 * this.Fury, 0, 2 * Math.PI);
            ctx.fill();
            ctx.closePath();
        }
    }

    /** Aesthetic defects **/
    if (!battleMode && this.defects.love > 0) {
        this.defects.love = Math.max(0, this.defects.love - 3 / 30);
        this.Health -= this.Trait == 4 ? this.HealthTotal * 0.0049 : this.HealthTotal * 0.0098;
        ctx.drawImage(miscImg[2], this.X - scrollx - 7.5, this.Y - this.Image.height / 18 * (this.Age / 150 + 0.5) - this.Image.height / 45 * (this.Age / 150 + 0.5) / 4 - (15 - (this.defects.love % 1 * 15)), 15, 15);
    }

    if (boxSelector == "" && this.defects.hurt !== undefined && this.defects.hurt[1] > 0) {
        this.defects.hurt[1] = Math.max(0, this.defects.hurt[1] - 2 / 30);
        textmaker("" + Math.abs(Math.round(this.defects.hurt[0])), this.X - scrollx, this.Y - ((this.Image.height / 18 * (this.Age / 150 + 0.5)) * (1.25 - this.defects.hurt[1])), 15, true, (this.defects.hurt[0] < 0 ? "rgb(0,255,127," : "rgb(220,20,60,") + this.defects.hurt[1] + ")");
    }

    //Evolution/Hatching animation bubble
    if (boxSelector == "" && this.defects.evolution > 0) {
        if (this.defects.evolution == 1) {
            soundeffect("Hatch.mp3");
        }
        this.defects.evolution = Math.max(0, this.defects.evolution - 2 / 30);
        ctx.beginPath();
        ctx.strokeStyle = "#343a3a";
        ctx.fillStyle = "rgb(255,255,255,0.75)";
        ctx.lineWidth = 2;
        ctx.arc(this.X - scrollx, this.Y - this.Image.height / 36 * (this.Age / 150 + 0.5), (this.Image.width / 108 * (this.Age / 150 + 0.5)) * this.defects.evolution, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.fill();
        ctx.closePath();
    }

    if (battleBugs.length == 0 && this.Enemy) {
        this.defects = {}
    };
    //Venom Spray animation

    if (boxSelector == "" && this.defects.venomSpray > 0) {
        this.defects.venomSpray = Math.max(0, this.defects.venomSpray - (this.Fury > 0.5 ? 24 / 30 : 12 / 30));
        ctx.strokeStyle = "rgb(255,255,255,0.5)";
        ctx.fillStyle = "rgb(137,229,227,0.5)";
        ctx.lineWidth = this.Image.height / 600 * (this.Age / 150 + 0.5);
        let combatIncreaser = this.X;
        ctx.strokeRect(this.X + (5 * (this.Age / 150 + 0.5) * this.Scale) - scrollx, this.Y - this.Image.height / 72 - 13.25 * (this.Age / 150 + 0.5), Math.abs(2 - this.defects.venomSpray) * 50 * this.Scale, this.Image.height / 600 * (this.Age / 150 + 0.5));
        ctx.fillRect(this.X + (5 * (this.Age / 150 + 0.5) * this.Scale) - scrollx, this.Y - this.Image.height / 72 - 13.25 * (this.Age / 150 + 0.5), Math.abs(2 - this.defects.venomSpray) * 50 * this.Scale, this.Image.height / 600 * (this.Age / 150 + 0.5));
        if (this.defects.venomSpray > 0) {
            this.Animation = 2.9;
            this.Attacking = true;
            this.X += (Math.abs(2 - this.defects.venomSpray) * 50 * this.Scale) - this.Image.width / 144 * (this.Age / 150 + 0.5);
            this.combat()
        }
        this.Attacking = this.defects.venomSpray > 0;
        this.Animation = this.defects.venomSpray > 0 ? 2 : 0;
        this.X = combatIncreaser;
    }
    /** Aesthetic Defects **/

    //Horizontal boundary constraints - levels can be cleared by reaching horizontal boundaries, only possible in exploration missions
    if ((battleMode && battleInfo[1][0][3] > 0 && this.X > (battleMap[0].length) * 50) || (!battleMode && !this.Patrol && this.X > rooms.length * 530 - 15) || (!battleMode && this.Patrol && this.X > 485 + this.Patrol.Index * 530)) {
        if (!this.Enemy && battleMode) {
            music.pause();
            soundeffect("MissionComplete.mp3");
            boxSelector = "End Game";
            boxAnimation = -300;
        } else {
            this.Scale = -1;
        }
    } else if (((battleMode || !this.Patrol) && this.X < 15) || (!battleMode && this.Patrol && this.X < this.Patrol.Index * 530 + 45)) {
        this.Scale = 1;
    }

    if (this.Swimming) {
        ctx.fillStyle = "#4da6ff"
        ctx.globalAlpha = 0.3;
        ctx.fillRect(this.X - this.Image.width / 144 * (this.Age / 150 + 0.5) - 5 - scrollx, this.Y - this.Image.height / 36 * (this.Age / 150 + 0.5) - (32 - this.SwimmingDistance / 2), this.Image.width / 72 * (this.Age / 150 + 0.5) + 10, this.SwimmingDistance / 2.25 * (this.Age / 150 + 0.5));
        ctx.fillRect(this.X - this.Image.width / 144 * (this.Age / 150 + 0.5) - 10 - scrollx, this.Y - this.Image.height / 36 * (this.Age / 150 + 0.5) - (26 - this.SwimmingDistance / 2), this.Image.width / 72 * (this.Age / 150 + 0.5) + 20, this.SwimmingDistance / 2.25 * (this.Age / 150 + 0.5));
    }


    if (boxSelector == "" && collision(mousex, mousey, 0, 0, this.X - this.Image.width / 144 * (this.Age / 150 + 0.5) - scrollx, this.Y - this.Image.height / 36 * (this.Age / 150 + 0.5) - this.Image.height / 72 * (this.Age / 150 + 0.5), this.Image.width / 72 * (this.Age / 150 + 0.5), this.Image.height / 36 * (this.Age / 150 + 0.5)) && mousedown) {

        if (battleMode && bugStats[this.Species].skillName == "Shadow Hightail" && bugSelected !== -1 && bugSelected !== this && !this.Enemy) {
            bugSelected = -1;
        } else {
            bugSelected = this;
        }

        //Movement in battles can be achieved through arrow keys, shadow hightail or not ambushing as an enemy 
    } else if ((!battleMode || this.keyUp[39] || this.keyUp[68] || this.keyUp[37] || this.keyUp[65] || (this.Enemy && !(battleBugs.length > 0 && bugStats[this.Species].skillName == "Specialized Ambush" && this.Jump == 0 && Math.abs(this.X - battleBugs[0].X) > 120)) || (!this.Enemy && bugStats[this.Species].skillName == "Shadow Hightail" && this.defects.speedMax)) && this.Health > 0 && !this.Attacking && !this.defects.love > 0 && boxSelector == "") {

        if (battleMode && !this.Enemy && ((this.X - scrollx >= 430 && this.Scale == 1) || (this.X - scrollx <= 100 && this.Scale == -1))) {
            scrollx += this.Speed * this.Scale;
            this.X += this.Speed * this.Scale;
        } else {
            this.X += this.Speed * this.Scale;
        }

        if (boxSelector == "" && this.Health > 0 && (this.keyUp[39] || this.keyUp[68]) && !(this.keyUp[37] || this.keyUp[65])) {
            this.Scale = 1
        } else if (boxSelector == "" && this.Health > 0 && !(this.keyUp[39] || this.keyUp[68]) && (this.keyUp[37] || this.keyUp[65])) {
            this.Scale = -1
        }

        if (scrollx < 0) {
            scrollx = 0
        } else if (battleMode && scrollx > 25 + (battleMap[0].length - 11) * 50) {
            scrollx = 25 + (battleMap[0].length - 11) * 50
        }

        if (this.Swimming && this.X - scrollx > -10 && this.X < 540 + scrollx) {
            this.bubbleCreate(bugStats[this.Species].swimAble ? 10 : 5);
        }
        if (this.Albino && this.X - scrollx > -10 && this.X < 540 + scrollx) {
            this.bubbleCreate(3, 1);
        }

        if (this.Jump == 0) {
            this.AnimationReverse ? this.Animation -= this.Speed / 12.5 + 0.5 : this.Animation += this.Speed / 12.5 + 0.5;

            if (this.Animation >= 3) {
                this.AnimationReverse = true;
                this.Animation = 2.9;
            } else if (this.Animation <= 0) {
                this.AnimationReverse = false;
                this.Animation = 0.1;
            }

        }

    } else {
        //6 health per second by standing still (Neutrality)
        if (boxSelector == "" && !this.Enemy && this.Health > 0 && this.Hold && !this.Attacking && this.Trait == 0) {
            this.Health = Math.min(this.HealthTotal, this.Health + 0.2)
            if (this.Health % 1 <= 1 / 30 && this.Health < this.HealthTotal) {
                this.defects.hurt = [-1, 1];
            }
        }

        //Removes status effects (Stalwart)
        if (boxSelector == "" && this.Health > 0 && this.Attacking && this.Trait == 5) {
            this.defects.slowDown = 0;
            this.defects.intimidate = 0;
            this.defects.poison = 0;
        }

        if (boxSelector == "" && bugStats[this.Species].skillName == "Specialized Ambush" && this.Health > 0 && this.Hold && !this.Attacking) {
            this.Fury = Math.min(1, this.Fury + 1 / 30);
        }
    }

    //constraints
    if (this.Y < 40 && boxSelector == "") {
        this.Y = 40;
        this.Jump = 5;
    }
    if (this.Y > 310 && boxSelector == "") {
        this.Enemy && bugStats[this.Species].flyAble ? this.Jump = 10 : this.Health = 0;
    }

    //Flying controllers
    if (this.Health > 0 && (this.keyUp[38] || this.keyUp[87]) && ((this.Jump == 0 && this.Hold == true) || bugStats[this.Species].flyAble) && !this.Attacking && boxSelector == "") {
        if (bugStats[this.Species].flyAble && this.Jump == 0 && this.Hold == true) {
            soundeffect("FlyStart.mp3");
        }
        this.Jump = 10
    }
    if ((this.keyUp[40] || this.keyUp[83]) && this.Jump == 10 && bugStats[this.Species].flyAble && !this.Attacking && boxSelector == "") {
        this.Jump = 5
    }

    //Jumping can work while attacking if flying or using an ambush attack
    if (boxSelector == "" && this.Jump > 5 && (!this.Attacking || bugStats[this.Species].skillName.split("Ambush").length > 1)) {
        this.Y -= bugStats[this.Species].flyAble ? this.Speed : this.Swimming ? 4 : 12;
        this.Jump = Math.max(0, this.Jump - (bugStats[this.Species].flyAble ? 0 : this.Swimming ? 0.25 : 0.75));
        this.Hold = false;
    } else if (boxSelector == "" && this.Jump > 0 && (!this.Attacking || bugStats[this.Species].skillName.split("Ambush").length > 1)) {
        this.Y += bugStats[this.Species].flyAble ? this.Speed : this.Swimming ? 4 : 12;
        this.Jump = Math.max(0, this.Jump - (bugStats[this.Species].flyAble ? 0 : this.Swimming ? 0.25 : 0.75));
        this.Hold = false;
    } else if (boxSelector == "" && !this.Hold && !(bugStats[this.Species].flyAble && this.Attacking && this.Jump > 0)) {
        this.Y += 12;
    } else if (boxSelector == "" && !bugStats[this.Species].flyAble) {
        this.Jump = 0;
    }

    //animation is still in affect while flying standing still
    if (boxSelector == "" && bugStats[this.Species].flyAble && this.Jump > 0 && !this.Attacking) {
        this.AnimationReverse ? this.Animation -= this.Speed / 12.5 + 0.5 : this.Animation += this.Speed / 12.5 + 0.5;

        if (this.Animation >= 3) {
            this.AnimationReverse = true;
            this.Animation = 2.9;
        } else if (this.Animation <= 0) {
            this.AnimationReverse = false;
            this.Animation = 0.1;
        }

    }

    //Shadow Hightail acts as an enemy AI
    if (boxSelector == "" && this.Health > 0 && this.Enemy && !(this.defects.droneType && this.defects.speedMax) && battleBugs.length > 0 && Math.abs(battleBugs[0].X - this.X) > 35 && !this.Attacking && !(battleBugs.length > 0 && bugStats[battleBugs[0].Species].skillName == "Specialized Ambush" && battleBugs[0].Fury >= 0.98)) {
        battleBugs[0].X > this.X ? this.Scale = 1 : this.Scale = -1;
    } else if (boxSelector == "" && this.Health > 0 && battleMode && ((!this.Enemy && bugStats[this.Species].skillName == "Shadow Hightail") || (this.Enemy && this.defects.droneType)) && this.defects.speedMax) {
        bugSelected.X > this.X ? this.Scale = 1 : this.Scale = -1;
    }

    //Non enemies can jump with up arrow keys or shadow hightail/player drone, they can attack if they have range with Venom Spray or Ambush
    if (boxSelector == "" && !this.Attacking && this.Health > 0 && (this.Jump == 0 || bugStats[this.Species].flyAble) && ((battleBugs.length > 0 && this.Enemy && !this.defects.droneType && this.bugCollision(battleBugs[0])) || (!this.Enemy && (this.keyUp[32] || (bugStats[this.Species].skillName == "Shadow Hightail" && this.defects.speedMax && this.bugCollision(bugSelected)))) || (this.Enemy && this.defects.droneType && this.defects.speedMax && this.bugCollision(bugSelected)) || (this.Enemy && battleBugs.length > 0 && bugStats[this.Species].skillName == "Venom Spray" && Math.abs(this.X - battleBugs[0].X) <= 110 && this.Y == battleBugs[0].Y) || (this.Enemy && battleBugs.length > 0 && (bugStats[this.Species].skillName == "Venomous Ambush" || bugStats[this.Species].skillName == "Horrendous Ambush") && this.Fury < 1 && Math.abs(this.X - battleBugs[0].X) <= 110))) {
        this.Attacking = true;
        this.Animation = 0;
    } else if (boxSelector == "" && this.Attacking && battleBugs.length > 0 && this.Health > 0) {
        if (this.Hold && (bugStats[this.Species].skillName == "Venomous Ambush" || bugStats[this.Species].skillName == "Horrendous Ambush") && (this.keyUp[32] || (this.Enemy && this.Fury < 0.98 && Math.abs(this.X - battleBugs[0].X) >= this.Fury * 110)) && this.Animation <= 0.375) {
            this.Fury += 1.25 / 30;
        } else {
            this.combat();
        }
    } else {
        this.Attacking = false;
    }

    if (this.Y > 278 && !battleMode) {
        this.Y = 278;
    }
    this.Hold = false;
    this.Swimming = false;
}