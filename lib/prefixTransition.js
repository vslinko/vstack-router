/* @flow */

import type {
  Screen,
  Transition,
  Location
} from './types'

type PrefixedTransition = Transition

type PrefixTransition = (prefix: Location, transition: Transition) => PrefixedTransition

export default function prefixTransition(prefix: string, transition: Transition): Transition {
  var re: RegExp = new RegExp(`^${prefix}`)

  return function prefixedTransition(location: Location): Promise<?Screen> {
    return transition(location.replace(re, ''))
  }
}
