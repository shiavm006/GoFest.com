"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { CartoonButton } from "@/components/ui/cartoon-button";
import { ProfileButton } from "@/components/ui/profile-button";
import { ArrowLeft, MapPin, Calendar, Clock, Users, Mail, Phone, Instagram, Linkedin, ExternalLink, Download, Loader2 } from "lucide-react";
import { getAuthToken, fetchFestBySlug, registerForFest, getMyRegistrations, type Fest, type Registration } from "@/lib/api";

export default function FestDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [fest, setFest] = useState<Fest | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [isAlreadyRegistered, setIsAlreadyRegistered] = useState(false);

  useEffect(() => {
    async function loadFest() {
      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchFestBySlug(slug);
        setFest(data);
      } catch (err) {
        console.error("Failed to load fest:", err);
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Failed to load fest");
        }
      } finally {
        setIsLoading(false);
      }
    }

    loadFest();
  }, [slug]);

  // Check if user is already registered for this fest
  useEffect(() => {
    async function checkRegistration() {
      if (!fest) return;
    const token = getAuthToken();
      if (!token) return;

      try {
        const registrations: Registration[] = await getMyRegistrations();
        const already = registrations.some((reg) => reg.fest && reg.fest._id === fest._id);
        if (already) {
          setIsAlreadyRegistered(true);
          setRegistrationSuccess(true);
        }
      } catch (err) {
        // silently ignore – registration info is just for UX
        console.error("Failed to check registration status:", err);
    }
    }

    checkRegistration();
  }, [fest]);

  const handleRegisterClick = async () => {
    const token = getAuthToken();
    if (!token) {
      router.push("/login");
      return;
    }

    if (!fest) {
      alert("Fest not found. Please try again.");
      return;
    }

    try {
      setIsRegistering(true);
      await registerForFest(fest._id);
      setRegistrationSuccess(true);
      setIsAlreadyRegistered(true);
      alert(`Successfully registered for ${fest.title}! 🎉`);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Registration failed. You may already be registered.";
      if (message.toLowerCase().includes("already registered")) {
        setIsAlreadyRegistered(true);
        setRegistrationSuccess(true);
        alert("You have already registered for this fest.");
    } else {
        alert(message);
      }
    } finally {
      setIsRegistering(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="w-12 h-12 animate-spin text-gray-500" />
      </div>
    );
    }

  if (!fest) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <h1 className="text-2xl font-semibold mb-4 text-black">Fest not found</h1>
          <Link
            href="/events"
            className="text-blue-600 hover:text-blue-700 underline"
          >
            ← Back to events
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black">
      {/* 1. Hero Section */}
      <section className="relative w-full h-[60vh] min-h-[420px] overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${fest.image})`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/10" />
        </div>
        
        <div className="absolute top-5 left-5 z-50">
          <Link
            href="/events"
            className="flex items-center gap-2 text-white/80 hover:text-white transition-colors bg-gray-900/60 backdrop-blur-sm px-4 py-2 rounded-lg hover:bg-gray-900/70 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Events
          </Link>
          </div>

        <div className="relative z-10 flex flex-col justify-end h-full px-6 lg:px-16 pb-10">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 text-xs font-medium bg-white/90 text-gray-900 rounded-full shadow-sm">
              {fest.category}
            </div>
            <h1 className="text-3xl md:text-5xl font-semibold text-white leading-tight">
              {fest.title}
            </h1>
            <p className="text-base md:text-lg text-white/90 max-w-2xl">
              {fest.tagline || fest.description}
            </p>
            <div className="flex flex-wrap gap-4 text-xs md:text-sm text-white/85">
              <div className="inline-flex items-center gap-2">
                <Calendar className="w-4 h-4 text-white/80" />
                <span>{fest.date}</span>
              </div>
              <div className="inline-flex items-center gap-2">
                <MapPin className="w-4 h-4 text-white/80" />
                <span>{fest.location.city}, {fest.location.state}</span>
            </div>
              <div className="inline-flex items-center gap-2">
                <Users className="w-4 h-4 text-white/80" />
                <span>{fest.registrationsCount} registered</span>
            </div>
            </div>
          </div>
            </div>
      </section>

      {/* 2. Quick Info Bar */}
      <section className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-gray-200">
        <div className="px-6 lg:px-16 py-4 flex flex-wrap justify-between items-center gap-4">
          <div>
            <h2 className="text-xl font-semibold text-black">{fest.title}</h2>
            <p className="text-sm text-gray-600">{fest.college}</p>
          </div>
            <div className="flex flex-col items-end gap-1">
            <button 
              onClick={handleRegisterClick}
                disabled={isRegistering || registrationSuccess || isAlreadyRegistered}
                className="px-6 py-2 bg-[#FFD95A] text-black rounded-lg font-medium hover:bg-[#f5c941] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isRegistering ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Registering...
                  </>
                ) : registrationSuccess || isAlreadyRegistered ? (
                  "✓ Already registered"
                ) : (
                  "Register Now"
                )}
            </button>
              {(registrationSuccess || isAlreadyRegistered) && (
                <span className="text-xs text-green-700">
                  You have already registered for this fest.
                </span>
              )}
          </div>
        </div>
      </section>

      {/* 3. Main Content */}
      <main className="px-6 lg:px-16 py-12">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-10 lg:gap-12">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-12">
            {/* About */}
            <section className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-900">About {fest.title}</h3>
              <p className="text-sm md:text-base text-gray-700 leading-relaxed">
                {fest.description}
              </p>
            </section>

            {/* Events Schedule */}
            {fest.events && fest.events.length > 0 && (
              <section className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-900">Events & Activities</h3>
                <div className="space-y-3">
                  {fest.events.map((event, idx) => (
                    <div
                      key={idx}
                      className="bg-white border border-gray-200 rounded-lg p-5 hover:border-gray-300 transition-colors"
                    >
                      <div className="flex justify-between items-start mb-2.5">
            <div>
                          <h4 className="text-base font-semibold text-gray-900">{event.name}</h4>
                          <span className="mt-1 inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-800">
                            {event.category}
                          </span>
                        </div>
                        {event.prize && (
                          <div className="text-right">
                            <div className="text-xs text-gray-500">Prize</div>
                            <div className="text-sm font-semibold text-gray-900">{event.prize}</div>
                          </div>
                        )}
            </div>
                      <div className="flex flex-wrap gap-3 text-xs md:text-sm text-gray-700">
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
          <div className="space-y-6">
            {/* Event Details Card */}
            <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
              <h4 className="text-sm font-semibold mb-3 text-gray-900 uppercase tracking-[0.14em]">
                Event details
              </h4>
              <div className="space-y-3 text-sm">
                <div>
                  <div className="text-xs text-gray-500 uppercase tracking-[0.12em] mb-0.5">Entry</div>
                  <div className="text-sm font-semibold text-gray-900">{fest.entryType}</div>
                </div>
                {fest.duration && (
                  <div>
                    <div className="text-xs text-gray-500 uppercase tracking-[0.12em] mb-0.5">Duration</div>
                    <div className="text-sm font-semibold text-gray-900">{fest.duration}</div>
                    </div>
                )}
                {fest.expectedFootfall && (
                  <div>
                    <div className="text-xs text-gray-500 uppercase tracking-[0.12em] mb-0.5">Expected footfall</div>
                    <div className="text-sm font-semibold text-gray-900">{fest.expectedFootfall}</div>
                  </div>
                )}
                <div>
                  <div className="text-xs text-gray-500 uppercase tracking-[0.12em] mb-0.5">Registrations</div>
                  <div className="text-sm font-semibold text-gray-900">{fest.registrationsCount} people</div>
                </div>
              </div>
            </div>
            
            {/* Organizer Card */}
            <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
              <h4 className="text-sm font-semibold mb-3 text-gray-900 uppercase tracking-[0.14em]">
                Contact organizer
              </h4>
              <div className="space-y-2.5 text-sm">
                <div>
                  <div className="font-semibold text-gray-900">{fest.organizer.name}</div>
                  <div className="text-gray-600">{fest.organizer.role}</div>
                  <div className="text-gray-600">{fest.organizer.college}</div>
                </div>
                {fest.organizer.email && (
                  <a
                    href={`mailto:${fest.organizer.email}`}
                    className="flex items-center gap-2 text-gray-700 hover:text-black transition-colors"
                  >
                  <Mail className="w-4 h-4" />
                    {fest.organizer.email}
                </a>
              )}
                {fest.organizer.phone && (
                  <a
                    href={`tel:${fest.organizer.phone}`}
                    className="flex items-center gap-2 text-gray-700 hover:text-black transition-colors"
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
                    className="flex items-center gap-2 text-gray-700 hover:text-black transition-colors"
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
                    className="flex items-center gap-2 text-gray-700 hover:text-black transition-colors"
                >
                  <Linkedin className="w-4 h-4" />
                    LinkedIn Profile
                </a>
              )}
            </div>
            </div>

            {/* Resources */}
            {(fest.website || fest.brochure) && (
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <h4 className="text-lg font-semibold mb-4 text-black">Resources</h4>
                <div className="space-y-3">
                  {fest.website && (
              <a
                      href={fest.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-all group text-gray-800"
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
                      className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-all group text-gray-800"
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
