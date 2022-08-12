import React, { useState } from "react";
import { View, Image, TouchableOpacity, ViewStyle } from "react-native";

import secondaryCardSmPNG from "../../assets/cards/secondary-card-sm.png";
import { useHasUserConnectedWallet } from "../hooks/useHasUserConnectedWallet";
import { useAppNavigation } from "../utils/navigation";
import { neutral33 } from "../utils/style/colors";
import {
  headerHeight,
  screenContainerContentMarginH,
} from "../utils/style/layout";
import { BrandText } from "./BrandText";
import { WalletSelector } from "./WalletSelector";
import { WalletsManager } from "./WalletsManager";

// Displayed when no wallet connected. Press to connect wallet
const ConnectWalletButton: React.FC<{
  style?: ViewStyle;
  onPress: () => void;
}> = ({ style, onPress }) => {
  const height = 40;

  return (
    <TouchableOpacity style={style} onPress={onPress}>
      <Image
        source={secondaryCardSmPNG}
        style={{ width: 220, height, resizeMode: "stretch" }}
      />

      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          position: "absolute",
          height,
          width: "100%",
          top: `calc(50% - ${height}px / 2)`,
        }}
      >
        <BrandText
          style={{
            fontSize: 14,
          }}
        >
          Connect wallet
        </BrandText>
      </View>
    </TouchableOpacity>
  );
};

const SvgComponent = (props) => (
  <svg
    width={68}
    height={68}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g clipPath="url(#a)">
      <path
        opacity={0.071}
        d="m61.685 21.252-2.53 33.184a4.034 4.034 0 0 1-3.37 3.674l-30.508 4.985a4.03 4.03 0 0 1-4.175-2.025L4.279 30.706a4.034 4.034 0 0 1 .497-4.615L25.167 2.847a4.03 4.03 0 0 1 4.901-.912l29.468 15.438a4.032 4.032 0 0 1 2.149 3.879Z"
        stroke="url(#b)"
        strokeWidth={0.424}
      />
      <path
        opacity={0.143}
        d="M64.395 32.793 49.107 62.35a4.032 4.032 0 0 1-4.539 2.065L14.54 57.077a4.032 4.032 0 0 1-3.053-3.495L7.86 19.055A4.033 4.033 0 0 1 10.12 15L37.967 1.577a4.032 4.032 0 0 1 4.869 1.075L63.93 28.384a4.032 4.032 0 0 1 .464 4.409Z"
        stroke="url(#c)"
        strokeWidth={0.424}
      />
      <path
        opacity={0.214}
        d="M62.388 44.48 36.773 65.71a4.031 4.031 0 0 1-4.984.127L7.013 47.344a4.034 4.034 0 0 1-1.445-4.41L15.713 9.732a4.03 4.03 0 0 1 3.664-2.848l30.876-1.471a4.033 4.033 0 0 1 4.061 2.893l9.37 31.933a4.032 4.032 0 0 1-1.296 4.24Z"
        stroke="url(#d)"
        strokeWidth={0.424}
      />
      <path
        opacity={0.286}
        d="m55.978 54.448-31.87 9.53a4.03 4.03 0 0 1-4.637-1.831L3.887 35.437a4.035 4.035 0 0 1 .393-4.626L26.584 4.218a4.03 4.03 0 0 1 4.484-1.191l28.998 10.717a4.034 4.034 0 0 1 2.607 4.25l-3.846 33.057a4.032 4.032 0 0 1-2.85 3.397Z"
        stroke="url(#e)"
        strokeWidth={0.424}
      />
      <path
        opacity={0.357}
        d="m46.17 61.117-33.058-3.686a4.03 4.03 0 0 1-3.551-3.497l-3.915-30.68a4.034 4.034 0 0 1 2.17-4.105L38.73 3.389a4.03 4.03 0 0 1 4.594.657l22.508 21.202a4.033 4.033 0 0 1 .74 4.93l-16.45 28.925a4.032 4.032 0 0 1-3.952 2.014Z"
        stroke="url(#f)"
        strokeWidth={0.424}
      />
      <path
        opacity={0.429}
        d="M34.546 63.422 5.556 47.105a4.032 4.032 0 0 1-1.903-4.606l8.378-29.773a4.033 4.033 0 0 1 3.6-2.93l34.611-2.421a4.032 4.032 0 0 1 3.973 2.4l12.44 28.316a4.032 4.032 0 0 1-1.245 4.826L38.972 63.112a4.032 4.032 0 0 1-4.426.31Z"
        stroke="url(#g)"
        strokeWidth={0.424}
      />
      <path
        opacity={0.5}
        d="M22.937 61.002 2.624 34.65a4.033 4.033 0 0 1 .046-4.984l19.34-24.13a4.03 4.03 0 0 1 4.459-1.29l32.805 11.301a4.034 4.034 0 0 1 2.72 3.763l.39 30.927a4.031 4.031 0 0 1-3.03 3.957l-32.223 8.254c-1.56.4-3.21-.168-4.194-1.445Z"
        stroke="url(#h)"
        strokeWidth={0.424}
      />
      <path
        opacity={0.571}
        d="m13.21 54.24-8.406-32.2c-.47-1.8.352-3.689 1.99-4.57L34.02 2.819a4.03 4.03 0 0 1 4.606.555l25.786 23.228a4.034 4.034 0 0 1 1.033 4.526L53.727 59.75a4.03 4.03 0 0 1-4.335 2.459l-32.886-5a4.032 4.032 0 0 1-3.295-2.968Z"
        stroke="url(#i)"
        strokeWidth={0.424}
      />
      <path
        opacity={0.643}
        d="m6.886 44.21 4.836-32.926a4.033 4.033 0 0 1 3.62-3.43l30.78-2.844a4.03 4.03 0 0 1 4.024 2.311L64.81 38.785a4.034 4.034 0 0 1-.817 4.57L42.031 65.117a4.031 4.031 0 0 1-4.953.569L8.758 48.229a4.032 4.032 0 0 1-1.872-4.019Z"
        stroke="url(#j)"
        strokeWidth={0.424}
      />
      <path
        opacity={0.714}
        d="M4.99 32.508 22.3 4.087a4.032 4.032 0 0 1 4.672-1.742l29.444 9.416a4.032 4.032 0 0 1 2.801 3.7l1.211 34.696a4.032 4.032 0 0 1-2.536 3.886L29.176 65.492a4.032 4.032 0 0 1-4.781-1.413L5.143 36.938a4.032 4.032 0 0 1-.155-4.43Z"
        stroke="url(#k)"
        strokeWidth={0.424}
      />
      <path
        opacity={0.786}
        d="M7.815 20.992 34.848 1.6a4.031 4.031 0 0 1 4.98.221L63.256 22a4.034 4.034 0 0 1 1.134 4.501L51.953 58.911a4.03 4.03 0 0 1-3.852 2.586l-30.904-.688a4.033 4.033 0 0 1-3.85-3.17l-7.12-32.508a4.032 4.032 0 0 1 1.588-4.14Z"
        stroke="url(#l)"
        strokeWidth={0.424}
      />
      <path
        opacity={0.857}
        d="m14.907 11.494 32.457-7.282a4.03 4.03 0 0 1 4.497 2.15l13.684 27.733a4.035 4.035 0 0 1-.715 4.587L40.727 63.654a4.03 4.03 0 0 1-4.557.875L7.99 51.814a4.034 4.034 0 0 1-2.305-4.421l6.142-32.708a4.032 4.032 0 0 1 3.08-3.19Z"
        stroke="url(#m)"
        strokeWidth={0.424}
      />
      <path
        opacity={0.929}
        d="m25.151 5.527 32.72 5.985a4.031 4.031 0 0 1 3.3 3.735l1.765 30.88a4.034 4.034 0 0 1-2.45 3.943L28.548 63.633a4.03 4.03 0 0 1-4.537-.975L3.036 39.936a4.033 4.033 0 0 1-.394-4.969L21.068 7.261a4.032 4.032 0 0 1 4.083-1.734Z"
        stroke="url(#n)"
        strokeWidth={0.424}
      />
      <path
        d="m36.908 4.036 27.782 18.3a4.032 4.032 0 0 1 1.578 4.728L55.834 56.18a4.032 4.032 0 0 1-3.796 2.672H17.343a4.032 4.032 0 0 1-3.796-2.672L3.112 27.064a4.032 4.032 0 0 1 1.578-4.727l27.782-18.3a4.032 4.032 0 0 1 4.436 0Z"
        stroke="url(#o)"
        strokeWidth={0.424}
      />
      <path
        d="M51.767 17.68 39.25 10.454a10.5 10.5 0 0 0-10.5 0L16.233 17.68a10.5 10.5 0 0 0-5.25 9.093v14.454a10.5 10.5 0 0 0 5.25 9.093l12.517 7.226a10.5 10.5 0 0 0 10.5 0l12.517-7.226a10.5 10.5 0 0 0 5.25-9.093V26.774a10.5 10.5 0 0 0-5.25-9.094Z"
        fill="#000"
        stroke="url(#p)"
      />
      <g opacity={0.25} fill="#000">
        <path d="M29.648 45.404a.646.646 0 0 1-.216-.424L28.21 31.965h4.354v14.581a.646.646 0 0 1-1.073.484l-1.842-1.626ZM32.563 31.706V29.89l-4.587-.396.209 2.213h4.378ZM32.563 29.63l-4.611-.398-.72-7.668a.646.646 0 0 1 .642-.706h4.043c.357 0 .646.29.646.646v8.126ZM41.073 31.706h3.32a.323.323 0 0 0 .322-.323V29.48c0-.19-.164-.34-.354-.321l-3.082.3-.206 2.248ZM41.017 29.485l-4.593.448v1.773h4.39l.203-2.221Z" />
        <path d="M36.166 29.958v1.748h-12.23a.323.323 0 0 1-.322-.323v-1.908c0-.19.162-.338.35-.322l10.869.93c.02.002.04.002.059 0l1.274-.125ZM37.53 46.986a.646.646 0 0 1-1.106-.453V26.502h4.872l-1.695 18.177a.646.646 0 0 1-.183.393l-1.888 1.914ZM41.32 26.244h-4.896V23.46l5.186-.324-.29 3.108ZM36.424 21.504v1.697l5.21-.325.123-1.312a.646.646 0 0 0-.643-.706H37.07a.646.646 0 0 0-.646.646ZM32.563 26.244v-2.776l-5.18-.255.284 3.03h4.896Z" />
        <path d="M32.821 26.244h13.056a.258.258 0 0 0 .258-.259v-2.869a.258.258 0 0 0-.274-.258l-11.212.712-1.828-.09v2.764ZM27.102 23.199l.31 3.045H22.18a.258.258 0 0 1-.258-.259v-2.77c0-.147.123-.265.27-.258l4.91.242Z" />
      </g>
      <path
        d="M29.593 45.352a.646.646 0 0 1-.215-.423l-1.224-13.016h4.354v14.582a.646.646 0 0 1-1.073.483l-1.842-1.626Z"
        fill="url(#q)"
      />
      <path
        d="M32.508 31.654v-1.817l-4.586-.396.208 2.213h4.378Z"
        fill="url(#r)"
      />
      <path
        d="m32.508 29.578-4.61-.398-.721-7.667a.646.646 0 0 1 .643-.706h4.043c.356 0 .645.289.645.645v8.126Z"
        fill="url(#s)"
      />
      <path
        d="M41.018 31.654h3.32a.323.323 0 0 0 .322-.322v-1.905c0-.19-.164-.34-.354-.32l-3.082.3-.206 2.247Z"
        fill="url(#t)"
      />
      <path
        d="m40.962 29.433-4.592.448v1.773h4.389l.203-2.221Z"
        fill="url(#u)"
      />
      <path
        d="M36.111 29.906v1.748h-12.23a.323.323 0 0 1-.322-.322v-1.909c0-.189.162-.337.35-.321l10.87.93a.32.32 0 0 0 .058-.001l1.274-.125Z"
        fill="url(#v)"
      />
      <path
        d="M37.475 46.935a.646.646 0 0 1-1.105-.454v-20.03h4.871l-1.694 18.176a.646.646 0 0 1-.184.393l-1.888 1.915Z"
        fill="url(#w)"
      />
      <path
        d="M41.266 26.192H36.37v-2.784l5.185-.324-.29 3.108Z"
        fill="url(#x)"
      />
      <path
        d="M36.37 21.452v1.697l5.21-.325.122-1.312a.646.646 0 0 0-.643-.705h-4.044a.646.646 0 0 0-.645.645Z"
        fill="url(#y)"
      />
      <path
        d="M32.508 26.192v-2.776l-5.179-.255.283 3.03h4.896Z"
        fill="url(#z)"
      />
      <path
        d="M32.767 26.192h13.056a.258.258 0 0 0 .258-.258v-2.87a.258.258 0 0 0-.275-.258l-11.212.713-1.827-.09v2.763Z"
        fill="url(#A)"
      />
      <path
        d="m27.047 23.147.31 3.045h-5.232a.258.258 0 0 1-.258-.258v-2.77c0-.148.124-.266.271-.258l4.91.241Z"
        fill="url(#B)"
      />
      <path
        d="m28.134 29.2-.237-.02-.28-2.988h-.005l-.283-3.03h.003l-.155-1.65a.646.646 0 0 1 .643-.705h4.043c.244 0 .457.136.567.337a.643.643 0 0 0-.309-.078h-4.043a.646.646 0 0 0-.642.706l.154 1.648h-.002l.283 3.03h.004l.259 2.75ZM32.767 26.192h.258v-2.504l1.828.09 11.212-.713h.016a.258.258 0 0 0-.275-.259l-3.965.252-.003.025-5.21.325v-.019l-2.034.13-1.827-.09v2.763ZM41.626 21.144a.642.642 0 0 0-.308-.078h-4.044a.646.646 0 0 0-.645.645v1.422l-.26.016v-1.697c0-.356.29-.645.646-.645h4.044c.246 0 .458.137.567.337ZM36.37 26.45h4.871l-.024.259H36.63V46.74c0 .115.027.218.075.307a.634.634 0 0 1-.334-.566V26.451ZM36.111 30.19v-.284l-1.274.125a.32.32 0 0 1-.059 0l-6.856-.59v.004l-4.013-.343a.323.323 0 0 0-.35.321v1.909c0 .158.114.29.264.317a.324.324 0 0 1-.005-.059v-1.908c0-.189.162-.338.35-.322l4.013.344V29.7l6.856.59c.02.002.04.002.059 0l1.015-.1ZM28.154 31.913l1.224 13.015a.646.646 0 0 0 .215.424l.147.13a.646.646 0 0 1-.103-.295l-1.224-13.015h4.095v-.259h-4.354ZM41.042 31.654h.259l.182-1.988 3.082-.3a.324.324 0 0 1 .09.003.323.323 0 0 0-.349-.263l-3.057.299-.08.852-.127 1.397ZM27.072 23.395l-.025-.248-4.909-.241a.258.258 0 0 0-.27.258v2.77c0 .142.115.258.258.258v-2.77c0-.147.124-.265.271-.257l4.675.23Z"
        fill="#fff"
      />
    </g>
    <defs>
      <linearGradient
        id="b"
        x1={24.845}
        y1={16.056}
        x2={44.811}
        y2={52.058}
        gradientUnits="userSpaceOnUse"
      >
        <stop offset={0.167} stopColor="#876CF5" stopOpacity={0} />
        <stop offset={0.521} stopColor="#1FDBFA" stopOpacity={0.6} />
        <stop offset={1} stopColor="#876CF5" stopOpacity={0.36} />
      </linearGradient>
      <linearGradient
        id="c"
        x1={32.513}
        y1={13.609}
        x2={36.818}
        y2={54.556}
        gradientUnits="userSpaceOnUse"
      >
        <stop offset={0.167} stopColor="#876CF5" stopOpacity={0} />
        <stop offset={0.521} stopColor="#1FDBFA" stopOpacity={0.6} />
        <stop offset={1} stopColor="#876CF5" stopOpacity={0.36} />
      </linearGradient>
      <linearGradient
        id="d"
        x1={40.533}
        y1={14.357}
        x2={28.49}
        y2={53.727}
        gradientUnits="userSpaceOnUse"
      >
        <stop offset={0.167} stopColor="#876CF5" stopOpacity={0} />
        <stop offset={0.521} stopColor="#1FDBFA" stopOpacity={0.6} />
        <stop offset={1} stopColor="#876CF5" stopOpacity={0.36} />
      </linearGradient>
      <linearGradient
        id="e"
        x1={47.625}
        y1={18.176}
        x2={21.157}
        y2={49.703}
        gradientUnits="userSpaceOnUse"
      >
        <stop offset={0.167} stopColor="#876CF5" stopOpacity={0} />
        <stop offset={0.521} stopColor="#1FDBFA" stopOpacity={0.6} />
        <stop offset={1} stopColor="#876CF5" stopOpacity={0.36} />
      </linearGradient>
      <linearGradient
        id="f"
        x1={52.648}
        y1={24.463}
        x2={15.974}
        y2={43.141}
        gradientUnits="userSpaceOnUse"
      >
        <stop offset={0.167} stopColor="#876CF5" stopOpacity={0} />
        <stop offset={0.521} stopColor="#1FDBFA" stopOpacity={0.6} />
        <stop offset={1} stopColor="#876CF5" stopOpacity={0.36} />
      </linearGradient>
      <linearGradient
        id="g"
        x1={54.825}
        y1={32.214}
        x2={13.772}
        y2={35.083}
        gradientUnits="userSpaceOnUse"
      >
        <stop offset={0.167} stopColor="#876CF5" stopOpacity={0} />
        <stop offset={0.521} stopColor="#1FDBFA" stopOpacity={0.6} />
        <stop offset={1} stopColor="#876CF5" stopOpacity={0.36} />
      </linearGradient>
      <linearGradient
        id="h"
        x1={53.791}
        y1={40.203}
        x2={14.877}
        y2={26.81}
        gradientUnits="userSpaceOnUse"
      >
        <stop offset={0.167} stopColor="#876CF5" stopOpacity={0} />
        <stop offset={0.521} stopColor="#1FDBFA" stopOpacity={0.6} />
        <stop offset={1} stopColor="#876CF5" stopOpacity={0.36} />
      </linearGradient>
      <linearGradient
        id="i"
        x1={49.735}
        y1={47.154}
        x2={19.139}
        y2={19.619}
        gradientUnits="userSpaceOnUse"
      >
        <stop offset={0.167} stopColor="#876CF5" stopOpacity={0} />
        <stop offset={0.521} stopColor="#1FDBFA" stopOpacity={0.6} />
        <stop offset={1} stopColor="#876CF5" stopOpacity={0.36} />
      </linearGradient>
      <linearGradient
        id="j"
        x1={43.273}
        y1={51.965}
        x2={25.867}
        y2={14.656}
        gradientUnits="userSpaceOnUse"
      >
        <stop offset={0.167} stopColor="#876CF5" stopOpacity={0} />
        <stop offset={0.521} stopColor="#1FDBFA" stopOpacity={0.6} />
        <stop offset={1} stopColor="#876CF5" stopOpacity={0.36} />
      </linearGradient>
      <linearGradient
        id="k"
        x1={35.456}
        y1={53.87}
        x2={34.019}
        y2={12.722}
        gradientUnits="userSpaceOnUse"
      >
        <stop offset={0.167} stopColor="#876CF5" stopOpacity={0} />
        <stop offset={0.521} stopColor="#1FDBFA" stopOpacity={0.6} />
        <stop offset={1} stopColor="#876CF5" stopOpacity={0.36} />
      </linearGradient>
      <linearGradient
        id="l"
        x1={27.517}
        y1={52.566}
        x2={42.277}
        y2={14.133}
        gradientUnits="userSpaceOnUse"
      >
        <stop offset={0.167} stopColor="#876CF5" stopOpacity={0} />
        <stop offset={0.521} stopColor="#1FDBFA" stopOpacity={0.6} />
        <stop offset={1} stopColor="#876CF5" stopOpacity={0.36} />
      </linearGradient>
      <linearGradient
        id="m"
        x1={20.71}
        y1={48.261}
        x2={49.312}
        y2={18.658}
        gradientUnits="userSpaceOnUse"
      >
        <stop offset={0.167} stopColor="#876CF5" stopOpacity={0} />
        <stop offset={0.521} stopColor="#1FDBFA" stopOpacity={0.6} />
        <stop offset={1} stopColor="#876CF5" stopOpacity={0.36} />
      </linearGradient>
      <linearGradient
        id="n"
        x1={16.133}
        y1={41.639}
        x2={54.02}
        y2={25.566}
        gradientUnits="userSpaceOnUse"
      >
        <stop offset={0.167} stopColor="#876CF5" stopOpacity={0} />
        <stop offset={0.521} stopColor="#1FDBFA" stopOpacity={0.6} />
        <stop offset={1} stopColor="#876CF5" stopOpacity={0.36} />
      </linearGradient>
      <linearGradient
        id="o"
        x1={14.504}
        y1={33.753}
        x2={55.656}
        y2={33.753}
        gradientUnits="userSpaceOnUse"
      >
        <stop offset={0.167} stopColor="#876CF5" stopOpacity={0} />
        <stop offset={0.521} stopColor="#1FDBFA" stopOpacity={0.6} />
        <stop offset={1} stopColor="#876CF5" stopOpacity={0.36} />
      </linearGradient>
      <linearGradient
        id="p"
        x1={18.274}
        y1={11.774}
        x2={52.452}
        y2={55.806}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#A73EE7" />
        <stop offset={1} stopColor="#00EBFF" />
      </linearGradient>
      <linearGradient
        id="q"
        x1={21.867}
        y1={33.974}
        x2={46.081}
        y2={33.974}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5433FF" />
        <stop offset={0.5} stopColor="#20BDFF" />
        <stop offset={1} stopColor="#A5FECB" />
      </linearGradient>
      <linearGradient
        id="r"
        x1={21.867}
        y1={33.974}
        x2={46.081}
        y2={33.974}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5433FF" />
        <stop offset={0.5} stopColor="#20BDFF" />
        <stop offset={1} stopColor="#A5FECB" />
      </linearGradient>
      <linearGradient
        id="s"
        x1={21.867}
        y1={33.974}
        x2={46.081}
        y2={33.974}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5433FF" />
        <stop offset={0.5} stopColor="#20BDFF" />
        <stop offset={1} stopColor="#A5FECB" />
      </linearGradient>
      <linearGradient
        id="t"
        x1={21.867}
        y1={33.974}
        x2={46.081}
        y2={33.974}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5433FF" />
        <stop offset={0.5} stopColor="#20BDFF" />
        <stop offset={1} stopColor="#A5FECB" />
      </linearGradient>
      <linearGradient
        id="u"
        x1={21.867}
        y1={33.974}
        x2={46.081}
        y2={33.974}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5433FF" />
        <stop offset={0.5} stopColor="#20BDFF" />
        <stop offset={1} stopColor="#A5FECB" />
      </linearGradient>
      <linearGradient
        id="v"
        x1={21.867}
        y1={33.974}
        x2={46.081}
        y2={33.974}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5433FF" />
        <stop offset={0.5} stopColor="#20BDFF" />
        <stop offset={1} stopColor="#A5FECB" />
      </linearGradient>
      <linearGradient
        id="w"
        x1={21.867}
        y1={33.974}
        x2={46.081}
        y2={33.974}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5433FF" />
        <stop offset={0.5} stopColor="#20BDFF" />
        <stop offset={1} stopColor="#A5FECB" />
      </linearGradient>
      <linearGradient
        id="x"
        x1={21.867}
        y1={33.974}
        x2={46.081}
        y2={33.974}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5433FF" />
        <stop offset={0.5} stopColor="#20BDFF" />
        <stop offset={1} stopColor="#A5FECB" />
      </linearGradient>
      <linearGradient
        id="y"
        x1={21.867}
        y1={33.974}
        x2={46.081}
        y2={33.974}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5433FF" />
        <stop offset={0.5} stopColor="#20BDFF" />
        <stop offset={1} stopColor="#A5FECB" />
      </linearGradient>
      <linearGradient
        id="z"
        x1={21.867}
        y1={33.974}
        x2={46.081}
        y2={33.974}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5433FF" />
        <stop offset={0.5} stopColor="#20BDFF" />
        <stop offset={1} stopColor="#A5FECB" />
      </linearGradient>
      <linearGradient
        id="A"
        x1={21.867}
        y1={33.974}
        x2={46.081}
        y2={33.974}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5433FF" />
        <stop offset={0.5} stopColor="#20BDFF" />
        <stop offset={1} stopColor="#A5FECB" />
      </linearGradient>
      <linearGradient
        id="B"
        x1={21.867}
        y1={33.974}
        x2={46.081}
        y2={33.974}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5433FF" />
        <stop offset={0.5} stopColor="#20BDFF" />
        <stop offset={1} stopColor="#A5FECB" />
      </linearGradient>
      <clipPath id="a">
        <path fill="#fff" d="M0 0h68v68H0z" />
      </clipPath>
    </defs>
  </svg>
);

export const Header: React.FC<{
  style?: ViewStyle;
}> = ({ children, style }) => {
  const [walletsManagerVisible, setWalletsManagerVisible] = useState(false);
  const isAConnectedWallet = useHasUserConnectedWallet();
  const navigation = useAppNavigation();
  const headerMarginH = 22;

  return (
    <View
      style={[
        {
          height: headerHeight,
          maxHeight: headerHeight,
          width: "100%",
          flex: 1,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottomColor: neutral33,
          borderBottomWidth: 1,
        },
        style,
      ]}
    >
      <TouchableOpacity
        onPress={() => navigation.navigate("Home")}
        style={{ marginLeft: headerMarginH }}
      >
        {/*<LogoTopSVG/>*/}
        <SvgComponent />
      </TouchableOpacity>

      <View
        style={{
          width: "100%",
          flex: 1,
          flexDirection: "row",
          alignItems: "center",
          marginLeft: screenContainerContentMarginH,
        }}
      >
        <>{children}</>
      </View>

      {isAConnectedWallet ? (
        <WalletSelector
          style={{ marginRight: headerMarginH }}
          onPressAddWallet={() => navigation.navigate("Wallets")}
        />
      ) : (
        <ConnectWalletButton
          style={{ marginRight: headerMarginH }}
          onPress={() => setWalletsManagerVisible(true)}
        />
      )}

      <WalletsManager
        visible={walletsManagerVisible}
        onClose={() => setWalletsManagerVisible(false)}
      />
    </View>
  );
};
