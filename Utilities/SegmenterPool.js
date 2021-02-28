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
    return new Promise((resolve,reject,error) => {
      if (error) {
        reject(error)  // calling `reject` will cause the promise to fail with or without the error passed as an argument
        return        // and we don't want to go any further
      }
      this.queue.push(segmenter)
      segmenter.start()
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
