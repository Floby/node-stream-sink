var sink = require('../');
var stream = require('stream');
var domain = require('domain');

if(!stream.PassThrough) {
  stream.PassThrough = function PassThrough() {
    stream.Stream.call(this);
    this.writable = true;
    this.readable = true;
  }
  require('util').inherits(stream.PassThrough, stream.Stream);
  stream.PassThrough.prototype.write = function (chunk, encoding, done) {
    done = done || function () {};
    var self = this;
    process.nextTick(function () {
      self.emit('data', chunk);
      done();
    });
  }
  stream.PassThrough.prototype.end = function (chunk, encoding, done) {
    if(chunk) {
      var self = this;
      this.write(chunk, encoding, function () {
        self.emit('finish');
        self.emit('end');
      });
    }
    else {
      this.emit('finish');
      this.emit('end');
    }
  }
}

Function.prototype.withDomain = function(withStack) {
  var fn = this;
  return function(test) {
    var d = domain.create();
    d.on('error', function(e) {
      test.fail('test failed with ' + e.message);
      if(withStack) {
        console.error(e.stack)
      }
      test.done();
    });
    d.run(fn.bind(this, test));
  }
}


exports['empty stream should call end with zero length value'] = function (test) {
  var s = sink();
  test.expect(1);
  s.on('data', function(data) {
    test.equal(0, data.length, "We should get a zero length string");
    test.done();
  });
  s.end();
}

exports['a single end call with data should give the same data'] = function (test) {
  var s = sink();
  test.expect(1);
  s.on('data', function(data) {
    test.equal('hello world', data, "Data should be what we input");
    test.done();
  });
  s.end('hello world');
}

exports['two separate calls to write and one to end should give the concatenated contents'] = function (test) {
  var s = sink();
  test.expect(1);
  s.on('data', function(data) {
    test.equal('hello world', data, "Data should be what we input");
    test.done();
  });
  s.write('hello ');
  s.write('world');
  s.end();
}

exports['calling write with empty data should give a zero length result'] = function (test) {
  var s = sink();
  test.expect(1);
  s.on('data', function(data) {
    test.equal('', data, "Data should be an empty string");
    test.done();
  });
  s.write('');
  s.end();
}

exports['asynchronous calls'] = function (test) {
  var s = sink();
  test.expect(1);
  s.on('data', function(data) {
    test.equal('hello world', data, "data should be what we input");
    test.done();
  });
  setTimeout(s.write.bind(s, "hello "), 10);
  setTimeout(s.end.bind(s, "world"), 20);
}

exports['piping to sink (so buffers)'] = function (test) {
  var s = sink();
  var source = new stream.PassThrough();
  test.expect(1);
  source.pipe(s).on('data', function(data) {
    test.equal('hello world', data);
    test.done();
  });
  setTimeout(source.write.bind(source, 'hello '), 5);
  setTimeout(source.end.bind(source, 'world'), 10);
}

exports['when in object mode, data should be an array'] = function (test) {
  var s = sink({objectMode: true});
  test.expect(3);
  s.on('data', function(data) {
    test.ok(Array.isArray(data), "Data should be an array");
    test.equal(2, data.length, "Data should have a length of two");
    test.equal('hello world', [].join.call(data, ''));
    test.done();
  });

  s.write('hello ');
  s.end('world');
}
