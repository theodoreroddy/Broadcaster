const ChannelPool = require('./Utilities/ChannelPool.js')
const { Channel } = require('./Classes/Channel.js')
const Log = require('./Utilities/Log.js')
const tag = __filename.split('/').pop()
const FS = require('fs')

try {
  require('dotenv').config({ path: './config.txt' })
  Log(tag, null, 'Reading config...')
  var channels = FS.readFileSync(process.argv[2])
  try {
    channels = JSON.parse(channels)
    Log(tag, null, `Found ${channels.length} channel definitions:`)
    console.log(channels)
    channels.forEach((item) => {
      const channel = new Channel(item)
      ChannelPool().addChannel(channel)
    })
    ChannelPool().broadcast()
  } catch(e) {
    Log(tag, null, 'Error processing channel list: ' + e)
  }
} catch(e) {
  Log(tag, null, 'Error processing config.txt: ' + e)
}
