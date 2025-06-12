import React, { useEffect, useState } from "react";

const HistoryActivity = () => {
  const [activeTab, setActiveTab] = useState("booking");
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching history data
    const fetchHistoryData = async () => {
      try {
        setLoading(true);
        
        // Dữ liệu mẫu theo thiết kế
        const mockData = [
          {
            id: 1,
            name: "Xem phim",
            time: "18:00",
            date: "28 May 2025",
            numberTicket: "2 tickets",
            location: "Starlight Cinema, SF",
            price: "135.000 VND",
            addPoint: "135.000 points",
            status: "Confirm",
            poster: "/api/placeholder/60/80"
          },
          {
            id: 2,
            name: "Xem phim",
            time: "18:00",
            date: "28 May 2025",
            numberTicket: "2 tickets",
            location: "Starlight Cinema, SF",
            price: "135.000 VND",
            addPoint: "0 points",
            status: "Cancelled",
            poster: "/api/placeholder/60/80"
          },
          {
            id: 3,
            name: "Xem phim",
            time: "18:00",
            date: "28 May 2025",
            numberTicket: "2 tickets",
            location: "Starlight Cinema, SF",
            price: "135.000 VND",
            addPoint: "0 points",
            status: "Waiting",
            poster: "/api/placeholder/60/80"
          },
          {
            id: 4,
            name: "Xem phim",
            time: "18:00",
            date: "28 May 2025",
            numberTicket: "2 tickets",
            location: "Starlight Cinema, SF",
            price: "135.000 VND",
            addPoint: "135.000 points",
            status: "Confirm",
            poster: "/api/placeholder/60/80"
          }
        ];
        
        setTimeout(() => {
          setHistoryData(mockData);
          setLoading(false);
        }, 1000);
        
      } catch (err) {
        setLoading(false);
      }
    };

    fetchHistoryData();
  }, []);

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Confirm':
        return 'bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium';
      case 'Cancelled':
        return 'bg-red-100 text-red-700 px-4 py-2 rounded-full text-sm font-medium';
      case 'Waiting':
        return 'bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full text-sm font-medium';
      default:
        return 'bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm font-medium';
    }
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-purple-600 to-pink-500 min-h-screen p-8">
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 min-h-full">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-purple-100 via-indigo-50 to-purple-50 min-h-screen p-8">
     
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 text-gray-800">Activity History</h1>
          <p className="text-gray-600 text-lg">Track your booking history and use your loyalty points</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex mb-8 space-x-2 bg-gray-100 p-2 rounded-2xl">
          <button
            onClick={() => setActiveTab("booking")}
            className={`flex-1 px-8 py-3 rounded-xl font-medium transition-all duration-300 ${
              activeTab === "booking"
                ? "bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-lg"
                : "text-gray-600 hover:text-gray-800 hover:bg-white/50"
            }`}
          >
            Booking History
          </button>
          <button
            onClick={() => setActiveTab("points")}
            className={`flex-1 px-8 py-3 rounded-xl font-medium transition-all duration-300 ${
              activeTab === "points"
                ? "bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-lg"
                : "text-gray-600 hover:text-gray-800 hover:bg-white/50"
            }`}
          >
            Points Activity
          </button>
        </div>

        {/* Content */}
        {activeTab === "booking" && (
          <div>
            {/* Section Header */}
            <div className="flex items-center mb-6">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-500 rounded-lg mr-3 flex items-center justify-center">
                <div className="w-4 h-3 bg-white rounded-sm"></div>
              </div>
              <h2 className="text-xl font-semibold text-gray-800">Booking History</h2>
            </div>

            {/* Table */}
            <div className="overflow-x-auto bg-white rounded-2xl shadow-sm border border-gray-100">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">Name</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">Time</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">Date</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">Number Ticket</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">Location</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">Price</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">Add Point</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {historyData.map((item, index) => (
                    <tr key={item.id} className="border-b border-gray-100 hover:bg-purple-50/50 transition-colors duration-200">
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white text-lg font-bold shadow-md">
                            🎬
                          </div>
                          <span className="font-medium text-gray-800">{item.name}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center text-gray-700">
                          <svg className="w-4 h-4 mr-2 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                          </svg>
                          {item.time}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center text-gray-700">
                          <svg className="w-4 h-4 mr-2 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                          </svg>
                          {item.date}
                        </div>
                      </td>
                      <td className="py-4 px-6 text-gray-700">{item.numberTicket}</td>
                      <td className="py-4 px-6">
                        <div className="flex items-center text-gray-700">
                          <svg className="w-4 h-4 mr-2 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                          </svg>
                          {item.location}
                        </div>
                      </td>
                      <td className="py-4 px-6 text-gray-700 font-medium">{item.price}</td>
                      <td className="py-4 px-6 text-gray-700">{item.addPoint}</td>
                      <td className="py-4 px-6">
                        <span className={getStatusStyle(item.status)}>
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "points" && (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="text-6xl mb-6">🎯</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Points Activity</h3>
            <p className="text-gray-500">Your loyalty points activity will appear here</p>
            <button className="mt-6 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-300">
              View Points Details
            </button>
          </div>
        )}
      
    </div>
  );
};

export default HistoryActivity;