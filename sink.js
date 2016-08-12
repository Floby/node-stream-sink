const Stream = require('stream')
const Writable = Stream.Writable
const WritableState = Writable.WritableState
const EventEmitter = require('events').EventEmitter

module.exports = Sink

function Sink (objectMode) {
  let _resolve, _reject
  const sink = new Promise((resolve, reject) => {
    _resolve = resolve
    _reject = reject
  })
  mixinMethods(sink, Writable.prototype)
  mixinMethods(sink, EventEmitter.prototype)
  WritableCtor.call(sink, {objectMode: Boolean(objectMode)})

  const accumulator = []

  sink._write = (chunk, encoding, written) => {
    accumulator.push(chunk)
    written()
  }
  sink.on('finish', () => _resolve(objectMode ? accumulator : accumulator.join('')))
  sink.on('error', _reject)
  return sink
}

function mixinMethods (sink, prototype) {
  Object.keys(prototype).forEach(method => {
    sink[method] = prototype[method]
  })
}

function WritableCtor (options) {
  this._writableState = new WritableState(options, this)
  this.writable = true
  Stream.call(this)
}
