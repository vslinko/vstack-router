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
  Url,
  MiddlewareHandler
} from '../lib/types'

import type {Router} from '../lib/createRouter'
import type {RouterEngine} from '../lib/createFakeRouterEngine'

function redirectMiddleware(next: MiddlewareHandler<Url>): MiddlewareHandler<Url> {
  return function redirectHandler(url: Url): Promise<Url> {
    return next(url === '/qwerty' ? '/' : url)
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
  // Url: /
  router.subscribe(page => console.log('Page:', page))
  engine.subscribe(url => console.log('Url:', url))

  // Page: { page: 'IndexPage', props: { title: 'Welcome' } }
  // Url: /
  return engine.run()

    // Page: { page: 'IndexPage', props: { title: 'Welcome' } }
    // Url: /
    .then(() => engine.navigateTo('/qwerty'))

    // Page: { page: 'AboutPage', props: { title: 'About' } }
    // Url: /company/about
    .then(() => engine.navigateTo('/company/about'))

    // Page: { page: 'NotFoundPage', props: { url: '/404' } }
    // Url: /404
    .then(() => engine.navigateTo('/404'))

    // Page: { page: 'ErrorPage', props: { error: [Error: Fail] } }
    // Url: /fail
    .then(() => engine.navigateTo('/fail'))
}

main()
  .catch(error => console.error(error))
