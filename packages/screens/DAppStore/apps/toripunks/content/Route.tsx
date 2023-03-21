import { ComicBooks } from "./ComicBooks";
import { MenuMobile } from "./MenuMobile";
import { MyHistory } from "./MyHistory";
import { Raffle } from "./Raffle";
import { Russian } from "./RussianRoulette";
import { Welcome } from "./Welcome";

export const Route: React.FC<string> = (section: string) => {
  const sectionList = {
    welcome: () => <Welcome />,
    roulette: () => <Russian />,
    raffle: () => <Raffle />,
    comicbook: () => <ComicBooks />,
    "my-history": () => <MyHistory />,
    "menu-mobile": () => <MenuMobile />,
  };

  const validateCustomRoute = {
    get: (target: any, name: string) => {
      return target.hasOwnProperty(name)
        ? target[name]
        : sectionList["welcome"];
    },
  };

  const validateSection = new Proxy(sectionList, validateCustomRoute);

  const selectedSection = (validateSection as any)[section];

  return selectedSection();
};
