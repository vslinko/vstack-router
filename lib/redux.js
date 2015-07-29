/* @qflow */

const PUSH_STATE = '@@vstack-router/PUSH_STATE'
const REPLACE_STATE = '@@vstack-router/REPLACE_STATE'
const TRANSITION_TO = '@@vstack-router/TRANSITION_TO'
const SCREEN_CHANGE = '@@vstack-router/SCREEN_CHANGE'

var initialState = {
  location: undefined,
  screen: undefined
}

export function routerReducer(state = initialState, action) {
  if (action.type === SCREEN_CHANGE) {
    return {
      ...state,
      location: action.location,
      screen: action.screen
    }
  } else {
    return state
  }
}

export function historyMiddleware(history) {
  return store => next => action => {
    switch (action.type) {
      case PUSH_STATE:
        history.pushState(action.state, action.url)
        break

      case REPLACE_STATE:
        history.replaceState(action.state, action.url)
        break

      case TRANSITION_TO:
        history.transitionTo(action.location)
        break

      default:
        return next(action)
    }
  }
}

export function pushState(state, url) {
  return {
    type: PUSH_STATE,
    state,
    url
  }
}

export function replaceState(state, url) {
  return {
    type: REPLACE_STATE,
    state,
    url
  }
}

export function transitionTo(location) {
  return {
    type: TRANSITION_TO,
    location
  }
}

export function createRouterListener(store) {
  return ([location, screen]) =>
    store.dispatch({
      type: SCREEN_CHANGE,
      location,
      screen
    })
}
