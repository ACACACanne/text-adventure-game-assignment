



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

class Items {
  constructor(name, description) {
    this.name = name;
    this.description = description;
  }
}

class Room {
  constructor(name, description, character = null, exits = {}, item = null) {
    this.name = name;
    this.description = description;
    this.character = character;
    this.exits = exits;
    this.item = item;
  }
}

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

class Game {
  constructor() {
    this.player = new Player();
    this.rooms = this.createRooms();
    this.currentRoom = this.rooms["entrance"];
    this.timeRemaining = 300;
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
    document.getElementById("room-description").textContent = room.description;
    document.getElementById("character-dialogue").textContent = room.character
      ? room.character.speak()
      : "The room is eerily silent.";
    document.getElementById("inventory").textContent = `Inventory: ${this.player.getInventoryText()}`;
    document.getElementById("time").textContent = this.timeRemaining;
  }

  handleCommand() {
    const input = document.getElementById("command").value.toLowerCase();
    const room = this.currentRoom;

    if (input.startsWith("go ")) {
      const direction = input.split(" ")[1];
      const nextRoomKey = room.exits[direction];
      if (nextRoomKey && this.rooms[nextRoomKey]) {
        this.currentRoom = this.rooms[nextRoomKey];
        this.timeRemaining -= 10;
        this.updateUI();
      } else {
        alert("You can't go that way!");
        this.timeRemaining -= 2;
      }
    } else if (input === "take key" && room.item) {
      this.player.addItem(room.item);
      alert(`You take the ${room.item.name}.`);
      room.item = null;
      this.timeRemaining -= 5;
      this.updateUI();
    } else {
      alert("Nothing happens. The silence grows heavier.");
      this.timeRemaining -= 2;
    }

    document.getElementById("command").value = "";
  }

  endGame(description, dialogue) {
    clearInterval(this.timerInterval);
    document.getElementById("room-description").textContent = description;
    document.getElementById("character-dialogue").textContent = dialogue;
    document.getElementById("command").disabled = true;
  }

}

function resetGame() {
  const overlay = document.getElementById("spookyOverlay");

  // Fade in the overlay
  overlay.classList.add("fade-in");

  //whisper sound or heartbeat
  const audio = new Audio("whisper.mp3");
  audio.play();

  // Wait for 1.5 seconds, then reset
  setTimeout(() => {
    clearInterval(game.timerInterval);
    game = new Game();
    game.startGame();

    // Fade out the overlay
    overlay.classList.remove("fade-in");
      }, 1500);

    overlay.textContent = "You’ve returned to the halls of failure...";
    overlay.classList.add("text-white", "flex", "items-center", "justify-center", "text-2xl", "font-bold");
    
    let game = new Game();

}

function exitGame() {
    alert("You cannot escape the Academy forever...");
  clearInterval(game.timerInterval); // stop the countdown
  document.getElementById("game").classList.add("hidden");
  document.getElementById("intro").classList.remove("hidden");

  // Optional: reset command input and timer
  document.getElementById("command").value = "";
  document.getElementById("command").disabled = false;
  document.getElementById("time").textContent = "300";
}

function toggleMusic() {
  const audio = document.getElementById("bgMusic");
  const button = document.getElementById("muteBtn");

  if (audio.muted) {
    audio.muted = false;
    button.textContent = "🔊 Mute";
  } else {
    audio.muted = true;
    button.textContent = "🔈 Unmute";
  }
}

function fadeOutMusic() {
  const audio = document.getElementById("bgMusic");
  let volume = audio.volume;

  const fade = setInterval(() => {
    if (volume > 0.05) {
      volume -= 0.05;
      audio.volume = volume;
    } else {
      clearInterval(fade);
      audio.muted = true;
    }
  }, 100);
}











// Make game globally accessible
const game = new Game();

