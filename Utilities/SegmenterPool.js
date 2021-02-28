const Bash = require('child_process').execSync
const Log = require('./Log.js')
const tag = __filename.split('/').pop()

var pool = null

class SegmenterPool {

  constructor(queue) {
    Log(tag, null, 'Segmenter Pool created.')
    this.queue = []
  }

  addSegmenter(segmenter) {
    return new Promise((resolve, reject) => {
      segmenter.start()
      this.queue.push(segmenter)
      Log(tag, null, 'Added to the segmenter pool.')
      resolve()
    })
  }

  flush() {
    Log(tag, null, 'Cleaning up previous session...')
    Bash('mv channels/static . &')
    Bash('rm -r channels/* > /dev/null &')
    Bash('mv static channels/ &')
  }

}

module.exports = () => {
  return pool ? pool : pool = new SegmenterPool()
}
