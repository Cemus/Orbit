export async function getAllTLEs() {
  const res = await fetch(
    "https://celestrak.org/NORAD/elements/gp.php?GROUP=stations&FORMAT=tle"
  );
  const text = await res.text();

  const lines = text.split("\n");
  const tleList: string[][] = [];

  for (let i = 0; i < lines.length; i += 3) {
    if (lines[i] && lines[i + 1] && lines[i + 2]) {
      tleList.push([lines[i], lines[i + 1], lines[i + 2]]);
    }
  }

  return tleList;
}
