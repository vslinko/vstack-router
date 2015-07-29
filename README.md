# vstack-router

> Universal router

- `router` convert `location` changes to `screen` changes using single
  `transition` function.
- `location` is an object that represent some `history` action.
- `history` is a universal abstraction on session history.
- `screen` is an object that represent UI of some `location`.
- `transition` is a function that trying to eventually satisfy a location.
- `transition` could be combination of other `transition` functions.
- `transition` calls are synchronised via queue, but `router` skips tasks
  in the middle of the queue, because they are unreachable.
