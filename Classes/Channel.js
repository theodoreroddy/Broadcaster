const Format = require('../Utilities/FormatValidator.js')
const { Timeline } = require('./Timeline.js')
const Bash = require('child_process').execSync
const Log = require('../Utilities/Log.js')

function Channel(channel) {

  Log(`${channel.slug.toUpperCase()}: Building the queue...`)

  this.timeline = new Timeline()
  this.type = channel.type
  this.name = channel.title
  this.slug = channel.slug
  this.queue = []

  this.stage = () => {
    Log(`${channel.slug.toUpperCase()}: Add new Segmenter to the SegmenterPool...`)
    // SegmenterPool.addSegmenter(new Segmenter(this))
    //   .then(this.timeline.start)
    //   .catch(err => {
    //     //
    //   }) 
  }

  channel.paths.forEach((path) =>{

    var x = 0
    Bash(`find "${path}"`).toString().split('\n').forEach((file) => {
      const array = file.split('.')
      const last = array.pop()
      if (array.length > 0 && last.length >= 3 && last.length <= 4) {
        if (Format.isSupported(file)) this.queue.push(file)
        x++
      }
    })
    Log(`${channel.slug.toUpperCase()}: Found ${x} supported videos in ${path}`)

    if (channel.type == 'shuffle') this.queue.sort(() => Math.random() - 0.5)

  })

  Log(`${channel.slug.toUpperCase()}: Completed initializing ${channel.type} channel "${channel.title}" with ${this.queue.length} items.`)

}

module.exports = {
  Channel: Channel
}