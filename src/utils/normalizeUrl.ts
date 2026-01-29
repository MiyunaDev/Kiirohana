function normalizeUrl(url: string) {
  return url.replace(/\/$/, "");
}

export default normalizeUrl