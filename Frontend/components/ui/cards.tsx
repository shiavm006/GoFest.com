import React from "react";
import { cn } from "@/lib/utils";

export type FestCard = {
  title: string;
  image: string;
  category: string;
  description?: string;
  author?: string;
  role?: string;
};

const defaultCards: FestCard[] = [
  {
    title: "TechFusion 2025",
    image: "https://images.unsplash.com/photo-1590650516494-0c8e4a4dd67e?w=1200&h=800&auto=format&fit=crop&q=60",
    category: "Technology",
    description: "national-level innovation challenge, hackathons, keynote talks, and expo.",
    author: "Ananya Gupta",
    role: "Head, Robotics Society – IIT Delhi",
  },
  {
    title: "Srijan Cultural Fest",
    image: "https://images.unsplash.com/photo-1714974528646-ea024a3db7a7?w=1200&h=800&auto=format&fit=crop&q=60",
    category: "Culture",
    description: "music, dance, theatre and design showcases across three days.",
    author: "Rohan Bhattacharya",
    role: "Cultural Secretary – BITS Pilani",
  },
  {
    title: "Spectrum Sports Meet",
    image: "https://images.unsplash.com/photo-1713947501966-34897f21162e?w=1200&h=800&auto=format&fit=crop&q=60",
    category: "Sports",
    description: "inter-college track, field and team events with live standings.",
    author: "Natasha Singh",
    role: "Captain – DU Trailblazers",
  },
];

interface FeaturedFestCardsProps {
  heading?: string;
  description?: string;
  events?: FestCard[];
  onExplore?: (title: string) => void;
  headingClassName?: string;
  descriptionClassName?: string;
  containerClassName?: string;
}

export function FeaturedFestCards({
  heading = "Featured events on gofest",
  description = "Discover college fests happening across campuses.",
  events = defaultCards,
  onExplore,
  headingClassName,
  descriptionClassName,
  containerClassName,
}: FeaturedFestCardsProps) {
  return (
    <section className={cn("fest-card flex flex-col w-full", containerClassName)}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
        .fest-card * { font-family: 'Poppins', sans-serif; }
      `}</style>

      <header className="flex flex-col gap-2">
        <h2 className={cn("text-3xl font-semibold text-white", headingClassName)}>{heading}</h2>
        <p className={cn("text-sm text-gray-500 max-w-xl", descriptionClassName)}>{description}</p>
      </header>

      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {events.map((event) => (
          <article
            key={event.title}
            className="flex flex-col gap-4 rounded-3xl border border-gray-200 bg-gray-50 p-5 backdrop-blur-lg transition duration-300 hover:border-white/25 hover:shadow-[0_20px_40px_-24px_rgba(15,23,42,0.45)]"
          >
            <div className="overflow-hidden rounded-2xl">
              <img
                src={event.image}
                alt={event.title}
                className="h-52 w-full object-cover transition duration-500 hover:scale-[1.01]"
              />
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between text-xs uppercase tracking-[0.32em] text-white/50">
                <span>{event.category}</span>
                <span className="flex-none h-px w-16 bg-white/15" />
              </div>

              <h3 className="text-lg font-semibold text-white leading-snug">
                {event.title}
              </h3>

              {event.description && (
                <p className="text-xs text-gray-500 leading-relaxed">
                  {event.description}
                </p>
              )}

              {event.author && (
                <p className="text-[11px] text-white/45 uppercase tracking-[0.2em]">
                  {event.author}
                  {event.role ? ` — ${event.role}` : ""}
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={() => onExplore?.(event.title)}
              className="inline-flex w-max items-center justify-center gap-2 rounded-full border border-white/30 px-5 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-white transition hover:border-white/60 hover:bg-white/10"
            >
              Explore
              <span className="text-sm">→</span>
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}

export default FeaturedFestCards;
