const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const userRoutes = require('./routes/userRoutes');
const employeeRoutes = require('./routes/employeeRoutes');

const app = express();


app.use(express.json());
app.use(cors());

app.use('/api/v1/user', userRoutes);
app.use('/api/v1/emp', employeeRoutes);

mongoose.connect("mongodb+srv://warden_winsart:AzwZnMyet2kCgRzX@cluster1.usct8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1", {
})
    .then(() => console.log('MongoDB Connected'))
    .catch((err) => console.log(err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
