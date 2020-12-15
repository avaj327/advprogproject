
// Mongoose Documentation 
//https://mongoosejs.com/docs/4.x/docs/connections.html

//Google Authentication code, credit from:
//Medium Article, written by Nick Roach
//DEC 09 2020
//https://medium.com/@nickroach_50526/sending-emails-with-node-js-using-smtp-gmail-and-oauth2-316fe9c790a1

// Assisted from "Render HTML File "
// https://codeforgeek.com/render-html-file-expressjs


const path = require('path');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');  // allows the API to be used by front end apps 
const csv = require('csvtojson');
const fs = require('fs');
const download = require('download');

async function start() {
    try {
        fs.writeFileSync('./us-counties.csv', await download('https://raw.githubusercontent.com/nytimes/covid-19-data/master/live/us-counties.csv')); 
    }
    catch (err) {
       throw err;
    }



const mongoose = require('mongoose'); // manages relationships between data 
const connectionString = `mongodb://localhost:27017/covid-stats`;
mongoose.connect(connectionString, {
    useCreateIndex: true,
    useNewUrlParser: true,
    poolSize: 5,
    useUnifiedTopology: true
})
    .then(db => console.log('Connected with MongoDB.'))
    .catch(err => console.log(`Unable to connect with MongoDB: ${err.message}`));


const schema = new mongoose.Schema({
    cases: {type: String},
    confirmed_cases: {type: String},
    confirmed_deaths: {type: String},
    county: {type: String},
    date: {type: String},
    deaths: {type: String},
    fips: {type: String},
    probable_cases: {type: String},
    probable_deaths: {type: String},
    state: {type: String},
});
const County = mongoose.model("County", schema);

const csvFilePath = path.join(__dirname, 'us-counties.csv');
const jsonArray = csv().fromFile(csvFilePath)
    .then(jsonObj => {
        County.collection.drop();
        County.insertMany(jsonObj, function (err, data) {
            if (err) {
                console.log(`Error: ${err.message}`);
                return;
            };

            console.log(`Successfully inserted ${data.length} records in MongoDB.`);
        });
    });

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));
app.get('/',(req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});
app.get('/:county', async (req, res) => {
    const county = req.params.county;
    const record = await County.findOne({county: {$regex: county, $options: 'i'}});
    res.status(200).send(record);
});

app.listen(3000, () => console.log(`Server listening on 3000`));

}

start();