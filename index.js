const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Import Routes
const userRoutes = require('./routes/userRoutes');
const employeeRoutes = require('./routes/employeeRoutes');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes Middleware
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/emp', employeeRoutes);

// MongoDB Connection
mongoose.connect("mongodb+srv://warden_winsart:AzwZnMyet2kCgRzX@cluster1.usct8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1", {
})
    .then(() => console.log('MongoDB Connected'))
    .catch((err) => console.log(err));

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
