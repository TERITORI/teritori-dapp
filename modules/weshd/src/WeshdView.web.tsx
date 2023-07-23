import * as React from "react";

import { WeshdViewProps } from "./Weshd.types";

export default function WeshdView(props: WeshdViewProps) {
  return (
    <div>
      <span>{props.name}</span>
    </div>
  );
}
