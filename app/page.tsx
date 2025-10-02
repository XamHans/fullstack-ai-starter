'use client';

import {
  AlertTriangle,
  Bot,
  Check,
  Database,
  FileCode,
  Layout,
  MonitorSpeaker,
  Rocket,
  Server,
  Shield,
  Star,
  Target,
  TestTube,
  Users,
  Wrench,
  X,
} from 'lucide-react';
import { motion } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Cover } from '@/components/ui/cover';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { LinkPreview } from '@/components/ui/link-preview';
import { PixelatedCanvas } from '@/components/ui/pixelated-canvas';
import { Separator } from '@/components/ui/separator';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Text Content */}
            <motion.div
              className="space-y-8"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold relative z-20 bg-clip-text text-transparent bg-gradient-to-b from-neutral-800 via-neutral-700 to-neutral-700 dark:from-neutral-800 dark:via-white dark:to-white">
                Ship{' '}
                <HoverCard>
                  <HoverCardTrigger>
                    <Cover>AI SaaS</Cover>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80">
                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold">Professional AI SaaS</h4>
                      <p className="text-sm text-muted-foreground">
                        Building AI-powered Software as a Service applications with enterprise-grade
                        architecture, proper testing, and maintainable code that scales with your
                        business.
                      </p>
                    </div>
                  </HoverCardContent>
                </HoverCard>{' '}
                That Last.
                <br />
                Not just vibe-driven demos.
              </h1>
              <p className="text-xl leading-8 text-muted-foreground">
                For developers building serious AI SaaS businesses. This spec-driven starter kit
                provides the architectural foundation to ensure your product is scalable,
                maintainable, and secure from day one.
              </p>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <Button asChild size="lg" className="h-14 px-8 text-lg">
                  <Link href="/playground/generate-text">
                    Get Started for Free
                    <Rocket className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="h-14 px-8 text-lg">
                  Explore the Architecture
                </Button>
              </div>
            </motion.div>

            {/* Right Column - Hero Image */}
            <motion.div
              className="relative order-first lg:order-last"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="relative">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-3xl blur-3xl"
                  animate={{
                    scale: [1, 1.05, 1],
                    rotate: [0, 1, 0],
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />
                <motion.div
                  whileHover={{ scale: 1.02, rotate: 1 }}
                  transition={{ duration: 0.3 }}
                  className="relative"
                >
                  <Image
                    src="/hero.svg"
                    alt="Spec-Driven AI Starter Kit - Tech Stack Showcase"
                    width={600}
                    height={400}
                    className="rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 w-full h-auto"
                    priority
                  />
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/5 via-transparent to-transparent" />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Development Approaches Comparison */}
      <section className="relative overflow-hidden py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
                The Two Paths of AI-Assisted Development
              </h2>
              <p className="text-lg text-muted-foreground">
                Choose the foundation that will support your business, not just your demo.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="grid md:grid-cols-2 gap-8 relative"
            >
              {/* Vibe-Driven Problems */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="border-border bg-muted/20">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <X className="h-4 w-4 text-muted-foreground" />
                      <CardTitle className="text-lg font-semibold text-foreground">
                        The "Vibe-Driven" Trap
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3 text-sm">
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                        <span>
                          <strong>Hours</strong> spent debugging inconsistent, AI-generated code.
                        </span>
                      </div>
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                        <span>
                          <strong>Days</strong> lost fixing features when AI creates conflicting
                          implementations.
                        </span>
                      </div>
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                        <span>
                          <strong>Weeks</strong> refactoring "spaghetti code" that lacks a coherent
                          structure.
                        </span>
                      </div>
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                        <span>
                          <strong>Months</strong> wrestling with untestable and unmaintainable
                          legacy code.
                        </span>
                      </div>
                    </div>
                    <Separator className="bg-border" />
                    <Alert className="border-border bg-muted/30">
                      <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                      <AlertDescription className="text-foreground font-semibold">
                        Result: Crippling Maintenance Overhead
                      </AlertDescription>
                    </Alert>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Vertical Separator */}
              <Separator
                orientation="vertical"
                className="absolute left-1/2 top-8 bottom-8 transform -translate-x-1/2 hidden md:block bg-border"
              />

              {/* Spec-Driven Advantages */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <Card className="border-border bg-background">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-foreground" />
                      <CardTitle className="text-lg font-semibold text-foreground">
                        The Spec-Driven Advantage
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3 text-sm">
                      <div className="flex items-start gap-3">
                        <Target className="h-4 w-4 text-foreground mt-0.5 flex-shrink-0" />
                        <span>
                          <strong>BDD workflows:</strong> Define specs once, AI implements perfectly
                          every time.
                        </span>
                      </div>
                      <div className="flex items-start gap-3">
                        <Wrench className="h-4 w-4 text-foreground mt-0.5 flex-shrink-0" />
                        <span>
                          <strong>Dependency injection:</strong> Clean, testable, and scalable
                          architecture.
                        </span>
                      </div>
                      <div className="flex items-start gap-3">
                        <TestTube className="h-4 w-4 text-foreground mt-0.5 flex-shrink-0" />
                        <span>
                          <strong>Vitest testing:</strong> Catch issues before they reach
                          production.
                        </span>
                      </div>
                      <div className="flex items-start gap-3">
                        <Bot className="h-4 w-4 text-foreground mt-0.5 flex-shrink-0" />
                        <span>
                          <strong>Claude Code MCP:</strong> Context-aware AI with full codebase
                          understanding.
                        </span>
                      </div>
                    </div>
                    <Separator className="bg-border" />
                    <Alert className="border-border bg-muted/30">
                      <Rocket className="h-4 w-4 text-foreground" />
                      <AlertDescription className="text-foreground font-semibold">
                        Result: Zero Maintenance Overhead
                      </AlertDescription>
                    </Alert>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="mt-12 text-center"
            >
              <div className="text-2xl font-bold mb-4">There's a smarter way to build.</div>
              <div className="text-lg text-muted-foreground">
                Stop building fragile apps. Start building bulletproof businesses.
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Tech Stack & Benefits Section */}
      <section className="relative py-24 sm:py-32 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="px-8"
        >
          <h4 className="text-3xl lg:text-5xl lg:leading-tight max-w-5xl mx-auto text-center tracking-tight font-medium text-black dark:text-white">
            Production-Ready Tech Stack
          </h4>
          <p className="text-sm lg:text-base max-w-2xl my-4 mx-auto text-neutral-500 text-center font-normal dark:text-neutral-300">
            Every component battle-tested and chosen for long-term maintainability. Deploy in
            minutes, scale for years.
          </p>
        </motion.div>

        <div className="px-8 mt-16">
          {/* Core Architecture Row */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h5 className="text-xl font-semibold mb-6 text-center">Core Architecture</h5>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3, staggerChildren: 0.1 }}
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                viewport={{ once: true }}
              >
                <Card className="p-6 h-full">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
                      <i className="devicon-cucumber-plain text-4xl text-green-600 dark:text-green-400"></i>
                    </div>
                    <div>
                      <h6 className="font-semibold text-lg">Spec-Driven Workflows</h6>
                      <p className="text-sm text-muted-foreground mt-2">
                        Gherkin specifications for clear requirements and AI implementation
                        guidance.
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                viewport={{ once: true }}
              >
                <Card className="p-6 h-full">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
                      <Wrench className="h-8 w-8 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <h6 className="font-semibold text-lg">Dependency Injection</h6>
                      <p className="text-sm text-muted-foreground mt-2">
                        Clean, testable architecture with proper separation of concerns and
                        dependency management.
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                viewport={{ once: true }}
              >
                <Card className="p-6 h-full">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                      <Layout className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <h6 className="font-semibold text-lg">Modular Domain Architecture</h6>
                      <p className="text-sm text-muted-foreground mt-2">
                        Business logic organized by domain with scalable patterns and clear
                        boundaries.
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                viewport={{ once: true }}
              >
                <Card className="p-6 h-full">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                      <i className="devicon-typescript-original text-4xl text-blue-600 dark:text-blue-400"></i>
                    </div>
                    <div>
                      <h6 className="font-semibold text-lg">
                        <LinkPreview
                          url="https://typescriptlang.org"
                          className="hover:text-primary transition-colors"
                        >
                          TypeScript
                        </LinkPreview>
                      </h6>
                      <p className="text-sm text-muted-foreground mt-2">
                        Full type safety with strict configuration and exceptional developer
                        experience.
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Frontend & Framework Row */}
          <div className="mb-12">
            <h5 className="text-xl font-semibold mb-6 text-center">Frontend & Framework</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="p-6 h-full">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="p-3 bg-black dark:bg-white/20 rounded-lg">
                    <i className="devicon-nextjs-original text-4xl text-white dark:text-white"></i>
                  </div>
                  <div>
                    <h6 className="font-semibold text-lg">
                      <LinkPreview
                        url="https://nextjs.org"
                        className="hover:text-primary transition-colors"
                      >
                        Next.js 15 with App Router
                      </LinkPreview>
                    </h6>
                    <p className="text-sm text-muted-foreground mt-2">
                      React Server Components, streaming, and modern routing patterns for optimal
                      performance.
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 h-full">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="p-3 bg-cyan-100 dark:bg-cyan-900/20 rounded-lg">
                    <i className="devicon-tailwindcss-original text-4xl text-cyan-600 dark:text-cyan-400"></i>
                  </div>
                  <div>
                    <h6 className="font-semibold text-lg">
                      <LinkPreview
                        url="https://ui.shadcn.com"
                        className="hover:text-primary transition-colors"
                      >
                        Shadcn/ui Components
                      </LinkPreview>
                    </h6>
                    <p className="text-sm text-muted-foreground mt-2">
                      Beautiful, accessible UI components built on Tailwind CSS and Radix
                      primitives.
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 h-full">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="p-3 bg-indigo-100 dark:bg-indigo-900/20 rounded-lg">
                    <Target className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div>
                    <h6 className="font-semibold text-lg">
                      <LinkPreview
                        url="https://motion.dev"
                        className="hover:text-primary transition-colors"
                      >
                        Motion/React
                      </LinkPreview>
                    </h6>
                    <p className="text-sm text-muted-foreground mt-2">
                      Smooth animations and interactive user experiences with performance-optimized
                      motion.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* AI & Intelligence Row */}
          <div className="mb-12">
            <h5 className="text-xl font-semibold mb-6 text-center">AI & Intelligence</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="p-6 h-full">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="p-3 bg-emerald-100 dark:bg-emerald-900/20 rounded-lg">
                    <Bot className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <h6 className="font-semibold text-lg">
                      <LinkPreview
                        url="https://sdk.vercel.ai"
                        className="hover:text-primary transition-colors"
                      >
                        Vercel AI SDK
                      </LinkPreview>
                    </h6>
                    <p className="text-sm text-muted-foreground mt-2">
                      Multi-provider support (OpenAI, Anthropic, Google AI) with streaming
                      responses.
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 h-full">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="p-3 bg-cyan-100 dark:bg-cyan-900/20 rounded-lg">
                    <FileCode className="h-8 w-8 text-cyan-600 dark:text-cyan-400" />
                  </div>
                  <div>
                    <h6 className="font-semibold text-lg">Text & Image Generation</h6>
                    <p className="text-sm text-muted-foreground mt-2">
                      Complete AI content creation capabilities with multiple model providers and
                      formats.
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 h-full">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="p-3 bg-violet-100 dark:bg-violet-900/20 rounded-lg">
                    <Shield className="h-8 w-8 text-violet-600 dark:text-violet-400" />
                  </div>
                  <div>
                    <h6 className="font-semibold text-lg">
                      <LinkPreview
                        url="https://claude.ai/code"
                        className="hover:text-primary transition-colors"
                      >
                        Claude Code MCP
                      </LinkPreview>
                    </h6>
                    <p className="text-sm text-muted-foreground mt-2">
                      Context-aware AI with full codebase understanding and specialized
                      integrations.
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 h-full">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="p-3 bg-amber-100 dark:bg-amber-900/20 rounded-lg">
                    <Users className="h-8 w-8 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <h6 className="font-semibold text-lg">Specialized AI Agents</h6>
                    <p className="text-sm text-muted-foreground mt-2">
                      Multiple configured subagents for different workflows and development tasks.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Database & Storage Row */}
          <div className="mb-12">
            <h5 className="text-xl font-semibold mb-6 text-center">Database & Storage</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="p-6 h-full">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                    <i className="devicon-postgresql-original text-4xl text-blue-600 dark:text-blue-400"></i>
                  </div>
                  <div>
                    <h6 className="font-semibold text-lg">
                      <LinkPreview
                        url="https://neon.tech"
                        className="hover:text-primary transition-colors"
                      >
                        Neon PostgreSQL
                      </LinkPreview>
                    </h6>
                    <p className="text-sm text-muted-foreground mt-2">
                      Serverless Postgres with database branching for safe development workflows.
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 h-full">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                    <Server className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h6 className="font-semibold text-lg">
                      <LinkPreview
                        url="https://orm.drizzle.team"
                        className="hover:text-primary transition-colors"
                      >
                        Drizzle ORM
                      </LinkPreview>
                    </h6>
                    <p className="text-sm text-muted-foreground mt-2">
                      Type-safe database queries with migrations and schema management built-in.
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 h-full">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="p-3 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                    <Database className="h-8 w-8 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <h6 className="font-semibold text-lg">
                      <LinkPreview
                        url="https://cloudflare.com/products/r2"
                        className="hover:text-primary transition-colors"
                      >
                        Cloudflare R2
                      </LinkPreview>
                    </h6>
                    <p className="text-sm text-muted-foreground mt-2">
                      Object storage for file uploads and media management with S3-compatible API.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* File Management Row */}
          <div className="mb-12">
            <h5 className="text-xl font-semibold mb-6 text-center">File Management</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-6 h-full">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
                    <Target className="h-8 w-8 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h6 className="font-semibold text-lg">
                      <LinkPreview
                        url="https://uppy.io"
                        className="hover:text-primary transition-colors"
                      >
                        Uppy 5.0 File Uploads
                      </LinkPreview>
                    </h6>
                    <p className="text-sm text-muted-foreground mt-2">
                      Complete upload solution with security validation, resumable uploads, and
                      progress tracking.
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 h-full">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                    <Layout className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h6 className="font-semibold text-lg">Multiple Upload Methods</h6>
                    <p className="text-sm text-muted-foreground mt-2">
                      Dashboard, dropzone, and button interfaces with file previews and validation.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Testing & Quality Row */}
          <div className="mb-12">
            <h5 className="text-xl font-semibold mb-6 text-center">Testing & Quality</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="p-6 h-full">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="p-3 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
                    <i className="devicon-vitest-original text-4xl text-yellow-600 dark:text-yellow-400"></i>
                  </div>
                  <div>
                    <h6 className="font-semibold text-lg">
                      <LinkPreview
                        url="https://vitest.dev"
                        className="hover:text-primary transition-colors"
                      >
                        Vitest Testing
                      </LinkPreview>
                    </h6>
                    <p className="text-sm text-muted-foreground mt-2">
                      Modern unit and integration testing with fast execution and great developer
                      experience.
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 h-full">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="p-3 bg-cyan-100 dark:bg-cyan-900/20 rounded-lg">
                    <Server className="h-8 w-8 text-cyan-600 dark:text-cyan-400" />
                  </div>
                  <div>
                    <h6 className="font-semibold text-lg">Supertest API Testing</h6>
                    <p className="text-sm text-muted-foreground mt-2">
                      Comprehensive API endpoint testing with authentication and validation
                      coverage.
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 h-full">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
                    <i className="devicon-playwright-original text-4xl text-green-600 dark:text-green-400"></i>
                  </div>
                  <div>
                    <h6 className="font-semibold text-lg">
                      <LinkPreview
                        url="https://playwright.dev"
                        className="hover:text-primary transition-colors"
                      >
                        Playwright E2E
                      </LinkPreview>
                    </h6>
                    <p className="text-sm text-muted-foreground mt-2">
                      Browser automation for reliable end-to-end testing across all platforms.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Communication & Analytics Row */}
          <div className="mb-12">
            <h5 className="text-xl font-semibold mb-6 text-center">Communication & Analytics</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-6 h-full">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-lg">
                    <Users className="h-8 w-8 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <h6 className="font-semibold text-lg">
                      <LinkPreview
                        url="https://resend.com"
                        className="hover:text-primary transition-colors"
                      >
                        Resend Email Service
                      </LinkPreview>
                    </h6>
                    <p className="text-sm text-muted-foreground mt-2">
                      Professional email delivery with templates, automation, and deliverability
                      tracking.
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 h-full">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="p-3 bg-indigo-100 dark:bg-indigo-900/20 rounded-lg">
                    <Target className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div>
                    <h6 className="font-semibold text-lg">
                      <LinkPreview
                        url="https://umami.is"
                        className="hover:text-primary transition-colors"
                      >
                        Umami Analytics
                      </LinkPreview>
                    </h6>
                    <p className="text-sm text-muted-foreground mt-2">
                      Privacy-focused, open-source website analytics with real-time insights.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Infrastructure & Observability Row */}
          <div>
            <h5 className="text-xl font-semibold mb-6 text-center">
              Infrastructure & Observability
            </h5>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="p-6 h-full">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="p-3 bg-black dark:bg-white/20 rounded-lg">
                    <i className="devicon-vercel-original text-4xl text-white dark:text-white"></i>
                  </div>
                  <div>
                    <h6 className="font-semibold text-lg">
                      <LinkPreview
                        url="https://vercel.com"
                        className="hover:text-primary transition-colors"
                      >
                        Vercel Hosting
                      </LinkPreview>
                    </h6>
                    <p className="text-sm text-muted-foreground mt-2">
                      Zero-config deployments with edge functions, global CDN, and automatic
                      scaling.
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 h-full">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="p-3 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
                    <MonitorSpeaker className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <div>
                    <h6 className="font-semibold text-lg">
                      <LinkPreview
                        url="https://langfuse.com"
                        className="hover:text-primary transition-colors"
                      >
                        Langfuse Observability
                      </LinkPreview>
                    </h6>
                    <p className="text-sm text-muted-foreground mt-2">
                      AI operation tracking with comprehensive telemetry and performance analytics.
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 h-full">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="p-3 bg-rose-100 dark:bg-rose-900/20 rounded-lg">
                    <AlertTriangle className="h-8 w-8 text-rose-600 dark:text-rose-400" />
                  </div>
                  <div>
                    <h6 className="font-semibold text-lg">Pino Structured Logging</h6>
                    <p className="text-sm text-muted-foreground mt-2">
                      Production-grade JSON logging for debugging, monitoring, and observability.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Comparison Section */}
      <section className="relative overflow-hidden py-24 sm:py-32 bg-muted/30">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
              Get a Professional Architecture, Not Just a Boilerplate
            </h2>
            <p className="text-lg text-muted-foreground">
              Why pay for patterns that create technical debt? Get a production-ready foundation for
              free.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Other Boilerplates */}
            <Card className="relative border-neutral-200 dark:border-neutral-800 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <div className="absolute top-4 right-4">
                <Badge variant="secondary" className="text-xs">
                  High Hidden Costs
                </Badge>
              </div>

              <CardHeader className="text-center pb-4">
                <CardTitle className="text-lg text-muted-foreground mb-3">
                  Other Boilerplates
                </CardTitle>
                <div className="relative">
                  <div className="text-5xl font-bold text-muted-foreground mb-2">$199-$299</div>
                </div>
                <CardDescription className="text-muted-foreground font-medium">
                  One-time payment • Endless refactoring
                </CardDescription>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="space-y-4">
                  <div className="bg-neutral-100/50 dark:bg-neutral-800/10 rounded-lg p-4">
                    <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      What you actually get:
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-start gap-2">
                        <X className="h-3 w-3 text-muted-foreground mt-1 flex-shrink-0" />
                        <span>Pre-configured services without a testing strategy.</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <X className="h-3 w-3 text-muted-foreground mt-1 flex-shrink-0" />
                        <span>No production-grade logging or monitoring in place.</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <X className="h-3 w-3 text-muted-foreground mt-1 flex-shrink-0" />
                        <span>Lacks modern agentic coding systems for AI.</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <X className="h-3 w-3 text-muted-foreground mt-1 flex-shrink-0" />
                        <span>Maintenance overhead that accumulates from day one.</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <X className="h-3 w-3 text-muted-foreground mt-1 flex-shrink-0" />
                        <span>A major refactor is required before you can truly scale.</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Our Spec-Driven Kit */}
            <Card className="relative bg-background border-2 border-primary shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                <Badge className="bg-primary text-primary-foreground px-6 py-2 text-sm font-bold shadow-lg">
                  <Star className="w-4 h-4 mr-2" />
                  PROFESSIONAL GRADE
                </Badge>
              </div>

              <CardHeader className="text-center pt-10 pb-6">
                <CardTitle className="text-xl text-primary mb-3">Spec-Driven Starter Kit</CardTitle>
                <div className="relative">
                  <div className="text-6xl font-bold text-primary mb-2">FREE</div>
                  <div className="text-sm text-primary font-medium">
                    Open source forever • No hidden costs
                  </div>
                </div>
                <CardDescription className="text-lg font-medium">
                  Save $299 + months of development time
                </CardDescription>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="space-y-4">
                  <div className="bg-neutral-100/50 dark:bg-neutral-800/10 rounded-lg p-4">
                    <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                      <Rocket className="h-4 w-4" />
                      What you actually get:
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-start gap-2">
                        <Check className="h-3 w-3 text-primary mt-1 flex-shrink-0" />
                        <span className="font-medium">
                          A spec-driven architecture that scales seamlessly.
                        </span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Check className="h-3 w-3 text-primary mt-1 flex-shrink-0" />
                        <span className="font-medium">
                          A complete test-driven development methodology.
                        </span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Check className="h-3 w-3 text-primary mt-1 flex-shrink-0" />
                        <span className="font-medium">
                          Production-grade logging and monitoring.
                        </span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Check className="h-3 w-3 text-primary mt-1 flex-shrink-0" />
                        <span className="font-medium">
                          Agentic coding systems for perfect AI context.
                        </span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Check className="h-3 w-3 text-primary mt-1 flex-shrink-0" />
                        <span className="font-medium">Zero maintenance overhead, by design.</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Check className="h-3 w-3 text-primary mt-1 flex-shrink-0" />
                        <span className="font-medium">Production-ready from day one.</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <Button
                      asChild
                      className="w-full h-14 text-lg bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <Link href="/playground/generate-text">
                        Start Building for Free
                        <Rocket className="ml-2 h-6 w-6" />
                      </Link>
                    </Button>
                    <p className="text-center text-xs text-muted-foreground mt-2">
                      No credit card required • Available immediately
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-muted-foreground">
              Everything you need to know about building a real business with AI.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Accordion type="single" collapsible className="space-y-4" defaultValue="item-1">
              <AccordionItem value="item-1" className="border rounded-lg px-6">
                <AccordionTrigger className="text-left">
                  How is this different from other boilerplates?
                </AccordionTrigger>
                <AccordionContent>
                  Most boilerplates simply hand you a set of tools. We give you a methodology. Our
                  foundation is domain-driven modules with dependency injection, so your business
                  logic stays testable and independent. On top of that, Claude Code brings context
                  awareness—direct access to your database, logs, and even deployments—so AI works
                  with your actual system, not in isolation. Finally, our spec-driven workflow turns
                  requirements into Gherkin specs, which become tests, then implementations. This
                  guarantees that every feature is consistent, verifiable, and aligned with your
                  specs from day one.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="border rounded-lg px-6">
                <AccordionTrigger className="text-left">
                  How does the modular architecture scale?
                </AccordionTrigger>
                <AccordionContent>
                  The domain-driven modular architecture organizes business logic into separate
                  modules (users, posts, etc.). Each module has its own service layer, schema, and
                  types. This approach allows teams to work independently on different features
                  without conflicts, makes testing easier through isolation, and enables horizontal
                  scaling as your business grows.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="border rounded-lg px-6">
                <AccordionTrigger className="text-left">
                  What makes this "spec-driven" development?
                </AccordionTrigger>
                <AccordionContent>
                  Instead of writing code directly, you first define requirements using Gherkin
                  specifications. These clear, human-readable specs guide AI implementation,
                  ensuring consistency across features. When you need to add functionality, you
                  write the specification first, then use AI tools to implement it exactly according
                  to your documented requirements.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4" className="border rounded-lg px-6">
                <AccordionTrigger className="text-left">
                  How do you handle email delivery and templates?
                </AccordionTrigger>
                <AccordionContent>
                  We integrate with Resend for professional email delivery. This includes
                  transactional emails, marketing campaigns, and automated workflows. Resend
                  provides excellent deliverability rates, built-in analytics, and a
                  developer-friendly API. Email templates are managed through their dashboard or
                  programmatically through their React Email integration.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5" className="border rounded-lg px-6">
                <AccordionTrigger className="text-left">
                  Can multiple developers work on this effectively?
                </AccordionTrigger>
                <AccordionContent>
                  Absolutely. The dependency injection pattern and modular architecture enable team
                  collaboration. Developers can work on different modules simultaneously without
                  conflicts. The service layer abstracts business logic, making it easy to mock
                  dependencies for testing. Clear specifications prevent miscommunication about
                  requirements.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-6" className="border rounded-lg px-6">
                <AccordionTrigger className="text-left">
                  Is there comprehensive documentation?
                </AccordionTrigger>
                <AccordionContent>
                  Yes! Full documentation is available covering architecture patterns, API design,
                  database strategies, testing approaches, and deployment guides. Each major
                  component has detailed guides with examples, best practices, and troubleshooting
                  tips. The documentation is continuously updated with new patterns and learnings.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-7" className="border rounded-lg px-6">
                <AccordionTrigger className="text-left">
                  How do you manage AI costs in production?
                </AccordionTrigger>
                <AccordionContent>
                  The AI SDK supports multiple providers (OpenAI, Anthropic, Google AI), allowing
                  you to switch based on cost and performance. Built-in telemetry tracks usage and
                  costs per operation. You can implement rate limiting, caching for common requests,
                  and use smaller models for development. The observability stack helps identify
                  expensive operations for optimization.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-8" className="border rounded-lg px-6">
                <AccordionTrigger className="text-left">
                  What's the database strategy for scaling?
                </AccordionTrigger>
                <AccordionContent>
                  Neon provides serverless PostgreSQL with database branching for safe development.
                  Each feature branch can have its own database branch. The connection pooling and
                  auto-scaling handle traffic spikes automatically. Drizzle ORM provides type-safe
                  queries and migration management. The modular service layer makes it easy to
                  optimize queries per domain.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-9" className="border rounded-lg px-6">
                <AccordionTrigger className="text-left">
                  How do you handle file uploads securely?
                </AccordionTrigger>
                <AccordionContent>
                  Uppy 5.0 provides comprehensive file validation including MIME type checking, file
                  size limits, extension filtering, and malware detection patterns. Files are
                  uploaded to Cloudflare R2 with secure filename generation to prevent path
                  traversal attacks. The validation layer blocks dangerous file types and provides
                  detailed error messages for rejected uploads.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-10" className="border rounded-lg px-6">
                <AccordionTrigger className="text-left">
                  What testing approach ensures code quality?
                </AccordionTrigger>
                <AccordionContent>
                  A multi-layer testing strategy using Vitest for unit/integration tests, Supertest
                  for API testing, and Playwright for end-to-end testing. The dependency injection
                  pattern makes services easy to test in isolation. Gherkin specifications help
                  ensure tests match requirements. Test containers provide real PostgreSQL for
                  integration testing while maintaining speed.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-11" className="border rounded-lg px-6">
                <AccordionTrigger className="text-left">
                  How does authentication work across the stack?
                </AccordionTrigger>
                <AccordionContent>
                  Better-auth provides production-ready authentication with email/password and OAuth
                  providers. Session management is handled automatically with secure cookies. API
                  routes use higher-order functions for authentication checking. The system is
                  tested against 100+ edge cases including session hijacking, CSRF attacks, and
                  account enumeration.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-12" className="border rounded-lg px-6">
                <AccordionTrigger className="text-left">
                  What's the deployment and monitoring strategy?
                </AccordionTrigger>
                <AccordionContent>
                  Vercel provides zero-config deployments with automatic scaling and global CDN.
                  Langfuse tracks AI operations with comprehensive telemetry including costs,
                  performance, and error rates. Structured logging with Pino provides detailed
                  debugging information. Umami analytics gives privacy-focused insights into user
                  behavior without tracking personal data.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </motion.div>
        </div>
      </section>

      {/* Founder Story Section */}
      <section className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8 bg-muted/30">
        <div className="mx-auto max-w-4xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="mx-auto mt-8">
                <PixelatedCanvas
                  src="/johannes.png"
                  width={400}
                  height={600}
                  cellSize={3}
                  dotScale={0.9}
                  shape="square"
                  backgroundColor="#000000"
                  dropoutStrength={0.1}
                  interactive
                  distortionStrength={0.1}
                  distortionRadius={50}
                  distortionMode="repel"
                  followSpeed={0.2}
                  jitterStrength={4}
                  jitterSpeed={1}
                  sampleAverage
                  className="rounded-xl shadow-lg"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div>
                <Badge variant="secondary" className="mb-4">
                  <Users className="w-3 h-3 mr-1" />
                  From Developer, For Developers
                </Badge>
                <h2 className="text-3xl font-bold tracking-tight mb-4">
                  I got tired of "vibe-driven" development.
                </h2>
              </div>

              <div className="space-y-4 text-muted-foreground">
                <p>
                  AI-generated code without proper instruction and leading can harm more than
                  benefit. After suffering through this myself and drawing from my background in
                  software engineering, I realized we needed a better approach.
                </p>
                <p>
                  The challenge isn't AI itself—it's how we guide and structure its output. Without
                  clear specifications and architectural guidelines, AI creates beautiful code that
                  becomes a maintenance nightmare.
                </p>
                <p>
                  That's why I came up with this starter kit—to find a better way to use modern
                  agentic coding systems. It provides the foundation to build real, scalable
                  businesses with AI, not just fragile demos.
                </p>
              </div>

              <div className="space-y-4">
                <div className="text-sm text-muted-foreground">
                  Join me in building the next generation of AI software—the right way. Your future
                  self will thank you when you're scaling effortlessly while others are drowning in
                  maintenance.
                </div>

                <div className="pt-4 border-t border-border">
                  <p className="text-sm font-medium mb-3">
                    Thanks -{' '}
                    <LinkPreview
                      url="hhttps://www.linkedin.com/in/johannes-hayer-b8253a294/"
                      className="font-bold hover:text-primary transition-colors text-blue-800"
                    >
                      Johannes
                    </LinkPreview>
                  </p>
                  <p className="text-sm text-muted-foreground mb-3">
                    If you have questions, join our community of AI Builders
                  </p>
                  <Button asChild variant="outline" size="sm">
                    <Link
                      href="https://www.skool.com/ai-builders-6997/about?ref=873c5678d6d845feba1c23c6dbccdce3"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2"
                    >
                      Join AI Builders Community
                      <Users className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
