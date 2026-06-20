"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, CornerDownLeft, Search, Sparkles } from "lucide-react";

export type CarouselTask = {
  id: string;
  category: string;
  headline: string;
  title: string;
  description: string;
  commands: readonly [string, string, string, string];
};

export const carouselTasks: readonly CarouselTask[] = [
  {
    id: "video",
    category: "Video",
    headline: "edit your videos",
    title: "Edit a video",
    description: "Find practical tools for cuts, captions, sound, and clean exports.",
    commands: ["Describe your video", "Find matching tools", "Compare editing options", "Open the best editor"]
  },
  {
    id: "apps",
    category: "Code",
    headline: "build your apps",
    title: "Build an app",
    description: "Move from an idea to working code with planning, building, and testing help.",
    commands: ["Describe your app", "Find coding tools", "Compare build workflows", "Start building"]
  },
  {
    id: "scripts",
    category: "Writing",
    headline: "write your scripts",
    title: "Write a script",
    description: "Shape outlines, scenes, dialogue, and revisions without losing your voice.",
    commands: ["Choose a format", "Find writing tools", "Compare drafting support", "Open the best writer"]
  },
  {
    id: "visuals",
    category: "Design",
    headline: "design your visuals",
    title: "Design a visual",
    description: "Create clear images, concepts, and production-ready creative assets.",
    commands: ["Describe your visual", "Find design tools", "Compare styles and exports", "Start designing"]
  },
  {
    id: "projects",
    category: "Planning",
    headline: "plan your projects",
    title: "Plan a project",
    description: "Turn goals into roadmaps, focused tasks, and an achievable next step.",
    commands: ["Define your goal", "Find planning tools", "Compare project workflows", "Open the best planner"]
  },
  {
    id: "automation",
    category: "Automation",
    headline: "automate your work",
    title: "Automate a workflow",
    description: "Connect repeated tasks, triggers, and integrations into a reliable flow.",
    commands: ["Describe repeated work", "Find automation tools", "Compare integrations", "Set up the workflow"]
  }
] as const;

function wrappedIndex(index: number) {
  return (index + carouselTasks.length) % carouselTasks.length;
}

export function getCarouselWindow(activeIndex: number) {
  const active = wrappedIndex(activeIndex);
  return {
    previous: carouselTasks[wrappedIndex(active - 1)],
    active: carouselTasks[active],
    next: carouselTasks[wrappedIndex(active + 1)]
  };
}

type HeroFocusCarouselProps = {
  telegramUrl?: string;
};

export function HeroFocusCarousel({ telegramUrl = "#telegram" }: HeroFocusCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isDocumentHidden, setIsDocumentHidden] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [timerVersion, setTimerVersion] = useState(0);
  const windowTasks = getCarouselWindow(activeIndex);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setPrefersReducedMotion(mediaQuery.matches);
    updatePreference();
    mediaQuery.addEventListener("change", updatePreference);
    return () => mediaQuery.removeEventListener("change", updatePreference);
  }, []);

  useEffect(() => {
    const updateVisibility = () => setIsDocumentHidden(document.hidden);
    document.addEventListener("visibilitychange", updateVisibility);
    return () => document.removeEventListener("visibilitychange", updateVisibility);
  }, []);

  useEffect(() => {
    if (isPaused || isDocumentHidden || prefersReducedMotion) return;
    const timer = window.setInterval(() => {
      setActiveIndex((index) => wrappedIndex(index + 1));
    }, 5000);
    return () => window.clearInterval(timer);
  }, [isPaused, isDocumentHidden, prefersReducedMotion, timerVersion]);

  function selectTask(task: CarouselTask) {
    const index = carouselTasks.findIndex((candidate) => candidate.id === task.id);
    if (index < 0) return;
    setActiveIndex(index);
    setTimerVersion((version) => version + 1);
  }

  return (
    <section className="page-shell hero scroll-scene entrance-scene">
      <div className="hero-copy scroll-reveal">
        <h1 className="carousel-headline">
          <span>Find tools that</span>
          <span className="hero-changing-text" key={windowTasks.active.id}>{windowTasks.active.headline}.</span>
        </h1>
        <p>
          Skillhub helps you discover simple AI tools for video, code, writing, planning, and everyday creative work.
        </p>
        <form className="hero-search" action="/marketplace">
          <Search size={18} aria-hidden="true" />
          <input name="q" placeholder="Search skills, MCP, prompts, repos..." aria-label="Search marketplace" />
          <button type="submit">
            <span>Search</span>
            <CornerDownLeft size={15} aria-hidden="true" />
          </button>
        </form>
        <div className="hero-actions">
          <Link className="button primary" href="/marketplace">
            Explore tools <ArrowRight size={18} aria-hidden="true" />
          </Link>
          <a className="button" href={telegramUrl} target="_blank" rel="noreferrer">
            Open Telegram <Sparkles size={18} aria-hidden="true" />
          </a>
        </div>
      </div>

      <div
        className="hero-visual parallax-stage ambient-console focus-carousel"
        aria-label="Examples of work Skillhub tools can help with"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onFocusCapture={() => setIsPaused(true)}
        onBlurCapture={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) setIsPaused(false);
        }}
      >
        <div className="console-chip-row" aria-hidden="true">
          {carouselTasks.map((task) => (
            <span className={task.id === windowTasks.active.id ? "active" : ""} key={task.id}>{task.category}</span>
          ))}
        </div>

        <div className="focus-carousel-track">
          {(["previous", "active", "next"] as const).map((position) => {
            const task = windowTasks[position];
            const isActive = position === "active";
            return (
              <button
                className={`focus-task-card ${position}`}
                type="button"
                aria-pressed={isActive}
                aria-label={`${isActive ? "Selected" : "Show"}: ${task.title}`}
                onClick={() => selectTask(task)}
                key={`${position}-${task.id}`}
              >
                <span>{task.category}</span>
                <strong>{task.title}</strong>
                <p>{task.description}</p>
              </button>
            );
          })}
        </div>

        <div className="terminal-card carousel-commands" key={`commands-${windowTasks.active.id}`}>
          {windowTasks.active.commands.map((command, index) => (
            <div className="terminal-line carousel-command" style={{ "--command-index": index } as React.CSSProperties} key={command}>
              <strong>{String(index + 1).padStart(2, "0")}</strong>
              <span>{command}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
