import { QueryParameters } from "../../mod.ts";

export function fetchIndexData(): Promise<Object> {
  return new Promise((resolve) => {
    setTimeout(() => resolve({ title: "Welcome" }), 100);
  });
}

export function fetchAboutData(
  queryParameters: QueryParameters
): Promise<Object> {
  return new Promise((resolve) => {
    setTimeout(() => resolve({ title: queryParameters.title || "About" }), 100);
  });
}
