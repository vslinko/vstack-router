/* @flow */

import type {
  Screen,
  Location,
  History,
  Transition,
  Listener,
  Unlisten,
  Router
} from './types'

export default function createRouter(history: History, transition: Transition): Router {
  var listeners: Array<Listener<[Location, Screen]>> = []
  var queue: Array<Location> = []
  var waiting: Array<Function> = []
  var inProcess: boolean = false

  function listen(listener: Listener<[Location, Screen]>): Unlisten {
    listeners.push(listener)

    return function unlisten(): void {
      listeners = listeners.filter(l => l !== listener)
    }
  }

  function navigateTo(location: Location): Promise<void> {
    return transition(location)
      .then(function (screen: ?Screen): ?Screen {
        listeners.forEach(listener => {
          if (screen) {
            listener([location, screen])
          }
        })
      })
  }

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
    navigateTo(location)
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

  history.listen(location => {
    // Reset the queue to skip unreachable transitions
    queue = [location]
    processQueue()
  })

  return {
    listen,
    waitQueue
  }
}
