// Specification: /specs/workflow/spec-kanban-board.md

import { Kanban, Plus } from 'lucide-react';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getCurrentUser } from '@/lib/auth';
import { KanbanBoard } from './components/kanban-board';

export default async function WorkflowPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-background to-muted/30 p-4 sm:p-6 lg:p-8">
      <div className="max-w-screen-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2">
                <Kanban className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Spec Kanban Board</h1>
                <p className="text-muted-foreground mt-1">
                  Track your BDD workflow: Spec → Plan → Implement
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Kanban Board */}
        <Card className="border-border/50 shadow-lg">
          <CardHeader>
            <CardTitle>Workflow Progress</CardTitle>
            <CardDescription>
              Visualize and manage specification files across development stages
            </CardDescription>
          </CardHeader>
          <CardContent>
            <KanbanBoard />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
