import * as api from "./api.ts";
import {
  Screen,
  Location,
  QueryParameters,
  Transition,
  createTransition,
} from "../../mod.ts";

export const indexTransition: Transition = createTransition(
  "/",
  async (queryParameters: QueryParameters): Promise<Screen> => {
    const props = await api.fetchIndexData();
    return { page: "IndexPage", props };
  }
);

export const aboutTransition: Transition = createTransition(
  "/about",
  async (queryParameters: QueryParameters): Promise<Screen> => {
    const props = await api.fetchAboutData(queryParameters);
    return { page: "AboutPage", props };
  }
);

export async function notFoundTransition(
  location: Location
): Promise<Screen | null> {
  return { page: "NotFoundPage", props: { location } };
}

export const failTransition: Transition = createTransition(
  "/fail",
  async (queryParameters: QueryParameters): Promise<Screen> => {
    throw new Error("Fail");
  }
);

export function createErrorTransition(transition: Transition): Transition {
  return async function errorTransition(
    location: Location
  ): Promise<Screen | null> {
    try {
      return await transition(location);
    } catch (error) {
      return {
        page: "ErrorPage",
        props: { error },
      };
    }
  };
}
