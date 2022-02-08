const query = require("./queries.js");

async function patchTable(tableName, attribute, attrValue, body) {
    for (let [k, v] of Object.entries(body)) {
        const q = `UPDATE ${tableName} SET ${k}=:1 WHERE ${attribute}=:2`;
        const params = [v, attrValue];

        await query.db_query(q, params);
    }

    return;
}

exports.patchTable = patchTable;
