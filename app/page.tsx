'use client';

import { ArrowRight, BarChart3, Package, Zap, Sparkles, Code, Rocket } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Cover } from '@/components/ui/cover';
import { PixelatedCanvas } from '@/components/ui/pixelated-canvas';
import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import createGlobe from "cobe";
import { motion } from "motion/react";
import { IconBrandYoutubeFilled } from "@tabler/icons-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-4xl md:text-4xl lg:text-6xl font-semibold max-w-7xl mx-auto text-center mt-6 relative z-20 py-6 bg-clip-text text-transparent bg-gradient-to-b from-neutral-800 via-neutral-700 to-neutral-700 dark:from-neutral-800 dark:via-white dark:to-white">
              Build AI fullstack apps <br /> at <Cover>warp speed</Cover>
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-2xl mx-auto">
              The ultimate starter kit for building production-ready AI applications.
              Pre-configured with modern tools, AI integrations, and best practices to ship faster than ever.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Button asChild size="lg" className="h-12 px-8">
                <Link href="/dashboard">
                  Start Building
                  <Rocket className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="h-12 px-8">
                View Demo
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section - Bento Grid */}
      <div className="relative z-20 py-10 lg:py-40 max-w-7xl mx-auto">
        <div className="px-8">
          <h4 className="text-3xl lg:text-5xl lg:leading-tight max-w-5xl mx-auto text-center tracking-tight font-medium text-black dark:text-white">
            Production-ready AI starter kit
          </h4>
          <p className="text-sm lg:text-base max-w-2xl my-4 mx-auto text-neutral-500 text-center font-normal dark:text-neutral-300">
            Spec-driven development, MCP servers, modern auth, and developer tools. Everything you need to ship AI apps fast.
          </p>
        </div>

        <div className="relative">
          <div className="grid grid-cols-1 lg:grid-cols-6 mt-12 xl:border rounded-md dark:border-neutral-800">
            <FeatureCard className="col-span-1 lg:col-span-4 border-b lg:border-r dark:border-neutral-800">
              <FeatureTitle>Spec-driven agentic coding</FeatureTitle>
              <FeatureDescription>
                Write BDD specs, get production code. AI agents handle implementation with test-driven development.
              </FeatureDescription>
              <div className="h-full w-full"><SkeletonOne /></div>
            </FeatureCard>

            <FeatureCard className="border-b col-span-1 lg:col-span-2 dark:border-neutral-800">
              <FeatureTitle>MCP servers included</FeatureTitle>
              <FeatureDescription>
                Pre-configured Model Context Protocol servers for enhanced AI capabilities and tool access.
              </FeatureDescription>
              <div className="h-full w-full"><SkeletonTwo /></div>
            </FeatureCard>

            <FeatureCard className="col-span-1 lg:col-span-3 lg:border-r dark:border-neutral-800">
              <FeatureTitle>Better-auth + security</FeatureTitle>
              <FeatureDescription>
                Modern authentication with better-auth. Production-ready security patterns and user management.
              </FeatureDescription>
              <div className="h-full w-full"><SkeletonThree /></div>
            </FeatureCard>

            <FeatureCard className="col-span-1 lg:col-span-3 border-b lg:border-none">
              <FeatureTitle>Biome for code quality</FeatureTitle>
              <FeatureDescription>
                Lightning-fast linting and formatting with Biome. Consistent code quality across your entire codebase.
              </FeatureDescription>
              <div className="h-full w-full"><SkeletonFour /></div>
            </FeatureCard>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Ready to build your AI app?
          </h2>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Join thousands of developers shipping AI applications faster with our starter kit.
          </p>
          <div className="mt-10">
            <Button asChild size="lg" className="h-12 px-8">
              <Link href="/dashboard">
                Start Building Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Personal Section */}
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-8">
            Built by developers, for developers
          </h2>
          <PixelatedCanvas
            src="https://assets.aceternity.com/manu-red.png"
            width={400}
            height={500}
            cellSize={3}
            dotScale={0.9}
            shape="square"
            backgroundColor="#000000"
            dropoutStrength={0.4}
            interactive
            distortionStrength={3}
            distortionRadius={80}
            distortionMode="swirl"
            followSpeed={0.2}
            jitterStrength={4}
            jitterSpeed={4}
            sampleAverage
            tintColor="#FFFFFF"
            tintStrength={0.2}
            className="rounded-xl border border-neutral-800 shadow-lg mx-auto"
          />
        </div>
      </div>
    </div>
  );
}

const FeatureCard = ({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn(`p-4 sm:p-8 relative overflow-hidden`, className)}>
      {children}
    </div>
  );
};

const FeatureTitle = ({ children }: { children?: React.ReactNode }) => {
  return (
    <p className="max-w-5xl mx-auto text-left tracking-tight text-black dark:text-white text-xl md:text-2xl md:leading-snug">
      {children}
    </p>
  );
};

const FeatureDescription = ({ children }: { children?: React.ReactNode }) => {
  return (
    <p className={cn(
      "text-sm md:text-base max-w-4xl text-left mx-auto",
      "text-neutral-500 text-center font-normal dark:text-neutral-300",
      "text-left max-w-sm mx-0 md:text-sm my-2"
    )}>
      {children}
    </p>
  );
};

const SkeletonOne = () => {
  return (
    <div className="relative flex py-8 px-2 gap-10 h-full">
      <div className="w-full p-5 mx-auto bg-white dark:bg-neutral-900 shadow-2xl group h-full">
        <div className="flex flex-1 w-full h-full flex-col space-y-2">
          <div className="h-full w-full bg-gradient-to-br from-violet-500 via-purple-500 to-blue-500 rounded-sm flex items-center justify-center">
            <div className="text-center text-white">
              <Code className="h-16 w-16 mx-auto mb-4" />
              <div className="text-sm font-mono bg-black/20 rounded p-2">
                Given: A user wants to generate an image<br/>
                When: They provide a prompt<br/>
                Then: AI generates the image<br/>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 z-40 inset-x-0 h-60 bg-gradient-to-t from-white dark:from-black via-white dark:via-black to-transparent w-full pointer-events-none" />
      <div className="absolute top-0 z-40 inset-x-0 h-60 bg-gradient-to-b from-white dark:from-black via-transparent to-transparent w-full pointer-events-none" />
    </div>
  );
};

const SkeletonTwo = () => {
  const servers = [
    { name: "Neon", color: "bg-green-500" },
    { name: "Serena", color: "bg-blue-500" },
    { name: "Browser", color: "bg-purple-500" },
    { name: "IDE", color: "bg-orange-500" }
  ];

  return (
    <div className="relative flex flex-col items-center p-8 gap-4 h-full overflow-hidden">
      <div className="text-center mb-4">
        <Package className="h-8 w-8 mx-auto mb-2 text-primary" />
        <div className="text-xs text-muted-foreground">MCP Servers</div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {servers.map((server, idx) => (
          <motion.div
            key={server.name}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: idx * 0.1, type: "spring" }}
            className={cn("rounded-lg p-3 text-white text-xs text-center", server.color)}
          >
            {server.name}
          </motion.div>
        ))}
      </div>
      <div className="absolute left-0 z-[100] inset-y-0 w-20 bg-gradient-to-r from-white dark:from-black to-transparent h-full pointer-events-none" />
      <div className="absolute right-0 z-[100] inset-y-0 w-20 bg-gradient-to-l from-white dark:from-black to-transparent h-full pointer-events-none" />
    </div>
  );
};

const SkeletonThree = () => {
  return (
    <div className="relative flex gap-10 h-full group/image">
      <div className="w-full mx-auto bg-transparent dark:bg-transparent group h-full">
        <div className="flex flex-1 w-full h-full flex-col space-y-2 relative items-center justify-center">
          <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-lg p-6 text-white text-center">
            <Sparkles className="h-12 w-12 mx-auto mb-4" />
            <div className="text-sm font-mono">
              better-auth
            </div>
            <div className="text-xs mt-2 opacity-80">
              Modern • Secure • Fast
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SkeletonFour = () => {
  return (
    <div className="h-60 md:h-60 flex flex-col items-center relative bg-transparent dark:bg-transparent mt-10">
      <Globe className="absolute -right-10 md:-right-10 -bottom-80 md:-bottom-72" />
    </div>
  );
};

const Globe = ({ className }: { className?: string }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let phi = 0;

    if (!canvasRef.current) return;

    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: 600 * 2,
      height: 600 * 2,
      phi: 0,
      theta: 0,
      dark: 1,
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: 6,
      baseColor: [0.3, 0.3, 0.3],
      markerColor: [0.1, 0.8, 1],
      glowColor: [1, 1, 1],
      markers: [
        { location: [37.7595, -122.4367], size: 0.03 },
        { location: [40.7128, -74.006], size: 0.1 },
      ],
      onRender: (state) => {
        state.phi = phi;
        phi += 0.01;
      },
    });

    return () => {
      globe.destroy();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: 600, height: 600, maxWidth: "100%", aspectRatio: 1 }}
      className={className}
    />
  );
};
