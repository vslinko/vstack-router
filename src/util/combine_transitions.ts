import { Screen, Transition, Location } from "../types.ts";

export function combineTransitions(...transitions: Transition[]): Transition {
  return async function combinedTransition(
    location: Location
  ): Promise<Screen | null> {
    for (const transition of transitions) {
      const page = await transition(location);

      if (page) {
        return page;
      }
    }

    return null;
  };
}
