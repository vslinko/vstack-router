/* @flow */

import matchRoutePattern from 'match-route-pattern'

import type {
  Screen,
  Transition,
  TransitionHandler,
  Location,
  QueryParameters
} from '../types'

export default function createTransition(pattern: string, handler: TransitionHandler): Transition {
  return function transition(location: Location): Promise<?Screen> {
    var queryParameters: ?QueryParameters = matchRoutePattern(pattern, location.pathname + location.search)

    if (!queryParameters) {
      return Promise.resolve(undefined)
    }

    return Promise.resolve(handler(queryParameters))
      .then(screen => screen) // Flow fix
  }
}
