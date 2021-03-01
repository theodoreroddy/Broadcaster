module.exports = async (tag, message, channel) => {
  const time = new Date().toUTCString()
  if (process.env.LOG_LEVEL == 'verbose') {
    channel != undefined ?
      console.log(`${time}: ${channel.name} - ${tag} - ${message}`)
      : console.log(`${time}: Info - ${tag} - ${message}`)
  }
}
