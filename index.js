function startGame() {
    document.getElementById("intro").classList.add("hidden");
    document.getElementById("game").classList.remove("hidden");
}

function handleComand() {
    document.getElementById("game");
}

class Room {
    #name;
    #description;
    #character;
    #linkedRooms;
    #items;
    #exits;
     
    constructor(name, description, character, linkedRooms, items, exits) {
      this.#name = name;
      this.#description = description;
      this.#character = character;
      this.#linkedRooms = linkedRooms;
      this.#items = items;
      this.#exits = exits;
    
    }

    get name() {
        return this.#name;
    }

    get description(){
        return this.#description;
    }

     get character(){
        return this.#character;
    }

     get linkedRooms(){
        return this.#linkedRooms;
    }

     get items(){
        return this.#items;
    }

    get exits() {
        return this.#exits;
    }

    set name(value) {
        if (value.lenght < 3) {
            alert("Name must be longer!");
            return;
        }
        this.#name = value;
    }

    set description(value) {
        if (value.lenght < 3) {
            alert("Name must be longer!");
            return;
        } 
        this.#description = value;
    }

    set character(value) {
        this.#character = value;
    }

    set linkedRooms(value) {
        this.#linkedRooms = value;
    }

    set items(value) {
        this.#items = value;
    }
}

let currentRoom = "entrance";
let timeRemaining = 300;

class Character {
    #player;
    #nurse;
    #ProfessorNeamah;
    #patients;

    constructor(student, nurse, ProfessorNeamah, patients) {
        this.#player = player;
        this.#nurse = nurse;
        this.#ProfessorNeamah = ProfessorNeamah;
        this.#patients = patients;
    }

    get player() {
        return this.#player;
    }

    get nurse(){
        return this.#nurse;
    }

     get ProfessorNeamah(){
        return this.#ProfessorNeamah;
    }

     get patients(){
        return this.#patients;
    }


    set player(value) {
        this.#player = value;
    }

    set nurse(value) {
        this.#nurse = value;
    }

    set ProfessorNeamah(value) {
        this.#ProfessorNeamah = value;
    }

    set patients(value) {
        this.#patients = value;
    }
}

class Items {
    #name;
    #description;
    
     constructor() {
      this.#name = name;
      this.#description = description;
     }
}




document.getElementById("command").value="";