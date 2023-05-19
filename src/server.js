const express = require("express");
const app = express();
const { userRouter } = require("./routes/userRoute");
const { blogRouter } = require("./routes/blogRoute");
const mongoose = require("mongoose");
const { generateFakeData } = require("../faker2");

const server = async () => {
    try {
        const { MONGO_URI, PORT } = process.env;
        if (!MONGO_URI) {
            throw new Error("MONGO_URI is required!!");
        }
        if (!PORT) {
            throw new Error("PORT is required!!");
        }

        await mongoose.connect(MONGO_URI);
        console.log("MongoDB connected");

        // mongoose.set("debug", true);
        // await generateFakeData(1000000, 10, 300);

        app.use(express.json());

        app.use("/user", userRouter);
        app.use("/blog", blogRouter);

        app.listen(PORT, async () => {
            console.log(`server listening on port ${PORT}`);
            // console.time("insert time: ");
            // await generateFakeData(10, 2, 10);
            // console.timeEnd("insert time: ");
        });
    } catch (err) {
        console.log(err);
    }
};

server();
