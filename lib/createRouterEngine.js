/* @flow */

import composeMiddlewares from './util/composeMiddlewares'

import type {
  Router,
  RouterEngine,
  History,
  Location,
  Middleware,
  MiddlewareHandler
} from './types'

export default function createRouterEngine(router: Router, history: History, middlewares: Array<Middleware<Location>> = []): RouterEngine {
  var queue: Array<Location> = []
  var waiting: Array<Function> = []
  var inProcess: boolean = false

  function execute(location: Location): Promise<Location> {
    return router.navigateTo(location)
      .then(function(): Location {
        return location
      })
  }

  var dispatch: MiddlewareHandler<Location> = composeMiddlewares(
    middlewares,
    execute
  )

  function processQueue() {
    if (inProcess) {
      return
    }

    if (queue.length === 0) {
      waiting.forEach(resolve => resolve())
      waiting = []
      return
    }

    var location: Location = queue.shift()
    inProcess = true
    dispatch(location)
      .then(() => {
        inProcess = false
        processQueue()
      })
      .catch((error) => {
        console.error(error.stack)
        inProcess = false
        processQueue()
      })
  }

  function waitQueue(): Promise<void> {
    return new Promise(resolve => {
      waiting.push(resolve)
    })
  }

  function run(): void {
    history.listen(location => {
      // Reset the queue to skip unreachable transitions
      queue = [location]
      processQueue()
    })
  }

  return {
    waitQueue,
    run
  }
}
