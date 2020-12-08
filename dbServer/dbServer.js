/*	Author: Tyler Johnson
	Database server class to allow other files to connect to the database

	*Note to self and others:
	Do not forget to start the mongodb service on your local machine before running this program

	Based on dbManager by Jake Levy
*/

let database = {};

const MongoClient = require("mongodb").MongoClient;
const dbName = 'advprogproj';
const url = 'mongodb://localhost:27017';

let db;

//MongoClient.connect(url, {useUnifiedTopology: true}, (err, client)

//Connects to the database
async function connect() {
    try {
		await MongoClient.connect(url, {useUnifiedTopology: true});

		database = MongoClient.db(dbName);

		if (database) {
			console.log("Database connected");
		}
		else {
			console.log("Error starting database");
			return database;
		}
	}
	catch(err) {
		throw err;
	}
}

//Retrieves the database, connects to it if it does not yet exist
database.get = function () {
	if (database) {
		return database;
	}
	else {
		connect();
	}
}

//Closes the database
database.close = function () {
	try {
		await MongoClient.close();
	}
	catch(err) {
		throw err;
	}
}

module.exports = database;