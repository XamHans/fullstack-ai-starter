// Specification: /specs/workflow/spec-kanban-board.md

'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface CreateSpecDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function CreateSpecDialog({ open, onOpenChange, onSuccess }: CreateSpecDialogProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    domain: '',
    featureName: '',
    description: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/workflow/specs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create spec');
      }

      const result = await response.json();
      toast.success(`Spec created at ${result.filePath}`);

      // Reset form
      setFormData({
        domain: '',
        featureName: '',
        description: '',
      });

      onSuccess();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Failed to create spec');
      }
      console.error('Error creating spec:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create New Spec</DialogTitle>
            <DialogDescription>
              Create a new BDD specification file. The spec will be added to the Pending column.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* Domain */}
            <div className="grid gap-2">
              <Label htmlFor="domain">Domain</Label>
              <Input
                id="domain"
                placeholder="e.g., posts, users, inventory"
                value={formData.domain}
                onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                required
              />
              <p className="text-xs text-muted-foreground">
                The module domain (will be used in the file path)
              </p>
            </div>

            {/* Feature Name */}
            <div className="grid gap-2">
              <Label htmlFor="featureName">Feature Name</Label>
              <Input
                id="featureName"
                placeholder="e.g., delete-post, user-login"
                value={formData.featureName}
                onChange={(e) => setFormData({ ...formData, featureName: e.target.value })}
                required
              />
              <p className="text-xs text-muted-foreground">
                The feature name (will be used for the filename)
              </p>
            </div>

            {/* Description */}
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe what this feature does..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                required
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Spec'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
