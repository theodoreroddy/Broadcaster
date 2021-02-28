const Log = require('../Utilities/Log.js')

const { parentPort } = require('worker_threads');
parentPort.on('message', (task) => {
  parentPort.postMessage(task.a + task.b);
});
