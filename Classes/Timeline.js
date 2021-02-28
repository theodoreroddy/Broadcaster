const Log = require('../Utilities/Log.js')
const tag = 'Timeline'

function Timeline(startTime, started) {

  this.startTime = -1
  this.started = false

  this.start = () => {
    started = true
    startTime = Date.now()
    Log(tag, 'Broadcast has begun...', channel)
  }

  getTimeOffset = () => {
    return this.started ? Date.now() - startTime : -1
  }

}

module.exports = {
  Timeline: Timeline
}
