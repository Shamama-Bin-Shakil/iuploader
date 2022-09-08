const mongoose = require("mongoose");

const schema = mongoose.Schema({
    user: {
        type: String,
        require: true,
    },
    name: {
        type: String,
        require: true,
    },
    email: {
        type: String,
        require: true,
    },
    image: {
        type: String,
        require: true,
    },
    profileimage: {
        type: String,
        require: true,
    }
});

const Image = mongoose.model("image", schema);

module.exports = Image;