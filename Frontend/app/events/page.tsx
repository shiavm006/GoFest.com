"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import SuggestiveSearch from "@/components/ui/suggestive-search";
import { CartoonButton } from "@/components/ui/cartoon-button";
import { ProfileButton } from "@/components/ui/profile-button";
import Pagination from "@/components/ui/pagination";
import { ArrowUpRight, Loader2 } from "lucide-react";
import { getAuthToken, fetchFests, type Fest } from "@/lib/api";

// Fallback fests for when backend is empty or unreachable (also exported for detail page)
export const fallbackFests = [
  {
    title: "TechFusion 2025",
    category: "Technology",
    image: "https://images.unsplash.com/photo-1590650516494-0c8e4a4dd67e?w=1200&h=800&auto=format&fit=crop&q=60",
    description: "national-level innovation challenge with hackathons, keynote talks, and an innovation expo.",
    author: "Ananya Gupta",
    role: "Head, Robotics Society – IIT Delhi",
  },
  {
    title: "Srijan Cultural Fest",
    category: "Culture",
    image: "https://images.unsplash.com/photo-1714974528646-ea024a3db7a7?w=1200&h=800&auto=format&fit=crop&q=60",
    description: "three-day celebration of music, theatre, design and street performances across campus.",
    author: "Rohan Bhattacharya",
    role: "Cultural Secretary – BITS Pilani",
  },
  {
    title: "Spectrum Sports Meet",
    category: "Sports",
    image: "https://images.unsplash.com/photo-1713947501966-34897f21162e?w=1200&h=800&auto=format&fit=crop&q=60",
    description: "inter-college track, field and team championships with live leaderboards and analytics.",
    author: "Natasha Singh",
    role: "Captain – DU Trailblazers",
  },
  {
    title: "Battle of Bands",
    category: "Music",
    image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1200&h=800&auto=format&fit=crop&q=80",
    description: "showcase of indie college bands, sound labs, and late-night jam sessions.",
    author: "Yuvraj Mehta",
    role: "Lead Guitarist – VIT Vellore",
  },
  {
    title: "Startup Summit",
    category: "Business",
    image: "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?w=1200&h=800&auto=format&fit=crop&q=60",
    description: "investor pitch rounds, workshops, and mentorship clinics for campus founders.",
    author: "Harini Rao",
    role: "President – IIM Bangalore E-Cell",
  },
  {
    title: "Art Carnival",
    category: "Arts",
    image: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=1200&h=800&auto=format&fit=crop&q=60",
    description: "immersive installations, live murals, and cross-school design collaborations.",
    author: "Mira Fernandes",
    role: "Curator – NID Ahmedabad",
  },
  {
    title: "Mood Indigo",
    category: "Culture",
    image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1200&h=800&auto=format&fit=crop&q=60",
    description: "asia's largest college cultural festival featuring international artists, competitions, and workshops.",
    author: "Arjun Kapoor",
    role: "Festival Head – IIT Bombay",
  },
  {
    title: "Rendezvous",
    category: "Culture",
    image: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=1200&h=800&auto=format&fit=crop&q=60",
    description: "four-day cultural extravaganza with pro-nites, competitions, and celebrity performances.",
    author: "Priya Sharma",
    role: "Cultural Coordinator – IIT Delhi",
  },
  {
    title: "Techfest",
    category: "Technology",
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200&h=800&auto=format&fit=crop&q=60",
    description: "asia's largest technical festival with robotics competitions, tech exhibitions, and industry talks.",
    author: "Rahul Verma",
    role: "Technical Secretary – IIT Bombay",
  },
  {
    title: "Spring Fest",
    category: "Music",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200&h=800&auto=format&fit=crop&q=60",
    description: "premier music and cultural festival with live concerts, dj nights, and acoustic sessions.",
    author: "Kavya Nair",
    role: "Music Head – IIT Kharagpur",
  },
  {
    title: "E-Summit",
    category: "Business",
    image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1200&h=800&auto=format&fit=crop&q=60",
    description: "entrepreneurship summit with startup showcases, investor meets, and innovation challenges.",
    author: "Aditya Patel",
    role: "President – IIT Kanpur E-Cell",
  },
  {
    title: "Inter IIT Sports Meet",
    category: "Sports",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&h=800&auto=format&fit=crop&q=60",
    description: "premier inter-institute sports championship with multiple disciplines and fierce competition.",
    author: "Vikram Malhotra",
    role: "Sports Secretary – IIT Madras",
  },
  {
    title: "Kaleidoscope",
    category: "Arts",
    image: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=1200&h=800&auto=format&fit=crop&q=60",
    description: "multidisciplinary arts festival celebrating visual arts, photography, and digital media.",
    author: "Sneha Reddy",
    role: "Arts Director – NIFT Delhi",
  },
];

const ITEMS_PER_PAGE = 6;

export default function EventsPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [fests, setFests] = useState<Fest[]>([]);
  const [totalFests, setTotalFests] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [useFallback, setUseFallback] = useState(false);

  useEffect(() => {
    const token = getAuthToken();
    setIsLoggedIn(!!token);
  }, []);

  useEffect(() => {
    async function loadFests() {
      try {
        setIsLoading(true);
        setError(null);
        
        const data = await fetchFests({
          skip: (currentPage - 1) * ITEMS_PER_PAGE,
          limit: ITEMS_PER_PAGE,
          search: searchTerm || undefined,
        });

        if (data.fests.length === 0 && currentPage === 1 && !searchTerm) {
          setUseFallback(true);
        } else {
          setFests(data.fests);
          setTotalFests(data.total);
          setUseFallback(false);
        }
      } catch (err: any) {
        console.error("Failed to load fests:", err);
        setError(err.message);
        setUseFallback(true);
      } finally {
        setIsLoading(false);
      }
    }

    loadFests();
  }, [currentPage, searchTerm]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const totalPages = useFallback 
    ? Math.ceil(fallbackFests.length / ITEMS_PER_PAGE)
    : Math.ceil(totalFests / ITEMS_PER_PAGE);

  const displayFests = useFallback 
    ? fallbackFests.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)
    : fests;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleExplore = (slug: string) => {
    router.push(`/events/${slug}`);
  };

  const handleHostClick = () => {
    const token = getAuthToken();
    if (!token) {
      router.push("/");
    } else {
      router.push("/host");
    }
  };

  return (
    <div className="min-h-screen relative text-white">
      <div className="w-full absolute h-full z-0 bg-[radial-gradient(circle,_rgba(255,255,255,0.12)_1px,_transparent_1px)] opacity-20 [background-size:20px_20px]"/>
      
      <header className="sticky top-0 z-50 bg-black/60 backdrop-blur supports-[backdrop-filter]:bg-black/40 flex justify-between items-center px-8 py-6 gap-6 text-white">
        <Link href="/" className="text-2xl font-extrabold tracking-tight whitespace-nowrap">
          gofest.com
        </Link>
        
        <div className="flex-1 max-w-md">
          <SuggestiveSearch
            suggestions={[
              "Search for techfests",
              "Find cultural fests near you",
              "Explore college fests",
              "Discover sports tournaments"
            ]}
            effect="typewriter"
            className="w-full"
            onChange={setSearchTerm}
          />
        </div>

        <div className="flex items-center gap-2">
          <nav className="hidden md:flex gap-6 text-sm">
            <Link href="/" className="text-white/70 hover:text-white transition-colors">
              Home
            </Link>
            {!isLoggedIn && (
              <Link href="/login" className="text-white/70 hover:text-white transition-colors">
                Login
              </Link>
            )}
          </nav>
          <div className="flex items-center gap-2 scale-75">
            <CartoonButton label="HOST+" color="bg-white" onClick={handleHostClick} />
          </div>
          <ProfileButton />
        </div>
      </header>

      <main className="px-6 lg:px-16 py-12 relative z-10">
        <div className="mb-8">
          <h2 className="text-3xl font-semibold text-white text-left mb-3 md:mb-4 md:text-4xl">
            Featured events on gofest
          </h2>
          <p className="text-sm text-white/60 mt-2 max-w-2xl text-left">
            {useFallback 
              ? "Explore example fests. Create your own to see it here!"
              : "Explore stories from campuses using gofest to power their fests."}
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-12 h-12 animate-spin text-white/60" />
          </div>
        ) : displayFests.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl text-white/60 mb-4">
              {searchTerm ? "No fests found matching your search" : "No fests available yet"}
            </p>
            {!searchTerm && (
              <button
                onClick={handleHostClick}
                className="text-white/80 hover:text-white underline"
              >
                Be the first to host a fest!
              </button>
            )}
          </div>
        ) : (
          <>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {displayFests.map((event: any) => {
                const festSlug = useFallback 
                  ? event.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
                  : event.slug;
                
                return (
            <div
                    key={useFallback ? event.title : event._id}
              className="group flex flex-col justify-between cursor-pointer"
                    onClick={() => handleExplore(festSlug)}
            >
              <div>
                <div className="flex aspect-[3/2] overflow-clip rounded-xl mb-4">
                  <div className="flex-1">
                    <div className="relative h-full w-full origin-bottom transition duration-300 group-hover:scale-105">
                      <img
                        src={event.image}
                        alt={event.title}
                        className="h-full w-full object-cover object-center"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-2 line-clamp-3 break-words pt-2 text-lg font-medium md:text-xl lg:text-2xl text-white">
                {event.title}
              </div>

              {event.description && (
                <div className="mb-4 line-clamp-2 text-sm text-white/60 md:text-base">
                  {event.description}
                </div>
              )}

                    {(event.author || event.hostedBy) && (
                <div className="mb-4 text-[11px] text-white/45 uppercase tracking-[0.2em]">
                        {useFallback ? event.author : event.hostedBy?.name}
                        {event.role && ` — ${event.role}`}
                        {event.college && !useFallback && ` — ${event.college}`}
                </div>
              )}

              <div className="flex items-center text-sm text-white/70 group-hover:text-white transition-colors">
                Explore{" "}
                <ArrowUpRight className="ml-2 size-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </div>
            </div>
                );
              })}
        </div>
        
        {totalPages > 1 && (
          <div className="mt-12 flex justify-center">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

