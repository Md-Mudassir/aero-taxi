"use client";

import { useState, useEffect, useRef } from "react";
import { ArrowLeft, MapPin, Clock, Battery, User, CheckCircle, Plane } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

// Mapbox token - Replace with your actual token
const MAPBOX_TOKEN =
  "pk.eyJ1IjoibXVkYXNzaXJ4eCIsImEiOiJjbWVtbmE2cm8wdXk0MmtxcjJnZ3ViM2xuIn0.ns_I1JogdO4Q_EcBS9J70g";

type RideStatus =
  | "confirmed"
  | "drone_dispatched"
  | "at_velipot"
  | "passenger_verified"
  | "in_transit"
  | "completed";

interface DronePosition {
  coordinates: [number, number];
  heading: number;
  altitude: number;
  speed: number;
}

export default function TrackingPage() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const droneMarker = useRef<mapboxgl.Marker | null>(null);

  const [rideStatus, setRideStatus] = useState<RideStatus>("confirmed");
  const [estimatedArrival, setEstimatedArrival] = useState(new Date(Date.now() + 12 * 60 * 1000));
  const [dronePosition, setDronePosition] = useState<DronePosition>({
    coordinates: [77.5946, 12.9716], // Central Velipot
    heading: 45,
    altitude: 150,
    speed: 65,
  });
  const [passengerVerified, setPassengerVerified] = useState(false);
  const [showVerification, setShowVerification] = useState(false);

  // Mock route data
  const mockRoute = {
    from: { name: "Koramangala", coordinates: [77.6309, 12.9279] as [number, number] },
    to: {
      name: "Kempegowda International Airport",
      coordinates: [77.7064, 13.1986] as [number, number],
    },
    velipot: { name: "Central Velipot", coordinates: [77.5946, 12.9716] as [number, number] },
    droneId: "AERO_001",
  };

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    // Set Mapbox access token
    mapboxgl.accessToken = MAPBOX_TOKEN;

    // Initialize map
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: mockRoute.velipot.coordinates,
      zoom: 11,
      pitch: 45,
      bearing: 0,
    });

    // Add navigation control
    map.current.addControl(new mapboxgl.NavigationControl(), "top-right");

    // Add markers for route points
    const fromMarker = new mapboxgl.Marker({ color: "#22c55e" })
      .setLngLat(mockRoute.from.coordinates)
      .setPopup(new mapboxgl.Popup().setHTML(`<strong>Pickup</strong><br>${mockRoute.from.name}`))
      .addTo(map.current);

    const toMarker = new mapboxgl.Marker({ color: "#ef4444" })
      .setLngLat(mockRoute.to.coordinates)
      .setPopup(
        new mapboxgl.Popup().setHTML(`<strong>Destination</strong><br>${mockRoute.to.name}`)
      )
      .addTo(map.current);

    const velipotMarker = new mapboxgl.Marker({ color: "#3b82f6" })
      .setLngLat(mockRoute.velipot.coordinates)
      .setPopup(
        new mapboxgl.Popup().setHTML(`<strong>Velipot</strong><br>${mockRoute.velipot.name}`)
      )
      .addTo(map.current);

    // Create drone marker
    const droneEl = document.createElement("div");
    droneEl.className = "drone-marker";
    droneEl.style.cssText = `
      width: 30px;
      height: 30px;
      background: #8b5cf6;
      border: 3px solid white;
      border-radius: 50%;
      box-shadow: 0 2px 10px rgba(0,0,0,0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      animation: pulse 2s infinite;
    `;
    droneEl.innerHTML = "🚁";

    droneMarker.current = new mapboxgl.Marker(droneEl)
      .setLngLat(dronePosition.coordinates)
      .setPopup(
        new mapboxgl.Popup().setHTML(
          `<strong>Drone ${mockRoute.droneId}</strong><br>Altitude: ${dronePosition.altitude}m<br>Speed: ${dronePosition.speed} km/h`
        )
      )
      .addTo(map.current);

    // Fit map to show all markers
    const bounds = new mapboxgl.LngLatBounds();
    bounds.extend(mockRoute.from.coordinates);
    bounds.extend(mockRoute.to.coordinates);
    bounds.extend(mockRoute.velipot.coordinates);
    bounds.extend(dronePosition.coordinates);

    map.current.fitBounds(bounds, { padding: 50 });

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Simulate ride progress and drone movement
  useEffect(() => {
    const statusProgression: RideStatus[] = [
      "confirmed",
      "drone_dispatched",
      "at_velipot",
      "passenger_verified",
      "in_transit",
      "completed",
    ];

    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex < statusProgression.length - 1) {
        currentIndex++;
        setRideStatus(statusProgression[currentIndex]);

        if (statusProgression[currentIndex] === "at_velipot") {
          setShowVerification(true);
        }

        // Update estimated arrival
        const remainingTime = (statusProgression.length - currentIndex - 1) * 3 * 60 * 1000;
        setEstimatedArrival(new Date(Date.now() + remainingTime));

        // Animate drone movement based on status
        if (droneMarker.current) {
          let newPosition: [number, number];
          switch (statusProgression[currentIndex]) {
            case "drone_dispatched":
              // Move towards velipot
              newPosition = [
                mockRoute.velipot.coordinates[0] + (Math.random() - 0.5) * 0.01,
                mockRoute.velipot.coordinates[1] + (Math.random() - 0.5) * 0.01,
              ];
              break;
            case "at_velipot":
              newPosition = mockRoute.velipot.coordinates;
              break;
            case "in_transit":
              // Move towards destination
              const progress = 0.3; // 30% of the way
              newPosition = [
                mockRoute.velipot.coordinates[0] +
                  (mockRoute.to.coordinates[0] - mockRoute.velipot.coordinates[0]) * progress,
                mockRoute.velipot.coordinates[1] +
                  (mockRoute.to.coordinates[1] - mockRoute.velipot.coordinates[1]) * progress,
              ];
              break;
            case "completed":
              newPosition = mockRoute.to.coordinates;
              break;
            default:
              newPosition = dronePosition.coordinates;
          }

          setDronePosition((prev) => ({ ...prev, coordinates: newPosition }));
          droneMarker.current.setLngLat(newPosition);

          // Update popup with new info
          droneMarker.current.setPopup(
            new mapboxgl.Popup().setHTML(
              `<strong>Drone ${mockRoute.droneId}</strong><br>Status: ${statusProgression[currentIndex]}<br>Altitude: ${dronePosition.altitude}m<br>Speed: ${dronePosition.speed} km/h`
            )
          );
        }
      } else {
        clearInterval(interval);
      }
    }, 8000); // Change status every 8 seconds for demo

    return () => clearInterval(interval);
  }, [
    dronePosition.altitude,
    dronePosition.speed,
    mockRoute.droneId,
    mockRoute.to.coordinates,
    mockRoute.velipot.coordinates,
  ]);

  const handlePassengerVerification = () => {
    setPassengerVerified(true);
    setShowVerification(false);
    setRideStatus("passenger_verified");
  };

  const getStatusText = (status: RideStatus) => {
    switch (status) {
      case "confirmed":
        return "Ride Confirmed";
      case "drone_dispatched":
        return "Drone Dispatched";
      case "at_velipot":
        return "Drone at Velipot";
      case "passenger_verified":
        return "Passenger Verified";
      case "in_transit":
        return "In Transit";
      case "completed":
        return "Ride Completed";
    }
  };

  const getStatusColor = (status: RideStatus) => {
    switch (status) {
      case "confirmed":
        return "bg-blue-500";
      case "drone_dispatched":
        return "bg-yellow-500";
      case "at_velipot":
        return "bg-orange-500";
      case "passenger_verified":
        return "bg-green-500";
      case "in_transit":
        return "bg-purple-500";
      case "completed":
        return "bg-green-600";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="px-4 py-4 flex items-center gap-3">
          <Link href="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-xl font-semibold">Live Tracking</h1>
            <p className="text-sm text-gray-600">Drone ID: {mockRoute.droneId}</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-6">
        {/* Status Card */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-4">
              <div
                className={`w-3 h-3 rounded-full ${getStatusColor(rideStatus)} animate-pulse`}
              ></div>
              <span className="font-semibold">{getStatusText(rideStatus)}</span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-600" />
                <div>
                  <p className="text-gray-600">ETA</p>
                  <p className="font-medium">
                    {estimatedArrival.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Battery className="h-4 w-4 text-gray-600" />
                <div>
                  <p className="text-gray-600">Drone Battery</p>
                  <p className="font-medium">87%</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Map Container */}
        <Card className="mb-6">
          <CardContent className="p-0">
            <div ref={mapContainer} className="w-full h-64 rounded-lg overflow-hidden" />
          </CardContent>
        </Card>

        {/* Drone Info */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Plane className="h-5 w-5" />
              Drone Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Altitude</p>
                <p className="font-medium">{dronePosition.altitude}m</p>
              </div>
              <div>
                <p className="text-gray-600">Speed</p>
                <p className="font-medium">{dronePosition.speed} km/h</p>
              </div>
              <div>
                <p className="text-gray-600">Model</p>
                <p className="font-medium">AeroTaxi Pro X1</p>
              </div>
              <div>
                <p className="text-gray-600">Capacity</p>
                <p className="font-medium">2 passengers</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Passenger Verification Modal */}
        {showVerification && !passengerVerified && (
          <Card className="mb-6 border-orange-200 bg-orange-50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="h-5 w-5 text-orange-600" />
                Passenger Verification Required
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                The drone has arrived at {mockRoute.velipot.name}. Please approach the drone for
                identity verification.
              </p>
              <div className="bg-white p-4 rounded-lg mb-4">
                <h4 className="font-medium mb-2">Verification Code</h4>
                <div className="text-2xl font-bold text-center py-2 bg-gray-100 rounded">
                  AX-7429
                </div>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Show this code to the drone&apos;s camera
                </p>
              </div>
              <Button
                className="w-full bg-orange-600 hover:bg-orange-700"
                onClick={handlePassengerVerification}
              >
                Verify Identity
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Verification Success */}
        {passengerVerified && (
          <Card className="mb-6 border-green-200 bg-green-50">
            <CardContent className="p-4 text-center">
              <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-2" />
              <h3 className="font-semibold text-green-800">Identity Verified!</h3>
              <p className="text-sm text-green-600">You can now board the drone safely.</p>
            </CardContent>
          </Card>
        )}

        {/* Route Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Route Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="font-medium">{mockRoute.from.name}</p>
                  <p className="text-sm text-gray-600">Pickup Location</p>
                </div>
                <CheckCircle className="h-5 w-5 text-green-500" />
              </div>

              <div className="ml-1.5 w-0.5 h-8 bg-gray-300"></div>

              <div className="flex items-center gap-3">
                <div
                  className={`w-3 h-3 rounded-full ${
                    ["at_velipot", "passenger_verified", "in_transit", "completed"].includes(
                      rideStatus
                    )
                      ? "bg-blue-500"
                      : "bg-gray-300"
                  }`}
                ></div>
                <div className="flex-1">
                  <p className="font-medium">{mockRoute.velipot.name}</p>
                  <p className="text-sm text-gray-600">Drone Station</p>
                </div>
                {["passenger_verified", "in_transit", "completed"].includes(rideStatus) && (
                  <CheckCircle className="h-5 w-5 text-blue-500" />
                )}
              </div>

              <div className="ml-1.5 w-0.5 h-8 bg-gray-300"></div>

              <div className="flex items-center gap-3">
                <div
                  className={`w-3 h-3 rounded-full ${
                    rideStatus === "completed" ? "bg-red-500" : "bg-gray-300"
                  }`}
                ></div>
                <div className="flex-1">
                  <p className="font-medium">{mockRoute.to.name}</p>
                  <p className="text-sm text-gray-600">Destination</p>
                </div>
                {rideStatus === "completed" && <CheckCircle className="h-5 w-5 text-red-500" />}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Emergency Contact */}
        <div className="mt-6 p-4 bg-red-50 rounded-lg border border-red-200">
          <h3 className="font-medium text-red-800 mb-2">Emergency Contact</h3>
          <p className="text-sm text-red-600 mb-2">
            If you need immediate assistance, contact our 24/7 support team.
          </p>
          <Button variant="outline" className="w-full border-red-300 text-red-700 hover:bg-red-100">
            Call Emergency: +91-1800-AERO-911
          </Button>
        </div>
      </div>
    </div>
  );
}
