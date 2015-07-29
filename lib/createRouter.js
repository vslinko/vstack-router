/* @flow */

import type {
  Screen,
  Location,
  Transition,
  Listener,
  Unlisten,
  Listen
} from './types'

export type Router = {
  listen: Listen<Screen>,
  navigateTo: Transition
}

type RouterCreator = (transition: Transition) => Router

export default function createRouter(transition: Transition): Router {
  var listeners: Array<Listener<Screen>> = []
  var currentScreen: ?Screen

  function listen(listener: Listener<Screen>): Unlisten {
    listener(currentScreen)

    listeners.push(listener)

    return function unlisten(): void {
      listeners = listeners.filter(l => l !== listener)
    }
  }

  function navigateTo(location: Location): Promise<?Screen> {
    return transition(location)
      .then(function (screen: ?Screen): ?Screen {
        currentScreen = screen

        listeners.forEach(listener => listener(currentScreen))

        return currentScreen
      })
  }

  return {
    listen,
    navigateTo
  }
}
