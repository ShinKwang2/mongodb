const { Router } = require("express");
const blogRouter = Router();
const { Blog } = require("../models/Blog");
const { User } = require("../models/User");
const { isValidObjectId } = require("mongoose");

blogRouter.post("/", async (req, res) => {
    try {
        const { title, content, islive, userId } = req.body;
        if (typeof title !== "string") {
            res.status(400).send({ err: "title is required" });
        }
        if (typeof content !== "string") {
            res.status(400).send({ err: "content is required" });
        }
        if (islive && typeof islive !== "boolean") {
            res.status(400).send({ err: "islive must be a boolean" });
        }
        if (!isValidObjectId(userId)) {
            res.status(400).send({ err: "userId is invalid" });
        }

        let user = await User.findById(userId);
        if (!user) res.status(400).send({ err: "user does not exist" });

        let blog = new Blog({ ...req.body, user });
        await blog.save();
        return res.send({ blog });
    } catch (err) {
        console.log(err);
        res.status(500).send({ err: err.message });
    }
});

blogRouter.get("/", async (req, res) => {
    try {
        const blogs = await Blog.find();
        return res.send({ blogs });
    } catch (err) {
        console.log(err);
        res.status(500).send({ err: err.message });
    }
});

blogRouter.get("/:blogId", async (req, res) => {
    try {
        const { blogId } = req.params;
        if (!isValidObjectId(blogId)) {
            return res.status(400).send({ err: "blogId is invalid" });
        }

        const blog = await Blog.findOne({ _id: blogId });
        return res.send({ blog });
    } catch (err) {
        console.log(err);
        res.status(500).send({ err: err.message });
    }
});

blogRouter.put("/:blogId", async (req, res) => {
    try {
        const { blogId } = req.params;
        if (!isValidObjectId(blogId)) {
            return res.status(400).send({ err: "blogId is invalid" });
        }
        const { title, content } = req.body;
        if (typeof title !== "string") {
            res.status(400).send({ err: "title is required" });
        }
        if (typeof content !== "string") {
            res.status(400).send({ err: "content is required" });
        }

        const blog = await Blog.findOneAndUpdate(
            { _id: blogId },
            { title, content },
            { new: true },
        );
        return res.send({ blog });
    } catch (err) {
        console.log(err);
        res.status(500).send({ err: err.message });
    }
});

blogRouter.patch("/:blogId/live", async (req, res) => {
    try {
        const { blogId } = req.params;
        if (!isValidObjectId(blogId)) {
            res.status(400).send({ err: "blogId is invalid" });
        }

        const { isLive } = req.body;
        if (typeof isLive !== "boolean") {
            res.status(400).send({ err: "boolean islive is required" });
        }

        const blog = await Blog.findByIdAndUpdate(
            blogId,
            { isLive },
            { new: true },
        );
        return res.send({ blog });
    } catch (err) {
        console.log(err);
        res.status(500).send({ err: err.message });
    }
});

module.exports = { blogRouter };
