require('dotenv').config({ path: `./config.txt` })
const ChannelPool = require('./Utilities/ChannelPool.js')
const { Channel } = require('./Classes/Channel.js')
const Bash = require('child_process').execSync
const Log = require('./Utilities/Log.js')
const tag = "Main"
const fs = require('fs')
const TelevisionUI = require('./Webapp/TelevisionUI.js')
const { CACHE_DIR, CHANNEL_LIST } = process.env

const cleanup = () => {
  Log(tag, 'Cleaning up ...')
  try {
    Bash('rm -r ./Webapp/channels/* 2> /dev/null &')
    Bash(`rm -r ${CACHE_DIR}/broadcaster* 2> /dev/null &`)
  } catch (e) {
    Log(tag, 'Bash emitted an error: ' + e)
  }
  Log(tag, 'Bye now.')
}

process.on('SIGINT', _ => {
  cleanup()
  process.exit(0)
})

try {
  require('dotenv').config({ path: `./config.txt` })
  var channels = fs.readFileSync(`.${CHANNEL_LIST}`)
} catch(e) { 
  Log(tag, `Couldn't read the file you provided... ${e}`) 
}

try {
  channels = JSON.parse(channels)
  Log(tag, `Found ${channels.length} channel definition${channels.length>1?'s':''}:`)
} catch(e) { 
  Log(tag, 'Unable to process channel list: ' + e) 
}

try {
  channels.forEach(definition => {
    const channel = new Channel(definition)
    ChannelPool().addChannel(channel)
  })
} catch (e) { 
  Log(tag, 'Unable to start the segmenters: ' + e) 
}

try { 
  const ui = TelevisionUI().start(ChannelPool())
} catch (e) { 
  Log(tag, 'Unable to start the TV UI: ' + e) 
}

try { 
  ChannelPool().startBroadcast() 
} catch (e) { 
  Log(tag, 'Unable to start the broadcast: ' + e) 
}
