const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerSpecs = require("./swagger");
require("dotenv").config();
const session = require("express-session");
const passport = require("./middlewares/passport");
const cors = require("cors");
const cleanupExpiredBookings = require("./jobs/bookingCleanup");
const cleanupOldSeats = require("./jobs/seatCleanup");
const scoreHistoryRoutes = require("./routes/scorehistory");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({ secret: "your_secret", resave: false, saveUninitialized: true })
);
app.use(passport.initialize());
app.use(passport.session());
const allowedOrigins = [
  "http://localhost:5173",
  "http://cinezone.info:4458",
  "http://cinezone.info",
  "http://localhost:4458",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
app.use(express.static("public")); // Serve static files from the public directory

// Import routes
const authRoutes = require("./routes/auth");
const employeeRoutes = require("./routes/employees");
const userRoutes = require("./routes/users");
const cinemaRoomRoutes = require("./routes/cinemaRoom");
const promotionRoutes = require("./routes/promotions");
const movieRoutes = require("./routes/movies");
const seatRoutes = require("./routes/seat");
const bookingRoutes = require("./routes/booking");
const ticketRoutes = require("./routes/ticket");
const bookingSeatRoutes = require("./routes/bookingseat");
const showtimeRoutes = require("./routes/showtime");
const seatShowtimeRoutes = require("./routes/seatshowtime");
const paymentRoutes = require("./routes/payment");
const productRoutes = require("./routes/products");
const comboProductRoutes = require('./routes/comboProduct');
const orderProductDetailRoutes = require('./routes/orderProductDetail');
const orderProductRoutes = require('./routes/orderProduct');
const ratingRoutes = require('./routes/rating');

// Use routes
app.use("/api/payment", paymentRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/cinema-rooms", cinemaRoomRoutes);
app.use("/api/employee", employeeRoutes);
app.use("/api/user", userRoutes);
app.use("/api/promotions", promotionRoutes);
app.use("/api/movie", movieRoutes);
app.use('/api/seats', seatRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/booking-seats', bookingSeatRoutes);
app.use('/api/showtimes', showtimeRoutes);
app.use('/api/seatshowtimes', seatShowtimeRoutes);
app.use('/api/products', productRoutes);
app.use("/api/scorehistory", scoreHistoryRoutes);
app.use('/api/combo-products', comboProductRoutes);
app.use('/api/order-product-details', orderProductDetailRoutes);
app.use('/api/order-products', orderProductRoutes);
app.use('/api/ratings', ratingRoutes);

// Log all incoming requests for debugging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

//port
const PORT = process.env.PORT || 4458;

app.use(
  "/",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpecs, {
    customJs: "/swagger-custom.js", // Path to your custom JavaScript file
  })
);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Swagger documentation available at http://localhost:${PORT}/`);
});

setInterval(cleanupExpiredBookings, 60 * 1000); // Chạy mỗi phút
//cleanupOldSeats();
