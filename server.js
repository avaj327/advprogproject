const { Server } = require("http");
const download = require("download");
const MongoClient = require('mongodb').MongoClient;
const fs = require('fs');
const fastcsv = require('fast-csv');
const http = require('http');


const dbName = 'test';
const url = 'mongodb://localhost:27017';

function importCSV(log){
    
    //download the latest CSV file from the NYTimes Github
    download('https://raw.githubusercontent.com/nytimes/covid-19-data/master/live/us-counties.csv', 'tmp');
    
    //setup the fast CSV stream
    let stream = fs.createReadStream("tmp/us-counties.csv");
    let csvData = [];
    let csvStream = fastcsv.parse().on("data", (data) => { 
        //parse each column of the csv into fields
        if (data[2] == "New Jersey"){
            csvData.push({
                date: data[0],
                county: data[1],
                state: data[2],
                fips: data[3],
                cases: data[4],
                deaths: data[5],
                confirmed_cases: data[6],
                confirmed_deaths: data[7],
                probable_cases: data[8],
                probable_deaths: data[9]
            });
        }
    }).on("end", () => {
        csvData.shift(); //shifts the csv down 1 line (to ignore the header)

        if (log) console.log(csvData);  //log the data to the console (if param is true)

        //connect the the mongo db
        MongoClient.connect(url, {useUnifiedTopology: true}, (err, client) => {
            if (err) throw err;
        
            DB = client.db('covid-project');

            try{
                //drop the current stats stored in the database
                DB.dropCollection('covidstats'); 
            }
            catch (err) {
                throw err;
            }

            var collection = DB.collection('covidstats');



            //insert all of the csv rows into the mongodb
            collection.insertMany(csvData, (err, res) => {
                if (err) throw err;
        
                console.log(`Inserted: ${res.insertedCount} rows`);
                client.close();
            })
            //TODO: Stats class instead of raw data


        });
    });

    stream.pipe(csvStream);
}


importCSV(false);

http.createServer((req, res) => {



    MongoClient.connect(url, {useUnifiedTopology: true}, (err, client) => {
        if (err) throw err;
        
        
        res.setHeader("Content-Type", "text/html");
        res.writeHead(200);
        res.write("<html><head><title> NJ Covid Stats </title></head>");
        res.write("<body><br><br> ");
        res.write("<h1>NJ Covid Stats:</h1>");
        client.db("covid-project").collection('covidstats').find().toArray((err, item) => {
            res.write(JSON.stringify(item, null, 2));
            res.end("</html>");
        });
    });


}).listen(3000, () => {
    console.log("Server is listening!");
});