const express = require('express');
const mongoose = require('mongoose');

const url = "mongodb://localhost:27017/employee-agreement";
const app = express();

// Connect to MongoDB
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.error('Could not connect to MongoDB:', err.message));

app.use(express.json());

// Employee Routes
const empRouter = require('./routes/emps');
app.use('/emps', empRouter);

// Start Server
app.listen(9000, () => {
    console.log('Server started on port 9000');
});
