
import { create } from 'zustand'
import { db, type User, type Exercise, type Workout, type WorkoutExercise, type SetRow, type Recommendation, type Param } from './db'
import { seedExercises } from './seed/exercises'
import { defaultParams } from './seed/params'
import { uid, todayISO } from './util'

type State = {
  ready: boolean
  user?: User
  params: Record<string, any>
  init: () => Promise<void>
  saveUser: (u: Partial<User>) => Promise<void>
  addWorkout: (w: Omit<Workout,'id'|'calories'>, exercises: Array<Omit<WorkoutExercise,'id'|'workout_id'|'order_index'> & {sets: Array<Omit<SetRow,'id'|'workout_exercise_id'>>}>) => Promise<string>
}

export const useStore = create<State>((set, get) => ({
  ready: false,
  params: {},
  init: async () => {
    // Seed params and exercises if empty
    const exCount = await db.exercises.count()
    if (exCount === 0) {
      await db.exercises.bulkAdd(seedExercises.map(e => ({...e} as Exercise)))
    }
    const pCount = await db.params.count()
    if (pCount === 0) {
      await db.params.bulkAdd(Object.entries(defaultParams).map(([k,v]) => ({key:k, value:v}) as Param))
    }
    const user = await db.users.get('me')
    const paramsArr = await db.params.toArray()
    const params = Object.fromEntries(paramsArr.map(p => [p.key, p.value]))
    set({ ready: true, user, params })
  },
  saveUser: async (u) => {
    const existing = await db.users.get('me')
    const user: User = {
      id: 'me',
      bodyweight_lb: u.bodyweight_lb ?? existing?.bodyweight_lb ?? 205,
      height_in: u.height_in ?? existing?.height_in,
      sex: u.sex ?? existing?.sex ?? 'M',
      goal: 'Strength+Hypertrophy',
      split: 'FullBody-Upper-Lower',
      diet_status: u['diet_status' as keyof User] as any ?? existing?.diet_status ?? 'Maintenance',
      created_at: existing?.created_at ?? new Date().toISOString()
    }
    await db.users.put(user)
    const paramsArr = await db.params.toArray()
    const params = Object.fromEntries(paramsArr.map(p => [p.key, p.value]))
    set({ user, params })
  },
  addWorkout: async (w, exBlocks) => {
    const id = uid()
    await db.workouts.add({ id, ...w, calories: 0 })
    let allSets: Array<{load_lb:number,reps:number,exercise_id:string}> = []
    for (let i=0;i<exBlocks.length;i++) {
      const block = exBlocks[i]
      const wexId = uid()
      await db.workout_exercises.add({
        id: wexId,
        workout_id: id,
        exercise_id: block.exercise_id,
        target_sets: block.target_sets,
        target_rep_low: block.target_rep_low,
        target_rep_high: block.target_rep_high,
        target_load_lb: block.target_load_lb,
        order_index: i
      })
      for (let s=0;s<block.sets.length;s++) {
        const setRow = block.sets[s]
        await db.sets.add({ id: uid(), workout_exercise_id: wexId, set_number: s+1, ...setRow })
        allSets.push({ load_lb: setRow.load_lb, reps: setRow.reps, exercise_id: block.exercise_id })
      }
    }
    // compute calories after inserts
    const exMap = new Map((await db.exercises.toArray()).map(e => [e.id, e]))
    const coeffParam = await db.params.get('conversion_coeff')
    const coeff = coeffParam?.value ?? 0.0052
    const totalWork = allSets.reduce((acc, s) => {
      const ex = exMap.get(s.exercise_id)!
      return acc + s.load_lb * s.reps * ex.movement_factor
    }, 0)
    const calories = Math.round(totalWork * coeff)
    await db.workouts.update(id, { calories })
    return id
  },
}))
