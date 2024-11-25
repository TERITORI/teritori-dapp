import { Map } from "leaflet";
import { Dispatch, SetStateAction, useEffect } from "react";

import { MAP_HALF_BOUND } from "@/utils/feed/map";

export const useUpdateMinZoom = (
  map: Map,
  setMinZoom: Dispatch<SetStateAction<number>>,
) => {
  useEffect(() => {
    const updateMinZoom = () => {
      if (map) {
        const calculatedZoom = map.getBoundsZoom(MAP_HALF_BOUND, false);
        setMinZoom(calculatedZoom);
        map.setMinZoom(calculatedZoom);
        map.setZoom(calculatedZoom);
      }
    };

    updateMinZoom();

    window.addEventListener("resize", updateMinZoom);

    return () => {
      window.removeEventListener("resize", updateMinZoom);
    };
  }, [map, setMinZoom]);
};
