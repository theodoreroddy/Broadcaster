module.exports = async (tag, channel, message) => {
  const time = new Date().toUTCString()
  if (process.env.LOG_LEVEL == 'verbose') {
    channel != undefined ?
      console.log(`${time}: Broadcaster | ${channel.title} | ${tag} | ${message}`)
      : console.log(`${time}: Broadcaster | ${tag} | ${message}`)
  }
}
