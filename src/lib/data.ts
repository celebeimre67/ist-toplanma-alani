export interface GatheringPoint {
  id: string;
  ilce: string;
  mahalle: string;
  sokak: string;
  alanAdi: string;
  tip: string;
  lat: number | null;
  lng: number | null;
  kapasite: string;
  rawAddress: string;
}

const CACHE_PREFIX = 'geocache_';

function extractCoords(val: string): number | null {
  if (!val) return null;
  const digits = val.replace(/\D/g, '');
  if (digits.length < 2) return null;
  
  const firstTwo = digits.substring(0, 2);
  const rest = digits.substring(2);
  
  if (firstTwo === '41' || firstTwo === '28' || firstTwo === '29') {
     return parseFloat(`${firstTwo}.${rest}`);
  }
  if (digits.startsWith('41')) {
     return parseFloat(`41.${digits.substring(2)}`);
  }
  if (digits.startsWith('28') || digits.startsWith('29')) {
      return parseFloat(`${digits.substring(0, 2)}.${digits.substring(2)}`);
  }
  return null;
}

// simple sleep function
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function geocode(address: string): Promise<{ lat: number, lng: number } | null> {
  const cached = localStorage.getItem(CACHE_PREFIX + address);
  if (cached) {
    try {
      const parsed = JSON.parse(cached);
      if (parsed.lat && parsed.lng) return parsed;
    } catch (e) {
      // ignore
    }
  }

  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`;
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'IstanbulGatheringMapApp/1.0'
      }
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (data && data.length > 0) {
      const coords = { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
      localStorage.setItem(CACHE_PREFIX + address, JSON.stringify(coords));
      return coords;
    }
  } catch (error) {
    console.error("Geocoding failed for", address, error);
  }
  return null;
}

export async function fetchAndProcessData(): Promise<GatheringPoint[]> {
  const csvUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ4_PxwLzCR6RiaETujwtmFjIdGJdaIDORh2JSrevQN4iU2YtM3xnUvmYdYxOF9U88CWgpBQU9n2PM9/pub?gid=1984947279&single=true&output=csv";
  
  const res = await fetch(csvUrl);
  const csvText = await res.text();
  
  // Dynamic Papaparse import
  const Papa = (await import('papaparse')).default;
  
  const parsed = Papa.parse<any>(csvText, { header: true, skipEmptyLines: true });
  
  const points: GatheringPoint[] = [];

  for (let i = 0; i < parsed.data.length; i++) {
    const row = parsed.data[i];
    
    // Find keys to make it robust
    const keys = Object.keys(row);
    const getVal = (search: string) => {
      const key = keys.find(k => k.toLowerCase().includes(search));
      return key ? (row[key] || "") : "";
    };

    const ilce = getVal('ilçe');
    const mahalle = getVal('mahalle');
    const sokak = getVal('sokak');
    const alanAdi = getVal('alan adı');
    const tip = getVal('tip');
    const latStr = getVal('enlem');
    const lngStr = getVal('boylam');
    const kapasite = getVal('kapasite');
    
    let lat = extractCoords(latStr);
    let lng = extractCoords(lngStr);

    const rawAddress = `İstanbul, ${ilce}, ${mahalle}, ${sokak ? sokak + ' Sokak/Caddesi, ' : ''}${alanAdi}`.replace(/,\s*,/g, ',').trim();
    
    points.push({
      id: `pt_${i}`,
      ilce,
      mahalle,
      sokak,
      alanAdi,
      tip,
      lat,
      lng,
      kapasite,
      rawAddress
    });
  }

  // Geocode missing coordinates sequentially to respect nominatim rate limits
  for (const pt of points) {
    if (!pt.lat || !pt.lng) {
      if (pt.alanAdi) {
         // Query: District, Neighborhood, Place Name
         const query = `İstanbul ${pt.ilce} ${pt.mahalle} ${pt.alanAdi}`.replace(/\s+/g, ' ');
         const coords = await geocode(query);
         if (coords) {
           pt.lat = coords.lat;
           pt.lng = coords.lng;
         }
         // Rate limiting delay
         await sleep(1100);
      }
    }
  }

  // filter out perfectly failing ones softly
  return points.filter(p => p.lat !== null && p.lng !== null);
}
