// src/components/ChallengeManagement/create/LocationMapPicker.tsx
import React from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { LocationMapPickerProps } from "@/types/challengeCreateTypes";
import orangeMarkerIcon from "./orangeMarkerIcon";

function MapClickHandler({ onClick }: { onClick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      const lat = Number(e.latlng.lat.toFixed(6));
      const lng = Number(e.latlng.lng.toFixed(6));
      onClick(lat, lng);
    },
  });
  return null;
}

const LocationMapPicker: React.FC<LocationMapPickerProps> = ({
  onLocationSelect,
  defaultCenter = [35.6892, 51.3890], // Tehran
  initialPosition = null,
  height = "h-50",
  readOnly = false,
}) => {
  const [position, setPosition] = React.useState<[number, number] | null>(initialPosition);

  const handleClick = (lat: number, lng: number) => {
    if (!readOnly) {
      setPosition([lat, lng]);
      onLocationSelect(lat, lng);
    }
  };

  const mapCenter: [number, number] = position ?? defaultCenter;

  return (
    <div className={`${height} w-full rounded-primary-radius overflow-hidden border-2 border-black`}>
      <MapContainer
        center={mapCenter}
        zoom={13}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Click handler only in editable mode */}
        {!readOnly && <MapClickHandler onClick={handleClick} />}

        {/* Show marker if position is set */}
        {position && <Marker position={position} icon={orangeMarkerIcon} />}
      </MapContainer>
    </div>
  );
};

export default LocationMapPicker;