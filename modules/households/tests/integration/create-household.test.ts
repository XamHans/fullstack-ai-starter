import supertest from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { app } from '@/lib/api/app';
import { container } from '@/lib/container';
import { HouseholdService } from '@/modules/households/services/household-service';
import { testDb } from '../../../../tests/helpers/db';
import { households } from '../../schema';

const api = supertest(app);

describe('POST /api/households', () => {
  let householdService: HouseholdService;

  beforeAll(async () => {
    await testDb.connect();
    householdService = container.resolve(HouseholdService);
  });

  afterAll(async () => {
    await testDb.cleanup();
  });

  it('should create a new household and return it', async () => {
    const response = await api.post('/api/households').send({
      name: 'The Sanctuary',
      preferences: 'Vegan, gluten-free',
    });

    expect(response.status).toBe(201);
    expect(response.body.data).toEqual(
      expect.objectContaining({
        name: 'The Sanctuary',
        preferences: 'Vegan, gluten-free',
      }),
    );

    const dbHousehold = await testDb.db
      .select()
      .from(households)
      .where({ id: response.body.data.id })
      .get();

    expect(dbHousehold).toBeDefined();
    expect(dbHousehold?.name).toBe('The Sanctuary');
  });
});
