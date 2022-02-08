const oracledb = require("oracledb");
// const oracleDbInst = require("oracledb/lib/oracledb");
oracledb.outFormat = oracledb.OBJECT;
oracledb.autoCommit = true;

var connection = undefined;

async function db_query(query, params) {
    if (connection === undefined) {
        connection = await oracledb.getConnection({
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            connectString: process.env.DB_CONNECTIONSTRING,
        });
        console.log("database connected successfully");
    }

    try {
        let result = await connection.execute(query, params);
        console.log("query ran : ", query, params);
        return {
            success: true,
            data: result.rows,
        };
    } catch (e) {
        console.log("ERROR For : ", query, params);
        console.log(e);
        return {
            success: false,
        };
    }
}

exports.db_query = db_query;
