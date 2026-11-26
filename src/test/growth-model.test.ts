import { describe, expect, it } from 'vitest';
import { SIMULATOR_PRESETS, SEED_EXPERIMENTS } from '@/data/mock';
import { simulate, experimentRecommendation } from '@/lib/calculations';
describe('Growth planning',()=>{
 it('matches all three documented scenarios',()=>{expect(simulate(SIMULATOR_PRESETS.Conservative).projectedCollection).toBeCloseTo(1260000);expect(simulate(SIMULATOR_PRESETS.Base).projectedCollection).toBeCloseTo(2400000);expect(simulate(SIMULATOR_PRESETS.Stretch).projectedCollection).toBeCloseTo(3564000)});
 it('reserves 20000 from 150000',()=>expect(SEED_EXPERIMENTS.reduce((s,e)=>s+e.budget,0)).toBe(130000));
 it('requires evidence before scaling',()=>SEED_EXPERIMENTS.forEach(e=>expect(experimentRecommendation(e)).toBe('Insufficient Data')));
});
