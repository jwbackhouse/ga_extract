const fetch = require('node-fetch');
const through2Concurrent = require('through2-concurrent');

const getGAData = async (hostname, protocol, path, token, viewId, metrics, dimensions, from, to, searchTerms) => {
  console.log(`Getting data for search term: ${searchTerms.term} from ${hostname}`);
  const formattedRequestURL = `${protocol}://${hostname}/${path}/?ids=ga%3A${viewId}&start-date=${from}&end-date=${to}&metrics=${metrics}&dimensions=${dimensions}&filters=ga%3ApagePath%3D%40${searchTerms.term}&max-results=5000&access_token=${token}`;
  const gaResponse = await fetch(formattedRequestURL);
  return gaResponse.json();
};

const gaDataTransform = (hostname, protocol, path, token, viewId, metrics, dimensions, from, to, concurrentConnections) => {
  return through2Concurrent.obj(
    { maxConcurrency: concurrentConnections },
    function (chunk, enc, callback) {
      var self = this;
      getGAData(hostname, protocol, path, token, viewId, metrics, dimensions, from, to, chunk).then((newChunk) => {
        self.push(newChunk)
        callback()
      }).catch(callback)
    }
  );
};

module.exports = gaDataTransform;
