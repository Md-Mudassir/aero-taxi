// Mock data for Bangalore localities and drone taxi service

export interface Location {
  id: string
  name: string
  area: string
  coordinates: [number, number] // [longitude, latitude]
  type: 'pickup' | 'dropoff' | 'velipot'
}

export interface DroneRoute {
  id: string
  from: Location
  to: Location
  distance: number // in km
  duration: number // in minutes
  price: number // in INR
  velipot: Location
}

export interface Ride {
  id: string
  route: DroneRoute
  status: 'booked' | 'confirmed' | 'drone_dispatched' | 'at_velipot' | 'passenger_verified' | 'in_transit' | 'completed' | 'cancelled'
  bookingTime: Date
  estimatedArrival?: Date
  actualArrival?: Date
  passengerVerified?: boolean
  droneId: string
}

// Bangalore locations with real coordinates
export const bangaloreLocations: Location[] = [
  {
    id: 'koramangala',
    name: 'Koramangala',
    area: 'South Bangalore',
    coordinates: [77.6309, 12.9279],
    type: 'pickup'
  },
  {
    id: 'indiranagar',
    name: 'Indiranagar',
    area: 'East Bangalore',
    coordinates: [77.6408, 12.9784],
    type: 'pickup'
  },
  {
    id: 'whitefield',
    name: 'Whitefield',
    area: 'East Bangalore',
    coordinates: [77.7500, 12.9698],
    type: 'pickup'
  },
  {
    id: 'electronic_city',
    name: 'Electronic City',
    area: 'South Bangalore',
    coordinates: [77.6648, 12.8456],
    type: 'pickup'
  },
  {
    id: 'mg_road',
    name: 'MG Road',
    area: 'Central Bangalore',
    coordinates: [77.6033, 12.9762],
    type: 'pickup'
  },
  {
    id: 'airport',
    name: 'Kempegowda International Airport',
    area: 'North Bangalore',
    coordinates: [77.7064, 13.1986],
    type: 'dropoff'
  },
  {
    id: 'hebbal',
    name: 'Hebbal',
    area: 'North Bangalore',
    coordinates: [77.5946, 13.0358],
    type: 'pickup'
  },
  {
    id: 'jayanagar',
    name: 'Jayanagar',
    area: 'South Bangalore',
    coordinates: [77.5833, 12.9254],
    type: 'pickup'
  },
  {
    id: 'btm_layout',
    name: 'BTM Layout',
    area: 'South Bangalore',
    coordinates: [77.6100, 12.9166],
    type: 'pickup'
  },
  {
    id: 'marathahalli',
    name: 'Marathahalli',
    area: 'East Bangalore',
    coordinates: [77.6973, 12.9591],
    type: 'pickup'
  }
]

// Velipots (drone stations)
export const velipots: Location[] = [
  {
    id: 'velipot_central',
    name: 'Central Velipot',
    area: 'Cubbon Park',
    coordinates: [77.5946, 12.9716],
    type: 'velipot'
  },
  {
    id: 'velipot_south',
    name: 'South Velipot',
    area: 'Bannerghatta Road',
    coordinates: [77.5946, 12.8969],
    type: 'velipot'
  },
  {
    id: 'velipot_east',
    name: 'East Velipot',
    area: 'Sarjapur Road',
    coordinates: [77.6973, 12.9298],
    type: 'velipot'
  },
  {
    id: 'velipot_north',
    name: 'North Velipot',
    area: 'Yelahanka',
    coordinates: [77.5946, 13.1007],
    type: 'velipot'
  }
]

// Function to calculate route and pricing
export function calculateRoute(from: Location, to: Location): DroneRoute {
  // Simple distance calculation (Haversine formula approximation)
  const R = 6371 // Earth's radius in km
  const dLat = (to.coordinates[1] - from.coordinates[1]) * Math.PI / 180
  const dLon = (to.coordinates[0] - from.coordinates[0]) * Math.PI / 180
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(from.coordinates[1] * Math.PI / 180) * Math.cos(to.coordinates[1] * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  const distance = R * c

  // Find nearest velipot
  const nearestVelipot = velipots.reduce((nearest, velipot) => {
    const distToVelipot = Math.sqrt(
      Math.pow(from.coordinates[0] - velipot.coordinates[0], 2) +
      Math.pow(from.coordinates[1] - velipot.coordinates[1], 2)
    )
    const distToNearest = Math.sqrt(
      Math.pow(from.coordinates[0] - nearest.coordinates[0], 2) +
      Math.pow(from.coordinates[1] - nearest.coordinates[1], 2)
    )
    return distToVelipot < distToNearest ? velipot : nearest
  })

  // Calculate duration (assuming average speed of 60 km/h for drones)
  const duration = Math.round((distance / 60) * 60) // in minutes

  // Calculate price (base fare + distance-based pricing)
  const baseFare = 150 // INR
  const perKmRate = 25 // INR per km
  const price = Math.round(baseFare + (distance * perKmRate))

  return {
    id: `route_${from.id}_${to.id}`,
    from,
    to,
    distance: Math.round(distance * 100) / 100,
    duration,
    price,
    velipot: nearestVelipot
  }
}

// Mock ride data
export const mockRides: Ride[] = [
  {
    id: 'ride_001',
    route: calculateRoute(bangaloreLocations[0], bangaloreLocations[5]), // Koramangala to Airport
    status: 'completed',
    bookingTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    actualArrival: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 45 * 60 * 1000),
    passengerVerified: true,
    droneId: 'AERO_001'
  },
  {
    id: 'ride_002',
    route: calculateRoute(bangaloreLocations[1], bangaloreLocations[2]), // Indiranagar to Whitefield
    status: 'completed',
    bookingTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
    actualArrival: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000),
    passengerVerified: true,
    droneId: 'AERO_002'
  }
]

// Drone fleet data
export interface Drone {
  id: string
  model: string
  status: 'available' | 'in_transit' | 'maintenance'
  currentLocation: [number, number]
  batteryLevel: number
  capacity: number
}

export const droneFleet: Drone[] = [
  {
    id: 'AERO_001',
    model: 'AeroTaxi Pro X1',
    status: 'available',
    currentLocation: [77.5946, 12.9716],
    batteryLevel: 95,
    capacity: 2
  },
  {
    id: 'AERO_002',
    model: 'AeroTaxi Pro X1',
    status: 'available',
    currentLocation: [77.6973, 12.9298],
    batteryLevel: 87,
    capacity: 2
  },
  {
    id: 'AERO_003',
    model: 'AeroTaxi Max X2',
    status: 'in_transit',
    currentLocation: [77.6408, 12.9784],
    batteryLevel: 72,
    capacity: 4
  }
]
