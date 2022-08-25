export function createURL(
  pattern: string,
  params: Record<string, string | number>,
  query?: Record<string, string | number>
): string {
  const regExp = /(\/:\w+)/g;

  let url = pattern.replace(regExp, (match) => {
    const paramKey = match.slice(2);

    if (!params[paramKey]) {
      throw new Error();
    }

    return `/${params[paramKey]}`;
  });

  if (query) {
    url += `?${new URLSearchParams(query as Record<string, string>)}`;
  }

  return url;
}
