const Log = require('../Utilities/Log.js')

function Timeline(startTime, started) {
  
  this.startTime = -1
  this.started = false

  this.start = () => {
    started = true
    startTime = Date.now()
    Log(`${channel.slug.toUpperCase()}: Broadcast has begun...`)
  }

  getTimeOffset = () => {
    return this.started ? Date.now() - startTime : -1
  }

}

module.exports = {
  Timeline: Timeline
}
