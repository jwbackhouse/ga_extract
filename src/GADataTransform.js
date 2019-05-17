
const fetch = require('node-fetch')
const through2Concurrent = require('through2-concurrent')

const getGAData = async (hostname, protocol, path, token, coordinate) => {
  console.log(`Getting data for search term: ${coordinate.term} from ${hostname}`)
  const coordinateTime = coordinate.time
  const formattedRequestURLForCoordinateAsString = `${protocol}://${hostname}/${path}/?ids=ga%3A89883654&start-date=2014-09-01&end-date=yesterday&metrics=ga%3Apageviews&dimensions=ga%3ApagePath%2Cga%3Adate&filters=ga%3ApagePath%3D%40${coordinate.term}&access_token=${token}`
  const gaCoordinateResponse = await fetch(formattedRequestURLForCoordinateAsString)
  return gaCoordinateResponse.json()
}

const gaDataTransform = (hostname, protocol, path, token, concurrentConnections) => {
  return through2Concurrent.obj(
    { maxConcurrency: concurrentConnections },
    function (chunk, enc, callback) {
      var self = this
      getGAData(hostname, protocol, path, token, chunk).then((newChunk) => {
        self.push(newChunk)
        callback()
      }).catch(callback)
    })
}

module.exports = gaDataTransform
