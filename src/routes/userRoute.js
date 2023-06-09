const { Router } = require("express");
const userRouter = Router();
const mongoose = require("mongoose");
const { User, Blog, Comment } = require("../models");

userRouter.get("/", async (req, res) => {
    try {
        const users = await User.find({});
        return res.send({ users });
    } catch (err) {
        console.log(err);
        return res.status(500).send({ err: err.message });
    }
});

userRouter.get("/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        if (!mongoose.isValidObjectId(userId))
            return res.status(400).send({ err: "Invalid userId" });
        const user = await User.findOne({ _id: userId });
        return res.send({ user });
    } catch (err) {
        return res.status(500).send({ err: err.message });
    }
});

userRouter.post("/", async (req, res) => {
    try {
        let { username, name } = req.body;
        if (!username)
            return res.status(400).send({ err: "username is required " });
        if (!name || !name.first || !name.last)
            return res
                .status(400)
                .send({ err: "Both first and last names are required" });

        const user = new User(req.body);
        await user.save();
        return res.send({ user });
    } catch (err) {
        console.log(err);
        return res.status(500).send({ err: err.message });
    }
});

userRouter.delete("/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        if (!mongoose.isValidObjectId(userId))
            return res.status(400).send({ err: "Invalid userId" });

        const [user] = await Promise.all([
            User.findOneAndDelete({ _id: userId }),
            Blog.deleteMany({ "user._id": userId }),
            Blog.updateMany(
                { "comments.user": userId },
                { $pull: { comments: { user: userId } } },
            ),
            Comment.deleteMany({ user: userId }),
        ]);

        return res.send({ user });
    } catch (err) {
        console.log(err);
        return res.status(500).send({ err: err.message });
    }
});

userRouter.put("/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        if (!mongoose.isValidObjectId(userId))
            return res.status(400).send({ err: "Invalid userId" });
        const { age, name } = req.body;
        if (!age && !name)
            return res.status(400).send({ err: "age or name is required" });
        if (age && typeof age !== "number")
            return res.status(400).send({ err: "age must be number" });
        if (
            name &&
            typeof name.first !== "string" &&
            typeof name.last !== "string"
        ) {
            return res
                .status(400)
                .send({ err: "first and last name are strings" });
        }

        const [user] = await Promise.all([
            User.findByIdAndUpdate(userId, { age, name }, { new: true }),
            Blog.updateMany({ "user._id": userId }, { "user.name": name }),
            Blog.updateMany(
                {},
                {
                    "comments.$[comment].userFullName": `${name.first} ${name.last}`,
                },
                { arrayFilters: [{ "comment.user": userId }] },
            ),
        ]);

        // const user = await User.findByIdAndUpdate(
        //     userId,
        //     { age, name },
        //     { new: true },
        // );

        // await Blog.updateMany({ "user._id": userId }, { "user.name": name });

        // let user = await User.findById(userId);
        // if (age) user.age = age;
        // if (name) {
        //     user.name = name;
        //     await Blog.updateMany(
        //         { "user._id": userId },
        //         { "user.name": name },
        //     );
        // }
        // await user.save();
        return res.send({ user });
    } catch (err) {
        console.log(err);
        return res.status(500).send({ err: err.message });
    }
});

module.exports = {
    userRouter,
};
