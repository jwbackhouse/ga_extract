// Set query parameters here
const GA_TOKEN = process.env.GA_TOKEN;
const GA_HOSTNAME = 'www.googleapis.com';
const GA_PATH = 'analytics/v3/data/ga';
const GA_PROTOCOL = 'https';
const GA_CONCURRENT_CONNECTIONS = 5;
const GA_VIEWID = '166530533'; // unique ID for the Analytics view being queried - found in GA when choosing account>property>view
const GA_METRICS = 'ga:sessions,ga:pageviews'; // separate multiple terms with comma. Prefix each with 'ga:'
const GA_DIMENSIONS = 'ga:date'; // separate multiple terms with comma. Prefix each with 'ga:'
const GA_FROM = '2020-06-01'; // 'from' date (inclusive), formatted as yyyy-mm-dd
const GA_TO = '2020-07-01';  // 'to' date (inclusive), formatted as yyyy-mm-dd or can use 'yesterday'
const INPUT_FILE_NAME = './input.csv';  // contains search terms used to filter URLs
const CSV_OUTPUT_FILE_NAME = './out/output.csv';


const fs = require('fs');
const csv = require('csv-parser');
const { pipeline } = require('stream');
const json2csv = require('json2csv');
const gaDataTransform = require('./src/GADataTransform');
const FlattenJSON = require('./src/FlattenJSON'); // flattens JSON output for CSV


const csvFields = ['selfLink', 'rows']; // Use this if we only want specific fields
const csvOptions = { csvFields };
const csvTransformOptions = { highWaterMark: 8192, objectMode: true };
const toCSVTransform = new json2csv.Transform(csvOptions, csvTransformOptions);
const readStream = fs.createReadStream(INPUT_FILE_NAME);
const writeStream = fs.createWriteStream(CSV_OUTPUT_FILE_NAME);

pipeline(
  readStream,
  csv(),
  gaDataTransform(GA_HOSTNAME, GA_PROTOCOL, GA_PATH, GA_TOKEN, GA_VIEWID, GA_METRICS, GA_DIMENSIONS, GA_FROM, GA_TO, GA_CONCURRENT_CONNECTIONS),
  new FlattenJSON(),
  toCSVTransform,
  writeStream,
  (error) => {
    if (error) {
      console.error('Pipeline failed', error);
    } else {
      console.log('Pipeline succeeded');
    }
});
