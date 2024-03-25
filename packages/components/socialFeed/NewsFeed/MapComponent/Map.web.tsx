import "./styles.css";
import "leaflet/dist/leaflet.css";
import { Icon } from "leaflet";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import { LatLng } from "react-native-leaflet-view";

const MapWeb = ({ locationSelected }: { locationSelected: LatLng }) => {
  const customIcon = new Icon({
    iconUrl: "https://i.ibb.co/gSnJ70P/location.png", //load image from web; not work with local image
    iconSize: [32, 32],
  });

  return (
    <MapContainer
      key={locationSelected.toString()}
      center={locationSelected}
      zoom={12}
      attributionControl={false}
    >
      <TileLayer
        url={`https://{s}.tile.jawg.io/jawg-dark/{z}/{x}/{y}{r}.png?access-token=${process.env.EXPO_PUBLIC_LEAFLET_MAP_TOKEN}`}
      />
      <Marker position={locationSelected} icon={customIcon} />
    </MapContainer>
  );
};

export default MapWeb;
