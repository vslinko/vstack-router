import { Screen, Location, History, Transition, Router } from "./types.ts";

export function createRouter(history: History, transition: Transition): Router {
  const listeners: Set<(
    screen: Screen,
    location: Location
  ) => void> = new Set();
  const waiting: Set<() => void> = new Set();
  let nextLocation: Location | undefined;
  let inProcess = false;

  function listen(
    listener: (screen: Screen, location: Location) => void
  ): () => void {
    listeners.add(listener);

    return () => {
      listeners.delete(listener);
    };
  }

  async function navigateTo(location: Location): Promise<void> {
    const screen = await transition(location);

    if (screen) {
      for (const listener of listeners) {
        listener(screen, location);
      }
    }
  }

  async function processQueue() {
    if (inProcess) {
      return;
    }

    if (!nextLocation) {
      for (const resolve of waiting) {
        resolve();
      }
      waiting.clear();
      return;
    }

    const location = nextLocation;
    nextLocation = undefined;
    inProcess = true;

    try {
      await navigateTo(location);
    } catch (error) {
      console.error(error.stack);
    } finally {
      inProcess = false;
      processQueue();
    }
  }

  function waitQueue(): Promise<void> {
    return new Promise((resolve) => {
      if (inProcess) {
        waiting.add(resolve);
      } else {
        resolve();
      }
    });
  }

  history.listen((location) => {
    nextLocation = location;
    processQueue();
  });

  return {
    listen,
    waitQueue,
  };
}
