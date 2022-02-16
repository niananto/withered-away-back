const query = require("./queries.js");
const regQuery = require("./regQueries.js");
const bcrypt = require("bcrypt");
const res = require("express/lib/response");

async function createUser(reg) {
    try {
        await regQuery.insertPeopleInfo(reg);

        const result2 = await query.db_query(
            `SELECT ID FROM PEOPLE WHERE NAME LIKE :1 ORDER BY ID ASC`,
            [reg.firstName + " " + reg.lastName]
        );
        const currentPeopleId = result2.data[result2.data.length - 1].ID;

        await regQuery.insertContactInfo(reg, currentPeopleId);
        await regQuery.insertMedicalInfo(reg, currentPeopleId);
        await regQuery.insertFavoriteInfo(reg, currentPeopleId);
        await regQuery.insertMonetoryInfo(reg, currentPeopleId);

        const hashedPassword = await bcrypt.hash(reg.password, 10);

        const q1 = `INSERT INTO USERS (ID, USERNAME, HASHED_PASSWORD, ROLE) VALUES (:1, :2, :3, :4)`;
        const params1 = [
            currentPeopleId,
            reg.username,
            hashedPassword,
            "people",
        ];
        await query.db_query(q1, params1);

        console.log("user created");
        return reg;
    } catch (e) {
        console.log(e);
        return e;
    }
}

async function insertIntoTable(tableName, body) {
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
    let toBeReturned = result.data[result.data.length - 1];

    if (
        ["people", "staff", "doctor"].find(
            (userTable) => userTable == tableName.toLowerCase()
        ) != null
    ) {
        // const username = body.name.split(" ").join("").toLowerCase();
        const username = body.NAME.replace(/\s/g, "").toLowerCase();
        const password = username + Math.floor(Math.random() * 90 + 10);
        const hashedPassword = await bcrypt.hash(password, 10);
        const currentId = toBeReturned.ID;

        const q1 = `INSERT INTO USERS (ID, USERNAME, HASHED_PASSWORD, ROLE) VALUES (:1, :2, :3, :4)`;
        const params1 = [currentId, username, hashedPassword, tableName];
        await query.db_query(q1, params1);

        toBeReturned.username = username;
        toBeReturned.password = password;
    }

    return toBeReturned;
}

exports.createUser = createUser;
exports.insertIntoTable = insertIntoTable;
