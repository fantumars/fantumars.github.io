export const seedExercises = [
  {
    "id": "bb_back_squat_high",
    "name": "Back Squat (High Bar)",
    "category": "Compound",
    "pattern": "Squat",
    "equipment": "Barbell",
    "default_rep_low": 3,
    "default_rep_high": 6,
    "movement_factor": 1.3
  },
  {
    "id": "bb_front_squat",
    "name": "Front Squat",
    "category": "Compound",
    "pattern": "Squat",
    "equipment": "Barbell",
    "default_rep_low": 3,
    "default_rep_high": 6,
    "movement_factor": 1.3
  },
  {
    "id": "bb_deadlift_conv",
    "name": "Deadlift (Conventional)",
    "category": "Compound",
    "pattern": "Hinge",
    "equipment": "Barbell",
    "default_rep_low": 3,
    "default_rep_high": 6,
    "movement_factor": 1.3
  },
  {
    "id": "bb_deadlift_sum",
    "name": "Deadlift (Sumo)",
    "category": "Compound",
    "pattern": "Hinge",
    "equipment": "Barbell",
    "default_rep_low": 3,
    "default_rep_high": 6,
    "movement_factor": 1.3
  },
  {
    "id": "bb_bench_flat",
    "name": "Bench Press (Flat)",
    "category": "Compound",
    "pattern": "HorizontalPress",
    "equipment": "Barbell",
    "default_rep_low": 3,
    "default_rep_high": 6,
    "movement_factor": 1.1
  },
  {
    "id": "bb_ohp",
    "name": "Overhead Press",
    "category": "Compound",
    "pattern": "VerticalPress",
    "equipment": "Barbell",
    "default_rep_low": 3,
    "default_rep_high": 6,
    "movement_factor": 1.1
  },
  {
    "id": "bb_row",
    "name": "Barbell Row",
    "category": "Compound",
    "pattern": "HorizontalPull",
    "equipment": "Barbell",
    "default_rep_low": 5,
    "default_rep_high": 8,
    "movement_factor": 1.1
  },
  {
    "id": "db_bench_flat",
    "name": "DB Bench (Flat)",
    "category": "Accessory",
    "pattern": "HorizontalPress",
    "equipment": "Dumbbell",
    "default_rep_low": 6,
    "default_rep_high": 10,
    "movement_factor": 1.15
  },
  {
    "id": "db_incline",
    "name": "DB Bench (Incline)",
    "category": "Accessory",
    "pattern": "HorizontalPress",
    "equipment": "Dumbbell",
    "default_rep_low": 6,
    "default_rep_high": 10,
    "movement_factor": 1.15
  },
  {
    "id": "db_row",
    "name": "DB Row",
    "category": "Accessory",
    "pattern": "HorizontalPull",
    "equipment": "Dumbbell",
    "default_rep_low": 6,
    "default_rep_high": 10,
    "movement_factor": 1.15
  },
  {
    "id": "db_shoulder_press",
    "name": "DB Shoulder Press",
    "category": "Accessory",
    "pattern": "VerticalPress",
    "equipment": "Dumbbell",
    "default_rep_low": 6,
    "default_rep_high": 10,
    "movement_factor": 1.15
  },
  {
    "id": "mach_leg_press",
    "name": "Leg Press (Machine)",
    "category": "Machine",
    "pattern": "Machine",
    "equipment": "Machine",
    "default_rep_low": 8,
    "default_rep_high": 12,
    "movement_factor": 0.95
  },
  {
    "id": "mach_leg_curl",
    "name": "Leg Curl (Machine)",
    "category": "Isolation",
    "pattern": "Machine",
    "equipment": "Machine",
    "default_rep_low": 10,
    "default_rep_high": 15,
    "movement_factor": 0.7
  },
  {
    "id": "mach_leg_ext",
    "name": "Leg Extension (Machine)",
    "category": "Isolation",
    "pattern": "Machine",
    "equipment": "Machine",
    "default_rep_low": 10,
    "default_rep_high": 15,
    "movement_factor": 0.7
  },
  {
    "id": "cable_lat_pulldown",
    "name": "Lat Pulldown (Cable)",
    "category": "Accessory",
    "pattern": "VerticalPull",
    "equipment": "Cable",
    "default_rep_low": 6,
    "default_rep_high": 10,
    "movement_factor": 0.95
  },
  {
    "id": "cable_row",
    "name": "Seated Cable Row",
    "category": "Accessory",
    "pattern": "HorizontalPull",
    "equipment": "Cable",
    "default_rep_low": 6,
    "default_rep_high": 10,
    "movement_factor": 0.95
  },
  {
    "id": "cable_lateral_raise",
    "name": "Cable Lateral Raise",
    "category": "Isolation",
    "pattern": "Other",
    "equipment": "Cable",
    "default_rep_low": 12,
    "default_rep_high": 15,
    "movement_factor": 0.7
  },
  {
    "id": "bw_pullup",
    "name": "Pull-up (Weighted if needed)",
    "category": "Accessory",
    "pattern": "VerticalPull",
    "equipment": "Bodyweight",
    "default_rep_low": 5,
    "default_rep_high": 8,
    "movement_factor": 0.85
  },
  {
    "id": "bw_dip",
    "name": "Dip (Weighted if needed)",
    "category": "Accessory",
    "pattern": "HorizontalPress",
    "equipment": "Bodyweight",
    "default_rep_low": 5,
    "default_rep_high": 8,
    "movement_factor": 0.85
  },
  {
    "id": "core_hanging_leg_raise",
    "name": "Hanging Leg Raise",
    "category": "Isolation",
    "pattern": "Core",
    "equipment": "Bodyweight",
    "default_rep_low": 10,
    "default_rep_high": 15,
    "movement_factor": 0.7
  }
] as const;
