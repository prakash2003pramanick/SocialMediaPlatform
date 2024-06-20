const mongoose = require('mongoose');
const multer = require("multer");
const convertUTCtoIST  = require('../../utils/date');
require('../../models/User');
require('../../models/Post');
const Post = mongoose.model('Post');
const User = mongoose.model('user');
const upload = require('../../utils/fileUpload');

const createPost = async (req, res) => {
    upload.single("image")(req, res, async function (err) {
        if (err instanceof multer.MulterError) {
            return res.status(400).send({ status: 'ERROR', message: err.message });
        } else if (err) {
            return res.status(400).send({ status: 'ERROR', message: err.message });
        }

        const { text, tags } = req.body;

        console.log(new Date());
        console.log(convertUTCtoIST(new Date()))

        try {
            let imageUrl = null;
            if (req.file) {
                imageUrl = req.file.filename;
            }

            if (imageUrl != null || text !== '') {
                const post = await Post.create({
                    user: {
                        access : req.user.access,
                        email : req.user.email,
                        userId : req.user.id
                    },
                    text,
                    image: imageUrl,
                    tags
                });
                res.send({ status: "OK", message: "Post created successfully", data: post });
            } else {
                res.send({ status: "ERROR", message: "Image and caption cannot be empty" });
            }
        } catch (error) {
            console.error("Error:", error);
            res.send({ status: "ERROR", message: error.message });
        }
    });
};

const editPost = async (req, res) => {
    try {
        const { postId, newData } = req.body;

        if (!postId || !newData) {
            return res.status(400).send({ status: "ERROR", message: "postId and newData are required" });
        }

        // Prepare the update object, excluding createdAt if present
        const updateData = { ...newData };
        delete updateData.createdAt;  // Ensure createdAt is not updated
        delete updateData.user;

        // Manually set updatedAt to IST
        console.log(new Date())
        console.log(convertUTCtoIST(new Date()))
        updateData.updatedAt = convertUTCtoIST(new Date());

        // Use $set to update fields
        const updateQuery = { $set: updateData };

        console.log(updateQuery)

        const updatedPost = await Post.findOneAndUpdate(
            { _id: postId, 'user.userId': req.user.id },
            updateQuery,
            { new: true, runValidators: true } // Enable validation on update
        );

        if (!updatedPost) {
            return res.status(404).send({ status: "ERROR", message: "Post not found" });
        }

        res.send({ status: "OK", message: "Post updated successfully", data: updatedPost });
        console.log("Post edited successfully " + postId);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send({ status: "ERROR", message: "Internal Server Error" });
    }
};

const deletePost = async (req, res) => {
    try {
        const postId = req.params.postId;

        if (!postId) {
            return res.status(400).send({ status: "ERROR", message: "postId is required" });
        }

        const deletedPost = await Post.findByIdAndDelete(postId);

        if (!deletedPost) {
            return res.status(404).send({ status: "ERROR", message: "Post not found" });
        }

        res.send({ status: "OK", message: "Post deleted successfully" });
        console.log("Post deleted : " + postId);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send({ status: "ERROR", message: "Internal Server Error" });
    }
};

const getAllPosts = async (req, res) => {
    try {
        const email = req.user.email;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ status: "ERROR", message: "User not found" });
        }

        const posts = await Post.find({ userId: email });

        res.status(200).json({ status: "OK", data: posts });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ status: "ERROR", message: "Internal Server Error" });
    }
};

const searchPostsByTag = async (req, res) => {
    const { keyword } = req.body;

    try {
        const regexPattern = new RegExp('\\b' + keyword + '\\b', 'i');

        const posts = await Post.find({ tags: { $regex: regexPattern } });

        if (posts.length === 0) {
            return res.send({ status: "ERROR", message: "No posts found with the specified tag" });
        }

        res.send({ status: "OK", message: "Posts found successfully", data: posts });
    } catch (error) {
        console.error("Error:", error);
        res.send({ status: "ERROR", message: error.message });
    }
};

module.exports = {
    createPost,
    editPost,
    deletePost,
    getAllPosts,
    searchPostsByTag
};
