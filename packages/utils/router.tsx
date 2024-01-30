import {
  router as _router,
  useLocalSearchParams as _useLocalSearchParams,
  Link as _Link,
  LinkProps,
  LinkComponent,
} from "expo-router";

import { feedsTabItems } from "./social-feed";
import { Conversation, MessageFriendsTabItem } from "./types/message";
import { uppTabItems } from "./upp";
import { NewPostFormValues } from "../components/socialFeed/NewsFeed/NewsFeed.type";

export interface Routes {
  "": { network?: string };

  "/collection/[id]": { id: string };
  "/collection/[id]/tools": { id: string };
  "/collection/[id]/mint": { id: string };

  "/dapp/tori-punks/[route]": { route: string };

  "/feed/post/[id]": { id: string };
  "/feed/tag/[hashtag]": { hashtag: string };
  "/feed/[tab]": { tab: keyof typeof feedsTabItems; network?: string };
  "/feed/new":
    | (NewPostFormValues & {
        additionalMention?: string;
        additionalHashtag?: string;
      })
    | undefined;
  "/feed": undefined;

  "/launchpad": undefined;
  "/launchpad/apply": undefined;

  "/message/[view]": { view: string; tab?: string } | undefined;
  "/message/chat": Conversation;
  "/message/friends": { tab?: MessageFriendsTabItem } | undefined;
  "/message": { view: string; tab?: string } | undefined;

  "/multisig/[id]": { id: string };
  "/multisig/create": undefined;
  "/multisig": undefined;

  "/nft/[id]": { id: string; openBuy?: boolean };

  "/riot-game/breeding": undefined;
  "/riot-game/enroll": undefined;
  "/riot-game/fight": undefined;
  "/riot-game": undefined;
  "/riot-game/inventory": undefined;
  "/riot-game/leaderboard": undefined;
  "/riot-game/marketplace": { collectionId?: string } | undefined;
  "/riot-game/memories": undefined;

  "/tns/[modal]": { modal: string; name?: string } | undefined;
  "/tns": { modal: string; name?: string } | undefined;

  "/user/[id]": {
    id: string;
    tab?: keyof typeof uppTabItems;
  };

  "/wallet-manager/chains": undefined;
  "/wallet-manager/wallets": undefined;
  "/wallet-manager": undefined;

  "/coming-soon": undefined;
  "/core-dao": undefined;
  "/create-org": undefined;
  "/dapp-store": undefined;
  "/governance": undefined;
  "/guardians": undefined;
  "/marketplace": undefined;
  "/my-collection": undefined;
  "/orgs": { network?: string } | undefined;
  "/rioters-footer": undefined;
  "/settings": undefined;
  "/staking": { multisigId?: string; daoId?: string } | undefined;
  "/stats": undefined;
  "/swap": undefined;
}

type ParamsForPathname<Pathname extends keyof Routes> =
  Pathname extends keyof Routes ? Routes[Pathname] : never;

export type Href<Pathname extends keyof Routes> =
  | keyof Routes
  | { pathname: Pathname; params: ParamsForPathname<Pathname> };

export const router = {
  ..._router,
  navigate: <Pathname extends keyof Routes>(href: Href<Pathname>) =>
    _router.navigate(href),
  push: <Pathname extends keyof Routes>(href: Href<Pathname>) =>
    //@ts-ignore
    _router.push(href),
  replace: <Pathname extends keyof Routes>(href: Href<Pathname>) =>
    //@ts-ignore
    _router.replace(href),
};

export const useLocalSearchParams = <Pathname extends keyof Routes>() =>
  //@ts-ignore
  _useLocalSearchParams<ParamsForPathname<Pathname>>();
//@ts-ignore
interface ExtendedLinkProps<Pathname extends keyof Routes>
  extends LinkProps<Pathname> {
  href: Href<Pathname>;
}

interface ExtendedLinkComponent extends LinkComponent {
  <Pathname extends keyof Routes>(
    props: React.PropsWithChildren<ExtendedLinkProps<Pathname>>,
  ): JSX.Element;
}
export const Link: ExtendedLinkComponent = _Link;
