const express = require('express');
const router = express.Router();
const authenticateUser = require('../middlewares/authMiddleware');


// USER route
const userController = require('../Controllers/user.controller');
router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);


//POST route
const postController = require('../Controllers/post.controller');
router.post('/createPost', authenticateUser, postController.createPost);
router.put('/editPost/:id', authenticateUser, postController.editPost);
router.delete('/deletePost/:id', authenticateUser, postController.deletePost);


//SEARCH route
const searchController = require('../Controllers/search.controller');
router.get('/searchPostsByTags', authenticateUser, searchController.searchPostsByTags);
router.get('/searchPostsByDateRange', authenticateUser, searchController.searchPostsByDateRange);
router.get('/searchAllUserPosts', authenticateUser, searchController.searchAllUserPosts);


module.exports = router;
