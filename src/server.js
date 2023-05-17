const express = require("express");
const app = express();
const { userRouter } = require("./routes/userRoute");
const { blogRouter } = require("./routes/blogRoute");
const mongoose = require("mongoose");
const { generateFakeData } = require("../faker2");

const MONGO_URI =
    "mongodb+srv://shinkwang:OYdTCc0CjXj47gjm@mongodbtutorial.qboq1cz.mongodb.net/blogService?retryWrites=true&w=majority";

const server = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("MongoDB connected");

        // mongoose.set("debug", true);
        // await generateFakeData(1000000, 10, 300);

        app.use(express.json());

        app.use("/user", userRouter);
        app.use("/blog", blogRouter);

        app.listen(3000, async () => {
            console.log("server listening on port 3000 123");
            console.time("insert time: ");
            // await generateFakeData(10, 2, 10);
            console.timeEnd("insert time: ");
        });
    } catch (err) {
        console.log(err);
    }
};

server();
