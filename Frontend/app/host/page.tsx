"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { CartoonButton } from "@/components/ui/cartoon-button"
import { ProfileButton } from "@/components/ui/profile-button"
import { Input } from "@/components/ui/input"
import { FileUpload } from "@/components/ui/file-upload"
import { getAuthToken, createFest } from "@/lib/api"
import { Calendar, MapPin, Users, Plus, Trash2, Building2, Mail, Phone, Image, IndianRupee, Navigation, Link as LinkIcon, FileText, Clock, Trophy } from "lucide-react"

export default function HostFestPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingLocation, setIsLoadingLocation] = useState(false)
  const [error, setError] = useState("")
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const token = getAuthToken();
    setIsLoggedIn(!!token);
  }, []);

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
      address: ""
    },
    organizer: {
      name: "",
      role: "",
      college: "",
      email: "",
      phone: "",
      instagram: "",
      linkedin: ""
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
    }>
  })

  const [currentEvent, setCurrentEvent] = useState({
    name: "",
    date: "",
    time: "",
    venue: "",
    category: "Technical",
    prize: "",
    limit: ""
  })

  useEffect(() => {
    const token = getAuthToken()
    if (!token) {
      router.push("/")
    }
  }, [router])

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
  }

  const handleInputChange = (field: string, value: any) => {
    if (field === "title") {
      setFestData({
        ...festData,
        title: value,
        slug: generateSlug(value)
      })
    } else if (field === "entryType") {
      setFestData({
        ...festData,
        entryType: value,
        entryFee: value === "Free" ? 0 : festData.entryFee
      })
    } else {
      setFestData({ ...festData, [field]: value })
    }
  }

  const handleNestedChange = (parent: string, field: string, value: any) => {
    setFestData({
      ...festData,
      [parent]: {
        ...(festData[parent as keyof typeof festData] as any),
        [field]: value
      }
    })
  }

  const addEvent = () => {
    if (currentEvent.name && currentEvent.date && currentEvent.time && currentEvent.venue && currentEvent.category) {
      setFestData({
        ...festData,
        events: [...festData.events, currentEvent]
      })
      setCurrentEvent({
        name: "",
        date: "",
        time: "",
        venue: "",
        category: "Technical",
        prize: "",
        limit: ""
      })
    } else {
      setError("Please fill all required event fields (Name, Date, Time, Venue, Category)")
      setTimeout(() => setError(""), 3000)
    }
  }

  const removeEvent = (index: number) => {
    setFestData({
      ...festData,
      events: festData.events.filter((_, i) => i !== index)
    })
  }

  const getCurrentLocation = async () => {
    setIsLoadingLocation(true)
    setError("")

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser")
      setIsLoadingLocation(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords
          const token = getAuthToken()
          
          const response = await fetch(
            `http://localhost:8000/api/location/reverse-geocode?lat=${latitude}&lon=${longitude}`,
            {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            }
          )

          if (!response.ok) {
            const error = await response.json()
            throw new Error(error.detail || "Failed to fetch location")
          }

          const data = await response.json()

          setFestData({
            ...festData,
            location: {
              ...festData.location,
              city: data.location.city,
              state: data.location.state
            }
          })
        } catch (err: any) {
          setError(err.message || "Could not fetch location details. Please enter manually.")
        } finally {
          setIsLoadingLocation(false)
        }
      },
      (error) => {
        setIsLoadingLocation(false)
        if (error.code === error.PERMISSION_DENIED) {
          setError("Location access denied. Please enable location permissions.")
        } else {
          setError("Could not get your location. Please enter manually.")
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const token = getAuthToken()
      if (!token) {
        throw new Error("Please login to create a fest")
      }

      // Validate required fields
      if (!festData.title) throw new Error("Fest title is required")
      if (!festData.image) throw new Error("Cover image is required")
      if (!festData.college) throw new Error("College name is required")
      if (!festData.date) throw new Error("Fest date is required")
      if (!festData.description) throw new Error("Description is required")
      if (!festData.location.city) throw new Error("City is required")
      if (!festData.location.state) throw new Error("State is required")
      if (!festData.organizer.name) throw new Error("Organizer name is required")
      if (!festData.organizer.role) throw new Error("Organizer role is required")
      if (!festData.organizer.college) throw new Error("Organizer college is required")

      // Submit directly - no transformation needed!
      const fest = await createFest(festData)
      router.push(`/events/${fest.slug}`)
    } catch (err: any) {
      setError(err.message)
      console.error("Fest creation error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="w-full absolute h-full z-0 bg-[radial-gradient(circle,_rgba(255,255,255,0.12)_1px,_transparent_1px)] opacity-20 [background-size:20px_20px]"/>
      
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
            {!isLoggedIn && (
              <Link href="/login" className="text-white/70 hover:text-white transition-colors">
                Login
              </Link>
            )}
          </nav>
          <div className="flex items-center gap-2 scale-75">
            <CartoonButton label="HOST+" color="bg-white" onClick={() => router.push("/host")} />
          </div>
          <ProfileButton />
        </div>
      </header>

      <main className="container mx-auto px-6 py-12 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12">
            <h1 className="text-5xl font-bold mb-4 text-white">Host Your Fest</h1>
            <p className="text-white/70 text-lg">
              Fill in the details below to list your college fest on our platform
            </p>
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
                  label="Slug (auto-generated)"
                  value={festData.slug}
                  disabled
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
                  <label className="block capitalize text-[13px] text-gray-900 dark:text-gray-300 mb-2">
                    Category *
                  </label>
                  <select
                    required
                    value={festData.category}
                    onChange={(e) => handleInputChange("category", e.target.value)}
                    className="w-full h-12 text-base rounded-lg border border-gray-alpha-400 hover:border-gray-alpha-500 focus:border-transparent focus:shadow-focus-input bg-background-100 text-geist-foreground px-3 outline-none duration-150"
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
                  <label className="block capitalize text-[13px] text-gray-900 dark:text-gray-300 mb-2">
                    Description *
                  </label>
                  <textarea
                    required
                    value={festData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    className="w-full h-32 text-base rounded-lg border border-gray-alpha-400 hover:border-gray-alpha-500 focus:border-transparent focus:shadow-focus-input bg-background-100 text-geist-foreground px-3 py-3 outline-none duration-150 resize-none"
                    placeholder="Describe your fest..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Date *"
                    placeholder="e.g., March 15-17, 2025"
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
                  <label className="block capitalize text-[13px] text-gray-900 dark:text-gray-300 mb-2">
                    Entry Type *
                    </label>
                  <select
                    required
                    value={festData.entryType}
                    onChange={(e) => handleInputChange("entryType", e.target.value)}
                    className="w-full h-12 text-base rounded-lg border border-gray-alpha-400 hover:border-gray-alpha-500 focus:border-transparent focus:shadow-focus-input bg-background-100 text-geist-foreground px-3 outline-none duration-150"
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
                <div className="p-8 border-2 border-dashed border-gray-alpha-400 rounded-lg bg-background-100">
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
                      <label className="block capitalize text-[13px] text-gray-900 dark:text-gray-300 mb-2">
                        Category *
                      </label>
                      <select
                        value={currentEvent.category}
                        onChange={(e) => setCurrentEvent({ ...currentEvent, category: e.target.value })}
                        className="w-full h-12 text-base rounded-lg border border-gray-alpha-400 hover:border-gray-alpha-500 focus:border-transparent focus:shadow-focus-input bg-background-100 text-geist-foreground px-3 outline-none duration-150"
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
                      className="w-full h-12 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center justify-center gap-2 font-semibold shadow-sm"
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
                        <div key={index} className="group p-6 border border-gray-alpha-400 rounded-lg bg-background-100 hover:shadow-md transition-all">
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
              <CartoonButton
                label="CANCEL"
                color="bg-white"
                onClick={() => router.back()}
              />
              <CartoonButton
                label={isLoading ? "CREATING..." : "CREATE FEST"}
                color="bg-red-500"
                disabled={isLoading}
              />
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
