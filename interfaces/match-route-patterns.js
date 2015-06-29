declare module "match-route-pattern" {
  declare function exports(pattern: string, url: string): ?{[key: string]: string}
}
