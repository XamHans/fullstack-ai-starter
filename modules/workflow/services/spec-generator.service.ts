import * as fs from 'node:fs/promises';
import type { ServiceDependencies } from '@/lib/container/types';
import type { CreateSpecInput } from '../types';
import type { WorkflowService } from './workflow.service';

export class SpecGeneratorService {
  constructor(
    private deps: ServiceDependencies,
    private workflowService: WorkflowService,
  ) {}

  private get logger() {
    return this.deps.logger.child({ service: 'SpecGeneratorService' });
  }

  /**
   * Generate a new spec file and database record
   */
  async generateSpec(input: CreateSpecInput): Promise<{ filePath: string; title: string }> {
    this.logger.info('Generating new spec', {
      operation: 'generateSpec',
      domain: input.domain,
      featureName: input.featureName,
    });

    try {
      // Normalize the feature name for file path
      const normalizedFeatureName = this.normalizeFeatureName(input.featureName);
      const filePath = `specs/${input.domain}/${normalizedFeatureName}.md`;

      // Check if spec already exists
      const existingSpec = await this.workflowService.getSpecByFilePath(filePath);
      if (existingSpec) {
        throw new Error('Spec file already exists');
      }

      // Create the title (capitalize words)
      const title = this.createTitle(input.featureName);

      // Generate the spec content
      const content = this.generateSpecContent(title, input.domain, input.description);

      // Ensure the domain directory exists
      const dirPath = `specs/${input.domain}`;
      await fs.mkdir(dirPath, { recursive: true });

      // Write the file
      await fs.writeFile(filePath, content, 'utf-8');

      // Create database record
      await this.workflowService.createSpec({
        title,
        domain: input.domain,
        filePath,
        status: 'pending',
        scenarioCount: 0,
        content,
      });

      this.logger.info('Spec generated successfully', {
        operation: 'generateSpec',
        filePath,
        title,
      });

      return { filePath, title };
    } catch (error) {
      this.logger.error('Failed to generate spec', {
        error: error instanceof Error ? error : new Error(String(error)),
        context: {
          operation: 'generateSpec',
          domain: input.domain,
          featureName: input.featureName,
        },
      });
      throw error;
    }
  }

  /**
   * Normalize feature name to kebab-case filename
   */
  private normalizeFeatureName(featureName: string): string {
    return featureName
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters except spaces and hyphens
      .trim()
      .replace(/\s+/g, '-'); // Replace spaces with hyphens
  }

  /**
   * Create a human-readable title from the feature name
   */
  private createTitle(featureName: string): string {
    // Replace hyphens and underscores with spaces, then remove other special characters
    const cleaned = featureName
      .replace(/[-_]/g, ' ') // Convert hyphens and underscores to spaces
      .replace(/[^a-zA-Z0-9\s]/g, '') // Remove other special characters
      .trim();

    // Capitalize each word
    return cleaned
      .split(/\s+/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }

  /**
   * Generate the markdown content for a new spec
   */
  private generateSpecContent(title: string, domain: string, description: string): string {
    return `# ${title}

## Context
${description}

## Domain
\`modules/${domain}/\`

## Implementation Progress
<!-- Track scenario implementation below -->
<!-- Update after each scenario is implemented via /implement -->

⏳ All scenarios pending

## Scenarios

### Happy Path: [Describe the scenario]
\`\`\`gherkin
Given [initial context]
When [action occurs]
Then [expected outcome]
\`\`\`

## Dependencies
- List any required dependencies or libraries

## Notes
- Add any additional notes or considerations
`;
  }
}
