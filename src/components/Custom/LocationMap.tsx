// src/components/ChallengeManagement/create/LocationMapPicker.tsx
import React from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const orangeMarkerIcon = L.divIcon({
  className: "", // Removes default white background
  html: `
    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="#f97316" stroke="#000" stroke-width="2">
      <path d="M12 2a8 8 0 0 0-8 8c0 5.4 8 12 8 12s8-6.6 8-12a8 8 0 0 0-8-8z"/>
      <circle cx="12" cy="10" r="3" fill="white"/>
    </svg>
  `,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});

interface LocationMapPickerProps {
  onLocationSelect: (lat: number, lng: number) => void;
  defaultCenter?: [number, number];
  initialPosition?: [number, number] | null;
  height?: string;
  /** If true, map is interactive but clicking does NOT move the pin */
  readOnly?: boolean;
}

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
  defaultCenter = [35.6892, 51.3890],
  initialPosition = null,
  height = "h-50",
  readOnly = false, // Default: editable
}) => {
  const [position, setPosition] = React.useState<[number, number] | null>(initialPosition);

  const handleClick = (lat: number, lng: number) => {
    // Only allow changing position if NOT read-only
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

        {/* Only add click handler in editable mode */}
        {!readOnly && <MapClickHandler onClick={handleClick} />}

        {/* Always show the marker if position exists */}
        {position && <Marker position={position} icon={orangeMarkerIcon} />}
      </MapContainer>
    </div>
  );
};

export default LocationMapPicker;