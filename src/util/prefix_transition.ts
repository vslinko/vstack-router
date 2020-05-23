import { Screen, Transition, Location } from "../types.ts";

export function prefixTransition(
  prefix: string | RegExp,
  transition: Transition
): Transition {
  if (prefix instanceof RegExp && prefix.toString()[1] !== "^") {
    throw new Error("Prefix regexp should start with ^");
  }

  const hasPrefix = (pathname: string) => {
    if (prefix instanceof RegExp) {
      return prefix.test(pathname);
    } else {
      return pathname.startsWith(prefix);
    }
  };

  const removePrefix = (pathname: string) => {
    if (prefix instanceof RegExp) {
      return pathname.replace(prefix, "");
    } else {
      return pathname.slice(prefix.length);
    }
  };

  return async function prefixedTransition(
    location: Location
  ): Promise<Screen | null> {
    const { pathname, ...rest } = location;

    if (!hasPrefix(pathname)) {
      return null;
    }

    return transition({
      ...rest,
      pathname: removePrefix(pathname),
    });
  };
}
