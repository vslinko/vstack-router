/* @flow */

import type {
  Screen,
  Transition,
  Url,
  QueryParameters
} from './types'

type CombinedTransition = Transition

type TransitionsCombinator = (...transitions: Array<Transition>) => Transition

export default function combineTransitions(...transitions: Array<Transition>): CombinedTransition {
  return function combinedTransition(url: Url): Promise<?Screen> {
    if (transitions.length === 0) {
      return Promise.resolve(undefined)
    }

    return new Promise(function(resolve, reject) {
      var index: number = 0

      function tryNextTransition() {
        transitions[index++](url)
          .then(function(page: ?Screen) {
            if (page) {
              resolve(page)
            } else if (index < transitions.length) {
              tryNextTransition()
            }
          })
          .catch(reject)
      }

      tryNextTransition()
    })
  }
}
