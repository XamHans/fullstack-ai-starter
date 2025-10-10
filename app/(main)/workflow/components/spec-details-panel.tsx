// Specification: /specs/workflow/spec-kanban-board.md

'use client';

import { format } from 'date-fns';
import { Calendar, ExternalLink, FileText, FolderOpen, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import type { Spec } from '@/modules/workflow/types';

interface SpecDetailsPanelProps {
  spec: Spec;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const STATUS_LABELS: Record<string, string> = {
  pending: 'Pending',
  'in-progress': 'In Progress',
  completed: 'Completed',
};

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400',
  'in-progress': 'bg-blue-500/10 text-blue-700 dark:text-blue-400',
  completed: 'bg-green-500/10 text-green-700 dark:text-green-400',
};

export function SpecDetailsPanel({ spec, open, onOpenChange }: SpecDetailsPanelProps) {
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(false);

  // Fetch spec content when panel opens
  useEffect(() => {
    if (open && spec.id) {
      const fetchContent = async () => {
        try {
          setLoading(true);
          const response = await fetch(`/api/workflow/specs/${spec.id}/content`);
          if (!response.ok) throw new Error('Failed to fetch spec content');
          const data = await response.json();
          setContent(data.content || '');
        } catch (error) {
          console.error('Error fetching spec content:', error);
          setContent('Failed to load spec content');
        } finally {
          setLoading(false);
        }
      };

      fetchContent();
    }
  }, [open, spec.id]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-2xl">
        <SheetHeader>
          <SheetTitle className="flex items-center justify-between">
            <span>{spec.title}</span>
            <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)}>
              <X className="h-4 w-4" />
            </Button>
          </SheetTitle>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-8rem)] mt-6">
          <div className="space-y-6">
            {/* Metadata Section */}
            <div className="space-y-4">
              <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                Metadata
              </h3>

              <div className="grid gap-3">
                {/* Status */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <Badge className={STATUS_COLORS[spec.status]}>{STATUS_LABELS[spec.status]}</Badge>
                </div>

                {/* Domain */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Domain</span>
                  <div className="flex items-center gap-2">
                    <FolderOpen className="h-3.5 w-3.5" />
                    <span className="text-sm font-medium">{spec.domain}</span>
                  </div>
                </div>

                {/* Scenario Count */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Scenarios</span>
                  <span className="text-sm font-medium">
                    {spec.scenarioCount} {spec.scenarioCount === 1 ? 'scenario' : 'scenarios'}
                  </span>
                </div>

                {/* Created Date */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Created</span>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{format(new Date(spec.createdAt), 'MMM d, yyyy')}</span>
                  </div>
                </div>

                {/* Updated Date */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Updated</span>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{format(new Date(spec.updatedAt), 'MMM d, yyyy')}</span>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* File Path */}
            <div className="space-y-2">
              <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                File Location
              </h3>
              <div className="flex items-center gap-2 text-sm bg-muted p-3 rounded-md font-mono">
                <FileText className="h-4 w-4" />
                <span className="flex-1">{spec.filePath}</span>
              </div>
            </div>

            <Separator />

            {/* Content Preview */}
            <div className="space-y-2">
              <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                Spec Content
              </h3>
              {loading ? (
                <div className="text-sm text-muted-foreground">Loading content...</div>
              ) : (
                <pre className="text-xs bg-muted p-4 rounded-md overflow-x-auto whitespace-pre-wrap">
                  {content}
                </pre>
              )}
            </div>

            {/* Actions */}
            <div className="pt-4">
              <Button variant="outline" className="w-full gap-2" asChild>
                <a href={`/${spec.filePath}`} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4" />
                  View File in Editor
                </a>
              </Button>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
