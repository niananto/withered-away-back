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

async function createUser(reg) {
    await insertPeople(reg.name, reg.gender, reg.birthday);
    await insertContact(
        reg.contactName,
        reg.contactPhoneNo,
        reg.contactRelationship,
        reg.contactAddress,
        reg.peopleName
    );
}

async function insertPeople(peopleName, peopleGender, peopleBirthday) {
    const q = `INSERT INTO PEOPLE 
                (NAME, GENDER, BIRTHDAY)
                VALUES
                (:1, :2, :3)`;
    const params = [peopleName, peopleGender, peopleBirthday];
    return await db_query(q, params);
}

async function insertContact(
    contactName,
    contactPhoneNo,
    contactRelationship,
    contactAddress,
    peopleName
) {
    const q1 = `UPDATE PEOPLE
        SET EMERGENCY_CONTACT_NO = :1
        WHERE ID = :1`;
    const params1 = [contactPhoneNo];

    const q2 = `INSERT INTO CONTACT
        (NAME, PHONE_NO, RELATIONSHIP, ADDRESS)
        VALUES
        (:1, :2, :3, :4)`;
    const params2 = [
        contactName,
        contactPhoneNo,
        contactRelationship,
        contactAddress,
    ];

    const q3 = `INSERT INTO CONNECTION
        (PEOPLE_ID, CONTACT_ID)
        VALUES
        ((SELECT ID FROM PEOPLE WHERE NAME=:1), (SELECT ID FROM CONTACT WHERE NAME=:2))`;
    const params3 = [peopleName, contactName];

    await db_query(q1, params1);
    await db_query(q2, params2);
    await db_query(q3, params3);
    return;
}

exports.getPerson = getPerson;
exports.getAll = getAll;
exports.createUser = createUser;