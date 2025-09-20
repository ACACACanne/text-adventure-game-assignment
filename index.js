

function startGame() {
  game.startGame();
  document.getElementById("bgMusic").play();
}

function playSFX(src) {
  const sfx = document.getElementById("sfx");
  sfx.src = src;
  sfx.muted = document.getElementById("bgMusic").muted;
  sfx.play();
}

function changeMusic(src) {
  const bg = document.getElementById("bgMusic");
  bg.src = src;
  bg.muted = false;
  bg.play();
}

function toggleMusic() {
  const bg = document.getElementById("bgMusic");
  const sfx = document.getElementById("sfx");
  const button = document.getElementById("muteBtn");
  const isMuted = !bg.muted;
  bg.muted = isMuted;
  sfx.muted = isMuted;
  button.textContent = isMuted ? "🔈 Unmute" : "🔊 Mute";
}

function resetGame() {
  clearInterval(game.timerInterval);
  game = new Game();
  game.startGame();
}

function exitGame() {
  clearInterval(game.timerInterval);
  document.getElementById("game").classList.add("hidden");
  document.getElementById("intro").classList.remove("hidden");
  document.getElementById("command").value = "";
  document.getElementById("command").disabled = false;
  document.getElementById("time").textContent = "300";
}

class Character {
  constructor(name, role, dialogue = []) {
    this.name = name;
    this.role = role;
    this.dialogue = dialogue;
  }
  speak() {
    return `${this.name} says: "${this.dialogue[Math.floor(Math.random() * this.dialogue.length)]}"`;
  }
}

class Items {
  constructor(name, description, hint) {
    this.name = name;
    this.description = description;
    this.hint = hint;
  }
}

class Weapon {
  constructor(name, power) {
    this.name = name;
    this.power = power;
  }
}

class Room {
  constructor(name, description, character = null, exits = {}, item = null, weapon = null, hiddenItemLocation = "") {
    this.name = name;
    this.description = description;
    this.character = character;
    this.exits = exits;
    this.item = item;
    this.weapon = weapon;
    this.hiddenItemLocation = hiddenItemLocation;
    this.itemRevealed = false;
  }
}

class Player {
  constructor() {
    this.items = [];
    this.weapons = [];
    this.keysCollected = 0;
    this.panic = 0;
    this.stealth = 0;
  }
  addItem(item) {
    this.items.push(item);
    if (item.name.includes("Key")) this.keysCollected++;
  }
  addWeapon(weapon) {
    this.weapons.push(weapon);
  }
  getItemsText() {
    return this.items.length ? this.items.map(i => i.name).join(", ") : "None";
  }
  getWeaponsText() {
    return this.weapons.length ? this.weapons.map(w => w.name).join(", ") : "None";
  }
}

class Game {
  constructor() {
    this.player = new Player();
    this.rooms = this.createRooms();
    this.currentRoom = this.rooms["hall"];
    this.timeRemaining = 300;
    this.timerInterval = null;
  }

  createRooms() {
    const nurse = new Character("Nurse Algorithm", "helper", ["Remember to pace yourself.", "Hints are hidden in plain sight."]);
    const patientZero = new Character("Patient Zero", "maniac", ["I will find you!", "You can't escape me!"]);
    const patientEcho = new Character("Patient Echo", "helper", ["The book holds secrets.", "Stay calm and focused."]);
    const whisper = new Character("Suspicious Whisper", "trickster", ["Not all paths lead to truth.", "You trust too easily..."]);
    const ghost = new Character("Lonely Ghost", "neutral", ["I remember numbers...", "The fire kept me warm."]);
    const child = new Character("Timid Child", "helper", ["I hid the laptop under the pillow.", "Don't let the firewall burn you."]);
    const professor = new Character("Professor Neamah", "judge", ["Have you collected everything?", "Only the prepared may graduate."]);

    return {
      hall: new Room("Hall", "You awaken in the central hall of the Academy.", nurse, {
        left: "statisticsLab",
        center: "aiFinal",
        right: "cyberChallenge"
      }, new Items("Pen & Paper", "Basic tools for survival.", "Tucked under the welcome mat"), new Weapon("Knife", 1), "under mat"),

      statisticsLab: new Room("Statistics Lab", "Charts and distributions swirl on the walls.", patientZero, {
        up: "openData",
        right: "hall"
      }, new Items("Calculator", "Crunches numbers fast.", "Behind the broken monitor"), new Weapon("Sword", 3), "behind monitor"),

      openData: new Room("Open Data Analysis", "Datasets whisper secrets from forgotten servers.", ghost, {
        down: "statisticsLab"
      }, new Items("Numbers", "Fragments of forgotten data.", "Scattered across the dusty floor"), new Weapon("Fire", 2), "dusty floor"),

      aiFinal: new Room("AI Algorithm Final", "Neural networks pulse with eerie predictions.", patientEcho, {
        up: "forensics",
        down: "hall"
      }, new Items("Book", "Contains algorithmic secrets.", "Inside the server rack"), new Weapon("Shield", 2), "server rack"),

      forensics: new Room("Digital Forensics Test", "Encrypted files and corrupted logs litter the floor.", whisper, {
        up: "directorsWorkflow",
        down: "aiFinal"
      }, new Items("Magnifying Glass", "Reveals hidden clues.", "Behind the cupboard"), new Weapon("Taser", 2), "behind cupboard"),

      directorsWorkflow: new Room("Director's Workflow", "A glowing diploma awaits.", professor, {
        down: "forensics"
      }, new Items("Graduation Clothes", "Proof of readiness.", "Folded in the drawer"), new Weapon("Axe", 4), "drawer"),

      cyberChallenge: new Room("Cybersecurity Challenge", "Firewalls flicker and passwords hiss.", child, {
        left: "hall"
      }, new Items("Laptop", "Access to the digital realm.", "Under the pillow"), new Weapon("Flashlight", 1), "under pillow")
    };
  }

  startGame() {
    document.getElementById("intro").classList.add("hidden");
    document.getElementById("game").classList.remove("hidden");
    this.updateUI();
    this.timerInterval = setInterval(() => this.tick(), 1000);
  }

  tick() {
    if (this.timeRemaining > 0) {
      this.timeRemaining--;
      document.getElementById("time").textContent = this.timeRemaining;
      if (this.timeRemaining % 30 === 0) this.player.panic++;
    } else {
      this.endGame("Time ran out. You failed the final exam.", "The director laughs in the darkness.");
    }
  }
  updateUI() {
    const room = this.currentRoom;
    document.getElementById("room-description").textContent = room.description;
    document.getElementById("character-dialogue").textContent = room.character
      ? room.character.speak()
      : "The room is eerily silent.";
      const role = this.currentRoom.character?.role || "empty";
    document.getElementById("currentRoomName").textContent = `${this.currentRoom.name} (${role})`;

 
    document.getElementById("items").textContent = `Items: ${this.player.getItemsText()}`;
    document.getElementById("weapons").textContent = `Weapons: ${this.player.getWeaponsText()}`;
    document.getElementById("itemCount").textContent = `${this.player.items.length} of 7`;
    document.getElementById("weaponCount").textContent = `${this.player.weapons.length} of 7`;
    ocument.getElementById("currentRoomName").textContent = this.currentRoom.name;
    document.getElementById("time").textContent = this.timeRemaining;
    const keyCount = ["Key of Logic", "Key of Insight", "Key of Connectivity"]
       .filter(key => this.player.items.some(item => item.name === key)).length;

    document.getElementById("keyTracker").textContent = `Keys Collected: ${keyCount} of 3`;


    switch (room.name) {
      case "Hall": changeMusic("assets/sounds/Short-dramatic-background-intro-music.mp3"); break;
      case "Statistics Lab": changeMusic("assets/sounds/Whisper-sound.mp3"); break;
      case "Open Data Analysis": changeMusic("assets/sounds/Scary-strings-sound-effect.mp3"); break;
      case "AI Algorithm Final": changeMusic("assets/sounds/Dramatic-suspense-scary-stinger.mp3"); break;
      case "Digital Forensics Test": changeMusic("assets/sounds/Scariest-owl-sound.mp3"); break;
    }
  }

  handleCommand() {
    const input = document.getElementById("command").value.toLowerCase().trim();
    const room = this.currentRoom;

    if (input.startsWith("go ")) {
      const direction = input.split(" ")[1];
      const nextRoom = room.exits[direction];
      if (nextRoom) {
        this.currentRoom = this.rooms[nextRoom];
        this.updateUI();
      } else {
        this.setDialogue("You bump into a locked door.");
        this.player.panic++;
        this.timeRemaining -= 2;
      }

    } else if (input.startsWith("check ")) {
      const location = input.replace("check ", "").trim();
      if (room.hiddenItemLocation === location && !room.itemRevealed) {
        room.itemRevealed = true;
        this.setDialogue(`You found: ${room.item.name}! Hint: ${room.item.hint}`);
      } else {
        this.setDialogue("You find nothing. The shadows stir...");
        if (room.character?.role === "maniac" && Math.random() < 0.5) {
          this.endGame("You hesitated. Patient Zero lunged before you could react.", "Game Over.");
        } else {
          this.player.panic++;
        }
      }

    } else if (input === "take item" && room.itemRevealed && room.item) {
      this.player.addItem(room.item);
      this.setDialogue(`You picked up: ${room.item.name}`);
      room.item = null;

    } else if (input === "take weapon" && room.weapon) {
      this.player.addWeapon(room.weapon);
      this.setDialogue(`You armed yourself with: ${room.weapon.name}`);
      room.weapon = null;

    } else if (input.startsWith("fight") && room.character?.role === "maniac") {
      if (this.player.weapons.length > 0) {
        this.setDialogue("You fought off Patient Zero with your weapon!");
        room.character = null;
      } else {
        this.endGame("You were unarmed. Patient Zero overwhelmed you.", "Game Over.");
      }

    } else if (input === "hide") {
      this.player.stealth++;
      this.setDialogue("You hide in the shadows. Your stealth increases.");

    } else if (input === "run") {
      if (Math.random() < 0.5 + this.player.stealth * 0.1) {
        this.setDialogue("You escaped successfully!");
      } else {
        this.endGame("You tried to run, but Patient Zero was faster.", "Game Over.");
      }

    } else if (input === "panic") {
      this.player.panic++;
      this.timeRemaining -= 10;
      this.setDialogue("You panic. The shadows close in. Time slips away...");

    } else if (input === "check inventory") {
      this.setDialogue(`Items: ${this.player.getItemsText()} | Weapons: ${this.player.getWeaponsText()}`);

    } else if (input.startsWith("talk to ")) {
      const target = input.replace("talk to ", "").trim();
      if (room.character && room.character.name.toLowerCase().includes(target)) {
        this.setDialogue(room.character.speak());
      } else {
        this.setDialogue("No one responds...");
      }

    } else if (input.startsWith("use ")) {
      const itemName = input.replace("use ", "").trim();
      if (this.player.items.some(i => i.name.toLowerCase() === itemName)) {
        this.setDialogue(`You used ${itemName}. Something shifts in the shadows...`);
      } else {
        this.setDialogue("You don't have that item.");
      }
    
    } else if (input === "help") {
      const room = this.currentRoom;
      const exits = Object.entries(room.exits)
        .map(([dir, target]) => `${dir} → ${this.rooms[target].name}`)
        .join(", ");

      const characterInfo = room.character
        ? `${room.character.name} (${room.character.role})`
        : "None";

      const itemInfo = room.item
        ? `${room.item.name}${room.item.name.includes("Key") ? " 🗝️" : ""}`
        : "None";

      const weaponInfo = room.weapon
        ? `${room.weapon.name} 🗡️`
        : "None";

      this.setDialogue(
    `📍 Location: ${room.name}\n🧾 ${room.description}\n🧍 Character: ${characterInfo}\n🎒 Item: ${itemInfo}\n🗡️ Weapon: ${weaponInfo}\n🚪 Exits: ${exits}`
     );
    } 

    else if (input.startsWith("equip ")) {
      const weaponName = input.replace("equip ", "").trim();
      if (this.player.weapons.some(w => w.name.toLowerCase() === weaponName)) {
        this.setDialogue(`You equip ${weaponName}. You feel more prepared.`);
     } else {
        this.setDialogue("You don't have that weapon.");
     }

    } else if (input === "inspect room") {
      this.setDialogue("You inspect the room carefully. Strange symbols line the walls...");
    } else if (input === "status") {
      this.setDialogue(`Panic: ${this.player.panic} | Stealth: ${this.player.stealth} | Time: ${this.timeRemaining}s`);
    } else if (input === "hint" || input === "ask for help") {
      this.setDialogue("A whisper echoes: 'The key lies where logic falters...'");
    } else if (input === "exit game") {
      exitGame();
    } else if (input === "reset game") {
      resetGame();
    } else {
      this.setDialogue("Nothing happens. The silence grows heavier.");
      this.player.panic++;
      this.timeRemaining -= 2;
    }

    document.getElementById("command").value = "";
    document.getElementById("roomName").textContent = `Room: ${room.name}`;
    document.getElementById("roomDescription").textContent = `Description: ${room.description}`;
    document.getElementById("roomCharacter").textContent = `Character: ${characterInfo}`;
    document.getElementById("roomItem").textContent = `Item: ${itemInfo}`;
    document.getElementById("roomWeapon").textContent = `Weapon: ${weaponInfo}`;
    document.getElementById("roomExits").textContent = `Exits: ${exits}`;


  }

  setDialogue(text) {
    document.getElementById("character-dialogue").textContent = text;
  }

  endGame(description, dialogue) {
    clearInterval(this.timerInterval);
    document.getElementById("room-description").textContent = description;
    document.getElementById("character-dialogue").textContent = dialogue;
    document.getElementById("command").disabled = true;
  }
}

// Global Game Instance
// 
let game = new Game();


