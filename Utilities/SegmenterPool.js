const Bash = require('child_process').execSync
const Log = require('./Log.js')
const { CACHE_DIR } = process.env
const tag = 'SegmenterPool'

module.exports = () => {
  return pool
}

class SegmenterPool {

  constructor(queue) {
    Bash(`mkdir ${CACHE_DIR}/broadcaster && mkdir ${CACHE_DIR}/broadcaster/channels &`)
    Log(tag, 'Segmenter Pool created.')
    this.queue = []
    setInterval(async _=>{
      this.queue.forEach(segmenter => segmenter.flush())
    },process.env.FLUSH_INTERVAL_MINUTES*60*1000)
  }

  addSegmenter(segmenter) {
    return new Promise((resolve, reject) => {
      this.queue.push(segmenter)
      Log(tag, 'Added to the segmenter pool.')
      resolve()
    })
  }

}

var pool = new SegmenterPool()
