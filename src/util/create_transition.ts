import { matchRoutePattern } from "./match_route_pattern.ts";

import { Screen, Transition, TransitionHandler, Location } from "../types.ts";

export function createTransition(
  pattern: string,
  handler: TransitionHandler
): Transition {
  return async function transition(location: Location): Promise<Screen | null> {
    const queryParameters = matchRoutePattern(
      pattern,
      location.pathname + location.search
    );

    if (!queryParameters) {
      return null;
    }

    return await handler(queryParameters);
  };
}
