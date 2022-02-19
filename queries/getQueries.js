const query = require("./queries.js");

async function getSingleRow(tableName, id) {
    const q = `SELECT * FROM ${tableName} WHERE ID=:1`;
    const params = [id];
    const result = await query.db_query(q, params);
    return result;
}

async function getSingleRowCustom(tableName, attribute, attrValue) {
	const q = `SELECT * FROM ${tableName} WHERE ${attribute}=:1`;
	const params = [attrValue];
	const result = await query.db_query(q, params);
	return result;
}

async function getAllRow(tableName) {
	const q = `SELECT * FROM ${tableName}`;
	const params = [];
	const result = await query.db_query(q, params);
	return result;
}

async function joinTables(tableName1, attribute1, tableName2, attribute2) {
	const q = `SELECT * FROM ${tableName1} FULL JOIN ${tableName2} 
                ON ${tableName1}.${attribute1}=${tableName2}.${attribute2}`;
	const params = [];
	return await query.db_query(q, params);
}

async function joinTablesReturnSingle(
	tableName1,
	attribute1,
	tableName2,
	attribute2,
	attrValue
) {
	const q = `SELECT * FROM ${tableName1} FULL JOIN ${tableName2} 
                ON ${tableName1}.${attribute1}=${tableName2}.${attribute2} WHERE ${attribute1}=:1`;
	const params = [attrValue];
	return await query.db_query(q, params);
}

async function joinTablesReturnSingleCustom(
	tableName1,
	attribute1,
	tableName2,
	attribute2,
	attribute3,
	attrValue
) {
	const q = `SELECT * FROM ${tableName1} FULL JOIN ${tableName2} 
                ON ${tableName1}.${attribute1}=${tableName2}.${attribute2} WHERE ${attribute3}=:1`;
	const params = [attrValue];
	return await query.db_query(q, params);
}

exports.getSingleRow = getSingleRow;
exports.getSingleRowCustom = getSingleRowCustom;
exports.getAllRow = getAllRow;
exports.joinTables = joinTables;
exports.joinTablesReturnSingle = joinTablesReturnSingle;
exports.joinTablesReturnSingleCustom = joinTablesReturnSingleCustom;
