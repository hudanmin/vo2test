const mongoose = require("mongoose");
//Date	Year	Planet	Carry capacity	Travel speed	Mining speed	Position (x, y)	Status
const MinerLogSchema = new mongoose.Schema({
    minerId:{
        type: Number,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    year:{
        type:Number,
        required:true,
    },
    planetId:{
        type:Number,
        required:true
    },
    carryCapacity:{
        type:Number,
        required:true
    },
    travelSpeed:{
        type:Number,
        required:true
    },
    miningSpeed:{
        type:Number,
        required:true
    },
    position: {
        type: Object,
        required: true,
    },
    status: {
        type: String,
        required: true,
    },
});

const MinerLog = mongoose.model("MinerLog", MinerLogSchema);
module.exports = {MinerLog};