'use strict'
const Stream = require('stream')
const Writable = Stream.Writable
const WritableState = Writable.WritableState
const EventEmitter = require('events').EventEmitter

module.exports = Sink

function Sink (options) {
  let _resolve, _reject
  const sink = new Promise((resolve, reject) => {
    _resolve = resolve
    _reject = reject
  })
  if (typeof options !== 'object') {
    options = { objectMode: Boolean(options) }
  }
  mixinMethods(sink, Writable.prototype)
  mixinMethods(sink, EventEmitter.prototype)
  WritableCtor.call(sink, {objectMode: Boolean(options.objectMode)})

  const accumulator = []

  sink._write = (chunk, encoding, written) => {
    accumulator.push(chunk)
    written()
  }
  sink.on('finish', () => _resolve(options.objectMode ? accumulator : accumulator.join()))
  sink.on('error', _reject)
  if (options.upstreamError) {
    sink.on('pipe', (source) => {
      source.on('error', _reject)
    })
  }

  return sink
}
Sink.object = function () {
  return Sink({ objectMode: true })
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
