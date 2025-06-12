const CinemaRoom = require('../models/cinemaRoom.model');

const getAllCinemaRooms = async (_, res) => {
    try {
        const rooms = await CinemaRoom.getAllCinemaRooms();
        res.json({ message: 'Cinema rooms retrieved successfully',
             rooms: rooms.map((room) => ({
                CinemaRoomId: room.CinemaRoomId,
                Name: room.Name,
                SeatQuantity: room.SeatQuantity,
            })) });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getCinemaRoomById = async (req, res) => {
    try {
        const { id } = req.params;
        const room = await CinemaRoom.getCinemaRoomById(id);
        if (!room) return res.status(404).json({ error: 'Cinema room not found' });
        const { 
            CinemaRoomId, Name: roomName, SeatQuantity: seats,
        } = room;
        res.status(201).json({ 
            message: 'Cinema room retrieved successfully', 
            room: {
                CinemaRoomId,
                Name: roomName,
                SeatQuantity: seats,
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const createCinemaRoom = async (req, res) => {
    try {
        const { Name, SeatQuantity } = req.body;
        const CreatedBy = req.user.UserId;
        const id = await CinemaRoom.createCinemaRoom({ 
            Name, 
            SeatQuantity,
            CreatedBy 
        });
        const newRoom = await CinemaRoom.getCinemaRoomById(id);
        const { 
            CinemaRoomId, Name: roomName, SeatQuantity: seats,
        } = newRoom;
        
        res.status(201).json({ 
            message: 'Cinema room created successfully', 
            room: {
                CinemaRoomId,
                Name: roomName,
                SeatQuantity: seats,
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateCinemaRoom = async (req, res) => {
    try {
        const { id } = req.params;
        const { Name, SeatQuantity } = req.body;
        const UpdatedBy = req.user.UserId;
        const success = await CinemaRoom.updateCinemaRoom(id, { 
            Name, 
            SeatQuantity, 
            UpdatedBy 
        });
        if (!success) return res.status(404).json({ error: 'Cinema room not found or not updated' });
        const updatedRoom = await CinemaRoom.getCinemaRoomById(id);
        const { 
            CinemaRoomId, Name: roomName, SeatQuantity: seats,
        } = updatedRoom;
        
        res.json({ message: 'Cinema room updated successfully', room: {
            CinemaRoomId,
            Name: roomName,
            SeatQuantity: seats,
        } });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteCinemaRoom = async (req, res) => {
    try {
        const { id } = req.params;
        const DeletedBy = req.user.UserId;
        const success = await CinemaRoom.deleteCinemaRoom(id, DeletedBy);
        if (!success) return res.status(404).json({ error: 'Cinema room not found or already deleted' });
        res.json({ message: 'Cinema room deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const searchCinemaRoomsByName = async (req, res) => {
    try {
        const { name } = req.query;
        console.log('Search query received:', name);
        if (!name) {
            console.log('Missing name query parameter');
            return res.status(400).json({ error: 'Missing name query parameter' });
        }
        const rooms = await CinemaRoom.searchCinemaRoomsByName(name);
        console.log('Rooms found:', rooms.length, rooms);
        if (!rooms || rooms.length === 0) {
            console.log('No cinema room found for query:', name);
            return res.status(404).json({ error: 'Cinema room not found' });
        }
        res.json({
            message: 'Cinema rooms found',
            rooms: rooms.map(room => ({
                CinemaRoomId: room.CinemaRoomId,
                Name: room.Name,
                SeatQuantity: room.SeatQuantity,
            }))
        });
    } catch (error) {
        console.error('Error in searchCinemaRoomsByName:', error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getAllCinemaRooms,
    getCinemaRoomById,
    createCinemaRoom,
    updateCinemaRoom,
    deleteCinemaRoom,
    searchCinemaRoomsByName,
};
