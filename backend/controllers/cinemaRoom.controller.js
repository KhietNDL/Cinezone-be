const CinemaRoom = require('../models/cinemaRoom.model');
const { validate: uuidValidate } = require('uuid');

// Define error codes for cinema room operations
const ERROR_CODES = {
    ROOM_NOT_FOUND: 'CINEMA_001',
    INVALID_UUID: 'CINEMA_002',
    INVALID_SEAT_QUANTITY: 'CINEMA_003',
    DUPLICATE_ROOM_NAME: 'CINEMA_004',
    ROOM_IN_USE: 'CINEMA_005',
    SERVER_ERROR: 'CINEMA_006',
    INVALID_INPUT: 'CINEMA_007'
};

// Helper function to format room data
const formatRoomData = (room) => ({
    CinemaRoomId: room.CinemaRoomId,
    Name: room.Name,
    SeatQuantity: room.SeatQuantity
});

// Get all cinema rooms
const getAllCinemaRooms = async (_, res) => {
    try {
        const rooms = await CinemaRoom.getAllCinemaRooms();
        res.json({ 
            message: 'Cinema rooms retrieved successfully',
            rooms: rooms.map(formatRoomData)
        });
    } catch (error) {
        console.error('Get all cinema rooms error:', error);
        res.status(500).json({ 
            error: 'Internal server error while retrieving cinema rooms',
            code: ERROR_CODES.SERVER_ERROR
        });
    }
};

// Get cinema room by ID
const getCinemaRoomById = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate UUID format
        if (!uuidValidate(id)) {
            return res.status(400).json({ 
                error: 'Invalid UUID format',
                code: ERROR_CODES.INVALID_UUID
            });
        }

        const room = await CinemaRoom.getCinemaRoomById(id);
        if (!room) {
            return res.status(404).json({ 
                error: 'Cinema room not found',
                code: ERROR_CODES.ROOM_NOT_FOUND
            });
        }

        res.json({ 
            message: 'Cinema room retrieved successfully',
            room: formatRoomData(room)
        });
    } catch (error) {
        console.error('Get cinema room by ID error:', error);
        res.status(500).json({ 
            error: 'Internal server error while retrieving cinema room',
            code: ERROR_CODES.SERVER_ERROR
        });
    }
};

// Create new cinema room
const createCinemaRoom = async (req, res) => {
    try {
        const { Name, SeatQuantity } = req.body;

        // Validate input
        if (!Name || !SeatQuantity) {
            return res.status(400).json({
                error: 'Name and SeatQuantity are required',
                code: ERROR_CODES.INVALID_INPUT
            });
        }

        // Validate seat quantity
        if (SeatQuantity <= 0 || !Number.isInteger(SeatQuantity)) {
            return res.status(400).json({
                error: 'SeatQuantity must be a positive integer',
                code: ERROR_CODES.INVALID_SEAT_QUANTITY
            });
        }

        // Check for duplicate room name
        const existingRoom = await CinemaRoom.findByName(Name);
        if (existingRoom) {
            return res.status(400).json({
                error: 'A room with this name already exists',
                code: ERROR_CODES.DUPLICATE_ROOM_NAME
            });
        }

        const CreatedBy = req.user.UserId;
        const id = await CinemaRoom.createCinemaRoom({ 
            Name, 
            SeatQuantity,
            CreatedBy 
        });

        const newRoom = await CinemaRoom.getCinemaRoomById(id);
        res.status(201).json({ 
            message: 'Cinema room created successfully',
            room: formatRoomData(newRoom)
        });
    } catch (error) {
        console.error('Create cinema room error:', error);
        res.status(500).json({ 
            error: 'Internal server error while creating cinema room',
            code: ERROR_CODES.SERVER_ERROR
        });
    }
};

// Update cinema room
const updateCinemaRoom = async (req, res) => {
    try {
        const { id } = req.params;
        const { Name, SeatQuantity } = req.body;

        // Validate UUID format
        if (!uuidValidate(id)) {
            return res.status(400).json({ 
                error: 'Invalid UUID format',
                code: ERROR_CODES.INVALID_UUID
            });
        }

        // Validate input
        if (!Name || !SeatQuantity) {
            return res.status(400).json({
                error: 'Name and SeatQuantity are required',
                code: ERROR_CODES.INVALID_INPUT
            });
        }

        // Validate seat quantity
        if (SeatQuantity <= 0 || !Number.isInteger(SeatQuantity)) {
            return res.status(400).json({
                error: 'SeatQuantity must be a positive integer',
                code: ERROR_CODES.INVALID_SEAT_QUANTITY
            });
        }

        // Check if room exists
        const existingRoom = await CinemaRoom.getCinemaRoomById(id);
        if (!existingRoom) {
            return res.status(404).json({ 
                error: 'Cinema room not found',
                code: ERROR_CODES.ROOM_NOT_FOUND
            });
        }

        // Check for duplicate room name (excluding current room)
        if (Name !== existingRoom.Name) {
            const duplicateRoom = await CinemaRoom.findByName(Name);
            if (duplicateRoom) {
                return res.status(400).json({
                    error: 'A room with this name already exists',
                    code: ERROR_CODES.DUPLICATE_ROOM_NAME
                });
            }
        }

        const UpdatedBy = req.user.UserId;
        const success = await CinemaRoom.updateCinemaRoom(id, { 
            Name, 
            SeatQuantity, 
            UpdatedBy 
        });

        if (!success) {
            return res.status(404).json({ 
                error: 'Cinema room not found or not updated',
                code: ERROR_CODES.ROOM_NOT_FOUND
            });
        }

        const updatedRoom = await CinemaRoom.getCinemaRoomById(id);
        res.json({ 
            message: 'Cinema room updated successfully',
            room: formatRoomData(updatedRoom)
        });
    } catch (error) {
        console.error('Update cinema room error:', error);
        res.status(500).json({ 
            error: 'Internal server error while updating cinema room',
            code: ERROR_CODES.SERVER_ERROR
        });
    }
};

// Delete cinema room
const deleteCinemaRoom = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate UUID format
        if (!uuidValidate(id)) {
            return res.status(400).json({ 
                error: 'Invalid UUID format',
                code: ERROR_CODES.INVALID_UUID
            });
        }

        // Check if room exists
        const existingRoom = await CinemaRoom.getCinemaRoomById(id);
        if (!existingRoom) {
            return res.status(404).json({ 
                error: 'Cinema room not found',
                code: ERROR_CODES.ROOM_NOT_FOUND
            });
        }

        // Check if room is in use (has active screenings)
        const isInUse = await CinemaRoom.checkRoomInUse(id);
        if (isInUse) {
            return res.status(400).json({
                error: 'Cannot delete room that has active screenings',
                code: ERROR_CODES.ROOM_IN_USE
            });
        }

        const DeletedBy = req.user.UserId;
        const success = await CinemaRoom.deleteCinemaRoom(id, DeletedBy);
        
        if (!success) {
            return res.status(404).json({ 
                error: 'Cinema room not found or already deleted',
                code: ERROR_CODES.ROOM_NOT_FOUND
            });
        }

        res.json({ message: 'Cinema room deleted successfully' });
    } catch (error) {
        console.error('Delete cinema room error:', error);
        res.status(500).json({ 
            error: 'Internal server error while deleting cinema room',
            code: ERROR_CODES.SERVER_ERROR
        });
    }
};

// Search cinema rooms by name
const searchCinemaRoomsByName = async (req, res) => {
    try {
        const { name } = req.query;

        // Validate search query
        if (!name || typeof name !== 'string' || name.trim().length === 0) {
            return res.status(400).json({ 
                error: 'Valid name query parameter is required',
                code: ERROR_CODES.INVALID_INPUT
            });
        }

        const rooms = await CinemaRoom.searchCinemaRoomsByName(name.trim());
        if (!rooms || rooms.length === 0) {
            return res.status(404).json({ 
                error: 'No cinema rooms found',
                code: ERROR_CODES.ROOM_NOT_FOUND
            });
        }

        res.json({
            message: 'Cinema rooms found',
            rooms: rooms.map(formatRoomData)
        });
    } catch (error) {
        console.error('Search cinema rooms error:', error);
        res.status(500).json({ 
            error: 'Internal server error while searching cinema rooms',
            code: ERROR_CODES.SERVER_ERROR
        });
    }
};

module.exports = {
    getAllCinemaRooms,
    getCinemaRoomById,
    createCinemaRoom,
    updateCinemaRoom,
    deleteCinemaRoom,
    searchCinemaRoomsByName
};
