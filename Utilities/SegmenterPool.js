const Bash = require('child_process').execSync
const Log = require('./Log.js')
const { CACHE_DIR } = process.env
const tag = 'SegmenterPool'

var pool = null

class SegmenterPool {

  constructor(queue) {
    Bash(`mkdir ${CACHE_DIR}/broadcaster && mkdir ${CACHE_DIR}/broadcaster/channels &`)
    Log(tag, 'Segmenter Pool created.')
    this.queue = []
  }

  addSegmenter(segmenter) {
    return new Promise((resolve, reject) => {
      this.queue.push(segmenter)
      Log(tag, 'Added to the segmenter pool.')
      resolve()
    })
  }

}

module.exports = () => {
  return pool ? pool : pool = new SegmenterPool()
}
