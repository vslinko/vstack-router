import React from 'react'
import store from './store'
import router from './router'
import {Provider, connect} from 'react-redux'

@connect(state => {
  const {screen} = state.router
  const Component = screen.component
  const props = screen.props

  return {
    children: <Component {...props} />
  }
})
class App {
  render() {
    return (
      <div>
        {this.props.children}
      </div>
    )
  }
}

async function main() {
  // wait for initial transition
  // very useful in server-side rendering
  await router.waitQueue()

  React.render(
    <Provider store={store}>
      {() => <App />}
    </Provider>,
    document.getElementById('app')
  )
}

main()
