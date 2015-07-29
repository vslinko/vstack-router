/* @flow */

import type {
  Screen,
  Transition,
  Location
} from './types'

type PrefixedTransition = Transition

type PrefixTransition = (prefix: string, transition: Transition) => PrefixedTransition

export default function prefixTransition(prefix: string, transition: Transition): Transition {
  var re: RegExp = new RegExp(`^${prefix}`)

  return function prefixedTransition(location: Location): Promise<?Screen> {
    var {pathname, ...rest} = location

    if (!re.test(pathname)) {
      return Promise.resolve(undefined)
    }

    return transition({
      ...rest,
      pathname: pathname.replace(re, '')
    })
  }
}
