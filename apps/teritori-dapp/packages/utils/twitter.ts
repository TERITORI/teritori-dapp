const baseTwitterUrl = "https://x.com/";
const twitterDomainQueries = ["twitter.com/", "x.com/"];

export const normalizeTwitterId = (id: string) => {
  if (id.startsWith("@")) {
    return baseTwitterUrl + id.slice(1);
  }
  for (const query of twitterDomainQueries) {
    const baseIndex = id.indexOf(query);
    if (baseIndex > -1) {
      return baseTwitterUrl + id.slice(baseIndex + query.length);
    }
  }
  return baseTwitterUrl + id;
};
