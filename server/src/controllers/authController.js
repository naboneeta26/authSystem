const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userModel = require("../models/users");
const transporter = require("../config/nodemailer");

//register controller
const register = async (req, res) => {
  const { name, email, password } = req.body;

  //checking for missing fields
  if (!name || !email || !password) {
    return res.json({
      success: false,
      message: "Please fill the missing details!",
    });
  }

  try {
    // Check if user already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.json({ success: false, message: "User already exists!" });
    }

    //hasing password
    const hashedPassword = await bcrypt.hash(password, 10);

    //creating new user
    const newUser = new userModel({ name, email, password: hashedPassword });
    await newUser.save();

    //generating token
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    });

    //sending welcome email
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Welcome to Auth System",
      text: ` Hello ${name}, Welcome to our Auth system! Your account has been successfully created with the email: ${email}. We are excited to have you on board! `,
    };
    await transporter.sendMail(mailOptions);

    return res.json({
      success: true,
      message: "User registered successfully!",
    });
  } catch (err) {
    return res.json({ success: false, message: err.message });
  }
};

//login controller
const login = async (req, res) => {
  const { email, password } = req.body;

  //checking the missing fields
  if (!email || !password) {
    return res.json({
      success: false,
      message: "Email and password are required!",
    });
  }

  try {
    const user = await userModel.findOne({ email });

    //checking if user exists
    if (!user) {
      return res.json({ success: false, message: "Invalid email!" });
    }

    //checking password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Invalid password!" });
    }

    //generating token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    });

    return res.json({ success: true, message: "User logged in successfully!" });
  } catch (err) {
    return res.json({ success: false, message: err.message });
  }
};

//logout controller
const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });

    return res.json({ success: true, message: "User Logged out!" });
  } catch (err) {
    return res.json({ success: false, message: err.message });
  }
};

//sending verify otp controller
const sendVerifyOtp = async (req, res) => {
  const userId = req.userId;

  try {
    const user = await userModel.findById(userId);
    if (user.isAccountVerified) {
      return res.json({ success: false, message: "Account already verified!" });
    }

    //generating 6 digit random otp
    const otp = String(Math.floor(100000 + Math.random() * 900000));
    user.verifyOtp = otp;
    user.verifyOtpExpiresAt = Date.now() + 10 * 60 * 1000; //otp valid for 10 mins

    await user.save();

    //sending otp to email
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Account Verification Otp",
      text: ` Hello ${user.name}, Your account verification OTP is: ${otp}. The OTP is valid for 10 minutes. `,
    };
    await transporter.sendMail(mailOptions);

    return res.json({ success: true, message: "Otp sent to your email!" });
  } catch (err) {
    return res.json({ success: false, message: err.message });
  }
};

//verify account controller
const verifyAccount = async (req, res) => {
  const { otp } = req.body;
  const userId = req.userId;

  if (!userId || !otp) {
    return res.json({
      success: false,
      message: "User ID and OTP are required!",
    });
  }

  try {
    const user = await userModel.findById(userId);

    if (!user) {
      return res.json({ success: false, message: "User not found!" });
    }

    if (user.verifyOtp === "" || user.verifyOtp !== otp) {
      return res.json({ success: false, message: "Invalid Otp!" });
    }

    if (user.verifyOtpExpiresAt < Date.now()) {
      return res.json({ success: false, message: " Otp expired!" });
    }

    user.isAccountVerified = true;
    user.verifyOtp = "";
    user.verifyOtpExpiresAt = 0;

    await user.save();

    return res.json({
      success: true,
      message: "Account verified successfully!",
    });
  } catch (err) {
    return res.json({ success: false, message: err.message });
  }
};

//controller to check if user is authenticated
const isAuthenticated = (req, res) => {
  try {
    return res.json({ success: true, message: "User is authenticated!" });
  } catch (err) {
    return res.json({ success: false, message: err.message });
  }
};

//send password reset otp controller
const sendPasswordResetOtp = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.json({ success: false, message: "Email is required!" });
  }

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User not found!" });
    }

    //generating 6 digit otp when user is found
    const otp = String(Math.floor(100000 + Math.random() * 900000));
    user.resetOtp = otp;
    user.resetOtpExpiresAt = Date.now() + 10 * 60 * 1000; //otp valid for 10 mins

    await user.save();

    //sending otp to email
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Password Reset OTP",
      text: ` Hello ${user.name}, Your password reset OTP is: ${otp}. The OTP is valid for 10 minutes. `,
    };
    await transporter.sendMail(mailOptions);

    return res.json({ success: true, message: "Otp sent to your email!" });
  } catch (err) {
    return res.json({ success: false, message: err.message });
  }
};

//verify otp and reset password controller
const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    return res.json({
      success: false,
      message: "Email, Otp and new password are required!",
    });
  }

  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "User not found!" });
    }

    if (user.resetOtp === "" || user.resetOtp !== otp) {
      return res.json({ success: false, message: "Invalid Otp!" });
    }

    if (user.resetOtpExpiresAt < Date.now()) {
      return res.json({ success: false, message: "Otp expired!" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    user.resetOtp = "";
    user.resetOtpExpiresAt = 0;

    await user.save();

    return res.json({ success: true, message: "Password reset successfully!" });
  } catch (err) {
    return res.json({ success: false, message: err.message });
  }
};

module.exports = {
  register,
  login,
  logout,
  sendVerifyOtp,
  verifyAccount,
  isAuthenticated,
  sendPasswordResetOtp,
  resetPassword,
};
