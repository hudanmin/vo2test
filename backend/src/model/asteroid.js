// @/asteroid.js
const mongoose = require("mongoose");

//{ "name": "Asteroid 3262", "minerals": 903, "position": { "x" : 9, "y": 79 }}
const AsteroidSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    minerals: {
        type: Number,
        default:800,
        required: true,
    },
    position: {
        type: Object,
        required: true,
    },
    status: {
        type: Number,
        default: 1,
        required: true
    }
});

const Asteroid = mongoose.model("Asteroid", AsteroidSchema);

module.exports = {Asteroid};