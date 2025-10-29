'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { HouseholdStep } from './components/HouseholdStep';
import { MembersStep } from './components/MembersStep';

export interface Member {
  name: string;
  dietaryPreferences: string;
  personaBackground?: string;
  inspirationPrompt?: string;
}

export default function OnboardingPage() {
  const router = useRouter();
  const { toast } = useToast();

  // State management
  const [currentStep, setCurrentStep] = useState(1);
  const [householdName, setHouseholdName] = useState('');
  const [members, setMembers] = useState<Member[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Navigate to next step
  const handleNextStep = () => {
    setCurrentStep((prev) => prev + 1);
  };

  // Navigate to previous step
  const handlePreviousStep = () => {
    setCurrentStep((prev) => prev - 1);
  };

  // Complete onboarding - call API and redirect
  const handleComplete = async () => {
    if (members.length === 0) {
      toast({
        title: 'Error',
        description: 'At least one member is required',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/onboarding/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          householdName,
          members,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle API errors
        toast({
          title: 'Error',
          description: data.error || 'Failed to complete onboarding',
          variant: 'destructive',
        });
        setIsSubmitting(false);
        return;
      }

      // Success - redirect to dashboard
      toast({
        title: 'Success',
        description: 'Onboarding completed successfully!',
      });

      router.push('/dashboard');
    } catch (_error) {
      toast({
        title: 'Error',
        description: 'Failed to complete onboarding. Please try again.',
        variant: 'destructive',
      });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-2xl">
        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Step {currentStep} of 2</span>
            <span className="text-sm text-muted-foreground">
              {currentStep === 1 ? 'Household' : 'Members'}
            </span>
          </div>
          <div className="w-full bg-secondary rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 2) * 100}%` }}
            />
          </div>
        </div>

        {/* Step content */}
        <div className="bg-card border rounded-lg p-6 shadow-lg">
          {currentStep === 1 && (
            <HouseholdStep
              householdName={householdName}
              setHouseholdName={setHouseholdName}
              onNext={handleNextStep}
            />
          )}

          {currentStep === 2 && (
            <MembersStep
              members={members}
              setMembers={setMembers}
              onPrevious={handlePreviousStep}
              onComplete={handleComplete}
              isSubmitting={isSubmitting}
            />
          )}
        </div>
      </div>
    </div>
  );
}
