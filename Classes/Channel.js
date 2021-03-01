const SegmenterPool = require('../Utilities/SegmenterPool.js')
const Format = require('../Utilities/FormatValidator.js')
const { Segmenter } = require('../Classes/Segmenter.js')
const Bash = require('child_process').execSync
const { Timeline } = require('./Timeline.js')
const Log = require('../Utilities/Log.js')
const fs = require('fs')
const tag = 'Channel'

function Channel(definition) {

  Log(tag, `Building the queue...`, definition)

  this.timeline = new Timeline(this)
  this.type = definition.type
  this.name = definition.name
  this.slug = definition.slug
  this.queue = []
  this.currentPlaylistIndex = -1

  definition.paths.forEach(path => {
    
    var x = 0
    Bash(`find "${path}" -type f`).toString().split('\n').forEach(file => {
      const array = file.split('.')
      const last = array.pop()
      if (Format.isSupported(file)) {
        this.queue.push(file)
        x++
      }
    })
    Log(tag, `Found ${x} supported files in ${path}`, this)

    if (definition.type == 'shuffle') this.queue.sort(() => Math.random() - 0.5)

  })
  
  this.segmenter = (() => {
    SegmenterPool().addSegmenter(new Segmenter(this))
    .then(data => {
      this.timeline.start
    }).catch(err => {
      Log(tag, `Error adding segmenter to pool: ${err}`, this)
    })
  })()

  Log(tag, `Finished initializing ${definition.type} channel "${definition.name}" with ${this.queue.length} supported videos.`, this)

}

module.exports = {
  Channel: Channel
}
