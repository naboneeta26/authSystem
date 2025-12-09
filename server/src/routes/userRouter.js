const express = require('express');
const getUserProfile = require('../controllers/userController');
const userAuth = require('../middlewares/userAuth');

const userRouter = express.Router();

//Route to get user profile
userRouter.get('/profile', userAuth, getUserProfile);

module.exports = userRouter;