/* @flow */

import {createMemoryHistory, createLocation} from 'history'

import {createStore, combineReducers, applyMiddleware} from 'redux'

import createRouter from '../lib/createRouter'
import combineTransitions from '../lib/util/combineTransitions'
import prefixTransition from '../lib/util/prefixTransition'

import {
  historyMiddleware,
  routerReducer,
  pushState,
  createRouterListener
} from '../lib/redux'

import {
  indexTransition,
  aboutTransition,
  failTransition,
  notFoundTransition,
  createErrorTransition
} from './transitions'

import type {
  Router,
  History
} from '../lib/types'

function redirectMiddleware(store) {
  return next => action => {
    if (action.type === 'PUSH_STATE' && action.url === '/qwerty') {
      return next({
        ...action,
        state: {},
        url: '/'
      })
    }

    return next(action)
  }
}

function main(): Promise<any> {
  // history

  var history: History = createMemoryHistory()

  // router

  var router: Router = createRouter(
    history,
    createErrorTransition(
      combineTransitions(
        indexTransition,
        prefixTransition('/company', aboutTransition),
        failTransition,
        notFoundTransition
      )
    )
  )

  // store

  var createStoreWithMiddleware = applyMiddleware(
    redirectMiddleware,
    historyMiddleware(history)
  )(createStore)

  var store = createStoreWithMiddleware(combineReducers({
    router: routerReducer
  }))

  router.listen(createRouterListener(store))

  store.subscribe(() => {
    console.log('Location:', store.getState().router.location.pathname)
    console.log('Screen:', store.getState().router.screen)
  })

  // test

  return router.waitQueue()
    .then(() => {
      store.dispatch(pushState({}, '/qwerty'))
      return router.waitQueue()
    })
    .then(() => {
      store.dispatch(pushState({}, '/company/about?title=Test'))
      return router.waitQueue()
    })
    .then(() => {
      store.dispatch(pushState({}, '/404'))
      return router.waitQueue()
    })
    .then(() => {
      store.dispatch(pushState({}, '/fail'))
      return router.waitQueue()
    })
}

main()
  .catch(error => console.error(error))
