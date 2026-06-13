# WorldQuest PRD

## Overview

WorldQuest is a gamified educational adventure platform that transforms learning into an exciting journey. Players create their own explorer character and travel through story-driven chapters filled with world knowledge, quizzes, puzzles, achievements, and progression systems.

The game combines education and entertainment by allowing players to earn XP, level up, unlock chapters, solve puzzles, maintain streaks, and compete on leaderboards while exploring topics from history, geography, culture, science, sports, famous people, and more.

---

# Problem Statement

Many educational platforms rely on memorization and passive learning, causing learners to lose interest quickly.

WorldQuest addresses this problem by turning learning into an interactive adventure where players actively engage with knowledge through storytelling, progression, puzzles, and rewards.

---

# Target Audience

* Students
* Trivia enthusiasts
* Lifelong learners
* Casual gamers
* Anyone interested in world knowledge

---

# Goals

* Make learning fun and engaging
* Encourage exploration and curiosity
* Reward consistent participation
* Create a memorable educational gaming experience
* Combine education and entertainment

---

# Core Gameplay Loop

```text
Create Character
↓
Enter Adventure
↓
Read Story
↓
Answer Questions
↓
Solve Puzzle
↓
Earn XP
↓
Unlock Achievements
↓
Unlock New Chapters
↓
Level Up
↓
Become a World Scholar
```

---

# MVP Features

## 1. Authentication

### Features

* Sign Up
* Login
* Logout

### Purpose

Authentication allows players to save:

* Character
* XP
* Levels
* Achievements
* Chapter Progress
* Puzzle Progress
* Daily Streaks
* Leaderboard Rankings

---

## 2. Character Creation

### Features

* Character Name
* Avatar Selection

### Acceptance Criteria

* Character information is saved
* Character appears throughout gameplay

---

## 3. Adventure Mode

### Description

The primary game mode where players progress through story-driven chapters.

### Chapter Flow

```text
Story Scene
↓
Question
↓
Story Scene
↓
Question
↓
Puzzle Challenge
↓
Boss Question
↓
Chapter Completion
```

### Acceptance Criteria

* Players can access unlocked chapters
* Progress is saved
* Story scenes display correctly

---

## 4. Story Premise

The World Archive has lost five Knowledge Crystals that preserve humanity's knowledge.

Players become explorers tasked with recovering the crystals by completing challenges across history, geography, science, culture, food, entertainment, sports, and famous world events.

Each completed chapter restores one Knowledge Crystal.

The ultimate goal is to become a World Scholar and restore the World Archive.

---

## 5. Chapters

### Chapter 1 — The Explorer Begins

### Chapter 2 — Ancient Worlds

### Chapter 3 — Legends & Leaders

### Chapter 4 — Culture & Traditions

### Chapter 5 — The World Challenge

### Structure Per Chapter

* Story Content
* 8 Standard Questions
* 1 Puzzle Challenge
* 1 Boss Question

---

## 6. Quiz System

### Categories

* Geography
* History
* Famous People
* Politics
* Culture
* Food
* Science
* Technology
* Sports
* Entertainment
* Languages
* World Records & Facts

### Format

* Multiple Choice
* Four Options
* One Correct Answer

### Rewards

* Correct Answer = +10 XP
* Boss Question = +25 XP

---

## 7. Puzzle Challenges

### Description

Puzzle challenges are integrated into Adventure Mode.

Players complete image-based puzzles to continue their journey.

### Categories

* Famous People
* Landmarks
* Food
* Cultural Symbols
* Historical Figures

### Reward

* Puzzle Completion = +25 XP

---

## 8. Puzzle Vault

### Description

The Puzzle Vault is a separate game mode containing additional puzzles beyond those found in Adventure Mode.

Players can unlock, complete, and replay puzzles to earn extra XP and achievements.

### Categories

* Famous People
* Landmarks
* Food
* Animals
* Cultural Symbols
* Historical Figures

### Features

* Unlock New Puzzles
* Replay Completed Puzzles
* Earn Bonus XP
* Track Completion Progress

### Purpose

Provides additional gameplay outside the main story and encourages continued engagement.

---

## 9. XP System

### Rewards

* Correct Answer = +10 XP
* Boss Question = +25 XP
* Puzzle Completion = +25 XP
* Chapter Completion = +100 XP
* Daily Streak Bonus = Variable

---

## 10. Level System

### Titles

| Level | Title           |
| ----- | --------------- |
| 1     | Explorer        |
| 3     | Adventurer      |
| 5     | World Scholar   |
| 10    | Master Explorer |

---

## 11. Chapter Unlocking

### Rules

* Chapter 1 is available by default
* Completing a chapter unlocks the next chapter

---

## 12. Achievements

### Examples

* 🌍 First Steps — Complete Chapter 1
* 🏛 History Buff — Answer 10 History Questions Correctly
* 🧩 Puzzle Master — Complete 10 Puzzles
* 🍜 Food Explorer — Complete Chapter 4
* 🏅 World Scholar — Reach Level 5

---

## 13. Daily Streak System

### Example Rewards

* Day 1 = +10 XP
* Day 2 = +20 XP
* Day 3 = +30 XP
* Day 7 = Special Achievement

### Rules

* Consecutive logins increase streak count
* Missing a day resets the streak

---

## 14. Leaderboard

### Ranking Factors

* XP
* Level
* Chapters Completed

---

## 15. Profile Page

### Displays

* Character Name
* Avatar
* Level
* XP
* Achievements
* Chapters Completed
* Puzzle Progress
* Daily Streak
* Rank

---

# Technical Requirements

## Frontend

* Next.js
* TypeScript
* Tailwind CSS

## Backend Services

* Firebase Authentication
* Cloud Firestore
* Firebase Storage

## Deployment

* Vercel or Firebase Hosting

## Development Tools

* Firebase Studio (IDX)
* GitHub

---

# Future Enhancements

* Multiplayer Quiz Rooms
* Language Learning Module
* Translator Feature
* Additional Chapters
* Character Customization Expansion
* AI-Generated Questions
* Mobile Application
* Daily Challenges
* Seasonal Events
* Guilds / Teams

---

# Success Criteria

A player should be able to:

1. Create an account
2. Create a character
3. Start Chapter 1
4. Progress through the story
5. Answer questions
6. Complete puzzles
7. Earn XP
8. Level up
9. Unlock achievements
10. Maintain a streak
11. Access the Puzzle Vault
12. Unlock chapters
13. Appear on the leaderboard
14. Complete the WorldQuest adventure
