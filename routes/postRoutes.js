const express = require('express');
const router = express.Router();
const postController = require('../controllers/post/postController');
const { verifyToken } = require('../middleware/verifyToken');
const upload = require('../utils/fileUpload');



router.post("/create-post", verifyToken, postController.createPost); //tested - test for image pending
router.post("/edit-post", verifyToken, postController.editPost); // testing
router.delete("/delete-post/:postId", verifyToken, postController.deletePost);
router.get("/getAll-posts", verifyToken, postController.getAllPosts);
router.post("/search-posts-by-tag", verifyToken, postController.searchPostsByTag);

module.exports = router;
