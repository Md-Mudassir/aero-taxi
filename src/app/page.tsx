'use client'

import { useState } from 'react'
import { MapPin, ArrowRight, Search, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { bangaloreLocations } from '@/lib/mock-data'
import { useRouter } from 'next/navigation'

export default function Home() {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const [fromLocation, setFromLocation] = useState<Location | null>(null)
  const [toLocation, setToLocation] = useState<Location | null>(null)
  const [route, setRoute] = useState<DroneRoute | null>(null)
  const [step, setStep] = useState<'select-from' | 'select-to' | 'confirm-booking'>('select-from')
  const [showMap, setShowMap] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredLocations, setFilteredLocations] = useState<Location[]>(bangaloreLocations)

  // Initialize map
  useEffect(() => {
    if (!showMap || !mapContainer.current || map.current) return

    mapboxgl.accessToken = MAPBOX_TOKEN

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [77.5946, 12.9716], // Bangalore center
      zoom: 11
    })

    // Add markers for all locations
    bangaloreLocations.forEach(location => {
      const marker = new mapboxgl.Marker({
        color: location.type === 'pickup' ? '#22c55e' : '#ef4444'
      })
        .setLngLat(location.coordinates)
        .setPopup(new mapboxgl.Popup().setHTML(`<strong>${location.name}</strong><br>${location.area}`))
        .addTo(map.current!)

      // Add click handler
      marker.getElement().addEventListener('click', () => {
        handleLocationSelect(location)
        setShowMap(false)
      })
    })

    return () => {
      if (map.current) {
        map.current.remove()
        map.current = null
      }
    }
  }, [showMap])

  // Filter locations based on search
  useEffect(() => {
    const filtered = bangaloreLocations.filter(location =>
      location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      location.area.toLowerCase().includes(searchQuery.toLowerCase())
    )
    setFilteredLocations(filtered)
  }, [searchQuery])

  const handleLocationSelect = (location: Location) => {
    if (step === 'select-from') {
      setFromLocation(location)
      setStep('select-to')
    } else if (step === 'select-to') {
      if (location.id === fromLocation?.id) {
        return // Can't select same location
      }
      setToLocation(location)
      const calculatedRoute = calculateRoute(fromLocation!, location)
      setRoute(calculatedRoute)
      setStep('confirm-booking')
    }
    setSearchQuery('')
    setShowMap(false)
  }

  const resetBooking = () => {
    setFromLocation(null)
    setToLocation(null)
    setRoute(null)
    setStep('select-from')
    setSearchQuery('')
    setShowMap(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Plane className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Aero Taxi</h1>
              <p className="text-sm text-gray-600">Drone taxi service in Bangalore</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 py-6">
        {/* Progress Indicator */}
        <div className="flex items-center justify-center mb-6">
          <div className="flex items-center space-x-4">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step === 'select-from' ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-600'
            }`}>
              1
            </div>
            <div className="w-8 h-1 bg-gray-200 rounded">
              <div className={`h-full bg-blue-600 rounded transition-all ${
                step !== 'select-from' ? 'w-full' : 'w-0'
              }`} />
            </div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step === 'select-to' ? 'bg-blue-600 text-white' : 
              step === 'confirm-booking' ? 'bg-blue-100 text-blue-600' : 'bg-gray-200 text-gray-400'
            }`}>
              2
            </div>
            <div className="w-8 h-1 bg-gray-200 rounded">
              <div className={`h-full bg-blue-600 rounded transition-all ${
                step === 'confirm-booking' ? 'w-full' : 'w-0'
              }`} />
            </div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step === 'confirm-booking' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-400'
            }`}>
              3
            </div>
          </div>
        </div>

        {/* Step Content */}
        {step === 'select-from' && (
          <div>
            <h2 className="text-xl font-semibold mb-4 text-center">Where are you?</h2>
            
            {/* Search and Map Toggle */}
            <div className="mb-4 space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search locations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-10"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    <X className="h-4 w-4 text-gray-400" />
                  </button>
                )}
              </div>
              
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setShowMap(!showMap)}
              >
                <MapPin className="h-4 w-4 mr-2" />
                {showMap ? 'Hide Map' : 'Show Map'}
              </Button>
            </div>

            {/* Map View */}
            {showMap && (
              <Card className="mb-4">
                <CardContent className="p-0">
                  <div ref={mapContainer} className="w-full h-64 rounded-lg" />
                </CardContent>
              </Card>
            )}

            {/* Location List */}
            <div className="space-y-3">
              {(searchQuery ? filteredLocations : bangaloreLocations)
                .filter(loc => loc.type === 'pickup')
                .map((location) => (
                <Card 
                  key={location.id} 
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handleLocationSelect(location)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <MapPin className="h-5 w-5 text-blue-600" />
                      <div>
                        <h3 className="font-medium">{location.name}</h3>
                        <p className="text-sm text-gray-600">{location.area}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {step === 'select-to' && (
          <div>
            <div className="mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                <MapPin className="h-4 w-4" />
                From: {fromLocation?.name}
              </div>
              <h2 className="text-xl font-semibold text-center">Where to?</h2>
            </div>
            
            {/* Search and Map Toggle */}
            <div className="mb-4 space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search destinations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-10"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    <X className="h-4 w-4 text-gray-400" />
                  </button>
                )}
              </div>
              
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setShowMap(!showMap)}
              >
                <MapPin className="h-4 w-4 mr-2" />
                {showMap ? 'Hide Map' : 'Show Map'}
              </Button>
            </div>

            {/* Map View */}
            {showMap && (
              <Card className="mb-4">
                <CardContent className="p-0">
                  <div ref={mapContainer} className="w-full h-64 rounded-lg" />
                </CardContent>
              </Card>
            )}

            <div className="space-y-3">
              {(searchQuery ? filteredLocations : bangaloreLocations).map((location) => (
                <Card 
                  key={location.id} 
                  className={`cursor-pointer hover:shadow-md transition-shadow ${
                    location.id === fromLocation?.id ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  onClick={() => handleLocationSelect(location)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <MapPin className="h-5 w-5 text-blue-600" />
                      <div>
                        <h3 className="font-medium">{location.name}</h3>
                        <p className="text-sm text-gray-600">{location.area}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <Button 
              variant="outline" 
              className="w-full mt-4"
              onClick={resetBooking}
            >
              Back
            </Button>
          </div>
        )}

        {step === 'confirm-booking' && route && (
          <div>
            <h2 className="text-xl font-semibold mb-4 text-center">Confirm your ride</h2>
            
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-lg">Route Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="font-medium">{route.from.name}</p>
                    <p className="text-sm text-gray-600">{route.from.area}</p>
                  </div>
                </div>
                <div className="ml-1.5 w-0.5 h-8 bg-gray-300"></div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div>
                    <p className="font-medium">{route.to.name}</p>
                    <p className="text-sm text-gray-600">{route.to.area}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardContent className="p-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="flex items-center justify-center mb-1">
                      <MapPin className="h-4 w-4 text-gray-600" />
                    </div>
                    <p className="text-sm text-gray-600">Distance</p>
                    <p className="font-semibold">{route.distance} km</p>
                  </div>
                  <div>
                    <div className="flex items-center justify-center mb-1">
                      <Clock className="h-4 w-4 text-gray-600" />
                    </div>
                    <p className="text-sm text-gray-600">Duration</p>
                    <p className="font-semibold">{route.duration} min</p>
                  </div>
                  <div>
                    <div className="flex items-center justify-center mb-1">
                      <IndianRupee className="h-4 w-4 text-gray-600" />
                    </div>
                    <p className="text-sm text-gray-600">Price</p>
                    <p className="font-semibold">₹{route.price}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="mb-6 bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <h3 className="font-medium mb-2">Velipot (Drone Station)</h3>
                <p className="text-sm text-gray-600">
                  You&apos;ll be picked up from <strong>{route.velipot.name}</strong> in {route.velipot.area}
                </p>
              </CardContent>
            </Card>

            <div className="space-y-3">
              <Link href="/payment" className="block">
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  Book for ₹{route.price}
                </Button>
              </Link>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={resetBooking}
              >
                Change Route
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
