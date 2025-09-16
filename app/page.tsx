'use client';

import { ArrowRight, BarChart3, Package, Zap } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">AI Starter Kit</h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              Intelligent inventory management system that helps you track, monitor, and optimize
              your stock levels with real-time insights and automated alerts.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Button asChild size="lg" className="h-12 px-8">
                <Link href="/dashboard">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="h-12 px-8">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Everything you need to manage inventory
          </h2>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            AI Starter Kit provides comprehensive tools for modern inventory management
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <div className="grid max-w-xl grid-cols-1 gap-8 lg:max-w-none lg:grid-cols-3">
            <Card className="border-border/50 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-primary/10 p-2">
                    <Package className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">Real-time Tracking</CardTitle>
                </div>
                <CardDescription className="mt-4">
                  Monitor inventory levels in real-time with automated updates and instant
                  notifications when stock levels change.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border/50 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-primary/10 p-2">
                    <BarChart3 className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">Analytics & Insights</CardTitle>
                </div>
                <CardDescription className="mt-4">
                  Get detailed analytics on inventory turnover, trends, and predictions to optimize
                  your stock management.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border/50 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-primary/10 p-2">
                    <Zap className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">Smart Automation</CardTitle>
                </div>
                <CardDescription className="mt-4">
                  Automate reorder alerts, low stock notifications, and inventory reports to
                  streamline your workflow.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Ready to optimize your inventory?
          </h2>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Start managing your inventory smarter with AI Starter Kit's intelligent system.
          </p>
          <div className="mt-10">
            <Button asChild size="lg" className="h-12 px-8">
              <Link href="/dashboard">
                Access Dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
