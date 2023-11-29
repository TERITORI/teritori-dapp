// Get the tld at the end of a token (TNS) (.xxxx)
import {
  CosmosNetworkInfo,
  GnoNetworkInfo,
  NetworkInfo,
  NetworkKind,
} from "../networks";

export const tldFromNSToken = (str: string): string =>
  str.substring(str.lastIndexOf("."));
// Get the token (TNS) without the tld
export const nsTokenWithoutTLD = (str: string): string =>
  str.substring(0, str.lastIndexOf("."));

export const isNSPath = (str: string) => str.includes("::");

export const isNSToken = (str: string) => !isNSPath(str);

export const nameServiceDefaultImage = (
  isDAO: boolean,
  network?: NetworkInfo,
) =>
  isDAO
    ? daoIconDataURI
    : [NetworkKind.Cosmos, NetworkKind.Gno].includes(
          network?.kind || NetworkKind.Unknown,
        )
      ? (network as CosmosNetworkInfo | GnoNetworkInfo).nameServiceDefaultImage
      : undefined;

const daoIconDataURI =
  "data:image/svg+xml,%3Csvg viewBox='0 0 40 40' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 8.51953C19.1549 8.51953 18.3455 8.85968 17.7498 9.46319C17.1542 10.0665 16.8207 10.8835 16.8207 11.7342C16.8207 12.5849 17.1542 13.4019 17.7498 14.0052C18.3455 14.6087 19.1549 14.9489 20 14.9489C20.8451 14.9489 21.6545 14.6087 22.2502 14.0052C22.8458 13.4019 23.1793 12.5849 23.1793 11.7342C23.1793 10.8835 22.8458 10.0665 22.2502 9.46319C21.6545 8.85968 20.8451 8.51953 20 8.51953Z' fill='url(%23paint0_linear_19766_180161)'/%3E%3Cpath d='M12.6168 12.4559C11.7717 12.4559 10.9624 12.796 10.3666 13.3995C9.77104 14.0028 9.4375 14.8199 9.4375 15.6705C9.4375 16.5212 9.77104 17.3382 10.3666 17.9416C10.9624 18.5451 11.7717 18.8852 12.6168 18.8852C13.462 18.8852 14.2713 18.5451 14.8671 17.9416C15.4626 17.3382 15.7962 16.5212 15.7962 15.6705C15.7962 14.8199 15.4626 14.0028 14.8671 13.3995C14.2713 12.796 13.462 12.4559 12.6168 12.4559Z' fill='url(%23paint1_linear_19766_180161)'/%3E%3Cpath d='M27.3832 12.4559C26.538 12.4559 25.7287 12.796 25.1329 13.3995C24.5373 14.0028 24.2038 14.8199 24.2038 15.6705C24.2038 16.5212 24.5373 17.3382 25.1329 17.9416C25.7287 18.5451 26.538 18.8852 27.3832 18.8852C28.2283 18.8852 29.0376 18.5451 29.6334 17.9416C30.229 17.3382 30.5625 16.5212 30.5625 15.6705C30.5625 14.8199 30.229 14.0028 29.6334 13.3995C29.0376 12.796 28.2283 12.4559 27.3832 12.4559Z' fill='url(%23paint2_linear_19766_180161)'/%3E%3Cpath d='M12.6168 21.1158C11.7717 21.1158 10.9624 21.4559 10.3666 22.0595C9.77104 22.6628 9.4375 23.4798 9.4375 24.3305C9.4375 25.1812 9.77104 25.9982 10.3666 26.6015C10.9624 27.205 11.7717 27.5452 12.6168 27.5452C13.462 27.5452 14.2713 27.205 14.8671 26.6015C15.4626 25.9982 15.7962 25.1812 15.7962 24.3305C15.7962 23.4798 15.4626 22.6628 14.8671 22.0595C14.2713 21.456 13.462 21.1158 12.6168 21.1158Z' fill='url(%23paint3_linear_19766_180161)'/%3E%3Cpath d='M27.3832 21.1158C26.538 21.1158 25.7287 21.4559 25.1329 22.0595C24.5373 22.6628 24.2038 23.4798 24.2038 24.3305C24.2038 25.1812 24.5373 25.9982 25.1329 26.6015C25.7287 27.205 26.538 27.5452 27.3832 27.5452C28.2283 27.5452 29.0376 27.205 29.6334 26.6015C30.229 25.9982 30.5625 25.1812 30.5625 24.3305C30.5625 23.4798 30.229 22.6628 29.6334 22.0595C29.0376 21.4559 28.2283 21.1158 27.3832 21.1158Z' fill='url(%23paint4_linear_19766_180161)'/%3E%3Cpath d='M20 25.0521C19.1549 25.0521 18.3455 25.3923 17.7498 25.9958C17.1542 26.5991 16.8207 27.4161 16.8207 28.2668C16.8207 29.1175 17.1542 29.9345 17.7498 30.5378C18.3455 31.1413 19.1549 31.4815 20 31.4815C20.8451 31.4815 21.6545 31.1413 22.2502 30.5378C22.8458 29.9345 23.1793 29.1175 23.1793 28.2668C23.1793 27.4161 22.8458 26.5991 22.2502 25.9958C21.6545 25.3923 20.8451 25.0521 20 25.0521Z' fill='url(%23paint5_linear_19766_180161)'/%3E%3Cdefs%3E%3ClinearGradient id='paint0_linear_19766_180161' x1='9.4375' y1='20.0005' x2='30.5625' y2='20.0005' gradientUnits='userSpaceOnUse'%3E%3Cstop stop-color='%235433FF'/%3E%3Cstop offset='0.5' stop-color='%2320BDFF'/%3E%3Cstop offset='1' stop-color='%23A5FECB'/%3E%3C/linearGradient%3E%3ClinearGradient id='paint1_linear_19766_180161' x1='9.4375' y1='20.0005' x2='30.5625' y2='20.0005' gradientUnits='userSpaceOnUse'%3E%3Cstop stop-color='%235433FF'/%3E%3Cstop offset='0.5' stop-color='%2320BDFF'/%3E%3Cstop offset='1' stop-color='%23A5FECB'/%3E%3C/linearGradient%3E%3ClinearGradient id='paint2_linear_19766_180161' x1='9.4375' y1='20.0005' x2='30.5625' y2='20.0005' gradientUnits='userSpaceOnUse'%3E%3Cstop stop-color='%235433FF'/%3E%3Cstop offset='0.5' stop-color='%2320BDFF'/%3E%3Cstop offset='1' stop-color='%23A5FECB'/%3E%3C/linearGradient%3E%3ClinearGradient id='paint3_linear_19766_180161' x1='9.4375' y1='20.0005' x2='30.5625' y2='20.0005' gradientUnits='userSpaceOnUse'%3E%3Cstop stop-color='%235433FF'/%3E%3Cstop offset='0.5' stop-color='%2320BDFF'/%3E%3Cstop offset='1' stop-color='%23A5FECB'/%3E%3C/linearGradient%3E%3ClinearGradient id='paint4_linear_19766_180161' x1='9.4375' y1='20.0005' x2='30.5625' y2='20.0005' gradientUnits='userSpaceOnUse'%3E%3Cstop stop-color='%235433FF'/%3E%3Cstop offset='0.5' stop-color='%2320BDFF'/%3E%3Cstop offset='1' stop-color='%23A5FECB'/%3E%3C/linearGradient%3E%3ClinearGradient id='paint5_linear_19766_180161' x1='9.4375' y1='20.0005' x2='30.5625' y2='20.0005' gradientUnits='userSpaceOnUse'%3E%3Cstop stop-color='%235433FF'/%3E%3Cstop offset='0.5' stop-color='%2320BDFF'/%3E%3Cstop offset='1' stop-color='%23A5FECB'/%3E%3C/linearGradient%3E%3C/defs%3E%3C/svg%3E%0A";
