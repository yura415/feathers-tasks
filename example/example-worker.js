'use strict'

const Worker = require('../src').Worker

class ExampleWorker extends Worker {
  constructor (options) {
    super(options)
  }

  async process () {
    console.log('hello from example worker')

    this.payload.someData = 123
    await this.job.update(this.payload)

    const result = await this.app.service('example-task').find({
      query: {
        $type: 'active',
      },
      paginate: false,
    })

    for (let job of result) {
      if (job.id === this.job.id) console.log('i think i just found myself!')
    }

    return result.data
  }
}
