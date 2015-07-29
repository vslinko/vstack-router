/* @flow */

export type Screen = Object
export type Location = {
  pathname: string,
  search: string
}

export type History = {
  listen: Listen<Location>,
  pushState: (state: Object, url: string) => void
}

export type Transition = (location: Location) => Promise<?Screen>

export type Listener<T> = (value: T) => void
export type Unlisten = () => void
export type Listen<T> = (listener: Listener<T>) => Unlisten

export type QueryParameters = {[key: string]: string}

export type MiddlewareHandler<T> = (state: T) => Promise<T>
export type Middleware<T> = (next: MiddlewareHandler<T>) => MiddlewareHandler<T>
