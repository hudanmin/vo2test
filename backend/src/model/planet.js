// @/planet.js
const mongoose = require("mongoose");

const PlanetSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    position: {
        type: Object,
        required: true,
    },
});
const Planet = mongoose.model("Planet", PlanetSchema);

module.exports = {Planet};