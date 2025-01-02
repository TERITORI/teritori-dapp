import { FC } from "react";

import rakkiTicketImage from "@/assets/logos/rakki-ticket.png";
import { OptimizedImage } from "@/components/OptimizedImage";

export const TicketImage: FC = () => {
  return (
    <OptimizedImage
      sourceURI={rakkiTicketImage}
      style={{ width: 457, height: 260 }}
      width={457}
      height={260}
    />
  );
};
