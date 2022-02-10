const query = require("./queries.js");

async function insertUser(user) {
    const q = `INSERT INTO USERS (ROLE, USERNAME, HASHED_PASSWORD) VALUES
                (:1, :2, :3)`;
    const params = [user.role, user.username, user.password];
    await query.db_query(q, params);

    const q1 = `SELECT * FROM USERS WHERE USERNAME=:1 AND ROLE=:2`;
    const params1 = [user.username, user.role];
    return await query.db_query(q1, params1);
}

async function getUsers() {
    const q = `SELECT * FROM USERS`;
    const params = [];
    return await query.db_query(q, params);
}

exports.insertUser = insertUser;
exports.getUsers = getUsers;
