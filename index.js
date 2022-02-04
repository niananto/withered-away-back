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

let registration = {};
router.post("/registration/:page", async function (req, res) {
    if (req.params.page == 1) {
        registration.name = req.body.firstName + " " + req.body.lastName; // any string
        registration.sex = req.body.sex; // male, female
        registration.dateOfBirth = req.body.dateOfBirth; // DD-MON-YYYY
    } else if (req.params.page == 2) {
        registration.contactName = req.body.contactName;
        registration.contactPhoneNo = req.body.contactPhoneNo;
        registration.contactRelationship = req.body.contactRelationship;
        registration.contactAddress = req.body.contactAddress;
    } else if (req.params.page == 3) {
        registration.diseases = req.body.diseases; // list of diseases
        registration.medicines = req.body.medicines; // list of medicines
        registration.height = req.body.height;
        registration.weight = req.body.weight;
        registration.bloodGroup = req.body.bloodGroup;
        registration.vaccines = req.body.vaccines; // list of vaccines
        registration.dissabilities = req.body.dissabilities; // list
        registration.allergies = req.body.allergies;
        registration.healthCondition = req.body.healthCondition;
    } else if (req.params.page == 4) {
        registration.songs = req.body.songs; // list
        registration.movies = req.body.movies; // list
        registration.games = req.body.games; // list
    } else if (req.params.page == 5) {
        registration.bankAccountNo = req.body.bankAccountNo;
        registration.balance = req.body.balance;
        registration.membershipId = req.body.membershipId;
    }

    return res.status(200).json({
        success: "true",
        registration,
    });
});

//// server ====================================

app.use(router);

const PORT = process.env.PORT || 8080;

app.listen(PORT, function () {
    console.log(`server started at port ${PORT}`);
});
