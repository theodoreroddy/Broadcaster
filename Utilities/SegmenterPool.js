const Bash = require('child_process').execSync
const Log = require('./Log.js')
const path = require('path')
const tag = path.basename(__filename)

var pool = null

module.exports = () => {
  return pool ? pool : pool = new SegmenterPool()
}

class SegmenterPool {

  constructor(queue) {
    this.queue = []
    Log(tag, null, 'Segmenter Pool created.')
  }

  addSegmenter(segmenter) {
    this.queue.push(segmenter)
    segmenter.start()
    Log(tag, null, 'Added to the segmenter pool.')
  }

  flush() {
    Log(tag, null, 'Cleaning up previous session...')
    Bash('mv channels/static . &')
    Bash('rm -r channels/* > /dev/null &')
    Bash('mv static channels/ &')
  }

}
