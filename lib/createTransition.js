/* @flow */

import matchRoutePattern from 'match-route-pattern'

import type {
  Screen,
  Transition,
  Url,
  QueryParameters
} from './types'

type TransitionHandler = (queryParameters: QueryParameters) => Promise<Screen>

type TransitionCreator = (pattern: string, handler: TransitionHandler) => Transition

export default function createTransition(pattern: string, handler: TransitionHandler): Transition {
  return function transition(url: Url): Promise<?Screen> {
    var queryParameters: ?QueryParameters = matchRoutePattern(pattern, url)

    if (!queryParameters) {
      return Promise.resolve(undefined)
    }

    return handler(queryParameters)
      .then(screen => screen) // Flow fix
  }
}
