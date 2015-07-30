import {createStore, combineReducers, applyMiddleware} from 'redux'
import {
  historyMiddleware,
  routerReducer,
  createRouterListener
} from 'redux-vstack-router'

import history from './history'
import router from './router'

const createStoreWithMiddleware = applyMiddleware(
  historyMiddleware(history)
)(createStore)

const reducer = combineReducers({
  router: routerReducer
})

const store = createStoreWithMiddleware(reducer)

router.listen(createRouterListener(store))

export default store
