const stream = require('stream')
const expect = require('chai').expect
const Sink = require('../sink')

describe('sink()', () => {
  let sink
  beforeEach(() => { sink = new Sink() })
  it('is a promise', () => {
    expect(sink).to.be.an.instanceOf(Promise)
  })

  it('can be piped to', (done) => {
    const source = fromString('hello world!')
    source.pipe(sink)
    source.on('finish', () => {
      done()
    })
  })

  describe('when piped some content', () => {
    it('resolves to the aggregate of the content', () => {
      const source = fromString('hello world!')
      return source.pipe(sink).then((data) => {
        expect(data).to.equal('hello world!')
      })
    })

    describe('and an error occurs', () => {
      it('rejects with the error', () => {
        const error = Error('my error');
        const source = stream.PassThrough()
        setTimeout(() => { sink.emit('error', error) }, 5)
        return source.pipe(sink).then(() => {
          throw Error('this should not resolve')
        }).catch(e => expect(e).to.equal(error))
      })
    })
  })
})

describe('sink("object")', () => {
  let sink
  beforeEach(() => { sink = new Sink('object') })
  it('is a promise', () => {
    expect(sink).to.be.an.instanceOf(Promise)
  })

  it('can be piped to', (done) => {
    const source = fromString('hello world!')
    source.pipe(sink)
    source.on('finish', () => {
      done()
    })
  })

  describe('when piped some content', () => {
    it('resolves to an array of the content', () => {
      const source = stream.PassThrough({objectMode: true})
      source.write({a: 'hello'})
      source.end({b: 'world'})
      return source.pipe(sink).then((data) => {
        expect(data).to.deep.equal([{a: 'hello'}, {b: 'world'}])
      })
    })

    describe('and an error occurs', () => {
      it('rejects with the error', () => {
        const error = Error('my error');
        const source = stream.PassThrough()
        setTimeout(() => { sink.emit('error', error) }, 5)
        return source.pipe(sink).then(() => {
          throw Error('this should not resolve')
        }).catch(e => expect(e).to.equal(error))
      })
    })
  })
})



function fromString (content) {
  const str = stream.PassThrough()
  str.end(content)
  return str
}
