export function matchRoutePattern(
  pattern: string,
  fullUrl: string
): { [key: string]: string } | null {
  const [url, query] = fullUrl.split("?");

  const names: string[] = [];
  const urlParamsRegexpString = pattern
    .replace(/:([^/]+)/g, (name) => {
      names.push(name.replace(/^:/, ""));
      return "([^/]+)";
    })
    .replace(/\//g, "\\/");

  const urlParamsRegexp = new RegExp(`^${urlParamsRegexpString}$`);
  const urlParamsMatches = urlParamsRegexp.exec(url);

  if (!urlParamsMatches) {
    return null;
  }

  const queryParams = Array.from(new URLSearchParams(query || "").entries());
  const urlParams = urlParamsMatches
    .slice(1)
    .map((value, index) => [names[index], value] as [string, string]);

  const paramsObject = [...queryParams, ...urlParams].reduce(
    (acc, [key, value]) => {
      acc[key] = value;
      return acc;
    },
    {} as { [key: string]: string }
  );

  return paramsObject;
}
