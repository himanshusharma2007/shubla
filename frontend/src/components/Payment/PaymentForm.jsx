import React, { useState } from 'react';
import { Calendar, Users, Car, Tent, Home } from 'lucide-react';
import { useSelector } from 'react-redux';
import {
    CardNumberElement,
    CardCvcElement,
    CardExpiryElement,
    useStripe,
    useElements,
} from "@stripe/react-stripe-js";
import paymentService from '../../services/paymentService';
import PaymentFlow from './PaymentFlow';
import { createBooking } from '../../services/bookingService';
import { useNavigate } from 'react-router-dom';

const PaymentForm = () => {
    const navigate = useNavigate()
    const booking = useSelector((state) => state.booking.data);
    const user = useSelector((state) => state.auth.user);
    const stripe = useStripe();
    const elements = useElements();

    const [paymentStatus, setPaymentStatus] = useState(null);
    const [bookingStatus, setBookingStatus] = useState(null);

    const getServiceIcon = () => {
        switch (booking.serviceType) {
            case 'room': return <Home className="w-6 h-6 text-amber-700" />;
            case 'camp': return <Tent className="w-6 h-6 text-amber-700" />;
            case 'parking': return <Car className="w-6 h-6 text-amber-700" />;
            default: return null;
        }
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        setPaymentStatus("processing")
        try {
            console.log("payment")
            const data = await paymentService.processPayment(booking.amount * 100);
            const client_secret = data.client_secret;
            if (!stripe || !elements) return;
            console.log(elements.getElement(CardNumberElement))
            const result = await stripe.confirmCardPayment(client_secret, {
                payment_method: {
                    card: elements.getElement(CardNumberElement),
                    billing_details: {
                        name: user.name,
                        email: user.email,
                    },
                },
            });

            if (result.error) {
                console.error("Stripe payment error:", result.error);
                setPaymentStatus("failed")
                return;
            }
            console.log("erora gai " + result.paymentIntent.status)
            setPaymentStatus("success")
            setBookingStatus('processing')
            if (result.paymentIntent.status === "succeeded") {
                const response = await createBooking(
                    {
                        ...booking,
                        paymentInfo: {
                            id: result.paymentIntent.id,
                            status: result.paymentIntent.status
                        },
                        paymentStatus: "completed"
                    })
                console.log(response)
                setBookingStatus('success');
            } else {
                setBookingStatus('failed');
            }

        } catch (error) {
            console.error("Error during membership payment:", error);
            setBookingStatus('failed');
            setPaymentStatus("failed")
        }
    };

    const handleCancel = () => {
        navigate('/');
    };

    return (
        <>
            {paymentStatus !== null &&
                <PaymentFlow
                    paymentStatus={paymentStatus}
                    bookingStatus={bookingStatus}
                    retry={() => { 
                        setPaymentStatus(null) 
                        setBookingStatus(null)
                    }}
                />}
            <div className="min-h-screen bg-amber-50 py-8 px-4">
                <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6 border border-amber-200">
                    {/* Header */}
                    <div className="flex items-center gap-3 mb-6">
                        {getServiceIcon()}
                        <h2 className="text-2xl font-semibold text-amber-900">
                            {booking?.serviceType?.charAt(0)?.toUpperCase() + booking?.serviceType?.slice(1)} Booking Details
                        </h2>
                    </div>

                    {/* Booking Information Section */}
                    <div className="mb-8 bg-amber-50 p-4 rounded-lg border border-amber-200">
                        <h3 className="text-lg font-medium text-amber-900 mb-4">Booking Information</h3>

                        <div className="space-y-4">
                            {/* Quantity */}
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium text-amber-800">Quantity:</span>
                                <span className="text-sm text-amber-900">{booking?.quantity}</span>
                            </div>

                            {/* Dates */}
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium text-amber-800">
                                        <Calendar className="inline-block w-4 h-4 mr-1" />
                                        Check-in:
                                    </span>
                                    <span className="text-sm text-amber-900">
                                        {new Date(booking?.checkIn).toLocaleDateString()}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium text-amber-800">
                                        <Calendar className="inline-block w-4 h-4 mr-1" />
                                        Check-out:
                                    </span>
                                    <span className="text-sm text-amber-900">
                                        {new Date(booking.checkOut).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>

                            {/* Guests - Only for Room and Camp */}
                            {(booking?.serviceType === 'room' || booking?.serviceType === 'camp') && (
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium text-amber-800">
                                        <Users className="inline-block w-4 h-4 mr-1" />
                                        Guests:
                                    </span>
                                    <span className="text-sm text-amber-900">{booking?.guests}</span>
                                </div>
                            )}

                            {/* Room Type - Only for Room */}
                            {booking.serviceType === 'room' && (
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium text-amber-800">Room Type:</span>
                                    <span className="text-sm text-amber-900 capitalize">{booking?.roomType}</span>
                                </div>
                            )}

                            {/* Private Booking */}
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium text-amber-800">Private Booking:</span>
                                <span className="text-sm text-amber-900">
                                    {booking?.isPrivateBooking ? 'Yes' : 'No'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Payment Section */}
                    <form onSubmit={submitHandler}>
                        <div className="space-y-6">
                            <h3 className="text-lg font-medium text-amber-900">Payment Details</h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-amber-800 mb-2">
                                        Card Number
                                    </label>
                                    <CardNumberElement
                                        className="w-full px-3 py-2 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-amber-800 mb-2">
                                            Expiry Date
                                        </label>
                                        <CardExpiryElement
                                            type="text"
                                            placeholder="MM/YY"
                                            className="w-full px-3 py-2 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-amber-800 mb-2">
                                            CVC
                                        </label>
                                        <CardCvcElement
                                            type="text"
                                            placeholder="123"
                                            className="w-full px-3 py-2 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <button
                                    type="submit"
                                    className="flex-1 bg-amber-600 text-white py-2 px-4 rounded-md hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-colors"
                                >
                                    Pay Now
                                </button>
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    className="flex-1 bg-amber-100 text-amber-900 py-2 px-4 rounded-md hover:bg-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-colors"
                                >
                                    Cancel Booking
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default PaymentForm;