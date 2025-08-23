'use client'

import { useState } from 'react'
import { ArrowLeft, CreditCard, Smartphone, Wallet, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

type PaymentMethod = 'card' | 'upi' | 'wallet'

export default function PaymentPage() {
  const router = useRouter()
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('upi')
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentComplete, setPaymentComplete] = useState(false)

  // Mock route data (in real app, this would come from context/state)
  const mockRoute = {
    from: 'Koramangala',
    to: 'Kempegowda International Airport',
    price: 875,
    distance: 35.2,
    duration: 45
  }

  const handlePayment = async () => {
    setIsProcessing(true)
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000))
    setPaymentComplete(true)
    setIsProcessing(false)
    
    // Redirect to tracking page after 2 seconds
    setTimeout(() => {
      router.push('/tracking')
    }, 2000)
  }

  if (paymentComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
            <p className="text-gray-600 mb-4">Your drone taxi has been booked successfully.</p>
            <p className="text-sm text-gray-500">Redirecting to live tracking...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

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
          <h1 className="text-xl font-semibold">Payment</h1>
        </div>
      </div>

      <div className="px-4 py-6">
        {/* Trip Summary */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Trip Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Route</span>
                <span className="font-medium">{mockRoute.from} → {mockRoute.to}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Distance</span>
                <span className="font-medium">{mockRoute.distance} km</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Duration</span>
                <span className="font-medium">{mockRoute.duration} min</span>
              </div>
              <div className="border-t pt-3 flex justify-between">
                <span className="font-semibold">Total Amount</span>
                <span className="font-bold text-lg">₹{mockRoute.price}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Methods */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Payment Method</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div 
              className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                selectedMethod === 'upi' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
              }`}
              onClick={() => setSelectedMethod('upi')}
            >
              <div className="flex items-center gap-3">
                <Smartphone className="h-5 w-5 text-blue-600" />
                <div>
                  <h3 className="font-medium">UPI</h3>
                  <p className="text-sm text-gray-600">Pay using UPI apps</p>
                </div>
              </div>
            </div>

            <div 
              className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                selectedMethod === 'card' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
              }`}
              onClick={() => setSelectedMethod('card')}
            >
              <div className="flex items-center gap-3">
                <CreditCard className="h-5 w-5 text-blue-600" />
                <div>
                  <h3 className="font-medium">Credit/Debit Card</h3>
                  <p className="text-sm text-gray-600">Visa, Mastercard, RuPay</p>
                </div>
              </div>
            </div>

            <div 
              className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                selectedMethod === 'wallet' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
              }`}
              onClick={() => setSelectedMethod('wallet')}
            >
              <div className="flex items-center gap-3">
                <Wallet className="h-5 w-5 text-blue-600" />
                <div>
                  <h3 className="font-medium">Digital Wallet</h3>
                  <p className="text-sm text-gray-600">Paytm, PhonePe, Google Pay</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Details Form */}
        {selectedMethod === 'card' && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Card Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Card Number</label>
                <Input placeholder="1234 5678 9012 3456" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Expiry</label>
                  <Input placeholder="MM/YY" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">CVV</label>
                  <Input placeholder="123" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Cardholder Name</label>
                <Input placeholder="John Doe" />
              </div>
            </CardContent>
          </Card>
        )}

        {selectedMethod === 'upi' && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">UPI Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <label className="block text-sm font-medium mb-2">UPI ID</label>
                <Input placeholder="yourname@upi" />
              </div>
            </CardContent>
          </Card>
        )}

        {selectedMethod === 'wallet' && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Select Wallet</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">P</span>
                  </div>
                  <span className="font-medium">Paytm Wallet</span>
                </div>
              </div>
              <div className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">PP</span>
                  </div>
                  <span className="font-medium">PhonePe</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Payment Button */}
        <Button 
          className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg"
          onClick={handlePayment}
          disabled={isProcessing}
        >
          {isProcessing ? 'Processing...' : `Pay ₹${mockRoute.price}`}
        </Button>

        {/* Security Note */}
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-600 text-center">
            🔒 Your payment information is secure and encrypted. We do not store your card details.
          </p>
        </div>
      </div>
    </div>
  )
}
