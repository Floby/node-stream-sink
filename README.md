[![Build Status](https://travis-ci.org/Floby/node-stream-sink.png)](https://travis-ci.org/Floby/node-stream-sink)

stream-sink
===========

> Collect all data piped to this stream when it closes

Installation
------------

    npm install --save stream-sink

Usage
-----

```javascript
const sink = require('stream-sink')
readable.pipe(sink()).then((data) => {
    // `data` is a String
})
```

Or with `objectMode: true`

```javascript
const sink = require('stream-sink')
readable.pipe(sink.object()).then((data) => {
    // `data` is an Array
})
```

You can also handle errors in the upstream

```javascript
const sink = require('stream-sink')
readable.pipe(sink({ upstreamError: true })).catch((error) => {
    // `error` is the original error
})
readable.emit('error', Error('some error'))
```

##### 

License
-------

[MIT](http://opensource.org/licenses/MIT)

Copyright (c) 2018 Florent Jaby

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
