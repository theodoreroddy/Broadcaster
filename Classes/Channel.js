const SegmenterPool = require('../Utilities/SegmenterPool.js')
const Format = require('../Utilities/FormatValidator.js')
const { Segmenter } = require('../Classes/Segmenter.js')
const Bash = require('child_process').execSync
const { Timeline } = require('./Timeline.js')
const Log = require('../Utilities/Log.js')
const tag = __filename.split('/').pop()


function Channel(channel) {

  Log(tag, channel, `Building the queue...`)

  this.timeline = new Timeline()
  this.type = channel.type
  this.name = channel.name
  this.slug = channel.slug
  this.queue = []
  this.currentPlaylistIndex = -1

  this.stage = (segmenter) => {

    this.currentPlaylistIndex = this.currentPlaylistIndex + 1
    SegmenterPool().addSegmenter(segmenter)
      .then(this.timeline.start)
      .catch(err => {
        Log(tag, this, `Error adding segmenter to pool: ${err}`)
      })

  }

  channel.paths.forEach((path) =>{

    var x = 0
    Bash(`find "${path}" -type f`).toString().split('\n').forEach((file) => {
      const array = file.split('.')
      const last = array.pop()
      if (Format.isSupported(file)) this.queue.push(file)
      x++
    })
    Log(tag, channel, `Found ${x} files in ${path}`)

    if (channel.type == 'shuffle') this.queue.sort(() => Math.random() - 0.5)

  })

  Log(tag, channel, `Completed initializing ${channel.type} channel "${channel.name}" with ${this.queue.length} supported videos.`)

}

module.exports = {
  Channel: Channel
}
