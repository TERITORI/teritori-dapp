import { requireNativeViewManager } from 'expo-modules-core';
import * as React from 'react';

import { WeshdViewProps } from './Weshd.types';

const NativeView: React.ComponentType<WeshdViewProps> =
  requireNativeViewManager('Weshd');

export default function WeshdView(props: WeshdViewProps) {
  return <NativeView {...props} />;
}
