/* @flow */

export type Screen = Object
export type Location = string

export type Transition = (location: Location) => Promise<?Screen>

export type Listener<T> = (value: ?T) => void
export type Unsubscriber = () => void
export type Subscriber<T> = (listener: Listener<T>) => Unsubscriber

export type QueryParameters = {[key: string]: string}

export type MiddlewareHandler<T> = (state: T) => Promise<T>
export type Middleware<T> = (next: MiddlewareHandler<T>) => MiddlewareHandler<T>
