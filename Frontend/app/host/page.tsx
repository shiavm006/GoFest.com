"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { CartoonButton } from "@/components/ui/cartoon-button"
import { ProfileButton } from "@/components/ui/profile-button"
import { Input } from "@/components/ui/input"
import { FileUpload } from "@/components/ui/file-upload"
import { getAuthToken } from "@/lib/api"
import { Calendar, MapPin, Users, Plus, Trash2, Building2, Mail, Phone, Image, IndianRupee, Navigation, Link as LinkIcon, FileText } from "lucide-react"

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

  const [festData, setFestData] = useState({
    name: "",
    slug: "",
    description: "",
    category: "CULTURAL",
    startDate: "",
    endDate: "",
    registrationDeadline: "",
    location: {
      venue: "",
      city: "",
      state: "",
      country: "India"
    },
    organizer: {
      name: "",
      college: "",
      contactEmail: "",
      contactPhone: ""
    },
    coverImage: "",
    website: "",
    brochure: "",
    entryFee: 0,
    isPaid: false,
    events: [] as Array<{
      name: string;
      description: string;
      date: string;
      venue: string;
      college: string;
      maxParticipants: number;
    }>
  })

  const [currentEvent, setCurrentEvent] = useState({
    name: "",
    description: "",
    date: "",
    venue: "",
    college: "",
    maxParticipants: 0
  })

  useEffect(() => {
    const token = getAuthToken()
    if (!token) {
      router.push("/")
    }
  }, [router])

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
  }

  const handleInputChange = (field: string, value: any) => {
    if (field === "name") {
      setFestData({
        ...festData,
        name: value,
        slug: generateSlug(value)
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
    if (currentEvent.name && currentEvent.date) {
      setFestData({
        ...festData,
        events: [...festData.events, currentEvent]
      })
      setCurrentEvent({
        name: "",
        description: "",
        date: "",
        venue: "",
        college: "",
        maxParticipants: 0
      })
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
              state: data.location.state,
              country: data.location.country
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
      const response = await fetch("http://localhost:8000/api/fests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(festData)
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.detail || "Failed to create fest")
      }

      const fest = await response.json()
      router.push(`/events/${fest.slug}`)
    } catch (err: any) {
      setError(err.message)
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
            <section className="space-y-4">
              <div className="flex items-center gap-3 mb-6">
                <Calendar className="w-6 h-6 text-white" />
                <h2 className="text-2xl font-bold text-white">Basic Information</h2>
              </div>
              
              <div className="space-y-4">
                <Input
                  label="Fest Name"
                  placeholder="e.g., Spring Festival 2025"
                  value={festData.name}
                  onChange={(value) => handleInputChange("name", value)}
                  required
                  size="large"
                />

                <Input
                  label="Slug (auto-generated)"
                  value={festData.slug}
                  disabled
                  size="large"
                />

                <div>
                  <label className="block capitalize text-[13px] text-gray-900 dark:text-gray-300 mb-2">
                    Category
                  </label>
                  <select
                    required
                    value={festData.category}
                    onChange={(e) => handleInputChange("category", e.target.value)}
                    className="w-full h-12 text-base rounded-lg border border-gray-alpha-400 hover:border-gray-alpha-500 focus:border-transparent focus:shadow-focus-input bg-background-100 text-geist-foreground px-3 outline-none duration-150"
                    aria-label="Fest Category"
                  >
                    <option value="CULTURAL">Cultural</option>
                    <option value="TECHNICAL">Technical</option>
                    <option value="SPORTS">Sports</option>
                    <option value="LITERARY">Literary</option>
                    <option value="BUSINESS">Business</option>
                    <option value="MUSIC">Music</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block capitalize text-[13px] text-gray-900 dark:text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    required
                    value={festData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    className="w-full h-32 text-base rounded-lg border border-gray-alpha-400 hover:border-gray-alpha-500 focus:border-transparent focus:shadow-focus-input bg-background-100 text-geist-foreground px-3 py-3 outline-none duration-150 resize-none"
                    placeholder="Describe your fest..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input
                    label="Start Date"
                    type="date"
                    value={festData.startDate}
                    onChange={(value) => handleInputChange("startDate", value)}
                    required
                    size="large"
                  />
                  <Input
                    label="End Date"
                    type="date"
                    value={festData.endDate}
                    onChange={(value) => handleInputChange("endDate", value)}
                    required
                    size="large"
                  />
                  <Input
                    label="Registration Deadline"
                    type="date"
                    value={festData.registrationDeadline}
                    onChange={(value) => handleInputChange("registrationDeadline", value)}
                    required
                    size="large"
                  />
                </div>
              </div>
            </section>

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
                  label="Venue"
                  placeholder="College Campus / Hall Name"
                  value={festData.location.venue}
                  onChange={(value) => handleNestedChange("location", "venue", value)}
                  required
                  size="large"
                  prefix={<Building2 className="w-4 h-4" />}
                  prefixStyling={false}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="City"
                    placeholder="e.g., Mumbai"
                    value={festData.location.city}
                    onChange={(value) => handleNestedChange("location", "city", value)}
                    required
                    size="large"
                  />
                  <Input
                    label="State"
                    placeholder="e.g., Maharashtra"
                    value={festData.location.state}
                    onChange={(value) => handleNestedChange("location", "state", value)}
                    required
                    size="large"
                  />
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <div className="flex items-center gap-3 mb-6">
                <Users className="w-6 h-6 text-white" />
                <h2 className="text-2xl font-bold text-white">Organizer Details</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Organizer Name"
                  placeholder="Full name"
                  value={festData.organizer.name}
                  onChange={(value) => handleNestedChange("organizer", "name", value)}
                  required
                  size="large"
                />
                <Input
                  label="College"
                  placeholder="College name"
                  value={festData.organizer.college}
                  onChange={(value) => handleNestedChange("organizer", "college", value)}
                  required
                  size="large"
                />
                <Input
                  label="Contact Email"
                  type="email"
                  placeholder="email@example.com"
                  value={festData.organizer.contactEmail}
                  onChange={(value) => handleNestedChange("organizer", "contactEmail", value)}
                  required
                  size="large"
                  prefix={<Mail className="w-4 h-4" />}
                  prefixStyling={false}
                />
                <Input
                  label="Contact Phone"
                  type="tel"
                  placeholder="+91 1234567890"
                  value={festData.organizer.contactPhone}
                  onChange={(value) => handleNestedChange("organizer", "contactPhone", value)}
                  required
                  size="large"
                  prefix={<Phone className="w-4 h-4" />}
                  prefixStyling={false}
                />
              </div>
            </section>

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
                    onUpload={(url) => handleInputChange("coverImage", url)}
                    value={festData.coverImage}
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

            <section className="space-y-4">
              <div className="flex items-center gap-3 mb-6">
                <IndianRupee className="w-6 h-6 text-white" />
                <h2 className="text-2xl font-bold text-white">Pricing</h2>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-6 border border-gray-alpha-400 rounded-lg bg-background-100 hover:bg-gray-100 transition-colors">
                  <input
                    type="checkbox"
                    id="isPaid"
                    checked={festData.isPaid}
                    onChange={(e) => handleInputChange("isPaid", e.target.checked)}
                    className="w-5 h-5 rounded cursor-pointer accent-blue-500"
                  />
                  <div className="flex-1">
                    <label htmlFor="isPaid" className="text-base font-semibold cursor-pointer block text-gray-900 dark:text-gray-300">
                      This is a paid fest
                    </label>
                    <p className="text-sm text-gray-700 mt-1">
                      Enable if attendees need to pay an entry fee
                    </p>
                  </div>
                </div>

                {festData.isPaid && (
                  <div className="pl-4 border-l-4 border-blue-500">
                    <Input
                      label="Entry Fee (₹)"
                      type="number"
                      placeholder="500"
                      value={festData.entryFee.toString()}
                      onChange={(value) => handleInputChange("entryFee", parseInt(value) || 0)}
                      size="large"
                      prefix={<IndianRupee className="w-4 h-4" />}
                      prefixStyling={false}
                    />
                  </div>
                )}
              </div>
            </section>

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
                        <p className="text-sm text-gray-700">Fill in the details below to add an event to your fest</p>
                      </div>
                    </div>

                    <Input
                      label="Event Name"
                      placeholder="e.g., Dance Competition"
                      value={currentEvent.name}
                      onChange={(value) => setCurrentEvent({ ...currentEvent, name: value })}
                      size="large"
                    />
                    
                    <div>
                      <label className="block capitalize text-[13px] text-gray-900 dark:text-gray-300 mb-2">
                        Event Description
                      </label>
                      <textarea
                        value={currentEvent.description}
                        onChange={(e) => setCurrentEvent({ ...currentEvent, description: e.target.value })}
                        className="w-full h-24 text-base rounded-lg border border-gray-alpha-400 hover:border-gray-alpha-500 focus:border-transparent focus:shadow-focus-input bg-background-100 text-geist-foreground px-3 py-3 outline-none duration-150 resize-none"
                        placeholder="Describe the event..."
                      />
                    </div>

                    <Input
                      label="College / University Name"
                      placeholder="e.g., IIT Delhi"
                      value={currentEvent.college}
                      onChange={(value) => setCurrentEvent({ ...currentEvent, college: value })}
                      size="large"
                      prefix={<Building2 className="w-4 h-4" />}
                      prefixStyling={false}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Input
                        label="Date"
                        type="date"
                        value={currentEvent.date}
                        onChange={(value) => setCurrentEvent({ ...currentEvent, date: value })}
                        size="large"
                      />
                      <Input
                        label="Venue"
                        placeholder="Event venue"
                        value={currentEvent.venue}
                        onChange={(value) => setCurrentEvent({ ...currentEvent, venue: value })}
                        size="large"
                      />
                      <Input
                        label="Max Participants"
                        type="number"
                        placeholder="Unlimited"
                        value={currentEvent.maxParticipants.toString()}
                        onChange={(value) => setCurrentEvent({ ...currentEvent, maxParticipants: parseInt(value) || 0 })}
                        size="large"
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
                                  {event.college && (
                                    <p className="text-sm text-blue-600 dark:text-blue-400 mt-1 font-medium flex items-center gap-1.5">
                                      <Building2 className="w-3.5 h-3.5" />
                                      {event.college}
                                    </p>
                                  )}
                                  {event.description && (
                                    <p className="text-sm text-gray-700 mt-2 leading-relaxed">{event.description}</p>
                                  )}
                                  <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-gray-700">
                                    {event.date && (
                                      <div className="flex items-center gap-1.5">
                                        <Calendar className="w-3.5 h-3.5" />
                                        <span>{new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                      </div>
                                    )}
                                    {event.venue && (
                                      <div className="flex items-center gap-1.5">
                                        <MapPin className="w-3.5 h-3.5" />
                                        <span>{event.venue}</span>
                                      </div>
                                    )}
                                    <div className="flex items-center gap-1.5">
                                      <Users className="w-3.5 h-3.5" />
                                      <span>Max: {event.maxParticipants || "Unlimited"}</span>
                                    </div>
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
