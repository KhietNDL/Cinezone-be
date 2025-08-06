import React, { useEffect, useState } from "react";
import {
  Trash2,
  Building,
  Users,
  TrendingUp,
  X,
  ChevronDown,
} from "lucide-react";
import { FaSortAmountDownAlt, FaSortAmountUpAlt } from "react-icons/fa";
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin5Line } from "react-icons/ri";
import { IoSearchOutline } from "react-icons/io5";
import { GoPlus } from "react-icons/go";
import { LayoutSelectSeat } from "../../../component/LayoutSelectSeat";
import StatsCards from "../roomComponent/StatsCards";
import {
  getCinemaRooms,
  createCinemaRoom,
  searchCinemaRooms,
  deleteCinemaRoom,
  updateCinemaRoom,
  getSeatsByCinemaRoomId,
} from "../../../services/API";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Pagination from "../movieComponent/Pagination";

const RoomManagement = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [sortOrder, setSortOrder] = useState("desc");
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
  const [roomRow, setRoomRow] = useState("");
  const [roomCol, setRoomCol] = useState("");
  const [roomType, setRoomType] = useState("Normal");
  const [searchTerm, setSearchTerm] = useState("");
  const [seatData, setSeatData] = useState([]);
  const [isLoadingSeats, setIsLoadingSeats] = useState(false);
  const [showRoomTypeDropdown, setShowRoomTypeDropdown] = useState(false);

  // Calculate total seats from rooms data
  const totalSeats = rooms.reduce(
    (total, room) => total + (room.SeatQuantity || 0),
    0
  );

  // Calculate average occupancy rate (placeholder - you can implement real calculation)
  const averageRate = rooms.length > 0 ? "75%" : "0%";

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        showRoomTypeDropdown &&
        !event.target.closest(".room-type-dropdown")
      ) {
        setShowRoomTypeDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showRoomTypeDropdown]);

  // Cleanup toast when component unmounts
  useEffect(() => {
    return () => {
      toast.dismiss(); // Clear all pending toasts when component unmounts
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!searchTerm) {
          const response = await getCinemaRooms({
            page: currentPage,
            limit: itemsPerPage,
            sortBy: "SeatQuantity",
            sortOrder: sortOrder,
          });

          // Handle different response structures
          let roomsData = [];
          if (response) {
            if (Array.isArray(response.data)) {
              roomsData = response.data;
            } else if (Array.isArray(response)) {
              roomsData = response;
            }
          }

          setRooms(roomsData);
          setTotalPages(response.pagination?.totalPages || 1);
          setTotalRooms(response.pagination?.total || roomsData.length);
        } else {
          const data = await searchCinemaRooms({
            searchTerm,
            page: currentPage,
            limit: itemsPerPage,
            sortBy: "SeatQuantity",
            sortOrder: sortOrder,
          });

          // Handle different response structures for search
          let searchData = [];
          if (data) {
            if (Array.isArray(data.data)) {
              searchData = data.data;
            } else if (Array.isArray(data)) {
              searchData = data;
            }
          }

          setRooms(searchData);
          setTotalPages(data.pagination?.totalPages || 1);
          setTotalRooms(data.pagination?.total || searchData.length);
        }
      } catch (error) {
        console.error("Error fetching/searching rooms:", error);
        toast.error("Failed to fetch rooms data");
        setRooms([]);
        setTotalPages(1);
        setTotalRooms(0);
      }
    };

    const timeoutId = setTimeout(fetchData, 500);
    return () => clearTimeout(timeoutId);
  }, [searchTerm, currentPage, itemsPerPage, sortOrder]);

  const handleView = async (room) => {
    setSelectedRoom(room);
    setIsLoadingSeats(true);
    setSeatData([]);
    setShowDetailsModal(true);

    try {
      const seatResponse = await getSeatsByCinemaRoomId(room.CinemaRoomId);

      // Handle different response structures
      let rawSeatData = [];
      if (seatResponse) {
        if (Array.isArray(seatResponse)) {
          rawSeatData = seatResponse;
        } else if (seatResponse.data && Array.isArray(seatResponse.data)) {
          rawSeatData = seatResponse.data;
        } else if (seatResponse.seats && Array.isArray(seatResponse.seats)) {
          rawSeatData = seatResponse.seats;
        }
      }

      // Transform and validate seat data to match LayoutSelectSeat expectations
      const transformedSeatData = rawSeatData.map((seat, index) => {
        // Ensure we have the required seatNumber property
        let seatNumber = seat.seatNumber || seat.SeatNumber || seat.seat_number;

        // If no seatNumber exists, generate one based on position
        if (!seatNumber) {
          const rowLetter = String.fromCharCode(65 + Math.floor(index / 10)); // A, B, C...
          const seatNum = (index % 10) + 1;
          seatNumber = `${rowLetter}${seatNum}`;
        }

        return {
          seatId: seat.seatId || seat.SeatId || seat.id || index,
          seatNumber: seatNumber,
          type: seat.type || seat.Type || seat.seat_type || "Normal",
          status: seat.status || seat.Status || seat.seat_status || "available",
          price: seat.price || seat.Price || seat.seat_price || 0,
          ...seat, // Include any other properties
        };
      });

      // Validate that all seats have required properties
      const isValidSeatData = transformedSeatData.every(
        (seat) =>
          seat.seatNumber &&
          typeof seat.seatNumber === "string" &&
          seat.seatNumber.length > 0
      );

      if (!isValidSeatData) {
        console.error("Invalid seat data structure:", transformedSeatData);
        toast.error("Invalid seat data format received from server");
        setSeatData([]);
        return;
      }

      setSeatData(transformedSeatData);
    } catch (error) {
      console.error("Error fetching seat data:", error);
      toast.error("Failed to load seat data for this room");
      setSeatData([]);
    } finally {
      setIsLoadingSeats(false);
    }
  };

  const handleEdit = (room) => {
    setSelectedRoom(room);
    setRoomId(room.CinemaRoomId || "");
    setRoomName(room.Name || "");
    setSeatQuantity(room.SeatQuantity?.toString() || "");
    setRoomRow(room.Row?.toString() || "");
    setRoomCol(room.Col?.toString() || "");
    setRoomType(room.Type || "Normal");
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
    setRoomRow("");
    setRoomCol("");
    setRoomType("Normal");
    setShowAddModal(true);
  };

  const handleSaveRoom = async () => {
    const seatNum = Number(seatQuantity);
    const rowNum = Number(roomRow);
    const colNum = Number(roomCol);
    const maxCapacity = rowNum * colNum;
    const minRequiredSeats = Math.ceil(maxCapacity * 0.9);

    // Validation
    if (!roomName.trim()) {
      toast.error("Room name is required!");
      return;
    }

    if (!roomRow || rowNum < 5 || rowNum > 20) {
      toast.error("Row must be between 5 and 20!");
      return;
    }

    if (!roomCol || colNum < 8 || colNum > 20) {
      toast.error("Column must be between 8 and 20!");
      return;
    }

    if (maxCapacity > 300) {
      toast.error("Maximum capacity (Row × Column) cannot exceed 300!");
      return;
    }

    if (!seatQuantity || seatNum < minRequiredSeats || seatNum > maxCapacity) {
      toast.error(
        `Seat quantity must be between ${minRequiredSeats} and ${maxCapacity} (90-100% of capacity)!`
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
        Row: rowNum,
        Col: colNum,
        SeatQuantity: seatNum,
        Type: roomType,
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
      setRoomRow("");
      setRoomCol("");
      setRoomType("Normal");
      const data = await getCinemaRooms({
        page: currentPage,
        limit: itemsPerPage,
        sortBy: "SeatQuantity",
        sortOrder: sortOrder,
      });
      setRooms(data.data || []);
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
      const data = await getCinemaRooms({
        page: currentPage,
        limit: itemsPerPage,
        sortBy: "SeatQuantity",
        sortOrder: sortOrder,
      });
      setRooms(data.data || []);
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
    setRoomRow("");
    setRoomCol("");
    setRoomType("Normal");
    setSeatData([]);
    setIsLoadingSeats(false);
    setShowRoomTypeDropdown(false);
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className=" bg-gray-50">
      {/* Header Section */}
      <div className="max-w-7xl select-none mx-auto px-3 sm:px-6 py-3 sm:py-4 bg-white shadow-md rounded-lg mb-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-3 lg:gap-4">
          {/* Left: Logo/Brand */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg flex items-center justify-center">
              <Building className="text-white text-lg sm:text-xl" />
            </div>
            <div>
              <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent">
                Room Management
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 hidden sm:block">
                Admin Portal - Cinema Room Administration
              </p>
            </div>
          </div>

          {/* Right: Search & Actions */}
          <div className="flex flex-col sm:flex-row items-center gap-3 lg:gap-4 w-full md:w-auto">
            <div className="relative w-full sm:w-80">
              <IoSearchOutline
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                placeholder="Search by room name or room id"
              />
            </div>
            <button
              onClick={handleAddRoom}
              className="flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all duration-200 shadow-md hover:shadow-lg whitespace-nowrap"
            >
              <GoPlus size={20} className="mr-2" />
              Add Room
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center lg:items-start  max-w-7xl w-full overflow-x-hidden mx-auto">
        <div className="w-[90%] md:w-[95%] lg:w-full max-w-7xl space-y-4 sm:space-y-6">
          {/* Stats Cards */}
          <StatsCards
            totalRooms={totalRooms}
            totalSeats={totalSeats}
            averageRate={averageRate}
          />

          {/* Table Section */}
          <div className="bg-white rounded-xl shadow-md border border-gray-100">
            <div className="hidden sm:block">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Room Name
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                      Dimensions
                    </th>
                    <th
                      onClick={() =>
                        setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                      }
                      className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 select-none transition-colors"
                    >
                      <div className="flex items-center space-x-1">
                        <span>Seat Quantity</span>
                        {sortOrder === "asc" ? (
                          <FaSortAmountUpAlt className="text-purple-500" />
                        ) : (
                          <FaSortAmountDownAlt className="text-purple-500" />
                        )}
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                      Type
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                      Details
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {Array.isArray(rooms) && rooms.length > 0 ? (
                    rooms.map((room) => (
                      <tr
                        key={room.CinemaRoomId}
                        className="hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={() => handleEdit(room)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {room.Name?.length > 25
                              ? `${room.Name.slice(0, 25)}...`
                              : room.Name || "N/A"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 hidden md:table-cell">
                          {room.Row || "N/A"} × {room.Col || "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {room.SeatQuantity || "N/A"} seats
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              room.Type === "IMAX"
                                ? "bg-purple-100 text-purple-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {room.Type || "Normal"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">
                          <button
                            className="text-purple-600 hover:text-purple-900 font-medium"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleView(room);
                            }}
                          >
                            View Layout
                          </button>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEdit(room);
                              }}
                              className="text-purple-600 hover:text-purple-900 p-1 hover:bg-purple-50 rounded transition-colors"
                              title="Edit"
                            >
                              <FaRegEdit size={16} />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(room);
                              }}
                              className="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded transition-colors"
                              title="Delete"
                            >
                              <RiDeleteBin5Line size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-6 py-12 text-center">
                        <div className="text-gray-500">
                          <Building className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                          <p className="text-lg font-medium">No rooms found</p>
                          <p className="text-sm">
                            Get started by creating your first room
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile View */}
            <div className="block sm:hidden divide-y divide-gray-200">
              {Array.isArray(rooms) && rooms.length > 0 ? (
                rooms.map((room) => (
                  <div
                    key={room.CinemaRoomId}
                    className="p-6 hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => handleEdit(room)}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-medium text-gray-900 truncate">
                        {room.Name?.length > 20
                          ? `${room.Name.slice(0, 20)}...`
                          : room.Name || "N/A"}
                      </h3>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          room.Type === "IMAX"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {room.Type || "Normal"}
                      </span>
                    </div>
                    <div className="space-y-2 text-sm text-gray-600">
                      <p>
                        <span className="font-medium">ID:</span>{" "}
                        {room.CinemaRoomId}
                      </p>
                      <p>
                        <span className="font-medium">Dimensions:</span>{" "}
                        {room.Row || "N/A"} × {room.Col || "N/A"}
                      </p>
                      <p>
                        <span className="font-medium">Seats:</span>{" "}
                        {room.SeatQuantity || "N/A"}
                      </p>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <button
                        className="text-purple-600 hover:text-purple-900 font-medium"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleView(room);
                        }}
                      >
                        View Layout
                      </button>
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(room);
                          }}
                          className="text-purple-600 hover:text-purple-900"
                        >
                          <FaRegEdit size={16} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(room);
                          }}
                          className="text-red-600 hover:text-red-900"
                        >
                          <RiDeleteBin5Line size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-12 text-center text-gray-500">
                  <Building className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-medium">No rooms found</p>
                  <p className="text-sm">
                    Get started by creating your first room
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            handlePageChange={handlePageChange}
          />
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Building className="w-5 h-5 text-purple-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800">
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Rows (5 - 20)
                  </label>
                  <input
                    type="number"
                    min={5}
                    max={20}
                    placeholder="Enter rows"
                    value={roomRow}
                    onChange={(e) => setRoomRow(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Columns (8 - 20)
                  </label>
                  <input
                    type="number"
                    min={8}
                    max={20}
                    placeholder="Enter columns"
                    value={roomCol}
                    onChange={(e) => setRoomCol(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Seat Quantity (90-100% of Row × Col, max 300)
                </label>
                <input
                  type="number"
                  placeholder="Enter seat quantity"
                  value={seatQuantity}
                  onChange={(e) => setSeatQuantity(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                {roomRow && roomCol && (
                  <p className="text-xs text-gray-500 mt-1">
                    Capacity: {Number(roomRow) * Number(roomCol)} seats (Min:{" "}
                    {Math.ceil(Number(roomRow) * Number(roomCol) * 0.9)}, Max:{" "}
                    {Number(roomRow) * Number(roomCol)})
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Room Type
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() =>
                      setShowRoomTypeDropdown(!showRoomTypeDropdown)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-left flex items-center justify-between"
                  >
                    <span
                      className={roomType ? "text-gray-900" : "text-gray-500"}
                    >
                      {roomType || "Select room type"}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-gray-400 transition-transform ${
                        showRoomTypeDropdown ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {showRoomTypeDropdown && (
                    <div className="absolute z-[9999] w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                      <div className="py-1">
                        <button
                          type="button"
                          onMouseDown={(e) => {
                            e.preventDefault();
                            setRoomType("Normal");
                            setShowRoomTypeDropdown(false);
                          }}
                          className="w-full px-3 py-2 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none text-gray-900 transition-colors duration-150"
                        >
                          <div className="flex items-center">
                            <div className="w-3 h-3 rounded-full bg-gray-400 mr-3"></div>
                            Normal
                          </div>
                        </button>
                        <button
                          type="button"
                          onMouseDown={(e) => {
                            e.preventDefault();
                            setRoomType("IMAX");
                            setShowRoomTypeDropdown(false);
                          }}
                          className="w-full px-3 py-2 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none text-gray-900 transition-colors duration-150"
                        >
                          <div className="flex items-center">
                            <div className="w-3 h-3 rounded-full bg-purple-500 mr-3"></div>
                            IMAX
                          </div>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
              <button
                onClick={handleCloseModals}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveRoom}
                className="px-6 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all duration-200"
              >
                Add Room
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Building className="w-5 h-5 text-purple-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800">Edit Room</h2>
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Rows (5 - 20)
                  </label>
                  <input
                    type="number"
                    min={5}
                    max={20}
                    placeholder="Enter rows"
                    value={roomRow}
                    onChange={(e) => setRoomRow(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Columns (8 - 20)
                  </label>
                  <input
                    type="number"
                    min={8}
                    max={20}
                    placeholder="Enter columns"
                    value={roomCol}
                    onChange={(e) => setRoomCol(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Seat Quantity (90-100% of Row × Col, max 300)
                </label>
                <input
                  type="number"
                  placeholder="Enter seat quantity"
                  value={seatQuantity}
                  onChange={(e) => setSeatQuantity(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                {roomRow && roomCol && (
                  <p className="text-xs text-gray-500 mt-1">
                    Capacity: {Number(roomRow) * Number(roomCol)} seats (Min:{" "}
                    {Math.ceil(Number(roomRow) * Number(roomCol) * 0.9)}, Max:{" "}
                    {Number(roomRow) * Number(roomCol)})
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Room Type
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() =>
                      setShowRoomTypeDropdown(!showRoomTypeDropdown)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-left flex items-center justify-between"
                  >
                    <span
                      className={roomType ? "text-gray-900" : "text-gray-500"}
                    >
                      {roomType || "Select room type"}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-gray-400 transition-transform ${
                        showRoomTypeDropdown ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {showRoomTypeDropdown && (
                    <div className="absolute z-[9999] w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                      <div className="py-1">
                        <button
                          type="button"
                          onMouseDown={(e) => {
                            e.preventDefault();
                            setRoomType("Normal");
                            setShowRoomTypeDropdown(false);
                          }}
                          className="w-full px-3 py-2 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none text-gray-900 transition-colors duration-150"
                        >
                          <div className="flex items-center">
                            <div className="w-3 h-3 rounded-full bg-gray-400 mr-3"></div>
                            Normal
                          </div>
                        </button>
                        <button
                          type="button"
                          onMouseDown={(e) => {
                            e.preventDefault();
                            setRoomType("IMAX");
                            setShowRoomTypeDropdown(false);
                          }}
                          className="w-full px-3 py-2 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none text-gray-900 transition-colors duration-150"
                        >
                          <div className="flex items-center">
                            <div className="w-3 h-3 rounded-full bg-purple-500 mr-3"></div>
                            IMAX
                          </div>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
              <button
                onClick={handleCloseModals}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveRoom}
                className="px-6 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all duration-200"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && selectedRoom && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Delete Room
              </h3>

              <p className="text-sm text-gray-500 mb-6">
                Are you sure you want to delete "{selectedRoom.Name}"?
                <br />
                This action cannot be undone.
              </p>

              <div className="flex justify-center gap-3">
                <button
                  onClick={handleCloseModals}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {showDetailsModal && selectedRoom && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Building className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">
                    {selectedRoom.Name} - Seat Layout
                  </h2>
                  <p className="text-sm text-gray-500">
                    • Dimensions: {selectedRoom.Row || "N/A"} ×{" "}
                    {selectedRoom.Col || "N/A"} • Total Seats:{" "}
                    {selectedRoom.SeatQuantity} • Type:{" "}
                    {selectedRoom.Type || "Normal"}
                  </p>
                </div>
              </div>
              <button
                onClick={handleCloseModals}
                className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-lg transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {isLoadingSeats ? (
              <div className="flex justify-center items-center py-12">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-gray-600">Loading seat layout...</span>
                </div>
              </div>
            ) : seatData && seatData.length > 0 ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm text-gray-600">
                  <span>Room: {selectedRoom?.Name}</span>
                  <span>Seats Found: {seatData.length}</span>
                </div>
                <div className="flex justify-center bg-gray-50 rounded-2xl p-6 border border-gray-200 overflow-x-auto">
                  <LayoutSelectSeat
                    key={`room-${selectedRoom?.CinemaRoomId}-${seatData.length}`}
                    seatDataFromAPI={seatData}
                    totalSeats={selectedRoom?.SeatQuantity || seatData.length}
                    onSeatSelect={() => {}} // Read-only mode for admin view
                    initialSelectedSeats={[]} // No seats selected initially
                    //readOnly={true} // Disable seat clicking for admin view
                    width={20}
                    height={20}
                    widthDouble={40}
                    heightDouble={28}
                    textColor="text-gray-600"
                    seatColors={{
                      available: "text-green-500",
                      selected: "text-blue-500",
                      taken: "text-red-500",
                      holding: "text-yellow-500",
                      vip: "text-purple-500",
                      normal: "text-gray-500",
                      couple: "text-pink-500",
                    }}
                  />
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <Building className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className="text-lg font-medium">No seat data available</p>
                <p className="text-sm">
                  Seat layout could not be loaded for this room
                </p>
                <p className="text-xs mt-2 text-gray-400">
                  Room ID: {selectedRoom?.CinemaRoomId} | Expected Seats:{" "}
                  {selectedRoom?.SeatQuantity}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomManagement;
