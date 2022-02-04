const express = require("express");
const res = require("express/lib/response");
const router = require("express-promise-router")();
require("dotenv").config();

const app = express();
app.use(express.json());

const queries = require("./queries.js");

/// express ===================================

router.get("/:id", async function (req, res) {
    const personId = req.params.id;
    return res.status(200).json(await queries.getPerson(personId));
});

router.get("/all/:tableName", async function (req, res) {
    const tableName = req.params.tableName;
    console.log(req.params);
    return res.status(200).json(await queries.getAll(tableName));
});

let reg = {};
router.post("/registration/:page", async function (req, res) {
    if (req.params.page == 1) {
        reg.name = req.body.firstName + " " + req.body.lastName; // any string
        reg.gender = req.body.gender; // male, female
        reg.birthday = req.body.birthday; // DD-MON-YYYY
    } else if (req.params.page == 2) {
        reg.contactName = req.body.contactName;
        reg.contactPhoneNo = req.body.contactPhoneNo;
        reg.contactRelationship = req.body.contactRelationship;
        reg.contactAddress = req.body.contactAddress;

        // return res.status(200).json(await queries.createUser(reg));
    } else if (req.params.page == 3) {
        reg.diseases = req.body.diseases; // list of diseases
        reg.medicines = req.body.medicines; // list of medicines
        reg.height = req.body.height;
        reg.weight = req.body.weight;
        reg.bloodGroup = req.body.bloodGroup;
        reg.vaccines = req.body.vaccines; // list of vaccines
        reg.dissabilities = req.body.dissabilities; // list
        reg.allergies = req.body.allergies;
        reg.healthCondition = req.body.healthCondition;
    } else if (req.params.page == 4) {
        reg.songs = req.body.songs; // list
        reg.movies = req.body.movies; // list
        reg.games = req.body.games; // list
    } else if (req.params.page == 5) {
        reg.bankAccountNo = req.body.bankAccountNo;
        reg.balance = req.body.balance;
        reg.membershipId = req.body.membershipId;

        // insert query
        return res.status(200).json(await queries.createUser(reg));
    }

    return res.status(200).json({
        success: "true",
        registration: reg,
    });
});

//// server ====================================

app.use(router);

const PORT = process.env.PORT || 8080;

app.listen(PORT, function () {
    console.log(`server started at port ${PORT}`);
});
