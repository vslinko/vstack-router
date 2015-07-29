/* @flow */

import {createMemoryHistory, createLocation} from 'history'

import createRouter from '../lib/createRouter'
import combineTransitions from '../lib/combineTransitions'
import prefixTransition from '../lib/prefixTransition'
import createRouterEngine from '../lib/createRouterEngine'
import {
  indexTransition,
  aboutTransition,
  failTransition,
  notFoundTransition,
  createErrorTransition
} from './transitions'

import type {
  History,
  Location,
  MiddlewareHandler
} from '../lib/types'

import type {Router} from '../lib/createRouter'
import type {RouterEngine} from '../lib/createRouterEngine'

function redirectMiddleware(next: MiddlewareHandler<Location>): MiddlewareHandler<Location> {
  return function redirectHandler(location: Location): Promise<Location> {
    return next(
      location.pathname === '/qwerty'
        ? createLocation('/')
        : location
    )
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

  var history: History = createMemoryHistory()

  var engine: RouterEngine = createRouterEngine(
    router,
    history,
    [redirectMiddleware]
  )

  // Location: /
  router.listen(page => console.log('Page:', page))
  history.listen(location => console.log('Location:', location.pathname))

  engine.run()

  // Page: { page: 'IndexPage', props: { title: 'Welcome' } }
  return engine.waitQueue()
    .then(() => {
      // Location: /qwerty
      history.pushState({}, '/qwerty')
      // Page: { page: 'IndexPage', props: { title: 'Welcome' } }
      return engine.waitQueue()
    })
    .then(() => {
      // Location: /company/about?title=Test
      history.pushState({}, '/company/about?title=Test')
      // Page: { page: 'AboutPage', props: { title: 'Test' } }
      return engine.waitQueue()
    })
    .then(() => {
      // Location: /404
      history.pushState({}, '/404')
      // Page: { page: 'NotFoundPage',
      //   props:
      //    { location:
      //       { pathname: '/404',
      //         search: '',
      //         state: {},
      //         action: 'PUSH',
      //         key: 'w6djrl' } } }
      return engine.waitQueue()
    })
    .then(() => {
      // Location: /fail
      history.pushState({}, '/fail')
      // Page: { page: 'ErrorPage', props: { error: [Error: Fail] } }
      return engine.waitQueue()
    })
}

main()
  .catch(error => console.error(error))
