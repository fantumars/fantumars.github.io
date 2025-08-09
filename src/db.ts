
import Dexie, { Table } from 'dexie'

export type User = {
  id: string
  bodyweight_lb: number
  height_in?: number
  sex?: 'M'|'F'|'Other'
  goal: 'Strength+Hypertrophy'
  split: 'FullBody-Upper-Lower'
  diet_status: 'Deficit'|'Maintenance'|'Surplus'|'Unknown'
  created_at: string
}

export type Exercise = {
  id: string
  name: string
  category: 'Compound'|'Accessory'|'Isolation'
  pattern: 'Squat'|'Hinge'|'HorizontalPress'|'VerticalPress'|'HorizontalPull'|'VerticalPull'|'SingleLeg'|'Core'|'Machine'|'Other'
  equipment: 'Barbell'|'Dumbbell'|'Machine'|'Cable'|'Bodyweight'|'Band'
  default_rep_low: number
  default_rep_high: number
  movement_factor: number
}

export type Workout = {
  id: string
  date: string // ISO
  type: 'FullBody'|'Upper'|'Lower'
  notes?: string
  calories: number
}

export type WorkoutExercise = {
  id: string
  workout_id: string
  exercise_id: string
  target_sets: number
  target_rep_low: number
  target_rep_high: number
  target_load_lb?: number
  order_index: number
}

export type SetRow = {
  id: string
  workout_exercise_id: string
  set_number: number
  reps: number
  load_lb: number
  rpe: number
  duration_s?: number
}

export type Recommendation = {
  id: string
  date: string
  workout_type: 'FullBody'|'Upper'|'Lower'
  payload: Array<{exercise_id:string, sets:number, rep_low:number, rep_high:number, target_load_lb?:number}>
}

export type Param = {
  key: string
  value: any
}

class AppDB extends Dexie {
  users!: Table<User, string>
  exercises!: Table<Exercise, string>
  workouts!: Table<Workout, string>
  workout_exercises!: Table<WorkoutExercise, string>
  sets!: Table<SetRow, string>
  recommendations!: Table<Recommendation, string>
  params!: Table<Param, string>

  constructor() {
    super('lift_db')
    this.version(1).stores({
      users: 'id',
      exercises: 'id, pattern, equipment',
      workouts: 'id, date, type',
      workout_exercises: 'id, workout_id, exercise_id, order_index',
      sets: 'id, workout_exercise_id',
      recommendations: 'id, date, workout_type',
      params: 'key'
    })
  }
}

export const db = new AppDB()
