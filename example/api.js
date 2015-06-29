/* @flow */

export function fetchIndexData(): Promise<Object> {
  return new Promise(resolve => {
    setTimeout(() => resolve({title: 'Welcome'}), 100)
  })
}

export function fetchAboutData(): Promise<Object> {
  return new Promise(resolve => {
    setTimeout(() => resolve({title: 'About'}), 100)
  })
}
