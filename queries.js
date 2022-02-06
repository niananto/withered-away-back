const oracledb = require("oracledb");
const oracleDbInst = require("oracledb/lib/oracledb");
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

async function getSingleRow(tableName, id) {
    const q = `SELECT * FROM ${tableName} WHERE ID=:1`;
    const params = [id];
    const result = await db_query(q, params);
    return result;
}

async function getAllRow(tableName) {
    const q = `SELECT * FROM ${tableName}`;
    const params = [];
    const result = await db_query(q, params);
    return result;
}

async function createUser(reg) {
    await insertPeopleInfo(reg);

    const currentPeopleId = (
        await db_query(`SELECT ID FROM PEOPLE WHERE NAME LIKE :1`, [reg.name])
    ).data[0].ID;

    await insertContactInfo(reg, currentPeopleId);
    await insertMedicalInfo(reg, currentPeopleId);
    await insertFavoriteInfo(reg, currentPeopleId);
    await insertMonetoryInfo(reg, currentPeopleId);

    console.log("user created");
    return;
}

async function insertPeopleInfo(reg) {
    const q = `INSERT INTO PEOPLE 
                (NAME, GENDER, BIRTHDAY)
                VALUES
                (:1, :2, :3)`;
    const params = [reg.name, reg.gender, reg.birthday];
    return await db_query(q, params);
}

async function insertContactInfo(reg, currentPeopleId) {
    const q1 = `UPDATE PEOPLE
        SET EMERGENCY_CONTACT_NO = :1
        WHERE ID = :2`;
    const params1 = [reg.contactPhoneNo, currentPeopleId];

    await db_query(q1, params1);

    const q2 = `INSERT INTO CONTACT
        (NAME, PHONE_NO, ADDRESS)
        VALUES
        (:1, :2, :3)`;
    const params2 = [reg.contactName, reg.contactPhoneNo, reg.contactAddress];

    await db_query(q2, params2);

    const currentContactId = (
        await db_query(`SELECT ID FROM CONTACT WHERE NAME LIKE :1`, [
            reg.contactName,
        ])
    ).data[0].ID;

    const q3 = `INSERT INTO CONNECTION
        (PEOPLE_ID, CONTACT_ID, RELATIONSHIP)
        VALUES
        (:1, :2, :3)`;
    const params3 = [
        currentPeopleId,
        currentContactId,
        reg.contactRelationship,
    ];

    await db_query(q3, params3);
    return;
}

async function insertMedicalInfo(reg, currentPeopleId) {
    for (let diseaseName of reg.diseases) {
        let q1 = `BEGIN
                    INSERT_INTO_DISEASE(:1);
                END;`;
        let params1 = [diseaseName];

        let q2 = `INSERT INTO SUFFER_FROM
            (PEOPLE_ID, DISEASE_ID) VALUES
            (:1, (SELECT ID FROM DISEASE WHERE NAME LIKE :2))`;
        let params2 = [currentPeopleId, diseaseName];

        await db_query(q1, params1);
        await db_query(q2, params2);
    }

    for (let medicine of reg.medicines) {
        let q3 = `BEGIN
                    INSERT_INTO_MEDICINE(:1, :2);   
                END;`;
        let params3 = [medicine.name, medicine.time];

        let q4 = `INSERT INTO TAKES_MEDICINE
            (PEOPLE_ID, MEDICINE_ID) VALUES
            (:1, (SELECT ID FROM MEDICINE WHERE NAME LIKE :2))`;
        let params4 = [currentPeopleId, medicine.name];

        await db_query(q3, params3);
        await db_query(q4, params4);
    }

    const q5 = `INSERT INTO HEALTH_RECORD
        (PEOPLE_ID, HEIGHT, WEIGHT, BLOOD_GROUP, HEALTH_CONDITION) VALUES
        (:1, :2, :3, :4, :5)`;
    const params5 = [
        currentPeopleId,
        reg.height,
        reg.weight,
        reg.bloodGroup,
        reg.healthCondition,
    ];

    await db_query(q5, params5);

    for (let vaccineName of reg.vaccines) {
        let q6 = `UPDATE HEALTH_RECORD SET VACCINE=(VACCINE || ' , ' || :1) WHERE PEOPLE_ID=:2`;
        let params6 = [vaccineName, currentPeopleId];

        await db_query(q6, params6);
    }

    for (let dissabilityName of reg.dissabilities) {
        let q7 = `UPDATE HEALTH_RECORD SET DISABILITY=(DISABILITY || ' , ' || :1) WHERE PEOPLE_ID=:2`;
        let params7 = [dissabilityName, currentPeopleId];

        await db_query(q7, params7);
    }

    for (let allergyName of reg.allergies) {
        let q8 = `UPDATE HEALTH_RECORD SET ALLERGY=(ALLERGY || ' , ' || :1) WHERE PEOPLE_ID=:2`;
        let params8 = [allergyName, currentPeopleId];

        await db_query(q8, params8);
    }

    return;
}

async function insertFavoriteInfo(reg, currentPeopleId) {
    for (let gameName of reg.games) {
        let q1 = `BEGIN
                    INSERT_INTO_GAME(:1);
                END;`;
        let params1 = [gameName];

        let q2 = `INSERT INTO GAME_FAVORITES
            (PEOPLE_ID, GAME_ID) VALUES
            (:1, (SELECT ID FROM GAME WHERE TITLE LIKE :2))`;
        let params2 = [currentPeopleId, gameName];

        await db_query(q1, params1);
        await db_query(q2, params2);
    }

    for (let songName of reg.songs) {
        let q1 = `BEGIN
                    INSERT_INTO_SONG(:1);
                END;`;
        let params1 = [songName];

        let q2 = `INSERT INTO SONG_FAVORITES
            (PEOPLE_ID, SONG_ID) VALUES
            (:1, (SELECT ID FROM SONG WHERE TITLE LIKE :2))`;
        let params2 = [currentPeopleId, songName];

        await db_query(q1, params1);
        await db_query(q2, params2);
    }

    for (let movieName of reg.movies) {
        let q1 = `BEGIN
                    INSERT_INTO_MOVIE(:1);
                END;`;
        let params1 = [movieName];

        let q2 = `INSERT INTO MOVIE_FAVORITES
            (PEOPLE_ID, MOVIE_ID) VALUES
            (:1, (SELECT ID FROM MOVIE WHERE TITLE LIKE :2))`;
        let params2 = [currentPeopleId, movieName];

        await db_query(q1, params1);
        await db_query(q2, params2);
    }

    return;
}

async function insertMonetoryInfo(reg, currentPeopleId) {
    const q1 = `INSERT INTO ACCOUNT
        (BANK_ACCOUNT_NO, PEOPLE_ID, BALANCE) VALUES
        (:1, :2, :3)`;
    const params1 = [reg.bankAccountNo, currentPeopleId, reg.balance];

    await db_query(q1, params1);

    const q2 = `INSERT INTO SUBSCRIPTION
        (PEOPLE_ID, MEMBERSHIP_ID, STARTING_DATE) VALUES
        (:1, :2, SYSDATE)`;
    const params2 = [currentPeopleId, reg.membershipId];

    await db_query(q2, params2);
    return;
}

async function deleteUserCascade(id) {
    const q = `DELETE FROM PEOPLE WHERE ID=:1`;
    const params = [id];

    return await db_query(q, params);
}

async function patchTable(tableName, attribute, attrValue, body) {
    for (let [key, value] of Object.entries(body)) {
        const q = `UPDATE ${tableName} SET ${key}=:1 WHERE ${attribute}=:2`;
        const params = [value, attrValue];

        await db_query(q, params);
    }

    return;
}

exports.getSingleRow = getSingleRow;
exports.getAllRow = getAllRow;
exports.createUser = createUser;
exports.deleteUserCascade = deleteUserCascade;
exports.patchTable = patchTable;