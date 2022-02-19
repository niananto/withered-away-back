function formatDate(value) {
	let date = new Date(value);
	const day = date.toLocaleString("default", { day: "2-digit" });
	const month = date.toLocaleString("default", { month: "short" });
	const year = date.toLocaleString("default", { year: "numeric" });
	return day + "-" + month + "-" + year;
}

function formatDates(reqBody) {
	if (reqBody.BIRTHDAY) {
		reqBody.BIRTHDAY = formatDate(reqBody.BIRTHDAY.toString());
	} else if (reqBody.BIRTHDATE) {
		reqBody.BIRTHDATE = formatDate(reqBody.BIRTHDATE.toString());
	} else if (reqBody.APPOINTED_DATE) {
		reqBody.APPOINTED_DATE = formatDate(reqBody.APPOINTED_DATE.toString());
	} else if (reqBody.ISSUE_DATE) {
		reqBody.ISSUE_DATE = formatDate(reqBody.ISSUE_DATE.toString());
	} else if (reqBody.RETURN_DATE) {
		reqBody.RETURN_DATE = formatDate(reqBody.RETURN_DATE.toString());
	}

	return reqBody;
}

exports.formatDate = formatDate;
exports.formatDates = formatDates;
