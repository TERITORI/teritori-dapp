import { Post, Reaction } from "../../api/feed/v1/feed";
import { getUserId } from "../../networks";

export const decodeGnoPost = (networkId: string, postData: string): Post => {
  const buf = Buffer.from(postData, "base64");

  let offset = 0;

  // HACK: we don't have readBigUint64BE so we shift 4 position to read readUInt32BE
  offset += 4;
  const identifier = buf.readUInt32BE(offset);
  offset += 4;

  // HACK: we don't have readBigUint64BE so we shift 4 position to read readUInt32BE
  offset += 4;
  const parentPostIdentifier = buf.readUInt32BE(offset);
  offset += 4;

  // HACK: we don't have readBigUint64BE so we shift 4 position to read readUInt32BE
  offset += 4;
  //   const feedId = buf.readUInt32BE(offset);
  offset += 4;

  offset += 4;
  const category = buf.readUInt32BE(offset);
  offset += 4;

  const metadataLen = buf.readUInt32BE(offset);
  offset += 4;
  const metadata = buf.slice(offset, offset + metadataLen).toString();
  offset += metadataLen;

  const addrLen = buf.readUInt16BE(offset);
  offset += 2;
  const authorAddress = buf.slice(offset, offset + addrLen).toString();
  offset += addrLen;

  const createdAt = buf.readUInt32BE(offset);
  offset += 4;

  const reactionsStrLen = buf.readUInt32BE(offset);
  offset += 4;
  const reactionsStr = buf.slice(offset, offset + reactionsStrLen).toString();

  const reactions: Reaction[] = [];
  for (const reactionStr of reactionsStr.split(",")) {
    if (!reactionStr) continue;
    const splitted = reactionStr.split(":");
    reactions.push({ icon: splitted[0], count: parseInt(splitted[1], 10) });
  }
  offset += reactionsStrLen;

  const subpostsStrLen = buf.readUInt32BE(offset);
  offset += 4;

  let subpostIDs: string[] = [];
  if (subpostsStrLen === 0) {
    subpostIDs = [];
  } else {
    subpostIDs = buf
      .slice(offset, offset + subpostsStrLen)
      .toString()
      .split(",");
  }
  offset += subpostsStrLen;

  const post: Post = {
    category,
    isDeleted: false,
    identifier: identifier ? "" + identifier : "",
    metadata,
    parentPostIdentifier: parentPostIdentifier ? "" + parentPostIdentifier : "",
    subPostLength: subpostIDs.length,
    authorId: getUserId(networkId, authorAddress),
    createdAt: +createdAt * 1000,
    tipAmount: 0,
    reactions,
  };

  return post;
};
