'use client'

import { useState } from 'react'
import { MapPin, Clock, IndianRupee, Calendar, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { mockRides, type Ride } from '@/lib/mock-data'
import Link from 'next/link'

type FilterType = 'all' | 'completed' | 'cancelled'

export default function RidesPage() {
  const [filter, setFilter] = useState<FilterType>('all')
  
  const filteredRides = mockRides.filter(ride => {
    if (filter === 'all') return true
    return ride.status === filter
  })

  const getStatusColor = (status: Ride['status']) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      case 'in_transit': return 'bg-blue-100 text-blue-800'
      case 'confirmed': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: Ride['status']) => {
    switch (status) {
      case 'completed': return 'Completed'
      case 'cancelled': return 'Cancelled'
      case 'in_transit': return 'In Transit'
      case 'confirmed': return 'Confirmed'
      case 'booked': return 'Booked'
      case 'drone_dispatched': return 'Drone Dispatched'
      case 'at_velipot': return 'At Velipot'
      case 'passenger_verified': return 'Passenger Verified'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-900">My Rides</h1>
          <p className="text-sm text-gray-600">View your ride history and current bookings</p>
        </div>
      </div>

      <div className="px-4 py-6">
        {/* Filter Buttons */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('all')}
            className="whitespace-nowrap"
          >
            <Filter className="h-4 w-4 mr-2" />
            All Rides
          </Button>
          <Button
            variant={filter === 'completed' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('completed')}
            className="whitespace-nowrap"
          >
            Completed
          </Button>
          <Button
            variant={filter === 'cancelled' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('cancelled')}
            className="whitespace-nowrap"
          >
            Cancelled
          </Button>
        </div>

        {/* Current Ride (if any) */}
        <Card className="mb-6 border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-lg text-blue-800">Current Ride</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <MapPin className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="font-semibold text-blue-800 mb-2">No Active Rides</h3>
              <p className="text-sm text-blue-600 mb-4">Book a new ride to get started</p>
              <Link href="/">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Book New Ride
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Ride History */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Ride History</h2>
          
          {filteredRides.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-600 mb-2">No rides found</h3>
                <p className="text-sm text-gray-500">
                  {filter === 'all' 
                    ? "You haven't taken any rides yet" 
                    : `No ${filter} rides found`
                  }
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredRides.map((ride) => (
              <Card key={ride.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(ride.status)}`}>
                          {getStatusText(ride.status)}
                        </span>
                        <span className="text-xs text-gray-500">
                          {ride.bookingTime.toLocaleDateString()}
                        </span>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="font-medium">{ride.route.from.name}</span>
                          <span className="text-gray-500">({ride.route.from.area})</span>
                        </div>
                        <div className="ml-3 w-0.5 h-4 bg-gray-300"></div>
                        <div className="flex items-center gap-2 text-sm">
                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                          <span className="font-medium">{ride.route.to.name}</span>
                          <span className="text-gray-500">({ride.route.to.area})</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-lg font-bold text-gray-900 mb-1">
                        <IndianRupee className="h-4 w-4" />
                        {ride.route.price}
                      </div>
                      <div className="text-xs text-gray-500">
                        Drone: {ride.droneId}
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 pt-3 border-t border-gray-100 text-xs text-gray-600">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      <span>{ride.route.distance} km</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{ride.route.duration} min</span>
                    </div>
                    <div className="text-right">
                      <span>Via {ride.route.velipot.name}</span>
                    </div>
                  </div>
                  
                  {ride.status === 'completed' && ride.actualArrival && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <div className="flex justify-between text-xs text-gray-600">
                        <span>Completed at:</span>
                        <span>{ride.actualArrival.toLocaleString()}</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 space-y-3">
          <h3 className="font-semibold text-gray-900">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            <Link href="/">
              <Button variant="outline" className="w-full">
                Book New Ride
              </Button>
            </Link>
            <Button variant="outline" className="w-full">
              Download Receipt
            </Button>
          </div>
        </div>

        {/* Ride Statistics */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg">Your Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">{mockRides.length}</div>
                <div className="text-xs text-gray-600">Total Rides</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {mockRides.reduce((sum, ride) => sum + ride.route.distance, 0).toFixed(1)}
                </div>
                <div className="text-xs text-gray-600">km Traveled</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">
                  ₹{mockRides.reduce((sum, ride) => sum + ride.route.price, 0)}
                </div>
                <div className="text-xs text-gray-600">Total Spent</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
