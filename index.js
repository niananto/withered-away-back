const express = require("express");
const res = require("express/lib/response");
const router = require('express-promise-router')();

const queries = require('./queries.js');

/// express ===================================
router.get("/all", async function(req, res){
    return res.status(200).json(await queries.getPeople());
});

router.get("/:id", async function(req, res){
    const personId = req.params.id;
    return res.status(200).json(await queries.getPerson(personId));
});

const app = express();
app.use(router);

app.listen(3000, function(){
    console.log("server started at port 3000");
})


