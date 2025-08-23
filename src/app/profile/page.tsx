"use client";

import { useState } from "react";
import {
  User,
  Settings,
  CreditCard,
  Bell,
  Shield,
  HelpCircle,
  LogOut,
  Edit,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: "Sumiyya Kareem",
    email: "sumiyya.kareem@email.com",
    phone: "+91 98765 43210",
    address: "Koramangala, Bangalore",
  });

  const handleSave = () => {
    setIsEditing(false);
    // In real app, save to backend
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
          <p className="text-sm text-gray-600">Manage your account and preferences</p>
        </div>
      </div>

      <div className="px-4 py-6">
        {/* Profile Info */}
        <Card className="mb-6">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Personal Information</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
            >
              {isEditing ? "Save" : <Edit className="h-4 w-4" />}
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
                <User className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">{userInfo.name}</h3>
                <p className="text-gray-600">Premium Member</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Full Name</label>
                {isEditing ? (
                  <Input
                    value={userInfo.name}
                    onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
                  />
                ) : (
                  <p className="text-gray-900">{userInfo.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                {isEditing ? (
                  <Input
                    type="email"
                    value={userInfo.email}
                    onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
                  />
                ) : (
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <p className="text-gray-900">{userInfo.email}</p>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Phone</label>
                {isEditing ? (
                  <Input
                    value={userInfo.phone}
                    onChange={(e) => setUserInfo({ ...userInfo, phone: e.target.value })}
                  />
                ) : (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <p className="text-gray-900">{userInfo.phone}</p>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Address</label>
                {isEditing ? (
                  <Input
                    value={userInfo.address}
                    onChange={(e) => setUserInfo({ ...userInfo, address: e.target.value })}
                  />
                ) : (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <p className="text-gray-900">{userInfo.address}</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Membership Status */}
        <Card className="mb-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-1">Premium Member</h3>
                <p className="text-blue-100 text-sm">
                  Enjoy exclusive benefits and priority booking
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">₹2,450</div>
                <div className="text-xs text-blue-100">Saved this month</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Your Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">24</div>
                <div className="text-xs text-gray-600">Total Rides</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">4.9</div>
                <div className="text-xs text-gray-600">Rating</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">₹12,450</div>
                <div className="text-xs text-gray-600">Total Spent</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Menu Options */}
        <div className="space-y-3">
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <CreditCard className="h-5 w-5 text-gray-600" />
                <div className="flex-1">
                  <h3 className="font-medium">Payment Methods</h3>
                  <p className="text-sm text-gray-600">Manage cards and payment options</p>
                </div>
                <div className="text-gray-400">›</div>
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Bell className="h-5 w-5 text-gray-600" />
                <div className="flex-1">
                  <h3 className="font-medium">Notifications</h3>
                  <p className="text-sm text-gray-600">Ride alerts and updates</p>
                </div>
                <div className="text-gray-400">›</div>
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-gray-600" />
                <div className="flex-1">
                  <h3 className="font-medium">Privacy & Security</h3>
                  <p className="text-sm text-gray-600">Account security settings</p>
                </div>
                <div className="text-gray-400">›</div>
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Settings className="h-5 w-5 text-gray-600" />
                <div className="flex-1">
                  <h3 className="font-medium">App Settings</h3>
                  <p className="text-sm text-gray-600">Language, theme, and preferences</p>
                </div>
                <div className="text-gray-400">›</div>
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <HelpCircle className="h-5 w-5 text-gray-600" />
                <div className="flex-1">
                  <h3 className="font-medium">Help & Support</h3>
                  <p className="text-sm text-gray-600">FAQs and customer support</p>
                </div>
                <div className="text-gray-400">›</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Emergency Contacts */}
        <Card className="mt-6 border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="text-lg text-orange-800">Emergency Contacts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-orange-700">24/7 Support</span>
              <Button variant="outline" size="sm" className="border-orange-300 text-orange-700">
                +91-1800-AERO-911
              </Button>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-orange-700">Medical Emergency</span>
              <Button variant="outline" size="sm" className="border-orange-300 text-orange-700">
                108
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Logout */}
        <Button
          variant="outline"
          className="w-full mt-6 text-red-600 border-red-300 hover:bg-red-50"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </Button>

        {/* App Version */}
        <div className="text-center mt-6 text-xs text-gray-500">Aero Taxi v1.0.0</div>
      </div>
    </div>
  );
}
