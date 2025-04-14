import React from "react";

const BookingsAnalytics = ({ bookings }) => {
  const totalBookings = bookings.length;

  const totalPaid = bookings.reduce((sum, b) => sum + (b.paymentDetails?.paidAmount || 0), 0);
  const totalAmount = bookings.reduce((sum, b) => sum + (b.paymentDetails?.totalAmount || 0), 0);
  const balanceAmount = totalAmount - totalPaid;

  const averagePaidPercent = totalAmount ? ((totalPaid / totalAmount) * 100).toFixed(2) : 0;

  const pendingCount = bookings.filter((b) => b.paymentDetails?.paymentStatus === "0%").length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-6">
      <div className="bg-indigo-50 p-4 rounded-xl shadow flex flex-col gap-1">
        <h4 className="text-sm text-indigo-600 font-semibold">Total Bookings</h4>
        <p className="text-2xl font-bold text-indigo-800">{totalBookings}</p>
      </div>

      <div className="bg-green-50 p-4 rounded-xl shadow flex flex-col gap-1">
        <h4 className="text-sm text-green-600 font-semibold">Total Payment Received</h4>
        <p className="text-2xl font-bold text-green-800">₹{totalPaid.toFixed(2)}</p>
      </div>

      <div className="bg-yellow-50 p-4 rounded-xl shadow flex flex-col gap-1">
        <h4 className="text-sm text-yellow-600 font-semibold">Total Balance Amount</h4>
        <p className="text-2xl font-bold text-yellow-800">₹{balanceAmount.toFixed(2)}</p>
      </div>

      <div className="bg-red-50 p-4 rounded-xl shadow flex flex-col gap-1">
        <h4 className="text-sm text-red-600 font-semibold">Pending Bookings</h4>
        <p className="text-2xl font-bold text-red-800">{pendingCount}</p>
      </div>

      <div className="bg-purple-50 p-4 rounded-xl shadow flex flex-col gap-1 sm:col-span-2 lg:col-span-4">
        <h4 className="text-sm text-purple-600 font-semibold">Avg. Paid %</h4>
        <p className="text-xl font-bold text-purple-800">{averagePaidPercent}%</p>
      </div>
    </div>
  );
};

export default BookingsAnalytics;
