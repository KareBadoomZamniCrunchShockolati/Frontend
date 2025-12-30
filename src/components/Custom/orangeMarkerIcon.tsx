// src/components/Custom/OrangeMarkerIcon.ts
import L from "leaflet";

const orangeMarkerIcon = L.divIcon({
  className: "", // Removes default white background/shadow
  html: `
    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="#f97316" stroke="#000" stroke-width="2">
      <path d="M12 2a8 8 0 0 0-8 8c0 5.4 8 12 8 12s8-6.6 8-12a8 8 0 0 0-8-8z"/>
      <circle cx="12" cy="10" r="3" fill="white"/>
    </svg>
  `,
  iconSize: [40, 40],
  iconAnchor: [20, 40],    // Point of the marker pointing down
  popupAnchor: [0, -40],   // Popup position relative to marker
});

export default orangeMarkerIcon;