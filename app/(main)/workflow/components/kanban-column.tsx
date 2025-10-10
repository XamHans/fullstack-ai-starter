// Specification: /specs/workflow/spec-kanban-board.md

'use client';

import { Badge } from '@/components/ui/badge';
import type { Spec, SpecStatus } from '@/modules/workflow/types';
import { SpecCard } from './spec-card';

interface KanbanColumnProps {
  status: SpecStatus;
  title: string;
  description: string;
  specs: Spec[];
  loading: boolean;
  onSpecClick: (spec: Spec) => void;
  onStatusUpdate: (specId: string, newStatus: SpecStatus) => void;
}

const STATUS_COLORS: Record<SpecStatus, string> = {
  pending: 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400',
  'in-progress': 'bg-blue-500/10 text-blue-700 dark:text-blue-400',
  completed: 'bg-green-500/10 text-green-700 dark:text-green-400',
};

export function KanbanColumn({
  status,
  title,
  description,
  specs,
  loading,
  onSpecClick,
  onStatusUpdate,
}: KanbanColumnProps) {
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const specId = e.dataTransfer.getData('specId');
    const fromStatus = e.dataTransfer.getData('fromStatus');

    // Prevent moving completed specs back to pending
    if (fromStatus === 'completed' && status === 'pending') {
      return;
    }

    if (specId && fromStatus !== status) {
      onStatusUpdate(specId, status);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const fromStatus = e.dataTransfer.getData('fromStatus');

    // Visual feedback for invalid drop
    if (fromStatus === 'completed' && status === 'pending') {
      e.dataTransfer.dropEffect = 'none';
    } else {
      e.dataTransfer.dropEffect = 'move';
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Column Header */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-lg">{title}</h3>
          <Badge variant="secondary" className={STATUS_COLORS[status]}>
            {specs.length}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>

      {/* Column Content */}
      <div
        className="flex-1 bg-muted/30 rounded-lg p-4 min-h-[400px]"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <div className="animate-pulse text-muted-foreground">Loading...</div>
          </div>
        ) : specs.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-muted-foreground text-sm">
            No {status.replace('-', ' ')} specs yet
          </div>
        ) : (
          <div className="space-y-3">
            {specs.map((spec) => (
              <SpecCard key={spec.id} spec={spec} onClick={() => onSpecClick(spec)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
