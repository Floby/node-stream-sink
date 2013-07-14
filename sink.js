var util = require('util');
var EventEmitter = require('events').EventEmitter;

function Sink (options) {
    if(!(this instanceof Sink)) return new Sink(options)
    options = options || {};
    EventEmitter.call(this);
    this._objectMode = options ? options.objectMode : null;
    this._result = [];
    this.on('finish', function() {
      if(this._objectMode) {
        this.emit('data', this._result);
      }
      else {
          this.emit('data', this._result.join(''));
      }
    });
    this.writable = true;
}
util.inherits(Sink, EventEmitter);

Sink.prototype.write = function write(chunk, encoding, callback) {
    if(!this._objectMode) {
        chunk = chunk.toString();
    }
    this._result.push(chunk);
    if(typeof callback === 'function') callback();
    return true;
};

Sink.prototype.end = function end(chunk, encoding, callback) {
  if(arguments.length) {
    this.write(chunk, encoding, callback);
  }
  process.nextTick(this.emit.bind(this, 'finish'));
  return true;
}

module.exports = Sink;
