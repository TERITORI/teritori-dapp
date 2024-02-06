import "./styles.css";
import "leaflet/dist/leaflet.css";
import { Icon } from "leaflet";
import { MapContainer, TileLayer, Marker } from "react-leaflet";

type Tlocation = [number, number];

const MapWeb = ({ locationSelected }: { locationSelected: Tlocation }) => {
  const customIcon = new Icon({
    iconUrl: require("./location.png"),
    iconSize: [38, 38],
  });

  return (
    <MapContainer
      key={locationSelected.toString()}
      center={locationSelected}
      zoom={12}
      attributionControl={false}
    >
      <TileLayer url="https://{s}.tile.jawg.io/jawg-dark/{z}/{x}/{y}{r}.png?access-token=QkwJFLzzxPan25YCgnDExGpMFPxA3x4lnyKiUf8zmaqXLP5XyOR8n3yEM8jlKV3W" />
      <Marker position={locationSelected} icon={customIcon} />
    </MapContainer>
  );
};

export default MapWeb;
