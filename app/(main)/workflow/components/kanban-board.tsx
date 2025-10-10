// Specification: /specs/workflow/spec-kanban-board.md

'use client';

import { Plus, RefreshCw } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import type { Spec, SpecStatus } from '@/modules/workflow/types';
import { CreateSpecDialog } from './create-spec-dialog';
import { KanbanColumn } from './kanban-column';
import { SpecDetailsPanel } from './spec-details-panel';

const COLUMNS: { id: SpecStatus; title: string; description: string }[] = [
  {
    id: 'pending',
    title: 'Pending',
    description: 'Specs ready to be planned',
  },
  {
    id: 'in-progress',
    title: 'In Progress',
    description: 'Specs being implemented',
  },
  {
    id: 'completed',
    title: 'Completed',
    description: 'Fully implemented specs',
  },
];

export function KanbanBoard() {
  const [specs, setSpecs] = useState<Spec[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [selectedSpec, setSelectedSpec] = useState<Spec | null>(null);
  const [detailsPanelOpen, setDetailsPanelOpen] = useState(false);

  // Fetch specs from API
  const fetchSpecs = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/workflow/specs');
      if (!response.ok) throw new Error('Failed to fetch specs');
      const data = await response.json();
      setSpecs(data);
    } catch (error) {
      toast.error('Failed to load specs');
      console.error('Error fetching specs:', error);
    } finally {
      setLoading(false);
    }
  };

  // Sync specs from filesystem
  const syncSpecs = async () => {
    try {
      setSyncing(true);
      const response = await fetch('/api/workflow/sync', {
        method: 'POST',
      });
      if (!response.ok) throw new Error('Failed to sync specs');
      const data = await response.json();
      toast.success(data.message);
      await fetchSpecs(); // Refresh the list
    } catch (error) {
      toast.error('Failed to sync specs');
      console.error('Error syncing specs:', error);
    } finally {
      setSyncing(false);
    }
  };

  // Handle spec card click
  const handleSpecClick = (spec: Spec) => {
    setSelectedSpec(spec);
    setDetailsPanelOpen(true);
  };

  // Handle status update
  const handleStatusUpdate = async (specId: string, newStatus: SpecStatus) => {
    try {
      const response = await fetch(`/api/workflow/specs/${specId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update spec');
      }

      toast.success('Spec status updated');
      await fetchSpecs(); // Refresh the list
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Failed to update spec status');
      }
      console.error('Error updating spec:', error);
    }
  };

  // Handle spec creation
  const handleSpecCreated = async () => {
    setCreateDialogOpen(false);
    await fetchSpecs(); // Refresh the list
  };

  // Load specs on mount
  useEffect(() => {
    fetchSpecs();
  }, []);

  // Group specs by status
  const specsByStatus = specs.reduce(
    (acc, spec) => {
      acc[spec.status].push(spec);
      return acc;
    },
    {
      pending: [] as Spec[],
      'in-progress': [] as Spec[],
      completed: [] as Spec[],
    },
  );

  return (
    <div className="space-y-4">
      {/* Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button onClick={() => setCreateDialogOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Create New Spec
          </Button>
          <Button onClick={syncSpecs} variant="outline" disabled={syncing} className="gap-2">
            <RefreshCw className={`h-4 w-4 ${syncing ? 'animate-spin' : ''}`} />
            Sync from Filesystem
          </Button>
        </div>
      </div>

      {/* Kanban Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {COLUMNS.map((column) => (
          <KanbanColumn
            key={column.id}
            status={column.id}
            title={column.title}
            description={column.description}
            specs={specsByStatus[column.id]}
            loading={loading}
            onSpecClick={handleSpecClick}
            onStatusUpdate={handleStatusUpdate}
          />
        ))}
      </div>

      {/* Create Spec Dialog */}
      <CreateSpecDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSuccess={handleSpecCreated}
      />

      {/* Spec Details Panel */}
      {selectedSpec && (
        <SpecDetailsPanel
          spec={selectedSpec}
          open={detailsPanelOpen}
          onOpenChange={setDetailsPanelOpen}
        />
      )}
    </div>
  );
}
