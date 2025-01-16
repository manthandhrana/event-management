const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const app = express();
const connectDB = require('./db/database');
const userRoutes = require('./routes/userRoutes');
const errorHandler = require('./middleware/errorHandler');
require('dotenv').config();

const PORT = process.env.PORT;
const forntendCorsUrl = process.env.FRONTEND_URL;

app.use(express.json())

dotenv.config();
connectDB();

app.use(cors({
  origin:*, // Allow all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allow all HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Add any other headers as needed
}));

app.get(("/"),(req,res) => {
    res.send("Welcome to Event Management");
});

app.use(express.json());
app.use('/api/users', userRoutes);
app.use(errorHandler);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
