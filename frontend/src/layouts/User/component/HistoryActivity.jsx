import React, { useState } from 'react';
import { Ticket, Clock, Calendar, MapPin } from 'lucide-react';

const HistoryActivity = () => {
  const [activeTab, setActiveTab] = useState('booking');

  // Sample data - thay bằng data từ API
  const bookingData = [
    {
      id: 1,
      movieTitle: "Xem phim",
      moviePoster: "/api/placeholder/60/80",
      time: "18:00",
      date: "28 May 2025",
      tickets: 2,
      location: "Starlight Cinema, SF",
      price: "135.000 VND",
      points: "135.000 points",
      status: "Confirm"
    },
    {
      id: 2,
      movieTitle: "Xem phim",
      moviePoster: "/api/placeholder/60/80",
      time: "18:00",
      date: "28 May 2025",
      tickets: 2,
      location: "Starlight Cinema, SF",
      price: "135.000 VND",
      points: "0 points",
      status: "Canceled"
    },
    {
      id: 3,
      movieTitle: "Xem phim",
      moviePoster: "/api/placeholder/60/80",
      time: "18:00",
      date: "28 May 2025",
      tickets: 2,
      location: "Starlight Cinema, SF",
      price: "135.000 VND",
      points: "0 points",
      status: "Waiting"
    },
    {
      id: 4,
      movieTitle: "Xem phim",
      moviePoster: "/api/placeholder/60/80",
      time: "18:00",
      date: "28 May 2025",
      tickets: 2,
      location: "Starlight Cinema, SF",
      price: "135.000 VND",
      points: "135.000 points",
      status: "Confirm"
    }
  ];

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Confirm':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Canceled':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Waiting':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-transparent p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Activity History</h1>
          <p className="text-gray-300">Track your booking history and use your loyalty points</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab('booking')}
            className={`px-8 py-3 rounded-lg font-semibold transition-all duration-300 ${
              activeTab === 'booking'
                ? 'bg-purple-600 text-white shadow-lg'
                : 'bg-slate-800 text-gray-300 hover:bg-slate-700'
            }`}
          >
            Booking History
          </button>
          <button
            onClick={() => setActiveTab('points')}
            className={`px-8 py-3 rounded-lg font-semibold transition-all duration-300 ${
              activeTab === 'points'
                ? 'bg-purple-600 text-white shadow-lg'
                : 'bg-slate-800 text-gray-300 hover:bg-slate-700'
            }`}
          >
            Points Activity
          </button>
        </div>

        {/* Content */}
        {activeTab === 'booking' && (
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
            {/* Table Header */}
            <div className="flex items-center gap-4 mb-6">
              <Ticket className="text-purple-400" size={24} />
              <h2 className="text-xl font-semibold text-white">Booking History</h2>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-600">
                    <th className="text-left py-4 px-2 text-gray-300 font-semibold">Name</th>
                    <th className="text-left py-4 px-2 text-gray-300 font-semibold">Time</th>
                    <th className="text-left py-4 px-2 text-gray-300 font-semibold">Date</th>
                    <th className="text-left py-4 px-2 text-gray-300 font-semibold">Number Ticket</th>
                    <th className="text-left py-4 px-2 text-gray-300 font-semibold">Location</th>
                    <th className="text-left py-4 px-2 text-gray-300 font-semibold">Price</th>
                    <th className="text-left py-4 px-2 text-gray-300 font-semibold">Add Point</th>
                    <th className="text-left py-4 px-2 text-gray-300 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {bookingData.map((booking, index) => (
                    <tr key={booking.id} className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors">
                      {/* Movie Info */}
                      <td className="py-4 px-2">
                        <div className="flex items-center gap-3">
                          <div className="w-14 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center overflow-hidden">
                            <img
                              src={booking.moviePoster}
                              alt={booking.movieTitle}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <span className="text-white font-medium">{booking.movieTitle}</span>
                        </div>
                      </td>

                      {/* Time */}
                      <td className="py-4 px-2">
                        <div className="flex items-center gap-2 text-gray-300">
                          <Clock size={16} className="text-purple-400" />
                          {booking.time}
                        </div>
                      </td>

                      {/* Date */}
                      <td className="py-4 px-2">
                        <div className="flex items-center gap-2 text-gray-300">
                          <Calendar size={16} className="text-purple-400" />
                          {booking.date}
                        </div>
                      </td>

                      {/* Tickets */}
                      <td className="py-4 px-2">
                        <span className="text-white font-medium">{booking.tickets} tickets</span>
                      </td>

                      {/* Location */}
                      <td className="py-4 px-2">
                        <div className="flex items-center gap-2 text-gray-300">
                          <MapPin size={16} className="text-purple-400" />
                          {booking.location}
                        </div>
                      </td>

                      {/* Price */}
                      <td className="py-4 px-2">
                        <span className="text-white font-medium">{booking.price}</span>
                      </td>

                      {/* Points */}
                      <td className="py-4 px-2">
                        <span className="text-gray-300">{booking.points}</span>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-2">
                        <span className={`px-4 py-2 rounded-full text-sm font-medium border ${getStatusStyle(booking.status)}`}>
                          {booking.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Points Activity Tab */}
        {activeTab === 'points' && (
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🎯</div>
              <h3 className="text-2xl font-semibold text-white mb-2">Points Activity</h3>
              <p className="text-gray-300">Your loyalty points history will appear here</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryActivity;