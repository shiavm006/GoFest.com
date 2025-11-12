"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { allFests } from "../page";
import { CartoonButton } from "@/components/ui/cartoon-button";
import { ProfileButton } from "@/components/ui/profile-button";
import { ArrowLeft, MapPin, Calendar, Clock, Users, Mail, Phone, Instagram, Linkedin, ExternalLink, Download } from "lucide-react";
import { getAuthToken } from "@/lib/api";

const generateSlug = (title: string) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
};

export default function FestDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const fest = allFests.find((f) => generateSlug(f.title) === slug);

  const handleHostClick = () => {
    const token = getAuthToken();
    if (!token) {
      router.push("/");
    } else {
      router.push("/host");
    }
  };

  if (!fest) {
    return (
      <div className="min-h-screen relative text-white flex items-center justify-center">
        <div className="w-full absolute h-full z-0 bg-[radial-gradient(circle,_rgba(255,255,255,0.12)_1px,_transparent_1px)] opacity-20 [background-size:20px_20px]" />
        <div className="text-center relative z-10">
          <h1 className="text-2xl font-semibold mb-4 text-white">Fest not found</h1>
          <Link
            href="/events"
            className="text-white/70 hover:text-white transition-colors underline"
          >
            ← Back to events
          </Link>
        </div>
      </div>
    );
  }

  const festData = {
    ...fest,
    tagline: "Where innovation meets celebration",
    college: "IIT Delhi",
    date: "March 15-17, 2025",
    duration: "3 days",
    location: "IIT Delhi Campus, New Delhi",
    city: "New Delhi",
    state: "Delhi",
    entryType: "Free",
    expectedFootfall: "5000+ students",
    website: "https://techfusion.iitd.ac.in",
    email: "contact@techfusion.iitd.ac.in",
    phone: "+91 98765 43210",
    instagram: "@techfusion_iitd",
    linkedin: "techfusion-iitd",
    lat: 28.5450,
    lon: 77.1925,
    detailedDescription: `${fest.description} This fest brings together students from across the country to celebrate innovation, creativity, and collaboration. Join us for an unforgettable experience filled with competitions, workshops, performances, and networking opportunities.`,
    goals: "To foster innovation, creativity, and collaboration among students while providing a platform for showcasing talent and building lasting connections.",
    participants: "Open to all college students, college clubs, teams, and individual participants",
    events: [
      { name: "Hackathon", date: "March 15", time: "9:00 AM", venue: "Main Hall", category: "Technical", prize: "₹50,000", limit: "50 teams" },
      { name: "Dance Competition", date: "March 15", time: "6:00 PM", venue: "Auditorium", category: "Cultural", prize: "₹25,000", limit: "20 teams" },
      { name: "Debate", date: "March 16", time: "10:00 AM", venue: "Seminar Hall", category: "Academic", prize: "₹15,000", limit: "30 participants" },
      { name: "Robotics Workshop", date: "March 16", time: "2:00 PM", venue: "Lab 3", category: "Workshop", prize: "N/A", limit: "40 participants" },
      { name: "Music Night", date: "March 17", time: "7:00 PM", venue: "Open Ground", category: "Cultural", prize: "N/A", limit: "Open" },
    ],
  };

  return (
    <div className="min-h-screen relative text-white">
      <div className="w-full absolute h-full z-0 bg-[radial-gradient(circle,_rgba(255,255,255,0.12)_1px,_transparent_1px)] opacity-20 [background-size:20px_20px]" />
      
      <header className="sticky top-0 z-50 bg-black/60 backdrop-blur supports-[backdrop-filter]:bg-black/40 flex justify-between items-center px-8 py-6 gap-6 text-white">
        <Link href="/" className="text-2xl font-extrabold tracking-tight whitespace-nowrap">
          gofest.com
        </Link>

        <div className="flex items-center gap-2">
          <nav className="hidden md:flex gap-6 text-sm">
            <Link href="/" className="text-white/70 hover:text-white transition-colors">
              Home
            </Link>
            <Link href="/events" className="text-white/70 hover:text-white transition-colors">
              Events
            </Link>
            <Link href="/login" className="text-white/70 hover:text-white transition-colors">
              Login
            </Link>
          </nav>
          <div className="flex items-center gap-2 scale-75">
            <CartoonButton label="HOST+" color="bg-white" onClick={handleHostClick} />
          </div>
          <ProfileButton />
        </div>
      </header>

      {/* 1. Hero Section */}
      <section className="relative w-full h-[70vh] min-h-[500px] overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${festData.image})`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/70" />
        
        <div className="relative z-10 h-full flex flex-col justify-end px-6 md:px-12 lg:px-16 pb-16">
          <Link
            href="/events"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back</span>
          </Link>

          <div className="mb-6">
            <span className="inline-block px-3 py-1 text-xs font-medium text-white/90 bg-white/20 backdrop-blur-sm rounded-full border border-white/30">
              {festData.category}
            </span>
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-light text-white mb-4 leading-[1.1] tracking-tight">
            {festData.title}
          </h1>
          
          <p className="text-xl text-white/90 mb-8 max-w-2xl">
            {festData.tagline}
          </p>

          <div className="flex flex-wrap items-center gap-6 text-sm text-white/80 mb-8">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{festData.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{festData.duration}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>{festData.city}, {festData.state}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>{festData.expectedFootfall}</span>
            </div>
          </div>

          <div className="flex items-center gap-4 mb-8">
            <div className="text-sm text-white/80">
              Organized by <span className="font-medium text-white">{festData.college}</span>
              <span className="ml-2 text-xs bg-white/20 px-2 py-0.5 rounded">Verified</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <button className="bg-white text-black px-8 py-3 text-sm font-medium transition-opacity hover:opacity-90">
              Register Now
            </button>
            {festData.website && (
              <a
                href={festData.website}
                target="_blank"
                rel="noopener noreferrer"
                className="border border-white/30 text-white px-6 py-3 text-sm font-medium transition-colors hover:bg-white/10 flex items-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                Official Fest Website
              </a>
            )}
            <button className="border border-white/30 text-white px-6 py-3 text-sm font-medium transition-colors hover:bg-white/10 flex items-center gap-2">
              <Download className="w-4 h-4" />
              Download Brochure
            </button>
          </div>
        </div>
      </section>

      <main className="px-6 md:px-12 lg:px-16 py-16 relative z-10">
        {/* 2. About Section */}
        <section className="mb-20">
          <h2 className="text-3xl font-light text-white mb-8">About</h2>
          <p className="text-lg text-white/70 leading-relaxed mb-8 max-w-3xl">
            {festData.detailedDescription}
          </p>
          
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div>
              <p className="text-xs text-white/50 mb-2">Goals</p>
              <p className="text-base text-white/90 leading-relaxed">{festData.goals}</p>
            </div>
            <div>
              <p className="text-xs text-white/50 mb-2">Who can participate</p>
              <p className="text-base text-white/90 leading-relaxed">{festData.participants}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 pt-8 border-t border-white/10">
            <div>
              <p className="text-xs text-white/50 mb-1">Entry Type</p>
              <p className="text-base text-white font-medium">{festData.entryType}</p>
            </div>
            <div>
              <p className="text-xs text-white/50 mb-1">Expected Footfall</p>
              <p className="text-base text-white font-medium">{festData.expectedFootfall}</p>
            </div>
          </div>
        </section>

        {/* 3. Schedule / Events Section */}
        <section className="mb-20">
          <h2 className="text-3xl font-light text-white mb-8">Schedule</h2>
          <div className="space-y-4">
            {festData.events.map((event, index) => (
              <div key={index} className="border border-white/10 bg-white/5 backdrop-blur-sm p-6 hover:border-white/20 transition-colors rounded-lg">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-medium text-white">{event.name}</h3>
                      <span className="text-xs text-white/60 bg-white/10 px-2 py-1 rounded">{event.category}</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-white/60">
                      <span>{event.date}</span>
                      <span>•</span>
                      <span>{event.time}</span>
                      <span>•</span>
                      <span>{event.venue}</span>
                      {event.prize !== "N/A" && (
                        <>
                          <span>•</span>
                          <span className="font-medium text-white">Prize: {event.prize}</span>
                        </>
                      )}
                      <span>•</span>
                      <span>Limit: {event.limit}</span>
                    </div>
                  </div>
                  <button className="text-sm text-white border border-white/20 px-4 py-2 hover:bg-white/10 transition-colors">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 4. Organizers / Contacts Section */}
        <section className="mb-20">
          <h2 className="text-3xl font-light text-white mb-8">Organizers</h2>
          <div className="border border-white/10 bg-white/5 backdrop-blur-sm p-8 rounded-lg">
            <div className="mb-6">
              <p className="text-lg font-medium text-white mb-1">{festData.author}</p>
              <p className="text-sm text-white/60">{festData.role}</p>
              <p className="text-sm text-white/60 mt-1">{festData.college}</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              {festData.email && (
                <a href={`mailto:${festData.email}`} className="flex items-center gap-3 text-white/70 hover:text-white transition-colors">
                  <Mail className="w-4 h-4" />
                  <span className="text-sm">{festData.email}</span>
                </a>
              )}
              {festData.phone && (
                <a href={`tel:${festData.phone}`} className="flex items-center gap-3 text-white/70 hover:text-white transition-colors">
                  <Phone className="w-4 h-4" />
                  <span className="text-sm">{festData.phone}</span>
                </a>
              )}
              {festData.instagram && (
                <a
                  href={`https://instagram.com/${festData.instagram.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-white/70 hover:text-white transition-colors"
                >
                  <Instagram className="w-4 h-4" />
                  <span className="text-sm">{festData.instagram}</span>
                </a>
              )}
              {festData.linkedin && (
                <a
                  href={`https://linkedin.com/company/${festData.linkedin}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-white/70 hover:text-white transition-colors"
                >
                  <Linkedin className="w-4 h-4" />
                  <span className="text-sm">LinkedIn</span>
                </a>
              )}
            </div>

            <button className="border border-white/20 text-white px-6 py-2 text-sm font-medium hover:bg-white/10 transition-colors">
              Message Organizer
            </button>
          </div>
        </section>

        {/* 5. Map / Location Section */}
        <section className="mb-20">
          <h2 className="text-3xl font-light text-white mb-8">Location</h2>
          <div className="border border-white/10 overflow-hidden rounded-lg">
            <div className="w-full h-[400px] bg-gray-900 relative">
              <iframe
                title="Fest location map"
                width="100%"
                height="100%"
                className="border-0"
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                src={`https://www.google.com/maps?q=${festData.lat},${festData.lon}&hl=en&z=14&output=embed`}
              />
            </div>
            <div className="p-6 bg-white/5 backdrop-blur-sm">
              <p className="text-base text-white mb-4">{festData.location}</p>
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${festData.lat},${festData.lon}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors text-sm"
              >
                <MapPin className="w-4 h-4" />
                Get Directions
              </a>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}

