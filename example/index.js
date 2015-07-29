/* @flow */

import createRouter from '../lib/createRouter'
import combineTransitions from '../lib/combineTransitions'
import prefixTransition from '../lib/prefixTransition'
import createFakeRouterEngine from '../lib/createFakeRouterEngine'
import {
  indexTransition,
  aboutTransition,
  failTransition,
  notFoundTransition,
  createErrorTransition
} from './transitions'

import type {
  Location,
  MiddlewareHandler
} from '../lib/types'

import type {Router} from '../lib/createRouter'
import type {RouterEngine} from '../lib/createFakeRouterEngine'

function redirectMiddleware(next: MiddlewareHandler<Location>): MiddlewareHandler<Location> {
  return function redirectHandler(location: Location): Promise<Location> {
    return next(location === '/qwerty' ? '/' : location)
  }
}

function main(): Promise<any> {
  var router: Router = createRouter(
    createErrorTransition(
      combineTransitions(
        indexTransition,
        prefixTransition('/company', aboutTransition),
        failTransition,
        notFoundTransition
      )
    )
  )

  var engine: RouterEngine = createFakeRouterEngine(
    router,
    [redirectMiddleware]
  )

  // Page: null
  // Location: /
  router.subscribe(page => console.log('Page:', page))
  engine.subscribe(location => console.log('Location:', location))

  // Page: { page: 'IndexPage', props: { title: 'Welcome' } }
  // Location: /
  return engine.run()

    // Page: { page: 'IndexPage', props: { title: 'Welcome' } }
    // Location: /
    .then(() => engine.navigateTo('/qwerty'))

    // Page: { page: 'AboutPage', props: { title: 'About' } }
    // Location: /company/about
    .then(() => engine.navigateTo('/company/about'))

    // Page: { page: 'NotFoundPage', props: { location: '/404' } }
    // Location: /404
    .then(() => engine.navigateTo('/404'))

    // Page: { page: 'ErrorPage', props: { error: [Error: Fail] } }
    // Location: /fail
    .then(() => engine.navigateTo('/fail'))
}

main()
  .catch(error => console.error(error))
