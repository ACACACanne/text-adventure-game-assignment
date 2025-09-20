function startGame() {
  game.startGame();
}

// Sound Effect Player
function playSFX(src) {
  const sfx = document.getElementById("sfx");
  sfx.src = src;
  sfx.muted = document.getElementById("bgMusic").muted;
  sfx.play();
}

//Change music based on context
function changeMusic(src) {
  const bg = document.getElementById("bgMusic");
  bg.src = src;
  bg.muted = false;
  bg.play();
}

function fadeAndChangeMusic(newSrc) {
  const bg = document.getElementById("bgMusic");
  let volume = bg.volume;

  const fade = setInterval(() => {
    if (volume > 0.05) {
      volume -= 0.05;
      bg.volume = volume;
    } else {
      clearInterval(fade);
      bg.src = newSrc;
      bg.volume = 1;
      bg.play();
    }
  }, 100);
}



// Mute Toggle
function toggleMusic() {
  const bg = document.getElementById("bgMusic");
  const sfx = document.getElementById("sfx");
  const button = document.getElementById("muteBtn");

  const isMuted = !bg.muted;
  bg.muted = isMuted;
  sfx.muted = isMuted;

  button.textContent = isMuted ? "🔈 Unmute" : "🔊 Mute";
}

// Start Game 
function startGame() {
  game.startGame();
  document.getElementById("bgMusic").play(); // force autoplay
}

// Reset Game
function resetGame() {
  const overlay = document.getElementById("spookyOverlay");
  overlay.classList.add("fade-in");
  overlay.textContent = "You’ve returned to the halls of failure...";
  overlay.classList.add("text-white", "flex", "items-center", "justify-center", "text-2xl", "font-bold");

  playSFX("assets/sounds/Whisper-sound.mp3");
  playSFX("assets/sounds/Scary-strings-sound-effect.mp3");
  playSFX("assets/sounds/assets/sounds/Dramatic-suspense-scary-stinger.mp3");
  playSFX("assets/sounds/assets/sounds/Evil-cartoon-laugh-sound-effect.mp3");
  playSFX("assets/sounds/assets/sounds/Horror-suspense-intro-music.mp3");
  playSFX("assets/sounds/assets/sounds/Scariest-owl-sound.mp3");
  playSFX("assets/sounds/assets/sounds/assets/sounds/Spooky-haunted-halloween-bells-sound-effect.mp3");
  playSFX("assets/sounds/assets/sounds/assets/sounds/Short-dramatic-background-intro-music.mp3");

  setTimeout(() => {
    clearInterval(game.timerInterval);
    game = new Game();
    game.startGame();
    overlay.classList.remove("fade-in");
  }, 1500);
}

// Exit Game
function exitGame() {
  alert("You cannot escape the Academy forever...");
  clearInterval(game.timerInterval);
  document.getElementById("game").classList.add("hidden");
  document.getElementById("intro").classList.remove("hidden");
  document.getElementById("command").value = "";
  document.getElementById("command").disabled = false;
  document.getElementById("time").textContent = "300";
}

// Character Class
class Character {
  constructor(name, role, dialogue = []) {
    this.name = name;
    this.role = role;
    this.dialogue = dialogue;
  }
  speak() {
    const line = this.dialogue[Math.floor(Math.random() * this.dialogue.length)];
    return `${this.name} says: "${line}"`;
  }
}

// Item Class
class Items {
  constructor(name, description) {
    this.name = name;
    this.description = description;
  }
}

//Weapon Class
class Weapon {
  constructor(name, power) {
    this.name = name;
    this.power = power;
  }
}

// Room Class
class Room {
  constructor(name, description, character = null, exits = {}, item = null, weapon = null) {
    this.name = name;
    this.description = description;
    this.character = character;
    this.exits = exits;
    this.item = item;
    this.weapon = weapon;
    this.hiddenItemLocation = this.hiddenItemLocation;
    this.itemRevelaed = false;
  }
}

// Player Class
class Player {
  constructor() {
    this.inventory = [];
    this.keysCollected = 0;
    this.weapon = weapon;
    this.item = item;
  }
  addItem(item) {
    this.item.push(item);
    if (item.name.includes("Key")) this.keysCollected++;
  }
  addWeapon(weapon) {
    this.weapons.push(weapon);
  } 
  getItemsText () {
    return this.items.length ? this.items.map(i => i.name).join(", "): "None";
  }

  getWeaponsText () {
    return this.weapons.length ? this.weapons.map(i => i.name).join(", "):"None";
  }

  getInventoryText() {
    return this.inventory.length
      ? this.inventory.map(item => `[${item.name}]`).join(", ")
      : "Empty";
  }
}

//  Game Class
class Game {
  constructor() {
    this.player = new Player();
    this.rooms = this.createRooms();
    this.currentRoom = this.rooms["hall"];
    this.timeRemaining = 1800;
    this.timerInterval = null;
  }

  createRooms() {
    const nurse = new Character("Nurse Algorithm", "helper", [
      "Remember to pace yourself.",
      "Hints are hidden in plain sight.",
      "Use your cheat sheet wisely."
    ]);

    const patientZero = 
      new Character("Patient Zero", "maniac", [
        "I will find you",
        "You can't escape me",
        "I can't find the key!",
        "Did you hear that whisper?",
        "We're running out of time!"
      ]);
    const patientEcho = 
      new Character("Patient Echo", "helper", [
        "I think the answer is in Room 2.",
        "The book helds secrets.",
        "Stay calm and focused.",
        "Don't trust the shadows.",
        "The professor is watching us."
      ]);
      const whisper = [
       new Character("Suspicious Whisper", "trickster", [
        "Not all paths lead to trush",
        "You trust too easily",
      ]);
    const ghost = new Character("Lonely Ghost", "neutral", [
      "I remember numbers...",
      "The fire kept me warm."
    ]);
    const child = new Character("Timid Child", "helper", [
      "I hid the laptop under the pillow.",
      "Don't let the firewall burn you."
    ]);
    const professor = new Character("Professor Neamah", "judge", [
      "Have you collected everything?",
      "Only the prepared may graduate.", 
      "The time is your greatest enemy."
    ]);

    return {
      hall: new Room("Hall", "You awaken in the central hall of the Academy. Footsteps echo in every direction.", nurse, {
        left: "statisticsLab",
        center: "aiFinal",
        right: "cyberChallenge"
      }, new Items("Pen & Paper", "Basic tools for survival.", "Tucked under the welcome mat"), new Weapon("Knife", 1)),

      statisticsLab: new Room("Statistics Lab", "Charts and distributions swirl on the walls.", patientZero, {
        up: "openData",
        right: "hall"
      }, new Items("Calculator", "Crunches numbers fast.", "Behind the broken monitor"), new Weapon("Sword", 3)),

      openData: new Room("Open Data Analysis", "Datasets whisper secrets from forgotten servers.", ghost, {
        down: "statisticsLab"
      }, new Items("Numbers", "Fragments of forgotten data.", "Scattered across the dusty floor"), new Weapon("Fire", 2)),

      aiFinal: new Room("AI Algorithm Final", "Neural networks pulse with eerie predictions.", patientEcho, {
        up: "forensics",
        down: "hall"
      }, new Items("Book", "Contains algorithmic secrets.", "Wedged inside the server rack"), new Weapon("Shield", 2)),

      forensics: new Room("Digital Forensics Test", "Encrypted files and corrupted logs litter the floor.", whisper, {
        up: "directorWorkflow",
        down: "aiFinal"
      }, new Items("Magnifying Glass", "Reveals hidden clues.", "Behind the cupboard of corrupted files"), new Weapon("Taser", 2)),

      directorsWorkflow: new Room("Director's Workflow", "A glowing diploma awaits. The final exam begins.", professor, {
        down: "forensics"
      }, new Items("Graduation Clothes", "Proof of readiness.", "Folded neatly in the locked drawer"), new Weapon("Axe", 4)),

      cyberChallenge: new Room("Cybersecurity Challenge", "Firewalls flicker and passwords hiss.", child, {
        left: "hall"
      }, new Items("Laptop", "Access to the digital realm.", "Under the pillow in the firewall bed"), new Weapon("Flashlight", 1))
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
    } else {
      this.endGame("The clock strikes zero. You failed the final exam.", "The director laughs in the darkness.");
    }
  }

  updateUI() {
    const room = this.currentRoom;
    //Room dialogue and description
    document.getElementById("room-description").textContent = room.description;
    document.getElementById("character-dialogue").textContent = room.character
      ? room.character.speak()
      : "The room is eerily silent.";
    document.getElementById("Items").textContent = `Items: ${this.player.getItemsText()} `;
    document.getElementById("Weapons").textContent = `Weapons: ${this.player.getWeaponsText()}`;
    document.getElementById("itemCount").textContent = `${this.player.items.length} of 7`;
    document.getElementById("weaponCount").textContent = `${this.player.weapons.length} of 7`;
    document.getElementById("inventory").textContent = `Inventory: ${this.player.getInventoryText()}`;
    document.getElementById("time").textContent = this.timeRemaining;

     // Music logic
    switch (room.name) {
      case "Hall":
        changeMusic("assets/sounds/Short-dramatic-background-intro-music.mp3");
        break;
      case "Statistics Lab":
        changeMusic("assets/sounds/Whisper-sound.mp3");
        break;
      case "Open Data":
        changeMusic("assets/sounds/Scary-strings-sound-effect.mp3");
        break;
      case "AI Final":
        changeMusic("assets/sounds/Dramatic-suspense-scary-stinger.mp3");
        break;
      case "Forensics":
        changeMusic("assets/sounds/Scariest-owl-sound.mp3");
        break;
        case "Director's Workflow":
        changeMusic("assets/sounds/Horror-suspense-intro-music.mp3");
        break;
        case "Forensics":
        changeMusic("assets/sounds/Evil-cartoon-laugh-sound-effect.mp3");
        break;
    }

     //Win condition check
    if (room.name === "Director's Workflow" && 
      this.player.keysCollected >= 3 &&
      this.player.items.length === 7 &&
      this.player.items.some(i => i.name === "Graduation Clothes")) {
    // Hide game screen
      document.getElementById("game").classList.add("hidden");

    // Show victory message
    const intro = document.getElementById("intro");
    intro.classList.remove("hidden");
    intro.innerHTML = `
      <h1 class="text-4xl text-green-500 font-bold">"You present all three keys. The diploma glows brighter... You have passed."</h1>
      <p class="mt-4 text-white">You collected all the keys and survived the final exam. "Professor Neamah nods solemnly. 'You may leave the Academy.'"</p>
    `;

    //Play victory sound
    playSFX("assets/sounds/Dramatic-suspense-scary-stinger.mp3");
    
   }  
   
  }

  handleCommand() {
    const input = document.getElementById("command").value.toLowerCase();
    const room = this.currentRoom;

    if (input.startsWith("go ")) {
      const direction = input.split(" ")[1];
      const nextRoom = room.exits[direction];
      if (nextRoom) {
        this.currentRoom = this.rooms[nextRoom];
        this.updateUI();
      } else {
        this.setDialogue("You bump into a locked door.");
        this.timeRemaining -= 2;
      }
    } else if (input === "take key" && room.item) {
      this.player.addItem(room.item);
      this.setDialogue(`You picked up: ${room.item.name}`);
      room.item = null;
    } else if (input === "check inventory") {
      this.setDialogue(`You are carrying: ${this.player.getInventoryText()}`);
    } else if (input === "talk to nurse" && room.character?.role === "nurse") {
      this.setDialogue(room.character.speak());
    } else if (input === "talk to patient" && room.character?.role === "patient") {
      this.setDialogue(room.character.speak());
    } else if (input === "talk to professor" && room.character?.role === "professor") {
      this.setDialogue(room.character.speak());
    } else if (input === "hint" || input === "ask for help") {
      this.setDialogue("A whisper echoes: 'The key lies where logic falters...'");
    } else if (input === "exit game") {
      exitGame();
    } else if (input === "reset game") {
      resetGame();
    } else if (input === "panic") {
      this.timeRemaining -= 10;
      this.setDialogue("You panic. The shadows close in. Time slips away...");
    } else {
      this.setDialogue("Nothing happens. The silence grows heavier.");
      this.timeRemaining -= 2;
    }


    document.getElementById("command").value = "";
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
let game = new Game();


