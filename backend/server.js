const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./swagger');
require('dotenv').config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

app.get('/Test', (req, res) => {
    res.status(200).send({ message: 'Welcome to the Movie Theater API' });
});

const authRoutes = require('./routes/auth');
const employeeRoutes = require('./routes/employees');
const userRoutes = require('./routes/users');
const movieRoutes = require('./routes/movies');

app.use('/api/auth', authRoutes);
app.use('/api/employee', employeeRoutes);
app.use('/api/movie', movieRoutes);
app.use('/api/user', userRoutes);

const PORT = process.env.PORT || 4458;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Swagger documentation available at http://localhost:${PORT}/api-docs`);
});



