const bannedLinks = new Set(["https://discord.com/invite/X7HcfmE9qJ"]);

export const isLinkBanned = (link: string | null | undefined) =>
  typeof link === "string" ? bannedLinks.has(link) : false;
