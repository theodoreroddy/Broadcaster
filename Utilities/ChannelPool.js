const Log = require('./Log.js')
const tag = __filename.split('/').pop()
const { Segmenter } = require('../Classes/Segmenter.js')

var pool = null

module.exports = () => {
  return pool ? pool : pool = new ChannelPool()
}

class ChannelPool {

  constructor() {
    this.queue = []
    Log(tag, null, 'Channel Pool created.')
  }

  addChannel(channel) {
    this.queue.push(channel)
    const segmenter = new Segmenter(channel)
    segmenter.queue=[]
    channel.stage(segmenter)
    Log(tag, channel, 'Added to channel pool.')
  }

  broadcast() {
    this.queue.forEach((channel) => channel.timeline.start())
  }

}
