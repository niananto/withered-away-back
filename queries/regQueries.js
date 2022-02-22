const query = require("./queries.js");

async function insertPeopleInfo(reg) {
    const q = `INSERT INTO PEOPLE 
                (NAME, GENDER, BIRTHDAY, PHONE_NO)
                VALUES
                (:1, :2, :3, :4)`;
    const params = [
        reg.firstName + " " + reg.lastName,
        reg.gender,
        reg.birthday,
        reg.phoneNo,
    ];
    return await query.db_query(q, params);
}

async function insertContactInfo(reg, currentPeopleId) {
    const q2 = `INSERT INTO CONTACT
        (NAME, PHONE_NO, ADDRESS)
        VALUES
        (:1, :2, :3)`;
    const params2 = [reg.contactName, reg.contactPhoneNo, reg.contactAddress];

    await query.db_query(q2, params2);

    const result = await query.db_query(
        `SELECT ID FROM CONTACT WHERE NAME LIKE :1`,
        [reg.contactName]
    );
    const currentContactId = result.data[result.data.length - 1].ID;

    const q3 = `INSERT INTO CONNECTION
        (PEOPLE_ID, CONTACT_ID, RELATIONSHIP)
        VALUES
        (:1, :2, :3)`;
    const params3 = [
        currentPeopleId,
        currentContactId,
        reg.contactRelationship,
    ];

    await query.db_query(q3, params3);
    return;
}

async function insertMedicalInfo(reg, currentPeopleId) {
	for (let disease of Object.values(reg.diseases)) {
		if (disease.name.trim() === "") continue;
		let q1 = `BEGIN
                    INSERT_INTO_DISEASE(:1);
                END;`;
		let params1 = [disease.name];

		let q2 = `INSERT INTO SUFFER_FROM
            (PEOPLE_ID, DISEASE_ID) VALUES
            (:1, (SELECT ID FROM DISEASE WHERE NAME LIKE :2))`;
		let params2 = [currentPeopleId, disease.name];

		await query.db_query(q1, params1);
		await query.db_query(q2, params2);
	}

	for (let medicine of Object.values(reg.medicines)) {
		if (medicine.name.trim() === "") continue;
		let q3 = `BEGIN
                    INSERT_INTO_MEDICINE(:1);   
                END;`;
		let params3 = [medicine.name];

		let q4 = `INSERT INTO TAKES_MEDICINE
            (PEOPLE_ID, MEDICINE_ID, TIME) VALUES
            (:1, (SELECT ID FROM MEDICINE WHERE NAME LIKE :2), :3)`;
		let params4 = [currentPeopleId, medicine.name, medicine.time];

		await query.db_query(q3, params3);
		await query.db_query(q4, params4);
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

	await query.db_query(q5, params5);

	for (let vaccine of Object.values(reg.vaccines)) {
		if (vaccine.name.trim() === "") continue;

		let q6 = `UPDATE HEALTH_RECORD SET VACCINE=(VACCINE || ' , ' || :1) WHERE PEOPLE_ID=:2`;
		let params6 = [vaccine.name, currentPeopleId];

		await query.db_query(q6, params6);
	}

	for (let dissability of Object.values(reg.dissabilities)) {
		if (dissability.name.trim() === "") continue;

		let q7 = `UPDATE HEALTH_RECORD SET DISABILITY=(DISABILITY || ' , ' || :1) WHERE PEOPLE_ID=:2`;
		let params7 = [dissability.name, currentPeopleId];

		await query.db_query(q7, params7);
	}

	for (let allergy of Object.values(reg.allergies)) {
		if (allergy.name.trim() === "") continue;

		let q8 = `UPDATE HEALTH_RECORD SET ALLERGY=(ALLERGY || ' , ' || :1) WHERE PEOPLE_ID=:2`;
		let params8 = [allergy.name, currentPeopleId];

		await query.db_query(q8, params8);
	}

	return;
}

async function insertFavoriteInfo(reg, currentPeopleId) {
	for (let game of Object.values(reg.games)) {
		if (game.name.trim() === "") continue;

		let q1 = `BEGIN
                    INSERT_INTO_GAME(:1);
                END;`;
		let params1 = [game.name];

		let q2 = `INSERT INTO GAME_FAVORITES
            (PEOPLE_ID, GAME_ID) VALUES
            (:1, (SELECT ID FROM GAME WHERE TITLE LIKE :2))`;
		let params2 = [currentPeopleId, game.name];

		await query.db_query(q1, params1);
		await query.db_query(q2, params2);
	}

	for (let song of Object.values(reg.songs)) {
		if (song.name.trim() === "") continue;

		let q1 = `BEGIN
                    INSERT_INTO_SONG(:1);
                END;`;
		let params1 = [song.name];

		let q2 = `INSERT INTO SONG_FAVORITES
            (PEOPLE_ID, SONG_ID) VALUES
            (:1, (SELECT ID FROM SONG WHERE TITLE LIKE :2))`;
		let params2 = [currentPeopleId, song.name];

		await query.db_query(q1, params1);
		await query.db_query(q2, params2);
	}

	for (let movie of Object.values(reg.movies)) {
		if (movie.name.trim() === "") continue;

		let q1 = `BEGIN
                    INSERT_INTO_MOVIE(:1);
                END;`;
		let params1 = [movie.name];

		let q2 = `INSERT INTO MOVIE_FAVORITES
            (PEOPLE_ID, MOVIE_ID) VALUES
            (:1, (SELECT ID FROM MOVIE WHERE TITLE LIKE :2))`;
		let params2 = [currentPeopleId, movie.name];

		await query.db_query(q1, params1);
		await query.db_query(q2, params2);
	}

	return;
}

async function insertMonetoryInfo(reg, currentPeopleId) {
    const q1 = `INSERT INTO ACCOUNT
        (BANK_ACCOUNT_NO, BANK_NAME, PEOPLE_ID, BALANCE) VALUES
        (:1, :2, :3, :4)`;
    const params1 = [
        reg.bankAccountNo,
        reg.bankName,
        currentPeopleId,
        reg.balance,
    ];

    await query.db_query(q1, params1);

    const q2 = `INSERT INTO SUBSCRIPTION
        (PEOPLE_ID, MEMBERSHIP_ID, STARTING_DATE) VALUES
        (:1, :2, SYSDATE)`;
    const params2 = [currentPeopleId, reg.membershipId];

    await query.db_query(q2, params2);
    return;
}

exports.insertPeopleInfo = insertPeopleInfo;
exports.insertContactInfo = insertContactInfo;
exports.insertMedicalInfo = insertMedicalInfo;
exports.insertFavoriteInfo = insertFavoriteInfo;
exports.insertMonetoryInfo = insertMonetoryInfo;
