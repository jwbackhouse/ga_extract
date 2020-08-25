const { Transform } = require('stream');
const dot = require('dot-object');

class FlattenHoursTransform extends Transform {
  constructor () {
    super({
      objectMode: true,
      writableObjectMode: true
    });
  }

  _transform (chunk, encoding, cb) {
    const flattened = flattenHours(chunk);
    flattened.map((row) => {
      this.push(row);
    });
    cb();
  }

  _flush (cb) {
    cb();
  }
}

const flattenHours = (gaTermJsonAsObject) => {
  const flattened = [];
  gaTermJsonAsObject.rows.map((rows) => {
    const subStringStart = +(gaTermJsonAsObject.selfLink.search('pagePath') + 12);  // start of search term string
    const substringEnd = gaTermJsonAsObject.selfLink.search('&start-date');  // end of search term string
    flattened.push(dot.dot({
      'search_term': gaTermJsonAsObject.selfLink.substring(subStringStart,substringEnd),
      data: rows
    }));
  });
  return flattened;
};

module.exports = FlattenHoursTransform;
