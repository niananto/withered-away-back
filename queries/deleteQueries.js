const query = require("./queries.js");

async function deleteUserCascade(tableName, id) {
    const q = `DELETE FROM ${tableName} WHERE ID=:1`;
    const params = [id];

    return await query.db_query(q, params);
}

exports.deleteUserCascade = deleteUserCascade;
