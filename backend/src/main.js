const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors');

const {Asteroid} = require("./model/asteroid.js");
const {Planet} = require("./model/planet.js")
const {Miner} = require("./model/miner.js")

const app = express();
app.use(cors());

app.use(express.urlencoded({extended: true}))
//app.use(bodyParser.urlencoded({extended:true}));

const MINER_STATUS_IDLE = 0;
const MINER_STATUS_TRAVELLING = 1;
const MINER_STATUS_MINING = 2;
const MINER_STATUS_TRANSFERRING = 3;

app.get("/", async (req, res) => {
    return res.json({message: "Hello, World"});
});

app.use(express.json());

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

app.get("/miners?:minerId", async (req, res) => {
    const {minerId} = req.params;
    const planetMiners = await Miner.find({id: minerId});
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

//miner in traveling
app.put("/miners/:minerId/travel",async (req,res)=>{
    const {minerId} = req.params;
    // console.log("minerId:" + minerId);
    // console.log("req:" + JSON.stringify(req.body));
    req.body.status = MINER_STATUS_TRAVELLING;
    req.body.position = null;//TODO: need to calculate the offset via travelSpeed

    console.log("req:" + JSON.stringify(req.body));
    const doc = await Miner.findOneAndUpdate(
        { id: minerId },
        { $set: {"status":MINER_STATUS_TRAVELLING,"position":{}} },
        { upsert: true}
    );
    return res.status(201).json(doc);
});

//miner start mining
app.put("/miners/:minerId/mining/:asteroidName",async (req,res)=>{
    const {minerId} = req.params;
    // console.log("minerId:" + minerId);
    // console.log("req:" + JSON.stringify(req.body));
    req.body.status = MINER_STATUS_TRAVELLING;
    req.body.position = null;//TODO: need to calculate the offset via travelSpeed

    console.log("req:" + JSON.stringify(req.body));
    const doc = await Miner.findOneAndUpdate(
        { id: minerId },
        { $set: {"status":MINER_STATUS_TRAVELLING,"position":{}} },
        { upsert: true}
    );
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