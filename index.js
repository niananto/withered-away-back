const oracledb = require("oracledb");
const express = require("express");
const res = require("express/lib/response");
const router = require('express-promise-router')();
oracledb.outFormat = oracledb.OBJECT;

var connection = undefined;

async function db_query(query, params){
    if(connection === undefined){
        connection = await oracledb.getConnection({
            // user: 'c##starlord',
            // password: 'gamora',
            // connectString: 'localhost/orcl'
            user: 'TFUSER22',
            password: '0919db77',
            connectString: '103.94.135.201:1521/orclcdb.localdomain'
        });
        console.log("database connected successfully");
    }

    try{
        let result = await connection.execute(query, params);
        return {
            success: true,
            data: result.rows,
        } 
    }catch(e){
        return {
            success : false,
        }
    }
}

async function getPerson(id){
    const q = `select * from people where id=:1`;
    const params = [id];
    const result = await db_query(q, params);
    return result;
}

async function getPeople(){
    const q = `select * from people`;
    const params = [];
    const result = await db_query(q, params);
    return result;
}

//getEmployee(90);
//getEmployees();


/// express ===================================
router.get("/all", async function(req, res){
    return res.status(200).json(await getPeople());
});

router.get("/:id", async function(req, res){
    const personId = req.params.id;
    return res.status(200).json(await getPerson(personId));
});

const app = express();
app.use(router);

app.listen(3000, function(){
    console.log("server started at port 3000");
})


