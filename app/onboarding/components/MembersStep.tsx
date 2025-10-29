'use client';

import { Plus, User, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import type { Member } from '../page';

interface MembersStepProps {
  members: Member[];
  setMembers: (members: Member[]) => void;
  onPrevious: () => void;
  onComplete: () => void;
  isSubmitting: boolean;
}

export function MembersStep({
  members,
  setMembers,
  onPrevious,
  onComplete,
  isSubmitting,
}: MembersStepProps) {
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [currentMember, setCurrentMember] = useState<Member>({
    name: '',
    dietaryPreferences: '',
    personaBackground: '',
    inspirationPrompt: '',
  });
  const [errors, setErrors] = useState<{ name?: string; dietaryPreferences?: string }>({});

  const validateMember = (): boolean => {
    const newErrors: { name?: string; dietaryPreferences?: string } = {};

    if (!currentMember.name.trim()) {
      newErrors.name = 'Member name is required';
    }

    if (!currentMember.dietaryPreferences.trim()) {
      newErrors.dietaryPreferences = 'Dietary preferences are required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddMember = () => {
    if (members.length >= 5) {
      setErrors({ name: 'Maximum 5 members allowed per household' });
      return;
    }

    if (!validateMember()) {
      return;
    }

    setMembers([...members, currentMember]);
    setCurrentMember({
      name: '',
      dietaryPreferences: '',
      personaBackground: '',
      inspirationPrompt: '',
    });
    setErrors({});
    setIsAddingMember(false);
  };

  const handleRemoveMember = (index: number) => {
    setMembers(members.filter((_, i) => i !== index));
  };

  const handleComplete = () => {
    if (members.length === 0) {
      setErrors({ name: 'At least one member is required' });
      return;
    }

    onComplete();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Add Household Members</h2>
        <p className="text-muted-foreground mt-2">
          Add people who will be sharing meals. Tell us about their dietary preferences so we can
          personalize meal suggestions.
        </p>
      </div>

      {/* Existing members list */}
      {members.length > 0 && (
        <div className="space-y-3">
          <Label className="text-base">Members ({members.length}/5)</Label>
          {members.map((member, index) => (
            <Card key={index} className="relative">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-base">{member.name}</CardTitle>
                      <CardDescription className="text-sm">
                        {member.dietaryPreferences}
                      </CardDescription>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveMember(index)}
                    className="h-8 w-8"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              {(member.personaBackground || member.inspirationPrompt) && (
                <CardContent className="pt-0 text-sm text-muted-foreground">
                  {member.personaBackground && <p>{member.personaBackground}</p>}
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Add new member form */}
      {!isAddingMember && members.length < 5 && (
        <Button
          variant="outline"
          onClick={() => setIsAddingMember(true)}
          className="w-full border-dashed"
          disabled={isSubmitting}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Member
        </Button>
      )}

      {isAddingMember && (
        <Card className="border-primary">
          <CardHeader>
            <CardTitle className="text-base">New Member</CardTitle>
            <CardDescription>Add a household member and their dietary preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="memberName">
                Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="memberName"
                placeholder="e.g., Johannes, Emma..."
                value={currentMember.name}
                onChange={(e) => {
                  setCurrentMember({ ...currentMember, name: e.target.value });
                  setErrors({ ...errors, name: undefined });
                }}
                className={errors.name ? 'border-destructive' : ''}
                autoFocus
              />
              {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="dietaryPreferences">
                Dietary Preferences <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="dietaryPreferences"
                placeholder="e.g., vegetarian, no gluten, dairy-free, loves spicy food..."
                value={currentMember.dietaryPreferences}
                onChange={(e) => {
                  setCurrentMember({ ...currentMember, dietaryPreferences: e.target.value });
                  setErrors({ ...errors, dietaryPreferences: undefined });
                }}
                className={errors.dietaryPreferences ? 'border-destructive' : ''}
                rows={3}
              />
              {errors.dietaryPreferences && (
                <p className="text-sm text-destructive">{errors.dietaryPreferences}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Tell us what this person likes to eat, any restrictions, or allergies
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="personaBackground">Persona Background (Optional)</Label>
              <Textarea
                id="personaBackground"
                placeholder="e.g., Busy professional seeking healthy meal prep, Fitness enthusiast tracking meals..."
                value={currentMember.personaBackground}
                onChange={(e) =>
                  setCurrentMember({ ...currentMember, personaBackground: e.target.value })
                }
                rows={2}
              />
              <p className="text-xs text-muted-foreground">
                Help us understand their lifestyle and goals
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="inspirationPrompt">Inspiration Prompt (Optional)</Label>
              <Textarea
                id="inspirationPrompt"
                placeholder="Any specific inspiration or preferences for meal suggestions..."
                value={currentMember.inspirationPrompt}
                onChange={(e) =>
                  setCurrentMember({ ...currentMember, inspirationPrompt: e.target.value })
                }
                rows={2}
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={handleAddMember} className="flex-1">
                <Plus className="h-4 w-4 mr-2" />
                Add Member
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setIsAddingMember(false);
                  setCurrentMember({
                    name: '',
                    dietaryPreferences: '',
                    personaBackground: '',
                    inspirationPrompt: '',
                  });
                  setErrors({});
                }}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {members.length === 0 && !isAddingMember && (
        <Card className="bg-muted/50 border-dashed">
          <CardHeader>
            <CardDescription className="text-center">
              No members added yet. Add at least one member to continue.
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      <Separator />

      {/* Navigation buttons */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrevious} disabled={isSubmitting}>
          Previous
        </Button>
        <Button onClick={handleComplete} disabled={isSubmitting} size="lg">
          {isSubmitting ? 'Completing...' : 'Complete Onboarding'}
        </Button>
      </div>
    </div>
  );
}
