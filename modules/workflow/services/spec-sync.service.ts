import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import type { ServiceDependencies } from '@/lib/container/types';
import type { SpecMetadata, SyncResult } from '../types';
import type { WorkflowService } from './workflow.service';

export class SpecSyncService {
  constructor(
    private deps: ServiceDependencies,
    private workflowService: WorkflowService,
  ) {}

  private get logger() {
    return this.deps.logger.child({ service: 'SpecSyncService' });
  }

  /**
   * Sync specs from the filesystem to the database
   */
  async syncSpecsFromFilesystem(specsDir: string): Promise<SyncResult> {
    this.logger.info('Starting filesystem sync', {
      operation: 'syncSpecsFromFilesystem',
      specsDir,
    });

    const result: SyncResult = {
      synced: 0,
      created: 0,
      updated: 0,
      errors: [],
    };

    try {
      const specFiles = await this.scanSpecsDirectory(specsDir);
      this.logger.debug(`Found ${specFiles.length} spec files`, {
        operation: 'syncSpecsFromFilesystem',
        count: specFiles.length,
      });

      for (const filePath of specFiles) {
        try {
          await this.syncSpecFile(filePath);
          result.synced++;

          // Check if it was created or updated
          const spec = await this.workflowService.getSpecByFilePath(filePath);
          if (spec) {
            // Determine if created or updated by checking if updatedAt is very recent
            const now = new Date();
            const diff = now.getTime() - spec.createdAt.getTime();
            if (diff < 1000) {
              // Created within the last second
              result.created++;
            } else {
              result.updated++;
            }
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          result.errors.push(`${filePath}: ${errorMessage}`);
          this.logger.error('Failed to sync spec file', {
            error: error instanceof Error ? error : new Error(String(error)),
            context: {
              operation: 'syncSpecsFromFilesystem',
              filePath,
            },
          });
        }
      }

      this.logger.info('Filesystem sync completed', {
        operation: 'syncSpecsFromFilesystem',
        result,
      });

      return result;
    } catch (error) {
      this.logger.error('Failed to sync filesystem', {
        error: error instanceof Error ? error : new Error(String(error)),
        context: {
          operation: 'syncSpecsFromFilesystem',
          specsDir,
        },
      });
      throw error;
    }
  }

  /**
   * Scan the specs directory recursively for .md files
   */
  private async scanSpecsDirectory(dirPath: string): Promise<string[]> {
    const specFiles: string[] = [];

    try {
      const entries = await fs.readdir(dirPath, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name);

        if (entry.isDirectory()) {
          // Recursively scan subdirectories
          const subFiles = await this.scanSpecsDirectory(fullPath);
          specFiles.push(...subFiles);
        } else if (entry.name.endsWith('.md')) {
          specFiles.push(fullPath);
        }
      }
    } catch (error) {
      this.logger.error('Failed to scan directory', {
        error: error instanceof Error ? error : new Error(String(error)),
        context: {
          operation: 'scanSpecsDirectory',
          dirPath,
        },
      });
      throw error;
    }

    return specFiles;
  }

  /**
   * Sync a single spec file to the database
   */
  private async syncSpecFile(filePath: string): Promise<void> {
    this.logger.debug('Syncing spec file', {
      operation: 'syncSpecFile',
      filePath,
    });

    try {
      // Read file content
      const content = await fs.readFile(filePath, 'utf-8');

      // Extract metadata from markdown
      const metadata = this.extractMetadataFromMarkdown(content);

      // Check if spec already exists
      const existingSpec = await this.workflowService.getSpecByFilePath(filePath);

      if (existingSpec) {
        // Update existing spec
        await this.workflowService.updateSpec(existingSpec.id, {
          title: metadata.title,
          domain: metadata.domain,
          scenarioCount: metadata.scenarioCount,
          content,
        });
        this.logger.debug('Updated existing spec', {
          operation: 'syncSpecFile',
          filePath,
          specId: existingSpec.id,
        });
      } else {
        // Create new spec
        await this.workflowService.createSpec({
          title: metadata.title,
          domain: metadata.domain,
          filePath,
          status: 'pending',
          scenarioCount: metadata.scenarioCount,
          content,
        });
        this.logger.debug('Created new spec', {
          operation: 'syncSpecFile',
          filePath,
        });
      }
    } catch (error) {
      this.logger.error('Failed to sync spec file', {
        error: error instanceof Error ? error : new Error(String(error)),
        context: {
          operation: 'syncSpecFile',
          filePath,
        },
      });
      throw error;
    }
  }

  /**
   * Extract metadata from markdown content
   */
  extractMetadataFromMarkdown(content: string): SpecMetadata {
    // Extract title (first H1 heading)
    const titleMatch = content.match(/^#\s+(.+)$/m);
    const title = titleMatch ? titleMatch[1].trim() : 'Untitled Spec';

    // Extract domain from the Domain section
    const domainMatch = content.match(/##\s+Domain\s*\n\s*`modules\/([^/]+)\//m);
    const domain = domainMatch ? domainMatch[1].trim() : 'unknown';

    // Count scenarios (### headings in Scenarios section)
    const scenariosSection = content.match(/##\s+Scenarios([\s\S]*?)(?=##|$)/);
    const scenarioCount = scenariosSection
      ? (scenariosSection[1].match(/###\s+/g) || []).length
      : 0;

    return {
      title,
      domain,
      scenarioCount,
    };
  }
}
