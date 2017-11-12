const feathers = require('feathers')
const rest = require('feathers-rest')
const socketio = require('feathers-socketio')
const handler = require('feathers-errors/handler')
const bodyParser = require('body-parser')
const service = require('../src')

// Create a feathers instance.
const app = feathers()
// Enable Socket.io
  .configure(socketio())
  // Enable REST services
  .configure(rest())
  // Turn on JSON parser for REST services
  .use(bodyParser.json())
  // Turn on URL-encoded parser for REST services
  .use(bodyParser.urlencoded({ extended: true }))

app.use('/example-task', service({
  name: 'example-task',
  paginate: {
    default: 10,
    max: 50,
  },
  concurrency: 10,
  queueOptions: {
    settings: {
      stalledInterval: 30 * 1000,
      maxStalledCount: 5,
    },
  },
  jobOptions: {
    attempts: 3,
    delay: 5000,
    backoff: {
      type: 'fixed',
      delay: 10000,
    },
    removeOnComplete: true,
    removeOnFail: true,
  },
  workerClass: require('./example-worker'),
}))

app.use(handler())

// Start the server
const server = app.listen(3030)
server.on('listening', function () {
  console.log('Feathers Tasks service running on 127.0.0.1:3030')
})
