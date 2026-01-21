import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, GeoJSON } from 'react-leaflet';
import "leaflet/dist/leaflet.css";
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import { getMapPinPath } from '../../../../services/gisAlldata';
import { encryptPayload } from '../../../../crypto.js/encryption';

// Fix for default marker icon
let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const createIcon = (color) => {
  return new L.Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
};

const icons = {
  blue: createIcon('blue'),
  gold: createIcon('gold'),
  green: createIcon('green'),
  red: createIcon('red'),
  grey: createIcon('grey')
};

const getIcon = (status) => {
  if (!status) return icons.blue;
  const s = status.toUpperCase();

  if (s === 'ONGOING' || s === 'IN PROGRESS') return icons.gold;
  if (s === 'COMPLETED') return icons.green;
  if (s === 'DELAYED' || s === 'HIGH RISK' || s === 'CANCELED') return icons.red;
  if (s === 'PLANNED') return icons.blue;

  return icons.blue;
};

const RecenterAutomatically = ({ lat, lng }) => {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng]);
  }, [lat, lng, map]);
  return null;
};
const MapSection = ({ data = [], onSelectProject }) => {
  const position = [20.9517, 85.0985];
  const [popupImage, setPopupImage] = useState(null);

  const mapData = data;
  const [geoJsonData, setGeoJsonData] = useState(null);

  useEffect(() => {
    fetch('https://gist.githubusercontent.com/saketkc/9adf9e4bf0859990763e53f4966c4502/raw/bharatviz_LGD_ODISHA_districts.geojson')
      .then(response => response.json())
      .then(data => setGeoJsonData(data))
      .catch(error => console.error("Error fetching GeoJSON:", error));
  }, []);

  // Filter GeoJSON to only show districts present in data
  const districtNames = new Set(data.map(p => p.districtName?.trim().toLowerCase()).filter(Boolean));

  const filteredGeoJson = geoJsonData ? {
    ...geoJsonData,
    features: geoJsonData.features.filter(f =>
      districtNames.has(f.properties.dtname?.toLowerCase()) ||
      districtNames.has(f.properties.district_name?.toLowerCase())
    )
  } : null;

  const handleMarkerClick = async (project) => {
    setPopupImage(null);
    if (onSelectProject) onSelectProject(project);

    const docPath = project?.projectGeoTagResponseDto?.allGeoTagDocument?.[0]?.documentPath;

    if (docPath) {
      try {
        const payload = { path: docPath };
        const encrypted = encryptPayload(payload);
        const res = await getMapPinPath(encrypted);

        if (res?.data?.outcome) {
          let imgData = res.data.data;
          // Check if data URI scheme is present, if not add it (assuming jpeg/png based on common responses, user mentioned /9j so likely jpeg)
          if (!imgData.startsWith('data:image')) {
            imgData = `data:image/jpeg;base64,${imgData}`;
          }
          setPopupImage(imgData);
        }
      } catch (error) {
        console.error("Error fetching map pin image:", error);
      }
    }
  };

  return (
    <div className="bg-white p-2 rounded-lg shadow border border-gray-100 h-[500px] relative z-0">


      <MapContainer center={position} zoom={7} scrollWheelZoom={true} style={{ height: "100%", width: "100%", borderRadius: "8px" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <RecenterAutomatically lat={position[0]} lng={position[1]} />

        {filteredGeoJson && filteredGeoJson.features.length > 0 && (
          <GeoJSON
            key={JSON.stringify(Array.from(districtNames))}
            data={filteredGeoJson}
            style={{
              color: '#1e40af', // Dark Blue
              weight: 2,
              fillColor: '#86efac', // Light Green
              fillOpacity: 0.2
            }}
          />
        )}

        {mapData.map((project, index) => {
          const lat = project.projectGeoTagResponseDto?.firstLatitude;
          const lng = project.projectGeoTagResponseDto?.firstLongitude;
          const status = project.projectStatus || project.status;

          return (lat && lng) ? (
            <Marker
              key={index}
              position={[parseFloat(lat), parseFloat(lng)]}
              icon={getIcon(status)}
              eventHandlers={{
                click: () => handleMarkerClick(project),
              }}
            >
              <Popup>
                <div className="p-1 min-w-[200px] min-h-[150px] flex items-center justify-center">
                  {popupImage ? (
                    <img src={popupImage} alt="Project Location" className="w-full h-auto max-h-[200px] object-cover rounded-md" />
                  ) : (
                    <p className="text-gray-500 text-xs">Loading image...</p>
                  )}
                </div>
              </Popup>
            </Marker>
          ) : null;
        })}
      </MapContainer>

      {/* Floating Legend for "Image Type Design" */}
      <div className="absolute top-4 right-4 bg-white p-3 rounded-md shadow-lg z-[400] text-xs space-y-2 border border-blue-100 hidden md:block">
        <h4 className="font-bold text-gray-700 mb-1">Status Legend</h4>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-blue-500 block"></span> <span>Planned</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-yellow-500 block"></span> <span>In Progress</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-green-500 block"></span> <span>Completed</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-500 block"></span> <span>High Risk</span>
        </div>
      </div>
    </div>
  );
};

export default MapSection;