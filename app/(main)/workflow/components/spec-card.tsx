// Specification: /specs/workflow/spec-kanban-board.md

'use client';

import { format } from 'date-fns';
import { Calendar, FileText, FolderOpen } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Spec } from '@/modules/workflow/types';

interface SpecCardProps {
  spec: Spec;
  onClick: () => void;
}

export function SpecCard({ spec, onClick }: SpecCardProps) {
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData('specId', spec.id);
    e.dataTransfer.setData('fromStatus', spec.status);
    e.dataTransfer.effectAllowed = 'move';
  };

  return (
    <Card
      className="cursor-pointer hover:shadow-md transition-shadow bg-card"
      draggable
      onDragStart={handleDragStart}
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold flex items-start justify-between gap-2">
          <span className="flex-1">{spec.title}</span>
          <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {/* Domain */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <FolderOpen className="h-3.5 w-3.5" />
          <span>{spec.domain}</span>
        </div>

        {/* Scenario Count */}
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            {spec.scenarioCount} {spec.scenarioCount === 1 ? 'scenario' : 'scenarios'}
          </Badge>
        </div>

        {/* Created Date */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Calendar className="h-3 w-3" />
          <span>{format(new Date(spec.createdAt), 'MMM d, yyyy')}</span>
        </div>
      </CardContent>
    </Card>
  );
}
