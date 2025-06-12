const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./swagger');
require('dotenv').config();

//rest object
const app = express();

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

//routes
app.get('/', (req, res) => {
    res.status(200).send({ message: 'Welcome to the Movie Theater API' });
});

// Import routes
const authRoutes = require('./routes/auth');
const employeeRoutes = require('./routes/employees');
const userRoutes = require('./routes/users');
const movieRoutes = require('./routes/movies');
const seatRoutes = require('./routes/seat');
const bookingRoutes = require('./routes/booking');
const ticketRoutes = require('./routes/ticket');
const bookingSeatRoutes = require('./routes/bookingseat');
// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/employee', employeeRoutes);
app.use('/api/user', userRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/seats', seatRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/booking-seats', bookingSeatRoutes);

//port 
const PORT = process.env.PORT || 8080;

//listen
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Swagger documentation available at http://localhost:${PORT}/api-docs`);
});



