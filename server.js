require("dotenv").config();

const express = require("express");
const res = require("express/lib/response");
const router = require("express-promise-router")();
const bcrypt = require("bcrypt");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const app = express();
app.use(express.json());
app.use(cors());

const getQueries = require("./queries/getQueries.js");
const postQueries = require("./queries/postQueries.js");
const patchQueries = require("./queries/patchQueries.js");
const deleteQueries = require("./queries/deleteQueries.js");
const authQueries = require("./queries/authQueries.js");

const formatDate = require("./formatDate.js");

/// express ===================================

router.get("/api/:tableName/:id", async function (req, res) {
	const id = req.params.id;
	const tableName = req.params.tableName;
	return res.status(200).json(await getQueries.getSingleRow(tableName, id));
});

router.get("/api/:tableName/:attribute/:attrValue", async function (req, res) {
	const attribute = req.params.attribute;
	const attrValue = req.params.attrValue;
	const tableName = req.params.tableName;
	return res
		.status(200)
		.json(
			await getQueries.getSingleRowCustom(tableName, attribute, attrValue)
		);
});

router.get("/api/:tableName", async function (req, res) {
	const tableName = req.params.tableName;
	return res.status(200).json(await getQueries.getAllRow(tableName));
});

// let reg = {};
// router.post("/api/reg/:page", async function (req, res) {
//     console.log("post request received with this body...");
//     console.log("req", req.body);
//     if (req.params.page == 1) {
//         reg.name = req.body.firstName + " " + req.body.lastName; // any string
//         reg.gender = req.body.gender; // male, female
//         reg.birthday = req.body.birthday; // DD-MON-YYYY
//     } else if (req.params.page == 2) {
//         reg.contactName = req.body.contactName;
//         reg.contactPhoneNo = req.body.contactPhoneNo;
//         reg.contactRelationship = req.body.contactRelationship;
//         reg.contactAddress = req.body.contactAddress;
//     } else if (req.params.page == 3) {
//         reg.diseases = req.body.diseases; // list of diseases
//         reg.medicines = req.body.medicines; // list of medicines
//         reg.height = req.body.height;
//         reg.weight = req.body.weight;
//         reg.bloodGroup = req.body.bloodGroup;
//         reg.vaccines = req.body.vaccines; // list of vaccines
//         reg.dissabilities = req.body.dissabilities; // list
//         reg.allergies = req.body.allergies;
//         reg.healthCondition = req.body.healthCondition;
//     } else if (req.params.page == 4) {
//         reg.songs = req.body.songs; // list
//         reg.movies = req.body.movies; // list
//         reg.games = req.body.games; // list
//     } else if (req.params.page == 5) {
//         reg.bankAccountNo = req.body.bankAccountNo;
//         reg.balance = req.body.balance;
//         reg.membershipId = req.body.membershipId;

//         // insert query
//         // console.log("reg", reg);
//         await postQueries.createUser(reg);
//     }

//     return res.status(201).json({
//         success: "true",
//         registration: reg,
//     });
// });

router.post("/api/reg", async function (req, res) {
	console.log("req", req.body);
	if (req.body.birthday) {
		req.body.birthday = formatDate.formatDate(req.body.birthday.toString());
	}
	try {
		return res.status(201).json(await postQueries.createUser(req.body));
	} catch (e) {
		console.log(e);
		return res.status(500).send("Could Not Create User");
	}
});

router.patch("/api/reqappointment", async function (req, res) {
	const peopleId = req.body.PEOPLE_ID;
	const doctorId = req.body.DOCTOR_ID;
	const appointedDate = formatDate.formatDate(
		req.body.APPOINTED_DATE.toString()
	);
	const reason = req.body.REASON;

	return res
		.status(200)
		.json(
			await patchQueries.reqAppointment(
				appointedDate,
				peopleId,
				doctorId,
				reason
			)
		);
});

router.patch("/api/issuebook", async function (req, res) {
	const peopleId = req.body.PEOPLE_ID;
	const bookId = req.body.BOOK_ID;
	const issueDate = formatDate.formatDate(req.body.ISSUE_DATE.toString());
	const returnDate = formatDate.formatDate(req.body.RETURN_DATE);

	return res
		.status(200)
		.json(
			await patchQueries.issueBook(
				peopleId,
				bookId,
				issueDate,
				returnDate
			)
		);
});

router.patch(
	"/api/:tableName/:attribute/:attrValue",
	async function (req, res) {
		const attrValue = req.params.attrValue;
		const attribute = req.params.attribute;
		const tableName = req.params.tableName;
		req.body = formatDate.formatDates(req.body);

		return res
			.status(200)
			.json(
				await patchQueries.patchTable(
					tableName,
					attribute,
					attrValue,
					req.body
				)
			);
	}
);

router.delete("/api/:tableName/:id", async function (req, res) {
	const tableName = req.params.tableName;
	const id = req.params.id;
	return res
		.status(200)
		.json(await deleteQueries.deleteTableRow(tableName, id));
});

router.delete(
	"/api/:tableName/:attribute/:attrValue",
	async function (req, res) {
		const tableName = req.params.tableName;
		const attribute = req.params.attribute;
		const attrValue = req.params.attrValue;
		return res
			.status(200)
			.json(
				await deleteQueries.deleteTableRowCustom(
					tableName,
					attribute,
					attrValue
				)
			);
	}
);


router.post("/api/:tableName", async function (req, res) {
	const tableName = req.params.tableName;
	req.body = formatDate.formatDates(req.body);

	return res
		.status(200)
		.json(await postQueries.insertIntoTable(tableName, req.body));
});

router.get(
	"/api/:tableName1/:attribute1/:tableName2/:attribute2",
	async function (req, res) {
		const tableName1 = req.params.tableName1;
		const attribute1 = req.params.attribute1;
		const tableName2 = req.params.tableName2;
		const attribute2 = req.params.attribute2;

		return res
			.status(200)
			.json(
				await getQueries.joinTables(
					tableName1,
					attribute1,
					tableName2,
					attribute2
				)
			);
	}
);

router.get(
	"/api/:tableName1/:attribute1/:tableName2/:attribute2/:attrValue",
	async function (req, res) {
		const tableName1 = req.params.tableName1;
		const attribute1 = req.params.attribute1;
		const tableName2 = req.params.tableName2;
		const attribute2 = req.params.attribute2;
		const attrValue = req.params.attrValue;

		return res
			.status(200)
			.json(
				await getQueries.joinTablesReturnSingle(
					tableName1,
					attribute1,
					tableName2,
					attribute2,
					attrValue
				)
			);
	}
);

router.get(
	"/api/:tableName1/:attribute1/:tableName2/:attribute2/:attribute3/:attrValue",
	async function (req, res) {
		const tableName1 = req.params.tableName1;
		const attribute1 = req.params.attribute1;
		const tableName2 = req.params.tableName2;
		const attribute2 = req.params.attribute2;
		const attribute3 = req.params.attribute3;
		const attrValue = req.params.attrValue;

		return res
			.status(200)
			.json(
				await getQueries.joinTablesReturnSingleCustom(
					tableName1,
					attribute1,
					tableName2,
					attribute2,
					attribute3,
					attrValue
				)
			);
	}
);


//// auth ==================================

router.get("/auth/users/all", async function (req, res) {
	return res.status(200).json(await authQueries.getUsers());
});

router.post("/auth/users/reg", async (req, res) => {
	try {
		const hashedPassword = await bcrypt.hash(req.body.password, 10);
		const user = {
			role: req.body.role,
			username: req.body.username,
			password: hashedPassword,
		};
		// users.push(user);
		return res.status(201).json(await authQueries.insertUser(user));
	} catch {
		res.status(500).send();
	}
});

router.post("/auth/users/login", async (req, res) => {
	const users = (await authQueries.getUsers()).data;
	const user = users.find(
		(user) =>
			user.ROLE == req.body.role && // I can make this where the req does not have to have a role
			user.USERNAME == req.body.username
	);
	if (user == null) {
		return res.status(400).send("Cannot find user");
	}
	try {
		if (await bcrypt.compare(req.body.password, user.HASHED_PASSWORD)) {
			const payload = {
				role: user.ROLE,
				username: user.USERNAME,
				password: user.HASHED_PASSWORD,
			};
			const accessToken = jwt.sign(
				payload,
				process.env.ACCESS_TOKEN_SECRET
			);
			if (user.ID)
				res.json({
					msg: "Success",
					id: user.ID,
					accessToken: accessToken,
				});
			else res.json({ msg: "Success", accessToken: accessToken });
		} else {
			res.json({ msg: "Not allowed" });
		}
	} catch (e) {
		console.log(e);
		res.status(500).send();
	}
});

router.get("/auth/check-admin", authenticateToken(["admin"]), (req, res) => {
	return res.status(200).json(req.msg);
});

router.get("/auth/check-people", authenticateToken(["people"]), (req, res) => {
	return res.status(200).json(req.msg);
});

router.get("/auth/check-doctor", authenticateToken(["doctor"]), (req, res) => {
	return res.status(200).json(req.msg);
});

router.get("/auth/check-staff", authenticateToken(["staff"]), (req, res) => {
	return res.status(200).json(req.msg);
});

function authenticateToken(roles) {
	return (req, res, next) => {
		try {
			const authHeader = req.headers["authorization"];
			const token = authHeader && authHeader.split(" ")[1];
			if (token == null) return res.sendStatus(401);

			jwt.verify(
				token,
				process.env.ACCESS_TOKEN_SECRET,
				(err, payload) => {
					if (err) return res.sendStatus(403);
					const roleMatch = roles.find(
						(role) => role == payload.role
					);
					if (roleMatch == null) return res.sendStatus(403);
					req.msg = "welcome " + payload.role;
					next();
				}
			);
		} catch (e) {
			console.log(e);
			res.status(500).send();
		}
	};
}

//// server ====================================

app.use(router);

const PORT = process.env.PORT || 8080;

app.listen(PORT, function () {
	console.log(`server started at port ${PORT}`);
});
