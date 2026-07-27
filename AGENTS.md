# AGENTS.md

## Project Context
- **Name:** SCATTER (Calendar Tracker)
- **Tech Stack:** React, Tailwind CSS, Firebase SDK (v10+)
- **Database:** Cloud Firestore (Spark no-cost plan)

## Coding Conventions
- Use React functional components.
- Store database helper methods in `src/services/calendarService.js`.
- Ensure offline queries are fully supported.

## Test Instructions
- Run unit tests with `npm test`.
- Do not mock Firestore completely; use the Firebase Local Emulator Suite if tests need to run against a real database environment.
