require("dotenv").config();

const express = require("express");
const res = require("express/lib/response");
const router = require("express-promise-router")();
const bcrypt = require("bcrypt");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const app = express();
app.use(express.json());
app.use(cors());

const getQueries = require("./queries/getQueries.js");
const postQueries = require("./queries/postQueries.js");
const patchQueries = require("./queries/patchQueries.js");
const deleteQueries = require("./queries/deleteQueries.js");

/// express ===================================

router.get("/api/:tableName/:id", async function (req, res) {
    const id = req.params.id;
    const tableName = req.params.tableName;
    return res.status(200).json(await getQueries.getSingleRow(tableName, id));
});

router.get("/api/:tableName", async function (req, res) {
    const tableName = req.params.tableName;
    return res.status(200).json(await getQueries.getAllRow(tableName));
});

let reg = {};
router.post("/api/reg/:page", async function (req, res) {
    console.log("post request received with this body...");
    console.log("req", req.body);
    if (req.params.page == 1) {
        reg.name = req.body.firstName + " " + req.body.lastName; // any string
        reg.gender = req.body.gender; // male, female
        reg.birthday = req.body.birthday; // DD-MON-YYYY
    } else if (req.params.page == 2) {
        reg.contactName = req.body.contactName;
        reg.contactPhoneNo = req.body.contactPhoneNo;
        reg.contactRelationship = req.body.contactRelationship;
        reg.contactAddress = req.body.contactAddress;
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
        // console.log("reg", reg);
        await postQueries.createUser(reg);
    }

    return res.status(201).json({
        success: "true",
        registration: reg,
    });
});

router.patch(
    "/api/:tableName/:attribute/:attrValue",
    async function (req, res) {
        const attrValue = req.params.attrValue;
        const attribute = req.params.attribute;
        const tableName = req.params.tableName;
        return res
            .status(200)
            .json(
                await patchQueries.patchTable(
                    tableName,
                    attribute,
                    attrValue,
                    req.body
                )
            );
    }
);

router.delete("/api/people/:id", async function (req, res) {
    const id = req.params.id;
    return res.status(200).json(await deleteQueries.deleteUserCascade(id));
});

router.post("/api/:tableName", async function (req, res) {
    const tableName = req.params.tableName;
    return res
        .status(200)
        .json(await postQueries.insertIntoTable(tableName, req.body));
});

router.get(
    "/api/:tableName1/:attribute1/:tableName2/:attribute2",
    async function (req, res) {
        const tableName1 = req.params.tableName1;
        const attribute1 = req.params.attribute1;
        const tableName2 = req.params.tableName2;
        const attribute2 = req.params.attribute2;

        return res
            .status(200)
            .json(
                await getQueries.joinTables(
                    tableName1,
                    attribute1,
                    tableName2,
                    attribute2
                )
            );
    }
);

router.get(
    "/api/:tableName1/:attribute1/:tableName2/:attribute2/:attrValue",
    async function (req, res) {
        const tableName1 = req.params.tableName1;
        const attribute1 = req.params.attribute1;
        const tableName2 = req.params.tableName2;
        const attribute2 = req.params.attribute2;
        const attrValue = req.params.attrValue;

        return res
            .status(200)
            .json(
                await getQueries.joinTablesReturnSingle(
                    tableName1,
                    attribute1,
                    tableName2,
                    attribute2,
                    attrValue
                )
            );
    }
);

//// auth ==================================

//// server ====================================

app.use(router);

const PORT = process.env.PORT || 8080;

app.listen(PORT, function () {
    console.log(`server started at port ${PORT}`);
});
