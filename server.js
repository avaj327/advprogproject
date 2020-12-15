const { Server } = require("http");
const download = require("download");
const MongoClient = require('mongodb').MongoClient;
const fs = require('fs');
const fastcsv = require('fast-csv');
const http = require('http');
const Entry = require('./Entry');
const database = require('./dbServer');
const express = require('express');
const server = express();



const dbName = 'advprogproj';

let db = database.get();

/*
*	Function Author: Tyler Johnson
*	Downloads the NY Time's latest covid stats CSV file
*	and import it to the mongo database
*/
async function importCSV(log){
	
	//download the latest CSV file from the NYTimes Github
   
   try {
		fs.writeFileSync('./us-counties.csv', await download('https://raw.githubusercontent.com/nytimes/covid-19-data/master/live/us-counties.csv')); 
   }
   catch (err) {
	   throw err;
   }

	
	//setup the fast CSV stream
	let stream = fs.createReadStream("us-counties.csv");
	let csvData = [];
	let csvStream = fastcsv.parse().on("data", (data) => { 
		//parse each column of the csv into fields
		if (data[2] == "New Jersey"){
			var entry = new Entry(data[0], data[1], data[2], data[3], data[4], data[5], data[6], data[7], data[8], data[9]);

			csvData.push({
				entry
			});
		}
	}).on("end", () => {
		csvData.shift(); //shifts the csv down 1 line (to ignore the header)

		if (log) console.log(csvData);  //log the data to the console (if param is true)

		//connect the the mongo db
		db = database.get();
		

		try{
			//drop the current stats stored in the database
			db.dropCollection('covidstats'); 
		}
		catch (err) {
			console.log(err);
		}
		var collection = db.collection('covidstats');

		//insert all of the csv rows into the mongodb
		collection.insertMany(csvData, (err, res) => {
			if (err) throw err;
	
			console.log(`Inserted: ${res.insertedCount} rows`);
		})




	});

	stream.pipe(csvStream);
}



importCSV(false);

function getDocument(){
	var S=document.getElementById("sv").getSVGDocument();
	atlantic = S.getElementById('Atlantic');
	bergen = S.getElementById('Bergen');
	burlington = S.getElementById('Burlington');
	camden = S.getElementById('Camden');
	cape_may = S.getElementById('Cape_May');
	cumberland = S.getElementById('Cumberland');
	essex = S.getElementById('Essex');
	gloucester = S.getElementById('Gloucester');
	hudson = S.getElementById('Hudson');
	hunterdon = S.getElementById('Hunterdon');
	mercer = S.getElementById('Mercer');
	middlesex = S.getElementById('Middlesex');
	monmouth = S.getElementById('Monmouth');
	morris = S.getElementById('Morris');
	ocean = S.getElementById('Ocean');
	passaic = S.getElementById('Passaic');
	salem = S.getElementById('Salem');
	somerset = S.getElementById('Somerset');
	sussex = S.getElementById('Sussex');
	union = S.getElementById('Union');
	warren = S.getElementById('Warren');
 
	atlantic.addEventListener('click', function(){
		 this.style.fill="red";
		 alert('atlantic')
	 }, false);

	 bergen.addEventListener('click', function(){
		 this.style.fill="pink";
		 alert('bergen')
	 }, false);
	 burlington.addEventListener('click', function(){
		 this.style.fill="red";
		 alert('burlington')
	 }, false);

	 camden.addEventListener('click', function(){
		 this.style.fill="pink";
		 alert('camden')
	 }, false);
	 cape_may.addEventListener('click', function(){
		 this.style.fill="red";
		 alert('cape may')
	 }, false);

	 cumberland.addEventListener('click', function(){
		 this.style.fill="pink";
		 alert('cumberland')
	 }, false);
	 essex.addEventListener('click', function(){
		 this.style.fill="red";
		 alert('essex')
	 }, false);

	 gloucester.addEventListener('click', function(){
		 this.style.fill="pink";
		 alert('gloucester')
	 }, false);
	 hudson.addEventListener('click', function(){
		 this.style.fill="red";
		 alert('hudson')
	 }, false);

	 hunterdon.addEventListener('click', function(){
		 this.style.fill="pink";
		 alert('hunterdon')
	 }, false);

	 mercer.addEventListener('click', function(){
		 this.style.fill="pink";
		 alert('mercer')
	 }, false);

	 middlesex.addEventListener('click', function(){
		 this.style.fill="pink";
		 alert('middlesex')
	 }, false);

	 monmouth.addEventListener('click', function(){
		 this.style.fill="pink";
		 alert('monmouth')
	 }, false);

	 morris.addEventListener('click', function(){
		 this.style.fill="pink";
		 alert('morris')
	 }, false);

	 ocean.addEventListener('click', function(){
		 this.style.fill="pink";
		 alert('ocean')
	 }, false);

	 passaic.addEventListener('click', function(){
		 this.style.fill="pink";
		 alert('passaic')
	 }, false);

	 salem.addEventListener('click', function(){
		 this.style.fill="pink";
		 alert('salem')
	 }, false);

	 somerset.addEventListener('click', function(){
		 this.style.fill="pink";
		 alert('somerset')
	 }, false);

	 sussex.addEventListener('click', function(){
		 this.style.fill="pink";
		 alert('sussex')
	 }, false);

	 union.addEventListener('click', function(){
		 this.style.fill="pink";
		 alert('union')
	 }, false);

	 warren.addEventListener('click', function(){
		 this.style.fill="pink";
		 alert('warren')
	 }, false);

 }

http.createServer((req, res) => {
   
   
	if (req.method != "POST"){
		res.writeHead(404);//sets the response Status Code
		res.end("ERROR This is a POST server")
		}else{
	 
		var POSTDATA = '';
	
		//when the request has data to send us, add it to the postdata
		req.on('data', function (chunk) {
		POSTDATA += chunk;
		});
		
		var resOBJ;
		//when the request is finished
		req.on('end', function (){
		
		//	console.log(POSTDATA);
		//We know we are getting stringified JSON data so we can just parse it
		var reqOBJ = JSON.parse(POSTDATA);
	
		//now we can work with the received data
		var greeting = `Hello ${reqOBJ.name}`;
		var quest = `Are you a good ${reqOBJ.occupation}?`;
	
		//create a new object to send back
		resOBJ = { message: greeting, question: quest};
	
		//set the status code of response
		res.writeHead(200);
	
		//write the data to the resonse object to be sent off
		res.end(JSON.stringify(resOBJ));
		});
		}






}).listen(3000, () => {
    console.log("Server is listening on 3000!");
});

/*
db = database.get();
	
res.setHeader("Content-Type", "text/html");
res.writeHead(200);
res.write("<html><head><title> NJ Covid Stats </title></head>");
res.write("<div align='center'");
res.write("<body> onload=`getDocument()`>");
res.write("<h1> Covid Map ' </h1>");
res.write("<object id='sv' type = 'image/svg+xml' data = 'njmap.svg'></object></div>");


db.collection('covidstats').find().toArray((err, item) => {
	var items = JSON.stringify(item, null, 0);
	res.write(items);
	
});


//prints out each county name -- temp function for demonstration
/*db.collection('covidstats').find({}).toArray((err, array) => {
	array.forEach(item => {
		var county = item.entry.county;
		res.write(county);
		
		
	});
	
	
	res.write("<input type='text' name='search'> ")
	res.write("</body>")
	res.end("</html>");

		
		 
	});*/