const Log = require('../Utilities/Log.js')
const tag = 'Timeline'

function Timeline(channel, startTime, started) {

  this.startTime = -1
  this.started = false
  this.channel = channel

  this.start = () => {
    this.started = true
    this.startTime = Date.now()
    Log(tag, 'Timeline started.', this.channel)
  }

  getTimeOffset = () => {
    return this.started ? Date.now() - startTime : -1
  }

}

module.exports = {
  Timeline: Timeline
}
