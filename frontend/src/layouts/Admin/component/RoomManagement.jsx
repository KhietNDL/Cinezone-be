import React, { useEffect, useState, useRef } from "react";
import { Trash2, Building, Users, TrendingUp, X } from "lucide-react";
import { FaSortAmountDownAlt, FaSortAmountUpAlt } from "react-icons/fa";

import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin5Line } from "react-icons/ri";
import { IoSearchOutline } from "react-icons/io5";
import { GoPlus } from "react-icons/go";
import { LayoutSelectSeat } from "../../../component/LayoutSelectSeat";
import {
  getCinemaRooms,
  createCinemaRoom,
  searchCinemaRooms,
  deleteCinemaRoom,
  updateCinemaRoom,
} from "../../../services/API";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Pagination from "../movieComponent/Pagination";

const RoomManagement = () => {
  const [currentPage, setCurrentPage] = useState(1);
  // eslint-disable-next-line no-unused-vars
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [sortOrder, setSortOrder] = useState("desc"); // hoặc "asc"
  const [totalPages, setTotalPages] = useState(1);
  const [totalRooms, setTotalRooms] = useState(0);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const [rooms, setRooms] = useState([]);
  const [roomId, setRoomId] = useState("");
  const [roomName, setRoomName] = useState("");
  const [seatQuantity, setSeatQuantity] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const searchTimeout = useRef();

  // Sample data matching your image
  const statsData = [
    {
      icon: Building,
      label: "Total Rooms",
      value: totalRooms,
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

  useEffect(() => {
    if (!searchTerm) {
      (async () => {
        const data = await getCinemaRooms({
          page: currentPage,
          limit: itemsPerPage,
          sortBy: "SeatQuantity",
          sortOrder: sortOrder,
        });
        setRooms(data.rooms);
        setTotalPages(data.pagination?.totalPages || 1);
        setTotalRooms(data.total);
      })();
      return;
    }
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(async () => {
      try {
        const data = await searchCinemaRooms(searchTerm);
        setRooms(data.rooms || []);
        setTotalPages(1);
        setTotalRooms(data?.rooms?.length || 0);
      } catch (error) {
        console.error("Error searching rooms:", error);
        setRooms([]);
        setTotalPages(1);
        setTotalRooms(0);
      }
    }, 400);
    // eslint-disable-next-line
  }, [searchTerm, currentPage, itemsPerPage, sortOrder]);

  const handleView = (room) => {
    setSelectedRoom(room);
    setShowDetailsModal(true);
  };

  const handleEdit = (room) => {
    setSelectedRoom(room);
    setRoomId(room.CinemaRoomId || "");
    setRoomName(room.Name || "");
    setSeatQuantity(room.SeatQuantity?.toString() || "");
    setShowEditModal(true);
  };

  const handleDelete = (room) => {
    setSelectedRoom(room);
    setShowDeleteModal(true);
  };

  const handleAddRoom = () => {
    setRoomId("");
    setRoomName("");
    setSeatQuantity("");
    setShowAddModal(true);
  };

  const handleSaveRoom = async () => {
    const seatNum = Number(seatQuantity);
    if (!roomName.trim() || !seatQuantity || seatNum < 60 || seatNum > 150) {
      toast.error(
        "Room name is required and seat quantity must be between 60 and 150!"
      );
      return;
    }
    const isDuplicate = rooms.some(
      (room) =>
        room.Name.trim().toLowerCase() === roomName.trim().toLowerCase() &&
        (!showEditModal || room.CinemaRoomId !== roomId)
    );
    if (isDuplicate) {
      toast.error("Room name already exists, please choose another name!");
      return;
    }
    try {
      const payload = {
        Name: roomName.trim(),
        SeatQuantity: seatNum,
      };
      if (showEditModal && roomId) {
        await updateCinemaRoom(roomId, payload);
        toast.success("Room updated successfully!");
      } else {
        await createCinemaRoom(payload);
        toast.success("Room created successfully!");
      }
      setShowAddModal(false);
      setShowEditModal(false);
      setRoomId("");
      setRoomName("");
      setSeatQuantity("");
      // Lấy lại rooms đúng trang hiện tại
      const data = await getCinemaRooms({
        page: currentPage,
        limit: itemsPerPage,
        sortBy: "SeatQuantity",
        sortOrder: sortOrder,
      });
      setRooms(data.rooms);
      setTotalPages(data.pagination?.totalPages || 1);
      setTotalRooms(data.pagination?.total || 0);
    } catch (error) {
      console.error("Error saving room:", error);
      toast.error("An error occurred while saving the room!");
      setShowAddModal(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedRoom?.CinemaRoomId) return;
    try {
      await deleteCinemaRoom(selectedRoom.CinemaRoomId);
      setShowDeleteModal(false);
      setSelectedRoom(null);
      // Lấy lại rooms đúng trang hiện tại
      const data = await getCinemaRooms({
        page: currentPage,
        limit: itemsPerPage,
        sortBy: "SeatQuantity",
        sortOrder: sortOrder,
      });
      setRooms(data.rooms);
      setTotalPages(data.pagination?.totalPages || 1);
      setTotalRooms(data.pagination?.total || 0);
      toast.success("Room deleted successfully!");
    } catch (error) {
      console.error("Error deleting room:", error);
      toast.error("Failed to delete room!");
      setShowDeleteModal(false);
    }
  };

  const handleCloseModals = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setShowDeleteModal(false);
    setShowDetailsModal(false);
    setSelectedRoom(null);
    setRoomId("");
    setRoomName("");
    setSeatQuantity("");
  };
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  return (
    <>
      <div>
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="w-full lg:w-[90%] space-y-4">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 lg:gap-4 w-full">
              {statsData.map((stat, index) => (
                <div key={index} className="bg-white rounded-md shadow-sm">
                  <div className="bg-white rounded-md p-2 lg:p-3 w-full">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between">
                      <p className="text-xs lg:text-sm text-gray-600 mb-1 lg:mb-0">
                        {stat.label}
                      </p>
                      <div
                        className={`p-1.5 lg:p-2 rounded-full ${stat.bgColor} w-fit`}
                      >
                        <stat.icon
                          className={`w-4 h-4 lg:w-6 lg:h-6 ${stat.color}`}
                        />
                      </div>
                    </div>
                    <div className="font-bold text-base lg:text-[19px] mt-1">
                      {stat.value}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Search and Add Section */}
            <div className="w-full py-3 space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center mb-4 justify-between gap-3">
                <div className="w-full sm:w-auto">
                  <div className="flex items-center p-2 px-3 w-full sm:w-80 rounded-xl bg-white shadow-sm">
                    <div className="shrink-0">
                      <IoSearchOutline size={20} />
                    </div>
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="p-2 focus:outline-none w-full text-sm"
                      placeholder="Search by room name or room id"
                    />
                  </div>
                </div>
                <div className="flex items-center justify-end gap-2 w-full sm:w-auto">
                  <button
                    onClick={handleAddRoom}
                    className="flex items-center text-[#6051F3] hover:bg-slate-50 p-2 rounded-md active:bg-slate-100 bg-white shadow-sm text-sm"
                  >
                    <GoPlus size={20} className="mr-2" />
                    Room
                  </button>
                </div>
              </div>

              {/* Table and Card Layout */}
              <div className="bg-white p-2 lg:p-4 rounded-lg shadow-sm">
                {/* Table Layout for sm and above */}
                <div className="hidden sm:block">
                  <table className="w-full table-auto border-collapse">
                    <thead>
                      <tr className="text-left text-slate-500 text-xs sm:text-sm border-b border-gray-200">
                        <th className="py-2 text-center px-2 sm:px-4 w-[150px] sm:w-[180px] md:w-[200px] shrink-0">
                          Room Name
                        </th>
                        <th
                          onClick={() =>
                            setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                          }
                          className="py-2 px-2 sm:px-4 w-[100px] sm:w-[120px] shrink-0 text-center cursor-pointer select-none"
                        >
                          Seat Quantity
                          <span className="inline-block ml-1 align-middle">
                            {sortOrder === "asc" ? (
                              <FaSortAmountUpAlt className="inline text-blue-500" />
                            ) : (
                              <FaSortAmountDownAlt className="inline text-blue-500" />
                            )}
                          </span>
                        </th>
                        <th className="py-2 px-2 sm:px-4 w-[80px] shrink-0 text-center hidden md:table-cell">
                          Set Detail
                        </th>
                        <th className="py-2 px-2 sm:px-4 w-[80px] shrink-0 text-center">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {rooms.map((room) => (
                        <tr
                          key={room.CinemaRoomId}
                          onClick={() => handleEdit(room)}
                          className="border-b cursor-pointer border-gray-200 hover:bg-gray-50 text-xs sm:text-sm transition-colors"
                        >
                          <td className="py-2 px-2 sm:px-4 w-[150px] sm:w-[180px] md:w-[200px] shrink-0">
                            <span className="block text-center">
                              {room.Name?.length > 20 ? (
                                <span title={room.Name}>
                                  {room.Name.slice(0, 20) + "..."}
                                </span>
                              ) : (
                                room.Name || "N/A"
                              )}
                            </span>
                          </td>
                          <td className="py-2 px-2 sm:px-4 w-[100px] sm:w-[120px] shrink-0 text-center">
                            {room.SeatQuantity || "N/A"}
                          </td>
                          <td className="py-2 px-2 sm:px-4 w-[80px] shrink-0 text-center hidden md:table-cell">
                            <button
                              className="text-blue-500 hover:text-blue-700 text-xs sm:text-sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleView(room);
                              }}
                            >
                              Detail
                            </button>
                          </td>
                          <td className="py-2 px-2 sm:px-4 w-[80px] shrink-0 text-center">
                            <div className="flex justify-center space-x-2 sm:space-x-3">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEdit(room);
                                }}
                                className="text-blue-500 hover:text-blue-700 p-1 sm:p-2"
                                title="Edit"
                                aria-label={`Edit ${room.Name || "room"}`}
                              >
                                <FaRegEdit size={18} />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDelete(room);
                                }}
                                className="text-red-400 hover:text-red-600 p-1 sm:p-2"
                                title="Delete"
                                aria-label={`Delete ${room.Name || "room"}`}
                              >
                                <RiDeleteBin5Line size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {/* Card Layout for Mobile */}
                <div className="block sm:hidden space-y-4">
                  {rooms.map((room) => (
                    <article
                      key={room.CinemaRoomId}
                      className="bg-white p-4 rounded-lg shadow-sm border border-slate-200"
                      onClick={() => handleEdit(room)}
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex-1">
                          <h3 className="text-sm font-medium text-gray-900 truncate">
                            {room.Name?.length > 20 ? (
                              <span title={room.Name}>
                                {room.Name.slice(0, 20) + "..."}
                              </span>
                            ) : (
                              room.Name || "N/A"
                            )}
                          </h3>
                          <p className="text-xs text-gray-500 truncate">
                            Seats: {room.SeatQuantity || "N/A"}
                          </p>
                        </div>
                      </div>
                      <div className="mt-4 text-xs grid grid-cols-2 gap-x-2 gap-y-4 text-gray-700">
                        <p>
                          <strong>Detail:</strong>{" "}
                          <button
                            className="text-blue-500 hover:text-blue-700"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleView(room);
                            }}
                          >
                            View
                          </button>
                        </p>
                      </div>
                      <div className="flex justify-center space-x-2 mt-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(room);
                          }}
                          className="text-blue-500 hover:text-blue-700"
                          aria-label={`Edit ${room.Name || "room"}`}
                        >
                          <FaRegEdit size={16} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(room);
                          }}
                          className="text-red-400 hover:text-red-600"
                          aria-label={`Delete ${room.Name || "room"}`}
                        >
                          <RiDeleteBin5Line size={16} />
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                handlePageChange={handlePageChange}
              />
            </div>
          </div>
        </div>

        {/* Modals */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4">
            <div className="bg-white rounded-lg p-4 lg:p-6 w-full max-w-md sm:max-w-lg max-h-[90vh] overflow-y-auto">
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
                    Room Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter room name"
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Seat Quantity (60 - 150)
                  </label>
                  <input
                    type="number"
                    min={60}
                    max={150}
                    placeholder="Enter seat quantity"
                    value={seatQuantity}
                    onChange={(e) => setSeatQuantity(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6 pt-4 border-t">
                <button
                  onClick={handleCloseModals}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md text-center text-sm w-full sm:w-auto"
                >
                  ← Back
                </button>
                <button
                  onClick={handleSaveRoom}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium text-center text-sm w-full sm:w-auto"
                >
                  + Add
                </button>
              </div>
            </div>
          </div>
        )}

        {showEditModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4">
            <div className="bg-white rounded-lg p-4 lg:p-6 w-full max-w-md sm:max-w-lg max-h-[90vh] overflow-y-auto">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Building className="w-5 h-5 text-blue-600" />
                </div>
                <h2 className="text-lg font-semibold text-gray-800">
                  Edit Room
                </h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Room Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter room name"
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Seat Quantity (60 - 150)
                  </label>
                  <input
                    type="number"
                    min={60}
                    max={150}
                    placeholder="Enter seat quantity"
                    value={seatQuantity}
                    onChange={(e) => setSeatQuantity(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                <button
                  onClick={handleCloseModals}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md text-sm w-full sm:w-auto"
                >
                  ← Back
                </button>
                <button
                  onClick={handleSaveRoom}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium text-sm w-full sm:w-auto"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}
        {showDeleteModal && selectedRoom && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4">
            <div className="bg-white rounded-lg p-4 lg:p-6 w-full max-w-md sm:max-w-lg">
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

                <div className="flex flex-col sm:flex-row justify-center gap-3">
                  <button
                    onClick={handleCloseModals}
                    className="px-6 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md text-sm w-full sm:w-auto"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmDelete}
                    className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md font-medium text-sm w-full sm:w-auto"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        {showDetailsModal && selectedRoom && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4">
            <div className="bg-white rounded-lg p-4 lg:p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Building className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800">
                      {selectedRoom.Name} Details
                    </h2>
                    <p className="text-sm text-gray-500">
                      Room ID: {selectedRoom.CinemaRoomId} • Total Seats:{" "}
                      {selectedRoom.SeatQuantity}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleCloseModals}
                  className="text-gray-400 hover:text-gray-600 hover:bg-slate-200 p-2 rounded-lg"
                >
                  <X size={30} />
                </button>
              </div>

              <LayoutSelectSeat />
            </div>
          </div>
        )}

        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          draggable
        />
      </div>
    </>
  );
};

export default RoomManagement;
