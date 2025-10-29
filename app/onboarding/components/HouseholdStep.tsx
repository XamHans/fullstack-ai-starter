'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface HouseholdStepProps {
  householdName: string;
  setHouseholdName: (name: string) => void;
  onNext: () => void;
}

export function HouseholdStep({ householdName, setHouseholdName, onNext }: HouseholdStepProps) {
  const [error, setError] = useState<string | null>(null);

  const handleNext = () => {
    // Validation
    if (!householdName.trim()) {
      setError('Household name is required');
      return;
    }

    setError(null);
    onNext();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleNext();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Welcome to Kaizen</h2>
        <p className="text-muted-foreground mt-2">
          Let's start by creating your household. This will help us personalize your meal planning
          experience.
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="householdName">Household Name</Label>
          <Input
            id="householdName"
            placeholder="e.g., The Sanctuary, Smith Family..."
            value={householdName}
            onChange={(e) => {
              setHouseholdName(e.target.value);
              setError(null);
            }}
            onKeyPress={handleKeyPress}
            className={error ? 'border-destructive' : ''}
            autoFocus
          />
          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>

        <Card className="bg-muted/50 border-dashed">
          <CardHeader>
            <CardTitle className="text-base">What's a household?</CardTitle>
            <CardDescription>
              A household is a group of people who share meals together. You'll add members in the
              next step.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleNext} size="lg">
          Next: Add Members
        </Button>
      </div>
    </div>
  );
}
