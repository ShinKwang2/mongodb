const express = require('express');
const app = express();
const { userRouter } = require('./routes/userRoute')
const mongoose = require('mongoose');

const MONGO_URI = 'mongodb+srv://shinkwang:1GFEl72mewYYuOzU@mongodbtutorial.qboq1cz.mongodb.net/blogService?retryWrites=true&w=majority'

const server = async() => {
    try {
        await mongoose.connect(MONGO_URI);
        mongoose.set('debug', true);
        console.log('MongoDB connected');
        app.use(express.json());

        app.use("/user", userRouter);

        
        app.listen(3000, async () => console.log('server listening on port 3000 123'))

    } catch {
        console.log(err);
    }
}

server();

