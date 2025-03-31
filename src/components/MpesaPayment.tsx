import React, { useState } from 'react';
import { Phone } from 'lucide-react';

interface MpesaPaymentProps {
  amount: number;
  onPaymentComplete: () => void;
}

export default function MpesaPayment({ amount, onPaymentComplete }: MpesaPaymentProps) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      onPaymentComplete();
    }, 2000);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4">M-Pesa Payment</h3>
      <div className="mb-4">
        <p className="text-gray-600">Amount to pay:</p>
        <p className="text-2xl font-bold text-blue-600">KES {amount.toFixed(2)}</p>
      </div>
      
      <form onSubmit={handlePayment}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            M-Pesa Phone Number
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="254700000000"
              className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
        </div>
        
        <button
          type="submit"
          disabled={isProcessing}
          className={`w-full py-2 px-4 rounded-md text-white font-medium
            ${isProcessing ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'}
          `}
        >
          {isProcessing ? 'Processing...' : 'Pay with M-Pesa'}
        </button>
      </form>
      
      <div className="mt-4 text-sm text-gray-500">
        <p>Instructions:</p>
        <ol className="list-decimal ml-4 space-y-1">
          <li>Enter your M-Pesa registered phone number</li>
          <li>Click "Pay with M-Pesa"</li>
          <li>Wait for the M-Pesa prompt on your phone</li>
          <li>Enter your M-Pesa PIN to complete the payment</li>
        </ol>
      </div>
    </div>
  );
}