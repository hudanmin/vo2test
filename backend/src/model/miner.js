// @/miner.js
const mongoose = require("mongoose");

//{ "id": 1, "name": "Alpha", "planetId": 1, "carryCapacity": 90, "travelSpeed": 40, "miningSpeed": 70 }
const MinerSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    planetId: {
        type: Number,
        required: true,
    },
    carryCapacity: {
        type: Number,
        required: true,
    },
    travelSpeed: {
        type: Number,
        required: true,
    },
    miningSpeed: {
        type: Number,
        required: true,
    },
    position: {
        type: Object,
        required: true,
    },
    status: {
        type: Number,
        default: 0
    }
});

const Miner = mongoose.model("Miner", MinerSchema);

module.exports = {Miner};