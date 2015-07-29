/* @flow */

import matchRoutePattern from 'match-route-pattern'

import type {
  Screen,
  Transition,
  Location,
  QueryParameters
} from '../types'

type TransitionHandler = (queryParameters: QueryParameters) => Promise<Screen>

type TransitionCreator = (pattern: string, handler: TransitionHandler) => Transition

export default function createTransition(pattern: string, handler: TransitionHandler): Transition {
  return function transition(location: Location): Promise<?Screen> {
    var queryParameters: ?QueryParameters = matchRoutePattern(pattern, location.pathname + location.search)

    if (!queryParameters) {
      return Promise.resolve(undefined)
    }

    return handler(queryParameters)
      .then(screen => screen) // Flow fix
  }
}
