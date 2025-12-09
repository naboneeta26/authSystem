const mongoose = require('mongoose');

const connectDB = async () => {
    await mongoose.connect(`${process.env.MONGODB_URI}/authSystem`);
};

module.exports = connectDB;