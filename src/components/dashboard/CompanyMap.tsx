"use client";

import { useEffect, useRef } from "react";
import type { Company } from "@/types";

interface Props {
  companies: Company[];
}

const SECTOR_COLORS: Record<string, string> = {
  "Solar & Storage": "#BA7517",
  "Grid Software": "#185FA5",
  "Geothermal": "#0F6E56",
  "Home Electrification": "#3B6D11",
  "Hydrogen": "#534AB7",
  "Industrial Decarb": "#993C1D",
  "EV & Transportation": "#993556",
  "Carbon Removal": "#888780",
  "Fusion": "#A32D2D",
  "Research / Policy": "#444441",
};

export default function CompanyMap({ companies }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    let map: any = null;

    import("leaflet").then((L) => {
      if (!containerRef.current) return;

      // If Leaflet already initialized this container, destroy it first
      const container = containerRef.current as any;
      if (container._leaflet_id) {
        container._leaflet_id = null;
      }

      delete (L.Icon.Default.prototype as any)._getIconUrl;

      map = L.map(containerRef.current, {
        center: [40.1, -105.4],
        zoom: 8,
        zoomControl: true,
        scrollWheelZoom: false,
      });

      L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors © <a href="https://carto.com/attributions">CARTO</a>',
        maxZoom: 19,
      }).addTo(map);

      companies.forEach((company) => {
        if (!company.lat || !company.lng) return;

        const color = SECTOR_COLORS[company.sector] || "#888780";

        const icon = L.divIcon({
          className: "",
          html: `<div style="
            width: 9px;
            height: 9px;
            border-radius: 50%;
            background: ${color};
            opacity: 0.85;
            cursor: pointer;
            transition: transform 0.1s;
          " onmouseover="this.style.transform='scale(1.6)';this.style.opacity='1'" onmouseout="this.style.transform='scale(1)';this.style.opacity='0.85'"></div>`,
          iconSize: [9, 9],
          iconAnchor: [4, 4],
        });

        const marker = L.marker([company.lat, company.lng], { icon });

        marker.bindTooltip(company.name, {
          permanent: false,
          direction: "top",
          offset: [0, -6],
          className: "cc-map-tooltip",
        });

        marker.on("click", () => {
          window.location.href = `/companies?company=${encodeURIComponent(company.name)}`;
        });

        marker.addTo(map);
      });
    });

    return () => {
      if (map) {
        map.remove();
        map = null;
      }
    };
  }, [companies]);

  return (
    <>
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css"
      />
      <style>{`
        .cc-map-tooltip {
          background: #111;
          border: none;
          border-radius: 3px;
          color: white;
          font-family: system-ui, sans-serif;
          font-size: 11px;
          font-weight: 600;
          padding: 3px 7px;
          box-shadow: 0 2px 6px rgba(0,0,0,0.25);
          white-space: nowrap;
        }
        .cc-map-tooltip::before {
          border-top-color: #111 !important;
        }
      `}</style>
      <div
        ref={containerRef}
        style={{ height: "280px", width: "100%", borderRadius: "4px" }}
      />
    </>
  );
}
