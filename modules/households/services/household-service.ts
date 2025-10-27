import type { ServiceDependencies } from '@/lib/container/types';
import type { households } from '@/modules/households/schema';

type Household = typeof households.$inferSelect;

export class HouseholdService {
  constructor(private deps: ServiceDependencies) {}

  public async createHousehold(name: string, mealPreferences: string): Promise<Household> {
    // TODO: Implement logic
    throw new Error('Not implemented');
  }
}
