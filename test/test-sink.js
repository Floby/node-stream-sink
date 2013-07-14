var sink = require('../');

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
