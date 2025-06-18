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
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin5Line } from "react-icons/ri";
import { IoSearchOutline } from "react-icons/io5";
import { GoPlus } from "react-icons/go";
import { LayoutSelectSeat } from "../../../component/LayoutSelectSeat";

const RoomManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

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
      label: "Avg Rate",
      value: "75%",
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
    {
      icon: TrendingUp,
      label: "Avg Rate",
      value: "75%",
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
  ];

  const topRooms = rooms.slice(0, 5);

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
    <div className="p-[20px] flex items-center h-full justify-between">
      <div className="w-[70%] space-y-4 h-full">
        <div className="flex items-center justify-between w-full">
          {statsData.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-md  w-[23%] shadow-sm "
            >
              <div className="bg-white rounded-md p-3 w-full ">
                <div className="flex items-center justify-between ">
                  <p className="text-sm text-gray-600">{stat.label}</p>
                  <div className={`p-2 rounded-full ${stat.bgColor} `}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>{" "}
                <div className="font-bold text-[19px]">{stat.value}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="w-full py-3 space-y-4">
          <div className="flex items-center mb-4 justify-between">
            <div className="w-full">
              <div className="flex items-center p-1 px-2 w-2/4 rounded-xl bg-white shadow-sm">
                <div className="shrink-0">
                  <IoSearchOutline size={20} />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                  }}
                  className="p-2 focus:outline-none w-full"
                  placeholder="Search by room name or room id"
                />
              </div>
            </div>
            <div className="flex items-center justify-between gap-2">
              <div
                role="button"
                onClick={handleAddRoom}
                className="flex items-center text-[#6051F3] hover:bg-slate-50 p-2 rounded-md active:bg-slate-100 bg-white shadow-sm"
              >
                <GoPlus size={20} className="mr-2" />
                Room
              </div>
            </div>
          </div>
          <div className="bg-white min-h-[340px] max-h-[340px] p-4 rounded-md shadow-sm">
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr className="text-left text-slate-500 text-sm border-b border-slate-200">
                  <th className="py-2 text-center">#</th>
                  <th className="py-2 text-center">Room ID</th>
                  <th className="py-2 text-center">Room Name</th>
                  <th className="py-2 text-center">Seat Quantity</th>
                  <th className="py-2 text-center">Seat Details</th>
                  <th className="py-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRooms.map((room, index) => (
                  <tr
                    key={room.id}
                    className="border-b border-slate-200 hover:bg-slate-100 text-sm"
                  >
                    <td className="py-2 text-center">{index + 1}</td>
                    <td className="py-2 text-center">{room.roomId}</td>
                    <td className="py-2 text-center">{room.name}</td>
                    <td className="py-2 text-center">{room.seatQuantity}</td>
                    <td className="py-2 ">
                      <div
                        role="button"
                        onClick={() => handleView(room)}
                        className="text-blue-500 hover:text-blue-700 justify-center flex items-center"
                      >
                        <Eye size={20} className="mr-1" />
                        View
                      </div>
                    </td>
                    <td className="flex items-center justify-evenly p-2">
                      <div
                        role="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(room);
                        }}
                        className="text-blue-500 hover:text-blue-700"
                        title="Edit"
                      >
                        <FaRegEdit size={20} />
                      </div>
                      <div
                        role="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(room);
                        }}
                        className="text-red-400 hover:text-red-600"
                        title="Delete"
                      >
                        <RiDeleteBin5Line size={20} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>{" "}
          {/* Pagination */}
          <div className="flex items-center justify-end space-x-2 pt-4">
            <div
              role="button"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              className="px-3 py-1 bg-white shadow-sm rounded hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={currentPage === 1}
            >
              Previous
            </div>
            {[1, 2, 3].map((page) => (
              <div
                role="button"
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 rounded shadow-sm ${
                  currentPage === page
                    ? "bg-[#6051F3] text-white"
                    : "bg-white hover:bg-slate-100"
                }`}
              >
                {page}
              </div>
            ))}
            <div
              role="button"
              onClick={() => setCurrentPage(currentPage + 1)}
              className="px-3 py-1 bg-white shadow-sm rounded hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center right-[-40px] top-[25%] justify-end w-[30%]">
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
              <div
                role="button"
                onClick={handleCloseModals}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md"
              >
                ← Back
              </div>
              <div
                role="button"
                onClick={handleSaveRoom}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium"
              >
                + Add
              </div>
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
              <div
                role="button"
                onClick={handleCloseModals}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md"
              >
                ← Back
              </div>
              <div
                role="button"
                onClick={handleSaveRoom}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium"
              >
                Save Changes
              </div>
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
                <div
                  role="button"
                  onClick={handleCloseModals}
                  className="px-6 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md"
                >
                  Cancel
                </div>
                <div
                  role="button"
                  onClick={handleConfirmDelete}
                  className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md font-medium"
                >
                  Delete
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {showDetailsModal && selectedRoom && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[800px]  overflow-y-auto">
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

            <LayoutSelectSeat />
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomManagement;
