const query = require("./queries.js");

async function deleteTableRow(tableName, id) {
	let q = "";
	if (tableName != "people" || tableName != "PEOPLE") {
		q = `DELETE FROM ${tableName} WHERE ID=:1`;
	} else {
		q = `BEGIN
          PEOPLE_DELETE(:1);
        END;`;
	}
	const params = [id];

	return await query.db_query(q, params);
}

async function deleteTableRowCustom(tableName, attribute, attrValue) {
	let q = "";
	if (tableName != "people" || tableName != "PEOPLE") {
		q = `DELETE FROM ${tableName} WHERE ${attribute}=:1`;
	} else {
		q = `BEGIN
          PEOPLE_DELETE(:1);
        END;`;
	}
	const params = [attrValue];

	return await query.db_query(q, params);
}

exports.deleteTableRow = deleteTableRow;
exports.deleteTableRowCustom = deleteTableRowCustom;
