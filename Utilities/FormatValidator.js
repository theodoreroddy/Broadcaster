const Log = require('./Log.js')
const tag = 'FormValidator'

// Checks the given file against the SUPPORTED_FORMATS list
module.exports = {
    isSupported: file => {
      var valid = false
      try {
        const ext = file.split('.').pop()
        process.env.SUPPORTED_FORMATS.split(',')
          .forEach(format => {
          if (ext == format) {
            valid = true
          }
        })
      } catch(e) {
        Log(tag, `Unable to validate file format for ${file}: ${e}`)
      }
      return valid
    }
}
