const Log = require('./Log.js')

var pool = null

module.exports = () => {
  return pool ? pool : pool = new ChannelPool()
}

class ChannelPool {
  constructor(queue) {
    this.queue = []
    Log(`INFO: Channel Pool created.`)
  }
  addChannel(channel) {
    Log(`${channel.slug.toUpperCase()}: Added to channel pool.`)
    this.queue.push(channel)
    channel.stage()
  }
  broadcast() {
    this.queue.forEach((channel) => channel.go())
  }
}
