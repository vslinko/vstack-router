import createTransition from '../../../../../lib/util/createTransition'

export default createTransition('/', query => {
  return new Promise(resolve => {
    require.ensure('./Main', require => {
      resolve({
        component: require('./Main'),
        props: {}
      })
    })
  })
})
