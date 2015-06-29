/* @flow */

import type {
  Screen,
  Transition,
  Url
} from './types'

type PrefixedTransition = Transition

type PrefixTransition = (prefix: Url, transition: Transition) => PrefixedTransition

export default function prefixTransition(prefix: Url, transition: Transition): Transition {
  var re: RegExp = new RegExp(`^${prefix}`)

  return function prefixedTransition(url: Url): Promise<?Screen> {
    return transition(url.replace(re, ''))
  }
}
