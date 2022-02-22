const query = require("./queries.js");

async function patchTable(tableName, attribute, attrValue, body) {
	for (let [k, v] of Object.entries(body)) {
		const q = `UPDATE ${tableName} SET ${k}=:1 WHERE ${attribute}=:2`;
		const params = [v, attrValue];

		await query.db_query(q, params);
	}
	return;
}

async function reqAppointment(appointedDate, peopleId, doctorId, reason) {
	const q = `DECLARE
              MSG VARCHAR2(100);
            BEGIN
              MSG := REQ_APPOINTMENT_AND_DEDUCE_FEE(:1,:2,:3,:4);
              DBMS_OUTPUT.PUT_LINE(MSG);
            END;`;
	const params = [peopleId, doctorId, appointedDate, reason];

	return await query.db_query(q, params);
}

async function issueBook(peopleId, bookId, issueDate, returnDate) {
	const q = `DECLARE
              MSG VARCHAR2(100);
            BEGIN
              MSG := ISSUE_BOOK_AND_DEDUCE_COST(:1,:2,:3,:4);
              DBMS_OUTPUT.PUT_LINE(MSG);
            END;`;
	const params = [peopleId, bookId, issueDate, returnDate];

	return await query.db_query(q, params);
}

exports.patchTable = patchTable;
exports.reqAppointment = reqAppointment;
exports.issueBook = issueBook;