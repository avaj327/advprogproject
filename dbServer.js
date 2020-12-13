/*	Author: Tyler Johnson
	Database server class to allow other files to connect to the database

	*Note to self and others:
	Do not forget to start the mongodb service on your local machine before running this program
 
	Based on dbManager by Jake Levy
*/

let database = {};
const dbName = 'advprogproj';
const url = 'mongodb://localhost:27017';

const MongoClient = require("mongodb").MongoClient;
let mongo = MongoClient(url,{ useUnifiedTopology: true });

let db;

//Connects to the database
async function connect() {
    try {
		await mongo.connect();

		db = mongo.db(dbName);


		if (db) {
			console.log("Database connected!");
			return db;
		}
		else {
			throw new Error("Error starting database");
		} 
	}
	catch(err) {
		throw err;
	}
}

//Retrieves the database, connects to it if it does not yet exist
database.get = function () {
	if (db) {
		return db;
	}
	else {
		return connect();
	}
}

//Closes the database
database.close = async function () {
	try {
		await mongo.close();
	}
	catch(err) {
		throw err;
	}
}

module.exports = database;