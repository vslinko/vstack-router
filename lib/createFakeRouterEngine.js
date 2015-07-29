/* @flow */

import composeMiddlewares from './composeMiddlewares'

import type {Router} from './createRouter'

import type {
  Location,
  Listener,
  Unsubscriber,
  Subscriber,
  Middleware,
  MiddlewareHandler
} from './types'

export type RouterEngine = {
  subscribe: Subscriber<Location>,
  navigateTo: (location: Location) => Promise<Location>,
  run: () => Promise<Location>
}

type FakeRouterEngineCreator = (router: Router, middlewares: Array<Middleware<Location>>) => RouterEngine

export default function createFakeRouterEngine(router: Router, middlewares: Array<Middleware<Location>> = []): RouterEngine {
  var listeners: Array<Listener<Location>> = []
  var currentUrl: Location = '/'

  function subscribe(listener: Listener<Location>): Unsubscriber {
    listener(currentUrl)

    listeners.push(listener)

    return function unsubscribe(): void {
      listeners = listeners.filter(l => l !== listener)
    }
  }

  function execute(location: Location): Promise<Location> {
    currentUrl = location

    return router.navigateTo(currentUrl)
      .then(function(): Location {
        listeners.forEach(listener => listener(currentUrl))

        return currentUrl
      })
  }

  var dispatch: MiddlewareHandler<Location> = composeMiddlewares(middlewares, execute)

  function navigateTo(location: Location): Promise<Location> {
    return dispatch(location)
  }

  function run(): Promise<Location> {
    return navigateTo(currentUrl)
  }

  return {
    subscribe,
    navigateTo,
    run
  }
}
