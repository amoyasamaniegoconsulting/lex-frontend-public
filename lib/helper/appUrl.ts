export function getAppUrl(path: string) {
  const appUrl = process.env.NEXT_PUBLIC_API_URL;

  return `${appUrl}/${path}`;
}

export function getAppPythonUrl(path: string) {
  const appUrl = process.env.NEXT_PUBLIC_API_URL_PYTHON;
  return `${appUrl}/${path}`;
}
