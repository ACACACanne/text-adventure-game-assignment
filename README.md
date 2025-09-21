Project Overview
The Haunted Academy: Text Adventure Game

A modular, immersive JavaScript game built for web — where logic, fear, and curiosity collide.
------------------------------------------------------------------------------------------------------------------------------------------

Overview
You awaken in the central hall of a cursed academy. Each room holds cryptic clues, eerie NPCs, and items essential to your survival. Navigate the halls, collect keys, and face the final judgment of Professor Neamah. Will you graduate... or be consumed by the shadows?

![The Architechture](assets/pictures/visual%20architecture%20.png)

Features
• 	Modular Room System: Each room has its own character, item, weapon, exits, and soundtrack.
• 	Dynamic Command Handling: Supports intuitive commands like , , , , , , and more.
• 	Inventory & Weapon Tracking: Collect up to 7 items and 7 weapons, including 3 essential keys.
• 	Panic & Stealth Mechanics: Time pressure and emotional states affect gameplay outcomes.
• 	Victory Condition: Present all three keys in the final room to graduate and win the game.
• 	Atmospheric Audio: Each room triggers a unique background track and optional sound effects.
• 	Responsive UI: Real-time updates to inventory, status, and room descriptions.

Recent Fixes & Enhancements
• 	✅ Fixed  command: Now works whether the item is hidden or visible.
• 	✅ Unified  and  logic for intuitive gameplay.
• 	✅ Victory condition added: Entering the professor’s room with all three keys now triggers a win message.
• 	✅ Global function exposure: , , and others now work with HTML buttons.
• 	✅ Event listener refactor: Replaced inline  with clean JavaScript bindings.
• 	✅ Improved UI feedback: Clearer status updates and dynamic room overlays.

Commands You Can Use:
go [direction]         → Move to another room
take item              → Pick up visible item
take key               → Pick up key item
take weapon            → Equip weapon
fight                  → Engage hostile NPC
hide / run / panic     → Escape or react
use [item]             → Activate item effect
equip [weapon]         → Ready a weapon
check [location]       → Search for hidden items
talk to [character]    → Speak with NPC
check inventory        → View items and weapons
status                 → View panic, stealth, and time
help / where am I      → Get room info
reset game / exit game → Restart or quit

Technologies Used
• 	HTML, CSS, JavaScript
• 	Object-Oriented Programming (OOP)
• 	DOM manipulation
• 	Modular architecture
• 	Audio API for music and sound effects


How to Play
https://acacacanne.github.io/text-adventure-game-assignment/

Click “Enter if you dare!” to begin.
Type commands in the input field and press Go.
Explore, collect, survive — and graduate.


 Credits:
 Created by Aniko — MSc Computer Science student at University of York & Developer Academy bootcamp graduate. Inspired by atmospheric horror, ethical design, and interactive storytelling.
 
 License:
 MIT License

