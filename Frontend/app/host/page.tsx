 "use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ProfileButton } from "@/components/ui/profile-button";
import { Input } from "@/components/ui/input";
import { FileUpload } from "@/components/ui/file-upload";
import {
  Calendar,
  MapPin,
  Users,
  Plus,
  Trash2,
  Building2,
  Mail,
  Phone,
  Image,
  IndianRupee,
  Navigation,
  Link as LinkIcon,
  Clock,
  Trophy,
} from "lucide-react";
import { API_BASE_URL, createFest, deleteFest, getAuthToken, getMyHostedFests, updateFest, type Fest } from "@/lib/api";

export default function HostFestPage() {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [error, setError] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [view, setView] = useState<"list" | "form">("list");
  const [myFests, setMyFests] = useState<Fest[]>([]);
  const [isLoadingMyFests, setIsLoadingMyFests] = useState(true);
  const [myFestsError, setMyFestsError] = useState("");
  const [deletingFestId, setDeletingFestId] = useState<string | null>(null);
  const [editingFestId, setEditingFestId] = useState<string | null>(null);

  useEffect(() => {
    const token = getAuthToken();
    setIsLoggedIn(!!token);
    if (!token) {
      router.push("/");
    }
  }, [router]);

  // Match backend schema exactly
  const [festData, setFestData] = useState({
    title: "",
    slug: "",
    description: "",
    tagline: "",
    category: "Culture",
    image: "",
    college: "",
    date: "",
    duration: "",
    location: {
      city: "",
      state: "",
      address: "",
      coordinates: [] as number[],
    },
    organizer: {
      name: "",
      role: "",
      college: "",
      email: "",
      phone: "",
      instagram: "",
      linkedin: "",
    },
    entryType: "Free",
    entryFee: 0,
    expectedFootfall: "",
    website: "",
    brochure: "",
    events: [] as Array<{
      name: string;
      date: string;
      time: string;
      venue: string;
      category: string;
      prize: string;
      limit: string;
    }>,
  });

  const [currentEvent, setCurrentEvent] = useState({
    name: "",
    date: "",
    time: "",
    venue: "",
    category: "Technical",
    prize: "",
    limit: "",
  });

  // Load fests hosted by the current user
  useEffect(() => {
    const token = getAuthToken();
    if (!token) return;

    async function loadMyFests() {
      try {
        setIsLoadingMyFests(true);
        setMyFestsError("");
        const data = await getMyHostedFests();
        setMyFests(data);
      } catch (err: any) {
        setMyFestsError(err.message || "Failed to load your hosted fests");
      } finally {
        setIsLoadingMyFests(false);
      }
    }

    loadMyFests();
  }, []);

  const generateSlug = (title: string) =>
    title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  const handleInputChange = (field: string, value: any) => {
    if (field === "title" && !editingFestId) {
      setFestData((prev) => ({
        ...prev,
        title: value,
        slug: generateSlug(value),
      }));
    } else if (field === "entryType") {
      setFestData((prev) => ({
        ...prev,
        entryType: value,
        entryFee: value === "Free" ? 0 : prev.entryFee,
      }));
    } else {
      setFestData((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleNestedChange = (parent: "location" | "organizer", field: string, value: any) => {
    setFestData((prev) => ({
      ...prev,
      [parent]: {
        ...(prev[parent] as any),
        [field]: value,
      },
    }));
  };

  const addEvent = () => {
    if (currentEvent.name && currentEvent.date && currentEvent.time && currentEvent.venue && currentEvent.category) {
      setFestData((prev) => ({
        ...prev,
        events: [...prev.events, currentEvent],
      }));
      setCurrentEvent({
        name: "",
        date: "",
        time: "",
        venue: "",
        category: "Technical",
        prize: "",
        limit: "",
      });
    } else {
      setError("Please fill all required event fields (Name, Date, Time, Venue, Category)");
      setTimeout(() => setError(""), 3000);
    }
  };

  const removeEvent = (index: number) => {
    setFestData((prev) => ({
      ...prev,
      events: prev.events.filter((_, i) => i !== index),
    }));
  };

  const getCurrentLocation = async () => {
    setIsLoadingLocation(true);
    setError("");

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      setIsLoadingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const token = getAuthToken();
          
          const response = await fetch(
            `${API_BASE_URL}/api/location/reverse-geocode?lat=${latitude}&lon=${longitude}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || "Failed to fetch location");
          }

          const data = await response.json();

          setFestData((prev) => ({
            ...prev,
            location: {
              ...prev.location,
              city: data.location.city,
              state: data.location.state,
              coordinates: [longitude, latitude], // [lng, lat] format for Leaflet
            },
          }));
        } catch (err: any) {
          setError(err.message || "Could not fetch location details. Please enter manually.");
        } finally {
          setIsLoadingLocation(false);
        }
      },
      (error) => {
        setIsLoadingLocation(false);
        if (error.code === error.PERMISSION_DENIED) {
          setError("Location access denied. Please enable location permissions.");
        } else {
          setError("Could not get your location. Please enter manually.");
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      },
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error("Please login to create a fest");
      }

      if (!festData.title) throw new Error("Fest title is required");
      if (!festData.image) throw new Error("Cover image is required");
      if (!festData.college) throw new Error("College name is required");
      if (!festData.date) throw new Error("Fest date is required");
      if (!festData.description) throw new Error("Description is required");
      if (!festData.location.city) throw new Error("City is required");
      if (!festData.location.state) throw new Error("State is required");
      if (!festData.organizer.name) throw new Error("Organizer name is required");
      if (!festData.organizer.role) throw new Error("Organizer role is required");
      if (!festData.organizer.college) throw new Error("Organizer college is required");

      let fest: Fest;

      if (editingFestId) {
        fest = await updateFest(editingFestId, festData);
      } else {
        fest = await createFest(festData);
      }

      setEditingFestId(null);
      setView("list");
      router.push(`/events/${fest.slug}`);
    } catch (err: any) {
      setError(err.message);
      console.error("Fest creation error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-black">
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 flex justify-between items-center px-8 py-5 gap-6">
        <Link href="/" className="text-3xl tracking-tight whitespace-nowrap text-black" style={{ fontFamily: 'var(--font-caveat-brush)' }}>
          Gofest.com
        </Link>

        <div className="flex items-center gap-2">
          <nav className="hidden md:flex gap-6 text-base">
            <Link href="/" className="text-black hover:text-gray-800 transition-colors pb-1 hover:border-b-2 hover:border-black" style={{ fontFamily: 'var(--font-audiowide)' }}>
              Home
            </Link>
            <Link href="/events" className="text-black hover:text-gray-800 transition-colors pb-1 hover:border-b-2 hover:border-black" style={{ fontFamily: 'var(--font-audiowide)' }}>
              Events
            </Link>
            <Link href="/host" className="text-black hover:text-gray-800 transition-colors pb-1 hover:border-b-2 hover:border-black" style={{ fontFamily: 'var(--font-audiowide)' }}>
              Host
            </Link>
            {!isLoggedIn && (
              <Link href="/login" className="text-black hover:text-gray-800 transition-colors pb-1 hover:border-b-2 hover:border-black" style={{ fontFamily: 'var(--font-audiowide)' }}>
                Login
              </Link>
            )}
          </nav>
          <ProfileButton />
        </div>
      </header>

      <main className="container mx-auto px-6 py-12 relative z-10">
        {view === "list" ? (
          <div className="max-w-5xl mx-auto">
            <div className="mb-8 flex items-center justify-between gap-4">
              <div>
                <h1 className="text-4xl font-bold mb-2 text-black">Your Hosted Fests</h1>
                <p className="text-gray-600 text-sm md:text-base">
                  See all the fests you&apos;ve hosted on GoFest. You can open any fest to view its public page.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setView("form")}
                className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2 text-sm font-medium text-black hover:bg-white/90 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Host a new fest
              </button>
            </div>

            {myFestsError && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-6 py-4 rounded-lg mb-8">
                {myFestsError}
              </div>
            )}

            {isLoadingMyFests ? (
              <div className="flex justify-center items-center py-20 text-gray-500">
                Loading your hosted fests...
              </div>
            ) : myFests.length === 0 ? (
              <div className="py-16 text-center text-gray-500 space-y-4">
                <p className="text-lg">You haven&apos;t hosted any fests yet.</p>
                <button
                  type="button"
                  onClick={() => setView("form")}
                  className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2 text-sm font-medium text-black hover:bg-white/90 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Host your first fest
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {myFests.map((fest) => (
                  <div
                    key={fest._id}
                    className="group relative rounded-xl border border-gray-200 bg-white p-5 hover:border-gray-300 transition-colors cursor-pointer shadow-sm"
                    onClick={() => router.push(`/events/${fest.slug}`)}
                  >
                    <div className="absolute right-3 top-3 flex gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingFestId(fest._id);
                          setFestData({
                            title: fest.title || "",
                            slug: fest.slug || "",
                            description: fest.description || "",
                            tagline: fest.tagline || "",
                            category: fest.category || "Culture",
                            image: fest.image || "",
                            college: fest.college || "",
                            date: fest.date || "",
                            duration: fest.duration || "",
                            location: {
                              city: fest.location?.city || "",
                              state: fest.location?.state || "",
                              address: fest.location?.address || "",
                              coordinates: fest.location?.coordinates || [],
                            },
                            organizer: {
                              name: fest.organizer?.name || "",
                              role: fest.organizer?.role || "",
                              college: fest.organizer?.college || "",
                              email: fest.organizer?.email || "",
                              phone: fest.organizer?.phone || "",
                              instagram: fest.organizer?.instagram || "",
                              linkedin: fest.organizer?.linkedin || "",
                            },
                            entryType: fest.entryType || "Free",
                            entryFee: fest.entryFee ?? 0,
                            expectedFootfall: fest.expectedFootfall || "",
                            website: fest.website || "",
                            brochure: fest.brochure || "",
                            events: (fest.events || []).map((ev) => ({
                              name: ev.name || "",
                              date: ev.date || "",
                              time: ev.time || "",
                              venue: ev.venue || "",
                              category: ev.category || "",
                              prize: ev.prize || "",
                              limit: ev.limit || "",
                            })),
                          });
                          setView("form");
                        }}
                        className="rounded-full bg-white/90 hover:bg-white text-black px-3 py-1 text-[11px] font-semibold tracking-wide uppercase shadow-sm"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={async (e) => {
                          e.stopPropagation();
                          if (!window.confirm("Are you sure you want to delete this fest? This cannot be undone.")) {
                            return;
                          }
                          try {
                            setDeletingFestId(fest._id);
                            await deleteFest(fest._id);
                            setMyFests((prev) => prev.filter((f) => f._id !== fest._id));
                          } catch (err: any) {
                            alert(err.message || "Failed to delete fest");
                          } finally {
                            setDeletingFestId(null);
                          }
                        }}
                        className="rounded-full bg-red-500/80 hover:bg-red-600 text-white px-3 py-1 text-[11px] font-semibold tracking-wide uppercase shadow-sm"
                        disabled={deletingFestId === fest._id}
                      >
                        {deletingFestId === fest._id ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                    <h3 className="text-xl font-semibold mb-2 text-black line-clamp-2">
                      {fest.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {fest.tagline || fest.description}
                    </p>
                    <div className="flex flex-wrap gap-3 text-xs text-gray-600 mb-4">
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {fest.date}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {fest.location?.city}, {fest.location?.state}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {fest.registrationsCount ?? 0} registrations
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-600">
                      <span className="uppercase tracking-[0.18em] text-gray-500">
                        {fest.category}
                      </span>
                      <span className="text-gray-600">
                        Hosted • {new Date(fest.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
        <div className="max-w-4xl mx-auto">
              <div className="mb-6 flex items-center justify-between gap-4">
                <div>
                  <h1 className="text-5xl font-bold mb-2 text-black">
                    {editingFestId ? "Edit Your Fest" : "Host Your Fest"}
                  </h1>
                  <p className="text-gray-600 text-lg">
                    {editingFestId
                      ? "Update the details of your college fest"
                      : "Fill in the details below to list your college fest on our platform"}
            </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setView("list");
                    setEditingFestId(null);
                  }}
                  className="text-sm text-gray-600 hover:text-black underline"
                >
                  ← Back to your hosted fests
                </button>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-6 py-4 rounded-lg mb-8">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-12">
              {/* Basic Information */}
            <section className="space-y-4">
              <div className="flex items-center gap-3 mb-6">
                <Calendar className="w-6 h-6 text-white" />
                <h2 className="text-2xl font-bold text-white">Basic Information</h2>
              </div>
              
              <div className="space-y-4">
                <Input
                  label="Fest Title *"
                  placeholder="e.g., Spring Festival 2025"
                  value={festData.title}
                  onChange={(value) => handleInputChange("title", value)}
                  required
                  size="large"
                />

                <Input
                  label="College / Institution Name *"
                  placeholder="e.g., IIT Delhi"
                  value={festData.college}
                  onChange={(value) => handleInputChange("college", value)}
                  required
                  size="large"
                  prefix={<Building2 className="w-4 h-4" />}
                  prefixStyling={false}
                />

                <div>
                  <label className="block capitalize text-[13px] text-black mb-2">
                    Category *
                  </label>
                  <select
                    required
                    value={festData.category}
                    onChange={(e) => handleInputChange("category", e.target.value)}
                    className="w-full h-12 text-base rounded-lg border border-gray-300 hover:border-gray-400 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 bg-white text-black px-3 outline-none duration-150"
                    aria-label="Fest Category"
                  >
                    <option value="Culture">Culture</option>
                    <option value="Technology">Technology</option>
                    <option value="Sports">Sports</option>
                    <option value="Music">Music</option>
                    <option value="Arts">Arts</option>
                    <option value="Business">Business</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <Input
                  label="Tagline (optional)"
                  placeholder="A catchy tagline for your fest"
                  value={festData.tagline}
                  onChange={(value) => handleInputChange("tagline", value)}
                  size="large"
                />

                <div>
                  <label className="block capitalize text-[13px] text-black mb-2">
                    Description *
                  </label>
                  <textarea
                    required
                    value={festData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    className="w-full h-32 text-base rounded-lg border border-gray-300 hover:border-gray-400 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 bg-white text-black px-3 py-3 outline-none duration-150 resize-none placeholder:text-gray-500/80"
                    placeholder="Describe your fest..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Date *"
                    placeholder="e.g., March 15-17, 2025"
                    type="date"
                    value={festData.date}
                    onChange={(value) => handleInputChange("date", value)}
                    required
                    size="large"
                  />
                  <Input
                    label="Duration (optional)"
                    placeholder="e.g., 3 days"
                    value={festData.duration}
                    onChange={(value) => handleInputChange("duration", value)}
                    size="large"
                  />
                </div>

                  <Input
                  label="Expected Footfall (optional)"
                  placeholder="e.g., 5000+ students"
                  value={festData.expectedFootfall}
                  onChange={(value) => handleInputChange("expectedFootfall", value)}
                    size="large"
                  prefix={<Users className="w-4 h-4" />}
                  prefixStyling={false}
                  />
              </div>
            </section>

            {/* Location */}
            <section className="space-y-4">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <MapPin className="w-6 h-6 text-white" />
                  <h2 className="text-2xl font-bold text-white">Location</h2>
                </div>
                <button
                  type="button"
                  onClick={getCurrentLocation}
                  disabled={isLoadingLocation}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  <Navigation className={`w-4 h-4 ${isLoadingLocation ? 'animate-spin' : ''}`} />
                  {isLoadingLocation ? 'Getting Location...' : 'Use Current Location'}
                </button>
              </div>
              
              <div className="space-y-4">
                <Input
                  label="Venue / Address (optional)"
                  placeholder="College Campus / Hall Name"
                  value={festData.location.address}
                  onChange={(value) => handleNestedChange("location", "address", value)}
                  size="large"
                  prefix={<Building2 className="w-4 h-4" />}
                  prefixStyling={false}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="City *"
                    placeholder="e.g., Mumbai"
                    value={festData.location.city}
                    onChange={(value) => handleNestedChange("location", "city", value)}
                    required
                    size="large"
                  />
                  <Input
                    label="State *"
                    placeholder="e.g., Maharashtra"
                    value={festData.location.state}
                    onChange={(value) => handleNestedChange("location", "state", value)}
                    required
                    size="large"
                  />
                </div>
              </div>
            </section>

            {/* Organizer Details */}
            <section className="space-y-4">
              <div className="flex items-center gap-3 mb-6">
                <Users className="w-6 h-6 text-white" />
                <h2 className="text-2xl font-bold text-white">Organizer Details</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Organizer Name *"
                  placeholder="Full name"
                  value={festData.organizer.name}
                  onChange={(value) => handleNestedChange("organizer", "name", value)}
                  required
                  size="large"
                />
                <Input
                  label="Role / Position *"
                  placeholder="e.g., Cultural Secretary"
                  value={festData.organizer.role}
                  onChange={(value) => handleNestedChange("organizer", "role", value)}
                  required
                  size="large"
                />
                <Input
                  label="College / Institution *"
                  placeholder="Organizer's college"
                  value={festData.organizer.college}
                  onChange={(value) => handleNestedChange("organizer", "college", value)}
                  required
                  size="large"
                />
                <Input
                  label="Email (optional)"
                  type="email"
                  placeholder="email@example.com"
                  value={festData.organizer.email}
                  onChange={(value) => handleNestedChange("organizer", "email", value)}
                  size="large"
                  prefix={<Mail className="w-4 h-4" />}
                  prefixStyling={false}
                />
                <Input
                  label="Phone (optional)"
                  type="tel"
                  placeholder="+91 1234567890"
                  value={festData.organizer.phone}
                  onChange={(value) => handleNestedChange("organizer", "phone", value)}
                  size="large"
                  prefix={<Phone className="w-4 h-4" />}
                  prefixStyling={false}
                />
                <Input
                  label="Instagram (optional)"
                  placeholder="@username"
                  value={festData.organizer.instagram}
                  onChange={(value) => handleNestedChange("organizer", "instagram", value)}
                  size="large"
                />
                <Input
                  label="LinkedIn (optional)"
                  placeholder="username"
                  value={festData.organizer.linkedin}
                  onChange={(value) => handleNestedChange("organizer", "linkedin", value)}
                  size="large"
                />
              </div>
            </section>

            {/* Images & Media */}
            <section className="space-y-4">
              <div className="flex items-center gap-3 mb-6">
                <Image className="w-6 h-6 text-white" />
                <h2 className="text-2xl font-bold text-white">Images & Media</h2>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="block capitalize text-[13px] text-gray-900 dark:text-gray-300 mb-2">
                    Cover Image *
                  </label>
                  <FileUpload
                    accept="image/*"
                    fileType="image"
                    label="Upload Cover Image"
                    description="Click to select or drag and drop (JPG, PNG, GIF)"
                    onUpload={(url) => handleInputChange("image", url)}
                    value={festData.image}
                  />
                </div>

                <Input
                  label="Website URL (optional)"
                  type="url"
                  placeholder="https://yourfest.com"
                  value={festData.website}
                  onChange={(value) => handleInputChange("website", value)}
                  size="large"
                  prefix={<LinkIcon className="w-4 h-4" />}
                  prefixStyling={false}
                />

                <div>
                  <label className="block capitalize text-[13px] text-gray-900 dark:text-gray-300 mb-2">
                    Brochure (optional)
                  </label>
                  <FileUpload
                    accept=".pdf,application/pdf"
                    fileType="pdf"
                    label="Upload Brochure PDF"
                    description="Click to select or drag and drop (PDF only)"
                    onUpload={(url) => handleInputChange("brochure", url)}
                    value={festData.brochure}
                  />
                </div>
              </div>
            </section>

            {/* Pricing */}
            <section className="space-y-4">
              <div className="flex items-center gap-3 mb-6">
                <IndianRupee className="w-6 h-6 text-white" />
                <h2 className="text-2xl font-bold text-white">Entry & Pricing</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block capitalize text-[13px] text-black mb-2">
                    Entry Type *
                    </label>
                  <select
                    required
                    value={festData.entryType}
                    onChange={(e) => handleInputChange("entryType", e.target.value)}
                    className="w-full h-12 text-base rounded-lg border border-gray-300 hover:border-gray-400 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 bg-white text-black px-3 outline-none duration-150"
                    aria-label="Entry Type"
                  >
                    <option value="Free">Free</option>
                    <option value="Paid">Paid</option>
                  </select>
                </div>

                {festData.entryType === "Paid" && (
                    <Input
                    label="Entry Fee (₹) *"
                      type="number"
                      placeholder="500"
                      value={festData.entryFee.toString()}
                      onChange={(value) => handleInputChange("entryFee", parseInt(value) || 0)}
                    required
                      size="large"
                      prefix={<IndianRupee className="w-4 h-4" />}
                      prefixStyling={false}
                    />
                )}
              </div>
            </section>

            {/* Events */}
            <section className="space-y-4">
              <div className="flex items-center gap-3 mb-6">
                <Plus className="w-6 h-6 text-white" />
                <h2 className="text-2xl font-bold text-white">Events</h2>
              </div>
              
              <div className="space-y-6">
                <div className="p-8 border-2 border-dashed border-gray-300 rounded-lg bg-white">
                  <div className="space-y-5">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                        +
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-300">Add Event</h3>
                        <p className="text-sm text-gray-700">All fields marked with * are required</p>
                      </div>
                    </div>

                    <Input
                      label="Event Name *"
                      placeholder="e.g., Dance Competition"
                      value={currentEvent.name}
                      onChange={(value) => setCurrentEvent({ ...currentEvent, name: value })}
                      size="large"
                    />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Input
                        label="Date *"
                        placeholder="e.g., March 15, 2025"
                        type="date"
                        value={currentEvent.date}
                        onChange={(value) => setCurrentEvent({ ...currentEvent, date: value })}
                        size="large"
                      />
                      <Input
                        label="Time *"
                        placeholder="e.g., 10:00 AM"
                        value={currentEvent.time}
                        onChange={(value) => setCurrentEvent({ ...currentEvent, time: value })}
                        size="large"
                        prefix={<Clock className="w-4 h-4" />}
                        prefixStyling={false}
                      />
                      <Input
                        label="Venue *"
                        placeholder="Hall / Ground"
                        value={currentEvent.venue}
                        onChange={(value) => setCurrentEvent({ ...currentEvent, venue: value })}
                        size="large"
                      />
                    </div>

                    <div>
                      <label className="block capitalize text-[13px] text-black mb-2">
                        Category *
                      </label>
                      <select
                        value={currentEvent.category}
                        onChange={(e) => setCurrentEvent({ ...currentEvent, category: e.target.value })}
                        className="w-full h-12 text-base rounded-lg border border-gray-300 hover:border-gray-400 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 bg-white text-black px-3 outline-none duration-150"
                        aria-label="Event Category"
                      >
                        <option value="Technical">Technical</option>
                        <option value="Cultural">Cultural</option>
                        <option value="Sports">Sports</option>
                        <option value="Academic">Academic</option>
                        <option value="Workshop">Workshop</option>
                        <option value="Competition">Competition</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="Prize (optional)"
                        placeholder="e.g., ₹50,000"
                        value={currentEvent.prize}
                        onChange={(value) => setCurrentEvent({ ...currentEvent, prize: value })}
                        size="large"
                        prefix={<Trophy className="w-4 h-4" />}
                        prefixStyling={false}
                      />
                      <Input
                        label="Participant Limit (optional)"
                        placeholder="e.g., 50 teams"
                        value={currentEvent.limit}
                        onChange={(value) => setCurrentEvent({ ...currentEvent, limit: value })}
                        size="large"
                        prefix={<Users className="w-4 h-4" />}
                        prefixStyling={false}
                      />
                    </div>

                    <button
                      type="button"
                      onClick={addEvent}
                      className="w-full h-12 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center justify-center gap-2 font-medium shadow-sm"
                    >
                      <Plus className="w-5 h-5" />
                      Add Event to Fest
                    </button>
                  </div>
                </div>

                {festData.events.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-300">
                        Added Events
                      </h3>
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                        {festData.events.length} {festData.events.length === 1 ? 'Event' : 'Events'}
                      </span>
                    </div>
                    <div className="space-y-3">
                      {festData.events.map((event, index) => (
                        <div key={index} className="group p-6 border border-gray-200 rounded-lg bg-white hover:border-gray-300 transition-all">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm flex-shrink-0 mt-1">
                                  {index + 1}
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-semibold text-lg text-gray-900 dark:text-gray-300">{event.name}</h4>
                                  <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full inline-block mt-2">
                                    {event.category}
                                  </span>
                                  <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-gray-700">
                                      <div className="flex items-center gap-1.5">
                                        <Calendar className="w-3.5 h-3.5" />
                                      <span>{event.date}</span>
                                      </div>
                                    <div className="flex items-center gap-1.5">
                                      <Clock className="w-3.5 h-3.5" />
                                      <span>{event.time}</span>
                                    </div>
                                      <div className="flex items-center gap-1.5">
                                        <MapPin className="w-3.5 h-3.5" />
                                        <span>{event.venue}</span>
                                    </div>
                                    {event.prize && (
                                      <div className="flex items-center gap-1.5">
                                        <Trophy className="w-3.5 h-3.5" />
                                        <span>{event.prize}</span>
                                      </div>
                                    )}
                                    {event.limit && (
                                    <div className="flex items-center gap-1.5">
                                      <Users className="w-3.5 h-3.5" />
                                        <span>{event.limit}</span>
                                    </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeEvent(index)}
                              className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-red-50 rounded-lg text-red-600 hover:text-red-700"
                              title="Remove event"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </section>

            <div className="flex gap-4 justify-end pt-6 border-t border-white/10">
              <button
                type="button"
                onClick={() => {
                  setView("list");
                  setEditingFestId(null);
                }}
                className="px-4 py-2 rounded-lg border border-white/30 text-sm font-medium text-white hover:bg-white/10 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 rounded-lg bg-red-500 text-sm font-medium text-white hover:bg-red-600 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading
                  ? editingFestId
                    ? "SAVING..."
                    : "CREATING..."
                  : editingFestId
                    ? "SAVE CHANGES"
                    : "CREATE FEST"}
              </button>
            </div>
          </form>
        </div>
        )}
      </main>
    </div>
  )
}
