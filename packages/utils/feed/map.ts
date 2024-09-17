import { FunctionComponent } from "react";

import unknownSvg from "@/assets/icons/question-gray.svg";
import articlePostSvg from "@/assets/icons/social-feed-map/article-post.svg";
import musicPostSvg from "@/assets/icons/social-feed-map/music-post.svg";
import normalPostSvg from "@/assets/icons/social-feed-map/normal-post.svg";
import picturePostSvg from "@/assets/icons/social-feed-map/picture-post.svg";
import videoPostSvg from "@/assets/icons/social-feed-map/video-post.svg";
import {
  CustomLatLngExpression,
  PostCategory,
  ZodLatLngLiteral,
  ZodLatLngTuple,
} from "@/utils/types/feed";

//TODO: Get <svg/> as string from svg files (These svg strings are used in FeedMapList.web.tsx)

export const MAP_LAYER_URL = `https://{s}.tile.jawg.io/jawg-dark/{z}/{x}/{y}{r}.png?access-token=${process.env.EXPO_PUBLIC_LEAFLET_MAP_TOKEN}`;

// Paris baguette
export const DEFAULT_MAP_POSITION: CustomLatLngExpression = [48.8566, 2.3522];

const musicPostSvgString = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <g filter="url(#filter0_di_22136_173395)">
    <path d="M12 2C6.52174 2 2 6.52174 2 12C2 17.4783 6.52174 22 12 22C17.4783 22 22 17.4783 22 12C22 6.52174 17.4783 2 12 2ZM16.1739 9.21739V13.5652V13.913V14.9565C16.1739 15.6522 15.6522 16.1739 14.9565 16.1739H14.4348C13.7391 16.1739 13.2174 15.6522 13.2174 14.9565V14.4348C13.2174 13.7391 13.7391 13.2174 14.4348 13.2174H15.3913V9.73913L10.8696 11.1304V14.8696V15.5652V16.2609C10.8696 16.9565 10.3478 17.4783 9.65217 17.4783H9.04348C8.34783 17.4783 7.82609 16.9565 7.82609 16.2609V15.7391C7.82609 15.0435 8.34783 14.5217 9.04348 14.5217H10V10.9565V8.6087C10 8.43478 10.087 8.26087 10.2609 8.17391L15.6522 6.52174C15.7391 6.52174 15.913 6.52174 16 6.6087C16.087 6.69565 16.1739 6.78261 16.1739 6.95652V9.21739Z" fill="url(#paint0_linear_22136_173395)"/>
  </g>
  <defs>
    <filter id="filter0_di_22136_173395" x="1" y="2" width="22" height="22" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
      <feFlood flood-opacity="0" result="BackgroundImageFix"/>
      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
      <feOffset dy="1"/>
      <feGaussianBlur stdDeviation="0.5"/>
      <feComposite in2="hardAlpha" operator="out"/>
      <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
      <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_22136_173395"/>
      <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_22136_173395" result="shape"/>
      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
      <feOffset dy="1"/>
      <feGaussianBlur stdDeviation="0.5"/>
      <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
      <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.25 0"/>
      <feBlend mode="normal" in2="shape" result="effect2_innerShadow_22136_173395"/>
    </filter>
    <linearGradient id="paint0_linear_22136_173395" x1="12" y1="2" x2="12" y2="22" gradientUnits="userSpaceOnUse">
      <stop offset="0.317708" stop-color="#FF9393"/>
      <stop offset="1" stop-color="#FF5C5C"/>
    </linearGradient>
  </defs>
</svg>`;

const picturePostSvgString = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <g clip-path="url(#clip0_22136_173426)">
    <g filter="url(#filter0_di_22136_173426)">
      <path d="M17.9722 5H5.97216C4.89528 5 4 5.89531 4 7V17C4 18.1047 4.89531 19 5.97188 19H17.9719C19.0766 19 19.9719 18.1047 19.9719 17V7C19.9722 5.89531 19.1034 5 17.9722 5ZM7.47216 7C8.3006 7 8.97216 7.67156 8.97216 8.5C8.97216 9.32844 8.32841 10 7.47216 10C6.61591 10 5.97216 9.32844 5.97216 8.5C5.97216 7.67156 6.67153 7 7.47216 7ZM17.9409 16.7375C17.8534 16.9 17.6847 17 17.5003 17H6.5631C6.37494 17 6.20278 16.8944 6.11747 16.7266C6.03216 16.5588 6.04825 16.3575 6.15916 16.2053L8.34666 13.2053C8.44091 13.075 8.59091 13 8.75028 13C8.90966 13 9.06016 13.0763 9.15435 13.2054L10.1687 14.5964L13.0843 10.2495C13.1784 10.0844 13.3347 10 13.5003 10C13.6659 10 13.8237 10.0835 13.9162 10.2227L17.9162 16.2227C18.019 16.375 18.0284 16.5719 17.9409 16.7375Z" fill="url(#paint0_linear_22136_173426)"/>
    </g>
  </g>
  <defs>
    <filter id="filter0_di_22136_173426" x="3" y="5" width="17.9688" height="16" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
      <feFlood flood-opacity="0" result="BackgroundImageFix"/>
      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
      <feOffset dy="1"/>
      <feGaussianBlur stdDeviation="0.5"/>
      <feComposite in2="hardAlpha" operator="out"/>
      <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
      <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_22136_173426"/>
      <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_22136_173426" result="shape"/>
      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
      <feOffset dy="1"/>
      <feGaussianBlur stdDeviation="0.5"/>
      <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
      <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.25 0"/>
      <feBlend mode="normal" in2="shape" result="effect2_innerShadow_22136_173426"/>
    </filter>
    <linearGradient id="paint0_linear_22136_173426" x1="11.9859" y1="5" x2="11.9859" y2="19" gradientUnits="userSpaceOnUse">
      <stop offset="0.317708" stop-color="#88DCFF"/>
      <stop offset="1" stop-color="#16BBFF"/>
    </linearGradient>
    <clipPath id="clip0_22136_173426">
      <rect width="16" height="16" fill="white" transform="translate(4 4)"/>
    </clipPath>
  </defs>
</svg>`;

const videoPostSvgString = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <g filter="url(#filter0_di_22136_173517)">
    <path d="M17.8359 2.83398H6.16927C5.28522 2.83398 4.43737 3.18517 3.81225 3.8103C3.18713 4.43542 2.83594 5.28326 2.83594 6.16732V17.834C2.83594 18.718 3.18713 19.5659 3.81225 20.191C4.43737 20.8161 5.28522 21.1673 6.16927 21.1673H17.8359C18.72 21.1673 19.5678 20.8161 20.193 20.191C20.8181 19.5659 21.1693 18.718 21.1693 17.834V6.16732C21.1693 5.28326 20.8181 4.43542 20.193 3.8103C19.5678 3.18517 18.72 2.83398 17.8359 2.83398ZM9.5026 8.22149C9.50265 8.01353 9.55585 7.80903 9.65715 7.62742C9.75846 7.4458 9.90451 7.2931 10.0814 7.18381C10.2584 7.07451 10.4603 7.01226 10.668 7.00296C10.8758 6.99365 11.0825 7.03761 11.2684 7.13065L13.8276 8.40982C14.0303 8.511 14.2008 8.66666 14.32 8.85934C14.4392 9.05202 14.5023 9.27409 14.5023 9.50065C14.5023 9.72721 14.4392 9.94929 14.32 10.142C14.2008 10.3346 14.0303 10.4903 13.8276 10.5915L11.2684 11.8707C11.0825 11.9637 10.8758 12.0076 10.668 11.9983C10.4603 11.989 10.2584 11.9268 10.0814 11.8175C9.90451 11.7082 9.75846 11.5555 9.65715 11.3739C9.55585 11.1923 9.50265 10.9878 9.5026 10.7798V8.22149ZM17.8359 17.0007H6.16927C5.94826 17.0007 5.7363 16.9129 5.58002 16.7566C5.42374 16.6003 5.33594 16.3883 5.33594 16.1673C5.33594 15.9463 5.42374 15.7343 5.58002 15.5781C5.7363 15.4218 5.94826 15.334 6.16927 15.334H17.8359C18.057 15.334 18.2689 15.4218 18.4252 15.5781C18.5815 15.7343 18.6693 15.9463 18.6693 16.1673C18.6693 16.3883 18.5815 16.6003 18.4252 16.7566C18.2689 16.9129 18.057 17.0007 17.8359 17.0007Z" fill="url(#paint0_linear_22136_173517)"/>
  </g>
  <defs>
    <filter id="filter0_di_22136_173517" x="1.83594" y="2.83398" width="20.3359" height="20.334" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
      <feFlood flood-opacity="0" result="BackgroundImageFix"/>
      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
      <feOffset dy="1"/>
      <feGaussianBlur stdDeviation="0.5"/>
      <feComposite in2="hardAlpha" operator="out"/>
      <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
      <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_22136_173517"/>
      <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_22136_173517" result="shape"/>
      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
      <feOffset dy="1"/>
      <feGaussianBlur stdDeviation="0.5"/>
      <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
      <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.25 0"/>
      <feBlend mode="normal" in2="shape" result="effect2_innerShadow_22136_173517"/>
    </filter>
    <linearGradient id="paint0_linear_22136_173517" x1="12.0026" y1="2.83398" x2="12.0026" y2="21.1673" gradientUnits="userSpaceOnUse">
      <stop offset="0.317708" stop-color="#C6ABFF"/>
      <stop offset="1" stop-color="#A57AFF"/>
    </linearGradient>
  </defs>
</svg>`;

const articlePostSvgString = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<g filter="url(#filter0_di_502_301)">
<path fill-rule="evenodd" clip-rule="evenodd" d="M6.99773 3.87305C5.73207 3.87278 4.70585 4.89858 4.70558 6.16423L4.70313 17.8309C4.70286 19.0965 5.72867 20.1228 6.99432 20.1231L16.9943 20.1252C18.26 20.1254 19.2862 19.0996 19.2865 17.834L19.2889 6.1673C19.2892 4.90163 18.2634 3.8754 16.9977 3.87515L6.99773 3.87305ZM8.66375 7.20694C8.31857 7.20687 8.03869 7.48663 8.03862 7.83181C8.03854 8.17699 8.31831 8.45687 8.66349 8.45694L15.3302 8.45834C15.6753 8.45841 15.9552 8.17865 15.9553 7.83348C15.9554 7.48829 15.6756 7.20841 15.3305 7.20834L8.66375 7.20694ZM8.03797 11.1654C8.03803 10.8201 8.31791 10.5404 8.66309 10.5405L15.3298 10.5419C15.6749 10.5419 15.9547 10.8218 15.9546 11.167C15.9545 11.5121 15.6747 11.7919 15.3295 11.7919L8.66283 11.7905C8.31766 11.7904 8.03789 11.5105 8.03797 11.1654ZM8.6623 13.8732C8.31711 13.8731 8.03724 14.1529 8.03716 14.498C8.03708 14.8432 8.31685 15.1231 8.66204 15.1232L12.8287 15.124C13.1739 15.1241 13.4538 14.8444 13.4538 14.4991C13.4539 14.154 13.1741 13.8741 12.829 13.874L8.6623 13.8732Z" fill="url(#paint0_linear_502_301)"/>
</g>
<defs>
<filter id="filter0_di_502_301" x="3.70312" y="3.87305" width="16.5857" height="18.2521" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="1"/>
<feGaussianBlur stdDeviation="0.5"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_502_301"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_502_301" result="shape"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="1"/>
<feGaussianBlur stdDeviation="0.5"/>
<feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
<feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.25 0"/>
<feBlend mode="normal" in2="shape" result="effect2_innerShadow_502_301"/>
</filter>
<linearGradient id="paint0_linear_502_301" x1="11.996" y1="3.87305" x2="11.996" y2="20.1252" gradientUnits="userSpaceOnUse">
<stop offset="0.317708" stop-color="#FFFC6B"/>
<stop offset="1" stop-color="#E5E13B"/>
</linearGradient>
</defs>
</svg>
`;

const normalPostSvgString = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <g filter="url(#filter0_di_22136_173416)">
    <path fill-rule="evenodd" clip-rule="evenodd" d="M6.99773 3.87305C5.73207 3.87278 4.70585 4.89858 4.70558 6.16423L4.70313 17.8309C4.70286 19.0965 5.72867 20.1228 6.99432 20.1231L16.9943 20.1252C18.26 20.1254 19.2862 19.0996 19.2865 17.834L19.2889 6.1673C19.2892 4.90163 18.2634 3.8754 16.9977 3.87515L6.99773 3.87305ZM8.66375 7.20694C8.31857 7.20687 8.03869 7.48663 8.03862 7.83181C8.03854 8.17699 8.31831 8.45687 8.66349 8.45694L15.3302 8.45834C15.6753 8.45841 15.9552 8.17865 15.9553 7.83348C15.9554 7.48829 15.6756 7.20841 15.3305 7.20834L8.66375 7.20694ZM8.03797 11.1654C8.03803 10.8201 8.31791 10.5404 8.66309 10.5405L15.3298 10.5419C15.6749 10.5419 15.9547 10.8218 15.9546 11.167C15.9545 11.5121 15.6747 11.7919 15.3295 11.7919L8.66283 11.7905C8.31766 11.7904 8.03789 11.5105 8.03797 11.1654ZM8.6623 13.8732C8.31711 13.8731 8.03724 14.1529 8.03716 14.498C8.03708 14.8432 8.31685 15.1231 8.66204 15.1232L12.8287 15.124C13.1739 15.1241 13.4538 14.8444 13.4538 14.4991C13.4539 14.154 13.1741 13.8741 12.829 13.874L8.6623 13.8732Z" fill="url(#paint0_linear_22136_173416)"/>
  </g>
  <defs>
    <filter id="filter0_di_22136_173416" x="3.70312" y="3.87305" width="16.5859" height="18.252" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
      <feFlood flood-opacity="0" result="BackgroundImageFix"/>
      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
      <feOffset dy="1"/>
      <feGaussianBlur stdDeviation="0.5"/>
      <feComposite in2="hardAlpha" operator="out"/>
      <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
      <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_22136_173416"/>
      <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_22136_173416" result="shape"/>
      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
      <feOffset dy="1"/>
      <feGaussianBlur stdDeviation="0.5"/>
      <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
      <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.25 0"/>
      <feBlend mode="normal" in2="shape" result="effect2_innerShadow_22136_173416"/>
    </filter>
    <linearGradient id="paint0_linear_22136_173416" x1="11.996" y1="3.87305" x2="11.996" y2="20.1252" gradientUnits="userSpaceOnUse">
      <stop offset="0.317708" stop-color="#FFB26B"/>
      <stop offset="1" stop-color="#E58C3B"/>
    </linearGradient>
  </defs>
</svg>`;

const unknownSvgString = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<g id="Frame">
<path id="Vector" d="M5.2666 5.38637C5.2666 2.20453 10.2666 2.20456 10.2666 5.38638C10.2666 7.65908 7.99387 7.20448 7.99387 9.93174" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path id="Vector_2" d="M8 12.6734L8.00667 12.666" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</g>
</svg>
`;

export const getMapPostIconSVG = (
  postCategory: PostCategory,
): FunctionComponent => {
  switch (postCategory) {
    case PostCategory.Audio:
    case PostCategory.MusicAudio:
      return musicPostSvg;
    case PostCategory.Picture:
      return picturePostSvg;
    case PostCategory.Video:
    case PostCategory.VideoNote:
      return videoPostSvg;
    case PostCategory.Article:
      return articlePostSvg;
    case PostCategory.Normal:
      return normalPostSvg;
    default:
      return unknownSvg;
  }
};

export const getMapPostIconSVGString = (postCategory: PostCategory) => {
  switch (postCategory) {
    case PostCategory.Audio:
    case PostCategory.MusicAudio:
      return musicPostSvgString;
    case PostCategory.Picture:
      return picturePostSvgString;
    case PostCategory.Video:
    case PostCategory.VideoNote:
      return videoPostSvgString;
    case PostCategory.Article:
      return articlePostSvgString;
    case PostCategory.Normal:
      return normalPostSvgString;
    default:
      return unknownSvgString;
  }
};

export const getMapPostIconColorRgba = (postCategory: PostCategory) => {
  switch (postCategory) {
    case PostCategory.Audio:
    case PostCategory.MusicAudio:
      return "255,147,147,.40";
    case PostCategory.Picture:
      return "136,147,255,.40";
    case PostCategory.Video:
    case PostCategory.VideoNote:
      return "198,171,255,.40";
    case PostCategory.Article:
      return "255,252,207,.40";
    case PostCategory.Normal:
      return "255,178,107,.40";
    default:
      return "51,51,51,.40";
  }
};

export const getMapPostTextGradientType = (postCategory: PostCategory) => {
  switch (postCategory) {
    case PostCategory.Audio:
    case PostCategory.MusicAudio:
      return "feed-map-music-post";
    case PostCategory.Picture:
      return "feed-map-picture-post";
    case PostCategory.Video:
    case PostCategory.VideoNote:
      return "feed-map-video-post";
    case PostCategory.Article:
      return "feed-map-article-post";
    case PostCategory.Normal:
      return "feed-map-normal-post";
    default:
      return "feed-map-normal-post";
  }
};

export const getMapPostTextGradient = (postCategory: PostCategory) => {
  const gradientProps = {
    colors: ["#FFFFFF", "#AAAAAA"],
    start: { x: 0, y: 1 },
    end: { x: 0, y: 0 },
  };
  switch (postCategory) {
    case PostCategory.Audio:
    case PostCategory.MusicAudio:
      gradientProps.colors = ["#FF9393", "#FF5C5C"];
      break;
    case PostCategory.Picture:
      gradientProps.colors = ["#88DCFF", "#16BBFF"];
      break;
    case PostCategory.Video:
    case PostCategory.VideoNote:
      gradientProps.colors = ["#C6ABFF", "#A57AFF"];
      break;
    case PostCategory.Article:
      gradientProps.colors = ["#FFFC6B", "#E5E13B"];
      break;
    case PostCategory.Normal:
      gradientProps.colors = ["#FFB26B", "#E58C3B"];
      break;
    default:
      gradientProps.colors = ["#FFFFFF", "#AAAAAA"];
      break;
  }
  return gradientProps;
};

export const getMapPostTextGradientString = (postCategory: PostCategory) => {
  switch (postCategory) {
    case PostCategory.Audio:
    case PostCategory.MusicAudio:
      return `180deg, #FF9393 100%, #FF5C5C 100%`;
    case PostCategory.Picture:
      return `180deg, #88DCFF 100%, #16BBFF 100%`;
    case PostCategory.Video:
    case PostCategory.VideoNote:
      return `180deg, #C6ABFF 100%, #A57AFF 100%`;
    case PostCategory.Article:
      return `180deg, #FFFC6B 100%, #E5E13B 100%`;
    case PostCategory.Normal:
      return `180deg, #FFB26B 100%, #E58C3B 100%`;
    default:
      return `180deg, #FFFFFF 100%, #AAAAAA 100%`;
  }
};

const STRING_LOCATION_SEPARATOR = "-";
export const locationToString: (
  location: CustomLatLngExpression,
) => string | undefined = (location: CustomLatLngExpression) => {
  const zodLatLngLiteralParseResult = ZodLatLngLiteral.safeParse(location);
  const zodLatLngTupleParseResult = ZodLatLngTuple.safeParse(location);

  if (zodLatLngLiteralParseResult.success) {
    return `${zodLatLngLiteralParseResult.data.lat}${STRING_LOCATION_SEPARATOR}${zodLatLngLiteralParseResult.data.lng}`;
  }
  if (zodLatLngTupleParseResult.success) {
    return `${zodLatLngTupleParseResult.data[0]}${STRING_LOCATION_SEPARATOR}${zodLatLngTupleParseResult.data[1]}`;
  }
};
export const stringToLocation: (
  locationStr: string,
) => CustomLatLngExpression | undefined = (locationStr: string) => {
  const parts = locationStr.split(STRING_LOCATION_SEPARATOR).map(Number);
  if ((parts.length === 2 || parts.length === 3) && !parts.some(isNaN)) {
    return [parts[0], parts[1]];
  }
};
