const Log = require('./Log.js')
const Bash = require('child_process').execSync

module.exports = () => {
  Log('INFO: Cleaning up previous session...')
  Bash('mv channels/static . &')
  Bash('rm -r channels/* > /dev/null &')
  Bash('mv static channels/ &')
}
