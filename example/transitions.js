/* @flow */

import * as api from './api'
import createTransition from '../lib/createTransition'

import type {
  Screen,
  Location,
  QueryParameters,
  Transition
} from '../lib/types'

export var indexTransition: Transition = createTransition('/', function(queryParameters: QueryParameters): Promise<Screen> {
  return api.fetchIndexData()
    .then(props => ({page: 'IndexPage', props}))
})


export var aboutTransition: Transition = createTransition('/about', function(queryParameters: QueryParameters): Promise<Screen> {
  return api.fetchAboutData(queryParameters)
    .then(props => ({page: 'AboutPage', props}))
})

export function notFoundTransition(location: Location): Promise<?Screen> {
  return Promise.resolve({page: 'NotFoundPage', props: {location}})
}

export var failTransition: Transition = createTransition('/fail', function(queryParameters: QueryParameters): Promise<Screen> {
  return Promise.reject(new Error('Fail'))
})

export function createErrorTransition(transition: Transition): Transition {
  return function errorTransition(location: Location): Promise<?Screen> {
    return transition(location)
      .catch(error => ({page: 'ErrorPage', props: {error}}))
  }
}
