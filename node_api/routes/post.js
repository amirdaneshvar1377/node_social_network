const express = require('express');
const {createPost, getPosts, postsByUser, postById, isPoster, deletePost, updatePost, photo, singlePost, like, unlike, comment, uncomment} =  require('../controllers/post');
const {createPostValidator} = require('../validator/index');
const {userById} = require('../controllers/user');
const {requireSignin} = require('../controllers/auth');
const router = express.Router()


router.get('/posts', getPosts);

// like
router.put('/post/like', requireSignin, like);
router.put('/post/unlike', requireSignin, unlike);

// comments 
router.put('/post/comment', requireSignin, comment);
router.put('/post/uncomment', requireSignin, uncomment);


router.post('/post/new/:userId', requireSignin, createPost, createPostValidator());
router.get('/posts/by/:userId', requireSignin, postsByUser);
router.get('/post/:postId', singlePost);
router.put('/post/:postId', requireSignin, isPoster, updatePost);
router.delete('/post/:postId', requireSignin, isPoster, deletePost);

router.get('/post/photo/:postId', photo);


router.param('userId', userById);

router.param('postId', postById);

module.exports = router;
