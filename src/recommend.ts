
import { db, type Workout, type WorkoutExercise, type SetRow, type Exercise } from './db'
import { todayISO, daysBetween } from './util'

type PlanItem = { exercise_id: string, sets: number, rep_low: number, rep_high: number, target_load_lb?: number }
export type NextPlan = { workout_type: 'FullBody'|'Upper'|'Lower', plan: PlanItem[] }

const rotateType = (t?: 'FullBody'|'Upper'|'Lower'): 'FullBody'|'Upper'|'Lower' => {
  if (!t) return 'FullBody'
  if (t === 'FullBody') return 'Upper'
  if (t === 'Upper') return 'Lower'
  return 'FullBody'
}

const defaultSets = (ex: Exercise, wt: NextPlan['workout_type']) => {
  const isCompound = ex.category === 'Compound'
  if (wt === 'FullBody') return isCompound ? 4 : 3
  if (wt === 'Upper') return ex.pattern.includes('Pull') || ex.pattern.includes('Press') ? 4 : 3
  return isCompound ? 4 : 3
}

const defaultRange = (ex: Exercise): [number, number] => [ex.default_rep_low, ex.default_rep_high]

const bumpLoad = (ex: Exercise, load: number): number => {
  // Simple bumps respecting equipment
  if (ex.equipment === 'Barbell') {
    if (ex.pattern === 'Squat' || ex.pattern === 'Hinge') return load + 10
    return load + 5
  }
  if (ex.equipment === 'Dumbbell' || ex.equipment === 'Machine' || ex.equipment === 'Cable') return load + 5
  return load + 5
}

async function lastSession(): Promise<Workout | undefined> {
  return (await db.workouts.orderBy('date').reverse().first()) ?? undefined
}

async function lastType(): Promise<'FullBody'|'Upper'|'Lower'|undefined> {
  const l = await lastSession()
  return l?.type
}

async function lastPerformance(exId: string): Promise<{avgTopSetRPE:number, topSetLoad:number, hitTopRange:boolean}|undefined> {
  const w = await db.workouts.orderBy('date').reverse().first()
  if (!w) return undefined
  const wes = await db.workout_exercises.where({ workout_id: w.id }).toArray()
  const target = wes.find(wex => wex.exercise_id === exId)
  if (!target) return undefined
  const sets = await db.sets.where({ workout_exercise_id: target.id }).toArray()
  if (!sets.length) return undefined
  const top = sets.reduce((a,b) => (a.load_lb*b.reps > b.load_lb*a.reps ? a : b))
  const avgRPE = sets.reduce((acc,s)=>acc+s.rpe,0)/sets.length
  const hitTop = sets.filter(s => s.reps >= (target.target_rep_high || 0)).length >= 2
  return { avgTopSetRPE: avgRPE, topSetLoad: top.load_lb, hitTopRange: hitTop }
}

export async function recommendNext(): Promise<NextPlan> {
  const exMap = new Map((await db.exercises.toArray()).map(e=>[e.id,e]))
  const last = await lastSession()
  const dsl = last ? daysBetween(todayISO(), last.date) : 999
  const wt = rotateType(last?.type as any)
  const reEntry = dsl >= 7
  const mild = dsl >= 3 && dsl <= 6

  // Base template per type
  const templateIds: Record<typeof wt, string[]> = {
    FullBody: ['bb_back_squat_high','bb_bench_flat','bb_row','mach_leg_curl','cable_lateral_raise'],
    Upper: ['bb_bench_flat','bb_ohp','cable_lat_pulldown','cable_row','db_incline'],
    Lower: ['bb_back_squat_high','bb_deadlift_conv','mach_leg_press','mach_leg_ext']
  } as const

  const plan: PlanItem[] = []
  for (const id of templateIds[wt]) {
    const ex = exMap.get(id)!
    const [lo, hi] = defaultRange(ex)
    let sets = defaultSets(ex, wt)
    let target = 0
    const perf = await lastPerformance(id)

    if (perf && perf.topSetLoad) target = perf.topSetLoad
    // Mild gap / re-entry adjustments
    if (reEntry && target) target = Math.round(target * 0.95)
    else if (mild && target) target = Math.round(target * 0.975)

    // Progression / backoff gating
    if (perf?.hitTopRange && perf.avgTopSetRPE <= 9 && target) {
      target = bumpLoad(ex, target)
    } else if (perf && perf.avgTopSetRPE >= 9.5 && target) {
      target = Math.round(target * 0.975)
    }

    if (reEntry) sets = Math.max(2, sets - 1)

    plan.push({ exercise_id: id, sets, rep_low: lo, rep_high: hi, target_load_lb: target || undefined })
  }

  return { workout_type: wt, plan }
}
