const { Server } = require("http");
const download = require("download");
const MongoClient = require('mongodb').MongoClient;
const fs = require('fs');
const fastcsv = require('fast-csv');
const http = require('http');
const Entry = require('Entry')

const dbName = 'advprogproj';
const url = 'mongodb://localhost:27017';


/*  Author: Tyler Johnson
    Downloads the NY Time's latest covid stats CSV file
    and import it to the mongo database
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
        database = dbServer.get();
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


