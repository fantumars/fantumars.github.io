
# Lift — Strength & Hypertrophy (PWA)

Minimal, Apple-style mobile web app for logging workouts with RPE, a recommendation engine (FullBody → Upper → Lower), and a Set Work calorie model.

## Tech
- React + TypeScript + Vite
- Zustand (state)
- Dexie (IndexedDB)
- PWA (install to home screen)

## Run locally
```bash
npm install
npm run dev
```
Open http://localhost:5173 on your phone or desktop.

## Build
```bash
npm run build
npm run preview
```

## Notes
- Data is stored locally in your browser (IndexedDB).
- First launch seeds a common exercise library and default parameters.
- Recommendation engine rotates FullBody → Upper → Lower, adapts for long gaps (DSL), and uses last performance to set target loads.
- Calories are computed from total work (load × reps × movement_factor × coeff).
- Adjust coefficient later in `params` if you want to calibrate to a wearable.
