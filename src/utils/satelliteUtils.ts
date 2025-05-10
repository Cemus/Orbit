import * as satellite from "satellite.js";

const EARTH_RADIUS = 1;

export function latLngAltToXYZ(lat: number, lon: number, alt: number) {
  const radius = EARTH_RADIUS + alt / 6371;
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);

  const x = radius * Math.sin(phi) * Math.cos(theta);
  const y = radius * Math.cos(phi);
  const z = radius * Math.sin(phi) * Math.sin(theta);

  return [x, y, z];
}

export function getLatLngAlt(tle: string[]) {
  const satrec = satellite.twoline2satrec(tle[1], tle[2]);
  const now = new Date();

  const positionAndVelocity = satellite.propagate(satrec, now);

  if (positionAndVelocity) {
    const gmst = satellite.gstime(now);
    const position = satellite.eciToGeodetic(
      positionAndVelocity.position,
      gmst
    );

    const longitude = satellite.degreesLong(position.longitude);
    const latitude = satellite.degreesLat(position.latitude);
    const altitude = position.height;

    return { latitude, longitude, altitude };
  }
}
