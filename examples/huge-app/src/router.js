import createRouter from '../../../lib/createRouter'
import transition from './apps/transition'

import history from './history'

export default createRouter(
  history,
  transition
)
