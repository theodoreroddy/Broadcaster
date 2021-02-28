const ChannelPool = require('./Utilities/ChannelPool.js')
const { Channel } = require('./Classes/Channel.js')
const Log = require('./Utilities/Log.js')
const FS = require('fs')
const Cleanup = require('./Utilities/Cleanup.js')
require('dotenv').config()

process.on('exit', Cleanup)

Log('Reading config...')
var config = FS.readFileSync('./channels.json')

try {

  config = JSON.parse(config)
  Log(`Found ${config.length} in the config.`)
  config.forEach((item) => {
    const channel = new Channel(item)
    ChannelPool().addChannel(channel)
  })
  ChannelPool().broadcast()

} catch(e) {

  Log('Error processing config.json: ' + e)

}
