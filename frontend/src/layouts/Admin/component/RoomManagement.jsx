import React, { useState } from "react";
import {
  Search,
  Plus,
  Eye,
  Edit,
  Trash2,
  RefreshCw,
  Building,
  Users,
  TrendingUp,
  X,
} from "lucide-react";
import { MdChair } from "react-icons/md";

const RoomManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [refresh, setRefresh] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const [formData, setFormData] = useState({
    roomId: "",
    roomName: "",
    seatQuantity: "",
  });

  // Sample data matching your image
  const rooms = [
    {
      id: 1,
      roomId: "CR-101",
      name: "Room 1",
      seatQuantity: 120,
      rank: 1,
      usage: 95,
    },
    {
      id: 2,
      roomId: "CR-102",
      name: "Room 2",
      seatQuantity: 80,
      rank: 2,
      usage: 92,
    },
    {
      id: 3,
      roomId: "CR-103",
      name: "Room 3",
      seatQuantity: 150,
      rank: 3,
      usage: 89,
    },
    {
      id: 4,
      roomId: "CR-102",
      name: "Room 4",
      seatQuantity: 80,
      rank: 4,
      usage: 85,
    },
    {
      id: 5,
      roomId: "CR-103",
      name: "Room 5",
      seatQuantity: 150,
      rank: 5,
      usage: 78,
    },
    {
      id: 6,
      roomId: "CR-102",
      name: "Room 6",
      seatQuantity: 80,
      rank: 6,
      usage: 72,
    },
    {
      id: 7,
      roomId: "CR-101",
      name: "Room 7",
      seatQuantity: 120,
      rank: 7,
      usage: 68,
    },
  ];

  const statsData = [
    {
      icon: Building,
      label: "Total Rooms",
      value: "17",
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      icon: Users,
      label: "Total Seats",
      value: "2,160",
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      icon: TrendingUp,
      label: "Avg. Utilization Rate",
      value: "75%",
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
    {
      icon: TrendingUp,
      label: "Avg. Utilization Rate",
      value: "75%",
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
  ];

  const topRooms = rooms.slice(0, 5);

  const handleRefresh = () => {
    setRefresh(!refresh);
  };

  const handleView = (room) => {
    setSelectedRoom(room);
    setShowDetailsModal(true);
  };

  const handleEdit = (room) => {
    setSelectedRoom(room);
    setFormData({
      roomId: room.roomId,
      roomName: room.name,
      seatQuantity: room.seatQuantity.toString(),
    });
    setShowEditModal(true);
  };

  const handleDelete = (room) => {
    setSelectedRoom(room);
    setShowDeleteModal(true);
  };

  const handleAddRoom = () => {
    setFormData({
      roomId: "",
      roomName: "",
      seatQuantity: "",
    });
    setShowAddModal(true);
  };

  const handleSaveRoom = () => {
    console.log("Save room:", formData);
    setShowAddModal(false);
    setShowEditModal(false);
    setFormData({
      roomId: "",
      roomName: "",
      seatQuantity: 120,
    });
  };

  const handleConfirmDelete = () => {
    console.log("Delete room:", selectedRoom);
    setShowDeleteModal(false);
    setSelectedRoom(null);
  };

  const handleCloseModals = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setShowDeleteModal(false);
    setShowDetailsModal(false);
    setSelectedRoom(null);
    setFormData({
      roomId: "",
      roomName: "",
      seatQuantity: "",
    });
  };

  const filteredRooms = rooms.filter(
    (room) =>
      room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.roomId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {statsData.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center">
              <div className={`p-3 rounded-full ${stat.bgColor} mr-4`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                <p className="text-sm text-gray-600">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-6">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search by room name or room id"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleRefresh}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
              <button
                onClick={handleAddRoom}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Plus className="w-4 h-4" />
                Room
              </button>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    #
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Room ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Room Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Seat Quantity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Seat Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRooms.map((room, index) => (
                  <tr key={room.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {room.roomId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {room.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {room.seatQuantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleView(room)}
                        className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm"
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(room)}
                          className="p-1 text-blue-600 hover:text-blue-800"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(room)}
                          className="p-1 text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="bg-white px-6 py-3 border-t border-gray-200 flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing 1-7 of 17 rooms
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  className="px-3 py-1 text-gray-500 hover:text-gray-700"
                  disabled={currentPage === 1}
                >
                  &lt;
                </button>
                {[1, 2, 3].map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1 rounded ${
                      currentPage === page
                        ? "bg-blue-600 text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  className="px-3 py-1 text-gray-500 hover:text-gray-700"
                >
                  &gt;
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="w-80">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <h3 className="font-semibold text-gray-800">
                Top 5 Most Used Rooms
              </h3>
            </div>
            <p className="text-xs text-gray-500 mb-4">
              Showing most popular rooms
            </p>

            <div className="space-y-3">
              <div className="grid grid-cols-4 gap-2 text-xs font-medium text-gray-500 border-b pb-2">
                <span>Rank</span>
                <span>Room Name</span>
                <span>Usage Count</span>
                <span>Used</span>
              </div>

              {topRooms.map((room) => (
                <div
                  key={room.id}
                  className="grid grid-cols-4 gap-2 text-sm items-center py-2"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        room.rank === 1
                          ? "bg-yellow-100 text-yellow-600"
                          : room.rank === 2
                          ? "bg-gray-100 text-gray-600"
                          : room.rank === 3
                          ? "bg-orange-100 text-orange-600"
                          : "bg-blue-100 text-blue-600"
                      }`}
                    >
                      {room.rank}
                    </span>
                  </div>
                  <span className="text-gray-800">{room.name}</span>
                  <span className="text-gray-600">{room.seatQuantity}</span>
                  <span
                    className={`font-medium ${
                      room.usage >= 90
                        ? "text-green-600"
                        : room.usage >= 80
                        ? "text-orange-600"
                        : "text-red-600"
                    }`}
                  >
                    {room.usage}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Building className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-800">
                Add New Room
              </h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Room ID
                </label>
                <input
                  type="text"
                  placeholder="Enter room ID"
                  value={formData.roomId}
                  onChange={(e) =>
                    setFormData({ ...formData, roomId: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Room Name
                </label>
                <input
                  type="text"
                  placeholder="Enter room name"
                  value={formData.roomName}
                  onChange={(e) =>
                    setFormData({ ...formData, roomName: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
              <button
                onClick={handleCloseModals}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md"
              >
                ← Back
              </button>
              <button
                onClick={handleSaveRoom}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium"
              >
                + Add
              </button>
            </div>
          </div>
        </div>
      )}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Building className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-800">Edit Room</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Room ID
                </label>
                <input
                  type="text"
                  placeholder="Enter room ID"
                  value={formData.roomId}
                  onChange={(e) =>
                    setFormData({ ...formData, roomId: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Room Name
                </label>
                <input
                  type="text"
                  placeholder="Enter room name"
                  value={formData.roomName}
                  onChange={(e) =>
                    setFormData({ ...formData, roomName: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
              <button
                onClick={handleCloseModals}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md"
              >
                ← Back
              </button>
              <button
                onClick={handleSaveRoom}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
      {showDeleteModal && selectedRoom && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Delete room?
              </h3>

              <p className="text-sm text-gray-500 mb-6">
                Are you sure you want to delete this room?
                <br />
                This action cannot be undone.
              </p>

              <div className="flex justify-center gap-3">
                <button
                  onClick={handleCloseModals}
                  className="px-6 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {showDetailsModal && selectedRoom && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[800px] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Building className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">
                    {selectedRoom.name} Details
                  </h2>
                  <p className="text-sm text-gray-500">
                    Room ID: {selectedRoom.roomId} • Total Seats:{" "}
                    {selectedRoom.seatQuantity}
                  </p>
                </div>
              </div>
              <div
                role="button"
                onClick={handleCloseModals}
                className="text-gray-400 hover:text-gray-600 hover:bg-slate-200 p-2 rounded-lg"
              >
                <X size={30} />
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <div className="mb-8">
                <div className="bg-[#6a57f5] rounded-lg rounded-tr-[50px] rounded-tl-[50px] p-4 text-center mb-2">
                  <span className="text-white font-medium">SCREEN</span>
                </div>
              </div>

              <div className="flex justify-center mb-3 gap-3 ">
                <div className="w-8"></div>
                {Array.from({ length: 12 }, (_, index) => (
                  <div
                    key={index}
                    className="w-8 h-6 flex items-center justify-center text-md font-bold text-gray-600"
                  >
                    {index + 1}
                  </div>
                ))}
              </div>
              <div className="space-y-4 flex flex-col items-center justify-center">
                {["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K"].map(
                  (row) => (
                    <div key={row} className="flex items-center gap-4 ">
                      <div className="w-8 text-center font-medium text-gray-700">
                        {row}
                      </div>

                      <div className="flex gap-1">
                        {Array.from({ length: 12 }, (_, seatIndex) => {
                          const seatNumber = seatIndex + 1;
                          const isOccupied = Math.random() > 0.7; // Random occupied seats for demo

                          return (
                            <div
                              key={seatNumber}
                              className={` relative flex items-center justify-center text-xs font-medium  transition-colors ${
                                isOccupied
                                  ? "  text-[#6a57f5]"
                                  : "  text-slate-400 "
                              }`}
                              title={`Seat ${row}${seatNumber} - ${
                                isOccupied ? "Occupied" : "Available"
                              }`}
                            >
                              <MdChair size={40} />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )
                )}
              </div>

              {/* Legend */}
              <div className="flex justify-center gap-6 mt-6 pt-4 ">
                <div className="flex items-center gap-2">
                  <div className=" text-slate-400 ">
                    {" "}
                    <MdChair size={40} />
                  </div>
                  <span className="text-sm text-gray-600">Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className=" text-[#6a57f5] ">
                    {" "}
                    <MdChair size={40} />
                  </div>
                  <span className="text-sm text-gray-600">Occupied</span>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-800">120</div>
                  <div className="text-sm text-gray-500">Total Seats</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-400">
                    {120 - Math.floor(120 * 0.3)}
                  </div>
                  <div className="text-sm text-gray-500">Available</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#6a57f5]">
                    {Math.floor(120 * 0.3)}
                  </div>
                  <div className="text-sm text-gray-500">Occupied</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomManagement;
