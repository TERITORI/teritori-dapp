import { useMemo } from "react";

import { useNSUserInfo } from "../../hooks/useNSUserInfo";
import { parseUserId } from "../../networks";
import { tinyAddress } from "../../utils/text";
interface CreatedByViewProps {
  user: string;
}
export const CreatedByView: React.FC<CreatedByViewProps> = ({ user }) => {
  const authorNSInfo = useNSUserInfo(user);
  const [, userAddr] = parseUserId(user);
  const username = useMemo(() => {
    return authorNSInfo?.metadata?.tokenId
      ? authorNSInfo?.metadata?.tokenId
      : tinyAddress(userAddr);
  }, [authorNSInfo, userAddr]);

  return <>{username}</>;
};
