const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerSpecs = require("./swagger");
require("dotenv").config();
const session = require("express-session");
const passport = require("./middlewares/passport");
const cors = require("cors");

//rest object
const app = express();

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({ secret: "your_secret", resave: false, saveUninitialized: true })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(cors());
app.use(express.static('public')); // Serve static files from the public directory

// Import routes
const authRoutes = require("./routes/auth");
const employeeRoutes = require("./routes/employees");
const userRoutes = require("./routes/users");
const cinemaRoomRoutes = require("./routes/cinemaRoom");
const promotionRoutes = require("./routes/promotions");

// Use routes
app.use("/api/auth", authRoutes);
app.use("/api/cinema-rooms", cinemaRoomRoutes);
app.use("/api/employee", employeeRoutes);
app.use("/api/user", userRoutes);
app.use("/api/promotions", promotionRoutes);

// Swagger UI
app.use(
  "/",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpecs, {
    customJs: '/swagger-custom.js', // Path to your custom JavaScript file
  })
);

//port
const PORT = process.env.PORT || 8080;

//listen
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Swagger documentation available at http://localhost:${PORT}/`);
});
