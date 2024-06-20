    require('dotenv').config();
    const express = require('express');
    const app = express();
    const cors = require('cors');
    const connectDB = require('./config/dbConfig');
    app.use(express.json());
    app.use(cors());

    // Connect to MongoDB
    connectDB();

    // Routes
    // User related routes
    app.use('/auth', require('./routes/authRoutes'));
    app.use('/user', require('./routes/userRoutes'));
    app.use('/api/search',require('./routes/searchRoutes'))

    //society related routes
    app.use('/society',require('./routes/societyRoutes'));

    //Event related routes
    app.use('/event',require('./routes/eventRoutes'));

    // Admin related routes
    app.use('/admin',require('./routes/adminRoutes'));

    // Post routes
    app.use('/post',require('./routes/postRoutes'));




    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

