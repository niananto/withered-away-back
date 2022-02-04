const oracledb = require("oracledb");
oracledb.outFormat = oracledb.OBJECT;

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
        return {
            success: true,
            data: result.rows,
        };
    } catch (e) {
        return {
            success: false,
        };
    }
}

async function getPerson(id) {
    const q = `SELECT * FROM PEOPLE WHERE ID=:1`;
    const params = [id];
    const result = await db_query(q, params);
    return result;
}

async function getAll(tableName) {
    const q = `SELECT * FROM ${tableName}`;
    const params = [];
    const result = await db_query(q, params);
    return result;
}

exports.getPerson = getPerson;
exports.getAll = getAll;