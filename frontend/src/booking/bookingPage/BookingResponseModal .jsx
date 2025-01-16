import React from 'react';
import { AlertCircle, CheckCircle, X } from 'lucide-react';

const BookingResponseModal = ({ isOpen, onClose, responseData, onPayment }) => {
  if (!isOpen || !responseData) return null;

  const { price, status, totalAmount } = responseData;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-md relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="p-6 border-b">
          <div className="flex items-center gap-2">
            {status === "confirmed" ? (
              <CheckCircle className="w-6 h-6 text-green-500" />
            ) : (
              <AlertCircle className="w-6 h-6 text-yellow-500" />
            )}
            <h2 className="text-xl font-semibold text-gray-900">Booking Status</h2>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Status:</span>
              <span className={`font-medium ${status === 'confirmed' ? 'text-green-600' : 'text-yellow-600'}`}>
                {status?.charAt(0).toUpperCase() + status?.slice(1)}
              </span>
            </div>
            {
              price &&
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Price:</span>
                <span className="font-medium">${price}/per Day</span>
              </div>
            }

            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Amount:</span>
              <span className="font-medium">${totalAmount}</span>
            </div>
          </div>

          {status === 'pending' && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 text-sm text-yellow-700">
              This booking is waiting for confirmation. If you continue, the payment amount may change.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Close
          </button>
          <button
            onClick={onPayment}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Pay Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingResponseModal;