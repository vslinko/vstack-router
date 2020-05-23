export type Screen = Object;

export interface Location {
  pathname: string;
  search: string;
}

export type QueryParameters = { [key: string]: string };

export type Transition = (location: Location) => Promise<Screen | null>;

export type TransitionHandler = (
  queryParameters: QueryParameters
) => Promise<Screen>;

export interface History {
  listen(listener: (location: Location) => void): () => void;
}

export interface Router {
  listen(listener: (screen: Screen, location: Location) => void): () => void;
  waitQueue(): Promise<void>;
}
