# WorldQuest Implementation Plan

## Project Goal

Build a gamified educational adventure platform where players create a character, progress through story-driven chapters, answer quizzes, solve puzzles, earn XP, level up, unlock achievements, maintain daily streaks, and compete on a leaderboard.

---

# Phase 0: Project Setup

## Objective

Set up the development environment and project foundation.

## Tasks

### 0.1 Create Project

Create a new Next.js application using TypeScript.

Requirements:

* Next.js
* TypeScript
* App Router
* Tailwind CSS

### 0.2 Configure Repository

Create GitHub repository.

Structure:

```text
worldquest/
├── app/
├── components/
├── lib/
├── services/
├── types/
├── public/
├── data/
├── PRD.md
├── IMPLEMENTATION_PLAN.md
└── README.md
```

### 0.3 Configure Firebase

Create Firebase Project.

Enable:

* Authentication
* Firestore Database
* Storage

Create:

```text
lib/firebase.ts
```

Initialize Firebase.

### 0.4 Environment Variables

Create:

```text
.env.local
```

Add Firebase credentials.

Success Criteria:

* App runs locally
* Firebase connection works

---

# Phase 1: Authentication System

## Objective

Allow users to create accounts and log in.

## Tasks

### 1.1 Firebase Authentication

Implement:

* Email signup
* Email login
* Logout

Pages:

```text
/auth/signup
/auth/login
```

### 1.2 Authentication State

Create Auth Context.

Responsibilities:

* Track current user
* Persist sessions
* Protect routes

### 1.3 Route Protection

Protect:

```text
/dashboard
/adventure
/profile
/leaderboard
/puzzle-vault
```

Unauthenticated users should redirect to Login.

Success Criteria:

* User can register
* User can login
* User remains logged in after refresh

---

# Phase 2: User Profile Creation

## Objective

Create explorer character.

## Firestore Collection

```text
users
```

Document Structure:

```json
{
  "uid": "",
  "email": "",
  "characterName": "",
  "avatar": "",
  "level": 1,
  "xp": 0,
  "title": "Explorer",
  "streak": 0,
  "currentChapter": 1,
  "chaptersCompleted": [],
  "achievements": [],
  "puzzlesCompleted": []
}
```

## Tasks

### 2.1 Character Creation Page

Create:

```text
/onboarding
```

Fields:

* Character Name
* Avatar Selection

### 2.2 Save Profile

Store profile in Firestore.

Success Criteria:

* User profile created successfully
* Character displays throughout app

---

# Phase 3: Home Dashboard

## Objective

Create main navigation hub.

## Page

```text
/dashboard
```

## Components

### Player Card

Display:

* Character Name
* Avatar
* Level
* XP
* Title

### Navigation Cards

* Adventure Mode
* Puzzle Vault
* Leaderboard
* Profile

Success Criteria:

* User can navigate to all core sections

---

# Phase 4: XP & Level System

## Objective

Implement progression mechanics.

## Rules

Correct Answer:

```text
+10 XP
```

Boss Question:

```text
+25 XP
```

Puzzle Completion:

```text
+25 XP
```

Chapter Completion:

```text
+100 XP
```

## Tasks

### 4.1 XP Service

Create:

```text
services/xpService.ts
```

Functions:

* addXP()
* calculateLevel()

### 4.2 Level Thresholds

Example:

```text
Level 1 = 0 XP
Level 2 = 100 XP
Level 3 = 250 XP
Level 4 = 500 XP
Level 5 = 800 XP
```

### 4.3 Titles

```text
Level 1 → Explorer
Level 3 → Adventurer
Level 5 → World Scholar
Level 10 → Master Explorer
```

Success Criteria:

* XP updates correctly
* Level updates automatically

---

# Phase 5: Adventure Mode Foundation

## Objective

Build chapter progression system.

## Firestore Collection

```text
chapters
```

Document Example:

```json
{
  "id": 1,
  "title": "The Explorer Begins",
  "description": "",
  "storyScenes": []
}
```

## Tasks

### 5.1 Chapter Selection Screen

Page:

```text
/adventure
```

Display:

* Chapter Cards
* Locked Chapters
* Unlocked Chapters

### 5.2 Chapter Progress Tracking

Track:

* Current chapter
* Completed chapters

Success Criteria:

* Locked chapters cannot be opened
* Completing chapter unlocks next chapter

---

# Phase 6: Story Engine

## Objective

Display story-driven adventure content.

## Tasks

### 6.1 Story Scene Component

Create:

```text
components/story-scene.tsx
```

Display:

* Chapter text
* Continue button

### 6.2 Story Progression

Flow:

```text
Story
→ Question
→ Story
→ Question
→ Puzzle
→ Boss Question
→ Completion
```

Success Criteria:

* Story scenes display correctly

---

# Phase 7: Quiz System

## Objective

Create educational question engine.

## Firestore Collection

```text
questions
```

Document Example:

```json
{
  "question": "",
  "options": [],
  "correctAnswer": "",
  "category": "",
  "chapterId": 1,
  "isBoss": false
}
```

## Tasks

### 7.1 Question Component

Display:

* Question
* Four options

### 7.2 Answer Validation

Check:

* Correct answer
* Incorrect answer

### 7.3 XP Rewards

Award XP after correct answers.

Success Criteria:

* Questions load properly
* Scoring works

---

# Phase 8: Puzzle System

## Objective

Create image puzzle gameplay.

## Firestore Collection

```text
puzzles
```

Document Example:

```json
{
  "title": "",
  "imageUrl": "",
  "category": "",
  "difficulty": "easy"
}
```

## Tasks

### 8.1 Puzzle Viewer

Display image puzzle.

### 8.2 Puzzle Completion Logic

Track:

* Completed
* Not completed

### 8.3 XP Rewards

Award:

```text
+25 XP
```

Success Criteria:

* Puzzle can be solved
* Completion saved

---

# Phase 9: Puzzle Vault

## Objective

Create separate puzzle experience.

## Page

```text
/puzzle-vault
```

## Tasks

### 9.1 Category Browser

Categories:

* Famous People
* Landmarks
* Food
* Animals
* Historical Figures

### 9.2 Puzzle Library

Display:

* Locked puzzles
* Unlocked puzzles
* Completed puzzles

### 9.3 Replay System

Allow replaying completed puzzles.

Success Criteria:

* Vault functions independently from adventure

---

# Phase 10: Achievement System

## Objective

Reward player milestones.

## Firestore Collection

```text
achievements
```

Examples:

```text
First Steps
History Buff
Puzzle Master
World Scholar
```

## Tasks

### 10.1 Achievement Service

Check conditions after:

* Quiz completion
* Puzzle completion
* Level up
* Chapter completion

Success Criteria:

* Achievements unlock automatically

---

# Phase 11: Daily Streak System

## Objective

Encourage daily engagement.

## User Fields

```json
{
  "streak": 0,
  "lastLoginDate": ""
}
```

## Tasks

### 11.1 Login Tracker

Compare:

* Current Date
* Last Login Date

### 11.2 Streak Calculation

Rules:

* Consecutive day → increase streak
* Missed day → reset streak

### 11.3 Rewards

Award bonus XP.

Success Criteria:

* Streak updates correctly

---

# Phase 12: Leaderboard

## Objective

Rank players globally.

## Page

```text
/leaderboard
```

## Tasks

### 12.1 Query Top Players

Sort by:

* XP
* Level

### 12.2 Leaderboard UI

Display:

* Rank
* Character
* Level
* XP

Success Criteria:

* Rankings display correctly

---

# Phase 13: Profile Page

## Objective

Display player progress.

## Page

```text
/profile
```

Display:

* Character
* Avatar
* XP
* Level
* Achievements
* Chapters Completed
* Streak
* Puzzle Stats

Success Criteria:

* Profile reflects latest progress

---

# Phase 14: Content Population

## Objective

Add game content.

## Tasks

### Questions

Create:

```text
5 Chapters
8 Questions Each
1 Boss Question Each
```

Total:

```text
45 Questions
```

Categories:

* History
* Geography
* Famous People
* Culture
* Food
* Science
* Sports
* Entertainment

### Puzzles

Create:

```text
20-30 puzzles
```

Across all categories.

### Story Content

Write:

```text
5 Chapters
```

Each with:

* Introduction
* Progress scenes
* Completion scene

Success Criteria:

* App contains enough content for demo

---

# Phase 15: UI Polish

## Objective

Improve visual quality.

## Tasks

### Add

* Animations
* XP Popups
* Achievement Notifications
* Loading States
* Empty States

### Improve

* Mobile responsiveness
* Accessibility
* Navigation

Success Criteria:

* App feels polished

---

# Phase 16: Testing & Deployment

## Objective

Prepare hackathon submission.

## Tasks

### Functional Testing

Verify:

* Authentication
* XP
* Levels
* Chapters
* Questions
* Puzzles
* Achievements
* Leaderboard
* Streaks

### Bug Fixing

Resolve:

* UI bugs
* Data bugs
* Progress issues

### Deployment

Deploy to:

* Vercel

### Final Deliverables

* GitHub Repository
* Live URL
* README
* Demo Script

Success Criteria:

* Complete playable MVP
* Ready for hackathon judging
