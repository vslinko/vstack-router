import combineTransitions from '../../../../lib/util/combineTransitions'
import mainTransition from './main/transition'
import aboutTransition from './about/transition'

export default combineTransitions(
  mainTransition,
  aboutTransition
)
