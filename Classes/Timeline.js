const Log = require('../Utilities/Log.js')
const path = require('path')
const tag = path.basename(__filename)

function Timeline(startTime, started) {

  this.startTime = -1
  this.started = false

  this.start = () => {
    started = true
    startTime = Date.now()
    Log(tag, channel, 'Broadcast has begun...')
  }

  getTimeOffset = () => {
    return this.started ? Date.now() - startTime : -1
  }

}

module.exports = {
  Timeline: Timeline
}
