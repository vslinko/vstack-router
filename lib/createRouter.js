/* @flow */

import type {
  Screen,
  Location,
  Transition,
  Listener,
  Unsubscriber,
  Subscriber
} from './types'

export type Router = {
  subscribe: Subscriber<Screen>,
  navigateTo: Transition
}

type RouterCreator = (transition: Transition) => Router

export default function createRouter(transition: Transition): Router {
  var listeners: Array<Listener<Screen>> = []
  var currentScreen: ?Screen

  function subscribe(listener: Listener<Screen>): Unsubscriber {
    listener(currentScreen)

    listeners.push(listener)

    return function unsubscribe(): void {
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
    subscribe,
    navigateTo
  }
}
