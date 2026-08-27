"use client";

import { useEffect, useRef } from "react";
import { getSectorColor } from "@/lib/sectors";

interface Props {
  name: string;
  sector: string;
  lat: number;
  lng: number;
}

export default function CompanyLocationMap({ name, sector, lat, lng }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    let map: any = null;

    import("leaflet").then((L) => {
      if (!containerRef.current) return;

      const container = containerRef.current as any;
      if (container._leaflet_id) {
        container._leaflet_id = null;
      }

      delete (L.Icon.Default.prototype as any)._getIconUrl;

      map = L.map(containerRef.current, {
        center: [lat, lng],
        zoom: 12,
        zoomControl: false,
        scrollWheelZoom: false,
        dragging: false,
      });

      L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors © <a href="https://carto.com/attributions">CARTO</a>',
        maxZoom: 19,
      }).addTo(map);

      const color = getSectorColor(sector);

      const icon = L.divIcon({
        className: "",
        html: `<div style="width: 12px; height: 12px; border-radius: 50%; background: ${color}; border: 2px solid white; box-shadow: 0 1px 3px rgba(0,0,0,0.4);"></div>`,
        iconSize: [12, 12],
        iconAnchor: [6, 6],
      });

      L.marker([lat, lng], { icon }).bindTooltip(name, { permanent: false, direction: "top", offset: [0, -8] }).addTo(map);
    });

    return () => {
      if (map) {
        map.remove();
        map = null;
      }
    };
  }, [name, sector, lat, lng]);

  return (
    <>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css" />
      <div ref={containerRef} style={{ height: "160px", width: "100%", borderRadius: "4px" }} />
    </>
  );
}
