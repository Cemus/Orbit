import { Canvas } from "@react-three/fiber";
import { Html, OrbitControls } from "@react-three/drei";
import { useEffect, useState } from "react";
import * as satUtils from "../utils/satelliteUtils";
import { getAllTLEs } from "../utils/tleFetcher";
import type Satellite from "../interfaces/Satellite";

function SatelliteMarker({ satellite }: { satellite: Satellite }) {
  return (
    <mesh position={(satellite.lat, satellite.lon, satellite.alt)}>
      <sphereGeometry args={[0.02, 16, 16]} />
      <meshStandardMaterial color="hotpink" />
      <Html distanceFactor={10} position={[0, 0.05, 0]}>
        <div
          style={{
            color: "white",
            fontSize: "0.5rem",
            background: "#0008",
            padding: "2px 4px",
            borderRadius: "4px",
          }}
        >
          {satellite.name}
        </div>
      </Html>
    </mesh>
  );
}

export default function World() {
  const [satellites, setSatellites] = useState<Satellite[]>([]);

  useEffect(() => {
    async function update() {
      const tles = await getAllTLEs();

      tles.forEach((tle) => {
        const geo = satUtils.getLatLngAlt(tle);

        if (geo) {
          const pos = satUtils.latLngAltToXYZ(
            geo.latitude,
            geo.longitude,
            geo.altitude
          );

          const satellite: Satellite = {
            name: tle[0],
            lat: pos[0],
            lon: pos[1],
            alt: pos[2],
          };
          setSatellites((prevSatellites) => {
            return [...prevSatellites, satellite];
          });
        }
      });
    }
    update();
  }, []);
  return (
    <Canvas camera={{ position: [0, 0, 3] }}>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={1} />

      <mesh>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial color="royalblue" wireframe={false} />
      </mesh>

      {satellites.map((satellite, index) => (
        <SatelliteMarker key={index} satellite={satellite} />
      ))}

      <OrbitControls />
    </Canvas>
  );
}
