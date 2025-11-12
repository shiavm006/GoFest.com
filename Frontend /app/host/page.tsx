"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { CartoonButton } from "@/components/ui/cartoon-button"
import { Input } from "@/components/ui/input"
import { getAuthToken } from "@/lib/api"
import { Calendar, MapPin, Users, Plus, Trash2, Building2, Mail, Phone, Image, IndianRupee, Navigation, Link, FileText } from "lucide-react"

export default function HostFestPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingLocation, setIsLoadingLocation] = useState(false)
  const [error, setError] = useState("")

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
    logo: "",
    website: "",
    brochure: "",
    entryFee: 0,
    isPaid: false,
    events: []
  })

  const [currentEvent, setCurrentEvent] = useState({
    name: "",
    description: "",
    date: "",
    venue: "",
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
          
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`,
            {
              headers: {
                'User-Agent': 'GoFest.com'
              }
            }
          )

          if (!response.ok) throw new Error("Failed to fetch location")

          const data = await response.json()
          const address = data.address

          setFestData({
            ...festData,
            location: {
              ...festData.location,
              city: address.city || address.town || address.village || "",
              state: address.state || "",
              country: address.country || "India"
            }
          })
        } catch (err: any) {
          setError("Could not fetch location details. Please enter manually.")
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
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background border-b border-gray-alpha-400">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => router.push("/")}
            className="text-2xl font-bold hover:opacity-60 transition-opacity"
          >
            GOFEST.COM
          </button>
          <CartoonButton 
            label="BACK"
            color="bg-gray-100"
            onClick={() => router.back()}
          />
        </div>
      </header>

      <main className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12">
            <h1 className="text-5xl font-bold mb-4">Host Your Fest</h1>
            <p className="text-gray-700 text-lg">
              Fill in the details below to list your college fest on our platform
            </p>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-300 text-red-900 px-6 py-4 rounded-lg mb-8">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-12">
            <section>
              <div className="flex items-center gap-3 mb-6">
                <Calendar className="w-6 h-6" />
                <h2 className="text-2xl font-bold">Basic Information</h2>
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

            <section>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <MapPin className="w-6 h-6" />
                  <h2 className="text-2xl font-bold">Location</h2>
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

            <section>
              <div className="flex items-center gap-3 mb-6">
                <Users className="w-6 h-6" />
                <h2 className="text-2xl font-bold">Organizer Details</h2>
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

            <section>
              <div className="flex items-center gap-3 mb-6">
                <Image className="w-6 h-6" />
                <h2 className="text-2xl font-bold">Images & Media</h2>
              </div>
              
              <div className="space-y-4">
                <Input
                  label="Cover Image URL"
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  value={festData.coverImage}
                  onChange={(value) => handleInputChange("coverImage", value)}
                  required
                  size="large"
                  prefix="https://"
                />

                <Input
                  label="Logo URL (optional)"
                  type="url"
                  placeholder="https://example.com/logo.jpg"
                  value={festData.logo}
                  onChange={(value) => handleInputChange("logo", value)}
                  size="large"
                  prefix="https://"
                />

                <Input
                  label="Website URL (optional)"
                  type="url"
                  placeholder="https://yourfest.com"
                  value={festData.website}
                  onChange={(value) => handleInputChange("website", value)}
                  size="large"
                  prefix={<Link className="w-4 h-4" />}
                  prefixStyling={false}
                />

                <Input
                  label="Brochure URL (optional)"
                  type="url"
                  placeholder="https://example.com/brochure.pdf"
                  value={festData.brochure}
                  onChange={(value) => handleInputChange("brochure", value)}
                  size="large"
                  prefix={<FileText className="w-4 h-4" />}
                  prefixStyling={false}
                />
              </div>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-6">
                <IndianRupee className="w-6 h-6" />
                <h2 className="text-2xl font-bold">Pricing</h2>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 border border-gray-alpha-400 rounded-lg">
                  <input
                    type="checkbox"
                    id="isPaid"
                    checked={festData.isPaid}
                    onChange={(e) => handleInputChange("isPaid", e.target.checked)}
                    className="w-5 h-5"
                  />
                  <label htmlFor="isPaid" className="text-base font-medium cursor-pointer">
                    This is a paid fest
                  </label>
                </div>

                {festData.isPaid && (
                  <Input
                    label="Entry Fee"
                    type="number"
                    placeholder="0"
                    value={festData.entryFee.toString()}
                    onChange={(value) => handleInputChange("entryFee", parseInt(value) || 0)}
                    size="large"
                    prefix={<IndianRupee className="w-4 h-4" />}
                    prefixStyling={false}
                  />
                )}
              </div>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-6">
                <Plus className="w-6 h-6" />
                <h2 className="text-2xl font-bold">Events</h2>
              </div>
              
              <div className="space-y-4 p-6 border border-gray-alpha-400 rounded-lg bg-background-100">
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
                    placeholder="0"
                    value={currentEvent.maxParticipants.toString()}
                    onChange={(value) => setCurrentEvent({ ...currentEvent, maxParticipants: parseInt(value) || 0 })}
                    size="large"
                  />
                </div>

                <button
                  type="button"
                  onClick={addEvent}
                  className="w-full h-12 bg-gray-100 hover:bg-gray-200 border border-gray-alpha-400 rounded-lg text-geist-foreground transition-colors flex items-center justify-center gap-2 font-medium"
                >
                  <Plus className="w-5 h-5" />
                  Add Event
                </button>
              </div>

              {festData.events.length > 0 && (
                <div className="mt-6 space-y-3">
                  <h3 className="text-lg font-semibold">Added Events ({festData.events.length})</h3>
                  {festData.events.map((event, index) => (
                    <div key={index} className="p-4 border border-gray-alpha-400 rounded-lg bg-background-100 flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold text-lg">{event.name}</h4>
                        <p className="text-sm text-gray-700 mt-1">{event.description}</p>
                        <p className="text-xs text-gray-900 mt-2 flex items-center gap-4">
                          <span>{event.date}</span>
                          <span>• {event.venue}</span>
                          <span>• Max: {event.maxParticipants || "Unlimited"}</span>
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeEvent(index)}
                        className="text-red-900 hover:text-red-700 transition-colors p-2"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <div className="flex gap-4 justify-end pt-6 border-t border-gray-alpha-400">
              <CartoonButton
                label="CANCEL"
                color="bg-gray-100"
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
