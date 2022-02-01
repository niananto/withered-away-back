const oracledb = require("oracledb");
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
    const q = `SELECT * FROM PEOPLE WHERE ID=:1`;
    const params = [id];
    const result = await db_query(q, params);
    return result;
}

async function getPeople(){
    const q = `SELECT * FROM PEOPLE`;
    const params = [];
    const result = await db_query(q, params);
    return result;
}


exports.getPerson = getPerson;
exports.getPeople = getPeople;