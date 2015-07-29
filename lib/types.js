/* @flow */

// listen
export type Listener<T> = (value: T) => void
export type Unlisten = () => void
export type Listen<T> = (listener: Listener<T>) => Unlisten

// middleware
export type MiddlewareHandler<T> = (state: T) => Promise<T>
export type Middleware<T> = (next: MiddlewareHandler<T>) => MiddlewareHandler<T>

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
  listen: Listen<Screen>,
  navigateTo: Transition
}
export type RouterEngine = {
  waitQueue: () => Promise<void>,
  run: () => void
}
