/* @flow */

import type {
  Screen,
  Location,
  Transition,
  Listener,
  Unlisten,
  Router
} from './types'

export default function createRouter(transition: Transition): Router {
  var listeners: Array<Listener<Screen>> = []
  var currentScreen: ?Screen

  function notifyListener(listener: Listener<Screen>) {
    if (currentScreen) {
      listener(currentScreen)
    }
  }

  function listen(listener: Listener<Screen>): Unlisten {
    notifyListener(listener)

    listeners.push(listener)

    return function unlisten(): void {
      listeners = listeners.filter(l => l !== listener)
    }
  }

  function navigateTo(location: Location): Promise<?Screen> {
    return transition(location)
      .then(function (screen: ?Screen): ?Screen {
        currentScreen = screen

        listeners.forEach(notifyListener)

        return currentScreen
      })
  }

  return {
    listen,
    navigateTo
  }
}
