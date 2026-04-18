"use client";

import Map, { Marker, NavigationControl } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";

interface PropertyMapProps {
  lat: number;
  lng: number;
  city: string;
  province: string;
}

export default function PropertyMap({ lat, lng, city, province }: PropertyMapProps) {
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  if (!token) {
    return (
      <div className="h-72 w-full rounded-lg bg-gray-100 flex items-center justify-center">
        <p className="text-gray-500 text-sm">Mapa non dispoñible</p>
      </div>
    );
  }

  return (
    <div className="h-72 w-full rounded-lg overflow-hidden">
      <Map
        initialViewState={{ longitude: lng, latitude: lat, zoom: 12 }}
        style={{ width: "100%", height: "100%" }}
        mapStyle="mapbox://styles/mapbox/outdoors-v12"
        mapboxAccessToken={token}
        attributionControl={false}
      >
        <NavigationControl position="top-right" showCompass={false} />
        <Marker longitude={lng} latitude={lat} anchor="bottom">
          <div
            className="text-3xl cursor-default select-none"
            title={`${city}, ${province}`}
            role="img"
            aria-label={`Ubicación: ${city}, ${province}`}
          >
            📍
          </div>
        </Marker>
      </Map>
    </div>
  );
}
