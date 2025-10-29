import type { ServiceDependencies } from '@/lib/container/types';
import { households } from '@/modules/households/schema';

type Household = typeof households.$inferSelect;

export class HouseholdService {
  constructor(private deps: ServiceDependencies) {}

  private get logger() {
    return this.deps.logger.child({ service: 'HouseholdService' });
  }

  public async createHousehold(name: string, mealPreferences?: string): Promise<Household> {
    this.logger.info('Creating household', {
      operation: 'createHousehold',
      name,
      hasMealPreferences: !!mealPreferences,
    });

    try {
      const values: {
        name: string;
        mealPreferences?: string;
      } = {
        name,
      };

      if (mealPreferences) {
        values.mealPreferences = mealPreferences;
      }

      const [newHousehold] = await this.deps.db.insert(households).values(values).returning();

      this.logger.info('Household created successfully', {
        operation: 'createHousehold',
        householdId: newHousehold.id,
        name: newHousehold.name,
      });

      return newHousehold;
    } catch (error) {
      this.logger.error('Failed to create household', {
        error,
        operation: 'createHousehold',
        name,
      });
      throw error;
    }
  }
}
