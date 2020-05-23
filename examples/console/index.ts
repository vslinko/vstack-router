import { createMemoryHistory } from "https://cdn.pika.dev/history@^4.10.1";

import {
  createRouter,
  combineTransitions,
  prefixTransition,
  Router,
} from "../../mod.ts";

import {
  indexTransition,
  aboutTransition,
  failTransition,
  notFoundTransition,
  createErrorTransition,
} from "./transitions.ts";

const history = createMemoryHistory({});

const router: Router = createRouter(
  history,
  createErrorTransition(
    combineTransitions(
      indexTransition,
      prefixTransition("/company", aboutTransition),
      failTransition,
      notFoundTransition
    )
  )
);

router.listen((screen, location) => {
  console.log("location", location);
  console.log("screen", screen);
  console.log();
});

history.push("/qwerty", {});
await router.waitQueue();

history.push("/company/about?title=Test", {});
await router.waitQueue();

history.push("/404", {});
await router.waitQueue();

history.push("/fail", {});
await router.waitQueue();
