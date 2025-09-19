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

// Room Class
class Room {
  constructor(name, description, character = null, exits = {}, item = null) {
    this.name = name;
    this.description = description;
    this.character = character;
    this.exits = exits;
    this.item = item;
  }
}

// Player Class
class Player {
  constructor() {
    this.inventory = [];
    this.keysCollected = 0;
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
}

//  Game Class
class Game {
  constructor() {
    this.player = new Player();
    this.rooms = this.createRooms();
    this.currentRoom = this.rooms["entrance"];
    this.timeRemaining = 900;
    this.timerInterval = null;
  }

  createRooms() {
    const nurse = new Character("Nurse Algorithm", "nurse", [
      "Remember to pace yourself.",
      "Hints are hidden in plain sight.",
      "Use your cheat sheet wisely."
    ]);

    const patients = [
      new Character("Patient Zero", "patient", [
        "I can't find the key!",
        "Did you hear that whisper?",
        "We're running out of time!"
      ]),
      new Character("Patient Echo", "patient", [
        "I think the answer is in Room 2.",
        "Don't trust the shadows.",
        "The professor is watching us."
      ])
    ];

    const professorNeamah = new Character("Professor Neamah", "professor", [
      "Have you collected your keys?",
      "Only the prepared may graduate.",
      "Time is your greatest enemy."
    ]);

    return {
      entrance: new Room("Entrance", "You awaken in the entrance hall of the Sanatorium. The air is thick with dread.", nurse, { north: "exam1" }),
      exam1: new Room("Exam Room 1", "The walls are lined with algorithmic runes.", patients[0], { south: "entrance", east: "exam2" }, new Items("Key of Logic", "Unlocks the path to understanding.")),
      exam2: new Room("Exam Room 2", "AI diagrams float in the air like ghosts.", patients[1], { west: "exam1", north: "exam3" }, new Items("Key of Insight", "Reveals hidden truths.")),
      exam3: new Room("Exam Room 3", "Diagrams of mobile networks pulse on the walls.", null, { south: "exam2", north: "directorOffice" }, new Items("Key of Connectivity", "Binds knowledge together.")),
      directorOffice: new Room("Director's Office", "A diploma glows ominously.", professorNeamah, { south: "exam3" })
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
    document.getElementById("inventory").textContent = `Inventory: ${this.player.getInventoryText()}`;
    document.getElementById("time").textContent = this.timeRemaining;
     // Music logic
    switch (room.name) {
      case "Entrance":
        changeMusic("assets/sounds/Short-dramatic-background-intro-music.mp3");
        break;
      case "Exam Room 1":
        changeMusic("assets/sounds/Whisper-sound.mp3");
        break;
      case "Exam Room 2":
        changeMusic("assets/sounds/Scary-strings-sound-effect.mp3");
        break;
      case "Exam Room 3":
        changeMusic("assets/sounds/Dramatic-suspense-scary-stinger.mp3");
        break;
      case "Director's Office":
        changeMusic("assets/sounds/Evil-cartoon-laugh-sound-effect.mp3");
        
        break;


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


