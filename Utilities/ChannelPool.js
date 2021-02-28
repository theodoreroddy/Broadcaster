const Log = require('./Log.js')
const path = require('path') 
const tag = path.basename(__filename)

var pool = null

module.exports = () => {
  return pool ? pool : pool = new ChannelPool()
}

class ChannelPool {
  constructor(queue) {
    this.queue = []
    Log(tag, null, 'Channel Pool created.')
  }
  addChannel(channel) {
    Log(tag, channel, 'Added to channel pool.')
    this.queue.push(channel)
    channel.stage().then(() => {
      Log(tag, null, '')
    })
  }
  broadcast() {
    this.queue.forEach((channel) => channel.stage())
  }
}
