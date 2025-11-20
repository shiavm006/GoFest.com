"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { CartoonButton } from "@/components/ui/cartoon-button";
import { ProfileButton } from "@/components/ui/profile-button";
import { ArrowLeft, MapPin, Calendar, Clock, Users, Mail, Phone, Instagram, Linkedin, ExternalLink, Download, Loader2 } from "lucide-react";
import { getAuthToken, fetchFestBySlug, registerForFest, type Fest } from "@/lib/api";
import { fallbackFests } from "../page";

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

  const [fest, setFest] = useState<Fest | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  useEffect(() => {
    async function loadFest() {
      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchFestBySlug(slug);
        setFest(data);
      } catch (err: any) {
        console.error("Failed to load fest:", err);
        setError(err.message);
        
        // Try fallback data
        const fallbackFest = fallbackFests.find((f) => generateSlug(f.title) === slug);
        if (fallbackFest) {
          // Convert fallback to Fest type with mock data
          setFest({
            _id: "fallback",
            slug: slug,
            title: fallbackFest.title,
            category: fallbackFest.category,
            description: fallbackFest.description,
            image: fallbackFest.image,
            college: "Sample College",
            date: "TBD",
            location: {
              city: "Sample City",
              state: "Sample State"
            },
            organizer: {
              name: fallbackFest.author || "Event Organizer",
              role: fallbackFest.role || "Organizer",
              college: "Sample College"
            },
            entryType: "Free",
            events: [],
            hostedBy: {
              _id: "fallback",
              name: fallbackFest.author || "Event Organizer",
              email: "contact@sample.com"
            },
            registrationsCount: 0,
            status: "published",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          } as Fest);
          setError(null);
        }
      } finally {
        setIsLoading(false);
      }
    }

    loadFest();
  }, [slug]);

  const handleRegisterClick = async () => {
    const token = getAuthToken();
    if (!token) {
      router.push("/login");
      return;
    }

    if (!fest || fest._id === "fallback") {
      alert("This is a sample fest. Create your own fest to enable registration!");
      return;
    }

    try {
      setIsRegistering(true);
      await registerForFest(fest._id);
      setRegistrationSuccess(true);
      alert(`Successfully registered for ${fest.title}! 🎉`);
    } catch (err: any) {
      alert(err.message || "Registration failed. You may already be registered.");
    } finally {
      setIsRegistering(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen relative text-white flex items-center justify-center">
        <div className="w-full absolute h-full z-0 bg-[radial-gradient(circle,_rgba(255,255,255,0.12)_1px,_transparent_1px)] opacity-20 [background-size:20px_20px]" />
        <div className="relative z-10">
          <Loader2 className="w-12 h-12 animate-spin text-white/60" />
        </div>
      </div>
    );
    }

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

  return (
    <div className="min-h-screen relative text-white">
      <div className="w-full absolute h-full z-0 bg-[radial-gradient(circle,_rgba(255,255,255,0.12)_1px,_transparent_1px)] opacity-20 [background-size:20px_20px]" />
      
      {/* 1. Hero Section */}
      <section className="relative w-full h-[70vh] min-h-[500px] overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${fest.image})`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black"></div>
        </div>
        
        <div className="absolute top-6 left-6 z-10">
          <Link
            href="/events"
            className="flex items-center gap-2 text-white/80 hover:text-white transition-colors bg-black/30 backdrop-blur-sm px-4 py-2 rounded-lg"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Events
          </Link>
          </div>

        <div className="relative z-10 flex flex-col justify-end h-full px-6 lg:px-16 pb-12">
          <div className="max-w-4xl">
            <div className="inline-block px-3 py-1 mb-4 text-xs font-semibold bg-white/20 backdrop-blur-sm rounded-full text-white">
              {fest.category}
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4 text-white">
              {fest.title}
          </h1>
            <p className="text-xl text-white/90 mb-6">
              {fest.tagline || fest.description}
          </p>
            <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
                <span>{fest.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
                <span>{fest.location.city}, {fest.location.state}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
                <span>{fest.registrationsCount} Registered</span>
              </div>
            </div>
          </div>
            </div>
      </section>

      {/* 2. Quick Info Bar */}
      <section className="sticky top-0 z-40 bg-black/80 backdrop-blur-md border-b border-white/10">
        <div className="px-6 lg:px-16 py-4 flex flex-wrap justify-between items-center gap-4">
          <div>
            <h2 className="text-xl font-semibold">{fest.title}</h2>
            <p className="text-sm text-white/60">{fest.college}</p>
          </div>
          <button 
            onClick={handleRegisterClick}
            disabled={isRegistering || registrationSuccess}
            className="px-6 py-2 bg-white text-black rounded-lg font-semibold hover:bg-white/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isRegistering ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Registering...
              </>
            ) : registrationSuccess ? (
              "✓ Registered"
            ) : (
              "Register Now"
            )}
          </button>
        </div>
      </section>

      {/* 3. Main Content */}
      <main className="px-6 lg:px-16 py-12 relative z-10">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-12">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-12">
            {/* About */}
            <section>
              <h3 className="text-2xl font-bold mb-4">About {fest.title}</h3>
              <p className="text-white/80 leading-relaxed">
                {fest.description}
          </p>
            </section>

            {/* Events Schedule */}
            {fest.events && fest.events.length > 0 && (
              <section>
                <h3 className="text-2xl font-bold mb-6">Events & Activities</h3>
                <div className="space-y-4">
                  {fest.events.map((event, idx) => (
                    <div
                      key={idx}
                      className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6 hover:bg-white/10 transition-all"
                    >
                      <div className="flex justify-between items-start mb-3">
            <div>
                          <h4 className="text-lg font-semibold">{event.name}</h4>
                          <span className="text-xs px-2 py-1 bg-white/10 rounded-full inline-block mt-2">
                            {event.category}
                          </span>
                        </div>
                        {event.prize && (
                          <div className="text-right">
                            <div className="text-sm text-white/60">Prize</div>
                            <div className="font-semibold">{event.prize}</div>
                          </div>
                        )}
            </div>
                      <div className="flex flex-wrap gap-4 text-sm text-white/70">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          {event.date}
            </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          {event.time}
          </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          {event.venue}
            </div>
                        {event.limit && (
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            {event.limit}
            </div>
                        )}
          </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-8">
            {/* Event Details Card */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6">
              <h4 className="text-lg font-semibold mb-4">Event Details</h4>
              <div className="space-y-4 text-sm">
                <div>
                  <div className="text-white/60 mb-1">Entry</div>
                  <div className="font-semibold">{fest.entryType}</div>
                </div>
                {fest.duration && (
                  <div>
                    <div className="text-white/60 mb-1">Duration</div>
                    <div className="font-semibold">{fest.duration}</div>
                    </div>
                )}
                {fest.expectedFootfall && (
                  <div>
                    <div className="text-white/60 mb-1">Expected Footfall</div>
                    <div className="font-semibold">{fest.expectedFootfall}</div>
                  </div>
                )}
                <div>
                  <div className="text-white/60 mb-1">Registrations</div>
                  <div className="font-semibold">{fest.registrationsCount} people</div>
                </div>
              </div>
            </div>
            
            {/* Organizer Card */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6">
              <h4 className="text-lg font-semibold mb-4">Contact Organizer</h4>
              <div className="space-y-3 text-sm">
                <div>
                  <div className="font-semibold">{fest.organizer.name}</div>
                  <div className="text-white/60">{fest.organizer.role}</div>
                  <div className="text-white/60">{fest.organizer.college}</div>
                </div>
                {fest.organizer.email && (
                  <a
                    href={`mailto:${fest.organizer.email}`}
                    className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
                  >
                  <Mail className="w-4 h-4" />
                    {fest.organizer.email}
                </a>
              )}
                {fest.organizer.phone && (
                  <a
                    href={`tel:${fest.organizer.phone}`}
                    className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
                  >
                  <Phone className="w-4 h-4" />
                    {fest.organizer.phone}
                </a>
              )}
                {fest.organizer.instagram && (
                <a
                    href={`https://instagram.com/${fest.organizer.instagram.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                    className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
                >
                  <Instagram className="w-4 h-4" />
                    {fest.organizer.instagram}
                </a>
              )}
                {fest.organizer.linkedin && (
                <a
                    href={`https://linkedin.com/in/${fest.organizer.linkedin}`}
                  target="_blank"
                  rel="noopener noreferrer"
                    className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
                >
                  <Linkedin className="w-4 h-4" />
                    LinkedIn Profile
                </a>
              )}
            </div>
            </div>

            {/* Resources */}
            {(fest.website || fest.brochure) && (
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6">
                <h4 className="text-lg font-semibold mb-4">Resources</h4>
                <div className="space-y-3">
                  {fest.website && (
              <a
                      href={fest.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-all group"
                    >
                      <div className="flex items-center gap-2">
                        <ExternalLink className="w-4 h-4" />
                        <span className="text-sm font-medium">Official Website</span>
                      </div>
                      <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                  )}
                  {fest.brochure && (
                    <a
                      href={fest.brochure}
                target="_blank"
                rel="noopener noreferrer"
                      className="flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-all group"
                    >
                      <div className="flex items-center gap-2">
                        <Download className="w-4 h-4" />
                        <span className="text-sm font-medium">Download Brochure</span>
                      </div>
                      <Download className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                  )}
                </div>
            </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
