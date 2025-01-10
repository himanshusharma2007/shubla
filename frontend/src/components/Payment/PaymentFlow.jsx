import React from 'react';
import { useNavigate } from 'react-router-dom';

const PaymentFlow = ({ paymentStatus, bookingStatus , retry}) => {

    const navigate = useNavigate()

  return (
    // Overlay
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      {/* Modal */}
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md m-4 relative animate-fade-in">
        {/* Payment Processing */}
        {paymentStatus === 'processing' && (
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Processing Payment</h2>
            <p className="text-gray-600">Please wait while we process your payment...</p>
          </div>
        )}

        {/* Payment Failed */}
        {paymentStatus === 'failed' && (
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 text-red-500">
              <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-red-500 mb-2">Payment Failed</h2>
            <p className="text-gray-600 mb-4">We couldn't process your payment. Please try again.</p>
            <button 
              onClick={retry} 
              className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Booking Processing */}
        {bookingStatus === 'processing' && (
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Processing Booking</h2>
            <p className="text-gray-600">Almost there! Finalizing your booking...</p>
          </div>
        )}

        {/* Success */}
        {bookingStatus === 'success' && (
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 text-green-500">
              <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-green-500 mb-2">Booking Confirmed!</h2>
            <p className="text-gray-600 mb-4">Your payment was successful and your booking is confirmed.</p>
            <button 
              onClick={() => navigate(-1)} 
              className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors"
            >
              View Booking
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentFlow;