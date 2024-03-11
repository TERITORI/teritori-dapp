import { LatLng, LeafletView } from "react-native-leaflet-view";
type Tlocation = [number, number];

const MapMobile = ({ locationSelected }: { locationSelected: Tlocation }) => {
  const DEFAULT_COORDINATE: LatLng = {
    lat: locationSelected[0],
    lng: locationSelected[1],
  };

  return (
    <LeafletView
      renderLoading={() => <></>}
      zoom={12}
      mapCenterPosition={DEFAULT_COORDINATE}
      mapLayers={[
        {
          url: `https://{s}.tile.jawg.io/jawg-dark/{z}/{x}/{y}{r}.png?access-token=${process.env.EXPO_PUBLIC_LEAFLET_MAP_TOKEN}`,
        },
      ]}
      mapMarkers={[
        {
          position: DEFAULT_COORDINATE,
          icon: "https://i.ibb.co/gSnJ70P/location.png", //load image from web; not work with local image
          size: [32, 32],
        },
      ]}
    />
  );
};

export default MapMobile;
