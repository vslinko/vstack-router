import createTransition from '../../../../../lib/util/createTransition'

export default createTransition('/about', (query) => {
  return new Promise(resolve => {
    require.ensure('./About', require => {
      resolve({
        component: require('./About'),
        props: {}
      })
    })
  })
})
