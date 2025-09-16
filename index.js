function startGame() {
    document.getElementById("intro").classList.add("hidden");
    document.getElementById("game").classList.remove("hidden");
}

function handleComand() {
    document.getElementById("game").
}

class Room {
    #entrance;
    #exam1;
    #exam2;
    #exam3;
    #exam4;
     
    constructor(entrance, exam1, exam2, exam3, exam4) {
      this.#entrance = entrance;
      this.#exam1 = exam1;
      this.#exam2 = exam2;
      this.#exam3 = exam3;
      this.#exam4 = exam4;
    
    }

}

let currentRoom = "entrance";
let timeRemaining = 300;

class Character {
    #student;
    #nurse;
    #ProfessorNeamah;
    #patients;

    constructor(student, nurse, ProfessorNeamah, patients) {
        this.#student = student;
        this.#nurse = nurse;
        this.#ProfessorNeamah = ProfessorNeamah;
        this.#patients = patients;
    }
}