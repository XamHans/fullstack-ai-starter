import type { ServiceDependencies } from '@/lib/container/types';
import type { habits } from '@/modules/habits/schema';

type Habit = typeof habits.$inferSelect;

export class HabitService {
  constructor(private deps: ServiceDependencies) {}

  public async defineHabits(
    userId: string,
    habitsToDefine: { name: string; order: number }[],
  ): Promise<Habit[]> {
    // TODO: Implement logic
    throw new Error('Not implemented');
  }
}
