import { eq } from 'drizzle-orm';
import type { ServiceDependencies } from '@/lib/container/types';
import { specs } from '../schema';
import type { Spec, SpecStatus } from '../types';

export class WorkflowService {
  constructor(private deps: ServiceDependencies) {}

  private get logger() {
    return this.deps.logger.child({ service: 'WorkflowService' });
  }

  /**
   * Create a new spec in the database
   */
  async createSpec(data: {
    title: string;
    domain: string;
    filePath: string;
    status: SpecStatus;
    scenarioCount: number;
    content?: string;
  }): Promise<Spec> {
    this.logger.info('Creating new spec', {
      operation: 'createSpec',
      title: data.title,
      domain: data.domain,
      status: data.status,
    });

    try {
      const [spec] = await this.deps.db
        .insert(specs)
        .values({
          title: data.title,
          domain: data.domain,
          filePath: data.filePath,
          status: data.status,
          scenarioCount: data.scenarioCount,
          content: data.content,
        })
        .returning();

      this.logger.info('Spec created successfully', {
        operation: 'createSpec',
        specId: spec.id,
        title: data.title,
      });

      return spec;
    } catch (error) {
      this.logger.error('Failed to create spec', {
        error: error instanceof Error ? error : new Error(String(error)),
        context: {
          operation: 'createSpec',
          title: data.title,
        },
      });
      throw error;
    }
  }

  /**
   * Get all specs from the database
   */
  async getAllSpecs(): Promise<Spec[]> {
    this.logger.debug('Retrieving all specs', {
      operation: 'getAllSpecs',
    });

    try {
      const result = await this.deps.db.select().from(specs);

      this.logger.debug('Specs retrieved successfully', {
        operation: 'getAllSpecs',
        count: result.length,
      });

      return result;
    } catch (error) {
      this.logger.error('Failed to retrieve specs', {
        error: error instanceof Error ? error : new Error(String(error)),
        context: {
          operation: 'getAllSpecs',
        },
      });
      throw error;
    }
  }

  /**
   * Get specs organized by status
   */
  async getSpecsByStatus(): Promise<Record<SpecStatus, Spec[]>> {
    this.logger.debug('Retrieving specs by status', {
      operation: 'getSpecsByStatus',
    });

    try {
      const allSpecs = await this.getAllSpecs();

      const grouped = {
        pending: allSpecs.filter((s) => s.status === 'pending'),
        'in-progress': allSpecs.filter((s) => s.status === 'in-progress'),
        completed: allSpecs.filter((s) => s.status === 'completed'),
      };

      this.logger.debug('Specs grouped by status', {
        operation: 'getSpecsByStatus',
        pending: grouped.pending.length,
        inProgress: grouped['in-progress'].length,
        completed: grouped.completed.length,
      });

      return grouped;
    } catch (error) {
      this.logger.error('Failed to group specs by status', {
        error: error instanceof Error ? error : new Error(String(error)),
        context: {
          operation: 'getSpecsByStatus',
        },
      });
      throw error;
    }
  }

  /**
   * Get a spec by ID
   */
  async getSpecById(id: string): Promise<Spec | undefined> {
    this.logger.debug('Retrieving spec by ID', {
      operation: 'getSpecById',
      specId: id,
    });

    try {
      const [spec] = await this.deps.db.select().from(specs).where(eq(specs.id, id));

      this.logger.debug(spec ? 'Spec found' : 'Spec not found', {
        operation: 'getSpecById',
        specId: id,
        found: !!spec,
      });

      return spec;
    } catch (error) {
      this.logger.error('Failed to retrieve spec by ID', {
        error: error instanceof Error ? error : new Error(String(error)),
        context: {
          operation: 'getSpecById',
          specId: id,
        },
      });
      throw error;
    }
  }

  /**
   * Update spec status with validation
   */
  async updateSpecStatus(id: string, newStatus: SpecStatus): Promise<Spec> {
    this.logger.info('Updating spec status', {
      operation: 'updateSpecStatus',
      specId: id,
      newStatus,
    });

    try {
      // Get current spec
      const currentSpec = await this.getSpecById(id);
      if (!currentSpec) {
        throw new Error(`Spec with ID ${id} not found`);
      }

      // Validate status transition
      if (currentSpec.status === 'completed' && newStatus === 'pending') {
        throw new Error('Cannot move completed specs back to pending');
      }

      // Update the spec
      const [updated] = await this.deps.db
        .update(specs)
        .set({
          status: newStatus,
          updatedAt: new Date(),
        })
        .where(eq(specs.id, id))
        .returning();

      this.logger.info('Spec status updated successfully', {
        operation: 'updateSpecStatus',
        specId: id,
        oldStatus: currentSpec.status,
        newStatus,
      });

      return updated;
    } catch (error) {
      this.logger.error('Failed to update spec status', {
        error: error instanceof Error ? error : new Error(String(error)),
        context: {
          operation: 'updateSpecStatus',
          specId: id,
          newStatus,
        },
      });
      throw error;
    }
  }

  /**
   * Get a spec by file path
   */
  async getSpecByFilePath(filePath: string): Promise<Spec | undefined> {
    this.logger.debug('Retrieving spec by file path', {
      operation: 'getSpecByFilePath',
      filePath,
    });

    try {
      const [spec] = await this.deps.db.select().from(specs).where(eq(specs.filePath, filePath));

      this.logger.debug(spec ? 'Spec found' : 'Spec not found', {
        operation: 'getSpecByFilePath',
        filePath,
        found: !!spec,
      });

      return spec;
    } catch (error) {
      this.logger.error('Failed to retrieve spec by file path', {
        error: error instanceof Error ? error : new Error(String(error)),
        context: {
          operation: 'getSpecByFilePath',
          filePath,
        },
      });
      throw error;
    }
  }

  /**
   * Update an existing spec
   */
  async updateSpec(
    id: string,
    data: Partial<Pick<Spec, 'title' | 'domain' | 'scenarioCount' | 'content'>>,
  ): Promise<Spec> {
    this.logger.info('Updating spec', {
      operation: 'updateSpec',
      specId: id,
    });

    try {
      const [updated] = await this.deps.db
        .update(specs)
        .set({
          ...data,
          updatedAt: new Date(),
        })
        .where(eq(specs.id, id))
        .returning();

      this.logger.info('Spec updated successfully', {
        operation: 'updateSpec',
        specId: id,
      });

      return updated;
    } catch (error) {
      this.logger.error('Failed to update spec', {
        error: error instanceof Error ? error : new Error(String(error)),
        context: {
          operation: 'updateSpec',
          specId: id,
        },
      });
      throw error;
    }
  }
}
