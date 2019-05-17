// require('dotenv').config()

  // CONSTANTS
  const GA_TOKEN = process.env.GA_TOKEN
  const GA_HOSTNAME = 'www.googleapis.com'
  const GA_PATH = 'analytics/v3/data/ga'
  const GA_PROTOCOL = 'https'
  const INPUT_FILE_NAME = './input.csv'
  const GA_CONCURRENT_CONNECTIONS = 100
  const CSV_OUTPUT_FILE_NAME = './out/output.csv'
  
  // EXTERNAL DEPENDENCIES
  const fs = require('fs')
  const csv = require('csv-parser')
  const { pipeline } = require('stream')
  const json2csv = require('json2csv')
  
  // INTERNAL DEPENDENCIES
  const gaDataTransform = require('./src/GADataTransform')
  const FlattenHoursTransform = require('./src/FlattenHoursTransform')
  
  // const csvFields = ['latitude', 'longitude', 'summary'] // Use this if we only want specific fields
  const csvOptions = {} // { csvFields }
  const csvTransformOptions = { highWaterMark: 8192, objectMode: true }
  const toCSVTransform = new json2csv.Transform(csvOptions, csvTransformOptions)
  
  const readStream = fs.createReadStream(INPUT_FILE_NAME)
  const writeStream = fs.createWriteStream(CSV_OUTPUT_FILE_NAME)
  
  pipeline(
    readStream,
    csv(),
    gaDataTransform(GA_HOSTNAME, GA_PROTOCOL, GA_PATH, GA_TOKEN, GA_CONCURRENT_CONNECTIONS),
    new FlattenHoursTransform(),
    toCSVTransform,
    writeStream,
    (error) => {
      if (error) {
        console.error('Pipeline failed', error)
      } else {
        console.log('Pipeline succeeded')
      }
  })