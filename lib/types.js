/* @flow */

// listen
export type Listener<T> = (value: T) => void
export type Unlisten = () => void
export type Listen<T> = (listener: Listener<T>) => Unlisten

// common
export type Screen = Object
export type Location = {
  pathname: string,
  search: string
}
export type QueryParameters = {[key: string]: string}

// specific
export type Transition = (location: Location) => Promise<?Screen>
export type TransitionHandler = (queryParameters: QueryParameters) => Promise<Screen>

// instances
export type History = {
  listen: Listen<Location>,
  pushState: (state: Object, url: string) => void
}
export type Router = {
  listen: Listen<[Location, Screen]>,
  waitQueue: () => Promise<void>
}
