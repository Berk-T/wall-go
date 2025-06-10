# 🧱 Wall Go

A web-based implementation of the **Wall Go** game, inspired by its appearance in **_The Devil’s Plan (데블스 플랜)_**. Built with **React** and **Tailwind CSS** for a responsive and engaging gameplay experience.

---

## 🎮 Gameplay

Wall Go is a two-player strategic territory control game. Players alternate turns to move pucks and place walls on a 7x7 board. The goal is to block the opponent’s movement and claim the majority of the board.

---

## 📏 Rules

1. **🎯 Objective**  
   Win by either:

   - Claiming **25 or more tiles**, or
   - **Trapping** all of your opponent’s pucks so they cannot move.

2. **🧊 Initial Placement Phase**

   - Each player starts with **2 pucks** already placed.
   - Players then take turns placing **2 additional pucks**, for a total of **4** per player.
   - After placement, the game enters the main turn-based phase.

3. **🔁 Turn Structure**  
   On your turn:

   - **Move** one of your pucks up to **2 tiles** (orthogonally, no diagonals).
     - Pucks cannot move through walls or other pucks.
     - You may end on the same tile you started.
   - **Place a wall** in an **empty** wall slot adjacent to the tile your puck landed on.
     - Walls cannot be placed over existing ones or on the outer perimeter.

4. **🧮 Scoring**

   - An enclosed area is considered "controlled" if all pucks within it belong to the same player.
   - The player gains **points equal to the number of tiles** in that area.
   - Points are **lost** if the opponent later breaks control of the area.

5. **🏁 Game End Conditions**  
   The game ends when:
   - A player **controls at least 25 tiles** → they win.
   - A player **cannot move any of their pucks** → their opponent wins.

---

## 🚀 Getting Started

To run the game locally:

```bash
git clone https://github.com/Berk-T/wall-go.git
cd wall-go
npm install
npm run dev
```
