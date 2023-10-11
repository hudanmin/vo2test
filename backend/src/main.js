const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors');

const {Asteroid} = require("./model/asteroid.js");
const {Planet} = require("./model/planet.js")
const {Miner} = require("./model/miner.js")
const {MinerLog} = require("./model/minerLog.js")
const {now} = require("mongoose");

const app = express();
app.use(cors());

app.use(express.urlencoded({extended: true}))
//app.use(bodyParser.urlencoded({extended:true}));

const MINER_STATUS_IDLE = 0;
const MINER_STATUS_TRAVELLING = 1;
const MINER_STATUS_MINING = 2;
const MINER_STATUS_TRANSFERRING = 3;

app.use(express.json());

app.get("/", async (req, res) => {
    return res.json({message: "Hello, World"});
});

app.get("/planets", async (req, res) => {
    const allPlanets = await Planet.find();
    return res.status(200).json(allPlanets);
});

app.get("/planets/:id", async (req, res) => {
    const {id} = req.params;
    const planet = await Planet.findOne({id: id});
    return res.status(200).json(planet);
});

app.get("/miners", async (req, res) => {
    const allMiners = await Miner.find();
    return res.status(200).json(allMiners);
});

app.get("/miners?planetId=:planetId", async (req, res) => {
    const {planetId} = req.params;
    const planetMiners = await Miner.find({planetId: planetId});
    return res.status(200).json(planetMiners);
});

app.get("/miners/:minerId", async (req, res) => {
    const {minerId} = req.params;
    console.log(minerId);
    const planetMiners = await Miner.findOne({id: minerId});
    return res.status(200).json(planetMiners);
});

app.post("/miners", async (req, res) => {
    let planetName = req.body.planet;
    //db.miners.find().sort({id:-1}).limit(1)
    let maxMiner = await Miner.find({}).sort({id: -1}).limit(1);
    let maxId = maxMiner[0].id;
    req.body.id = ++maxId;
    const planet = await Planet.findOne({name: planetName});
    if (Boolean(planet)) {
        req.body.planetId = planet.id;
        req.body.position = planet.position;
    } else {
        console.log("Cannot find the planet name:" + planetName);
        return res.status(500);
    }
    console.log("planet: " + JSON.stringify(planet.toObject()) + "planetId:" + planet.id);

    const newMiner = new Miner({...req.body});
    const insertedMiner = await newMiner.save();
    return res.status(201).json(insertedMiner);
});

app.put("/miners/:minerId",async (req,res)=>{
    const {minerId} = req.params;
    // console.log("minerId:" + minerId);
    // console.log("req:" + JSON.stringify(req.body));
    const doc = await Miner.findOneAndUpdate(
        { id: minerId },
        { $set: req.body },
        { upsert: true}
    );
    return res.status(201).json(doc);
});

//miner change log
// Date	Year	Planet	Carry capacity	Travel speed	Mining speed	Position (x, y)	Status
// 2021/05/26 15:26:23	250	Planet 1	0/120	60	20	832, 635	Transferring done
app.post("/minerlogs", async (req, res) => {
    const newMinerLog = new MinerLog({...req.body});
    const insertedLog = await newMinerLog.save();
    return res.status(201).json(insertedLog);
});

//miner being in traveling
app.put("/miners/:minerId/travel",async (req,res)=>{
    const {minerId} = req.params;
    const travelingYear = 1;//hard code for simulation

    const miner = await Miner.findOne({id:minerId});
    req.body.status = MINER_STATUS_TRAVELLING;
    let newPosition = {
        "x": Boolean(miner.position) ? miner.position.x + travelingYear * miner.travelSpeed : 0,
        "y": Boolean(miner.position) ? miner.position.y + travelingYear * miner.travelSpeed : 0
    };
    req.body.position = newPosition;

    console.log("req:" + JSON.stringify(req.body));
    const doc = await Miner.findOneAndUpdate(
        { id: minerId },
        { $set: {"status":MINER_STATUS_TRAVELLING,"position":newPosition} },
        { upsert: true}
    );

    //insert miner activity log
    let originalPos = 0;
    const logInfo = {
        "minerId":minerId,
        "date": now(),
        "year": travelingYear,
        "planetId": miner.planetId,
        "carryCapacity": 0,
        "travelSpeed": miner.travelSpeed,
        "miningSpeed": miner.miningSpeed,
        "position": newPosition,
        "status": "Traveling to asteroid",
    };
    const minerLog = new MinerLog(logInfo);
    const insertedLog = await minerLog.save();
    console.log(insertedLog);
    return res.status(201).json(doc);
});

//miner start mining
app.put("/miners/:minerId/mining/:asteroidName",async (req,res)=>{
    const {minerId, asteroidName} = req.params;
    const asteroidNameStr = asteroidName.replace("_", " ");
    const miningYear = 1; //hard code for simulation
    const asteroid = await Asteroid.findOne({name:asteroidNameStr});
    console.log("asteroid:"+ asteroid);

    const miner = await Miner.findOne({id:minerId});
    const newPosition = asteroid.position;

    const doc = await Miner.findOneAndUpdate(
        { id: minerId },
        { $set: {"status":MINER_STATUS_MINING,"position":newPosition} },
        { upsert: true}
    );

    //insert miner activity log
    const logInfo = {
        "minerId":minerId,
        "date": now(),
        "year": miningYear,
        "planetId": miner.planetId,
        "carryCapacity": miningYear * miner.miningSpeed,
        "travelSpeed": miner.travelSpeed,
        "miningSpeed": miner.miningSpeed,
        "position": newPosition,
        "status": "Mining asteroid " + asteroidName,
    };
    const minerLog = new MinerLog(logInfo);
    const insertedLog = await minerLog.save();

    return res.status(201).json(doc);
});

app.delete("/miners/:minerId",async (req,res)=>{

});

app.get("/asteroids", async (req, res) => {
    const allAsteroid = await Asteroid.find();
    return res.status(200).json(allAsteroid);
});

const start = async () => {
    try {
        await mongoose.connect(
            "mongodb://127.0.0.1:27017/vo2test?directConnection=true&serverSelectionTimeoutMS=2000",
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useFindAndModify: false
            }
        );
        app.listen(3000, () => console.log("Server started on port 3000"));
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

start();