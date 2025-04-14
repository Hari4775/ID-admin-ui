import React, { useEffect, useMemo, useState } from "react";
import { fetchAllBookings } from "../../api/Bookings/BookingsApi";
import { GiCoinsPile } from "react-icons/gi";
import { FaCalendarAlt, FaIdBadge, FaEnvelope } from "react-icons/fa";
import BookingsAnalytics from "./BookingAnalytics";

const Bookings = () => {
  const [allBookings, setAllBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const getAllBookings = async () => {
    setLoading(true);
    try {
      const response = await fetchAllBookings();
      const bookings = response?.data?.bookings || [];
      setAllBookings(bookings);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllBookings();
  }, []);

  // Memoized bookings to avoid recalculations
  const memoizedBookings = useMemo(() => {
    return [...allBookings].sort((a, b) => new Date(b.bookingDateTime) - new Date(a.bookingDateTime));
  }, [allBookings]);

  return (
    <div className="min-h-screen bg-gray-50 w-full">
      {loading ? (
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="bg-white p-5 rounded-2xl animate-pulse shadow-md h-48" />
          ))}
        </div>
      ) : memoizedBookings.length === 0 ? (
        <div className="p-6 text-center text-gray-600 text-lg">No bookings found.</div>
      ) : (
        <>
          <BookingsAnalytics bookings={memoizedBookings} />

          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {memoizedBookings.map((booking) => {
              const {
                _id,
                bookingDateTime,
                bookingNumber,
                bookingInfo,
                paymentDetails: { totalAmount, paidAmount, paymentStatus },
              } = booking;

              const balanceAmount = (totalAmount - paidAmount).toFixed(2);

              return (
                <div
                  key={_id}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition duration-300 border border-gray-100 p-5"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-lg font-semibold text-indigo-600 flex items-center gap-2">
                      <FaIdBadge /> {bookingNumber}
                    </h2>
                    <span className="text-sm text-gray-500 flex items-center gap-1">
                      <FaCalendarAlt /> {bookingDateTime}
                    </span>
                  </div>

                  <div className="text-gray-800 text-sm flex items-center gap-2 mb-2">
                    <FaEnvelope className="text-indigo-500" /> {bookingInfo?.email}
                  </div>

                  <div className="mt-4 space-y-2 text-sm text-gray-700">
                    <div className="flex justify-between">
                      <span>Total Amount:</span>
                      <span className="font-semibold text-blue-600">₹{totalAmount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Paid:</span>
                      <span className="font-semibold text-green-600">₹{paidAmount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Balance:</span>
                      <span className="font-semibold text-red-500">₹{balanceAmount}</span>
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-gray-500">Payment Status:</span>
                      <span className="font-bold text-purple-600">{paymentStatus}</span>
                    </div>
                  </div>

                  <div className="mt-4 flex justify-end">
                    <GiCoinsPile className="text-yellow-500 text-3xl" />
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default Bookings;
