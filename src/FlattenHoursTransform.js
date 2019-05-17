
const { Transform } = require('stream')
const dot = require('dot-object')

class FlattenHoursTransform extends Transform {
  constructor () {
    super({
      objectMode: true,
      writableObjectMode: true
    })
  }

  _transform (chunk, encoding, cb) {
    const flattened = flattenHours(chunk)
    flattened.map((row) => {
      this.push(row)
    })
    cb()
  }

  _flush (cb) {
    cb()
  }
}

const flattenHours = (gaCoordinateJsonAsObject) => {
  const flattened = []
  gaCoordinateJsonAsObject.rows.map((rows) => {
    const substringEnd = gaCoordinateJsonAsObject.selfLink.search("&start-date");
    flattened.push(dot.dot({
      query: gaCoordinateJsonAsObject.selfLink.substring(127,substringEnd),
      data: rows
    }))
  })
  return flattened
}

module.exports = FlattenHoursTransform
