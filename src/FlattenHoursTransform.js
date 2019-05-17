
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
  gaCoordinateJsonAsObject.rows.data.map((rows) => {
    flattened.push(dot.dot({
      latitude: darkSkyCoordinateJsonAsObject.latitude,
      longitude: darkSkyCoordinateJsonAsObject.longitude,
      rows: rows,
      // day: darkSkyCoordinateJsonAsObject.daily.data[0]
    }))
  })
  return flattened
}

module.exports = FlattenHoursTransform
