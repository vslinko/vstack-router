/* @flow */

import composeMiddlewares from './composeMiddlewares'

import type {Router} from './createRouter'

import type {
  Url,
  Listener,
  Unsubscriber,
  Subscriber,
  Middleware,
  MiddlewareHandler
} from './types'

export type RouterEngine = {
  subscribe: Subscriber<Url>,
  navigateTo: (url: Url) => Promise<Url>,
  run: () => Promise<Url>
}

type FakeRouterEngineCreator = (router: Router, middlewares: Array<Middleware<Url>>) => RouterEngine

export default function createFakeRouterEngine(router: Router, middlewares: Array<Middleware<Url>> = []): RouterEngine {
  var listeners: Array<Listener<Url>> = []
  var currentUrl: Url = '/'

  function subscribe(listener: Listener<Url>): Unsubscriber {
    listener(currentUrl)

    listeners.push(listener)

    return function unsubscribe(): void {
      listeners = listeners.filter(l => l !== listener)
    }
  }

  function execute(url: Url): Promise<Url> {
    currentUrl = url

    return router.navigateTo(currentUrl)
      .then(function(): Url {
        listeners.forEach(listener => listener(currentUrl))

        return currentUrl
      })
  }

  var dispatch: MiddlewareHandler<Url> = composeMiddlewares(middlewares, execute)

  function navigateTo(url: Url): Promise<Url> {
    return dispatch(url)
  }

  function run(): Promise<Url> {
    return navigateTo(currentUrl)
  }

  return {
    subscribe,
    navigateTo,
    run
  }
}
