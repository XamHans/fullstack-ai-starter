'use client';

import { ChefHat, Home, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Welcome to Your Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Your household has been successfully created! This is where you'll manage your meals and
            household members.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <Home className="h-8 w-8 mb-2 text-primary" />
              <CardTitle>Household</CardTitle>
              <CardDescription>Manage your household settings</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                View Details
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Users className="h-8 w-8 mb-2 text-primary" />
              <CardTitle>Members</CardTitle>
              <CardDescription>Manage household members</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                View Members
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <ChefHat className="h-8 w-8 mb-2 text-primary" />
              <CardTitle>Meal Planning</CardTitle>
              <CardDescription>Plan meals based on preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                Start Planning
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-muted/50">
          <CardHeader>
            <CardTitle>Next Steps</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-primary" />
              <p className="text-sm">Review your household members and their dietary preferences</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-primary" />
              <p className="text-sm">Start planning your first meal</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-primary" />
              <p className="text-sm">Add habits and routines for your household members</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
