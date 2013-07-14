var util = require('util');
var stream = require('stream');

function Sink (options) {
    if(!(this instanceof Sink)) return new Sink()
    options = options || {};
    stream.Writable.call(this, options);
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
}
util.inherits(Sink, stream.Writable);

Sink.prototype._write = function _write(chunk, encoding, callback) {
    if(!this._objectMode) {
        chunk = chunk.toString();
    }
    this._result.push(chunk);
    return callback();
};

module.exports = Sink;
