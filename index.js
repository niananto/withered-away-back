const express = require("express");
const res = require("express/lib/response");
const router = require('express-promise-router')();

const app = express();
app.use(express.json());

const queries = require('./queries.js');

/// express ===================================

router.get("/all", async function(req, res){
    return res.status(200).json(await queries.getPeople());
});

router.get("/:id", async function(req, res){
    const personId = req.params.id;
    return res.status(200).json(await queries.getPerson(personId));
});




router.post("/registration/:page", async function(req, res){
    const a = req.body.a;
    const b = req.body.b;
    // console.log(a, b);
    console.log(req.body);
    console.log(req.params.page);
    return res.status(200).json({
        success: 'true',
        a : a,
        b : b
    });
});





//// server ====================================

app.use(router);

const PORT = process.env.PORT || 8080;

app.listen(PORT, function(){
    console.log(`server started at port ${PORT}`);
})