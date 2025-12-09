const express = require('express');
const { register, login, logout, sendVerifyOtp, verifyAccount, isAuthenticated, sendPasswordResetOtp, resetPassword } = require('../controllers/authController');
const userAuth = require('../middlewares/userAuth');

const authRouter = express.Router();

//Register route
authRouter.post('/register', register);

//login route
authRouter.post('/login', login);

//logout route
authRouter.post('/logout', logout);

//sending verification otp route
authRouter.post('/send-verify-otp', userAuth, sendVerifyOtp);

//verify account using otp route
authRouter.post('/verify-account', userAuth, verifyAccount);

//isAuthenticated route to check if user is authenticated
authRouter.post('/is-auth', userAuth, isAuthenticated);

//route to send password reset otp
authRouter.post('/send-password-reset-otp', sendPasswordResetOtp);

//reset password route
authRouter.post('/reset-password', resetPassword);

module.exports = authRouter;