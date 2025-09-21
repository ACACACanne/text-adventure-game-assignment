window.startGame = startGame;
window.toggleMusic = toggleMusic;
window.resetGame = resetGame;
window.exitGame = exitGame;

let game;

document.addEventListener("DOMContentLoaded", () => {
  game = new Game();

  document.getElementById("startBtn").addEventListener("click", startGame);
  document.getElementById("muteBtn").addEventListener("click", toggleMusic);
  document.getElementById("playBtn").addEventListener("click", resetGame);
  document.getElementById("exitBtn").addEventListener("click", exitGame);
  document.getElementById("commandBtn").addEventListener("click", () => {
    game.handleCommand();
  });

  document.getElementById("command").addEventListener("keydown", e => {
    if (e.key === "Enter") game.handleCommand();
  });
});



function startGame() {
  if (game?.timerInterval) clearInterval(game.timerInterval);
  game = new Game();
  game.startGame();
  document.getElementById("bgMusic").muted = false;
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
  bg.pause();
  bg.src = src;
  bg.load();
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
  const overlay = document.getElementById("spookyOverlay");
  overlay.classList.add("fade-in");
  overlay.textContent = "You’ve returned to the halls of failure...";
  overlay.classList.add("text-white", "flex", "items-center", "justify-center", "text-2xl", "font-bold");
  setTimeout(() => {
    clearInterval(game.timerInterval);
    game = new Game();
    game.startGame();
    overlay.classList.remove("fade-in");
  }, 1800);
}

function exitGame() {
  alert("You cannot escape the Academy forever...");
  clearInterval(game.timerInterval);
  document.getElementById("game").classList.add("hidden");
  document.getElementById("intro").classList.remove("hidden");
  document.getElementById("command").value = "";
  document.getElementById("command").disabled = false;
  document.getElementById("time").textContent = "1800";
}

class Character {
  constructor(name, role, dialogue = [], hint) {
    this.name = name;
    this.role = role;
    this.dialogue = dialogue;
    this.hint = hint;
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
  constructor(name, power, hint) {
    this.name = name;
    this.power = power;
    this.hint = hint;
  }
}

class Room {
  constructor(name, description, character = null, exits = {}, item = null, weapon = null, hiddenItemLocation = "", music = "", hint = "") {
    this.name = name;
    this.description = description;
    this.character = character;
    this.exits = exits;
    this.item = item;
    this.weapon = weapon;
    this.hiddenItemLocation = hiddenItemLocation;
    this.itemRevealed = false;
    this.music = music;
    this.hint = hint;
  }
}

class Player {
  constructor() {
    this.inventory = [];
    this.weapons = [];
    this.keysCollected = 0;
    this.panic = 0;
    this.stealth = 0;
  }

  addItem(item) {
    this.inventory.push(item);
    if (item.name.includes("Key")) this.keysCollected++;
  }

  getInventoryText() {
    return this.inventory.length
      ? this.inventory.map(item => `[${item.name}]`).join(", ")
      : "Empty";
  }

  pickUp(item) {
    if (item) {
      this.addItem(item);
      return `${item.name} added to your inventory.`;
    }
    return "There's nothing to pick up.";
  }

  hasItem(itemName) {
    return this.inventory.some(item => item.name === itemName);
  }

  addWeapon(weapon) {
    this.weapons.push(weapon);
  }

  getItemsText() {
    return this.inventory.length ? this.inventory.map(i => i.name).join(", ") : "None";
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
    this.timeRemaining = 1800;
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
    const madChef = new Character("Mad Chef", "trickster", ["You hungry? I serve chaos.", "Take the cheat sheet... if you dare."]);
    const snakeGuardian = new Character("Sibilith", "guardian", ["Calm your pulse. I taste your fear.", "Truth lies behind the mirror."]);

    return {
      hall: new Room("Hall", "You awaken in the central hall of the Academy.", nurse, {
        left: "loom", up: "aiFinal", right: "kitchen"
      }, new Items("Pen & Paper", "Basic tools for survival.", "Tucked under the welcome mat"), new Weapon("Knife", 1), "under mat", "assets/sounds/Short-dramatic-background-intro-music.mp3"),

      kitchen: new Room("Kitchen", "The air reeks of burnt ambition. Pots clang with rage.", madChef, {
        left: "hall", up: "cyberChallenge"
      }, new Items("Poisoned Cheat Sheet", "Looks helpful... but smells suspicious.", "Inside the boiling pot"), new Weapon("Cleaver", 3), "boiling pot", "assets/sounds/Evil-cartoon-laugh-sound-effect.mp3"),

      loom: new Room("Loom", "Tiles whisper secrets. A serpent coils in silence.", snakeGuardian, {
        right: "hall", up: "statisticsLab"
      }, new Items("Key of Truth", "Unlocks the final lore.", "Behind the cracked mirror"), null, "mirror", "assets/sounds/Horror-suspense-intro-music.mp3"),

      statisticsLab: new Room("Statistics Lab", "Charts and distributions swirl on the walls.", patientZero, {
        up: "openData", right: "aiFinal", down: "loom"
      }, new Items("Calculator", "Crunches numbers fast.", "Behind the broken monitor"), new Weapon("Sword", 3), "monitor", "assets/sounds/Whisper-sound.mp3"),

      openData: new Room("Open Data Analysis", "Datasets whisper secrets from forgotten servers.", ghost, {
        down: "statisticsLab", right: "forensics"
      }, new Items("Key of Connectivity", "Links forgotten systems.", "Scattered across the dusty floor"), new Weapon("Fire", 2), "floor", "assets/sounds/Scary-strings-sound-effect.mp3"),

      aiFinal: new Room("AI Algorithm Final", "Neural networks pulse with eerie predictions.", patientEcho, {
        up: "forensics", down: "hall"
      }, new Items("Key of Insight", "Contains algorithmic secrets.", "Inside the server rack"), new Weapon("Shield", 2), "server rack", "assets/sounds/Dramatic-suspense-scary-stinger.mp3"),

      forensics: new Room("Digital Forensics Test", "Encrypted files and corrupted logs litter the floor.", whisper, {
        up: "directorWorkflow", down: "aiFinal", left: "openData"
      }, new Items("Magnifying Glass", "Reveals hidden clues.", "Behind the cupboard"), new Weapon("Taser", 2), "cupboard", "assets/sounds/Scariest-owl-sound.mp3"),

      directorWorkflow: new Room("Professor Neamah", "A glowing diploma awaits.", professor, {
        down: "forensics"
      }, new Items("Graduation Clothes", "Proof of readiness.", "Folded in the drawer"), new Weapon("Axe", 4), "drawer", "assets/sounds/Graduation-theme.mp3"),

      cyberChallenge: new Room("Cybersecurity Challenge", "Firewalls flicker and passwords hiss.", child, {
        left: "aiFinal", down: "kitchen"
      }, new Items("Laptop", "Access to the digital realm.", "Under the pillow"), new Weapon("Flashlight", 1), "pillow", "assets/sounds/Firewall-buzz.mp3")
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

    const role = room.character?.role || "empty";
    const itemName = room.item ? room.item.name : "No item";
    const weaponName = room.weapon ? room.weapon.name : "No weapon";
    document.getElementById("currentRoomName").textContent = `${room.name} (${role}) — ${itemName}, ${weaponName}`;

    if (
      this.currentRoom.name === "Professor Neamah" &&
      ["Key of Truth", "Key of Insight", "Key of Connectivity"].every(key => this.player.hasItem(key))
    ) {
      this.endGame("You present all three keys. The professor nods solemnly.", "🎓 You graduate from the haunted academy. Victory is yours!");
      playSFX("assets/sounds/Cheering-crowd-with-applause-sound-effect.mp3");
      return;
    }


    document.getElementById("items").textContent = `Items: ${this.player.getItemsText()}`;
    document.getElementById("weapons").textContent = `Weapons: ${this.player.getWeaponsText()}`;
    document.getElementById("itemCount").textContent = `Items Collected: ${this.player.inventory.length} of 7`;
    document.getElementById("weaponCount").textContent = `Weapons Collected: ${this.player.weapons.length} of 7`;
    document.getElementById("keyTracker").textContent = `Keys Collected: ${this.player.keysCollected} of 3`;
    document.getElementById("time").textContent = this.timeRemaining;

    if (room.music) changeMusic(room.music);
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
  handleCommand() {
    const input = document.getElementById("command").value.toLowerCase().trim();
    const room = this.currentRoom;

    const characterInfo = room.character
      ? `${room.character.name} (${room.character.role})`
      : "None";

    const itemInfo = room.item
      ? `${room.item.name}${room.item.name.includes("Key") ? " 🗝️" : ""}`
      : "None";

    const weaponInfo = room.weapon
      ? `${room.weapon.name} 🗡️`
      : "None";

    const exits = Object.entries(room.exits)
      .map(([dir, target]) => `${dir} → ${this.rooms[target].name}`)
      .join(", ");

    const respond = msg => {
      this.setDialogue(msg);
      document.getElementById("command").value = "";
    };

    // Movement
    if (input.startsWith("go ")) {
      const direction = input.split(" ")[1];
      const nextRoomName = room.exits[direction];
      const nextRoom = this.rooms[nextRoomName];

      if (nextRoomName === "directorWorkflow") {
        const hasAllKeys = ["Key of Truth", "Key of Insight", "Key of Connectivity"]
          .every(key => this.player.hasItem(key));
        if (!hasAllKeys) return respond("The door remains sealed. You lack the knowledge to proceed.");
      }

      if (nextRoom) {
        this.currentRoom = nextRoom;
        this.updateUI();
      } else {
        respond("You bump into a locked door.");
        this.player.panic++;
        this.timeRemaining -= 2;
      }

    // Item pickup
    

    } else if (input === "take item" && room.item) {
       this.player.addItem(room.item);
       this.setDialogue(`You picked up: ${room.item.name}`);
       room.item = null;



    } else if (input === "take key" && room.item) {
      this.player.addItem(room.item);
      respond(`You picked up: ${room.item.name}`);
      room.item = null;

    } else if (input === "take weapon" && room.weapon) {
      this.player.addWeapon(room.weapon);
      respond(`You armed yourself with: ${room.weapon.name}`);
      room.weapon = null;

    // Hidden item check
    } else if (input.startsWith("check ")) {
      const location = input.replace("check ", "").trim();
      if (room.hiddenItemLocation === location && !room.itemRevealed) {
        room.itemRevealed = true;
        respond(`You found: ${room.item.name}! Hint: ${room.item.hint}`);
      } else {
        respond("You find nothing. The shadows stir...");
        if (room.character?.role === "maniac" && Math.random() < 0.5) {
          this.endGame("You hesitated. Patient Zero lunged before you could react.", "Game Over.");
        } else {
          this.player.panic++;
        }
      }

    // Combat
    } else if (input.startsWith("fight") && room.character?.role === "maniac") {
      if (this.player.weapons.length > 0) {
        respond("You fought off Patient Zero with your weapon!");
        room.character = null;
      } else {
        this.endGame("You were unarmed. Patient Zero overwhelmed you.", "Game Over.");
      }

    // Escape mechanics
    } else if (input === "hide") {
      this.player.stealth++;
      respond("You hide in the shadows. Your stealth increases.");

    } else if (input === "run") {
      if (Math.random() < 0.5 + this.player.stealth * 0.1) {
        respond("You escaped successfully!");
      } else {
        this.endGame("You tried to run, but Patient Zero was faster.", "Game Over.");
      }

    } else if (input === "panic") {
      this.player.panic++;
      this.timeRemaining -= 10;
      respond("You panic. The shadows close in. Time slips away...");

    // Inventory
    } else if (input === "check inventory") {
      respond(`Items: ${this.player.getItemsText()} | Weapons: ${this.player.getWeaponsText()}`);

    } else if (input === "check full inventory") {
      respond(`You are carrying: ${this.player.getInventoryText()}`);

    // Dialogue
    } else if (input.startsWith("talk to ")) {
      const target = input.replace("talk to ", "").trim();
      const match = room.character?.name.toLowerCase().includes(target);
      if (match) {
        respond(room.character.speak());
      } else {
        respond("No one responds...");
      }

    // Item usage
    } else if (input.startsWith("use ")) {
      const itemName = input.replace("use ", "").trim();
      if (this.player.inventory.some(i => i.name.toLowerCase() === itemName)) {
        respond(`You used ${itemName}. Something shifts in the shadows...`);
      } else {
        respond("You don't have that item.");
      }

    // Status and help
    } else if (input === "help" || input === "where am i") {
      respond(`📍 Location: ${room.name}\n🧾 ${room.description}\n🧍 Character: ${characterInfo}\n🎒 Item: ${itemInfo}\n🗡️ Weapon: ${weaponInfo}\n🚪 Exits: ${exits}`);

    } else if (input.startsWith("equip ")) {
      const weaponName = input.replace("equip ", "").trim();
      if (this.player.weapons.some(w => w.name.toLowerCase() === weaponName)) {
        respond(`You equip ${weaponName}. You feel more prepared.`);
      } else {
        respond("You don't have that weapon.");
      }

    } else if (input === "inspect room") {
      respond("You inspect the room carefully. Strange symbols line the walls...");

    } else if (input === "status") {
      respond(`Panic: ${this.player.panic} | Stealth: ${this.player.stealth} | Time: ${this.timeRemaining}s`);

    } else if (input === "hint" || input === "ask for help") {
      respond("A whisper echoes: 'The key lies where logic falters...'");

    // System commands
    } else if (input === "exit game") {
      exitGame();

    } else if (input === "reset game") {
      resetGame();

    // Unknown command
    } else {
      respond("Nothing happens. The silence grows heavier.");
      this.player.panic++;
      this.timeRemaining -= 2;
    }
  }
}






