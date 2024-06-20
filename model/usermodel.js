const mongoose = require('mongoose');

// Defining user model 
const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    profileImg:{
        type: String,
        default:"https://www.shutterstock.com/shutterstock/photos/2281862025/display_1500/stock-vector-vector-flat-illustration-in-grayscale-avatar-user-profile-person-icon-gender-neutral-silhouette-2281862025.jpg"
    }
});

mongoose.model("UserModel", userSchema);