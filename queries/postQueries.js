const query = require("./queries.js");
const regQuery = require("./regQueries.js");
const bcrypt = require("bcrypt");

async function createUser(reg) {
    // const username = body.name.split(" ").join("").toLowerCase();
    const username = reg.name.replace(/\s/g, "").toLowerCase();
    const password = username;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = {
        role: "people",
        username: username,
        password: hashedPassword,
    };
    const q1 = `INSERT INTO USERS (USERNAME, HASHED_PASSWORD, ROLE) VALUES (:1, :2, :3)`;
    const params1 = [username, hashedPassword, "people"];
    await query.db_query(q1, params1);

    const q2 = `SELECT * FROM USERS WHERE USERNAME=:1 AND HASHED_PASSWORD=:2`;
    const params2 = [username, hashedPassword];
    const result1 = await query.db_query(q2, params2);
    const currentPeopleId = result1.data[result1.data.length - 1].ID;

    await regQuery.insertPeopleInfo(reg);

    // const result2 = await query.db_query(
    //     `SELECT ID FROM PEOPLE WHERE NAME LIKE :1`,
    //     [reg.name]
    // );
    // const currentPeopleId = result2.data[result2.data.length - 1].ID;

    await regQuery.insertContactInfo(reg, currentPeopleId);
    await regQuery.insertMedicalInfo(reg, currentPeopleId);
    await regQuery.insertFavoriteInfo(reg, currentPeopleId);
    await regQuery.insertMonetoryInfo(reg, currentPeopleId);

    console.log("user created");
    return reg;
}

async function insertIntoTable(tableName, body) {
    if (
        ["people", "staff", "doctor"].find(
            (userTable) => userTable == tableName.toLowerCase()
        ) != null
    ) {
        // const username = body.name.split(" ").join("").toLowerCase();
        const username = body.name.replace(/\s/g, "").toLowerCase();
        const password = username;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = {
            role: tableName,
            username: username,
            password: hashedPassword,
        };
        const q1 = `INSERT INTO USERS (USERNAME, HASHED_PASSWORD, ROLE) VALUES (:1, :2, :3)`;
        const params1 = [username, hashedPassword, tableName];
        await query.db_query(q1, params1);

        const q2 = `SELECT * FROM USERS WHERE USERNAME=:1 AND HASHED_PASSWORD=:2`;
        const params2 = [username, hashedPassword];
        const result = await query.db_query(q2, params2);
        const id = result.data[result.data.length - 1].ID;
        body.id = id;
    }
    let keys = [];
    let params = [];
    let placeholders = [];

    let i = 1;
    for (let [k, v] of Object.entries(body)) {
        keys.push(k);
        params.push(v);

        placeholders.push(":" + i);
        i++;
    }

    const attributes = keys.join(", ");
    const attrValues = placeholders.join(", ");
    const q =
        `INSERT INTO ${tableName} (` +
        attributes +
        `) VALUES (` +
        attrValues +
        `)`;

    await query.db_query(q, params);

    let searchList = [];
    for (let i = 0; i < keys.length; i++) {
        searchList.push(keys[i] + "=" + placeholders[i]);
    }
    const searchString = searchList.join(" AND ");

    const q1 = `SELECT * FROM ${tableName} WHERE ` + searchString;
    const params1 = params;
    const result = await query.db_query(q1, params1);
    return result.data[result.data.length - 1];
}

exports.createUser = createUser;
exports.insertIntoTable = insertIntoTable;
