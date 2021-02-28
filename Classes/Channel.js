const SegmenterPool = require('../Utilities/SegmenterPool.js')
const Format = require('../Utilities/FormatValidator.js')
const { Segmenter } = require('../Classes/Segmenter.js')
const Bash = require('child_process').execSync
const { Timeline } = require('./Timeline.js')
const Log = require('../Utilities/Log.js')
const path = require('path') 
const tag = path.basename(__filename)

function Channel(channel) {

  Log(tag, channel, `Building the queue...`)
  
  this.timeline = new Timeline()
  this.type = channel.type
  this.name = channel.title
  this.slug = channel.slug
  this.queue = []
  this.currentPlaylistIndex = -1

  this.stage = async () => {

    SegmenterPool().addSegmenter(new Segmenter(this))
      .then(this.timeline.start)
      .catch(err => {
        Log(tag, channel, `Error adding segmenter to pool: ${err}`)
      })

    Log(tag, channel, 'Segmenter added to SegmenterPool')

  }

  channel.paths.forEach((path) =>{

    var x = 0
    Bash(`find "${path}" -type f`).toString().split('\n').forEach((file) => {
      const array = file.split('.')
      const last = array.pop()
      if (Format.isSupported(file)) this.queue.push(file)
      x++
    })
    Log(tag, channel, `Found ${x} supported videos in ${path}`)

    if (channel.type == 'shuffle') this.queue.sort(() => Math.random() - 0.5)

  })

  Log(tag, channel, `Completed initializing ${channel.type} channel "${channel.title}" with ${this.queue.length} items.`)

}

module.exports = {
  Channel: Channel
}