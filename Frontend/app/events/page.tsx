"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import SuggestiveSearch from "@/components/ui/suggestive-search";
import { ProfileButton } from "@/components/ui/profile-button";
import Pagination from "@/components/ui/pagination";
import { ArrowUpRight, Loader2 } from "lucide-react";
import { PlaceCard } from "@/components/ui/card-22";
import { getAuthToken, fetchFests, type Fest } from "@/lib/api";



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

        setFests(data.fests);
        setTotalFests(data.total);
      } catch (err) {
        console.error("Failed to load fests:", err);
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Failed to load fests");
        }
      } finally {
        setIsLoading(false);
      }
    }

    loadFests();
  }, [currentPage, searchTerm]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const totalPages = Math.ceil(totalFests / ITEMS_PER_PAGE);

  const displayFests = fests;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleExplore = (slug: string) => {
    router.push(`/events/${slug}`);
  };

  return (
    <div className="min-h-screen relative bg-white">
      
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 flex justify-between items-center px-8 py-3 gap-6">
        <Link href="/" className="text-2xl font-extrabold tracking-tight whitespace-nowrap text-black">
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
            <Link href="/" className="text-black hover:text-gray-800 transition-colors">
              Home
            </Link>
            <Link href="/events" className="text-black hover:text-gray-800 transition-colors">
              Events
            </Link>
            <Link href="/host" className="text-black hover:text-gray-800 transition-colors">
              HOST
            </Link>
            {!isLoggedIn && (
              <Link href="/login" className="text-black hover:text-gray-800 transition-colors">
                Login
              </Link>
            )}
          </nav>
          <ProfileButton />
        </div>
      </header>

      <main className="px-6 lg:px-16 py-12 relative z-10">
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-12 h-12 animate-spin text-gray-600" />
        </div>
        ) : displayFests.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl text-gray-600 mb-4">
              {searchTerm ? "No fests found matching your search" : "No fests available yet"}
            </p>
            {!searchTerm && (
              <Link
                href="/host"
                className="text-gray-800 hover:text-black underline"
              >
                Be the first to host a fest!
              </Link>
            )}
                </div>
        ) : (
          <div className="flex gap-8">
            {/* Map Section - 30% */}
            <aside className="w-[30%] hidden lg:block">
              <div className="sticky top-24 h-[calc(100vh-150px)] min-h-[600px]">
                <iframe
                  className="h-full w-full"
                  frameBorder="0"
                  style={{ border: 0 }}
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3769.0!2d77.2090!3d28.6139!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cfd5b347ebbef%3A0x37107b149c0d4c65!2sNew%20Delhi%2C%20Delhi!5e0!3m2!1sen!2sin!4v1234567890"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Fest Locations Map"
                />
              </div>
            </aside>

            {/* Events List - 70% */}
            <div className="flex-1 lg:w-[70%]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              {displayFests.map((event: Fest) => {
                return (
                      <div key={event._id} onClick={() => handleExplore(event.slug)} className="cursor-pointer">
                        <PlaceCard
                          images={[event.image]}
                          tags={[event.category, event.location?.city || ""]}
                          rating={4.8}
                          title={event.title}
                          dateRange={event.date}
                          hostType={event.hostedBy?.college || "College fest"}
                          isTopRated={event.registrationsCount > 50}
                          description={event.description || ""}
                          pricePerNight={event.entryType === "Paid" ? event.entryFee || 0 : 0}
                        />
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
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

