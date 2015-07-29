/* @flow */

import type {
  MiddlewareHandler,
  Middleware
} from '../types'

function reducer<T>(composed: MiddlewareHandler<T>, middleware: Middleware<T>): MiddlewareHandler<T> {
  return middleware(composed)
}

export default function composeMiddlewares<T>(middlewares: Array<Middleware<T>>, lastHandler: MiddlewareHandler<T>): MiddlewareHandler<T> {
  return middlewares.reduceRight(reducer, lastHandler)
}
